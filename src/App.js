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

import { loadMazeId, loadMaze, setMove } from './utils/api';

function App() {
  const [mazeId, setMazeId] = useState(null);
  const [maze, setMaze] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const getMazeId = async () => {
    setLoading(true);
    setError(null);
    setResult({ message: 'Make first move' });

    try {
      const result = await loadMazeId();
      setMazeId(result.maze_id);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const getMaze = async () => {
    setLoading(true);

    try {
      const result = await loadMaze(mazeId);
      setMaze(result);
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
    try {
      const result = await setMove(val, mazeId);
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
            <pre>{maze}</pre>
            {result?.result === 'won' || result?.result === 'over' ? null : (
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
            {result?.message && !loading && (
              <p className="message">{result.message}</p>
            )}
            {(result?.result === 'won' || result?.result === 'over') && (
              <Button className="primary" onClick={() => getMazeId()}>
                Play again
              </Button>
            )}
          </>
        )}
        {loading && <p className="message">Loading...</p>}
        {error && <p className="message">{error}</p>}
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
