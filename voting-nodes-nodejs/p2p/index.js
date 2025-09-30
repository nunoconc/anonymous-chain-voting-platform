import { createLibp2p } from 'libp2p'
// transport layer libraries, there is more options:
// https://github.com/libp2p/js-libp2p/blob/main/doc/CONFIGURATION.md#transport
import { webSockets } from '@libp2p/websockets'
// encryption layer library, secures the connection
import { noise } from '@chainsafe/libp2p-noise'
// multiplexers layer library, efficiently manages multiple streams over a single connection
import { yamux } from '@chainsafe/libp2p-yamux'

const getNodeOptions = (port) => {
    return {
        // Nodes are started by default, pass false to override this
        start: false,
        addresses: {
            listen: [`/ip4/127.0.0.1/tcp/${port}/ws`]
        },
        transports: [webSockets()],
        connectionEncrypters: [noise()],
        streamMuxers: [yamux()]
    }
}

const node = await createLibp2p(getNodeOptions(8000))

const node2 = await createLibp2p(getNodeOptions(8001))

// start nodes, only possible due to start: false above
await node.start()
console.log('Node 1 started at:', node.getMultiaddrs())

await node2.start()
console.log('Node 2 started at:', node2.getMultiaddrs())


// Add event listeners for peer connections
node.addEventListener('peer:connect', (evt) => {
    const connection = evt.detail;
    console.log('Node Connected to', connection.toString());
})

node2.addEventListener('peer:connect', (evt) => {
    const connection = evt.detail;
    console.log('Node 2 Connected to', connection.toString());
})


// Define a protocol for communication
const PROTOCOL = '/chat/1.0.0'

// Node 1: handle incoming messages
await node.handle(PROTOCOL, async ({ stream }) => {
    for await (const msg of stream.source) {
        console.log('Node 1 received:', new TextDecoder().decode(msg))
    }
})

async function* sendMessage() {
    yield new TextEncoder().encode('Hello from Node 2!')
}

// Node 2: send a message to Node 1
const stream = await node2.dialProtocol(node.getMultiaddrs(), PROTOCOL)
await stream.sink([new TextEncoder().encode('Hello from Node 2!')])
