package FutureGadgetLab.demo.controllers;

import FutureGadgetLab.demo.Repository.FileMetadataRepository;
import FutureGadgetLab.demo.Services.FileService;
import FutureGadgetLab.demo.models.FileMetadata;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@Slf4j
public class FileController {

    @Autowired
    private FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("user") String user) {
        try {
            String fileId = fileService.uploadFile(file, user);
            return ResponseEntity.ok("File uploaded successfully. FileId: " + fileId);
        } catch (Exception e) {
            log.error("Upload failed", e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/files")
    public ResponseEntity<List<FileMetadata>> allFiles() {
        try {
            List<FileMetadata> files = fileService.getAllFiles();
            return ResponseEntity.ok(files);
        } catch (Exception e) {
            log.error("Failed to retrieve files", e);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/download/{fileId}")
    public ResponseEntity<ByteArrayResource> downloadFile(@PathVariable String fileId) {
        try {
            byte[] fileData = fileService.downloadFile(fileId);

            ByteArrayResource resource = new ByteArrayResource(fileData);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=file_" + fileId + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .contentLength(fileData.length)
                    .body(resource);
        } catch (Exception e) {
            log.error("Download failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
