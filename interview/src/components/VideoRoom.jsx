// import React, { useEffect, useRef, useState } from 'react';

// function VideoRoom({ roomId, username, socket }) {
//   const [peers, setPeers] = useState({});
//   const localVideoRef = useRef();
//   const peerConnections = useRef({});
//   const streamRefs = useRef({});

//   const configuration = {
//     iceServers: [
//       { urls: 'stun:stun.l.google.com:19302' },
//       { urls: 'stun:stun1.l.google.com:19302' },
//       { urls: 'stun:stun2.l.google.com:19302' },
//     ],
//   };

//   useEffect(() => {
//     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         localVideoRef.current.srcObject = stream;
//         socket.emit('join-room', roomId, username);

//         socket.on('user-joined', ({ userId, username: peerUsername }) => {
//           console.log(`User joined: ${userId} (${peerUsername})`);
//           const peerConnection = new RTCPeerConnection(configuration);
//           peerConnections.current[userId] = peerConnection;

//           stream.getTracks().forEach((track) => {
//             peerConnection.addTrack(track, stream);
//           });

//           peerConnection.onicecandidate = (event) => {
//             if (event.candidate) {
//               socket.emit('ice-candidate', event.candidate, roomId, userId);
//             }
//           };

//           peerConnection.ontrack = (event) => {
//             if (!streamRefs.current[userId]) {
//               streamRefs.current[userId] = event.streams[0];
//               setPeers(prevPeers => ({
//                 ...prevPeers,
//                 [userId]: { username: peerUsername, stream: event.streams[0] }
//               }));
//             }
//           };

//           peerConnection.createOffer()
//             .then(offer => peerConnection.setLocalDescription(offer))
//             .then(() => {
//               socket.emit('offer', peerConnection.localDescription, roomId, userId);
//             });
//         });

//         socket.on('offer', ({ offer, userId, username: peerUsername }) => {
//           console.log(`Received offer from: ${userId} (${peerUsername})`);
//           const peerConnection = new RTCPeerConnection(configuration);
//           peerConnections.current[userId] = peerConnection;

//           stream.getTracks().forEach((track) => {
//             peerConnection.addTrack(track, stream);
//           });

//           peerConnection.onicecandidate = (event) => {
//             if (event.candidate) {
//               socket.emit('ice-candidate', event.candidate, roomId, userId);
//             }
//           };

//           peerConnection.ontrack = (event) => {
//             if (!streamRefs.current[userId]) {
//               streamRefs.current[userId] = event.streams[0];
//               setPeers(prevPeers => ({
//                 ...prevPeers,
//                 [userId]: { username: peerUsername, stream: event.streams[0] }
//               }));
//             }
//           };

//           peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
//             .then(() => peerConnection.createAnswer())
//             .then(answer => peerConnection.setLocalDescription(answer))
//             .then(() => {
//               socket.emit('answer', peerConnection.localDescription, roomId, userId);
//             });
//         });

//         socket.on('answer', ({ answer, userId }) => {
//           console.log(`Received answer from: ${userId}`);
//           const peerConnection = peerConnections.current[userId];
//           peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
//         });

//         socket.on('ice-candidate', ({ candidate, userId }) => {
//           console.log(`Received ICE candidate from: ${userId}`);
//           const peerConnection = peerConnections.current[userId];
//           peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//         });

//         socket.on('user-disconnected', (userId) => {
//           console.log(`User disconnected: ${userId}`);
//           if (peerConnections.current[userId]) {
//             peerConnections.current[userId].close();
//             delete peerConnections.current[userId];
//           }
//           if (streamRefs.current[userId]) {
//             delete streamRefs.current[userId];
//           }
//           setPeers(prevPeers => {
//             const newPeers = { ...prevPeers };
//             delete newPeers[userId];
//             return newPeers;
//           });
//         });
//       })
//       .catch(error => console.error('Error accessing media devices:', error));

//     return () => {
//       socket.off('user-joined');
//       socket.off('offer');
//       socket.off('answer');
//       socket.off('ice-candidate');
//       socket.off('user-disconnected');
//       Object.values(peerConnections.current).forEach(pc => pc.close());
//     };
//   }, [roomId, username, socket]);

//   return (
//     <div>
//       <h2>Room: {roomId}</h2>
//       <div className="video-container">
//         <div className="video-item">
//           <video ref={localVideoRef} autoPlay muted playsInline />
//           <p>{username} (You)</p>
//         </div>
//         {Object.entries(peers).map(([userId, { username: peerUsername, stream }]) => (
//           <div key={userId} className="video-item">
//             <video
//               ref={el => { if (el && stream) el.srcObject = stream; }}
//               autoPlay
//               playsInline
//             />
//             <p>{peerUsername}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default VideoRoom;

//semi displays names 

// import React, { useEffect, useRef, useState } from 'react';

// function VideoRoom({ roomId, username, socket }) {
//   const [peers, setPeers] = useState({});
//   const localVideoRef = useRef();
//   const peerConnections = useRef({});
//   const streamRefs = useRef({});

//   const configuration = {
//     iceServers: [
//       { urls: 'stun:stun.l.google.com:19302' },
//       { urls: 'stun:stun1.l.google.com:19302' },
//       { urls: 'stun:stun2.l.google.com:19302' },
//     ],
//   };

//   useEffect(() => {
//     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         localVideoRef.current.srcObject = stream;
//         socket.emit('join-room', roomId, username);

//         socket.on('room-users', (users) => {
//           users.forEach(({ userId, username: peerUsername }) => {
//             if (userId !== socket.id) {
//               createPeerConnection(userId, peerUsername, stream);
//             }
//           });
//         });

//         socket.on('user-joined', ({ userId, username: peerUsername }) => {
//           console.log(`User joined: ${userId} (${peerUsername})`);
//           createPeerConnection(userId, peerUsername, stream);
//         });

//         socket.on('offer', ({ offer, userId, username: peerUsername }) => {
//           console.log(`Received offer from: ${userId} (${peerUsername})`);
//           handleOffer(offer, userId, peerUsername, stream);
//         });

//         socket.on('answer', ({ answer, userId }) => {
//           console.log(`Received answer from: ${userId}`);
//           const peerConnection = peerConnections.current[userId];
//           peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
//             .catch(error => console.error('Error setting remote description:', error));
//         });

//         socket.on('ice-candidate', ({ candidate, userId }) => {
//           console.log(`Received ICE candidate from: ${userId}`);
//           const peerConnection = peerConnections.current[userId];
//           peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
//             .catch(error => console.error('Error adding ICE candidate:', error));
//         });

