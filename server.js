// server.js

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');
const { Client } = require('minio');
const fileUpload = require('express-fileupload');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Initialize Minio Client
const minioClient = new Client({
    endPoint: '192.168.1.4',
    //endPoint: '192.168.43.179',
    port: 9000,
    useSSL: false,
    accessKey: '3IwS3yhDtXr7rDw3wsEi',
    secretKey: 'puKrxzhT15F3V1n43qkGr8umubhSwsDT9xfCUom9'
});

// Test Minio connection
minioClient.bucketExists('test1')
    .then(exists => {
        console.log('Successfully connected to Minio');
        if (!exists) {
            console.log('Bucket "test1" does not exist');
        }
    })
    .catch(err => {
        console.error('Error connecting to Minio:', err);
    });

// Add middleware
app.use(fileUpload());

app.post('/api/upload-recording', async (req, res) => {
    try {
        if (!req.files || !req.files.video) {
            return res.status(400).send('No video file uploaded');
        }

        const videoFile = req.files.video;
        const roomId = req.body.roomId || 'unknown_room';  // Get roomId from form data

        // Create a folder structure using roomId
        const fileName = `Multi_Interview/${roomId}/${Date.now()}_recording.webm`;

        // Upload to Minio
        await minioClient.putObject(
            'test1',
            fileName,
            videoFile.data,
            videoFile.size,
            videoFile.mimetype
        );

        res.json({ success: true, path: fileName });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).send('Error uploading recording');
    }
});

// Store both participant IDs and their names
const rooms = new Map(); // Map<roomId, Map<participantId, userName>>

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('create-room', (roomId) => {
        if (!rooms.has(roomId)) {
            rooms.set(roomId, new Map([[socket.id, 'Interviewer']]));
            socket.join(roomId);
            socket.emit('room-created', socket.id);
            console.log(`Room created: ${roomId} by ${socket.id} (Interviewer)`);
        } else {
            socket.emit('room-exists');
        }
    });

    socket.on('join-room', ({ roomId, userName }) => {
        const room = rooms.get(roomId);
        if (room) {
            room.set(socket.id, userName);
            socket.join(roomId);
            // Send existing participants to new user
            socket.emit('existing-participants', Array.from(room.entries()));
            // Notify existing participants about the new user
            socket.to(roomId).emit('user-joined', { participantId: socket.id, userName: userName });
            console.log(`User ${userName} (${socket.id}) joined room: ${roomId}`);
        } else {
            socket.emit('room-not-found');
        }
    });

    // In your socket.io connection handler
    socket.on('hand-raised', ({ roomId, userName, participantId, isRaised }) => {
        // Broadcast to all users in the room including the participant ID
        io.to(roomId).emit('hand-raise-notification', {
            userName,
            participantId,
            isRaised
        });
    });

    socket.on('media-state-update', ({ roomId, type, enabled }) => {
        // Broadcast media state change to all users in the room except sender
        socket.to(roomId).emit('participant-media-update', {
            participantId: socket.id,
            type,
            enabled
        });
    });

    // New events for media controls
    socket.on('toggle-participant-mic', ({ participantId, enabled, roomId }) => {
        const room = rooms.get(roomId);
        if (room && room.get(socket.id) === 'Interviewer') {
            io.to(participantId).emit('toggle-mic', { enabled });
        }
    });

    socket.on('toggle-participant-camera', ({ participantId, enabled, roomId }) => {
        const room = rooms.get(roomId);
        if (room && room.get(socket.id) === 'Interviewer') {
            io.to(participantId).emit('toggle-camera', { enabled });
        }
    });

    socket.on('send-message', ({ message, roomId }) => {
        io.to(roomId).emit('chat-message', message);
    });

    socket.on('screen-share-started', ({ roomId }) => {
        socket.to(roomId).emit('screen-share-started', { participantId: socket.id });
    });

    socket.on('screen-share-stopped', ({ roomId }) => {
        socket.to(roomId).emit('screen-share-stopped', { participantId: socket.id });
    });

    socket.on('remove-participant', ({ participantId, roomId }) => {
        console.log(`Attempting to remove participant ${participantId} from room ${roomId}`);
        const room = rooms.get(roomId);
        if (room && room.get(socket.id) === 'Interviewer') {
            if (room.has(participantId)) {
                console.log(`Removing participant ${participantId}`);
                room.delete(participantId);
                io.to(participantId).emit('force-disconnect');
                io.to(roomId).emit('participant-removed', participantId);
                const removedSocket = io.sockets.sockets.get(participantId);
                if (removedSocket) {
                    removedSocket.leave(roomId);
                    removedSocket.disconnect(true);
                }
                console.log(`Participant ${participantId} removed successfully`);
            }
        }
    });

    // Keep existing WebRTC signaling events
    socket.on('offer', ({ offer, peerId }, roomId) => {
        socket.to(peerId).emit('offer', { offer, peerId: socket.id });
    });

    socket.on('answer', ({ answer, peerId }, roomId) => {
        socket.to(peerId).emit('answer', { answer, peerId: socket.id });
    });

    socket.on('ice-candidate', ({ candidate, peerId }, roomId) => {
        socket.to(peerId).emit('ice-candidate', { candidate, peerId: socket.id });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        for (const [roomId, participants] of rooms.entries()) {
            if (participants.has(socket.id)) {
                participants.delete(socket.id);
                socket.to(roomId).emit('user-disconnected', socket.id);
                if (participants.size === 0) {
                    rooms.delete(roomId);
                    console.log(`Room ${roomId} closed`);
                }
            }
        }
    });
});

// Keep existing Express routes
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/get-ip', (req, res) => {
    const interfaces = require('os').networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const interface of interfaces[name]) {
            const { address, family, internal } = interface;
            if (family === 'IPv4' && !internal) {
                return res.send(address);
            }
        }
    }
    res.send('0.0.0.0');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});