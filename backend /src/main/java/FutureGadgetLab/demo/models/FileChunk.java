package FutureGadgetLab.demo.models;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.*;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "file_chunks",
        indexes = {
                @Index(columnList = "fileId"),
                @Index(columnList = "chunkId")
        }
)
@Getter
@Setter
public class FileChunk {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Version
    private Long version;

    @Column(nullable = false)
    private int chunkId;

    @Column(nullable = false)
    private String fileId;

    @Column(nullable = false)
    private String hash;

    @Column(nullable = false)
    private int size;


    @ElementCollection(fetch = FetchType.EAGER)  // Consider using EAGER if you always want nodes
    @CollectionTable(name = "chunk_nodes",
            joinColumns = @JoinColumn(name = "chunk_id", referencedColumnName = "id"))
    @Column(name = "node_address")
    private List<String> nodes = new ArrayList<>();
}