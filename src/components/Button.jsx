import React from 'react';
import style from './Button.module.scss';

const Button = ({
  className, onClick, disabled, children, testId,
}) => (
  <button
    type="button"
    className={`${style.button} ${style[className]}`}
    onClick={onClick}
    disabled={disabled}
    data-testid={testId}
  >
    {children}
  </button>
);

export default Button;
