import React from 'react';
import style from './Modal.module.scss';

const Modal = ({ children }) => (
  <div className={style.overlay}>
    <div className={style.modal} data-testid="modal">
      {children}
    </div>
  </div>
);

export default Modal;
