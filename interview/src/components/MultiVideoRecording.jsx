// import React, { useRef, useEffect } from 'react';

// const MultiVideoRecording = ({ stream, name }) => {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     if (videoRef.current && stream) {
//       videoRef.current.srcObject = stream;
//     }
//   }, [stream]);

//   return (
//     <div className="video-container">
//       <video
//         ref={videoRef}
//         autoPlay
//         playsInline
//         muted={name === 'You (Local)'}
//       />
//       <div className="participant-name">{name}</div>
//     </div>
//   );
// };

// export default MultiVideoRecording;

// import React, { useRef, useEffect } from 'react';

// const MultiVideoRecording = ({ stream, name }) => {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     if (videoRef.current && stream) {
//       videoRef.current.srcObject = stream;
//     }
//   }, [stream]);

//   return (
//     <div className="video-container">
//       {stream ? (
//         <video ref={videoRef} autoPlay playsInline muted={name === 'You (Local)'} />
//       ) : (
//         <div className="no-video">No video available</div>
//       )}
//       <div className="participant-name">{name}</div>
//     </div>
//   );
// };

// export default MultiVideoRecording;

// // streming later not working 


import React, { useEffect, useRef } from 'react';

const MultiVideoRecording = ({ stream, userName }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div style={{ margin: '10px', textAlign: 'center' }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={userName === 'You'}
        style={{ width: '300px', height: '225px', objectFit: 'cover' }}
      />
      <p>{userName}</p>
    </div>
  );
};

export default MultiVideoRecording;