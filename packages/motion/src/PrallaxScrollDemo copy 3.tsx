import styled from '@emotion/styled';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import './mainTest.css';

const SECTION_COLORS = [
  '#0114a7', '#e4edf9', '#4982bf', '#17191e', '#7354b2',
  '#3d7047', '#6790b7', '#2f1d71', '#0115a7',
];

const HeroContainer = styled.div`
  display: flex;
  gap: clamp(20px, 1.4vw, 48px);
  font-size: clamp(40px, 3.33vw, 64px);
  font-weight: 700;
  letter-spacing: -0.017em;
  line-height: 1.35;
  white-space: nowrap;
`;

const SECTION_TITLES = [
  <HeroContainer key="t0">
    <div className={'hero-title text-part1'}>나의 금융생활이</div>
    <div className={'hero-title text-part2'}>즐거움으로</div>
    <div className={'hero-title hero-title-wrapper'} style={{ position: 'relative', padding: '0 20px' }}>
      <div className={'white-box'} />
      <div className={'hero-title text-part3'} style={{ position: 'relative', color: '#0114a7', zIndex: 1 }}>
        가득해지도록.
      </div>
    </div>
  </HeroContainer>,
  <React.Fragment key="t1" />,
  <HeroContainer key="t2">
    <div className={'hero-title'}>재미있는</div>
    <div className={'hero-title-wrapper'}>
      <div className={'hero-white-box'} />
      <div className={'hero-title'}>돈 모으기</div>
    </div>
  </HeroContainer>,
  <HeroContainer key="t3">
    <div className={'hero-title'}>카드 한 장으로 골라쓰는</div>
    <div className={'hero-title-wrapper'}>
      <div className={'hero-white-box'} />
      <div className={'hero-title'}>혜택</div>
    </div>
  </HeroContainer>,
  <HeroContainer key="t4">
    <div className={'hero-title'}>비교할 수록 가벼운</div>
    <div className={'hero-title-wrapper'}>
      <div className={'hero-white-box'} />
      <div className={'hero-title'}>이자 생활</div>
    </div>
  </HeroContainer>,
  <HeroContainer key="t5">
    <div className={'hero-title'}>즐거움으로</div>
    <div className={'hero-title-wrapper'}>
      <div className={'hero-white-box'} />
      <div className={'hero-title'}>가득해지기를</div>
    </div>
  </HeroContainer>,
  <HeroContainer key="t6">
    <div className={'hero-title'}>일상이 돈이 되는</div>
    <div className={'hero-title-wrapper'}>
      <div className={'hero-white-box'} />
      <div className={'hero-title'}>마법</div>
    </div>
  </HeroContainer>,
  <HeroContainer key="t7">
    <div className={'hero-title'}>내 미래를 위한</div>
    <div className={'hero-title-wrapper'}>
      <div className={'hero-white-box'} />
      <div className={'hero-title'}>자산관리도</div>
    </div>
  </HeroContainer>,
  <React.Fragment key="t8" />,
];

const footerHeight = '300px';

