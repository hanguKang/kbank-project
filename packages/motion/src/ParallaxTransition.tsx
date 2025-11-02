// src/motion/ParallaxTransition.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue } from 'framer-motion';

interface ParallaxTransitionProps {
  section1Content: React.ReactNode; // imgWrapper 내부 콘텐츠 (이미지 + 제목)
  section2Content: React.ReactNode; // div.section2 내용 (Sticky Title + 목록)
  headerHeight?: number; 
  onScrollEnd?: (isEnd: boolean) => void; 
}

// =========================================================================
// Section1Wrapper (div.section1 역할: 높이 측정 및 공간 확보)
// =========================================================================
const Section1Wrapper: React.FC<{ 
    children: React.ReactNode; 
    setHeight: (h: number) => void;
    currentHeight: number;
    // imgWrapper에 대한 Ref를 받기 위한 props
    contentRef: React.RefObject<HTMLDivElement | null>; 
  }> = ({ children, setHeight, currentHeight, contentRef }) => {
  
  // 1. imgWrapper의 높이를 getBoundingClientRect로 측정
  const measure = useCallback(() => {
    if (contentRef.current) {
      // getBoundingClientRect().height 사용: 가장 정확한 렌더링된 높이 반환
      const rect = contentRef.current.getBoundingClientRect();
      const height = rect.height;
      
      // 높이 값이 유효하고 변경된 경우에만 업데이트
      if (height > 0 && height !== currentHeight) {
          setHeight(height);
          // console.log('📐 [S1 Height] Measured via getBoundingClientRect:', height);
      }
    }
  }, [setHeight, currentHeight, contentRef]);

  // DOM이 준비되었을 때와 윈도우 크기가 변경될 때 측정
  useEffect(() => {
    measure(); 
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  // 2. div.section1의 높이 역할을 수행하는 래퍼 (position: static)
  return (
    <div 
      // div.section1 역할: 높이 확보. currentHeight만큼 높이를 강제로 갖습니다.
      style={{ 
        height: currentHeight > 0 ? currentHeight : 'auto', 
        position: 'relative', 
        zIndex: 10,
        marginTop: '0px' // Header 공간은 App.tsx에서 별도의 Div로 확보합니다. (ParallaxTransition의 부모에서 처리)
      }}
    >
      {children}
    </div>
  );
};
// =========================================================================

export const ParallaxTransition: React.FC<ParallaxTransitionProps> = ({
  section1Content,
  section2Content,
  headerHeight = 40,
  onScrollEnd
}) => {
  // imgWrapper 내부 콘텐츠의 높이 (section1Wrapper의 height으로 사용됨)
  const [section1ContentHeight, setSection1ContentHeight] = useState(0); 
  const [scrollState, setScrollState] = useState<'external' | 'internal'>('external');
  
  // imgWrapper 역할을 하는 motion.div에 연결할 Ref 생성
  const section1ContentRef = useRef<HTMLDivElement>(null); 
  
  const { scrollY, scrollYProgress } = useScroll();
  const y = useMotionValue(0);
  
  // Section2가 뷰포트 상단(Header 아래)에 도달하는 총 스크롤 양
  const transitionPoint = section1ContentHeight; // Section1Wrapper 높이
                                                 // Header 높이는 App.tsx에서 margin-top으로 처리되므로,
                                                 // 스크롤 양은 Section1 Content Height만큼 올라가면 Section2가 뷰포트에 도달함.

                                                 
  // 1. imgWrapper의 패럴랙스 Y 변환 계산
  // 스크롤 범위: [0, transitionPoint]
  // Y 변환 범위: [0, -45] (위로 -45px 이동)
const parallaxY = useTransform(
    scrollY,
    [0, transitionPoint], 
    [0, -45], 
    { clamp: true } 
);
  
  // ⭐️ useSpring을 사용하여 렌더링 안정성을 확보하되, 
  //    물리 파라미터를 조정하여 지연을 거의 없앰 (즉각 반응)
  const smoothParallaxY = useSpring(parallaxY, {
    stiffness: 20000, // ⭐️ 강성: 매우 높은 값으로 설정하여 즉각 목표치로 이동
    damping: 2000,    // ⭐️ 감쇠: 매우 높은 값으로 설정하여 진동(지연)을 즉시 소멸
    mass: 2,          // 질량: 기본값 또는 작은 값 유지
  });

  // 2. Header Title 클래스 부착 로직
  // useEffect(() => {
  //   if (section1ContentHeight <= 0) return;

  //   const handleScrollEnd = (latestScroll: number) => {
  //     // 스크롤이 Section1 영역을 벗어나 Section2 영역에 진입하는 지점
  //     const isInternal = latestScroll >= transitionPoint;
      
  //     const newScrollState = isInternal ? 'internal' : 'external';
  //     if (newScrollState !== scrollState) {
  //       setScrollState(newScrollState); 
  //     }

  //     onScrollEnd?.(isInternal);
  //   };

  //   const unsubscribe = scrollY.on('change', handleScrollEnd);
  //   handleScrollEnd(scrollY.get()); 

  //   return () => unsubscribe();
  // }, [scrollY, transitionPoint, scrollState, onScrollEnd, section1ContentHeight]);

useEffect(() => {
    // 💡 transitionPoint가 0이 아니며 유효한 값일 때만 로직 실행
    if (transitionPoint === 0) return;

    // ⭐️ scrollY 값의 변화를 감지하고 y.set()으로 변환을 수동 적용
    const unsubscribe = scrollY.on('change', (latestScrollY) => {
      // 1. 현재 스크롤 위치가 Section 1 범위를 벗어나지 않도록 클램프(clamp)
      //    스크롤 범위: [0, transitionPoint]
      const clampedScroll = Math.max(0, Math.min(latestScrollY, transitionPoint));
      
      // 2. 스크롤 진행률 (0.0 ~ 1.0) 계산
      const progress = clampedScroll / transitionPoint; 
      
      // 3. 변환: (0.0 -> 1.0) 진행률을 원하는 이동 범위 (0 -> -45)로 매핑
      //    (total 이동거리: 45px)
      const targetY = progress * -45; 
      
      // 4. y MotionValue 업데이트 (즉각적인 반응)
      y.set(targetY);
    });

    return () => unsubscribe();
  }, [scrollY, transitionPoint, y]); // 💡 transitionPoint가 변경될 때마다 재실행

  return (
    <div>
      {/* Debug UI (Optional) */}
      <div style={{ position: 'fixed', top: 0, left: 10, zIndex: 9999, backgroundColor: 'yellow', padding: '5px', fontSize: '12px' }}>
        S1 H: {section1ContentHeight.toFixed(0)}px | Trans. Point: {transitionPoint.toFixed(0)}px | Y: {smoothParallaxY.get().toFixed(1)}
      </div>
      
      {/* 1. div.section1 역할: 높이 확보 */}
      <Section1Wrapper 
        setHeight={setSection1ContentHeight} 
        currentHeight={section1ContentHeight}
        contentRef={section1ContentRef} 
      >
        {/* 1-1. div.imgWrapper 역할: position: fixed + motion.div 적용 */}
        <motion.div
          ref={section1ContentRef} // motion.div에 Ref 연결 -> 높이 측정 대상
          style={{
            position: 'fixed', 
            top: headerHeight,  // Header 바로 아래에서 고정 시작
            left: 0,
            right: 0,
            width: '100%',
            //y: smoothParallaxY, // Parallax 이동
            //y: parallaxY, // Parallax 이동
            y: y,
            zIndex: 10 
          }}
        >
          {/* Section1 Content (이미지 + 제목) */}
          {section1Content}
        </motion.div>
      </Section1Wrapper>

      {/* 2. div.section2 역할: position: relative */}
      <div
        style={{
          position: 'relative', 
          zIndex: 20, // Section1을 덮음
          backgroundColor: 'white'
        }}
      >
        {section2Content}
      </div>
    </div>
  );
};