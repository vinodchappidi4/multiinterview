import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StartInterview from './pages/StartInterview';
import FetchInterview from './pages/FetchInterview';
import MultiInterview from './pages/MultiInterview';
import StartInterviewtwo from './components/StartInterviewtwo';
import JoinInterviewtwo from './components/JoinInterviewtwo';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/startinterview" element={<StartInterview />} />
      <Route path="/fetchinterview" element={<FetchInterview />} />
      <Route path="/multiinterview" element={<MultiInterview />} />
      <Route path="/startinterviewtwo" element={<StartInterviewtwo />} />
      <Route path="/joininterviewtwo" element={<JoinInterviewtwo />} />
    </Routes>
  );
}

export default App;