const Header = ({ isShow }: { isShow: boolean }) => {
  return (
    <motion.header
      animate={{ y: isShow ? 0 : -100, opacity: isShow ? 1 : 0 }}
      initial={{ y: -100, opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: 'clamp(60px, 4.17vw, 80px)',
        minWidth: '1080px',
        zIndex: 1000,
        backgroundColor: 'rgba(228, 237, 249, 0.8)',
        backdropFilter: 'blur(25px)',
      }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <div style={{ fontWeight: 'bold', padding: '20px' }}>kbank</div>
    </motion.header>
  );
};

const Section6 = ({ isAnimationRef, step, xProgress, color, setIsAnimate }: {
  isAnimationRef: React.RefObject<boolean>;
  step: number;
  xProgress: MotionValue<number>;
  color: string;
  setIsAnimate: (arg: boolean) => void;
}) => {
  const translateX = useTransform(xProgress, [0, 1], ['5%', '-5%']);
  return (
    <div style={{ backgroundColor: color, width: '100%', height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div style={{ x: translateX, perspective: 1000 }}>
        <motion.div
          animate={{ z: step * 200 }}
          style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '1rem' }}
          onAnimationStart={() => { isAnimationRef.current = true; setIsAnimate(true); }}
          onAnimationComplete={() => { isAnimationRef.current = false; setIsAnimate(false); }}
        >
          <h2 style={{ fontWeight: 'bold', color: '#fff' }}>제목</h2>
        </motion.div>
      </motion.div>
    </div>
  );
};

const GeneralSection = ({ children, idx, color }: { children?: React.ReactNode; idx: number; color: string; }) => {
  return (
    <div style={{
      backgroundColor: color,
      boxSizing: 'border-box',
      padding: idx === 1 ? 'clamp(60px, 16.7vw, 80px) clamp(24px, 8.33vw, 160px) 0 clamp(24px, 8.33vw, 160px)' : '0',
      width: '100%',
      height: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {children}
      {idx === 0 && (
        <div className={'scroll-indicator'}>
          <svg fill="none" viewBox="0 0 55 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.86 6.5L27.5 18L47.14 6.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      )}
    </div>
  );
};

const PrallaxScrollDemo = () => {
  const [index, setIndex] = useState<number>(0);
  const [internalStep, setInternalStep] = useState<number>(0);
  const [isExitingStep, setIsExitingStep] = useState<number>(0);  
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [showHeaderBox, setShowHeaderBox] = useState<boolean>(false);
  const [direction, setDirection] = useState(0);

  const xProgress = useMotionValue<number>(0.5);
  const MAX_S1_STEP = 1;
  const MAX_S5_STEP = 2;
  
  const isAnimatingRef = useRef(false);
  const directionRef = useRef(0);
  const indexRef = useRef(0);
  const stepRef = useRef(0);
  const nextIndexRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => xProgress.set(e.clientX / window.innerWidth);
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [xProgress]);

  const lock = (ms: number) => {
    isAnimatingRef.current = true;
    setIsAnimating(true);
    
    setTimeout(() => {
      isAnimatingRef.current = false;
      setIsAnimating(false);
    }, ms);
  };

  const updateIndex = (newIdx: number, dir: number) => {
    if (newIdx === 1) {
      // 진입 시 이미 step을 MAX로 → 다음 휠에서 바로 2로 이동
      stepRef.current = dir === -1 ? 0 : MAX_S1_STEP;
      lock(2000);
    } else if (newIdx === 5) {
      stepRef.current = dir === -1 ? 0 : MAX_S5_STEP;
      lock(2000);
    } else {
      stepRef.current = 0;
      lock(600);
    }

    setInternalStep(stepRef.current);
    indexRef.current = newIdx;
    setIndex(newIdx);
  };

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    console.log('isAnimating:', isAnimatingRef.current);
  if (Math.abs(e.deltaY) < 30 || isAnimatingRef.current) return;

  const isNext = e.deltaY > 0;
  const prevDirection = directionRef.current;
  directionRef.current = isNext ? 1 : -1;
  setDirection(directionRef.current);

  const currIdx = indexRef.current;

  // 1. 아래로 스크롤 (Next)
  if (isNext) {
    setShowHeaderBox(false);
    if (currIdx === 8) return; // 마지막 섹션이면 종료

    // [수정 포인트] index 1 혹은 5일 때만 내부 Step 진행
    if (currIdx === 1 || currIdx === 5) {
      const maxStep = currIdx === 1 ? MAX_S1_STEP : MAX_S5_STEP;
      if (stepRef.current < maxStep) {
        stepRef.current += 1;
        setInternalStep(stepRef.current);
        lock(1800); // 내부 애니메이션 시간만큼 잠금
        console.log(`내부 Step 진행: ${stepRef.current} / ${stepRef.current}`);
        return; 
      }
      if (stepRef.current === maxStep) {
        setIsExitingStep(1);
        nextIndexRef.current = currIdx + 1;
        lock(1800); // 내부 애니메이션 시간만큼 잠금
        return;
      }
    }

    // innerVariants 애니메이션이 끝난 후에 index 변경을 맡기도록 수정
    // if (currIdx === 1 || currIdx === 5) {  
    //   const maxStep = currIdx === 1 ? MAX_S1_STEP : MAX_S5_STEP;
    //   if (stepRef.current === maxStep) {
    //     nextIndexRef.current = currIdx + 1;
    //     lock(1800); // 내부 애니메이션 시간만큼 잠금
    //     return;
    //   }
    // }

    // 내부 Step이 끝났거나 일반 섹션인 경우 다음 인덱스로
    updateIndex(currIdx + 1, 1);


  // 2. 위로 스크롤 (Prev)
  } else {
    if (currIdx === 0) return;

    if (prevDirection === 1 || !showHeaderBox) {
      setShowHeaderBox(true);
      lock(600);
      return; // 여기서 1회 소모
    }

    // 헤더가 없는 상태에서 위로 올리면 헤더부터 보여줌 (기획 의도에 따라 선택)
    if (!showHeaderBox) {
      setShowHeaderBox(true);
      lock(600);
      return;
    }

    // [수정 포인트] index 1 혹은 5일 때만 내부 Step 역순 진행
    if ((currIdx === 1 || currIdx === 5) && stepRef.current > 0) {
      stepRef.current -= 1;
      setInternalStep(stepRef.current);
      lock(1800); // 내부 애니메이션 시간만큼 잠금
      return;
    }
    

    const nextIdx = currIdx - 1;

    // [핵심] 다음 목적지가 index 1이면 헤더 유지, 그 외(특히 0)는 제거
    if (nextIdx === 1) {
      setShowHeaderBox(true); // 유지
    } else {
      setShowHeaderBox(false); // 1 -> 0으로 갈 때 등
    }

    updateIndex(nextIdx, -1);

  }
}, [showHeaderBox, lock, updateIndex]); // 의존성 배열에 필요한 함수 추가

  const isHeaderShow = showHeaderBox || (directionRef.current === 1 && index === 1);

  const innerVariants = {
    initial: (dir: number) => ({ y: dir > 0 ? '80px' : '-80px', opacity: 0 }),
    animate: { y: 0, opacity: 1 },
    exit: (dir: number) => ({ y: dir > 0 ? '-80px' : '80px', opacity: 0 }),
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: index === 8 ? `calc(100dvh + ${footerHeight})` : '100dvh',
        overflowY: index === 8 ? 'auto' : 'hidden',
        backgroundColor: SECTION_COLORS[index],
      }}
      onWheel={handleWheel}
    >
      <Header isShow={isHeaderShow} />
      <AnimatePresence custom={direction} mode ='wait'>
        <motion.div
          key={index}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          style={{
            left: 0,
            right: 0,
            height: index === 8 ? 'auto' : '100dvh',
            position: 'absolute',
            top: 0,
          }}
          transition={{ duration: index === 1 ? 1.6 : 0.6, ease: [0.4, 0, 0.2, 1], }}
        >
          {index === 5 ? (
            <Section6
              color={SECTION_COLORS[index]}
              isAnimationRef={isAnimatingRef}
              setIsAnimate={setIsAnimating}
              step={internalStep}
              xProgress={xProgress}
            />
          ) : (
            <GeneralSection color={SECTION_COLORS[index]} idx={index}>
              {index === 8 && (
                <footer style={{ height: footerHeight, backgroundColor: '#000', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  footer ...
                </footer>
              )}
              {index !== 1 && (
                <h2 style={{ fontSize: 'clamp(2rem, 8vw, 5rem)', color: '#fff' }}>
                  {SECTION_TITLES[index]}
                </h2>
              )}
              {index === 1 && (
                <motion.div
                  key={`inner-${index}-${isExitingStep}`}
                  animate="animate"
                  initial="initial"
                  exit="exit"
                  custom={direction}
                  variants={innerVariants}
                  style={{ flex: '1 1 auto', height: 'calc(100dvh - 80px)', backgroundColor: 'olive' }}
                  transition={{ duration: 1.6 }}
                  onAnimationComplete={(definition:string)=>{ 
                    if(definition === "exit") { 
                              // if (nextIndexRef.current !== null) {
                              //   updateIndex(nextIndexRef.current, directionRef.current);
                              //   nextIndexRef.current = null;
                              // }
                              if(nextIndexRef.current !== null){
                                updateIndex(nextIndexRef.current, directionRef.current);
                                nextIndexRef.current = null;
                              }
                     } 
                  }}
                >
                  애니메이션 요소
                </motion.div>
              )}
            </GeneralSection>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PrallaxScrollDemo;

//현재 이 상태에서 위코드에서 휠 이벤트시 index 0 또는 2 섹션에서 --->1로 진입하면, 내부 innerVariants를 사용하는 <motion.div.. 는 initial->animate를 진행한다. 이후 다시 휠 이벤트를 하면,  다시 index 0이나 2로 변경되면서 나가야 하지만, aniimate-> exit로 변경되지 않고, initial -> animate로 재진입하는 문제가 발생한다.