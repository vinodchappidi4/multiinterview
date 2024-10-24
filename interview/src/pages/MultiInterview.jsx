// import React, { useState, useEffect, useRef } from 'react';
// import { v4 as uuidv4 } from 'uuid';
// import io from 'socket.io-client';
// import MultiVideoRecording from '../components/MultiVideoRecording';


// const MultiInterview = () => {
//     const [roomId, setRoomId] = useState('');
//     const [name, setName] = useState('');
//     const [joined, setJoined] = useState(false);
//     const [participants, setParticipants] = useState([]);
//     const [localStream, setLocalStream] = useState(null);
//     const peerConnections = useRef({});
//     const socketRef = useRef(null);
  
//     const configuration = {
//       iceServers: [
//         { urls: 'stun:stun.l.google.com:19302' },
//       ],
//     };
  
//     useEffect(() => {
//       if (joined) {
//         initializeWebRTC();
//       }
//       return () => {
//         if (localStream) {
//           localStream.getTracks().forEach(track => track.stop());
//         }
//         Object.values(peerConnections.current).forEach(pc => pc.close());
//         if (socketRef.current) {
//           socketRef.current.disconnect();
//         }
//       };
//     }, [joined]);
  
//     const initializeWebRTC = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }).catch(() => null);
//         setLocalStream(stream);
//         if (stream) {
//           setParticipants(prev => [...prev, { id: 'local', name: 'You (Local)', stream }]);
//         }
  
//         socketRef.current = io('http://localhost:3001');
  
//         socketRef.current.on('connect', () => {
//           console.log('Connected to signaling server');
//           socketRef.current.emit('join', { roomId, name });
//         });
  
//         socketRef.current.on('user-joined', ({ userId, name }) => {
//           console.log(`User joined: ${name} (${userId})`);
//           createPeerConnection(userId, name);
//         });
  
//         socketRef.current.on('room-users', (users) => {
//           console.log('Existing users in room:', users);
//           users.forEach(user => createPeerConnection(user.id, user.name));
//         });
  
//         socketRef.current.on('offer', async ({ from, offer }) => {
//           console.log(`Received offer from ${from}`);
//           await handleOffer(from, offer);
//         });
  
//         socketRef.current.on('answer', async ({ from, answer }) => {
//           console.log(`Received answer from ${from}`);
//           await handleAnswer(from, answer);
//         });
  
//         socketRef.current.on('ice-candidate', async ({ from, candidate }) => {
//           console.log(`Received ICE candidate from ${from}`);
//           await handleIceCandidate(from, candidate);
//         });
  
//         socketRef.current.on('user-left', (userId) => {
//           console.log(`User left: ${userId}`);
//           handleUserLeft(userId);
//         });
//       } catch (error) {
//         console.error('Error initializing WebRTC:', error);
//       }
//     };
  
//     const createPeerConnection = (userId, userName) => {
//       if (peerConnections.current[userId]) return;
  
//       console.log(`Creating peer connection for ${userName} (${userId})`);
//       const pc = new RTCPeerConnection(configuration);
//       peerConnections.current[userId] = pc;
  
//       pc.onicecandidate = (event) => {
//         if (event.candidate) {
//           console.log(`Sending ICE candidate to ${userId}`);
//           socketRef.current.emit('ice-candidate', { target: userId, candidate: event.candidate });
//         }
//       };
  
//       pc.ontrack = (event) => {
//         console.log(`Received remote track from ${userName}`);
//         setParticipants(prev => {
//           const existingParticipant = prev.find(p => p.id === userId);
//           if (existingParticipant) {
//             return prev.map(p => p.id === userId ? { ...p, stream: event.streams[0] } : p);
//           } else {
//             return [...prev, { id: userId, name: userName, stream: event.streams[0] }];
//           }
//         });
//       };
  
//       if (localStream) {
//         console.log(`Adding local stream to peer connection for ${userId}`);
//         localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
//       }
  
//       pc.onnegotiationneeded = async () => {
//         try {
//           console.log(`Creating offer for ${userId}`);
//           const offer = await pc.createOffer();
//           await pc.setLocalDescription(offer);
//           socketRef.current.emit('offer', { target: userId, offer });
//         } catch (error) {
//           console.error('Error creating offer:', error);
//         }
//       };
  
//       return pc;
//     };
  
