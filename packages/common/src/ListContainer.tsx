// packages/common/src/ListContainer.tsx
import React from 'react';

interface ListContainerProps {
  children: React.ReactNode;
  maxHeight?: string;
}

export const ListContainer: React.FC<ListContainerProps> = ({
  children,
  maxHeight = '400px'
}) => {
  return (
    <div
      style={{
        maxHeight,
        overflowY: 'auto',
        border: '1px solid #eee',
        borderRadius: '8px'
      }}
    >
      {children}
    </div>
  );
};