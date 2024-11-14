import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StartInterview from './pages/StartInterview';
import FetchInterview from './pages/FetchInterview';
import StartInterviewtwo from './components/StartInterviewtwo';
import JoinInterviewtwo from './components/JoinInterviewtwo';
import FetchMultiInterview from './pages/FetchMultiInterview';
import LoginButton from "./components/LoginButton";

function App() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <Router>
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/startinterview" element={<StartInterview />} />
            <Route path="/fetchinterview" element={<FetchInterview />} />
            <Route path="/startinterviewtwo" element={<StartInterviewtwo />} />
            <Route path="/joininterviewtwo" element={<JoinInterviewtwo />} />
            <Route path="/fetchmultiinterview" element={<FetchMultiInterview />} />
          </>
        ) : (
          <Route
            path="*"
            element={
              <LoginButton />
              
            }
          />
        )}
      </Routes>
    </Router>
  );
}

export default App;
