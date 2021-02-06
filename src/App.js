import React, { useState, useEffect } from 'react';
import './App.css';

const URL = 'https://ponychallenge.trustpilot.com/pony-challenge/maze';

function App() {
  const [mazeId, setMazeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getMazeId = async () => {
    setMazeId(null);
    setLoading(false);
    setError(false);

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'maze-width': 15,
        'maze-height': 15,
        'maze-player-name': 'Rainbow Dash',
        difficulty: 0,
      }),
    };

    try {
      const response = await fetch(URL, requestOptions);

      if (response.status === 200) {
        const result = await response.json();
        setMazeId(result.maze_id);
      } else {
        throw new Error(response.statusText);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMazeId();
  }, []);

  return (
    <div className="App">
      <header className="App-header">Pony maze</header>
      <main>
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {mazeId && <div>{mazeId}</div>}
      </main>
    </div>
  );
}

export default App;
