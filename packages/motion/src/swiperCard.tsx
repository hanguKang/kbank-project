import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { KDSSwiper } from '...'; // 기존 경로

const SLIDE_DATA = [
  { image: '이미지경로1', title: '첫 번째 슬라이드 제목' },
  { image: '이미지경로2', title: '두 번째 슬라이드 제목' },
  { image: '이미지경로3', title: '세 번째 슬라이드 제목' },
];

const SWIPER_DATA = SLIDE_DATA.map(({ image }) => (
  <img src={image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
));

const BizMainCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <BizMainCardStyle>
      <SwiperContents
        showIndicator
        autoplay
        invert
        children={SWIPER_DATA}
        width="100%"
        onChange={(index) => setCurrentIndex(index)} // ← 슬라이드 변경 시 호출
        css={css`
          position: relative;
          .indicator-group {
            position: absolute;
            right: 80px;
            bottom: 80px;
            z-index: 1;
          }
        `}
      />

      {/* 블러 + 제목 */}
      <BlurOverlay>
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            style={{
              position: 'absolute',
              bottom: 40,
              left: 40,
              color: '#fff',
              fontSize: 'clamp(18px, 1.5vw, 28px)',
              fontWeight: 700,
              margin: 0,
              zIndex: 2,
            }}
          >
            {SLIDE_DATA[currentIndex].title}
          </motion.p>
        </AnimatePresence>
      </BlurOverlay>
    </BizMainCardStyle>
  );
};

export default BizMainCard;

const BizMainCardStyle = styled.div`
  border-radius: clamp(20px, 1.67vw, 32px);
  flex: 1;
  height: 100%;
  position: relative;
  overflow: hidden;
  max-width: 1154px;
  min-width: clamp(400px, 26vw, 500px);
`;

const SwiperContents = styled(KDSSwiper)`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
`;

const BlurOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 42%;
  backdrop-filter: blur(5px);
  border-radius: 0 0 clamp(20px, 1.67vw, 32px) clamp(20px, 1.67vw, 32px);
  background: linear-gradient(to top, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 100%);
  pointer-events: none;
`;