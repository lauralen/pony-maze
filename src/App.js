import React, { useState, useEffect } from 'react';
import './App.css';

const URL = 'https://ponychallenge.trustpilot.com/pony-challenge/maze';

function App() {
  const [mazeId, setMazeId] = useState(null);
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
    setMazeId(null);
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
      const response = await fetch(`${URL}/${id}/print`, requestOptions);

      if (response.status === 200) {
        const mazeDisplayResult = await response.text();

        setMazeId(id);
        setMazeDisplay(mazeDisplayResult);
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
    getMaze();
  }, []);

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
    } catch (err) {
      throw new Error(err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">Pony maze</header>
      <main>
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {mazeDisplay && (
          <div>
            <div>
              <button
                type="button"
                onClick={() => {
                  move('west');
                }}
              >
                West
              </button>
              <button
                type="button"
                onClick={() => {
                  move('north');
                }}
              >
                North
              </button>
              <button
                type="button"
                onClick={() => {
                  move('east');
                }}
              >
                East
              </button>
              <button
                type="button"
                onClick={() => {
                  move('south');
                }}
              >
                South
              </button>
              <button
                type="button"
                onClick={() => {
                  move('stay');
                }}
              >
                Stay
              </button>
            </div>
            <pre>{mazeDisplay}</pre>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