//     const handleOffer = async (userId, offer) => {
//       console.log(`Handling offer from ${userId}`);
//       const pc = peerConnections.current[userId] || createPeerConnection(userId, `User ${userId}`);
//       try {
//         await pc.setRemoteDescription(new RTCSessionDescription(offer));
//         const answer = await pc.createAnswer();
//         await pc.setLocalDescription(answer);
//         socketRef.current.emit('answer', { target: userId, answer });
//       } catch (error) {
//         console.error('Error handling offer:', error);
//       }
//     };
  
//     const handleAnswer = async (userId, answer) => {
//       console.log(`Handling answer from ${userId}`);
//       const pc = peerConnections.current[userId];
//       if (pc) {
//         try {
//           await pc.setRemoteDescription(new RTCSessionDescription(answer));
//         } catch (error) {
//           console.error('Error handling answer:', error);
//         }
//       }
//     };
  
//     const handleIceCandidate = async (userId, candidate) => {
//       console.log(`Handling ICE candidate from ${userId}`);
//       const pc = peerConnections.current[userId];
//       if (pc) {
//         try {
//           await pc.addIceCandidate(new RTCIceCandidate(candidate));
//         } catch (error) {
//           console.error('Error adding ICE candidate:', error);
//         }
//       }
//     };
  
//     const handleUserLeft = (userId) => {
//       console.log(`Handling user left: ${userId}`);
//       setParticipants(prev => prev.filter(p => p.id !== userId));
//       if (peerConnections.current[userId]) {
//         peerConnections.current[userId].close();
//         delete peerConnections.current[userId];
//       }
//     };
  
//     const handleJoin = () => {
//       if (roomId && name) {
//         setJoined(true);
//       } else {
//         alert('Please enter a room ID and your name');
//       }
//     };
  
//     const handleCreate = () => {
//       const newRoomId = uuidv4().substr(0, 8);
//       setRoomId(newRoomId);
//     };
  
//     if (!joined) {
//       return (
//         <div className="join-container">
//           <h2>Multi-Person Interview</h2>
//           <input
//             type="text"
//             placeholder="Enter Room ID"
//             value={roomId}
//             onChange={(e) => setRoomId(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Enter Your Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//           <button onClick={handleJoin}>Join Room</button>
//           <button onClick={handleCreate}>Create Room</button>
//         </div>
//       );
//     }
  
//     return (
//       <div className="interview-container">
//         <h2>Room: {roomId}</h2>
//         <div className="video-grid">
//           {participants.map((participant) => (
//             <MultiVideoRecording
//               key={participant.id}
//               stream={participant.stream}
//               name={participant.name}
//             />
//           ))}
//         </div>
//       </div>
//     );
//   };
  
//   export default MultiInterview;

// import React, { useState, useEffect, useRef } from 'react';
// import { v4 as uuidv4 } from 'uuid';
// import io from 'socket.io-client';
// import MultiVideoRecording from '../components/MultiVideoRecording';


// const MultiInterview = () => {
//     const [roomId, setRoomId] = useState('');
//     const [name, setName] = useState('');
//     const [joined, setJoined] = useState(false);
//     const [participants, setParticipants] = useState([]);
//     const [localStream, setLocalStream] = useState(null);
//     const peerConnections = useRef({});
//     const socketRef = useRef(null);
  
//     const configuration = {
//       iceServers: [
//         { urls: 'stun:stun.l.google.com:19302' },
//       ],
//     };
  
//     useEffect(() => {
//       if (joined) {
//         initializeWebRTC();
//       }
//       return () => {
//         if (localStream) {
//           localStream.getTracks().forEach(track => track.stop());
//         }
//         Object.values(peerConnections.current).forEach(pc => pc.close());
//         if (socketRef.current) {
//           socketRef.current.disconnect();
//         }
//       };
//     }, [joined]);
  
//     const initializeWebRTC = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }).catch(() => null);
//         setLocalStream(stream);
//         if (stream) {
//           setParticipants(prev => [...prev, { id: 'local', name: 'You (Local)', stream }]);
//         }
  
//         socketRef.current = io('http://localhost:3001');
  
//         socketRef.current.on('connect', () => {
//           console.log('Connected to signaling server');
//           socketRef.current.emit('join', { roomId, name });
//         });
  
