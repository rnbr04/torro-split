package FutureGadgetLab.demo.Services;

import FutureGadgetLab.demo.Repository.FileMetadataRepository;
import FutureGadgetLab.demo.models.FileMetadata;
import jakarta.persistence.LockModeType;
import jakarta.transaction.Transactional;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class FileMetaDataService {
    @Autowired
    FileMetadataRepository filemetadatarepo;

    public FileMetadata createFile(FileMetadata filematadata){
        return filemetadatarepo.save(filematadata);
    }


    @Transactional
    @Lock(LockModeType.OPTIMISTIC_FORCE_INCREMENT)
    public FileMetadata save(FileMetadata metadata) {
        log.info("Saving FileMetadata: {}", metadata);
        return filemetadatarepo.save(metadata);
    }

    public FileMetadata search(String file_id){
        return filemetadatarepo.findByFileId(file_id);
    }



}
