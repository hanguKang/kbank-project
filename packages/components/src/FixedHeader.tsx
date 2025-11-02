// packages/components/src/FixedHeader.tsx
import React from 'react';
interface FixedHeaderProps {
  children: React.ReactNode;
  titleClassName?: string;
  style?: React.CSSProperties;
}
export const FixedHeader: React.FC<FixedHeaderProps> = ({children, titleClassName, style}) => {
  return (
    <header className={titleClassName} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '50px',
      backgroundColor: 'white',
      borderBottom: '1px solid #eee',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 16px',
      zIndex: 1000,
      ...style
    }}>
      <button>←</button>
      {children}
      <button>관리</button>
    </header>
  );
};