//         socketRef.current.on('user-joined', ({ userId, name }) => {
//           console.log(`User joined: ${name} (${userId})`);
//           createPeerConnection(userId, name);
//         });
  
//         socketRef.current.on('room-users', (users) => {
//           console.log('Existing users in room:', users);
//           users.forEach(user => createPeerConnection(user.id, user.name));
//         });
  
//         socketRef.current.on('offer', async ({ from, offer }) => {
//           console.log(`Received offer from ${from}`);
//           await handleOffer(from, offer);
//         });
  
//         socketRef.current.on('answer', async ({ from, answer }) => {
//           console.log(`Received answer from ${from}`);
//           await handleAnswer(from, answer);
//         });
  
//         socketRef.current.on('ice-candidate', async ({ from, candidate }) => {
//           console.log(`Received ICE candidate from ${from}`);
//           await handleIceCandidate(from, candidate);
//         });
  
//         socketRef.current.on('user-left', (userId) => {
//           console.log(`User left: ${userId}`);
//           handleUserLeft(userId);
//         });
//       } catch (error) {
//         console.error('Error initializing WebRTC:', error);
//       }
//     };
  
//     const createPeerConnection = (userId, userName) => {
//       if (peerConnections.current[userId]) return;
  
//       console.log(`Creating peer connection for ${userName} (${userId})`);
//       const pc = new RTCPeerConnection(configuration);
//       peerConnections.current[userId] = pc;
  
//       pc.onicecandidate = (event) => {
//         if (event.candidate) {
//           console.log(`Sending ICE candidate to ${userId}`);
//           socketRef.current.emit('ice-candidate', { target: userId, candidate: event.candidate });
//         }
//       };
  
//       pc.ontrack = (event) => {
//         console.log(`Received remote track from ${userName}`);
//         setParticipants(prev => {
//           if (prev.find(p => p.id === userId)) return prev;
//           return [...prev, { id: userId, name: userName, stream: event.streams[0] }];
//         });
//       };
  
//       if (localStream) {
//         console.log(`Adding local stream to peer connection for ${userId}`);
//         localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
//       }
  
//       pc.onnegotiationneeded = async () => {
//         try {
//           console.log(`Creating offer for ${userId}`);
//           const offer = await pc.createOffer();
//           await pc.setLocalDescription(offer);
//           socketRef.current.emit('offer', { target: userId, offer });
//         } catch (error) {
//           console.error('Error creating offer:', error);
//         }
//       };
  
//       return pc;
//     };
  
//     const handleOffer = async (userId, offer) => {
//       console.log(`Handling offer from ${userId}`);
//       const pc = peerConnections.current[userId] || createPeerConnection(userId, `User ${userId}`);
//       try {
//         await pc.setRemoteDescription(new RTCSessionDescription(offer));
//         const answer = await pc.createAnswer();
//         await pc.setLocalDescription(answer);
//         socketRef.current.emit('answer', { target: userId, answer });
//       } catch (error) {
//         console.error('Error handling offer:', error);
//       }
//     };
  
//     const handleAnswer = async (userId, answer) => {
//       console.log(`Handling answer from ${userId}`);
//       const pc = peerConnections.current[userId];
//       if (pc) {
//         try {
//           await pc.setRemoteDescription(new RTCSessionDescription(answer));
//         } catch (error) {
//           console.error('Error handling answer:', error);
//         }
//       }
//     };
  
//     const handleIceCandidate = async (userId, candidate) => {
//       console.log(`Handling ICE candidate from ${userId}`);
//       const pc = peerConnections.current[userId];
//       if (pc) {
//         try {
//           await pc.addIceCandidate(new RTCIceCandidate(candidate));
//         } catch (error) {
//           console.error('Error adding ICE candidate:', error);
//         }
//       }
//     };
  
//     const handleUserLeft = (userId) => {
//       console.log(`Handling user left: ${userId}`);
//       setParticipants(prev => prev.filter(p => p.id !== userId));
//       if (peerConnections.current[userId]) {
//         peerConnections.current[userId].close();
//         delete peerConnections.current[userId];
//       }
//     };
  
//     const handleJoin = () => {
//       if (roomId && name) {
//         setJoined(true);
//       } else {
//         alert('Please enter a room ID and your name');
//       }
//     };
  
//     const handleCreate = () => {
//       const newRoomId = uuidv4().substr(0, 8);
//       setRoomId(newRoomId);
//     };
  
