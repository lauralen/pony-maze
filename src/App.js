import React, { useState, useEffect } from 'react';
import './style/index.scss';

const URL = 'https://ponychallenge.trustpilot.com/pony-challenge/maze';

function App() {
  const [mazeId, setMazeId] = useState(null);
  const [maze, setMaze] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const getMazeId = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

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

  const getMaze = async () => {
    setLoading(true);

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch(`${URL}/${mazeId}/print`, requestOptions);

      if (response.status === 200) {
        const result = await response.text();
        setMaze(result);
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

  useEffect(() => {
    if (mazeId) getMaze();
  }, [mazeId]);

  const move = async (val) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        direction: val,
      }),
    };

    try {
      const response = await fetch(`${URL}/${mazeId}`, requestOptions);
      const result = await response.json();
      setResult({ result: result.state, message: result['state-result'] });
      getMaze();
    } catch (err) {
      setResult({ result: 'error', message: 'Failed to move' });
    }
  };

  return (
    <>
      <header className="header">Pony maze</header>
      <main>
        {maze && (
          <>
            {result?.result === 'won' ? null : (
              <div>
                <button type="button" onClick={() => move('west')}>
                  West
                </button>
                <button type="button" onClick={() => move('north')}>
                  North
                </button>
                <button type="button" onClick={() => move('east')}>
                  East
                </button>
                <button type="button" onClick={() => move('south')}>
                  South
                </button>
                <button type="button" onClick={() => move('stay')}>
                  Stay
                </button>
              </div>
            )}
            <pre>{maze}</pre>
            {result?.message && !loading && <p>{result.message}</p>}
            {result?.result === 'won' && (
              <button type="button" onClick={() => getMazeId()}>
                Play again
              </button>
            )}
          </>
        )}
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
      </main>
    </>
  );
}

export default App;
