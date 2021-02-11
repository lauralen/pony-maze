import React from 'react';
import style from './Header.module.scss';

const Header = ({ children, testId }) => (
  <header className={style.header} data-testid={testId}>
    {children}
  </header>
);

export default Header;