//         socket.on('user-disconnected', (userId) => {
//           console.log(`User disconnected: ${userId}`);
//           if (peerConnections.current[userId]) {
//             peerConnections.current[userId].close();
//             delete peerConnections.current[userId];
//           }
//           if (streamRefs.current[userId]) {
//             delete streamRefs.current[userId];
//           }
//           setPeers(prevPeers => {
//             const newPeers = { ...prevPeers };
//             delete newPeers[userId];
//             return newPeers;
//           });
//         });
//       })
//       .catch(error => console.error('Error accessing media devices:', error));

//     return () => {
//       socket.off('room-users');
//       socket.off('user-joined');
//       socket.off('offer');
//       socket.off('answer');
//       socket.off('ice-candidate');
//       socket.off('user-disconnected');
//       Object.values(peerConnections.current).forEach(pc => pc.close());
//     };
//   }, [roomId, username, socket]);

//   const createPeerConnection = (userId, peerUsername, stream) => {
//     const peerConnection = new RTCPeerConnection(configuration);
//     peerConnections.current[userId] = peerConnection;

//     stream.getTracks().forEach((track) => {
//       peerConnection.addTrack(track, stream);
//     });

//     peerConnection.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit('ice-candidate', event.candidate, roomId, userId);
//       }
//     };

//     peerConnection.ontrack = (event) => {
//       if (!streamRefs.current[userId]) {
//         streamRefs.current[userId] = event.streams[0];
//         setPeers(prevPeers => ({
//           ...prevPeers,
//           [userId]: { username: peerUsername, stream: event.streams[0] }
//         }));
//       }
//     };

//     peerConnection.createOffer()
//       .then(offer => peerConnection.setLocalDescription(offer))
//       .then(() => {
//         socket.emit('offer', peerConnection.localDescription, roomId, userId);
//       })
//       .catch(error => console.error('Error creating offer:', error));
//   };

//   const handleOffer = (offer, userId, peerUsername, stream) => {
//     const peerConnection = new RTCPeerConnection(configuration);
//     peerConnections.current[userId] = peerConnection;

//     stream.getTracks().forEach((track) => {
//       peerConnection.addTrack(track, stream);
//     });

//     peerConnection.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit('ice-candidate', event.candidate, roomId, userId);
//       }
//     };

//     peerConnection.ontrack = (event) => {
//       if (!streamRefs.current[userId]) {
//         streamRefs.current[userId] = event.streams[0];
//         setPeers(prevPeers => ({
//           ...prevPeers,
//           [userId]: { username: peerUsername, stream: event.streams[0] }
//         }));
//       }
//     };

//     peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
//       .then(() => peerConnection.createAnswer())
//       .then(answer => peerConnection.setLocalDescription(answer))
//       .then(() => {
//         socket.emit('answer', peerConnection.localDescription, roomId, userId);
//       })
//       .catch(error => console.error('Error handling offer:', error));
//   };

//   return (
//     <div>
//       <h2>Room: {roomId}</h2>
//       <div className="video-container">
//         <div className="video-item">
//           <video ref={localVideoRef} autoPlay muted playsInline />
//           <p>{username} (You)</p>
//         </div>
//         {Object.entries(peers).map(([userId, { username: peerUsername, stream }]) => (
//           <div key={userId} className="video-item">
//             <video
//               ref={el => {
//                 if (el && stream) el.srcObject = stream;
//               }}
//               autoPlay
//               playsInline
//             />
//             <p>{peerUsername}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default VideoRoom;

//

// // semi works 2 

// import React, { useEffect, useRef, useState } from 'react';

// function VideoRoom({ roomId, username, socket }) {
//   const [peers, setPeers] = useState({});
//   const localVideoRef = useRef();
//   const peerConnections = useRef({});
//   const localStream = useRef(null);

//   const configuration = {
//     iceServers: [
//         { urls: 'stun:stun.services.mozilla.com' },
//       { urls: 'stun:stun.l.google.com:19302' },
//       { urls: 'stun:stun1.l.google.com:19302' },
//       { urls: 'stun:stun2.l.google.com:19302' },
//     ],
//   };

//   useEffect(() => {
//     async function setupMediaAndJoinRoom() {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         localStream.current = stream;
//         localVideoRef.current.srcObject = stream;
//         socket.emit('join-room', roomId, username);
//       } catch (error) {
//         console.error('Error accessing media devices:', error);
//       }
//     }

//     setupMediaAndJoinRoom();

//     socket.on('user-joined', handleUserJoined);
//     socket.on('user-disconnected', handleUserDisconnected);
//     socket.on('receive-offer', handleReceiveOffer);
//     socket.on('receive-answer', handleReceiveAnswer);
//     socket.on('receive-ice-candidate', handleReceiveIceCandidate);

//     return () => {
//       socket.off('user-joined', handleUserJoined);
//       socket.off('user-disconnected', handleUserDisconnected);
//       socket.off('receive-offer', handleReceiveOffer);
//       socket.off('receive-answer', handleReceiveAnswer);
//       socket.off('receive-ice-candidate', handleReceiveIceCandidate);
//       Object.values(peerConnections.current).forEach(pc => pc.close());
//       if (localStream.current) {
//         localStream.current.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, [roomId, username, socket]);

//   async function createPeerConnection(userId, initiator = false) {
//     const peerConnection = new RTCPeerConnection(configuration);
//     peerConnections.current[userId] = peerConnection;

//     localStream.current.getTracks().forEach((track) => {
//       peerConnection.addTrack(track, localStream.current);
//     });

//     peerConnection.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit('send-ice-candidate', { candidate: event.candidate, to: userId });
//       }
//     };

//     peerConnection.ontrack = (event) => {
//       setPeers(prevPeers => ({
//         ...prevPeers,
//         [userId]: { ...prevPeers[userId], stream: event.streams[0] }
//       }));
//     };

//     if (initiator) {
//       try {
//         const offer = await peerConnection.createOffer();
//         await peerConnection.setLocalDescription(offer);
//         socket.emit('send-offer', { offer, to: userId });
//       } catch (error) {
//         console.error('Error creating offer:', error);
//       }
//     }

//     return peerConnection;
//   }

//   async function handleUserJoined({ userId, username: peerUsername }) {
//     console.log(`User joined: ${userId} (${peerUsername})`);
//     setPeers(prevPeers => ({
//       ...prevPeers,
//       [userId]: { username: peerUsername, stream: null }
//     }));
//     await createPeerConnection(userId, true);
//   }

//   function handleUserDisconnected(userId) {
//     console.log(`User disconnected: ${userId}`);
//     if (peerConnections.current[userId]) {
//       peerConnections.current[userId].close();
//       delete peerConnections.current[userId];
//     }
//     setPeers(prevPeers => {
//       const newPeers = { ...prevPeers };
//       delete newPeers[userId];
//       return newPeers;
//     });
//   }

