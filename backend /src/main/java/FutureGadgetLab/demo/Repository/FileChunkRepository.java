package FutureGadgetLab.demo.Repository;

import FutureGadgetLab.demo.models.FileChunk;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
@Transactional
public interface FileChunkRepository extends JpaRepository<FileChunk, Integer> {
}