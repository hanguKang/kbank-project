import React from 'react';

export interface TextButtonProps {
  text: string;
  onClick: () => void;
  type?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const TextButton: React.FC<TextButtonProps> = ({ 
  text, 
  onClick, 
  type = 'primary',
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flex:'0 1 auto',
        padding: '8px 8px',
        border: type === 'primary' ? 'none' : '1px solid #007AFF',
        backgroundColor: type === 'primary' ? '#007AFF' : 'transparent',
        color: type === 'primary' ? 'white' : '#007AFF',
        borderRadius: '8px',
        fontSize: '14px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {text}
    </button>
  );
};