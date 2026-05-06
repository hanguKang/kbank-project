import './mainTest.css';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useRef, useEffect, useState, useCallback } from 'react';

import { Section08 } from './Section08';
import { Section09 } from './Section09';

const SECTION_COLORS = [
    '#0114a7', '#e4edf9', '#4982bf', '#17191e', '#7354b2',
    '#3d7047', '#6790b7', '#2f1d71', '#0115a7', '#17191e',
];

const HeaderWrapper = ({ isShow }: { isShow: boolean }) => (
    <motion.div
        animate={{ y: isShow ? 0 : -80 }}
        initial={{ y: -80 }}
        style={{
            position: 'fixed', top: 0, left: 0, width: '100%',
            height: 'clamp(60px, 4.17vw, 80px)', zIndex: 1000,
            backgroundColor: 'rgba(228, 237, 249, 0.8)',
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#0114a7' }}>HEADER</h1>
        </header>
    </motion.div>
);

const GeneralSection = ({ children, idx, color }: { children?: React.ReactNode; idx: number; color: string }) => (
    <div style={{
        backgroundColor: color, boxSizing: 'border-box', width: '100%',
        height: idx === 9 ? 'auto' : '100dvh', display: 'flex',
        flexDirection: idx === 9 ? 'column' : 'row',
        alignItems: 'center', justifyContent: 'center', position: 'relative',
    }}>
        {children}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', fontSize: '48px', fontWeight: 'bold', pointerEvents: 'none', zIndex: 0 }}>
            Section {idx}
        </div>
    </div>
);

const PlaceholderSection = ({ idx }: { idx: number }) => (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
        <h1 style={{ color: '#fff', fontSize: '64px', margin: 0 }}>Section {idx}</h1>
    </div>
);

const MainLayout = React.memo(function MainLayout() {
    const START_AT_END = true;
    const initialIndex = START_AT_END ? 9 : 0;
    const initialDirection = START_AT_END ? -1 : 1;
    const initialHeaderState = START_AT_END ? false : true;

    const [index, setIndex] = useState(initialIndex);
    const [internalStep, setInternalStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showHeaderBox, setShowHeaderBox] = useState(initialHeaderState);
    const [direction, setDirection] = useState(initialDirection);
    const [phase, setPhase] = useState<'enter' | 'exit'>('enter');

    const isAnimatingRef = useRef(false);
    const directionRef = useRef(initialDirection);
    const indexRef = useRef(initialIndex);
    const stepRef = useRef(0);
    const showHeaderBoxRef = useRef(initialHeaderState);
    const lastWheelTimeRef = useRef(0);
    const wheelLockRef = useRef(0);
    const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // ✅ 섹션 9 전용: 헤더 등장 후 전환 가능 여부 플래그 & 타이머
    const headerReadyForTransitionRef = useRef(false);
    const headerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const WHEEL_COOLDOWN = 500; // 기본 휠 간격

    const setHeader = useCallback((val: boolean) => {
        showHeaderBoxRef.current = val;
        setShowHeaderBox(val);
    }, []);

    const lock = useCallback((ms: number) => {
        if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
        wheelLockRef.current = ms;
        isAnimatingRef.current = true;
        setIsAnimating(true);
        lockTimerRef.current = setTimeout(() => {
            wheelLockRef.current = 0;
            isAnimatingRef.current = false;
            setIsAnimating(false);
            lockTimerRef.current = null;
        }, ms);
    }, []);

    const updateIndex = useCallback((newIdx: number, dir: number) => {
        console.log(`[updateIndex] -> ${newIdx} (dir: ${dir})`);
        if (dir === -1) {
            if (newIdx === 1 || newIdx === 2) setHeader(true);
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

    // 전역 휠 핸들러 (0~8 섹션용)
    const wheelHandler = useCallback((e: WheelEvent) => {
        if (indexRef.current === 1 || indexRef.current === 9) return;
        if (wheelLockRef.current > 0 || isAnimatingRef.current) {
            e.preventDefault(); e.stopPropagation(); return false;
        }
    }, []);

    useEffect(() => {
        window.addEventListener('wheel', wheelHandler, { passive: false, capture: true });
        return () => window.removeEventListener('wheel', wheelHandler);
    }, [wheelHandler]);

    // ✅ 섹션 9 전용 스크롤 핸들러 (핵심 수정)
    const handleScroll = useCallback((e: WheelEvent) => {
        const now = Date.now();
        if (now - lastWheelTimeRef.current < WHEEL_COOLDOWN) {
            e.preventDefault(); return;
        }

        const container = containerRef.current;
        if (!container) return;

        const { scrollTop } = container;
        const isUp = e.deltaY < 0;
        const isDown = e.deltaY > 0;

        if (isUp && scrollTop <= 0) {
            e.preventDefault();

            if (!showHeaderBoxRef.current) {
                // 1단계: 헤더 등장
                console.log('[Sec9] Step 1: Show Header');
                setHeader(true);
                headerReadyForTransitionRef.current = false; // 즉시 전환 차단

                if (headerTimerRef.current) clearTimeout(headerTimerRef.current);
                headerTimerRef.current = setTimeout(() => {
                    headerReadyForTransitionRef.current = true; // 600ms 후 전환 허용
                    console.log('[Sec9] Header Ready for Transition');
                }, 600);

            } else if (headerReadyForTransitionRef.current) {
                // 2단계: 섹션 8 이동
                console.log('[Sec9] Step 2: Move to Section 8');
                headerTimerRef.current && clearTimeout(headerTimerRef.current);
                headerReadyForTransitionRef.current = false;
                updateIndex(8, -1);
            }
            lastWheelTimeRef.current = now;
            return;
        }

        if (isDown) {
            const { scrollHeight, clientHeight } = container;
            const maxScroll = scrollHeight - clientHeight;
            if (scrollTop < maxScroll) {
                // 스크롤 가능 영역이면 기본 동작 허용 (타임스탬프만 갱신)
                lastWheelTimeRef.current = now;
            }
        }
    }, [setHeader, updateIndex]);

    // 섹션 9 진입/이탈 시 이벤트 리스너 관리
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        if (index === 9) {
            container.addEventListener('wheel', handleScroll, { passive: false });
            console.log('[Effect] Sec9 Listener Added');
        } else {
            container.removeEventListener('wheel', handleScroll);
            // 리스너 제거 시 타이머 정리
            if (headerTimerRef.current) clearTimeout(headerTimerRef.current);
        }
        return () => container.removeEventListener('wheel', handleScroll);
    }, [handleScroll, index]);

    // 메인 휠 핸들러 (0~8 섹션)
    const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
        if (indexRef.current === 9) return; // 섹션 9 는 위임됨
        if (Math.abs(e.deltaY) < 30 || isAnimatingRef.current || wheelLockRef.current > 0) return;

        const now = Date.now();
        if (now - lastWheelTimeRef.current < WHEEL_COOLDOWN) return;
        lastWheelTimeRef.current = now;

        const currIdx = indexRef.current;
        const isNext = e.deltaY > 0;
        directionRef.current = isNext ? 1 : -1;
        setDirection(directionRef.current);

        if (isNext) {
            if (showHeaderBoxRef.current) {
                setHeader(false);
                if (currIdx !== 1) return;
            }
            if (currIdx === 3 && stepRef.current < 2) {
                stepRef.current++; setInternalStep(stepRef.current); lock(700); return;
            }
            const nextIdx = currIdx + 1;
            setPhase('exit'); lock(1400);
            setTimeout(() => { setPhase('enter'); updateIndex(nextIdx, 1); }, currIdx === 1 ? 0 : currIdx === 2 ? 1800 : 800);
        } else {
            if (currIdx === 0) return;
            if (!showHeaderBoxRef.current && currIdx !== 1) {
                setHeader(true); lock(600); return;
            }
            if (currIdx === 3 && stepRef.current >= 0) {
                stepRef.current--; setInternalStep(stepRef.current); lock(2000);
                setTimeout(() => updateIndex(2, -1), 700); return;
            }
            const nextIdx = currIdx - 1;
            setPhase('exit'); lock(1400);
            setTimeout(() => { setPhase('enter'); updateIndex(nextIdx, -1); }, 800);
        }
    }, [lock, updateIndex, setHeader]);

    // 컴포넌트 언마운트 시 타이머 정리
    useEffect(() => {
        return () => {
            if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
            if (headerTimerRef.current) clearTimeout(headerTimerRef.current);
        };
    }, []);

    const isHeaderShow = showHeaderBox || index === 1;

    const SECTIONS = [
        <PlaceholderSection key={0} idx={0} />, <PlaceholderSection key={1} idx={1} />,
        <PlaceholderSection key={2} idx={2} />, <PlaceholderSection key={3} idx={3} />,
        <PlaceholderSection key={4} idx={4} />, <PlaceholderSection key={5} idx={5} />,
        <PlaceholderSection key={6} idx={6} />, <PlaceholderSection key={7} idx={7} />,
        <Section08 key={8} phase={phase} direction={showHeaderBox ? 0 : direction} index={index} />,
        <Section09 key={9} phase={phase} direction={direction} />,
    ];

    return (
        <>
            <motion.div
                ref={containerRef}
                animate={{ backgroundColor: direction >= 0 ? SECTION_COLORS[index >= 8 ? 9 : index] : SECTION_COLORS[index] }}
                transition={{ duration: index !== 9 ? 0 : 1.2, ease: [0.4, 0, 0.2, 1] }}
                style={{
                    position: 'relative', width: '100%', height: index === 9 ? 'auto' : '100dvh',
                    overflowY: index === 9 ? 'auto' : 'hidden', backgroundColor: SECTION_COLORS[index],
                }}
                onWheel={handleWheel}
            >
                <HeaderWrapper isShow={isHeaderShow} />
                <AnimatePresence custom={direction} initial={false} mode={index === 1 ? 'wait' : 'sync'}>
                    <motion.div
                        key={index}
                        animate={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        style={{
                            position: index !== 9 ? 'absolute' : 'relative', top: 0, left: 0, right: 0,
                            height: index === 9 ? 'auto' : '100dvh', backgroundColor: SECTION_COLORS[index],
                        }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        onAnimationComplete={() => {
                            if (indexRef.current !== 1) {
                                isAnimatingRef.current = false;
                                setIsAnimating(false);
                            }
                        }}
                    >
                        <GeneralSection color={SECTION_COLORS[index]} idx={index}>
                            {SECTIONS[index]}
                        </GeneralSection>
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </>
    );
});

export default MainLayout;