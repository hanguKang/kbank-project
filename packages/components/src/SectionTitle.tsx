import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
  marginBottom?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ 
  children, 
  marginBottom = "16px" 
}) => {
  return (
    <h3 style={{
      margin: `0 0 ${marginBottom} 0`,
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333'
    }}>
      {children}
    </h3>
  );
};