import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StartInterview from './pages/StartInterview';
import FetchInterview from './pages/FetchInterview';
import StartInterviewtwo from './components/StartInterviewtwo';
import JoinInterviewtwo from './components/JoinInterviewtwo';
import FetchMultiInterview from './pages/FetchMultiInterview';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/startinterview" element={<StartInterview />} />
      <Route path="/fetchinterview" element={<FetchInterview />} />
      <Route path="/startinterviewtwo" element={<StartInterviewtwo />} />
      <Route path="/joininterviewtwo" element={<JoinInterviewtwo />} />
      <Route path="/fetchmultiinterview" element={<FetchMultiInterview />} />
    </Routes>
  );
}

export default App;