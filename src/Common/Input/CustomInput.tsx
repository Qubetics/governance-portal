// CustomInput.tsx
import React from 'react';
import "./CustomInput.scss"
interface CustomInputProps {
  id: string;
  name: string;
  placeholder: string;
  disable?: boolean
  onChange?: any,
  value?: string | number,
  ref?: any,
  keyDown?: any
}

const CustomInput: React.FC<CustomInputProps> = ({ id, name, placeholder, disable, onChange, value, ref, keyDown = null }) => {
  return (
    <input
      ref={ref}
      type="text"
      autoSave="off"
      autoComplete='off'
      id={id}
      name={name}
      value={value}
      onChange={onChange ?? (() => { })}
      disabled={disable ?? false}
      placeholder={placeholder}
      className="custom-input"
      onKeyDown={keyDown}
    />
  );
};

export default CustomInput;
