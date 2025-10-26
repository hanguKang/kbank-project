import React from 'react';

interface ImageComponentProps {
  src: string;
  alt?: string;
  width?: string;
  height?: string;
  marginBottom?: string;
}

export const ImageComponent: React.FC<ImageComponentProps> = ({
  src,
  alt = "이미지",
  width = "100%",
  height = "200px",
  marginBottom = "16px"
}) => {
  return (
    <div style={{ marginBottom , textAlign: 'center' }}>
      <img 
        src={src} 
        alt={alt}
        style={{
          width,
          height,
          objectFit: 'cover',
          borderRadius: '8px'
        }}
      />
    </div>
  );
};