import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  marginBottom?: string;
  padding?: string;
  style?: React.CSSProperties; // ✅ style prop 추가
}

export const Section: React.FC<SectionProps> = ({
  children,
  marginBottom = "32px",
  padding = "0 16px",
  style = {}
}) => {
  return (
    <section style={{ 
      marginBottom,
      padding, 
     ...style
    }}>
      {children}
    </section>
  );
};