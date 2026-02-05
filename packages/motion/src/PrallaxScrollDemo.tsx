import React, { useState, type ReactEventHandler } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Header = ({ currentIndex, direction }: { currentIndex: number; direction: number }) => {
  let showHeader = false;

  if (direction === 1) { // 순차 스크롤 시
    if (currentIndex === 1) showHeader = true; // 2번째 페이지 진입 시만 반짝
    else showHeader = false;
  } else { // 역순 스크롤 시
    if (currentIndex > 0) showHeader = true; // 1번으로 돌아가기 전까진 계속 보임
    else showHeader = false;
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: showHeader ? 0 : -100 }}
      transition={{ duration: 0.5 }}
      style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100 }}
    >
      {/* 헤더 내용 */}
    </motion.header>
  );
};

const ParallaxScrollDemo = () => {
  const [index, setIndex] = useState(0); // 0 ~ 8 (총 9개 섹션)
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(1); // 1: 순차, -1: 역순

  const handleWheel = (e:React.WheelEvent<HTMLDivElement>) => {
    if (isAnimating) return; // 애니메이션 중 스크롤 차단

    if (e.deltaY > 0 && index < 8) {
      setDirection(1);
      setIsAnimating(true);
      setIndex(prev => prev + 1);
    } else if (e.deltaY < 0 && index > 0) {
      setDirection(-1);
      setIsAnimating(true);
      setIndex(prev => prev - 1);
    }
    // index === 8 (9번째 섹션)일 때는 브라우저 기본 스크롤이 작동하도록 예외 처리 필요
  };

  return (
    <div className="container" onWheel={handleWheel} style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <Header currentIndex={index} direction={direction} />
      
      <AnimatePresence mode="wait" onExitComplete={() => setIsAnimating(false)}>
        <motion.div
          key={index}
          className={`myFinanceSect${index + 1} myFinanceSect`}
          initial={{ opacity: 0, y: direction > 0 ? 100 : -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: direction > 0 ? -100 : 100 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          {/* 각 섹션 컴포넌트 */}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};


export default ParallaxScrollDemo;