import styled from '@emotion/styled';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import './mainTest.css';
import Section2 from './Section2';

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

const footerHeight = '300px';

const Header = ({ isShow }: { isShow: boolean }) => (
  <motion.header
    animate={{ y: isShow ? 0 : -80 }}
    initial={{ y: -80 }}
    style={{
      position: 'fixed',
      top: 0, left: 0,
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

const Section3Component = ({
  children,
  step,
  color,
  onExitComplete,
}: {
  children: React.ReactNode;
  step: number;
  color: string;
  onExitComplete: () => void;
}) => {
  useEffect(() => {
    if (step >= 2) {
      const timer = setTimeout(() => onExitComplete(), 600);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100dvh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', backgroundColor: color,
    }}>
      <h2
        className={`s3-title ${step >= 1 ? 'up' : ''} ${step >= 2 ? 'fadeout' : ''}`}
        style={{ position: 'absolute', fontWeight: 'bold', color: '#fff', fontSize: '2rem', margin: 0 }}
      >
        {children}
      </h2>
      <div
        className={`s3-card ${step >= 1 ? 'show' : ''} ${step >= 2 ? 'fadeout' : ''}`}
        style={{
          position: 'absolute', top: '50%',
          width: 'clamp(300px, 50vw, 600px)',
          borderRadius: '1.5rem', overflow: 'hidden',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <video autoPlay muted loop playsInline style={{ width: '100%', display: 'block' }}>
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

const GeneralSection = ({
  children, idx, color,
}: {
  children?: React.ReactNode;
  idx: number;
  color: string;
}) => (
  <div style={{
    backgroundColor: color,
    boxSizing: 'border-box',
    padding: idx === 1
      ? 'clamp(60px, 16.7vw, 80px) clamp(24px, 8.33vw, 160px) 0 clamp(24px, 8.33vw, 160px)'
      : '0',
    width: '100%', height: '100dvh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    {children}
    {idx === 0 && (
      <div className="scroll-indicator">
        <svg fill="none" viewBox="0 0 55 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.86 6.5L27.5 18L47.14 6.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </div>
    )}
  </div>
);

const PrallaxScrollDemo = () => {
  const [index, setIndex] = useState<number>(0);
  const [internalStep, setInternalStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [showHeaderBox, setShowHeaderBox] = useState<boolean>(false);
  const [direction, setDirection] = useState(0);
  const [exitIdx, setExitIdx] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [phase, setPhase] = useState<'enter' | 'exit'>('enter'); // ✅ 추가

  const xProgress = useMotionValue<number>(0.5);
  const MAX_S1_STEP = 1;
  const MAX_S3_STEP = 2;

  const isAnimatingRef = useRef(false);
  const directionRef = useRef(0);
  const indexRef = useRef(0);
  const stepRef = useRef(0);
  const lastWheelTimeRef = useRef(0);
  const WHEEL_COOLDOWN = 800;
  const showHeaderBoxRef = useRef(false);

  const setHeader = useCallback((val: boolean) => {
    showHeaderBoxRef.current = val;
    setShowHeaderBox(val);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => xProgress.set(e.clientX / window.innerWidth);
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [xProgress]);

  const lock = useCallback((ms: number) => {
    isAnimatingRef.current = true;
    setIsAnimating(true);
    setTimeout(() => {
      isAnimatingRef.current = false;
      setIsAnimating(false);
    }, ms);
  }, []);

  const updateIndex = useCallback((newIdx: number, dir: number) => {
    setExitIdx(indexRef.current);
    if (dir === -1) {
      if (newIdx === 2 || newIdx === 1) setHeader(true);
      else setHeader(false);
    } else {
      if (newIdx === 1) setHeader(true);
      else setHeader(false);
    }

    if (newIdx === 1 || newIdx === 3) {
      const max = newIdx === 3 ? MAX_S3_STEP - 1 : MAX_S1_STEP;
      stepRef.current = dir === -1 ? max - 1 : (newIdx === 1) ? 1 : 0;
      lock(2000);
    } else {
      stepRef.current = 0;
      lock(1200);
    }

    setInternalStep(stepRef.current);
    indexRef.current = newIdx;
    setIndex(newIdx);
  }, [lock, setHeader]);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(e.deltaY) < 30 || isAnimatingRef.current) return;

    const now = Date.now();
    if (now - lastWheelTimeRef.current < WHEEL_COOLDOWN) return;
    lastWheelTimeRef.current = now;

    const isNext = e.deltaY > 0;
    const prevDirection = directionRef.current;
    directionRef.current = isNext ? 1 : -1;
    setDirection(directionRef.current);

    const currIdx = indexRef.current;
    const isGeneralSection = ![0, 1, 3, 8].includes(currIdx);

    if (isNext) {
      setHeader(false);
      if (currIdx === 8) return;

      if (currIdx === 1) {
        if (stepRef.current < MAX_S1_STEP) {
          stepRef.current += 1;
          setInternalStep(stepRef.current);
          lock(700);
          return;
        }
      }
      if (currIdx === 3) {
        if (stepRef.current < MAX_S3_STEP) {
          stepRef.current += 1;
          setInternalStep(stepRef.current);
          lock(700);
          return;
        }
        return;
      }

      if (isGeneralSection) {
        // ✅ exit 먼저, 800ms 후 index 변경
        setPhase('exit');
        lock(800 + 600);
        setTimeout(() => {
          setPhase('enter');
          updateIndex(currIdx + 1, 1);
        }, 800);
        return;
      }
      updateIndex(currIdx + 1, 1);

    } else {
      if (currIdx === 0) return;

      if (!showHeaderBoxRef.current && currIdx !== 1) {
        setHeader(true);
        lock(600);
        return;
      }

      if (currIdx === 1 && prevDirection === 1) {
        updateIndex(0, -1);
        return;
      }
      if ((currIdx === 1 || currIdx === 3) && stepRef.current > 0) {
        stepRef.current -= 1;
        setInternalStep(stepRef.current);
        if (currIdx === 3 && stepRef.current === 0) {
          lock(1000);
          setTimeout(() => updateIndex(2, -1), 800);
        } else {
          lock(700);
        }
        return;
      }

      const nextIdx = currIdx - 1;
      if (isGeneralSection) {
        // ✅ 역방향도 동일
        setPhase('exit');
        lock(800 + 600);
        setTimeout(() => {
          setPhase('enter');
          updateIndex(nextIdx, -1);
        }, 800);
        return;
      }
      updateIndex(nextIdx, -1);
    }
  }, [lock, updateIndex, setHeader]);

  const isHeaderShow = showHeaderBox || index === 1;

  const innerVariants = {
    initial: (dir: number) => ({ y: dir > 0 ? '80px' : '-80px', opacity: 0.3 }),
    animate: { y: 0, opacity: 1 },
    exit: (dir: number) => ({ y: dir > 0 ? '-80px' : '80px', opacity: 0.3 }),
  };

  return (
    <div
      style={{
        position: 'relative', width: '100%',
        height: index === 8 ? `calc(100dvh + ${footerHeight})` : '100dvh',
        overflowY: index === 8 ? 'auto' : 'hidden',
        backgroundColor: SECTION_COLORS[index],
      }}
      onWheel={handleWheel}
    >
      <Header isShow={isHeaderShow} />
      <AnimatePresence
        custom={direction}
        initial={false}
        mode="popLayout"
        onExitComplete={() => {
          if (indexRef.current === 1 && !isLoaded) setIsLoaded(true);
        }}
      >
        <motion.div
          key={index}
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          style={{
            left: 0, right: 0, top: 0,
            height: index === 8 ? 'auto' : '100dvh',
            position: 'absolute',
          }}
          transition={{
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1],
            delay: exitIdx === 1 ? 1.2 : 0,
          }}
          onAnimationComplete={() => {
            if (indexRef.current !== 1) {
              isAnimatingRef.current = false;
              setIsAnimating(false);
            }
          }}
        >
          {/* index 3 — 기존 Section3 유지 */}
          {index === 3 && (
            <Section3Component
              color={SECTION_COLORS[index]}
              step={internalStep}
              onExitComplete={() => updateIndex(4, 1)}
            >
              <HeroContainer>
                <div className="hero-title">카드 한 장으로 골라쓰는</div>
                <div className="hero-title-wrapper">
                  <div className="hero-white-box" />
                  <div className="hero-title">혜택</div>
                </div>
              </HeroContainer>
            </Section3Component>
          )}

          {/* index 2 — ✅ Section2 컴포넌트 */}
          {index === 2 && <Section2 phase={phase} />}

          {/* 나머지 */}
          {index !== 2 && index !== 3 && (
            <GeneralSection color={SECTION_COLORS[index]} idx={index}>
              {index === 8 && (
                <footer style={{
                  height: footerHeight, backgroundColor: '#000', width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                }}>
                  footer ...
                </footer>
              )}
              {index === 0 && (
                <HeroContainer>
                  <div className={`hero-title text-part1${isLoaded ? ' visited' : ''}`}>나의 금융생활이</div>
                  <div className={`hero-title text-part2${isLoaded ? ' visited' : ''}`}>즐거움으로</div>
                  <div style={{ position: 'relative', padding: '0 20px' }}>
                    <div className={`white-box${isLoaded ? ' visited' : ''}`} />
                    <div
                      className={`hero-title text-part3${isLoaded ? ' visited' : ''}`}
                      style={{ position: 'relative', color: SECTION_COLORS[0], zIndex: 1 }}
                    >
                      가득해지도록.
                    </div>
                  </div>
                </HeroContainer>
              )}
              {index === 1 && (
                <motion.div
                  key="inner-step-1"
                  animate="animate"
                  initial="initial"
                  exit="exit"
                  custom={direction}
                  variants={innerVariants}
                  style={{
                    flex: '1 1 auto',
                    height: 'calc(100dvh - 80px)',
                    backgroundColor: 'olive',
                    backgroundImage: `
                      linear-gradient(transparent 59%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0.95) 61%),
                      radial-gradient(circle 240px at 0 45%, rgba(59,130,246,0.1) 0%, rgba(37,99,235,0.2) 60%, transparent 70%)
                    `,
                  }}
                  transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  onAnimationStart={() => {
                    isAnimatingRef.current = true;
                    setIsAnimating(true);
                  }}
                >
                  {internalStep === 0 ? '진입애니메이션' : <h1>내부 마지막 애니메이션</h1>}
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