//     if (!joined) {
//       return (
//         <div className="join-container">
//           <h2>Multi-Person Interview</h2>
//           <input
//             type="text"
//             placeholder="Enter Room ID"
//             value={roomId}
//             onChange={(e) => setRoomId(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Enter Your Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//           <button onClick={handleJoin}>Join Room</button>
//           <button onClick={handleCreate}>Create Room</button>
//         </div>
//       );
//     }
  
//     return (
//       <div className="interview-container">
//         <h2>Room: {roomId}</h2>
//         <div className="video-grid">
//           {participants.map((participant) => (
//             <MultiVideoRecording
//               key={participant.id}
//               stream={participant.stream}
//               name={participant.name}
//             />
//           ))}
//         </div>
//       </div>
//     );
//   };
  
//   export default MultiInterview;


//semi works 

// // streming later not working 

// import React, { useState, useEffect, useRef } from 'react';
// import MultiVideoRecording from '../components/MultiVideoRecording';

// const MultiInterview = () => {
//   const [roomId, setRoomId] = useState('');
//   const [userName, setUserName] = useState('');
//   const [joinedRoom, setJoinedRoom] = useState(false);
//   const [peers, setPeers] = useState({});
//   const socketRef = useRef();
//   const userStreamRef = useRef();
//   const peersRef = useRef({});

//   useEffect(() => {
//     socketRef.current = new WebSocket('ws://localhost:8080');
//     socketRef.current.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       handleSocketMessage(data);
//     };

//     return () => {
//       socketRef.current.close();
//     };
//   }, []);

//   const handleSocketMessage = (data) => {
//     switch (data.type) {
//       case 'room_created':
//       case 'room_joined':
//         handleRoomJoined(data.yourID);
//         break;
//       case 'all_users':
//         handleAllUsers(data.users);
//         break;
//       case 'user_joined':
//         handleUserJoined(data.socketId, data.userName);
//         break;
//       case 'offer':
//         handleReceiveOffer(data);
//         break;
//       case 'answer':
//         handleReceiveAnswer(data);
//         break;
//       case 'ice_candidate':
//         handleNewICECandidate(data);
//         break;
//       case 'user_left':
//         handleUserLeft(data.socketId);
//         break;
//     }
//   };

//   const createRoom = () => {
//     if (roomId && userName) {
//       socketRef.current.send(JSON.stringify({ type: 'create_room', roomId, userName }));
//     }
//   };

//   const joinRoom = () => {
//     if (roomId && userName) {
//       socketRef.current.send(JSON.stringify({ type: 'join_room', roomId, userName }));
//     }
//   };

//   const handleRoomJoined = (yourID) => {
//     setJoinedRoom(true);
//     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         userStreamRef.current = stream;
//         setPeers((prevPeers) => ({ ...prevPeers, [yourID]: { stream, userName: 'You (' + userName + ')' } }));
//       })
//       .catch((error) => {
//         console.error('Error accessing media devices:', error);
//         setJoinedRoom(true);
//       });
//   };

//   const handleAllUsers = (users) => {
//     users.forEach(user => createPeer(user.socketId, user.userName));
//   };

//   const handleUserJoined = (socketId, userName) => {
//     createPeer(socketId, userName);
//   };

//   const createPeer = (socketId, userName) => {
//     const peer = new RTCPeerConnection({
//       iceServers: [
//         { urls: 'stun:stun.l.google.com:19302' },
//         { urls: 'stun:global.stun.twilio.com:3478' }
//       ]
//     });

//     peer.onicecandidate = (event) => {
//       if (event.candidate) {
//         socketRef.current.send(JSON.stringify({
//           type: 'ice_candidate',
//           targetId: socketId,
//           candidate: event.candidate
//         }));
//       }
//     };

//     peer.ontrack = (event) => {
//       setPeers(prevPeers => ({
//         ...prevPeers,
//         [socketId]: { ...prevPeers[socketId], stream: event.streams[0] }
//       }));
//     };

//     if (userStreamRef.current) {
//       userStreamRef.current.getTracks().forEach(track => {
//         peer.addTrack(track, userStreamRef.current);
//       });
//     }

