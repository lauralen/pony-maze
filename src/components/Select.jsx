import React from 'react';

const Select = ({
  value, name, label, children, onChange,
}) => (
  <div className="select-wrapper">
    <label htmlFor={name}>{label}</label>
    <select value={value} name={name} onChange={onChange}>
      {children}
    </select>
  </div>
);

export default Select;
