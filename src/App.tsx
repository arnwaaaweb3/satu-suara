// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CentralPage from './pages/CentralPage'; // Import komponen GettingKnow
import { VotingForm } from './components/VotingForm';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Rute baru untuk halaman GettingKnow */}
        <Route path="/central" element={<CentralPage />} />
        <Route path="/vote" element={<VotingForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;