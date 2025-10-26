import React from 'react';
import { TextButton } from '@common/TextButton';

interface TextButtonGroupProps {
  onButton1Click?: () => void;
  onButton2Click?: () => void;
  button1Text?: string;
  button2Text?: string;
}

export const TextButtonGroup: React.FC<TextButtonGroupProps> = ({
  onButton1Click = () => console.log('실행1'),
  onButton2Click = () => console.log('실행2'),
  button1Text = '텍스트1',
  button2Text = '텍스트2'
}) => {
  return (
    <div style={{
      boxSizing: 'border-box',
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '12px',
      margin: '16px',
      padding: '0 16px'
    }}>
      <TextButton 
        text={button1Text} 
        onClick={onButton1Click} 
        type="primary"
      /> 
      <TextButton 
        text={button2Text} 
        onClick={onButton2Click} 
        type="secondary"
      />
    </div>
  );
};