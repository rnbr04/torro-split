package FutureGadgetLab.demo.config;

import FutureGadgetLab.demo.Services.NodeService;
import FutureGadgetLab.demo.models.Nodes;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.*;
import java.util.stream.Collectors;

@Configuration
public class NodeConfiguration {

    @Bean
    public NodeService nodeService() {
        return new ConfiguredNodeService();
    }

    private static class ConfiguredNodeService extends NodeService {
        private final List<Nodes> nodes;
        private final Random random = new Random();

        public ConfiguredNodeService() {
            nodes = new ArrayList<>();

            // Configure nodes with both UDP and TCP addresses
            addNode("localhost:8081", "localhost:9091");
            addNode("localhost:8082","localhost:9092");
            addNode("localhost:8083","localhost:9093");
        }

        private void addNode(String udpAddress, String tcpAddress) {
            Nodes node = new Nodes();
            node.setUdpAddress(udpAddress);
            node.setTcpAddress(tcpAddress);
            node.setStatus("ACTIVE");
            nodes.add(node);
        }

        @Override
        public String getTcpAddress(String udpAddress) {
            return nodes.stream()
                    .filter(node -> node.getUdpAddress().equals(udpAddress))
                    .map(Nodes::getTcpAddress)
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Node not found for UDP address: " + udpAddress));
        }

        @Override
        public List<String> getRandomNodes(int count) {
            if (nodes.isEmpty()) {
                throw new RuntimeException("No nodes available in the system");
            }

            List<Nodes> availableNodes = new ArrayList<>(nodes);
            Collections.shuffle(availableNodes, random);

            return availableNodes.stream()
                    .limit(Math.min(count, availableNodes.size()))
                    .map(Nodes::getUdpAddress)
                    .collect(Collectors.toList());
        }

        @Override
        public List<Nodes> getAllNodes() {
            return new ArrayList<>(nodes);
        }

        @Override
        public void deregisterNode(String nodeAddress) {
            // Not implemented for static configuration
            throw new UnsupportedOperationException("Node deregistration not supported in static configuration");
        }
    }
}