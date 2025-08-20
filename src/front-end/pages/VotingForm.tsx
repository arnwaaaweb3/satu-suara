// src/components/VotingForm.tsx
import React, { useState } from 'react';

const candidates = ['Alice', 'Bob', 'Charlie'];

export const VotingForm: React.FC = () => {
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [votingStatus, setVotingStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return setVotingStatus('Please select a candidate!');
    
    // TODO: kirim ke Algorand di Step 2
    setVotingStatus(`Vote terkirim untuk ${selectedCandidate}! (Belum ke blockchain)`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Pilih Kandidat</h2>
      {candidates.map((name) => (
        <label key={name}>
          <input
            type="radio"
            name="candidate"
            value={name}
            onChange={(e) => setSelectedCandidate(e.target.value)}
          />
          {name}
        </label>
      ))}
      <br />
      <button type="submit">Kirim Vote</button>
      <p>{votingStatus}</p>
    </form>
  );
};
