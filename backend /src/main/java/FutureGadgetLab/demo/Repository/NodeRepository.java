package FutureGadgetLab.demo.Repository;

import FutureGadgetLab.demo.models.Nodes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NodeRepository extends JpaRepository<Nodes, Integer> {
    Optional<Nodes> findByUdpAddress(String udpAddress);
    List<Nodes> findAllByStatus(String status);
}