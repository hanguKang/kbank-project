import React from 'react';
import { ImageComponent } from '@common/ImageComponent';

interface SectionImageProps {
  src: string;
  alt?: string;
  height?: string;
  marginBottom?: string;
}

export const SectionImage: React.FC<SectionImageProps> = ({
  src,
  alt = "섹션 이미지",
  height = "200px",
  marginBottom = "16px"
}) => {
  return (
    <ImageComponent
      src={src}
      alt={alt}
      height={height}
      marginBottom={marginBottom}
    />
  );
};