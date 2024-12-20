import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/pages/Home'; 
import Reglement from './components/pages/Reglement';
import './styles/styles.css'; 
import Kalender from './components/pages/Kalender';
import Klassement from './components/pages/Klassement';
import Contact from './components/pages/Contact';
import NotFoundPage from './components/pages/NotFound';
import MiniCompetition from './components/pages/MiniCompetition';
import Chat from './components/common/Chat';
import Team from './components/pages/Team';
import Opstelling from './components/pages/Opstelling';

import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js';

function App() {
  const [user, setUser] = useState(null);
  const [isChatVisible, setChatVisible] = useState(false);
  const auth = getAuth();

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
      });

      return () => unsubscribe();
  }, [auth]);

  const toggleChat = () => {
    setChatVisible(prev => !prev);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button className="toggle-chat-button" onClick={toggleChat}>
        {isChatVisible ? 'Hide Chat' : 'Show Chat'}
      </button>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/index" element={<Home />} />
        <Route path="/Reglement" element={<Reglement />} />
        <Route path="/Kalender" element={<Kalender />} />
        <Route path="/Klassement" element={<Klassement />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Minicompetitie" element={<MiniCompetition />} />
        <Route path="/Team" element={<Team />} />
        <Route path="/Opstelling" element={<Opstelling />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {isChatVisible && (
        <div className="chat-overlay">
          <Chat />
        </div>
      )}
    </div>
  );
}

export default App;