//     peer.onnegotiationneeded = () => {
//       peer.createOffer()
//         .then(offer => peer.setLocalDescription(offer))
//         .then(() => {
//           socketRef.current.send(JSON.stringify({
//             type: 'offer',
//             targetId: socketId,
//             sdp: peer.localDescription
//           }));
//         })
//         .catch(error => console.error("Error creating offer:", error));
//     };

//     peersRef.current[socketId] = peer;
//     setPeers(prevPeers => ({ ...prevPeers, [socketId]: { peer, userName } }));
//   };

//   const handleReceiveOffer = async (data) => {
//     const peer = new RTCPeerConnection({
//       iceServers: [
//         { urls: 'stun:stun.l.google.com:19302' },
//         { urls: 'stun:global.stun.twilio.com:3478' }
//       ]
//     });

//     peer.onicecandidate = (event) => {
//       if (event.candidate) {
//         socketRef.current.send(JSON.stringify({
//           type: 'ice_candidate',
//           targetId: data.callerId,
//           candidate: event.candidate
//         }));
//       }
//     };

//     peer.ontrack = (event) => {
//       setPeers(prevPeers => ({
//         ...prevPeers,
//         [data.callerId]: { ...prevPeers[data.callerId], stream: event.streams[0] }
//       }));
//     };

//     if (userStreamRef.current) {
//       userStreamRef.current.getTracks().forEach(track => {
//         peer.addTrack(track, userStreamRef.current);
//       });
//     }

//     try {
//       await peer.setRemoteDescription(new RTCSessionDescription(data.sdp));
//       const answer = await peer.createAnswer();
//       await peer.setLocalDescription(answer);
//       socketRef.current.send(JSON.stringify({
//         type: 'answer',
//         targetId: data.callerId,
//         sdp: peer.localDescription
//       }));
//     } catch (error) {
//       console.error("Error handling offer:", error);
//     }

//     peersRef.current[data.callerId] = peer;
//   };

//   const handleReceiveAnswer = async (data) => {
//     const peer = peersRef.current[data.callerId];
//     if (peer) {
//       try {
//         await peer.setRemoteDescription(new RTCSessionDescription(data.sdp));
//       } catch (error) {
//         console.error("Error setting remote description:", error);
//       }
//     }
//   };

//   const handleNewICECandidate = (data) => {
//     const peer = peersRef.current[data.callerId];
//     if (peer) {
//       peer.addIceCandidate(new RTCIceCandidate(data.candidate))
//         .catch(e => console.error("Error adding ICE candidate:", e));
//     }
//   };

//   const handleUserLeft = (socketId) => {
//     if (peersRef.current[socketId]) {
//       peersRef.current[socketId].close();
//     }
//     delete peersRef.current[socketId];
//     setPeers(prevPeers => {
//       const newPeers = { ...prevPeers };
//       delete newPeers[socketId];
//       return newPeers;
//     });
//   };

//   return (
//     <div>
//       {!joinedRoom ? (
//         <div>
//           <input
//             type="text"
//             placeholder="Room ID"
//             value={roomId}
//             onChange={(e) => setRoomId(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Your Name"
//             value={userName}
//             onChange={(e) => setUserName(e.target.value)}
//           />
//           <button onClick={createRoom}>Create Room</button>
//           <button onClick={joinRoom}>Join Room</button>
//         </div>
//       ) : (
//         <div>
//           <h2>Room: {roomId}</h2>
//           <div style={{ display: 'flex', flexWrap: 'wrap' }}>
//             {Object.entries(peers).map(([peerId, { stream, userName }]) => (
//               <MultiVideoRecording key={peerId} stream={stream} userName={userName} />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MultiInterview;


//converted 2 to multi 

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import RoomCreation from '../components/RoomCreation';
import VideoRoom from '../components/VideoRoom';

const socket = io('http://localhost:3001');

function MultiInterview() {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [inRoom, setInRoom] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    return () => {
      socket.off('connect');
    };
  }, []);

  const createRoom = (name) => {
    const newRoomId = Math.random().toString(36).substring(7);
    setRoomId(newRoomId);
    setUsername(name);
    setInRoom(true);
    socket.emit('create-room', newRoomId);
    console.log(`Room created: ${newRoomId}`);
  };

  const joinRoom = (name, roomToJoin) => {
    setRoomId(roomToJoin);
    setUsername(name);
    setInRoom(true);
    socket.emit('join-room', roomToJoin);
    console.log(`Joining room: ${roomToJoin}`);
  };

  return (
    <div className="App">
      {!inRoom ? (
        <RoomCreation onCreateRoom={createRoom} onJoinRoom={joinRoom} />
      ) : (
        <VideoRoom roomId={roomId} username={username} socket={socket} />
      )}
    </div>
  );
}