//   async function handleReceiveOffer({ offer, from }) {
//     console.log(`Received offer from: ${from}`);
//     const peerConnection = await createPeerConnection(from);
//     try {
//       await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
//       const answer = await peerConnection.createAnswer();
//       await peerConnection.setLocalDescription(answer);
//       socket.emit('send-answer', { answer, to: from });
//     } catch (error) {
//       console.error('Error handling offer:', error);
//     }
//   }

//   async function handleReceiveAnswer({ answer, from }) {
//     console.log(`Received answer from: ${from}`);
//     const peerConnection = peerConnections.current[from];
//     if (peerConnection) {
//       try {
//         await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
//       } catch (error) {
//         console.error('Error setting remote description:', error);
//       }
//     }
//   }

//   async function handleReceiveIceCandidate({ candidate, from }) {
//     console.log(`Received ICE candidate from: ${from}`);
//     const peerConnection = peerConnections.current[from];
//     if (peerConnection) {
//       try {
//         await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//       } catch (error) {
//         console.error('Error adding ICE candidate:', error);
//       }
//     }
//   }

//   return (
//     <div>
//       <h2>Room: {roomId}</h2>
//       <div className="video-container">
//         <div className="video-item">
//           <video ref={localVideoRef} autoPlay muted playsInline />
//           <p>{username} (You)</p>
//         </div>
//         {Object.entries(peers).map(([userId, { username: peerUsername, stream }]) => (
//           <div key={userId} className="video-item">
//             <video
//               ref={el => {
//                 if (el && stream) el.srcObject = stream;
//               }}
//               autoPlay
//               playsInline
//             />
//             <p>{peerUsername}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default VideoRoom;


// updated above + 3 show name of 1 

// import React, { useEffect, useRef, useState } from 'react';

// function VideoRoom({ roomId, username, socket }) {
//   const [peers, setPeers] = useState({});
//   const localVideoRef = useRef();
//   const peerConnections = useRef({});
//   const localStream = useRef(null);

//   const configuration = {
//     iceServers: [
//         { urls: 'stun:stun.services.mozilla.com' },
//       { urls: 'stun:stun.l.google.com:19302' },
//       { urls: 'stun:stun1.l.google.com:19302' },
//       { urls: 'stun:stun2.l.google.com:19302' },
//     ],
//   };

//   useEffect(() => {
//     async function setupMediaAndJoinRoom() {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         localStream.current = stream;
//         localVideoRef.current.srcObject = stream;
//         socket.emit('join-room', roomId, username);
//       } catch (error) {
//         console.error('Error accessing media devices:', error);
//       }
//     }

//     setupMediaAndJoinRoom();

//     socket.on('user-joined', handleUserJoined);
//     socket.on('user-disconnected', handleUserDisconnected);
//     socket.on('receive-offer', handleReceiveOffer);
//     socket.on('receive-answer', handleReceiveAnswer);
//     socket.on('receive-ice-candidate', handleReceiveIceCandidate);

//     // Request existing peers in the room
//     socket.emit('request-existing-peers', roomId);

//     // Handle existing peers
//     socket.on('existing-peers', handleExistingPeers);

//     return () => {
//       socket.off('user-joined', handleUserJoined);
//       socket.off('user-disconnected', handleUserDisconnected);
//       socket.off('receive-offer', handleReceiveOffer);
//       socket.off('receive-answer', handleReceiveAnswer);
//       socket.off('receive-ice-candidate', handleReceiveIceCandidate);
//       socket.off('existing-peers', handleExistingPeers);
//       Object.values(peerConnections.current).forEach(pc => pc.close());
//       if (localStream.current) {
//         localStream.current.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, [roomId, username, socket]);

// //   async function createPeerConnection(userId, initiator = false) {
// //     const peerConnection = new RTCPeerConnection(configuration);
// //     peerConnections.current[userId] = peerConnection;

// //     localStream.current.getTracks().forEach((track) => {
// //       peerConnection.addTrack(track, localStream.current);
// //     });

// //     peerConnection.onicecandidate = (event) => {
// //       if (event.candidate) {
// //         socket.emit('send-ice-candidate', { candidate: event.candidate, to: userId });
// //       }
// //     };

// //     peerConnection.ontrack = (event) => {
// //       setPeers(prevPeers => ({
// //         ...prevPeers,
// //         [userId]: { ...prevPeers[userId], stream: event.streams[0] }
// //       }));
// //     };

// //     if (initiator) {
// //       try {
// //         const offer = await peerConnection.createOffer();
// //         await peerConnection.setLocalDescription(offer);
// //         socket.emit('send-offer', { offer, to: userId });
// //       } catch (error) {
// //         console.error('Error creating offer:', error);
// //       }
// //     }

// //     return peerConnection;
// //   }

// // async function createPeerConnection(userId, initiator = false) {
// //     const peerConnection = new RTCPeerConnection(configuration);
// //     peerConnections.current[userId] = peerConnection;
  
// //     // Ensure that localStream exists before adding tracks
// //     if (localStream.current) {
// //       localStream.current.getTracks().forEach((track) => {
// //         peerConnection.addTrack(track, localStream.current);
// //       });
// //     } else {
// //       console.error('localStream is not initialized yet');
// //       return;
// //     }
  
// //     peerConnection.onicecandidate = (event) => {
// //       if (event.candidate) {
// //         socket.emit('send-ice-candidate', { candidate: event.candidate, to: userId });
// //       }
// //     };
  
// //     peerConnection.ontrack = (event) => {
// //       setPeers((prevPeers) => ({
// //         ...prevPeers,
// //         [userId]: { ...prevPeers[userId], stream: event.streams[0] }
// //       }));
// //     };
  
// //     if (initiator) {
// //       try {
// //         const offer = await peerConnection.createOffer();
// //         await peerConnection.setLocalDescription(offer);
// //         socket.emit('send-offer', { offer, to: userId });
// //       } catch (error) {
// //         console.error('Error creating offer:', error);
// //       }
// //     }
  
// //     return peerConnection;
// //   }
// async function createPeerConnection(userId, initiator = false) {
//     const peerConnection = new RTCPeerConnection(configuration);
//     peerConnections.current[userId] = peerConnection;
  
//     // Ensure that localStream exists before adding tracks
//     if (localStream.current) {
//       localStream.current.getTracks().forEach((track) => {
//         peerConnection.addTrack(track, localStream.current);
//       });
//     } else {
//       console.error('localStream is not initialized yet');
//       return null; // Return early if localStream is not ready
//     }
  
//     peerConnection.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit('send-ice-candidate', { candidate: event.candidate, to: userId });
//       }
//     };
  
//     peerConnection.ontrack = (event) => {
//       setPeers((prevPeers) => ({
//         ...prevPeers,
//         [userId]: { ...prevPeers[userId], stream: event.streams[0] }
//       }));
//     };
  
