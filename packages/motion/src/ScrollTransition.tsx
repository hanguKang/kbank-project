import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

// ScrollTransition 컴포넌트의 Props 정의
interface ScrollTransitionProps {
  firstSection: React.ReactNode;
  secondSection: React.ReactNode;
  headerHeight?: number; // 기본값 50px
  onScrollStateChange?: (state: 'external' | 'internal') => void;
}

/**
 * Section1이 고정되고, Section2가 스크롤되어 Header 바로 아래에 멈추는 전환 효과를 구현합니다.
 */
export const ScrollTransition: React.FC<ScrollTransitionProps> = ({
  firstSection,
  secondSection,
  headerHeight = 50,
  onScrollStateChange
}) => {
  const [scrollState, setScrollState] = useState<'external' | 'internal'>('external');
  const [firstSectionHeight, setFirstSectionHeight] = useState(0);
  
  const firstSectionRef = useRef<HTMLDivElement>(null);

  // Framer Motion 스크롤 훅: 전체 페이지 스크롤 위치를 추적
  const { scrollY } = useScroll();

  // 1. Section1 높이 측정
  const measureHeight = useCallback(() => {
    if (firstSectionRef.current) {
      const height = firstSectionRef.current.offsetHeight;
      console.log('📐 [Height Check] Section1 Height Measured:', height);
      setFirstSectionHeight(height);
    } else {
      console.log('⚠️ [Height Check] Section1 Ref not ready.');
    }
  }, []);

  useEffect(() => {
    measureHeight();
    window.addEventListener('resize', measureHeight);
    return () => window.removeEventListener('resize', measureHeight);
  }, [measureHeight]);

  // 2. 초기 스크롤 상태 진입 강제화 (새로고침 시 스크롤 위치 기억 문제 해결)
  useEffect(() => {
    if (firstSectionHeight <= 0) return;

    const currentScroll = scrollY.get();
    
    if (currentScroll >= firstSectionHeight && scrollState !== 'internal') {
      console.log(`🚀 [Initial Check] Starting scrollY (${currentScroll}) is past Target (${firstSectionHeight}). Forcing INTERNAL state.`);
      setScrollState('internal');
      onScrollStateChange?.('internal');
    }
  }, [firstSectionHeight, scrollY, scrollState, onScrollStateChange]);


  // 3. Section2의 y 위치 변환 계산 (역변환 적용: [0, 370] -> [370, 0])
  // Section2가 Fixed 상태에서 아래(370)로 밀렸다가, 스크롤에 따라 위(0)로 올라와 50px에 고정됨
  const section2TranslateY = useTransform(
    scrollY,
    [0, firstSectionHeight],
    [firstSectionHeight, 0], // 역방향 변환으로 변경!
    { clamp: true } 
  );

  // 4. Section2의 y 변환에 부드러운 효과(Spring) 적용
  const smoothY = useSpring(section2TranslateY, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001
  });

  // 5. 스크롤 상태 전환 (스크롤 "변경" 시점 감지)
  useEffect(() => {
    if (firstSectionHeight <= 0) return;

    const unsubscribe = scrollY.on('change', (latest) => {
      // 📈 로깅: 현재 스크롤 위치와 기준 높이
      // console.log(`📈 [Scroll Check] scrollY: ${latest.toFixed(2)}, Target: ${firstSectionHeight}`);

      if (scrollState === 'external' && latest >= firstSectionHeight) {
        console.log('✅ [State Change] Transition to INTERNAL scroll.');
        setScrollState('internal');
        onScrollStateChange?.('internal');
      } 
      else if (scrollState === 'internal' && latest < firstSectionHeight) {
        console.log('🔙 [State Change] Transition to EXTERNAL scroll (scrollY check).');
        setScrollState('external');
        onScrollStateChange?.('external');
      }
    });

    return () => unsubscribe();
  }, [scrollY, scrollState, firstSectionHeight, onScrollStateChange]);

  // 6. 내부 스크롤 핸들러: 내부 -> 외부 전환 로직 (휠 이벤트)
  const handleInternalScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollState !== 'internal') return;

    const target = e.currentTarget as HTMLDivElement;
    const scrollTop = target.scrollTop;
    
    // console.log(`⬇️ [Internal Scroll] deltaY: ${e.deltaY.toFixed(2)}, scrollTop: ${scrollTop}`);

    if (scrollTop <= 0 && e.deltaY < 0) {
      console.log('🛑 [Internal Scroll End] Transition to EXTERNAL scroll (wheel event).');
      setScrollState('external');
      onScrollStateChange?.('external');
    }
  };
  
  // Section1 높이 + 헤더 높이: Spacer가 확보해야 할 총 공간
  const totalSpacerHeight = `${headerHeight + firstSectionHeight}px`;

  return (
    <>
      {/* 디버그 UI: 현재 상태 및 Y 변환 값을 추가하여 디버깅 용이성 확보 */}
      <div style={{ position: 'fixed', top: 0, left: 10, zIndex: 9999, backgroundColor: 'yellow', padding: '5px', fontSize: '12px' }}>
        Status: **{scrollState.toUpperCase()}** | Height: {firstSectionHeight}px | Scroll Y: {scrollY.get().toFixed(0)} | Y Trans: {smoothY.get().toFixed(0)}
      </div>

      {/* 1. Section1: FIXED (요구사항 2), Header 바로 아래 고정 */}
      <div
        ref={firstSectionRef}
        style={{
          position: 'fixed',
          top: headerHeight,
          left: 0,
          right: 0,
          zIndex: 10,
          backgroundColor: 'white'
        }}
      >
        {firstSection}
      </div>
      
      {/* 2. Spacer: Section1이 차지하는 공간을 문서 흐름에 확보 */}
      <div style={{ height: totalSpacerHeight }} />

      {/* 3. Section2: FIXED + Transform으로 위치 제어 (요구사항 3, 4) */}
      <motion.div
        style={{
          position: 'fixed', // 뷰포트에 고정! 스크롤에 따라 이동하지 않음.
          top: headerHeight, // 고정 위치: Header 바로 아래 (50px)
          left: 0,
          right: 0,
          y: smoothY, // Y 변환으로 초기 위치 제어 및 고정 지점까지 이동
          
          minHeight: `calc(100vh - ${headerHeight}px)`,
          height: scrollState === 'internal' ? `calc(100vh - ${headerHeight}px)` : 'auto',
          overflowY: scrollState === 'internal' ? 'auto' : 'hidden',
          overscrollBehavior: 'contain', 
          zIndex: 20 // Section1을 덮기 위해 높게 설정
        }}
        onWheel={handleInternalScroll}
      >
        {secondSection}
      </motion.div>
    </>
  );
};