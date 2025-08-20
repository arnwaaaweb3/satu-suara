// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './front-end/pages/HomePage';
import CentralPage from './front-end/pages/CentralPage'; // Import komponen GettingKnow
import { VotingForm } from './front-end/pages/VotingForm';

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