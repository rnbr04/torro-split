package FutureGadgetLab.demo.Services;

import FutureGadgetLab.demo.Repository.FileChunkRepository;
import FutureGadgetLab.demo.Repository.FileMetadataRepository;
import FutureGadgetLab.demo.models.FileChunk;
import FutureGadgetLab.demo.models.FileMetadata;
import jakarta.annotation.PreDestroy;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.*;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;
import java.util.HexFormat;
import java.security.MessageDigest;


    @Service
    @Slf4j
    @RequiredArgsConstructor
    @Transactional
    public class FileService {
        private static final int CHUNK_SIZE = 1024 * 1024; // 1MB chunks
        private static final int REPLICATION_FACTOR = 3;
        private static final int UDP_PORT = 8080;
        private static final int TCP_PORT = 9090;

        // Thread pools for concurrent operations
        private final ExecutorService outerPool = Executors.newFixedThreadPool(10);
        private final ExecutorService innerPool = Executors.newFixedThreadPool(20);

        private final NodeService nodeService;
        private final FileMetadataRepository metadataRepository;

        @Autowired
        private FileMetaDataService fileMetaDataService;
        @Autowired
        private FileChunkRepository fileChunkRepository;

        @PreDestroy
        public void cleanup() {
            outerPool.shutdown();
            innerPool.shutdown();
        }
        @Transactional
        public String uploadFile(MultipartFile file, String userName) throws IOException {
            String fileId = UUID.randomUUID().toString();
            String transferId = UUID.randomUUID().toString();
            List<CompletableFuture<FileChunk>> chunkFutures = new ArrayList<>();

            try (InputStream inputStream = file.getInputStream()) {
                byte[] buffer = new byte[CHUNK_SIZE];
                int chunkId = 0;
                int bytesRead;

                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    byte[] chunkData = Arrays.copyOf(buffer, bytesRead);
                    final int currentChunkId = chunkId;

                    CompletableFuture<FileChunk> chunkFuture = CompletableFuture.supplyAsync(
                            () -> {
                                try {
                                    return processChunk(currentChunkId, chunkData,fileId,transferId);
                                } catch (IOException e) {
                                    throw new CompletionException(e);
                                }
                            },
                            outerPool
                    );

                    chunkFutures.add(chunkFuture);
                    chunkId++;
                }
            }

            List<FileChunk> chunks = chunkFutures.stream()
                    .map(CompletableFuture::join)
                    .peek(chunk -> {
                        chunk.setFileId(fileId);  // Explicitly set fileId
                    })
                    .collect(Collectors.toList());
            // chunk save karo (circular dependecy issue solved)
            chunks = chunks.stream()
                    .map(fileChunkRepository::save)
                    .collect(Collectors.toList());

            FileMetadata metadata = FileMetadata.builder()
                    .fileId(fileId)
                    .fileName(file.getOriginalFilename())
                    .originalFileName(file.getOriginalFilename())
                    .fileSize(file.getSize())
                    .contentType(file.getContentType())
                    .uploadedDate(new Date())
                    .uploadedBy(userName)
                    .chunks(chunks)
                    .totalChunks(chunks.size())
                    .transferId(transferId)
                    .build();


            // Saved metadata
            fileMetaDataService.save(metadata);

            return fileId;
        }



        private FileChunk processChunk(int chunkId, byte[] chunkData, String fileId, String transferId) throws IOException {
            String hash = hashChunk(chunkData);
            List<String> activeNodes = getActiveNodes();
            String uniqueId = UUID.randomUUID().toString();

            List<CompletableFuture<Void>> nodeFutures = activeNodes.stream()
                    .map(node -> CompletableFuture.runAsync(
                            () -> {
                                try {

                                    transferChunkToNode(node, chunkId, chunkData, hash, fileId, transferId);
                                } catch (Exception e) {
                                    log.error("Chunk Transfer Failure: ChunkID={}, FileID={}, Node={}, Error={}",
                                            chunkId, fileId, node, e.getMessage());
                                    throw new CompletionException(e);
                                }
                            },
                            innerPool
                    ))
                    .collect(Collectors.toList());

            try {
                CompletableFuture.allOf(nodeFutures.toArray(new CompletableFuture[0]))
                        .orTimeout(10, TimeUnit.SECONDS)
                        .join();
            } catch (CompletionException e) {
                log.error("Chunk Transfer Batch Failed: FileID={}, ChunkID={}", fileId, chunkId, e);
                throw new IOException("Failed to transfer chunk to all nodes", e);
            }


            return new FileChunk(null,null,chunkId, fileId, hash, chunkData.length, activeNodes);
        }

        private List<String> getActiveNodes() {
            List<String> activeNodes = new ArrayList<>();
            Set<String> triedNodes = new HashSet<>();

            while (activeNodes.size() < REPLICATION_FACTOR) {
                List<String> candidates = nodeService.getRandomNodes(REPLICATION_FACTOR * 2)
                        .stream()
                        .filter(node -> !triedNodes.contains(node))
                        .collect(Collectors.toList());

                if (candidates.isEmpty()) {
                    throw new RuntimeException("Not enough active nodes available");
                }

                for (String node : candidates) {
                    triedNodes.add(node);
                    if (isNodeAlive(node)) {
                        activeNodes.add(node);
                        if (activeNodes.size() == REPLICATION_FACTOR) {
                            break;
                        }
                    }
                }
            }

            return activeNodes;
        }

        private boolean isNodeAlive(String nodeUdpAddress) {
            String host = nodeUdpAddress.split(":")[0];
            int port = Integer.parseInt(nodeUdpAddress.split(":")[1]);

            try (DatagramSocket socket = new DatagramSocket()) {
                socket.setSoTimeout(1000);
                InetAddress address = InetAddress.getByName(host);

                //  ping
                byte[] pingData = "PING".getBytes();
                DatagramPacket pingPacket = new DatagramPacket(
                        pingData, pingData.length, address, port);
                socket.send(pingPacket);

                // pong
                byte[] pongBuffer = new byte[4];
                DatagramPacket pongPacket = new DatagramPacket(pongBuffer, pongBuffer.length);
                socket.receive(pongPacket);

                return "PONG".equals(new String(pongPacket.getData()).trim());
            } catch (Exception e) {
                log.debug("Node {} is not alive: {}", nodeUdpAddress, e.getMessage());
                return false;
            }
        }

        private void transferChunkToNode(
                String nodeUdpAddress,
                int chunkId,
                byte[] chunkData,
                String hash,
                String fileId,
                String transferId
        ) throws IOException {
            String nodeTcpAddress = nodeService.getTcpAddress(nodeUdpAddress);
            String host = nodeTcpAddress.split(":")[0];
            int port = Integer.parseInt(nodeTcpAddress.split(":")[1]);

            try (Socket socket = new Socket()) {
                socket.connect(new InetSocketAddress(host, port), 5000);
                socket.setSoTimeout(5000);

                try (DataOutputStream out = new DataOutputStream(socket.getOutputStream());
                     DataInputStream in = new DataInputStream(socket.getInputStream())) {
                    out.writeByte(0);
                    out.writeInt(chunkId);
                    out.writeUTF(fileId);
                    out.writeUTF(hash);
                    out.writeInt(chunkData.length);
                    out.writeUTF(transferId);

                    out.write(chunkData);
                    out.flush();

                    int response = in.readInt();
                    handleNodeResponse(response, fileId, chunkId, hash, nodeUdpAddress);
                }
            }
        }

        private void handleNodeResponse(
                int response,
                String fileId,
                int chunkId,
                String hash,
                String nodeAddress
        ) throws IOException {
            switch (response) {
                case 1:
                    log.info("Chunk Transfer Success: FileID={}, ChunkID={}, Node={}",
                            fileId, chunkId, nodeAddress);
                    break;
                case 0:
                    log.warn("Chunk Transfer Failed: FileID={}, ChunkID={}, Hash={}, Node={}",
                            fileId, chunkId, hash, nodeAddress);
                    throw new IOException("Chunk transfer unsuccessful");
                default:
                    log.error("Unexpected Node Response: Response={}, FileID={}, ChunkID={}",
                            response, fileId, chunkId);
                    throw new IOException("Unexpected node response: " + response);
            }
        }
        private String hashChunk(byte[] data) {
            try {
                MessageDigest digest = MessageDigest.getInstance("SHA-256");
                byte[] hash = digest.digest(data);
                return HexFormat.of().formatHex(hash);
            } catch (NoSuchAlgorithmException e) {
                throw new RuntimeException("Failed to hash chunk", e);
            }

        }
        @Transactional
        public byte[] downloadFile(String fileId) throws IOException {
            FileMetadata metadata = metadataRepository.findByFileId(fileId);
            byte[] fileData = new byte[(int) metadata.getFileSize()];

            List<FileChunk> sortedChunks = metadata.getChunks().stream()
                    .sorted(Comparator.comparingInt(FileChunk::getChunkId))
                    .collect(Collectors.toList());

            CountDownLatch latch = new CountDownLatch(sortedChunks.size());

            for (FileChunk chunk : sortedChunks) {
                outerPool.submit(() -> {
                    try {
                        byte[] chunkData = downloadChunk(chunk);
                        synchronized (fileData) {
                            System.arraycopy(chunkData, 0, fileData,
                                    chunk.getChunkId() * CHUNK_SIZE, chunk.getSize());
                        }
                    } catch (Exception e) {
                        log.error("Chunk download failed", e);
                    } finally {
                        latch.countDown();
                    }
                });
            }

            try {
                latch.await(30, TimeUnit.SECONDS);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new IOException("File download interrupted");
            }

            return fileData;
        }
        @Transactional
        private byte[] downloadChunk(FileChunk chunk) throws IOException {
            List<String> nodes = chunk.getNodes();
            if (nodes == null || nodes.isEmpty()) {
                log.error("No nodes available for chunk {}", chunk.getChunkId());
                throw new IOException("No nodes available for chunk " + chunk.getChunkId());
            }
            Collections.shuffle(nodes);

            List<CompletableFuture<byte[]>> nodeFutures = nodes.stream()
                    .map(node -> CompletableFuture.supplyAsync(
                            () -> {
                                try {
                                    if (isNodeAlive(node)) {
                                        return downloadChunkFromNode(node, chunk);
                                    }
                                } catch (Exception e) {
                                    log.debug("Failed to download chunk {} from node {}: {}",
                                            chunk.getChunkId(), node, e.getMessage());
                                }
                                return null;
                            },
                            innerPool
                    ))
                    .collect(Collectors.toList());

            for (CompletableFuture<byte[]> future : nodeFutures) {
                try {
                    byte[] result = future.get(15, TimeUnit.SECONDS);
                    if (result != null) {
                        return result;
                    }
                } catch (Exception e) {
                    // Continue to next node
                    log.debug("Node download attempt failed: {}", e.getMessage());
                }
            }

            throw new IOException("Failed to download chunk " + chunk.getChunkId());
        }

        private byte[] downloadChunkFromNode(String udpnode, FileChunk chunk) throws IOException {
            String node=nodeService.getTcpAddress(udpnode);
            String[] nodeParts = node.split(":");
            String host = nodeParts[0];
            int port = Integer.parseInt(nodeParts[1]);

            try (Socket socket = new Socket()) {
                socket.connect(new InetSocketAddress(host, port), 5000);
                socket.setSoTimeout(5000);

                try (DataOutputStream out = new DataOutputStream(socket.getOutputStream());
                     DataInputStream in = new DataInputStream(socket.getInputStream())) {

                    // flag(see go server code)
                    out.writeByte(1);

                    // Request chunk
                    out.writeInt(chunk.getChunkId());
                    out.writeUTF(chunk.getFileId());
                    out.writeUTF(chunk.getHash());


                    int size = in.readInt();
                    if (size != chunk.getSize()) {
                        throw new IOException("Unexpected chunk size");
                    }

                    byte[] data = new byte[size];
                    in.readFully(data);

                    // Verify
                    String actualHash = hashChunk(data);
                    if (!actualHash.equals(chunk.getHash())) {
                        throw new IOException("Chunk hash mismatch");
                    }

                    return data;
                }
            }
        }


        public List<FileMetadata> getAllFiles(){
            return metadataRepository.findAll();
        }
    }