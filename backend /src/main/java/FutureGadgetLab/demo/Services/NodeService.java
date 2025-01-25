package FutureGadgetLab.demo.Services;


import FutureGadgetLab.demo.Repository.NodeRepository;
import FutureGadgetLab.demo.models.Nodes;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class NodeService {
    @Autowired
    private NodeRepository nodeRepository;
    private final Random random = new Random();

    /**
     * Retrieves random UDP addresses for node status checks
     */
    public List<String> getRandomNodes(int count) {
        List<Nodes> availableNodes = nodeRepository.findAllByStatus("ACTIVE");

        if (availableNodes.isEmpty()) {
            throw new RuntimeException("No active nodes available in the system");
        }

        List<Nodes> shuffledNodes = new ArrayList<>(availableNodes);
        Collections.shuffle(shuffledNodes, random);

        return shuffledNodes.stream()
                .limit(Math.min(count, shuffledNodes.size()))
                .map(Nodes::getUdpAddress)  // Use UDP address for health checks
                .collect(Collectors.toList());
    }

    /**
     * Gets the TCP address for a node given its UDP address
     */
    public String getTcpAddress(String udpAddress) {
        return nodeRepository.findByUdpAddress(udpAddress)
                .map(Nodes::getTcpAddress)
                .orElseThrow(() -> new RuntimeException("Node not found for UDP address: " + udpAddress));
    }

    /**
     * Retrieves all nodes in the system
     */
    public List<Nodes> getAllNodes() {
        return nodeRepository.findAll();
    }

    /**
     * Registers a new node with both UDP and TCP addresses
     */
    public Nodes registerNode(String udpAddress, String tcpAddress) {
        Optional<Nodes> existingNode = nodeRepository.findByUdpAddress(udpAddress);

        if (existingNode.isPresent()) {
            Nodes node = existingNode.get();
            node.setStatus("ACTIVE");
            node.setTcpAddress(tcpAddress);
            return nodeRepository.save(node);
        }

        Nodes newNode = new Nodes();
        newNode.setUdpAddress(udpAddress);
        newNode.setTcpAddress(tcpAddress);
        newNode.setStatus("ACTIVE");

        log.info("Registering new node: UDP={}, TCP={}", udpAddress, tcpAddress);
        return nodeRepository.save(newNode);
    }

    /**
     * Deregisters a node using its UDP address
     */
    public void deregisterNode(String udpAddress) {
        Optional<Nodes> node = nodeRepository.findByUdpAddress(udpAddress);

        node.ifPresent(n -> {
            n.setStatus("INACTIVE");
            nodeRepository.save(n);
            log.info("Node deregistered: {}", udpAddress);
        });
    }

    /**
     * Updates node status using UDP address
     */
    public Nodes updateNodeStatus(String udpAddress, String status) {
        Optional<Nodes> node = nodeRepository.findByUdpAddress(udpAddress);

        if (node.isEmpty()) {
            throw new RuntimeException("Node not found: " + udpAddress);
        }

        Nodes updatedNode = node.get();
        updatedNode.setStatus(status);
        return nodeRepository.save(updatedNode);
    }

    /**
     * Checks if a node exists using UDP address
     */
    public boolean nodeExists(String udpAddress) {
        return nodeRepository.findByUdpAddress(udpAddress).isPresent();
    }
}

