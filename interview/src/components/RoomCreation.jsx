import React, { useState } from 'react';

function RoomCreation({ onCreateRoom, onJoinRoom }) {
  const [name, setName] = useState('');
  const [roomIdToJoin, setRoomIdToJoin] = useState('');

  const handleCreateRoom = () => {
    if (name) {
      onCreateRoom(name);
    } else {
      alert('Please enter your name');
    }
  };

  const handleJoinRoom = () => {
    if (name && roomIdToJoin) {
      onJoinRoom(name, roomIdToJoin);
    } else {
      alert('Please enter your name and room ID');
    }
  };

  return (
    <div>
      <h1>Multi-Person Video Chat</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleCreateRoom}>Create Room</button>
      <input
        type="text"
        placeholder="Enter room ID to join"
        value={roomIdToJoin}
        onChange={(e) => setRoomIdToJoin(e.target.value)}
      />
      <button onClick={handleJoinRoom}>Join Room</button>
    </div>
  );
}

export default RoomCreation;