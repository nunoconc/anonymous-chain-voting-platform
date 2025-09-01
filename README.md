# anonymous-chain-voting-platform
Voting application with anonymity that relies on  blockchain.

## Technologies
- Spring
- Node

## Libraries
- p2p networking
  - libp2p → https://libp2p.io/
  - socket.io/ws
- data structure
  - level db (key value blocks)
  - nedb (blockchain prototypes)
  - better-sqlite3 (state)
- crypto & hashing
  - crypto (built-in Node module)
    For SHA256, signatures, etc.
  - elliptic → https://github.com/indutny/elliptic
    EC cryptography for digital signatures (used in Bitcoin/Ethereum).
  - uuid
    For generating unique IDs for blocks/transactions.
- Blockchain
  - fbric-sdk-node
  - lotion
  - block-chain-core