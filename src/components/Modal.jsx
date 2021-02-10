import React from 'react';

const Modal = ({ children }) => (
  <div className="overlay">
    <div className="modal" data-testid="modal">
      {children}
    </div>
  </div>
);

export default Modal;
