package FutureGadgetLab.demo.Repository;

import FutureGadgetLab.demo.models.FileMetadata;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
@Transactional
public interface FileMetadataRepository extends JpaRepository<FileMetadata,String> {
    FileMetadata findByFileId(String fileId);
}
