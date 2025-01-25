
# Project Overview: 

*Torro Split is a cutting-edge file management system that brings the power of torrent technology into the corporate world. Designed to optimize the storage and distribution of sensitive files within an enterprise, it ensures efficient, secure, and transparent file sharing. By splitting large files into encrypted chunks and distributing them across multiple nodes, Torro Split revolutionizes how organizations handle data—ensuring speed, security, and reliability.*

---
Tech Stack :
---
<img src="https://github.com/rnbr04/torro-split/raw/main/frontend/public/HTML5.svg" height="50" />
<img src="https://github.com/rnbr04/torro-split/raw/main/frontend/public/CSS3.svg" height="50" />
<img src="https://github.com/rnbr04/torro-split/raw/main/frontend/public/js.svg" height="50" />
<img src="https://github.com/rnbr04/torro-split/raw/main/frontend/public/react.svg" height="50" />
<img src="https://github.com/rnbr04/torro-split/raw/main/frontend/public/vite.svg" height="50" />
<img src="https://github.com/rnbr04/torro-split/raw/main/frontend/public/java.svg" height="50" />
<img src="https://github.com/rnbr04/torro-split/raw/main/frontend/public/go.svg" height="50" />
<img src="https://github.com/rnbr04/torro-split/raw/main/frontend/public/Postgresql.svg" height="50" />

---
  

## How It Works: 
At the heart of Torro Split is a mechanism inspired by torrent systems. Here’s a step-by-step breakdown of how it operates:

  ---

### File Splitting: 
When a large file is uploaded, Torro Split breaks it into smaller, manageable chunks. Each chunk is encrypted using OpenSSL, ensuring that even if an individual chunk is intercepted, it remains unintelligible.

  ---

### Chunk Distribution: 
These encrypted chunks are then distributed across different nodes or servers within the organization’s network. This decentralized storage not only enhances security but also reduces the load on any single server, improving performance and resilience.

  ---

### File Retrieval: 
When an authorized user requests a file, the system springs into action. Using OAuth 2.0 and JWT, the user’s credentials are verified to ensure only legitimate access. Once authenticated, Torro Split retrieves the chunks from various nodes in parallel, significantly speeding up the process.

  ---

### Real-Time Coordination: 
socket.io powers the real-time communication between the client and servers, ensuring seamless coordination. As chunks are fetched, users get instant updates on the progress. This real-time interaction mimics the way torrent clients download pieces of a file from multiple peers simultaneously.

  ---

### Reassembly and Decryption: 
Once all the chunks are gathered, they’re decrypted and reassembled to reconstruct the original file. This ensures that the data remains secure throughout the process and is only accessible to authorized users.

  ---

### Caching with Redis: 
To enhance efficiency, frequently requested chunks are cached using Redis. This means that the next time the same file is requested, it can be retrieved even faster, reducing the load on the network and improving performance.

---
  

### Audit Trail with Ledger:
 Security isn’t just about encryption; it’s also about accountability. Torro Split integrates a ledger system that records every file access and retrieval. This immutable audit trail ensures transparency and provides administrators with a clear view of who accessed what and when.

  ---

## Why Torro Split Stands Out:

  

-  **Efficiency**: Inspired by torrent technology, it reduces network congestion and accelerates file retrieval by downloading chunks in parallel. 
- **Security**: Advanced encryption, role-based access control (RBAC), and authenticated access ensure that data is always protected. 
- **Transparency**: The integrated ledger system maintains a detailed record of every transaction, fostering accountability. 
- **Scalability**: Designed to handle large files and support multiple users concurrently, making it ideal for growing enterprises. 

---

### Conclusion: 
*Torro Split isn’t just another file-sharing system—it’s a game-changer. By leveraging the principles of torrent technology, it provides organizations with a secure, efficient, and transparent way to manage their sensitive data. Whether you’re dealing with massive datasets or need to ensure compliance and security, Torro Split offers a revolutionary solution for modern enterprise file management.*