//     if (initiator) {
//       try {
//         const offer = await peerConnection.createOffer();
//         await peerConnection.setLocalDescription(offer);
//         socket.emit('send-offer', { offer, to: userId });
//       } catch (error) {
//         console.error('Error creating offer:', error);
//       }
//     }
  
//     return peerConnection;
//   }
  

//   async function handleUserJoined({ userId, username: peerUsername }) {
//     console.log(`User joined: ${userId} (${peerUsername})`);
//     setPeers(prevPeers => ({
//       ...prevPeers,
//       [userId]: { username: peerUsername, stream: null }
//     }));
//     await createPeerConnection(userId, true);
//   }

//   function handleUserDisconnected(userId) {
//     console.log(`User disconnected: ${userId}`);
//     if (peerConnections.current[userId]) {
//       peerConnections.current[userId].close();
//       delete peerConnections.current[userId];
//     }
//     setPeers(prevPeers => {
//       const newPeers = { ...prevPeers };
//       delete newPeers[userId];
//       return newPeers;
//     });
//   }

// //   async function handleReceiveOffer({ offer, from }) {
// //     console.log(`Received offer from: ${from}`);
// //     const peerConnection = await createPeerConnection(from);
// //     try {
// //       await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
// //       const answer = await peerConnection.createAnswer();
// //       await peerConnection.setLocalDescription(answer);
// //       socket.emit('send-answer', { answer, to: from });
// //     } catch (error) {
// //       console.error('Error handling offer:', error);
// //     }
// //   } 

// async function handleReceiveOffer({ offer, from }) {
//     console.log(`Received offer from: ${from}`);
  
//     // Ensure peer connection is created
//     let peerConnection = peerConnections.current[from];
//     if (!peerConnection) {
//       peerConnection = await createPeerConnection(from);
//       if (!peerConnection) {
//         console.error('Failed to create peer connection');
//         return; // Abort if we couldn't create the peer connection
//       }
//     }
  
//     try {
//       // Only set remote description if signalingState is not stable
//       if (peerConnection.signalingState === 'stable') {
//         console.warn('Peer connection is in stable state, skipping offer handling.');
//         return;
//       }
  
//       await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
//       const answer = await peerConnection.createAnswer();
//       await peerConnection.setLocalDescription(answer);
//       socket.emit('send-answer', { answer, to: from });
//     } catch (error) {
//       console.error('Error handling offer:', error);
//     }
//   }

// //   async function handleReceiveAnswer({ answer, from }) {
// //     console.log(`Received answer from: ${from}`);
// //     const peerConnection = peerConnections.current[from];
// //     if (peerConnection) {
// //       try {
// //         await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
// //       } catch (error) {
// //         console.error('Error setting remote description:', error);
// //       }
// //     }
// //   }

// async function handleReceiveAnswer({ answer, from }) {
//     console.log(`Received answer from: ${from}`);
  
//     const peerConnection = peerConnections.current[from];
//     if (peerConnection) {
//       try {
//         // Only set remote description if signalingState allows
//         if (peerConnection.signalingState === 'have-local-offer') {
//           await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
//         } else {
//           console.error('Invalid state to set remote description: ', peerConnection.signalingState);
//         }
//       } catch (error) {
//         console.error('Error setting remote description:', error);
//       }
//     }
//   }  

//   async function handleReceiveIceCandidate({ candidate, from }) {
//     console.log(`Received ICE candidate from: ${from}`);
//     const peerConnection = peerConnections.current[from];
//     if (peerConnection) {
//       try {
//         if (peerConnection.remoteDescription) {
//           await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//         } else {
//           console.log('Queuing ICE candidate');
//           peerConnection.pendingIceCandidates = peerConnection.pendingIceCandidates || [];
//           peerConnection.pendingIceCandidates.push(candidate);
//         }
//       } catch (error) {
//         console.error('Error adding ICE candidate:', error);
//       }
//     }
//   }

//   async function handleExistingPeers(existingPeers) {
//     console.log('Received existing peers:', existingPeers);
//     for (const { userId, username: peerUsername } of existingPeers) {
//       if (userId !== socket.id) {
//         setPeers(prevPeers => ({
//           ...prevPeers,
//           [userId]: { username: peerUsername, stream: null }
//         }));
//         await createPeerConnection(userId, true);
//       }
//     }
//   }

//   return (
//     <div>
//       <h2>Room: {roomId}</h2>
//       <div className="video-container">
//         <div className="video-item">
//           <video ref={localVideoRef} autoPlay muted playsInline />
//           <p>{username} (You)</p>
//         </div>
//         {Object.entries(peers).map(([userId, { username: peerUsername, stream }]) => (
//           <div key={userId} className="video-item">
//             <video
//               ref={el => {
//                 if (el && stream) el.srcObject = stream;
//               }}
//               autoPlay
//               playsInline
//             />
//             <p>{peerUsername}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

//  export default VideoRoom;


// displays 3 names but no videos 

// import React, { useEffect, useRef, useState } from 'react';

// function VideoRoom({ roomId, username, socket }) {
//   const [peers, setPeers] = useState({});
//   const [isReady, setIsReady] = useState(false);
//   const localVideoRef = useRef();
//   const peerConnections = useRef({});
//   const localStream = useRef(null);

//   const configuration = {
//     iceServers: [
//       { urls: 'stun:stun.l.google.com:19302' },
//       { urls: 'stun:stun1.l.google.com:19302' },
//       { urls: 'stun:stun2.l.google.com:19302' },
//     ],
//   };

//   useEffect(() => {
//     async function setupMediaAndJoinRoom() {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         localStream.current = stream;
//         localVideoRef.current.srcObject = stream;
//         setIsReady(true);
//         socket.emit('join-room', roomId, username);
//         console.log('Local stream initialized and joined room');
//       } catch (error) {
//         console.error('Error accessing media devices:', error);
//       }
//     }

//     setupMediaAndJoinRoom();

//     socket.on('user-joined', handleUserJoined);
//     socket.on('user-disconnected', handleUserDisconnected);
//     socket.on('receive-offer', handleReceiveOffer);
//     socket.on('receive-answer', handleReceiveAnswer);
//     socket.on('receive-ice-candidate', handleReceiveIceCandidate);

//     // Request existing peers in the room
//     socket.emit('request-existing-peers', roomId);

//     // Handle existing peers
//     socket.on('existing-peers', handleExistingPeers);

//     return () => {
//       socket.off('user-joined', handleUserJoined);
//       socket.off('user-disconnected', handleUserDisconnected);
//       socket.off('receive-offer', handleReceiveOffer);
//       socket.off('receive-answer', handleReceiveAnswer);
//       socket.off('receive-ice-candidate', handleReceiveIceCandidate);
//       socket.off('existing-peers', handleExistingPeers);
//       Object.values(peerConnections.current).forEach(pc => pc.close());
//       if (localStream.current) {
//         localStream.current.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, [roomId, username, socket]);

