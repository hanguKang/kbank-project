// packages/components/src/FixedHeader.tsx
import React from 'react';

export const FixedHeader: React.FC = () => {
  return (
    <header style={{
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
      zIndex: 1000
    }}>
      <button>←</button>
      <h2 style={{ margin: 0, fontSize: '18px' }}>제목</h2>
      <button>관리</button>
    </header>
  );
};