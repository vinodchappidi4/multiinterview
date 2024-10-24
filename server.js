// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');

// const app = express();
// app.use(cors());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });

// const rooms = new Map();

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('join-room', (roomId, username) => {
//     socket.join(roomId);
//     if (!rooms.has(roomId)) {
//       rooms.set(roomId, new Map());
//     }
//     rooms.get(roomId).set(socket.id, username);

//     // Notify all other users in the room about the new user
//     socket.to(roomId).emit('user-joined', { userId: socket.id, username });

//     // Send information about all existing users to the new user
//     const usersInRoom = Array.from(rooms.get(roomId)).map(([userId, username]) => ({ userId, username }));
//     socket.emit('room-users', usersInRoom);

//     console.log(`User ${username} joined room: ${roomId}`);
//   });

//   socket.on('offer', (offer, roomId, userId) => {
//     const username = rooms.get(roomId).get(socket.id);
//     socket.to(userId).emit('offer', { offer, userId: socket.id, username });
//   });

//   socket.on('answer', (answer, roomId, userId) => {
//     const username = rooms.get(roomId).get(socket.id);
//     socket.to(userId).emit('answer', { answer, userId: socket.id, username });
//   });

//   socket.on('ice-candidate', (candidate, roomId, userId) => {
//     socket.to(userId).emit('ice-candidate', { candidate, userId: socket.id });
//   });

//   socket.on('disconnecting', () => {
//     const rooms = Array.from(socket.rooms).filter(room => room !== socket.id);
//     rooms.forEach((roomId) => {
//       if (rooms.has(roomId)) {
//         rooms.get(roomId).delete(socket.id);
//         if (rooms.get(roomId).size === 0) {
//           rooms.delete(roomId);
//         }
//       }
//       socket.to(roomId).emit('user-disconnected', socket.id);
//     });
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

// const PORT = process.env.PORT || 3001;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });



// works in 2 but not in 3 


// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');

// const app = express();
// app.use(cors());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });

// const rooms = new Map();

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('join-room', (roomId, username) => {
//     socket.join(roomId);
//     if (!rooms.has(roomId)) {
//       rooms.set(roomId, new Map());
//     }
//     rooms.get(roomId).set(socket.id, username);

//     // Notify all other users in the room about the new user
//     socket.to(roomId).emit('user-joined', { userId: socket.id, username });

//     console.log(`User ${username} joined room: ${roomId}`);
//   });

//   socket.on('send-offer', ({ offer, to }) => {
//     socket.to(to).emit('receive-offer', { offer, from: socket.id });
//   });

//   socket.on('send-answer', ({ answer, to }) => {
//     socket.to(to).emit('receive-answer', { answer, from: socket.id });
//   });

//   socket.on('send-ice-candidate', ({ candidate, to }) => {
//     socket.to(to).emit('receive-ice-candidate', { candidate, from: socket.id });
//   });

//   socket.on('disconnecting', () => {
//     socket.rooms.forEach((roomId) => {
//       if (rooms.has(roomId)) {
//         rooms.get(roomId).delete(socket.id);
//         if (rooms.get(roomId).size === 0) {
//           rooms.delete(roomId);
//         }
//         socket.to(roomId).emit('user-disconnected', socket.id);
//       }
//     });
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

// const PORT = process.env.PORT || 3001;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


//g 2 

// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');

// const app = express();
// app.use(cors());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });

// const rooms = new Map();

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('join-room', (roomId, username) => {
//     socket.join(roomId);

//     // Create a new room if it doesn't exist
//     if (!rooms.has(roomId)) {
//       rooms.set(roomId, new Map());
//     }

//     // Add the user to the room's Map
//     rooms.get(roomId).set(socket.id, username);

//     // Get a list of all users in the room, including the new user
//     const usersInRoom = Array.from(rooms.get(roomId).values());

//     // Notify the new user about all current users in the room
//     socket.emit('all-users', usersInRoom);

//     // Notify all other users in the room about the new user
//     socket.to(roomId).emit('user-joined', { userId: socket.id, username });

//     console.log(`User ${username} joined room: ${roomId}`);
//   });

//   // Handle offers between peers
//   socket.on('send-offer', ({ offer, to }) => {
//     socket.to(to).emit('receive-offer', { offer, from: socket.id });
//   });

//   // Handle answers between peers
//   socket.on('send-answer', ({ answer, to }) => {
//     socket.to(to).emit('receive-answer', { answer, from: socket.id });
//   });

//   // Handle ICE candidates between peers
//   socket.on('send-ice-candidate', ({ candidate, to }) => {
//     socket.to(to).emit('receive-ice-candidate', { candidate, from: socket.id });
//   });

//   // Notify other users in the room when a user disconnects
//   socket.on('disconnecting', () => {
//     socket.rooms.forEach((roomId) => {
//       if (rooms.has(roomId)) {
//         const username = rooms.get(roomId).get(socket.id);
//         rooms.get(roomId).delete(socket.id);

//         // If the room is empty, delete it
//         if (rooms.get(roomId).size === 0) {
//           rooms.delete(roomId);
//         }

//         // Notify other users in the room that this user has disconnected
//         socket.to(roomId).emit('user-disconnected', socket.id);
//         console.log(`User ${username} disconnected from room: ${roomId}`);
//       }
//     });
//   });

//   // Handle socket disconnection
//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

// const PORT = process.env.PORT || 3001;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });






///



//fri ni8 

// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "*", methods: ["GET", "POST"] },
//   pingTimeout: 60000,
// });

// const rooms = new Map();

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('join-room', (roomId, username) => {
//     socket.join(roomId);
//     if (!rooms.has(roomId)) {
//       rooms.set(roomId, new Map());
//     }
//     rooms.get(roomId).set(socket.id, username);

//     // Notify all other users in the room about the new user
//     socket.to(roomId).emit('user-joined', { userId: socket.id, username });
//     console.log(`User ${username} joined room: ${roomId}`);

//     // Send existing peers to the new user
//     const existingPeers = Array.from(rooms.get(roomId))
//       .filter(([id]) => id !== socket.id)
//       .map(([userId, username]) => ({ userId, username }));
//     socket.emit('existing-peers', existingPeers);
//   });

//   socket.on('request-existing-peers', (roomId) => {
//     if (rooms.has(roomId)) {
//       const existingPeers = Array.from(rooms.get(roomId))
//         .filter(([id]) => id !== socket.id)
//         .map(([userId, username]) => ({ userId, username }));
//       socket.emit('existing-peers', existingPeers);
//     }
//   });

//   socket.on('send-offer', ({ offer, to }) => {
//     socket.to(to).emit('receive-offer', { offer, from: socket.id });
//   });

//   socket.on('send-answer', ({ answer, to }) => {
//     socket.to(to).emit('receive-answer', { answer, from: socket.id });
//   });

//   socket.on('send-ice-candidate', ({ candidate, to }) => {
//     socket.to(to).emit('receive-ice-candidate', { candidate, from: socket.id });
//   });

//   socket.on('disconnecting', () => {
//     socket.rooms.forEach((roomId) => {
//       if (rooms.has(roomId)) {
//         rooms.get(roomId).delete(socket.id);
//         if (rooms.get(roomId).size === 0) {
//           rooms.delete(roomId);
//         } else {
//           socket.to(roomId).emit('user-disconnected', socket.id);
//         }
//       }
//     });
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

// const PORT = process.env.PORT || 3001;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });



//
// server.js last update g 



// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');

// const app = express();
// app.use(cors());

// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"]
//     }
// });

// const rooms = new Map(); // Store room information: Map<roomId, Map<socketId, username>>

// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);

//     socket.on('join-room', (roomId, username) => {
//         // Join the socket.io room
//         socket.join(roomId);

//         // Initialize room if it doesn't exist
//         if (!rooms.has(roomId)) {
//             rooms.set(roomId, new Map());
//         }

//         // Store user information
//         rooms.get(roomId).set(socket.id, username);

//         // Get list of existing users in the room
//         const existingUsers = Array.from(rooms.get(roomId).entries())
//             .filter(([id]) => id !== socket.id)
//             .map(([id, name]) => ({ userId: id, username: name }));

//         // Send existing users list to the new user
//         socket.emit('existing-users', existingUsers);

//         // Notify others about the new user
//         socket.to(roomId).emit('user-joined', {
//             userId: socket.id,
//             username: username
//         });

//         console.log(`User ${username} (${socket.id}) joined room: ${roomId}`);
//         console.log(`Existing users in room: `, existingUsers);
//     });

//     socket.on('send-offer', ({ offer, to }) => {
//         socket.to(to).emit('receive-offer', {
//             offer,
//             from: socket.id
//         });
//     });

//     socket.on('send-answer', ({ answer, to }) => {
//         socket.to(to).emit('receive-answer', {
//             answer,
//             from: socket.id
//         });
//     });

//     socket.on('send-ice-candidate', ({ candidate, to }) => {
//         socket.to(to).emit('receive-ice-candidate', {
//             candidate,
//             from: socket.id
//         });
//     });

//     socket.on('disconnecting', () => {
//         // Get all rooms this socket is in
//         for (const roomId of socket.rooms) {
//             if (rooms.has(roomId)) {
//                 // Remove user from room storage
//                 rooms.get(roomId).delete(socket.id);

//                 // Delete room if empty
//                 if (rooms.get(roomId).size === 0) {
//                     rooms.delete(roomId);
//                 }

//                 // Notify others in the room
//                 socket.to(roomId).emit('user-disconnected', socket.id);
//             }
//         }
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//     });
// });

// const PORT = process.env.PORT || 3001;
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });



// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');

// const app = express();
// app.use(cors());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });

// const rooms = new Map();

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('join-room', (roomId, username) => {
//     socket.join(roomId);
//     if (!rooms.has(roomId)) {
//       rooms.set(roomId, new Map());
//     }
//     rooms.get(roomId).set(socket.id, username);

//     // Notify all other users in the room about the new user
//     socket.to(roomId).emit('user-joined', { userId: socket.id, username });

//     console.log(`User ${username} joined room: ${roomId}`);
//   });

//   socket.on('send-offer', ({ offer, to }) => {
//     socket.to(to).emit('receive-offer', { offer, from: socket.id });
//   });

//   socket.on('send-answer', ({ answer, to }) => {
//     socket.to(to).emit('receive-answer', { answer, from: socket.id });
//   });

//   socket.on('send-ice-candidate', ({ candidate, to }) => {
//     socket.to(to).emit('receive-ice-candidate', { candidate, from: socket.id });
//   });

//   socket.on('disconnecting', () => {
//     socket.rooms.forEach((roomId) => {
//       if (rooms.has(roomId)) {
//         rooms.get(roomId).delete(socket.id);
//         if (rooms.get(roomId).size === 0) {
//           rooms.delete(roomId);
//         }
//         socket.to(roomId).emit('user-disconnected', socket.id);
//       }
//     });
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

// const PORT = process.env.PORT || 3001;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


// // testing back up 


//  const express = require('express'); 
//  const http = require('http');
//   const { Server } = require('socket.io'); 
//   const cors = require('cors'); 
//   const app = express(); app.use(cors()); 
//   const server = http.createServer(app); 
//   const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });
//    const rooms = new Map(); io.on('connection', (socket) => { console.log('A user connected');
//      socket.on('join-room', (roomId, username) => { socket.join(roomId); 
//       if (!rooms.has(roomId)) {
//          rooms.set(roomId, new Map());

//        } rooms.get(roomId).set(socket.id, username); // Notify all other users in the room about the new user 
//        socket.to(roomId).emit('user-joined', { userId: socket.id, username });
//         console.log(User ${username} joined room: ${roomId});
//        }); socket.on('send-offer', ({ offer, to }) => { socket.to(to).emit('receive-offer', { offer, from: socket.id });
//        }); socket.on('send-answer', ({ answer, to }) => { socket.to(to).emit('receive-answer', { answer, from: socket.id });
//        }); socket.on('send-ice-candidate', ({ candidate, to }) => { socket.to(to).emit('receive-ice-candidate', { candidate, from: socket.id });
//        }); socket.on('disconnecting', () => { socket.rooms.forEach((roomId) => { if (rooms.has(roomId)) { rooms.get(roomId).delete(socket.id); 
//         if (rooms.get(roomId).size === 0) { rooms.delete(roomId); } socket.to(roomId).emit('user-disconnected', socket.id); 
//       } }); }); socket.on('disconnect', () => { console.log('User disconnected');

//        }); 
//       }); 
//       const PORT = process.env.PORT || 3001; server.listen(PORT, () => { console.log(Server is running on port ${PORT});
//      });


// above + structure current works 


// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');

// // Initialize express app and middleware
// const app = express();
// app.use(cors());

// // Create HTTP server and Socket.io server
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });

// // Map to hold rooms and users
// const rooms = new Map();

// // Socket.io connection handler
// io.on('connection', (socket) => {
//   console.log('A user connected');

//   // Event: User joins a room
//   socket.on('join-room', (roomId, username) => {
//     socket.join(roomId);

//     // Create a new room if it doesn't exist
//     if (!rooms.has(roomId)) {
//       rooms.set(roomId, new Map());
//     }

//     // Add the user to the room
//     rooms.get(roomId).set(socket.id, username);

//     // Notify other users in the room about the new user
//     socket.to(roomId).emit('user-joined', { userId: socket.id, username });

//     console.log(`User ${username} joined room: ${roomId}`);
//   });

//   // Event: Sending WebRTC offer
//   socket.on('send-offer', ({ offer, to }) => {
//     socket.to(to).emit('receive-offer', { offer, from: socket.id });
//   });

//   // Event: Sending WebRTC answer
//   socket.on('send-answer', ({ answer, to }) => {
//     socket.to(to).emit('receive-answer', { answer, from: socket.id });
//   });

//   // Event: Sending ICE candidate
//   socket.on('send-ice-candidate', ({ candidate, to }) => {
//     socket.to(to).emit('receive-ice-candidate', { candidate, from: socket.id });
//   });

//   // Event: User disconnecting from rooms
//   socket.on('disconnecting', () => {
//     socket.rooms.forEach((roomId) => {
//       if (rooms.has(roomId)) {
//         rooms.get(roomId).delete(socket.id);

//         // If the room is empty, delete the room
//         if (rooms.get(roomId).size === 0) {
//           rooms.delete(roomId);
//         }

//         // Notify other users in the room that the user disconnected
//         socket.to(roomId).emit('user-disconnected', socket.id);
//       }
//     });
//   });

//   // Event: User disconnected
//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

// // Server listens on specified port
// const PORT = process.env.PORT || 3001;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


// two interview converted jsx works 
// server.js

// const express = require('express');
// const http = require('http');
// const { Server } = require("socket.io");
// const path = require('path');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('create-room', (roomId) => {
//     socket.join(roomId);
//     console.log(`Room created: ${roomId}`);
//   });

//   socket.on('join-room', (roomId) => {
//     const room = io.sockets.adapter.rooms.get(roomId);
//     if (room && room.size < 2) {
//       socket.join(roomId);
//       socket.to(roomId).emit('user-joined', socket.id);
//       console.log(`User joined room: ${roomId}`);
//     } else {
//       socket.emit('room-full');
//     }
//   });

//   socket.on('offer', (offer, roomId) => {
//     socket.to(roomId).emit('offer', offer, socket.id);
//   });

//   socket.on('answer', (answer, roomId) => {
//     socket.to(roomId).emit('answer', answer, socket.id);
//   });

//   socket.on('ice-candidate', (candidate, roomId) => {
//     socket.to(roomId).emit('ice-candidate', candidate, socket.id);
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

// app.use(express.static(path.join(__dirname, 'dist')));

// app.get('/api/get-ip', (req, res) => {
//   const interfaces = require('os').networkInterfaces();
//   for (const name of Object.keys(interfaces)) {
//     for (const interface of interfaces[name]) {
//       const { address, family, internal } = interface;
//       if (family === 'IPv4' && !internal) {
//         return res.send(address);
//       }
//     }
//   }
//   res.send('0.0.0.0');
// });

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

// const PORT = process.env.PORT || 3001;
// server.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running on port ${PORT}`);
// });


// // multi tesing semi works ================================================

// server.js

// // server.js (works like - (start and first joined intervieews can not seen later joined intervieew))

// const express = require('express');
// const http = require('http');
// const { Server } = require("socket.io");
// const path = require('path');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });

// const rooms = new Map();

// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   socket.on('create-room', (roomId) => {
//     if (!rooms.has(roomId)) {
//       rooms.set(roomId, new Set([socket.id]));
//       socket.join(roomId);
//       socket.emit('room-created', socket.id);
//       console.log(`Room created: ${roomId} by ${socket.id}`);
//     } else {
//       socket.emit('room-exists');
//     }
//   });

//   socket.on('join-room', (roomId) => {
//     const room = rooms.get(roomId);
//     if (room) {
//       room.add(socket.id);
//       socket.join(roomId);
      
//       // Notify the new user about existing participants
//       socket.emit('existing-participants', Array.from(room));
      
//       // Notify existing participants about the new user
//       socket.to(roomId).emit('user-joined', socket.id);
      
//       console.log(`User ${socket.id} joined room: ${roomId}`);
//     } else {
//       socket.emit('room-not-found');
//     }
//   });

//   socket.on('offer', ({ offer, peerId }, roomId) => {
//     console.log(`Offer from ${socket.id} to ${peerId} in room ${roomId}`);
//     socket.to(peerId).emit('offer', { offer, peerId: socket.id });
//   });

//   socket.on('answer', ({ answer, peerId }, roomId) => {
//     console.log(`Answer from ${socket.id} to ${peerId} in room ${roomId}`);
//     socket.to(peerId).emit('answer', { answer, peerId: socket.id });
//   });

//   socket.on('ice-candidate', ({ candidate, peerId }, roomId) => {
//     console.log(`ICE candidate from ${socket.id} to ${peerId} in room ${roomId}`);
//     socket.to(peerId).emit('ice-candidate', { candidate, peerId: socket.id });
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//     for (const [roomId, participants] of rooms.entries()) {
//       if (participants.has(socket.id)) {
//         participants.delete(socket.id);
//         socket.to(roomId).emit('user-disconnected', socket.id);
//         console.log(`User ${socket.id} left room ${roomId}`);
        
//         if (participants.size === 0) {
//           rooms.delete(roomId);
//           console.log(`Room ${roomId} closed`);
//         }
//       }
//     }
//   });
// });

// app.use(express.static(path.join(__dirname, 'dist')));

// app.get('/api/get-ip', (req, res) => {
//   const interfaces = require('os').networkInterfaces();
//   for (const name of Object.keys(interfaces)) {
//     for (const interface of interfaces[name]) {
//       const { address, family, internal } = interface;
//       if (family === 'IPv4' && !internal) {
//         return res.send(address);
//       }
//     }
//   }
//   res.send('0.0.0.0');
// });

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

// const PORT = process.env.PORT || 3001;
// server.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running on port ${PORT}`);
// });

// new ni8 

// server.js

// server.js

// // server.js
// const express = require('express');
// const http = require('http');
// const { Server } = require("socket.io");
// const path = require('path');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });

// const rooms = new Map();

// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   socket.on('create-room', (roomId) => {
//     if (!rooms.has(roomId)) {
//       rooms.set(roomId, new Set([socket.id]));
//       socket.join(roomId);
//       socket.emit('room-created', socket.id);
//       console.log(`Room created: ${roomId} by ${socket.id}`);
//     } else {
//       socket.emit('room-exists');
//     }
//   });

//   socket.on('join-room', (roomId) => {
//     const room = rooms.get(roomId);
//     if (room) {
//       room.add(socket.id);
//       socket.join(roomId);
      
//       // Notify the new user about existing participants
//       socket.emit('existing-participants', Array.from(room));
      
//       // Notify existing participants about the new user
//       socket.to(roomId).emit('user-joined', socket.id);
      
//       console.log(`User ${socket.id} joined room: ${roomId}`);
//     } else {
//       socket.emit('room-not-found');
//     }
//   });

//   socket.on('offer', ({ offer, peerId }, roomId) => {
//     console.log(`Offer from ${socket.id} to ${peerId} in room ${roomId}`);
//     socket.to(peerId).emit('offer', { offer, peerId: socket.id });
//   });

//   socket.on('answer', ({ answer, peerId }, roomId) => {
//     console.log(`Answer from ${socket.id} to ${peerId} in room ${roomId}`);
//     socket.to(peerId).emit('answer', { answer, peerId: socket.id });
//   });

//   socket.on('ice-candidate', ({ candidate, peerId }, roomId) => {
//     console.log(`ICE candidate from ${socket.id} to ${peerId} in room ${roomId}`);
//     socket.to(peerId).emit('ice-candidate', { candidate, peerId: socket.id });
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//     for (const [roomId, participants] of rooms.entries()) {
//       if (participants.has(socket.id)) {
//         participants.delete(socket.id);
//         socket.to(roomId).emit('user-disconnected', socket.id);
//         console.log(`User ${socket.id} left room ${roomId}`);
        
//         if (participants.size === 0) {
//           rooms.delete(roomId);
//           console.log(`Room ${roomId} closed`);
//         }
//       }
//     }
//   });
// });

// app.use(express.static(path.join(__dirname, 'dist')));

// app.get('/api/get-ip', (req, res) => {
//   const interfaces = require('os').networkInterfaces();
//   for (const name of Object.keys(interfaces)) {
//     for (const interface of interfaces[name]) {
//       const { address, family, internal } = interface;
//       if (family === 'IPv4' && !internal) {
//         return res.send(address);
//       }
//     }
//   }
//   res.send('0.0.0.0');
// });

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

// const PORT = process.env.PORT || 3001;
// server.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running on port ${PORT}`);
// });

// new 


//

// // server.js
// const express = require('express');
// const http = require('http');
// const { Server } = require("socket.io");
// const path = require('path');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });

// const rooms = new Map();

// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   socket.on('join-room', (roomId) => {
//     let room = rooms.get(roomId);
//     if (!room) {
//       room = new Set([socket.id]);
//       rooms.set(roomId, room);
//     } else {
//       room.add(socket.id);
//     }

//     socket.join(roomId);
//     socket.emit('room-info', Array.from(room));
//     socket.to(roomId).emit('user-joined', socket.id);
//     console.log(`User ${socket.id} joined room: ${roomId}`);
//   });

//   socket.on('offer', ({ offer, peerId }, roomId) => {
//     console.log(`Offer from ${socket.id} to ${peerId} in room ${roomId}`);
//     socket.to(peerId).emit('offer', { offer, peerId: socket.id });
//   });

//   socket.on('answer', ({ answer, peerId }, roomId) => {
//     console.log(`Answer from ${socket.id} to ${peerId} in room ${roomId}`);
//     socket.to(peerId).emit('answer', { answer, peerId: socket.id });
//   });

//   socket.on('ice-candidate', ({ candidate, peerId }, roomId) => {
//     console.log(`ICE candidate from ${socket.id} to ${peerId} in room ${roomId}`);
//     socket.to(peerId).emit('ice-candidate', { candidate, peerId: socket.id });
//   });

//   socket.on('leave-room', (roomId) => {
//     const room = rooms.get(roomId);
//     if (room) {
//       room.delete(socket.id);
//       socket.leave(roomId);
//       socket.to(roomId).emit('user-disconnected', socket.id);
//       console.log(`User ${socket.id} left room ${roomId}`);

//       if (room.size === 0) {
//         rooms.delete(roomId);
//         console.log(`Room ${roomId} closed`);
//       }
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//     for (const [roomId, participants] of rooms.entries()) {
//       if (participants.has(socket.id)) {
//         participants.delete(socket.id);
//         socket.to(roomId).emit('user-disconnected', socket.id);
//         console.log(`User ${socket.id} left room ${roomId}`);

//         if (participants.size === 0) {
//           rooms.delete(roomId);
//           console.log(`Room ${roomId} closed`);
//         }
//       }
//     }
//   });
// });

// app.use(express.static(path.join(__dirname, 'dist')));

// app.get('/api/get-ip', (req, res) => {
//   const interfaces = require('os').networkInterfaces();
//   for (const name of Object.keys(interfaces)) {
//     for (const interface of interfaces[name]) {
//       const { address, family, internal } = interface;
//       if (family === 'IPv4' && !internal) {
//         return res.send(address);
//       }
//     }
//   }
//   res.send('0.0.0.0');
// });

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

// const PORT = process.env.PORT || 3001;
// server.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running on port ${PORT}`);
// });

// server.js

// today 

// server.js


// server.js

//
// server.js (works like - (start and first joined intervieews can not seen later joined intervieew))

// const express = require('express');
// const http = require('http');
// const { Server } = require("socket.io");
// const path = require('path');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });

// const rooms = new Map();

// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   socket.on('create-room', (roomId) => {
//     if (!rooms.has(roomId)) {
//       rooms.set(roomId, new Set([socket.id]));
//       socket.join(roomId);
//       socket.emit('room-created', socket.id);
//       console.log(`Room created: ${roomId} by ${socket.id}`);
//     } else {
//       socket.emit('room-exists');
//     }
//   });

//   socket.on('join-room', (roomId) => {
//     const room = rooms.get(roomId);
//     if (room) {
//       room.add(socket.id);
//       socket.join(roomId);
      
//       // Notify the new user about existing participants
//       socket.emit('existing-participants', Array.from(room));
      
//       // Notify existing participants about the new user
//       socket.to(roomId).emit('user-joined', socket.id);
      
//       console.log(`User ${socket.id} joined room: ${roomId}`);
//     } else {
//       socket.emit('room-not-found');
//     }
//   });

//   socket.on('offer', ({ offer, peerId }, roomId) => {
//     console.log(`Offer from ${socket.id} to ${peerId} in room ${roomId}`);
//     socket.to(peerId).emit('offer', { offer, peerId: socket.id });
//   });

//   socket.on('answer', ({ answer, peerId }, roomId) => {
//     console.log(`Answer from ${socket.id} to ${peerId} in room ${roomId}`);
//     socket.to(peerId).emit('answer', { answer, peerId: socket.id });
//   });

//   socket.on('ice-candidate', ({ candidate, peerId }, roomId) => {
//     console.log(`ICE candidate from ${socket.id} to ${peerId} in room ${roomId}`);
//     socket.to(peerId).emit('ice-candidate', { candidate, peerId: socket.id });
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//     for (const [roomId, participants] of rooms.entries()) {
//       if (participants.has(socket.id)) {
//         participants.delete(socket.id);
//         socket.to(roomId).emit('user-disconnected', socket.id);
//         console.log(`User ${socket.id} left room ${roomId}`);
        
//         if (participants.size === 0) {
//           rooms.delete(roomId);
//           console.log(`Room ${roomId} closed`);
//         }
//       }
//     }
//   });
// });

// app.use(express.static(path.join(__dirname, 'dist')));

// app.get('/api/get-ip', (req, res) => {
//   const interfaces = require('os').networkInterfaces();
//   for (const name of Object.keys(interfaces)) {
//     for (const interface of interfaces[name]) {
//       const { address, family, internal } = interface;
//       if (family === 'IPv4' && !internal) {
//         return res.send(address);
//       }
//     }
//   }
//   res.send('0.0.0.0');
// });

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

// const PORT = process.env.PORT || 3001;
// server.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running on port ${PORT}`);
// });

//gpt 

// server.js

// server.js

// multi tesing semi works 

// // server.js
// const express = require('express');
// const http = require('http');
// const { Server } = require("socket.io");
// const path = require('path');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });

// const rooms = new Map();

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('create-room', (roomId) => {
//     socket.join(roomId);
//     rooms.set(roomId, { interviewer: socket.id, interviewees: [] });
//     console.log(`Room created: ${roomId}`);
//   });

//   socket.on('join-room', (roomId) => {
//     const room = rooms.get(roomId);
//     if (room) {
//       socket.join(roomId);
//       room.interviewees.push(socket.id);
      
//       // Notify the new user about existing participants
//       socket.emit('existing-participants', [room.interviewer, ...room.interviewees.slice(0, -1)]);
      
//       // Notify existing participants about the new user
//       socket.to(roomId).emit('user-joined', socket.id);
      
//       console.log(`User joined room: ${roomId}`);
//     } else {
//       socket.emit('room-not-found');
//     }
//   });

//   socket.on('offer', ({ offer, peerId }, roomId) => {
//     socket.to(peerId).emit('offer', { offer, peerId: socket.id });
//   });

//   socket.on('answer', ({ answer, peerId }, roomId) => {
//     socket.to(peerId).emit('answer', { answer, peerId: socket.id });
//   });

//   socket.on('ice-candidate', ({ candidate, peerId }, roomId) => {
//     socket.to(peerId).emit('ice-candidate', { candidate, peerId: socket.id });
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//     for (const [roomId, room] of rooms.entries()) {
//       if (room.interviewer === socket.id) {
//         // If interviewer disconnects, close the room
//         io.to(roomId).emit('room-closed');
//         rooms.delete(roomId);
//       } else {
//         const index = room.interviewees.indexOf(socket.id);
//         if (index !== -1) {
//           room.interviewees.splice(index, 1);
//           socket.to(roomId).emit('user-disconnected', socket.id);
//         }
//       }
//     }
//   });
// });

// app.use(express.static(path.join(__dirname, 'dist')));

// app.get('/api/get-ip', (req, res) => {
//   const interfaces = require('os').networkInterfaces();
//   for (const name of Object.keys(interfaces)) {
//     for (const interface of interfaces[name]) {
//       const { address, family, internal } = interface;
//       if (family === 'IPv4' && !internal) {
//         return res.send(address);
//       }
//     }
//   }
//   res.send('0.0.0.0');
// });

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

// const PORT = process.env.PORT || 3001;
// server.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running on port ${PORT}`);
// });


//tom test 

// server.js (works like - (start and first joined intervieews can not seen later joined intervieew))


// server.js

// updated with custom names
// added remove 

// server.js

// updated with remove participant

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
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

    socket.on('remove-participant', ({ participantId, roomId }) => {
        console.log(`Attempting to remove participant ${participantId} from room ${roomId}`);
        const room = rooms.get(roomId);

        if (room && room.get(socket.id) === 'Interviewer') {
            // Check if the participant exists in the room
            if (room.has(participantId)) {
                console.log(`Removing participant ${participantId}`);

                // Remove the participant from the room map
                room.delete(participantId);

                // Notify the removed participant
                io.to(participantId).emit('force-disconnect');

                // Notify other participants
                io.to(roomId).emit('participant-removed', participantId);

                // Force disconnect the participant's socket from the room
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