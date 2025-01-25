package main

import (
    "crypto/sha256"
    "database/sql"
    "encoding/binary"
    "encoding/hex"
    "flag"
    "fmt"
    "io"
    "log"
    "net"
    "os"
    "path/filepath"
    "sync"
    "time"

    _ "github.com/mattn/go-sqlite3"
)

var (
    udpPort = flag.Int("udp-port", 8081, "UDP port to listen on")
    tcpPort = flag.Int("tcp-port", 9091, "TCP port to listen on")
    chunkDir = flag.String("chunk-dir", "./chunks", "Directory to store file chunks")
    maxChunkSize = flag.Int("max-chunk-size", 1024*1024, "Maximum chunk size in bytes")
)

type ChunkServer struct {
    db           *sql.DB
    chunkMutex   sync.RWMutex
    activeWrites map[string]bool
}

func NewChunkServer() (*ChunkServer, error) {
    if err := os.MkdirAll(*chunkDir, 0755); err != nil {
        return nil, fmt.Errorf("failed to create chunks directory: %v", err)
    }

    db, err := sql.Open("sqlite3", "./node_metadata.db")
    if err != nil {
        return nil, err
    }

    _, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS file_chunks (
            chunk_id INTEGER,
            file_id TEXT,
            transfer_id TEXT,
            hash TEXT,
            size INTEGER,
            storage_path TEXT,
            PRIMARY KEY (file_id, chunk_id)
        )
    `)
    if err != nil {
        return nil, err
    }

    return &ChunkServer{
        db:           db,
        activeWrites: make(map[string]bool),
    }, nil
}

func main() {
    flag.Parse()

    server, err := NewChunkServer()
    if err != nil {
        log.Fatalf("Failed to initialize server: %v", err)
    }
    defer server.db.Close()

    go server.startUDPListener()
    server.startTCPListener()
}

func (s *ChunkServer) startUDPListener() {
    addr := net.UDPAddr{
        IP:   net.ParseIP("0.0.0.0"),
        Port: *udpPort,
    }
    conn, err := net.ListenUDP("udp", &addr)
    if err != nil {
        log.Fatalf("Failed to start UDP listener: %v", err)
    }
    defer conn.Close()

    log.Printf("UDP listener started on port %d", *udpPort)
    buffer := make([]byte, 64)
    for {
        n, remoteAddr, err := conn.ReadFromUDP(buffer)
        if err != nil {
            log.Printf("UDP read error: %v", err)
            continue
        }
        if string(buffer[:n]) == "PING" {
            conn.WriteToUDP([]byte("PONG"), remoteAddr)
        }
    }
}

func (s *ChunkServer) startTCPListener() {
    addr := fmt.Sprintf("0.0.0.0:%d", *tcpPort)
    listener, err := net.Listen("tcp", addr)
    if err != nil {
        log.Fatalf("Failed to start TCP listener: %v", err)
    }
    defer listener.Close()

    log.Printf("TCP listener started on port %d", *tcpPort)
    for {
        conn, err := listener.Accept()
        if err != nil {
            log.Printf("TCP accept error: %v", err)
            continue
        }
        go s.handleConnection(conn)
    }
}

func (s *ChunkServer) handleConnection(conn net.Conn) {
    defer conn.Close()

    // Read operation flag
    var op int8
    if err := binary.Read(conn, binary.BigEndian, &op); err != nil {
        log.Printf("Error reading operation flag: %v", err)
        return
    }

    switch op {
    case 0: // Transfer
        s.handleChunkTransfer(conn)
    case 1: // Download
        s.handleChunkDownload(conn)
    default:
        log.Printf("Unknown operation: %d", op)
    }
}

func (s *ChunkServer) handleChunkTransfer(conn net.Conn) {
    defer conn.Close()

    // Read chunk ID
    var chunkID int32
    if err := binary.Read(conn, binary.BigEndian, &chunkID); err != nil {
        log.Printf("Error reading chunk ID: %v", err)
        return
    }

    // Read file ID
    fileID, err := readUTF(conn)
    if err != nil {
        log.Printf("Error reading file ID: %v", err)
        return
    }

    // Read hash
    hash, err := readUTF(conn)
    if err != nil {
        log.Printf("Error reading hash: %v", err)
        return
    }

    // Read size
    var size int32
    if err := binary.Read(conn, binary.BigEndian, &size); err != nil {
        log.Printf("Error reading size: %v", err)
        return
    }

    // Read transfer ID
    transferID, err := readUTF(conn)
    if err != nil {
        log.Printf("Error reading transfer ID: %v", err)
        return
    }

    log.Printf("Chunk Transfer: FileID=%s, ChunkID=%d, Size=%d, TransferID=%s",
        fileID, chunkID, size, transferID)

    storagePath := filepath.Join(*chunkDir, fmt.Sprintf("%s_%d_%s", fileID, chunkID, hash))
    s.chunkMutex.Lock()
    if s.activeWrites[storagePath] {
        s.chunkMutex.Unlock()
        log.Printf("Chunk already being written: %s", storagePath)
        binary.Write(conn, binary.BigEndian, int32(0)) // Transfer Failed
        return
    }
    s.activeWrites[storagePath] = true
    s.chunkMutex.Unlock()

    defer func() {
        s.chunkMutex.Lock()
        delete(s.activeWrites, storagePath)
        s.chunkMutex.Unlock()
    }()

    file, err := os.Create(storagePath)
    if err != nil {
        log.Printf("Error creating chunk file: %v", err)
        binary.Write(conn, binary.BigEndian, int32(0)) // Transfer Failed
        return
    }
    defer file.Close()

    // Hash verification
    hasher := sha256.New()
    writer := io.MultiWriter(file, hasher)

    // Copy chunk data with timeout
    done := make(chan bool, 1)
    go func() {
        if _, err := io.CopyN(writer, conn, int64(size)); err != nil {
            log.Printf("Error writing chunk data: %v", err)
            os.Remove(storagePath)
            done <- false
            return
        }
        done <- true
    }()

    select {
    case success := <-done:
        if !success {
            binary.Write(conn, binary.BigEndian, int32(0)) // Transfer Failed
            return
        }
    case <-time.After(10 * time.Second):
        log.Printf("Chunk transfer timeout: FileID=%s, ChunkID=%d", fileID, chunkID)
        os.Remove(storagePath)
        binary.Write(conn, binary.BigEndian, int32(0)) // Transfer Failed
        return
    }

    // Verify hash
    calculatedHash := hex.EncodeToString(hasher.Sum(nil))
    if calculatedHash != hash {
        log.Printf("Hash mismatch. Expected: %s, Got: %s", hash, calculatedHash)
        os.Remove(storagePath)
        binary.Write(conn, binary.BigEndian, int32(0)) // Transfer Failed
        return
    }

    // Store chunk metadata
    _, err = s.db.Exec(`
        INSERT OR REPLACE INTO file_chunks
        (chunk_id, file_id, transfer_id, hash, size, storage_path)
        VALUES (?, ?, ?, ?, ?, ?)
    `, chunkID, fileID, transferID, hash, size, storagePath)

    if err != nil {
        log.Printf("Error storing chunk metadata: %v", err)
        os.Remove(storagePath)
        binary.Write(conn, binary.BigEndian, int32(0)) // Transfer Failed
        return
    }

    // Successful transfer
    binary.Write(conn, binary.BigEndian, int32(1))
    log.Printf("Chunk transfer successful: FileID=%s, ChunkID=%d", fileID, chunkID)
}
func (s *ChunkServer) handleChunkDownload(conn net.Conn) {
    // Read chunk ID
    var chunkID int32
    if err := binary.Read(conn, binary.BigEndian, &chunkID); err != nil {
        log.Printf("Error reading chunk ID: %v", err)
        binary.Write(conn, binary.BigEndian, int32(0)) // Size 0 indicates error
        return
    }

    // Read file ID
    fileID, err := readUTF(conn)
    if err != nil {
        log.Printf("Error reading file ID: %v", err)
        binary.Write(conn, binary.BigEndian, int32(0)) // Size 0 indicates error
        return
    }

    // Read hash
    hash, err := readUTF(conn)
    if err != nil {
        log.Printf("Error reading hash: %v", err)
        binary.Write(conn, binary.BigEndian, int32(0)) // Size 0 indicates error
        return
    }

    // Query chunk metadata from database
    var storagePath string
    var size int32
    err = s.db.QueryRow(`
        SELECT storage_path, size
        FROM file_chunks
        WHERE file_id = ? AND chunk_id = ? AND hash = ?
    `, fileID, chunkID, hash).Scan(&storagePath, &size)

    if err != nil {
        log.Printf("Chunk not found: FileID=%s, ChunkID=%d, Hash=%s", fileID, chunkID, hash)
        binary.Write(conn, binary.BigEndian, int32(0)) // Size 0 indicates error
        return
    }

    // Open chunk file
    file, err := os.Open(storagePath)
    if err != nil {
        log.Printf("Error opening chunk file: %v", err)
        binary.Write(conn, binary.BigEndian, int32(0)) // Size 0 indicates error
        return
    }
    defer file.Close()

    // Write chunk size
    if err := binary.Write(conn, binary.BigEndian, size); err != nil {
        log.Printf("Error writing chunk size: %v", err)
        return
    }

    // Copy chunk data
    if _, err := io.CopyN(conn, file, int64(size)); err != nil {
        log.Printf("Error sending chunk data: %v", err)
        return
    }

    log.Printf("Chunk download successful: FileID=%s, ChunkID=%d", fileID, chunkID)
}
// readUTF reads a UTF string in Java's DataInputStream.readUTF() format
func readUTF(r io.Reader) (string, error) {
    var length uint16
	if err := binary.Read(r, binary.BigEndian, &length); err != nil {
		return "", err
    }

    bytes := make([]byte, length)
    if _, err := io.ReadFull(r, bytes); err != nil {
        return "", err
    }

    return string(bytes), nil
}
