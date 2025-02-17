import React, { useEffect, useRef } from 'react';

interface AutoResizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number;
}

export const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = ({
  value,
  defaultValue,
  minRows = 1,
  className,
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to allow shrinking
    textarea.style.height = 'auto';
    
    // Calculate required height (content height + one line)
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    const minHeight = lineHeight * minRows;
    const scrollHeight = textarea.scrollHeight;
    const newHeight = Math.max(minHeight, scrollHeight + lineHeight);
    
    textarea.style.height = `${newHeight}px`;
  };

  useEffect(() => {
    adjustHeight();
  }, [value, defaultValue]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      defaultValue={defaultValue}
      className={`${className} transition-height duration-100`}
      onInput={adjustHeight}
      {...props}
    />
  );
}; 