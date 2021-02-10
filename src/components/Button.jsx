import React from 'react';

const Button = ({
  className, onClick, disabled, children, testId,
}) => (
  <button
    type="button"
    className={className}
    onClick={onClick}
    disabled={disabled}
    data-testid={testId}
  >
    {children}
  </button>
);

export default Button;
