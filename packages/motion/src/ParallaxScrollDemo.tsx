import { AnimatePresence, motion, useMotionValue, Variants, Easing } from 'framer-motion';
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';

import HeroSection from './HeroSection';
import MainSection from './MainSection';
import Section02 from './Section02';
import Section03 from './Section03';

// mainTest.css 내용을 인라인으로 대체 (테스트용)
const css = `
html { scrollbar-gutter: auto !important; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; }

.hero-title { transform: translateY(-50%); height: clamp(60px, 3.96vw, 76px); opacity: 0; }
.hero-title:not(.visited) { animation: fadeInUpText1 0.8s ease-out both; animation-delay: 0.2s; }
.hero-title.visited { opacity: 1; transform: translateY(-50%); animation: none; }
.text-part { font-size: clamp(40px, 3.33vw, 64px); font-weight: 700; letter-spacing: -0.017em; line-height: 1.35; white-space: nowrap; }
.text-part1 { position: absolute; left: 0; top: 50%; transform: translateY(-50%); color: #fff; }
.text-part2 { position: absolute; left: clamp(315px, 21.9vw, 420px); top: 50%; transform: translateY(-50%); color: #fff; }
.text-part2:not(.visited) { animation-delay: 0.6s; }
.text-part3 { position: relative; z-index: 1; opacity: 0; transform: translateY(0); }
.text-part3:not(.visited) { animation: fadeInText 0.5s ease-out both; animation-delay: 1.4s; }
.text-part3.visited { opacity: 1; }
@keyframes fadeInUpText1 { 0% { opacity: 0; transform: translateY(calc(-50% + 20px)); } 100% { opacity: 1; transform: translateY(-50%); } }
@keyframes fadeInText { 0% { opacity: 0; } 100% { opacity: 1; } }
.white-box { position: absolute; background-color: #fff; border-radius: 8px; width: 100%; height: 100%; left: 0; top: 0; z-index: 0; opacity: 0; }
.white-box:not(.visited) { animation: slideInBoxBounce 1.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) both; animation-delay: 1.8s; }
.white-box.visited { opacity: 1; transform: translateX(0); }
@keyframes slideInBoxBounce { 0% { opacity: 0; transform: translateX(-100vw); } 60% { opacity: 1; transform: translateX(20px); } 75% { transform: translateX(-8px); } 85% { transform: translateX(4px); } 92% { transform: translateX(-2px); } 100% { opacity: 1; transform: translateX(0); } }

.scroll-indicator { position: absolute; bottom: clamp(28px, 2.08vw, 40px); left: 50%; transform: translateX(-50%); width: clamp(40px, 2.86vw, 55px); height: clamp(18px, 1.25vw, 24px); opacity: 0; cursor: pointer; animation: fadeIn 0.8s ease-out forwards, bounce 2s ease-in-out infinite; animation-delay: 1.8s, 2.6s; }
@keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
@keyframes bounce { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }

.section-title-text { font-size: clamp(32px, 2.92vw, 56px); font-weight: 700; color: #ffffff; line-height: 1.35; letter-spacing: -0.015em; opacity: 0; transform: translateY(20px); transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
.section-title-text.color02 { color: #4982bf; }
.section-title-text1.visible { opacity: 1; transform: translateY(0); }
.section-title-text.scale { opacity: 0; transform: translateY(20px) scale(1.1); }
.section-title-text.scale.visible { opacity: 1; transform: translateY(0) scale(1); }
.section-title-white-box { position: absolute; top: 0; left: 0; background: #f2f2f7; border-radius: 8px; height: 100%; width: 100%; transform: translateX(-100%); transition: opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
.section-title-white-box.visible { opacity: 1; transform: translateX(0); }
.section-title-highlight { position: relative; z-index: 1; transition: opacity 0.5s ease-out; transition-delay: 0.3s; opacity: 0; transform: translateY(0); }
.section-title-highlight.visible { opacity: 1; }
.section-title-wrapper { transform: translate(-50%, -50%); transition: transform 0.8s ease; }
.section-title-wrapper.up { opacity: 1; transform: translate(-50%, -220px); }
.videoBox { opacity: 0; transform: translateX(-50%) translateY(60px) scale(1.15); transition: opacity 1s ease-out, transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
.videoBox.visible { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
`;

