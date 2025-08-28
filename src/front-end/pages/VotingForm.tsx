// src/front-end/VotingForm.tsx
import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:4000';

export const VotingForm: React.FC = () => {
  const [candidates, setCandidates] = useState<string[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [votingStatus, setVotingStatus] = useState('');
  const [results, setResults] = useState<{ [key: string]: number } | null>(null);
  const [loadingCandidates, setLoadingCandidates] = useState(true);

  // Ambil daftar kandidat (dipisah dari results)
  const fetchCandidates = async () => {
    try {
      const res = await fetch(`${API_URL}/candidates`);
      const data = await res.json();
      if (res.ok) {
        setCandidates(data.candidates || []);
      } else {
        console.error('Failed to fetch candidates:', data);
      }
    } catch (err) {
      console.error('Error fetching candidates:', err);
    } finally {
      setLoadingCandidates(false);
    }
  };

  // Fungsi untuk mengambil hasil voting
  const fetchResults = async () => {
    try {
      const response = await fetch(`${API_URL}/results`);
      const data = await response.json();
      setResults(data.results || {});
    } catch (error) {
      console.error('Failed to fetch voting results:', error);
    }
  };

  useEffect(() => {
    fetchCandidates();
    fetchResults();
    const interval = setInterval(() => {
      fetchCandidates();
      fetchResults();
    }, 5000); // update setiap 5 detik
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) {
      setVotingStatus('Please select a candidate!');
      return;
    }

    setVotingStatus('Mengirim vote...');

    try {
      const response = await fetch(`${API_URL}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate: selectedCandidate }),
      });

      const data = await response.json();

      if (response.ok) {
        setVotingStatus(`Vote berhasil! TxID: ${data.txId}`);
        // update hasil dan kandidat
        fetchResults();
        fetchCandidates();
      } else {
        setVotingStatus(`Gagal mengirim vote: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setVotingStatus('Terjadi kesalahan saat mengirim vote.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Pilih Kandidat</h2>
        {loadingCandidates ? <p>Loading candidates...</p> : null}
        {!loadingCandidates && candidates.length === 0 && (
          <p>Tidak ada kandidat tersedia.</p>
        )}
        {candidates.map((name) => (
          <label key={name} style={{ display: 'block', margin: '6px 0' }}>
            <input
              type="radio"
              name="candidate"
              value={name}
              onChange={(e) => setSelectedCandidate(e.target.value)}
            />
            {' '}{name}
          </label>
        ))}
        <br />
        <button type="submit" disabled={!selectedCandidate}>Kirim Vote</button>
        <p>{votingStatus}</p>
      </form>

      <hr />
      <h2>Hasil Voting</h2>
      {results ? (
        <ul>
          {Object.entries(results).map(([candidate, count]) => (
            <li key={candidate}>
              {candidate}: {count} vote{count > 1 ? 's' : ''}
            </li>
          ))}
        </ul>
      ) : (
        <p>Memuat hasil...</p>
      )}
    </div>
  );
};
