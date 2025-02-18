import React from 'react';
import Select, { MultiValue } from 'react-select';

export interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value: Option[];
  onChange: (selected: Option[]) => void;
  className?: string;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  className = '',
  placeholder = 'Select...',
}) => {
  return (
    <Select
      isMulti
      options={options}
      value={value}
      onChange={(newValue) => onChange(newValue as Option[])}
      className={className}
      classNamePrefix="react-select"
      placeholder={placeholder}
      styles={{
        control: (base) => ({
          ...base,
          borderColor: '#e5e7eb',
          '&:hover': {
            borderColor: '#e5e7eb'
          }
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected 
            ? '#3b82f6' 
            : state.isFocused 
              ? '#bfdbfe' 
              : 'transparent',
          '&:active': {
            backgroundColor: '#bfdbfe'
          }
        })
      }}
    />
  );
}; 