import React from 'react';
import style from './Select.module.scss';

const Select = ({
  value, name, label, children, onChange,
}) => (
  <div className={style.selectWrapper}>
    <label htmlFor={name}>{label}</label>
    <select
      className={style.select}
      value={value}
      name={name}
      onChange={onChange}
    >
      {children}
    </select>
  </div>
);

export default Select;