//   async function createPeerConnection(userId, initiator = false) {
//     console.log(`Creating peer connection for user: ${userId}, initiator: ${initiator}`);
//     if (!localStream.current) {
//       console.error('Local stream is not initialized');
//       return null;
//     }

//     const peerConnection = new RTCPeerConnection(configuration);
//     peerConnections.current[userId] = peerConnection;

//     localStream.current.getTracks().forEach((track) => {
//       peerConnection.addTrack(track, localStream.current);
//     });

//     peerConnection.onicecandidate = (event) => {
//       if (event.candidate) {
//         console.log(`Sending ICE candidate to ${userId}`);
//         socket.emit('send-ice-candidate', { candidate: event.candidate, to: userId });
//       }
//     };

//     peerConnection.ontrack = (event) => {
//       console.log(`Received track from ${userId}`);
//       setPeers(prevPeers => ({
//         ...prevPeers,
//         [userId]: { ...prevPeers[userId], stream: event.streams[0] }
//       }));
//     };

//     if (initiator) {
//       try {
//         const offer = await peerConnection.createOffer();
//         await peerConnection.setLocalDescription(offer);
//         console.log(`Sending offer to ${userId}`);
//         socket.emit('send-offer', { offer, to: userId });
//       } catch (error) {
//         console.error('Error creating offer:', error);
//       }
//     }

//     return peerConnection;
//   }

//   async function handleUserJoined({ userId, username: peerUsername }) {
//     console.log(`User joined: ${userId} (${peerUsername})`);
//     setPeers(prevPeers => ({
//       ...prevPeers,
//       [userId]: { username: peerUsername, stream: null }
//     }));
//     if (isReady) {
//       await createPeerConnection(userId, true);
//     } else {
//       console.log(`Delaying peer connection for ${userId} as local stream is not ready`);
//     }
//   }

//   function handleUserDisconnected(userId) {
//     console.log(`User disconnected: ${userId}`);
//     if (peerConnections.current[userId]) {
//       peerConnections.current[userId].close();
//       delete peerConnections.current[userId];
//     }
//     setPeers(prevPeers => {
//       const newPeers = { ...prevPeers };
//       delete newPeers[userId];
//       return newPeers;
//     });
//   }

//   async function handleReceiveOffer({ offer, from }) {
//     console.log(`Received offer from: ${from}`);
//     if (!isReady) {
//       console.log(`Delaying offer handling from ${from} as local stream is not ready`);
//       setTimeout(() => handleReceiveOffer({ offer, from }), 1000);
//       return;
//     }
//     const peerConnection = await createPeerConnection(from);
//     if (!peerConnection) {
//       console.error(`Failed to create peer connection for ${from}`);
//       return;
//     }
//     try {
//       await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
//       const answer = await peerConnection.createAnswer();
//       await peerConnection.setLocalDescription(answer);
//       console.log(`Sending answer to ${from}`);
//       socket.emit('send-answer', { answer, to: from });
//     } catch (error) {
//       console.error('Error handling offer:', error);
//     }
//   }

//   async function handleReceiveAnswer({ answer, from }) {
//     console.log(`Received answer from: ${from}`);
//     const peerConnection = peerConnections.current[from];
//     if (peerConnection) {
//       try {
//         await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
//         console.log(`Set remote description for ${from}`);
//       } catch (error) {
//         console.error('Error setting remote description:', error);
//       }
//     } else {
//       console.error(`No peer connection found for ${from}`);
//     }
//   }

//   async function handleReceiveIceCandidate({ candidate, from }) {
//     console.log(`Received ICE candidate from: ${from}`);
//     const peerConnection = peerConnections.current[from];
//     if (peerConnection) {
//       try {
//         if (peerConnection.remoteDescription) {
//           await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//           console.log(`Added ICE candidate for ${from}`);
//         } else {
//           console.log(`Queuing ICE candidate for ${from}`);
//           peerConnection.pendingIceCandidates = peerConnection.pendingIceCandidates || [];
//           peerConnection.pendingIceCandidates.push(candidate);
//         }
//       } catch (error) {
//         console.error('Error adding ICE candidate:', error);
//       }
//     } else {
//       console.error(`No peer connection found for ${from}`);
//     }
//   }

//   async function handleExistingPeers(existingPeers) {
//     console.log('Received existing peers:', existingPeers);
//     for (const { userId, username: peerUsername } of existingPeers) {
//       if (userId !== socket.id) {
//         setPeers(prevPeers => ({
//           ...prevPeers,
//           [userId]: { username: peerUsername, stream: null }
//         }));
//         if (isReady) {
//           await createPeerConnection(userId, true);
//         } else {
//           console.log(`Delaying peer connection for ${userId} as local stream is not ready`);
//         }
//       }
//     }
//   }

//   return (
//     <div>
//       <h2>Room: {roomId}</h2>
//       <div className="video-container">
//         <div className="video-item">
//           <video ref={localVideoRef} autoPlay muted playsInline />
//           <p>{username} (You)</p>
//         </div>
//         {Object.entries(peers).map(([userId, { username: peerUsername, stream }]) => (
//           <div key={userId} className="video-item">
//             <video
//               ref={el => {
//                 if (el && stream) el.srcObject = stream;
//               }}
//               autoPlay
//               playsInline
//             />
//             <p>{peerUsername}{stream ? '' : ' (No video)'}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default VideoRoom;

///


//fri ni8 testing 

// import React, { useEffect, useRef, useState, useCallback } from 'react';

// function VideoRoom({ roomId, username, socket }) {
//   const [peers, setPeers] = useState({});
//   const [isLocalStreamReady, setIsLocalStreamReady] = useState(false);
//   const localVideoRef = useRef();
//   const peerConnections = useRef({});
//   const localStream = useRef(null);
//   const iceCandidatesQueue = useRef({});

//   const configuration = {
//     iceServers: [
//       { urls: 'stun:stun.services.mozilla.com' },
//       { urls: 'stun:stun.l.google.com:19302' },
//       { urls: 'stun:stun1.l.google.com:19302' },
//       { urls: 'stun:stun2.l.google.com:19302' },
//     ],
//   };

//   const createPeerConnection = useCallback(async (userId, initiator = false) => {
//     if (!localStream.current) {
//       console.error('Local stream is not ready yet');
//       return null;
//     }

//     if (peerConnections.current[userId]) {
//       console.log(`Peer connection for ${userId} already exists`);
//       return peerConnections.current[userId];
//     }

//     const peerConnection = new RTCPeerConnection(configuration);
//     peerConnections.current[userId] = peerConnection;

