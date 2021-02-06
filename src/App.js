import React, { useState, useEffect } from 'react';
import './App.css';

const URL = 'https://ponychallenge.trustpilot.com/pony-challenge/maze';

function App() {
  const [maze, setMaze] = useState(null);
  const [mazeDisplay, setMazeDisplay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getMazeId = async () => {
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
        return result.maze_id;
      } else {
        throw new Error(response.statusText);
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  const getMaze = async () => {
    setMaze(null);
    setMazeDisplay(null);
    setLoading(false);
    setError(false);

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const id = await getMazeId();
      const mazeResponse = await fetch(`${URL}/${id}`, requestOptions);
      const mazeDisplayResponse = await fetch(
        `${URL}/${id}/print`,
        requestOptions,
      );

      if (mazeResponse.status === 200 && mazeDisplayResponse.status === 200) {
        const mazeResult = await mazeResponse.json();
        const mazeDisplayResult = await mazeDisplayResponse.text();

        setMaze(mazeResult);
        setMazeDisplay(mazeDisplayResult);
      } else if (mazeResponse.status !== 200) {
        throw new Error(mazeResponse.statusText);
      } else {
        throw new Error(mazeDisplayResponse.statusText);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMaze();
  }, []);

  return (
    <div className="App">
      <header className="App-header">Pony maze</header>
      <main>
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {mazeDisplay && <pre>{mazeDisplay}</pre>}
      </main>
    </div>
  );
}

export default App;
