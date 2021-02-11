import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowUp,
  faArrowRight,
  faArrowDown,
} from '@fortawesome/free-solid-svg-icons';

import style from './MoveButtons.module.scss';
import Button from './Button';

const MoveButtons = ({ move }) => (
  <div className={style.wrapper}>
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
);

export default MoveButtons;
