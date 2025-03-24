
# Torro Split 

*Torro Split is a Java - Go based file management system that brings the power of torrent technology into the corporate world. Designed to optimize the storage and distribution of sensitive files within an enterprise, it ensures efficient, secure, and transparent file sharing. By splitting large files into chunks and distributing them across multiple nodes, Torro Split revolutionizes how organizations handle data—ensuring speed, security, and reliability.*

---
Tech Stack :
---
 <img src="https://github.com/rnbr04/torro-split/raw/main/frontend/public/java.svg" height="50" /> <img src="https://github.com/rnbr04/torro-split/raw/main/frontend/public/go.svg" height="50" /> <img src="https://github.com/rnbr04/torro-split/raw/main/frontend/public/react.svg" height="50" /> <img src="https://github.com/rnbr04/torro-split/raw/main/frontend/public/Postgresql.svg" height="50" /> <img src="https://github.com/rnbr04/torro-split/raw/main/frontend/public/redis.svg" height="50" /> 

---
  

## **Index**

1. [Overview](#torro-split)  
2. [Key Features](#key-features)  
3. [How It Works](#how-it-works)  
4. [File Structure](#file-structure)  
5. [Getting Started](#getting-started)  
   - [Prerequisites](#prerequisites)  
   - [Installation](#installation)  
6. [Architecture](#architecture)  
7. [User Interaction](#user-interaction)

## **Key Features**

1. **Efficient File Splitting**  
   - Automatically splits large files into manageable chunks to improve storage and transfer speed.  

2. **Decentralized Chunk Distribution**  
   - Chunks are distributed across multiple servers within the organization, improving security and system performance.  

3. **Parallel Chunk Retrieval**  
   - Files are fetched by retrieving chunks from different nodes in parallel, significantly reducing download time.  

4. **Real-Time Coordination**  
   - Utilizes `socket.io` for real-time communication between clients and servers, keeping users updated with the progress of file retrieval.  

5. **Secure Access with OAuth 2.0 & JWT**  
   - Ensures secure file access by authenticating users using OAuth 2.0 and JWT for token-based verification.  

---

## **How It Works**

At its core, Torro Split mimics the behavior of torrent technology. Here's a breakdown of how it works:

### **File Splitting**  
When a user uploads a large file, Torro Split (SpringBoot) server automatically divides it into smaller, manageable chunks to optimize storage and transfer.

### **Chunk Distribution**  
These file chunks are distributed across various nodes or servers (Go services) in the organization's network. This decentralized approach not only enhances security but also ensures that no single server bears the load, improving overall system performance and resilience.

### **File Retrieval**  
Torro Split retrieves files by fetching chunks from multiple distributed Go nodes, ensuring fast and efficient downloads. The process follows these steps:

- <b>Client Request</b> : The client requests a file by specifying the fileID. The system queries the database to determine the required chunkIDs and their storage locations.

- <b>Chunk Download</b> : Each chunk is fetched by sending a request to the appropriate ChunkServer. The request includes fileID, chunkID, and the expected hash.

- <b>Chunk Verification & Transfer</b> : The ChunkServer checks its database for the requested chunk’s metadata. If found, it reads the chunk file from disk, verifies its size, and sends it to the client. If the chunk is missing or there’s a hash mismatch, the transfer fails.

- <b>Reassembly & Validation</b> : The client receives all chunks and verifies their integrity using the stored hashes. Once all chunks are validated, they are reassembled into the original file.

- <b>Real-Time Progress Updates</b> : The frontend provides real-time updates as chunks are retrieved, ensuring transparency in the download process.

This parallel retrieval approach significantly reduces download time while maintaining data integrity and security.

### **Real-Time Coordination**  
With the help of `socket.io`, the system enables real-time updates on the progress of file retrieval. As chunks are downloaded, users can track their progress, ensuring that the entire file is quickly and efficiently retrieved.

---

## **File Structure**

The basic file structure of the Torro Split project is organized as follows:

```plaintext
Torro-Split/
├── README.md                                      # Project documentation
│
├── backend/                                       # Backend files
│   ├── pom.xml
│   └── src/main/
│      ├── resources/
│      │   ├── application.properties
│      │   └── application.yaml
│      └── java/FutureGadgetLab/demo/              # Java code for file management logic
│          ├── config/
│          ├── controllers/
│          ├── Repository/                         # New repository directory
│          │   ├── FileChunkRepository.java
│          │   ├── FileMetadataRepository.java
│          │   └── NodeRepository.java
│          ├── Services/                           # New services directory
│          │   ├── FileChunkService.java
│          │   ├── FileMetadataService.java
│          │   ├── FileService.java
│          │   └── NodeService.java
│          └── TorroSplitApplication.java          # TorroSplitApplication added here
│
├── service/                                       # New service directory
│   ├── chunks/                                    # Chunks directory
│   ├── custom_chunks/                             # Custom chunks directory
│   ├── node_metadata.db                           # Database file for node metadata
│   └── server.go                                  # Go server file
│
└── frontend/                                      # Frontend files (React.js)

```


## Getting Started
### Prerequisites
Before running Torro Split, ensure you have the following:

- Java Development Kit (JDK)
```Install JDK 11 or higher.```

- Go Programming Language
```Install Go version 1.15 or higher.```

- React.js
```Make sure Node.js is installed for React development.```

- PostgreSQL
```Set up PostgreSQL for database management.```

- Redis
```Redis for caching, under development```

<!-- - Docker (optional)
```Docker is used for containerizing the application, so ensure Docker and Docker Compose are installed. Set Up OAuth 2.0 & JWT Authentication. Configure OAuth 2.0 for secure user authentication and JWT for token-based access.``` --> 

## Installation

### Clone the repository

Clone the Torro Split repository to your local machine:

```bash
git clone https://github.com/rnbr04/torro-split.git
```

### Install Dependencies

For the backend (Java & Go), ensure all dependencies are included in the respective package managers.

 After starting SpringBoot server, start go nodes :

```go
cd services && \
go run server.go --udp-port 8081 --tcp-port 9091 --chunk-dir ./custom_chunks && \
go run server.go --udp-port 8082 --tcp-port 9092 --chunk-dir ./custom_chunks && \
go run server.go --udp-port 8083 --tcp-port 9093 --chunk-dir ./custom_chunks
```

This will start 3 nodes, which can be customized. 

<br>
For the frontend (React), run:

```bash
cd frontend && npm install && npm run dev
```


This will go to `frontend/` directory and install required dependencies, then start the frontend on `127.0.0.1:5173`.


### Set Up the Database

> Ensure PostgreSQL is running and configure the database. <!-- credentials in the .env file. -->

<!-- > Run Backend and Frontend Servers -->

> Run the backend Java & Go services and the React development server.
Start Application

> Open the application in your web browser at `127.0.0.1:5173` or`localhost:5173`.


## Architecture


### User Interaction
- <b>File Upload </b> : The File Upload Page allows users to upload large files. Once uploaded, the system splits the file into chunks and distributes them across multiple nodes for storage.

- <b>File Download</b> : The File Download Page enables users to download files by retrieving chunks from various nodes. 
<!-- Users are kept updated in real-time with the download progress. -->

### Outputs
The Output section shows the list of files user can download (if they have required permissions).



### Conclusion: 
*Torro Split isn't just another file-sharing system—it's a game-changer. By leveraging the principles of torrent technology, it provides organizations with a secure, efficient, and transparent way to manage their sensitive data. Whether you're dealing with massive datasets or need to ensure compliance and security, Torro Split offers a revolutionary solution for modern enterprise file management.*
