// packages/common/src/ListItem.tsx
import React from 'react';

interface ListItemProps {
  children: React.ReactNode;
  height?: string;
  padding?: string;
  isEven?: boolean;
}

export const ListItem: React.FC<ListItemProps> = ({
  children,
  height = '36px',
  padding = '8px',
  isEven = false
}) => {
  return (
    <li
      style={{
        height,
        padding,
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #f0f0f0',
        backgroundColor: isEven ? '#f9f9f9' : 'white',
        margin: 0,
        listStyle: 'none'
      }}
    >
      {children}
    </li>
  );
};