const SECTION_COLORS = [
  '#0114a7', '#e4edf9', '#4982bf', '#17191e', '#7354b2',
  '#3d7047', '#6790b7', '#2f1d71', '#0115a7', '#17191e',
];

const SECTION_NAMES = [
  'Hero', 'Main', 'Section02', 'Section03', 'Section04',
  'Section05', 'Section06', 'Section07', 'Section08', 'Section09',
];

const footerHeight = '300px';

const HeaderWrapper = ({ isShow }: { isShow: boolean }) => (
  <motion.div
    animate={{ y: isShow ? 0 : -80 }}
    initial={{ y: -80 }}
    style={{
      position: 'fixed', top: 0, left: 0,
      width: '100%', height: 'clamp(60px, 4.17vw, 80px)',
      minWidth: '1080px', zIndex: 1000,
      backgroundColor: 'rgba(228, 237, 249, 0.8)',
      backdropFilter: 'blur(25px)',
    }}
    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
  >
    <div style={{ fontWeight: 'bold', padding: '20px' }}>kbank</div>
  </motion.div>
);

// index 4~9: 제목만 있는 심플 섹션 (stub)
const SimpleSection = ({ idx, color }: { idx: number; color: string }) => (
  <div style={{
    position: 'absolute', top: 0, left: 0,
    width: '100%', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <span style={{ color: '#fff', fontSize: 'clamp(32px, 2.92vw, 56px)', fontWeight: 700, opacity: 0.6 }}>
      Section {idx + 1} (stub)
    </span>
  </div>
);

const GeneralSection = ({
  children, idx, color,
}: {
  children?: React.ReactNode;
  idx: number;
  color: string;
}) => {
  const paddingTop1 = 'clamp(60px, 16.7vw, 80px)';
  const paddingSide = 'clamp(24px, 8.33vw, 160px)';
  return (
    <div style={{
      position: 'relative',
      backgroundColor: color,
      boxSizing: 'border-box',
      padding: idx === 1 ? `${paddingTop1} ${paddingSide} 0 ${paddingSide}` : '0',
      width: '100%',
      height: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
};

const ParallaxScrollDemo = React.memo(function ParallaxScrollDemo() {
  const [index, setIndex] = useState<number>(0);
  const [internalStep, setInternalStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [showHeaderBox, setShowHeaderBox] = useState<boolean>(false);
  const [direction, setDirection] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [phase, setPhase] = useState<'enter' | 'exit'>('enter');

  const xProgress = useMotionValue<number>(0.5);
  const MAX_S3_STEP = 2;

  const isAnimatingRef = useRef(false);
  const directionRef = useRef(0);
  const indexRef = useRef(0);
  const stepRef = useRef(0);
  const showHeaderBoxRef = useRef(false);
  const lastWheelTimeRef = useRef(0);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const WHEEL_COOLDOWN = 800;

  const easing = [0.4, 0, 0.2, 1] as unknown as Easing;

  // ── wheel 네이티브 이벤트 차단 ──────────────────────────────
  const wheelHandler = useCallback((e: WheelEvent) => {
    if (isAnimatingRef.current) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('wheel', wheelHandler, { passive: false, capture: true });
    return () => window.removeEventListener('wheel', wheelHandler);
  }, [wheelHandler]);

  // ── header ──────────────────────────────────────────────────
  const setHeader = useCallback((val: boolean) => {
    showHeaderBoxRef.current = val;
    setShowHeaderBox(val);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => xProgress.set(e.clientX / window.innerWidth);
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [xProgress]);

  // ── lock / unlock ────────────────────────────────────────────
  const lock = useCallback((ms: number) => {
    console.log(`%c======== lock(${ms}ms) ========`, 'color: orange; font-weight: bold');
    console.trace('lock 호출 위치');
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    isAnimatingRef.current = true;
    setIsAnimating(true);
    lockTimerRef.current = setTimeout(() => {
      console.log(`%c======== lock 타이머 자동 해제 (${ms}ms 경과) ========`, 'color: orange');
      isAnimatingRef.current = false;
      setIsAnimating(false);
      lockTimerRef.current = null;
    }, ms);
  }, []);

  const unlock = useCallback(() => {
    console.log('%c======== unlock 호출 ========', 'color: #4ade80; font-weight: bold');
    console.trace('unlock 호출 위치');
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    isAnimatingRef.current = false;
    setIsAnimating(false);
  }, []);

  // ── updateIndex ──────────────────────────────────────────────
  const updateIndex = useCallback((newIdx: number, dir: number) => {
    console.log('======== updateIndex ========', '현재 index', newIdx, '방향', dir);
    if (dir === -1) {
      if (newIdx === 2 || newIdx === 1) setHeader(true);
      else setHeader(false);
    } else {
      if (newIdx === 1) setHeader(true);
      else setHeader(false);
    }
    stepRef.current = 0;
    setInternalStep(0);
    indexRef.current = newIdx;
    setIndex(newIdx);
  }, [setHeader]);

  // ── handleWheel ──────────────────────────────────────────────
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    console.log('%c======== 휠 이벤트 (React onWheel) ========', 'color: #60a5fa');
    console.log('  deltaY:', e.deltaY, '| isAnimatingRef:', isAnimatingRef.current, '| index:', indexRef.current);

    if (Math.abs(e.deltaY) < 30) { console.log('  → 차단: deltaY 너무 작음'); return; }
    if (isAnimatingRef.current) { console.log('  → 차단: isAnimatingRef = true'); return; }

    const now = Date.now();
    if (now - lastWheelTimeRef.current < WHEEL_COOLDOWN) return;
    lastWheelTimeRef.current = now;

    const currIdx = indexRef.current;
    const isNext = e.deltaY > 0;
    const prevDirection = directionRef.current;
    directionRef.current = isNext ? 1 : -1;
    setDirection(directionRef.current);

    const isGeneralSection = ![0, 3, 9].includes(currIdx);

    if (isNext) {
      setHeader(false);
      if (currIdx === 9) return;

      if (currIdx === 3 && stepRef.current < MAX_S3_STEP) {
        stepRef.current += 1;
        setInternalStep(stepRef.current);
        lock(700);
        return;
      }

      const nextIdx = currIdx + 1;
      if (isGeneralSection) {
        const delay = currIdx === 1 ? 0 : 800;
        setPhase('exit');
        lock(delay + 600);
        setTimeout(() => {
          setPhase('enter');
          updateIndex(nextIdx, 1);
        }, delay);
        return;
      }
      updateIndex(nextIdx, 1);

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

      if (currIdx === 3 && stepRef.current > 0) {
        stepRef.current -= 1;
        setInternalStep(stepRef.current);
        lock(800 + 600);
        setTimeout(() => updateIndex(2, -1), 1600);
        return;
      }

      const nextIdx = currIdx - 1;
      if (isGeneralSection) {
        const delay = currIdx === 1 ? 0 : 800;
        setPhase('exit');
        lock(delay + 600);
        setTimeout(() => {
          setPhase('enter');
          updateIndex(nextIdx, -1);
        }, delay);
        return;
      }
      updateIndex(nextIdx, -1);
    }
  }, [lock, updateIndex, setHeader]);

  // ── variants ─────────────────────────────────────────────────
  const sect1CompoVariants: Variants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.16, when: 'beforeChildren' } },
    exit: { transition: { staggerChildren: 0.12, staggerDirection: 1, when: 'afterChildren' } },
  };

  const sect1CompoItemVariants: Variants = {
    initial: (dir: number) => ({ y: dir > 0 ? '60px' : '-60px', opacity: 0 }),
    animate: { y: 0, opacity: 1, transition: { duration: 0.6, ease: easing } },
    exit: (dir: number) => ({ y: dir > 0 ? '-60px' : '60px', opacity: 0, transition: { duration: 1 } }),
  };

  const cardEasing = [0.25, 0.46, 0.45, 0.94] as unknown as Easing;
  const sectCardStepVariants: Variants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.33 } },
    exit: { transition: { staggerChildren: 0.2, staggerDirection: 1 } },
  };
  const sectCardItemStepVariants: Variants = {
    initial: { y: '60px', opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 1, ease: cardEasing } },
    exit: { y: '60px', opacity: 0, transition: { duration: 1 } },
  };

  const isHeaderShow = showHeaderBox || index === 1;

  // ── SECTIONS ─────────────────────────────────────────────────
  const SECTIONS = useMemo(() => [
    <HeroSection isLoaded={isLoaded} />,
    <MainSection
      direction={direction}
      sect1CompoVariants={sect1CompoVariants}
      sect1CompoItemVariants={sect1CompoItemVariants}
      onUnlock={unlock}
    />,
    <Section02
      phase={phase}
      sectCardStepVariants={sectCardStepVariants}
      sectCardItemStepVariants={sectCardItemStepVariants}
      onUnlock={unlock}
    />,
    <Section03
      phase={phase}
      direction={direction}
      internalStep={internalStep}
      onExitComplete={() => updateIndex(4, 1)}
      onUnlock={unlock}
    />,
    // index 4~9: stub 섹션
    ...Array.from({ length: 6 }, (_, i) => (
      <SimpleSection key={i + 4} idx={i + 4} color={SECTION_COLORS[i + 4]} />
    )),
  ], [isLoaded, direction, phase, internalStep, unlock, updateIndex]);

  return (
    <>
      <style>{css}</style>
      <div
        style={{
          width: '100%',
          height: index === 9 ? `calc(100dvh + ${footerHeight})` : '100dvh',
          overflowY: index === 9 ? 'auto' : 'hidden',
          backgroundColor: SECTION_COLORS[index],
        }}
        onWheel={handleWheel}
      >
        <HeaderWrapper isShow={isHeaderShow} />
        <AnimatePresence
          custom={direction}
          initial={false}
          mode="wait"
          onExitComplete={() => {
            if (indexRef.current === 1 && !isLoaded) setIsLoaded(true);
          }}
        >
          <motion.div
            key={index}
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            style={{
              left: 0, right: 0,
              height: index === 9 ? 'auto' : '100dvh',
              position: 'absolute',
              top: 0,
              backgroundColor: SECTION_COLORS[index],
            }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <GeneralSection color={SECTION_COLORS[index]} idx={index}>
              {index === 0 ? SECTIONS[0] : SECTIONS[index]}
              {index === 9 && (
                <footer style={{
                  height: footerHeight, backgroundColor: '#000',
                  width: '100%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: '#fff',
                }}>
                  footer ...
                </footer>
              )}
            </GeneralSection>
          </motion.div>
        </AnimatePresence>

        {/* 디버그 인디케이터 */}
        <div style={{
          position: 'fixed', bottom: 20, right: 20,
          background: 'rgba(0,0,0,0.7)', color: '#fff',
          padding: '8px 16px', borderRadius: 8, fontSize: 13,
          fontFamily: 'monospace', zIndex: 9999,
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <div>index: <b>{index}</b> ({SECTION_NAMES[index]})</div>
          <div>step: <b>{internalStep}</b></div>
          <div>phase: <b>{phase}</b></div>
          <div>isAnimating: <b style={{ color: isAnimating ? '#f87171' : '#4ade80' }}>{String(isAnimating)}</b></div>
          <div>direction: <b>{direction > 0 ? '↓' : direction < 0 ? '↑' : '-'}</b></div>
        </div>
      </div>
    </>
  );
});

export default ParallaxScrollDemo;
