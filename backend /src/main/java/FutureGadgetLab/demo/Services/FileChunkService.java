package FutureGadgetLab.demo.Services;

import FutureGadgetLab.demo.Repository.FileChunkRepository;
import FutureGadgetLab.demo.models.FileChunk;
import jakarta.persistence.LockModeType;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class FileChunkService {

    @Autowired
    private FileChunkRepository fileChunkRepository;
    @Transactional
    @Lock(LockModeType.OPTIMISTIC_FORCE_INCREMENT)
    public FileChunk save(FileChunk chunk) {
        log.info("Saving FileChunk: {}", chunk);
        return fileChunkRepository.save(chunk);
    }

}
