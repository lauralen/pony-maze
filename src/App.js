import React, { useState, useEffect } from 'react';
import './style/index.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowUp,
  faArrowRight,
  faArrowDown,
  faQuestionCircle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

import Button from './components/Button';
import Modal from './components/Modal';

const URL = 'https://ponychallenge.trustpilot.com/pony-challenge/maze';

function App() {
  const [mazeId, setMazeId] = useState(null);
  const [maze, setMaze] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState({ message: 'Make first move' });
  const [modalOpen, setModalOpen] = useState(false);

  const getMazeId = async () => {
    setLoading(true);
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
              <div className="move-buttons">
                <Button className="west" onClick={() => move('west')}>
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Button>
                <Button className="north" onClick={() => move('north')}>
                  <FontAwesomeIcon icon={faArrowUp} />
                </Button>
                <Button className="east" onClick={() => move('east')}>
                  <FontAwesomeIcon icon={faArrowRight} />
                </Button>
                <Button className="south" onClick={() => move('south')}>
                  <FontAwesomeIcon icon={faArrowDown} />
                </Button>
                <Button className="stay" onClick={() => move('stay')}>
                  Stay
                </Button>
              </div>
            )}
            <pre>{maze}</pre>
            {result?.message && !loading && <p>{result.message}</p>}
            {result?.result === 'won' && (
              <Button className="primary" onClick={() => getMazeId()}>
                Play again
              </Button>
            )}
          </>
        )}
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
      </main>

      <Button className="round modal-open" onClick={() => setModalOpen(true)}>
        <FontAwesomeIcon icon={faQuestionCircle} />
      </Button>

      {modalOpen && (
        <Modal>
          <p>
            Move pony (P) to the exit (E) and watch out for the monster
            protecting the maze (D).
          </p>
          <Button className="modal-close" onClick={() => setModalOpen(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </Modal>
      )}
    </>
  );
}

export default App;
