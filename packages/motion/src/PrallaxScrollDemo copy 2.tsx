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
  const pendingIndexRef = useRef<number | null>(null);


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

  const updateIndex = useCallback((newIdx: number, dir: number) => {
    // 내부 애니메이션이 필요한 섹션(1, 5)으로 진입할 때의 초기화
    if (newIdx === 1) {
      stepRef.current = dir === 1 ? 0 : MAX_S1_STEP;
    } else if (newIdx === 5) {
      stepRef.current = dir === 1 ? 0 : MAX_S5_STEP;
    } else {
      stepRef.current = 0;
    }

    setInternalStep(stepRef.current);
    indexRef.current = newIdx;
    setIndex(newIdx);
    lock(800); 
  }, []);

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
    // index 1 혹은 5에서 내부 스텝 진행
      if (currIdx === 1 || currIdx === 5) {
        const maxStep = currIdx === 1 ? MAX_S1_STEP : MAX_S5_STEP;
        
        if (stepRef.current < maxStep) {
          stepRef.current += 1;
          setInternalStep(stepRef.current);
          lock(1800);
          return;
        } else {
          // 마지막 스텝 도달 후 스크롤 시: 내부 'exit' 애니메이션 트리거를 위해 step 증가
          pendingIndexRef.current = currIdx + 1;
          setInternalStep(stepRef.current + 1); // 이 변경이 내부 motion.div의 exit을 유도함
          lock(2000); 
          return;
        }
      }

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
      lock(1800);
      return;
    } else if (currIdx === 1 || currIdx === 5) {
      // 0번 섹션으로 나가기 위한 '역방향 exit' 트리거
      pendingIndexRef.current = currIdx - 1;
      setInternalStep(-1); // 0보다 작은 값으로 exit 유도
      lock(2000);
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
          transition={{ duration: index === 1 ? 1.8 : 0.6, ease: [0.4, 0, 0.2, 1], }}
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
                  key={`inner-step-${internalStep}`}
                  animate="animate"
                  initial="initial"
                  exit="exit"
                  custom={direction}
                  variants={innerVariants}
                  style={{ flex: '1 1 auto', height: 'calc(100dvh - 80px)', backgroundColor: 'olive' }}
                  transition={{ duration: 1.6 }}
                  onAnimationComplete={() => {
                    if (pendingIndexRef.current !== null && (internalStep > MAX_S1_STEP || internalStep < 0)) {
                      const next = pendingIndexRef.current;
                      pendingIndexRef.current = null;
                      updateIndex(next, directionRef.current);
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

//현재 이 상태에서 위코드에서 휠 이벤트시 index 0 또는 2 섹션에서 --->1로 들어와서 다시 index 0이나 2로 갈 때, 화면 전환 애니메이션이 innerVariants의 2번째 애니메이션 끝나고 작동됐으면 좋겠는데, 내부의 2번째 애니메이션이 종료될때까지 기다리지 않고 section이 변경되는 애니메이션이 작동한다.  이유는 <AnimatePresenece가 <motion.div key={index}에만 반응하기 때문이다. 그렇기 때문에 index 1, 5일 때는 updateIndex를  innerVariants를 사용하고 있는 <motion.div에 onAnimationComplete에 맡겨서 애니메이션이 끝난 다음에 index state가 변경되도록 하고 싶은데, onAnimationComplete의 definition 인자로 "exit"이 들어오는 공식 API는 아직 없지? 그럼 어떻게 해결해야 할까? 나머지는 wheel에서 updateIndex를 구동하고. 그렇게 전체 코드를 변경할 수 있을까?

//현재 이 상태에서 위코드에서 휠 이벤트시 index 0 또는 2 섹션에서 --->1로 들어와서 다시 index 0이나 2로 갈 때, 화면 전환 애니메이션이 innerVariants의 2번째 애니메이션 끝나고 작동되게 작성하고 싶었지만, 잘 안된다. 보시다시피 진입이후 진입때 했던 initial-> animate 애니메이션을 재 실행하고, 다시 휠을 하면, 진입때 했던 initial-> animate 애니메이션을 또 재 실행하고 바로 exit할 때 애니메이션을 한다.