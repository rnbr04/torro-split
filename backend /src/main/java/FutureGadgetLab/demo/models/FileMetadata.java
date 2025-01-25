package FutureGadgetLab.demo.models;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import lombok.*;
import org.hibernate.annotations.NaturalId;
import org.springframework.data.jpa.repository.Lock;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "file_metadata",
        indexes = {
                @Index(columnList = "fileId", unique = true),
                @Index(columnList = "transferId")
        }
)
@Getter
@Setter
public class FileMetadata {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NaturalId
    @Column(unique = true, nullable = false)
    private String fileId;

    @Version
    private Long version;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String originalFileName;

    @Column(nullable = false)
    private long fileSize;

    @Column(nullable = false)
    private String contentType;

    @Column(nullable = false)
    private Date uploadedDate;

    @Column(nullable = false)
    private String uploadedBy;

    @Column(nullable = false)
    private int totalChunks;

    @Column(nullable = false)
    private String transferId;

    @OneToMany(cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            orphanRemoval = true)
    @JoinColumn(name = "file_metadata_id")
    private List<FileChunk> chunks;
}