export default MultiInterview;


// // tested 

// import React, { useState, useEffect, useCallback } from 'react';
// import { io } from 'socket.io-client';
// import RoomCreation from '../components/RoomCreation';
// import VideoRoom from '../components/VideoRoom';

// const socket = io('http://localhost:3001');

// function MultiInterview() {
//   const [roomId, setRoomId] = useState('');
//   const [username, setUsername] = useState('');
//   const [inRoom, setInRoom] = useState(false);
//   const [refreshKey, setRefreshKey] = useState(0);

//   const startAutoRefresh = useCallback(() => {
//     const refreshInterval = setInterval(() => {
//       setRefreshKey(prevKey => prevKey + 1);
//     }, 5000);

//     return () => clearInterval(refreshInterval);
//   }, []);

//   useEffect(() => {
//     socket.on('connect', () => {
//       console.log('Connected to server');
//     });

//     return () => {
//       socket.off('connect');
//     };
//   }, []);

//   useEffect(() => {
//     let cleanup;
//     if (inRoom) {
//       cleanup = startAutoRefresh();
//     }
//     return () => {
//       if (cleanup) cleanup();
//     };
//   }, [inRoom, startAutoRefresh]);

//   const createRoom = (name) => {
//     const newRoomId = Math.random().toString(36).substring(7);
//     setRoomId(newRoomId);
//     setUsername(name);
//     setInRoom(true);
//     socket.emit('create-room', newRoomId);
//     console.log(`Room created: ${newRoomId}`);
//   };

//   const joinRoom = (name, roomToJoin) => {
//     setRoomId(roomToJoin);
//     setUsername(name);
//     setInRoom(true);
//     socket.emit('join-room', roomToJoin);
//     console.log(`Joining room: ${roomToJoin}`);
//   };

//   return (
//     <div className="App">
//       {!inRoom ? (
//         <RoomCreation onCreateRoom={createRoom} onJoinRoom={joinRoom} />
//       ) : (
//         <div key={refreshKey}>
//           <VideoRoom roomId={roomId} username={username} socket={socket} />
//         </div>
//       )}
//     </div>
//   );
// }

// export default MultiInterview;


//render 

// import React, { useState, useEffect } from 'react';
// import { io } from 'socket.io-client';
// import RoomCreation from '../components/RoomCreation';
// import VideoRoom from '../components/VideoRoom';

// const socket = io('http://localhost:3001');

// function MultiInterview() {
//   const [roomId, setRoomId] = useState('');
//   const [username, setUsername] = useState('');
//   const [inRoom, setInRoom] = useState(false);
//   const [users, setUsers] = useState([]); // Track users in the room

//   useEffect(() => {
//     // Handle the socket connection
//     socket.on('connect', () => {
//       console.log('Connected to server');
//     });

//     // Listen for when a user joins the room
//     socket.on('user-joined', (newUser) => {
//       console.log(`${newUser} joined the room`);
//       setUsers((prevUsers) => [...prevUsers, newUser]); // Add new user to the list
//     });
    

//     return () => {
//       socket.off('connect');
//       socket.off('user-joined');
//     };
//   }, []);

//   const createRoom = (name) => {
//     const newRoomId = Math.random().toString(36).substring(7);
//     setRoomId(newRoomId);
//     setUsername(name);
//     setInRoom(true);
//     socket.emit('create-room', newRoomId);
//     console.log(`Room created: ${newRoomId}`);
//   };

//   const joinRoom = (name, roomToJoin) => {
//     setRoomId(roomToJoin);
//     setUsername(name);
//     setInRoom(true);
//     socket.emit('join-room', roomToJoin);
//     console.log(`Joining room: ${roomToJoin}`);
//   };

//   return (
//     <div className="App">
//       {!inRoom ? (
//         <RoomCreation onCreateRoom={createRoom} onJoinRoom={joinRoom} />
//       ) : (
//         <VideoRoom roomId={roomId} username={username} users={users} socket={socket} />
//       )}
//     </div>
//   );
// }

// export default MultiInterview;
