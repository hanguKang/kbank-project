import React from 'react';

interface ListComponentProps {
  itemCount?: number;
  itemHeight?: string;
  padding?: string;
  maxHeight?: string;
}

export const ListComponent: React.FC<ListComponentProps> = ({
  itemCount = 50,
  itemHeight = '36px',
  padding = '8px',
  maxHeight = '400px'
}) => {
  const items = Array.from({ length: itemCount }, (_, index) => ({
    id: index + 1,
    text: `목록 항목 ${index + 1}`
  }));

  return (
    <ul
      style={{
        maxHeight,
        overflowY: 'auto',
        border: '1px solid #eee',
        borderRadius: '8px',
        margin: 0,
        padding: 0,
        listStyle: 'none'
      }}
    >
      {items.map((item) => (
        <li
          key={item.id}
          style={{
            height: itemHeight,
            padding,
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0',
            backgroundColor: item.id % 2 === 0 ? '#f9f9f9' : 'white'
          }}
        >
          {item.text}
        </li>
      ))}
    </ul>
  );
};