//     peerConnection.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit('send-ice-candidate', { candidate: event.candidate, to: userId });
//       }
//     };

//     peerConnection.ontrack = (event) => {
//       setPeers(prevPeers => ({
//         ...prevPeers,
//         [userId]: { ...prevPeers[userId], stream: event.streams[0] }
//       }));
//     };

//     peerConnection.oniceconnectionstatechange = () => {
//       if (peerConnection.iceConnectionState === 'disconnected' || 
//           peerConnection.iceConnectionState === 'closed') {
//         handlePeerDisconnection(userId);
//       }
//     };

//     localStream.current.getTracks().forEach((track) => {
//       peerConnection.addTrack(track, localStream.current);
//     });

//     if (initiator) {
//       try {
//         const offer = await peerConnection.createOffer();
//         await peerConnection.setLocalDescription(offer);
//         socket.emit('send-offer', { offer, to: userId });
//       } catch (error) {
//         console.error('Error creating offer:', error);
//         handlePeerDisconnection(userId);
//       }
//     }

//     return peerConnection;
//   }, [socket, configuration]);

//   const handlePeerDisconnection = useCallback((userId) => {
//     console.log(`Peer disconnected: ${userId}`);
//     if (peerConnections.current[userId]) {
//       peerConnections.current[userId].close();
//       delete peerConnections.current[userId];
//     }
//     setPeers(prevPeers => {
//       const newPeers = { ...prevPeers };
//       delete newPeers[userId];
//       return newPeers;
//     });
//   }, []);

//   useEffect(() => {
//     async function setupMediaAndJoinRoom() {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         localStream.current = stream;
//         if (localVideoRef.current) {
//           localVideoRef.current.srcObject = stream;
//         }
//         setIsLocalStreamReady(true);
//         socket.emit('join-room', roomId, username);
//       } catch (error) {
//         console.error('Error accessing media devices:', error);
//       }
//     }

//     setupMediaAndJoinRoom();

//     socket.on('user-joined', handleUserJoined);
//     socket.on('user-disconnected', handleUserDisconnected);
//     socket.on('receive-offer', handleReceiveOffer);
//     socket.on('receive-answer', handleReceiveAnswer);
//     socket.on('receive-ice-candidate', handleReceiveIceCandidate);
//     socket.on('existing-peers', handleExistingPeers);

//     socket.emit('request-existing-peers', roomId);

//     return () => {
//       socket.off('user-joined', handleUserJoined);
//       socket.off('user-disconnected', handleUserDisconnected);
//       socket.off('receive-offer', handleReceiveOffer);
//       socket.off('receive-answer', handleReceiveAnswer);
//       socket.off('receive-ice-candidate', handleReceiveIceCandidate);
//       socket.off('existing-peers', handleExistingPeers);
//       Object.values(peerConnections.current).forEach(pc => pc.close());
//       if (localStream.current) {
//         localStream.current.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, [roomId, username, socket, createPeerConnection]);

//   const handleUserJoined = useCallback(async ({ userId, username: peerUsername }) => {
//     console.log(`User joined: ${userId} (${peerUsername})`);
//     setPeers(prevPeers => ({
//       ...prevPeers,
//       [userId]: { username: peerUsername, stream: null }
//     }));
//     if (isLocalStreamReady) {
//       await createPeerConnection(userId, true);
//     }
//   }, [createPeerConnection, isLocalStreamReady]);

//   const handleUserDisconnected = useCallback((userId) => {
//     handlePeerDisconnection(userId);
//   }, [handlePeerDisconnection]);

//   const handleReceiveOffer = useCallback(async ({ offer, from }) => {
//     console.log(`Received offer from: ${from}`);
//     if (!isLocalStreamReady) {
//       console.log('Local stream not ready, queueing offer');
//       return;
//     }
//     let peerConnection = peerConnections.current[from];
//     if (!peerConnection || peerConnection.signalingState === 'closed') {
//       peerConnection = await createPeerConnection(from);
//     }
//     if (!peerConnection) return;
//     try {
//       if (peerConnection.signalingState !== 'stable') {
//         console.log('Signaling state is not stable, cannot set remote description');
//         return;
//       }
//       await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
//       const answer = await peerConnection.createAnswer();
//       await peerConnection.setLocalDescription(answer);
//       socket.emit('send-answer', { answer, to: from });

//       if (iceCandidatesQueue.current[from]) {
//         iceCandidatesQueue.current[from].forEach(candidate => 
//           peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
//         );
//         delete iceCandidatesQueue.current[from];
//       }
//     } catch (error) {
//       console.error('Error handling offer:', error);
//       handlePeerDisconnection(from);
//     }
//   }, [socket, createPeerConnection, isLocalStreamReady, handlePeerDisconnection]);

//   const handleReceiveAnswer = useCallback(async ({ answer, from }) => {
//     console.log(`Received answer from: ${from}`);
//     const peerConnection = peerConnections.current[from];
//     if (peerConnection && peerConnection.signalingState !== 'stable') {
//       try {
//         await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
//         if (iceCandidatesQueue.current[from]) {
//           iceCandidatesQueue.current[from].forEach(candidate => 
//             peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
//           );
//           delete iceCandidatesQueue.current[from];
//         }
//       } catch (error) {
//         console.error('Error setting remote description:', error);
//         handlePeerDisconnection(from);
//       }
//     }
//   }, [handlePeerDisconnection]);

//   const handleReceiveIceCandidate = useCallback(async ({ candidate, from }) => {
//     console.log(`Received ICE candidate from: ${from}`);
//     const peerConnection = peerConnections.current[from];
//     if (peerConnection && peerConnection.remoteDescription && peerConnection.signalingState !== 'closed') {
//       try {
//         await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//       } catch (error) {
//         console.error('Error adding ICE candidate:', error);
//       }
//     } else {
//       if (!iceCandidatesQueue.current[from]) {
//         iceCandidatesQueue.current[from] = [];
//       }
//       iceCandidatesQueue.current[from].push(candidate);
//     }
//   }, []);

//   const handleExistingPeers = useCallback(async (existingPeers) => {
//     console.log('Received existing peers:', existingPeers);
//     for (const { userId, username: peerUsername } of existingPeers) {
//       if (userId !== socket.id) {
//         setPeers(prevPeers => ({
//           ...prevPeers,
//           [userId]: { username: peerUsername, stream: null }
//         }));
//         if (isLocalStreamReady) {
//           await createPeerConnection(userId, true);
//         }
//       }
//     }
//   }, [socket.id, createPeerConnection, isLocalStreamReady]);

