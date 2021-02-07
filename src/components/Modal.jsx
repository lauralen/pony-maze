import React from 'react';

const Modal = ({ children }) => (
  <div className="overlay">
    <div className="modal">{children}</div>
  </div>
);

export default Modal;
