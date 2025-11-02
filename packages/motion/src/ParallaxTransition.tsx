import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

interface ParallaxTransitionProps {
  section1Content: React.ReactNode; // Section1의 이미지 DIV (Fixed)
  section2Content: React.ReactNode; // Section2의 제목 및 목록
  headerHeight?: number; // 기본값 40px
  onScrollEnd?: (isEnd: boolean) => void; // 스크롤 끝났을 때 show 클래스 대체
}

export const ParallaxTransition: React.FC<ParallaxTransitionProps> = ({
  section1Content,
  section2Content,
  headerHeight = 40,
  onScrollEnd
}) => {
  const [scrollState, setScrollState] = useState<'external' | 'internal'>('external');
  const [section1Height, setSection1Height] = useState(0);
  
  const section1ImageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // 전체 컨테이너 Ref
  const secondSectionRef = useRef<HTMLDivElement>(null);

  // Framer Motion 스크롤 훅: 전체 페이지 스크롤 위치를 추적
  const { scrollY } = useScroll();

  // 1. Section1 높이 측정 (Section2가 만나야 할 지점 = 이미지 높이)
  const measureHeight = useCallback(() => {
    if (section1ImageRef.current) {
      // 이미지 Div의 높이를 측정 (이 높이가 Section2의 스크롤 시작점)
      const height = section1ImageRef.current.offsetHeight;
      setSection1Height(height);
      console.log('📐 [Height Check] Section1 Height Measured:', height);
    }
  }, []);

  useEffect(() => {
    measureHeight();
    window.addEventListener('resize', measureHeight);
    return () => window.removeEventListener('resize', measureHeight);
  }, [measureHeight]);

  // 2. Section1 (Image)의 패럴랙스 Y 변환 계산
  // 스크롤 범위: [0, Section2가 Section1을 만나기 직전 (section1Height)]
  // Y 변환 범위: [0, -45] (위로 -45px 이동)
  const parallaxY = useTransform(
    scrollY,
    [0, section1Height],
    [0, -45],
    { clamp: true } 
  );
  
  // Section1 이미지 Div에는 부드러운 Spring 효과 적용
  const smoothParallaxY = useSpring(parallaxY, {
    stiffness: 100,
    damping: 20
  });

  // 3. 스크롤 상태 전환 및 헤더 클래스 부착 로직
  useEffect(() => {
    if (section1Height <= 0) return;

    // Header Title 클래스 제어
    const handleScrollEnd = (latestScroll: number) => {
      // 스크롤이 Section1 영역을 벗어나 Section2 내부 영역에 들어섰을 때
      const isInternal = latestScroll >= section1Height;

      if (isInternal && scrollState === 'external') {
        console.log('✅ [State Change] Transition to INTERNAL scroll.');
        setScrollState('internal');
      } else if (!isInternal && scrollState === 'internal') {
        console.log('🔙 [State Change] Transition to EXTERNAL scroll.');
        setScrollState('external');
      }

      // 최종 스크롤 종료 (Section2의 내용 스크롤이 끝남) 판단 로직은 여기에 직접 구현하기 어려움.
      // 여기서는 Section2 영역 진입 시 `show` 클래스가 붙는다고 가정합니다.
      onScrollEnd?.(isInternal);
    };

    const unsubscribe = scrollY.on('change', handleScrollEnd);

    // 초기 상태 체크 (새로고침 시)
    handleScrollEnd(scrollY.get()); 

    return () => unsubscribe();
  }, [scrollY, section1Height, scrollState, onScrollEnd]);

  return (
    <>
      {/* Debug UI (Optional) */}
      <div style={{ position: 'fixed', top: 0, left: 10, zIndex: 9999, backgroundColor: 'yellow', padding: '5px', fontSize: '12px' }}>
        Status: **{scrollState.toUpperCase()}** | S1 Height: {section1Height}px | Header H: {headerHeight}px
      </div>

      {/* 1. Header (40px Fixed) - 요구사항 1 */}
      {/* Header 컴포넌트는 외부에서 top: 0, height: 40px, zIndex: 100으로 Fixed 되어있다고 가정 */}
      <div style={{ height: headerHeight, backgroundColor: '#333', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, color: 'white' }}>
        Header (Height: {headerHeight}px) <span className={scrollState === 'internal' ? 'show' : ''}>[Title Component]</span>
      </div>
      
      {/* 2. Section1 Content (Fixed Image Div + Parallax) - 요구사항 2 */}
      {/* Image Div 자체는 Fixed로 뷰포트에 고정 */}
      <motion.div
        ref={section1ImageRef}
        style={{
          position: 'fixed',
          top: headerHeight, // Header 바로 아래에서 시작
          left: 0,
          right: 0,
          zIndex: 10,
          y: smoothParallaxY // 0 -> -45px 패럴랙스 이동
        }}
      >
        {section1Content}
      </motion.div>

      {/* 3. Section1의 공간 확보를 위한 Spacer */}
      {/* Section1 높이만큼 Spacer를 배치하여 Section2가 스크롤될 공간을 만듭니다. */}
      <div style={{ height: section1Height + headerHeight }} />

      {/* 4. Section2 Content (Relative + Sticky Title) - 요구사항 3 */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          zIndex: 20, // Section1 (z-index: 10) 위로 올라옴
          backgroundColor: 'white' // Section1을 덮을 때 배경색 필요
        }}
      >
        {/* Section2 내부 콘텐츠 (제목과 목록) */}
        {section2Content}
        
        {/* 참고: Section2 내부의 Sticky 제목 구현은 CSS와 구조로 처리 */}
        {/* <div style={{ position: 'sticky', top: headerHeight, zIndex: 30 }}>제목</div> */}
        {/* 목록은 그 아래에서 스크롤됨 */}
      </div>
    </>
  );
};