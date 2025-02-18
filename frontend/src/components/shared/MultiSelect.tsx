import React from 'react';
import Select, { MultiValue, ActionMeta } from 'react-select';

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
  className,
  placeholder = 'Select...'
}) => {
  const handleChange = (
    newValue: MultiValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => {
    onChange(newValue as Option[]);
  };

  return (
    <Select
      isMulti
      options={options}
      value={value}
      onChange={handleChange}
      className={className}
      placeholder={placeholder}
      closeMenuOnSelect={false}
      isSearchable={true}
      isClearable={true}
      styles={{
        control: (base) => ({
          ...base,
          borderRadius: '0.5rem',
          borderColor: '#e2e8f0',
          '&:hover': {
            borderColor: '#cbd5e1'
          }
        }),
        multiValue: (base) => ({
          ...base,
          borderRadius: '0.375rem',
          backgroundColor: '#e2e8f0'
        })
      }}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: '#3b82f6', // Tailwind blue-500
          primary75: '#60a5fa', // Tailwind blue-400
          primary50: '#93c5fd', // Tailwind blue-300
          primary25: '#bfdbfe', // Tailwind blue-200
        },
      })}
    />
  );
};