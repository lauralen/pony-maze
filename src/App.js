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
import Select from './components/Select';

import { loadMazeId, loadMaze, setMove } from './utils/api';

const LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function App() {
  const [mazeId, setMazeId] = useState(null);
  const [maze, setMaze] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [difficulty, setDifficulty] = useState(0);

  const getMazeId = async () => {
    setLoading(true);
    setError(null);
    setResult({ message: 'Make first move' });

    try {
      const result = await loadMazeId(difficulty);
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

    const hasPlayed = JSON.parse(localStorage.getItem('hasPlayed'));

    if (!hasPlayed) {
      setModalOpen(true);
      localStorage.setItem('hasPlayed', JSON.stringify(true));
    }
  }, []);

  useEffect(() => {
    if (mazeId) getMaze();
  }, [mazeId]);

  useEffect(() => {
    getMazeId();
  }, [difficulty]);

  const move = async (val) => {
    try {
      const result = await setMove(val, mazeId);
      setResult({ result: result.state, message: result['state-result'] });
      getMaze();
    } catch (err) {
      setResult({ result: 'error', message: 'Failed to move' });
    }
  };

  const handleKeyDown = (event) => {
    const { key } = event;
    let direction;

    switch (key) {
      case 'ArrowUp':
        direction = 'north';
        break;
      case 'ArrowRight':
        direction = 'east';
        break;
      case 'ArrowDown':
        direction = 'south';
        break;
      case 'ArrowLeft':
        direction = 'west';
        break;
      case 'Enter':
        direction = 'stay';
        break;
    }

    if (direction) move(direction);
  };

  return (
    <div
      className="keypress-handler"
      role="button"
      tabIndex="0"
      onKeyDown={(event) => handleKeyDown(event)}
    >
      <header className="header" data-testid="header">
        <h1 className="header-title">Pony maze</h1>
        <Select
          label="Difficulty:"
          value={difficulty}
          name="difficulty"
          onChange={(event) => setDifficulty(Number(event.target.value))}
        >
          {LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </Select>
      </header>
      <main>
        {maze && (
          <>
            <pre data-testid="maze">{maze}</pre>
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
              <p className="message" data-testid="message">
                {result.message}
              </p>
            )}
            {(result?.result === 'won' || result?.result === 'over') && (
              <Button
                className="primary"
                onClick={() => getMazeId()}
                testId="btn-play-again"
              >
                Play again
              </Button>
            )}
          </>
        )}
        {loading && (
          <p className="message" data-testid="loader">
            Loading...
          </p>
        )}
        {error && (
          <p className="message" data-testid="error">
            {error}
          </p>
        )}
      </main>

      <Button
        className="round modal-open"
        onClick={() => setModalOpen(true)}
        testId="btn-modal-open"
      >
        <FontAwesomeIcon icon={faQuestionCircle} />
      </Button>

      {modalOpen && (
        <Modal>
          <p>
            Move pony (P) to the exit (E) and watch out for the monster
            protecting the maze (D).
          </p>
          <p>
            Pony can also be controlled using keyboard. Use arrow buttons to
            move and enter to stay in current position.
          </p>
          <Button
            className="modal-close"
            onClick={() => setModalOpen(false)}
            testId="btn-modal-close"
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </Modal>
      )}
    </div>
  );
}

export default App;