//   return (
//     <div>
//       <h2>Room: {roomId}</h2>
//       <div className="video-container">
//         <div className="video-item">
//           <video ref={localVideoRef} autoPlay muted playsInline />
//           <p>{username} (You)</p>
//         </div>
//         {Object.entries(peers).map(([userId, { username: peerUsername, stream }]) => (
//           <div key={userId} className="video-item">
//             <video
//               ref={el => {
//                 if (el && stream) {
//                   el.srcObject = stream;
//                   el.play().catch(error => console.error('Error playing video:', error));
//                 }
//               }}
//               autoPlay
//               playsInline
//             />
//             <p>{peerUsername}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default VideoRoom;




// last update g fri 


// VideoRoom.jsx
// import React, { useEffect, useRef, useState, useCallback } from 'react';

// function VideoRoom({ roomId, username, socket }) {
//   const [peers, setPeers] = useState({});
//   const localVideoRef = useRef();
//   const peerConnections = useRef({});
//   const localStream = useRef(null);
//   const pendingCandidates = useRef({});
//   const videoRefs = useRef({});

//   const configuration = {
//     iceServers: [
//       { urls: 'stun:stun.l.google.com:19302' },
//       { urls: 'stun:stun1.l.google.com:19302' },
//       { urls: 'stun:stun2.l.google.com:19302' },
//     ],
//   };

//   const createPeerConnection = useCallback(async (userId, initiator = false) => {
//     console.log(`Creating peer connection for ${userId}, initiator: ${initiator}`);
    
//     if (peerConnections.current[userId]) {
//       peerConnections.current[userId].close();
//     }
    
//     const peerConnection = new RTCPeerConnection(configuration);
//     peerConnections.current[userId] = peerConnection;

//     if (localStream.current) {
//       localStream.current.getTracks().forEach((track) => {
//         peerConnection.addTrack(track, localStream.current);
//       });
//     }

//     peerConnection.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit('send-ice-candidate', {
//           candidate: event.candidate,
//           to: userId,
//         });
//       }
//     };

//     peerConnection.oniceconnectionstatechange = () => {
//       console.log(`ICE Connection State: ${peerConnection.iceConnectionState}`);
//       console.log(`Signaling State: ${peerConnection.signalingState}`);
//   };  

//     peerConnection.ontrack = (event) => {
//       console.log(`Received track from ${userId}`);
//       const [stream] = event.streams;
//       setPeers((prevPeers) => {
//         const newPeers = {
//           ...prevPeers,
//           [userId]: {
//             ...prevPeers[userId],
//             stream,
//           },
//         };
        
//         if (videoRefs.current[userId]) {
//           videoRefs.current[userId].srcObject = stream;
//         }
        
//         return newPeers;
//       });
//     };

//     if (initiator) {
//       try {
//         console.log(`Creating offer for ${userId}`);
//         const offer = await peerConnection.createOffer();
//         await peerConnection.setLocalDescription(offer);
//         socket.emit('send-offer', { offer, to: userId });
//       } catch (error) {
//         console.error('Error creating offer:', error);
//       }
//     }

//     return peerConnection;
//   }, [socket]);

//   const handleExistingUsers = useCallback(async (existingUsers) => {
//     console.log('Handling existing users:', existingUsers);
//     for (const { userId, username: peerUsername } of existingUsers) {
//       setPeers(prevPeers => ({
//         ...prevPeers,
//         [userId]: { username: peerUsername, stream: null },
//       }));
//       await createPeerConnection(userId, true);
//     }
//   }, [createPeerConnection]);

//   const handleUserJoined = useCallback(async ({ userId, username: peerUsername }) => {
//     console.log(`New user joined: ${userId} (${peerUsername})`);
//     setPeers(prevPeers => ({
//       ...prevPeers,
//       [userId]: { username: peerUsername, stream: null },
//     }));
//     // Don't create a peer connection here - wait for the offer/answer exchange
//   }, []);

//   const handleUserDisconnected = useCallback((userId) => {
//     console.log(`User disconnected: ${userId}`);
//     if (peerConnections.current[userId]) {
//       peerConnections.current[userId].close();
//       delete peerConnections.current[userId];
//     }
//     setPeers(prevPeers => {
//       const newPeers = { ...prevPeers };
//       delete newPeers[userId];
//       return newPeers;
//     });
//   }, []);

// const handleReceiveOffer = useCallback(async ({ offer, from }) => {
//   console.log(`Received offer from: ${from}`);
//   const peerConnection = await createPeerConnection(from, false);
//   console.log(`Signaling state before setRemoteDescription (offer): ${peerConnection.signalingState}`);
//   try {
//       await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
//       console.log(`Signaling state after setRemoteDescription (offer): ${peerConnection.signalingState}`);
//       const answer = await peerConnection.createAnswer();
//       await peerConnection.setLocalDescription(answer);
//       socket.emit('send-answer', { answer, to: from });
//       console.log(`Signaling state after createAnswer and setLocalDescription: ${peerConnection.signalingState}`);
//   } catch (error) {
//       console.error('Error handling offer:', error);
//   }
// }, [createPeerConnection, socket]);

// const handleReceiveAnswer = useCallback(async ({ answer, from }) => {
//   console.log(`Received answer from: ${from}`);
//   const peerConnection = peerConnections.current[from];
//   if (peerConnection) {
//       console.log(`Signaling state before setRemoteDescription (answer): ${peerConnection.signalingState}`);
//       if (peerConnection.signalingState === 'have-local-offer') {
//           try {
//               await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
//               console.log(`Signaling state after setRemoteDescription (answer): ${peerConnection.signalingState}`);
//               // Process any pending ICE candidates after the answer is set
//               if (pendingCandidates.current[from]) {
//                   console.log(`Processing pending candidates for ${from}`);
//                   for (const candidate of pendingCandidates.current[from]) {
//                       await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//                   }
//                   delete pendingCandidates.current[from];
//               }
//           } catch (error) {
//               console.error('Error setting remote description (answer):', error);
//           }
//       } else {
//           console.error('PeerConnection not in the correct state for setting answer');
//       }
//   }
// }, []);

//   const handleReceiveIceCandidate = useCallback(async ({ candidate, from }) => {
//     console.log(`Received ICE candidate from: ${from}`);
//     const peerConnection = peerConnections.current[from];
    
//     if (!peerConnection || !peerConnection.remoteDescription) {
//       if (!pendingCandidates.current[from]) {
//         pendingCandidates.current[from] = [];
//       }
//       pendingCandidates.current[from].push(candidate);
//       return;
//     }

//     try {
//       await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//     } catch (error) {
//       console.error('Error adding ICE candidate:', error);
//     }
//   }, []);

//   useEffect(() => {
//     async function setupMediaAndJoinRoom() {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true,
//         });
//         localStream.current = stream;
//         if (localVideoRef.current) {
//           localVideoRef.current.srcObject = stream;
//         }
        
//         // Join room only after media is set up
//         socket.emit('join-room', roomId, username);
//       } catch (error) {
//         console.error('Error accessing media devices:', error);
//       }
//     }

//     setupMediaAndJoinRoom();

//     return () => {
//       if (localStream.current) {
//         localStream.current.getTracks().forEach(track => track.stop());
//       }
//       Object.values(peerConnections.current).forEach(pc => pc.close());
//     };
//   }, [roomId, username, socket]);

//   useEffect(() => {
//     socket.on('existing-users', handleExistingUsers);
//     socket.on('user-joined', handleUserJoined);
//     socket.on('user-disconnected', handleUserDisconnected);
//     socket.on('receive-offer', handleReceiveOffer);
//     socket.on('receive-answer', handleReceiveAnswer);
//     socket.on('receive-ice-candidate', handleReceiveIceCandidate);

//     return () => {
//       socket.off('existing-users', handleExistingUsers);
//       socket.off('user-joined', handleUserJoined);
//       socket.off('user-disconnected', handleUserDisconnected);
//       socket.off('receive-offer', handleReceiveOffer);
//       socket.off('receive-answer', handleReceiveAnswer);
//       socket.off('receive-ice-candidate', handleReceiveIceCandidate);
//     };
//   }, [
//     socket,
//     handleExistingUsers,
//     handleUserJoined,
//     handleUserDisconnected,
//     handleReceiveOffer,
//     handleReceiveAnswer,
//     handleReceiveIceCandidate,
//   ]);

//   return (
//     <div>
//       <h2>Room: {roomId}</h2>
//       <div className="video-container">
//         <div className="video-item">
//           <video ref={localVideoRef} autoPlay muted playsInline />
//           <p>{username} (You)</p>
//         </div>
//         {Object.entries(peers).map(([userId, { username: peerUsername, stream }]) => (
//           <div key={userId} className="video-item">
//             <video
//               ref={(el) => {
//                 if (el) {
//                   videoRefs.current[userId] = el;
//                   if (stream) {
//                     el.srcObject = stream;
//                   }
//                 }
//               }}
//               autoPlay
//               playsInline
//             />
//             <p>{peerUsername}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default VideoRoom;



/// test backup 


import React, { useEffect, useRef, useState } from 'react';

function VideoRoom({ roomId, username, socket }) {
  const [peers, setPeers] = useState({});
  const localVideoRef = useRef();
  const peerConnections = useRef({});
  const localStream = useRef(null);

  const configuration = {
    iceServers: [
        { urls: 'stun:stun.services.mozilla.com' },
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
    ],
  };

  useEffect(() => {
    async function setupMediaAndJoinRoom() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStream.current = stream;
        localVideoRef.current.srcObject = stream;
        socket.emit('join-room', roomId, username);
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    }

    setupMediaAndJoinRoom();

    socket.on('user-joined', handleUserJoined);
    socket.on('user-disconnected', handleUserDisconnected);
    socket.on('receive-offer', handleReceiveOffer);
    socket.on('receive-answer', handleReceiveAnswer);
    socket.on('receive-ice-candidate', handleReceiveIceCandidate);

    // Request existing peers in the room
    socket.emit('request-existing-peers', roomId);

    // Handle existing peers
    socket.on('existing-peers', handleExistingPeers);

    return () => {
      socket.off('user-joined', handleUserJoined);
      socket.off('user-disconnected', handleUserDisconnected);
      socket.off('receive-offer', handleReceiveOffer);
      socket.off('receive-answer', handleReceiveAnswer);
      socket.off('receive-ice-candidate', handleReceiveIceCandidate);
      socket.off('existing-peers', handleExistingPeers);
      Object.values(peerConnections.current).forEach(pc => pc.close());
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [roomId, username, socket]);

  async function createPeerConnection(userId, initiator = false) {
    const peerConnection = new RTCPeerConnection(configuration);
    peerConnections.current[userId] = peerConnection;

    localStream.current.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream.current);
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('send-ice-candidate', { candidate: event.candidate, to: userId });
      }
    };

    peerConnection.ontrack = (event) => {
      setPeers(prevPeers => ({
        ...prevPeers,
        [userId]: { ...prevPeers[userId], stream: event.streams[0] }
      }));
    };

    if (initiator) {
      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit('send-offer', { offer, to: userId });
      } catch (error) {
        console.error('Error creating offer:', error);
      }
    }

    return peerConnection;
  }

  async function handleUserJoined({ userId, username: peerUsername }) {
    console.log(`User joined: ${userId} (${peerUsername})`);
    setPeers(prevPeers => ({
      ...prevPeers,
      [userId]: { username: peerUsername, stream: null }
    }));
    await createPeerConnection(userId, true);
  }

  function handleUserDisconnected(userId) {
    console.log(`User disconnected: ${userId}`);
    if (peerConnections.current[userId]) {
      peerConnections.current[userId].close();
      delete peerConnections.current[userId];
    }
    setPeers(prevPeers => {
      const newPeers = { ...prevPeers };
      delete newPeers[userId];
      return newPeers;
    });
  }

  async function handleReceiveOffer({ offer, from }) {
    console.log(`Received offer from: ${from}`);
    const peerConnection = await createPeerConnection(from);
    try {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit('send-answer', { answer, to: from });
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }

  async function handleReceiveAnswer({ answer, from }) {
    console.log(`Received answer from: ${from}`);
    const peerConnection = peerConnections.current[from];
    if (peerConnection) {
      try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.error('Error setting remote description:', error);
      }
    }
  }

  async function handleReceiveIceCandidate({ candidate, from }) {
    console.log(`Received ICE candidate from: ${from}`);
    const peerConnection = peerConnections.current[from];
    if (peerConnection) {
      try {
        if (peerConnection.remoteDescription) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
          console.log('Queuing ICE candidate');
          peerConnection.pendingIceCandidates = peerConnection.pendingIceCandidates || [];
          peerConnection.pendingIceCandidates.push(candidate);
        }
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    }
  }

  async function handleExistingPeers(existingPeers) {
    console.log('Received existing peers:', existingPeers);
    for (const { userId, username: peerUsername } of existingPeers) {
      if (userId !== socket.id) {
        setPeers(prevPeers => ({
          ...prevPeers,
          [userId]: { username: peerUsername, stream: null }
        }));
        await createPeerConnection(userId, true);
      }
    }
  }

  return (
    <div>
      <h2>Room: {roomId}</h2>
      <div className="video-container">
        <div className="video-item">
          <video ref={localVideoRef} autoPlay muted playsInline />
          <p>{username} (You)</p>
        </div>
        {Object.entries(peers).map(([userId, { username: peerUsername, stream }]) => (
          <div key={userId} className="video-item">
            <video
              ref={el => {
                if (el && stream) el.srcObject = stream;
              }}
              autoPlay
              playsInline
            />
            <p>{peerUsername}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

 export default VideoRoom;