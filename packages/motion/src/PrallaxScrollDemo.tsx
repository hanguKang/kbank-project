import React, { useState, useCallback, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  MotionValue,
} from "framer-motion";

const SECTION_COLORS = [
  "#F8F9FA",
  "#E9ECEF",
  "#DEE2E6",
  "#CED4DA",
  "#ADB5BD",
  "#6C757D",
  "#495057",
  "#343A40",
  "#212529",
];

/**
 * 헤더 컴포넌트 (React 19: ref를 props로 받음)
 */
const Header = ({
  isShow,
  ref,
}: {
  isShow: boolean;
  ref?: React.Ref<HTMLElement>;
}) => {
  return (
    <motion.header
      ref={ref}
      initial={{ y: -80 }}
      animate={{ y: isShow ? 0 : -80 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "80px",
        backgroundColor: "#ffffff",
        opacity: 0.5,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        padding: "0 40px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontWeight: "bold" }}>Kbank</div>
    </motion.header>
  );
};

const Section6 = ({
  step,
  xProgress,
  color,
}: {
  step: number;
  xProgress: MotionValue<number>;
  color: string;
}) => {
  const translateX = useTransform(xProgress, [0, 1], ["5%", "-5%"]);
  return (
    <div
      style={{
        backgroundColor: color,
        width: "100%",
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div style={{ x: translateX, perspective: 1000 }}>
        <motion.div
          animate={{ z: step * 200 }}
          style={{
            padding: "2rem",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "1rem",
          }}
        >
          <h2 style={{ color: "#fff", fontSize: "clamp(2rem, 5vw, 4rem)" }}>
            Section 6
          </h2>
        </motion.div>
      </motion.div>
    </div>
  );
};

const ParallaxScrollDemo: React.FC = () => {
  const [index, setIndex] = useState<number>(0);
  const [internalStep, setInternalStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [direction, setDirection] = useState<number>(1); // 1: 순차, -1: 역순
  const xProgress = useMotionValue<number>(0.5);

  const MAX_S6_STEP = 2;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) =>
      xProgress.set(e.clientX / window.innerWidth);
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [xProgress]);

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (index === 8 && window.scrollY > 0) return;
      if (isAnimating) return;
      if (Math.abs(e.deltaY) < 30) return;

      const isNext = e.deltaY > 0;
      setDirection(isNext ? 1 : -1);

      if (index === 5) {
        if (isNext && internalStep < MAX_S6_STEP) {
          setInternalStep((prev) => prev + 1);
          return lock(700);
        } else if (!isNext && internalStep > 0) {
          setInternalStep((prev) => prev - 1);
          return lock(700);
        }
      }

      if (isNext && index < 8) {
        setIsAnimating(true);
        setIndex((prev) => prev + 1);
      } else if (!isNext && index > 0) {
        setIsAnimating(true);
        setIndex((prev) => prev - 1);
      }
    },
    [index, internalStep, isAnimating]
  );

  const lock = (ms: number) => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), ms);
  };

  /**
   * 헤더 노출 조건:
   * 1. 역순 스크롤(direction === -1)이며 첫 페이지가 아닐 때
   * 2. 순차 스크롤(direction === 1) 중에는 특정 지점(예: 섹션 2 진입 시)에서만 노출하거나 숨김
   */
  const isHeaderShow =
    (direction === -1 && index > 0) || (direction === 1 && index === 1);

  return (
    <div
      onWheel={handleWheel}
      style={{
        width: "100%",
        height: "100dvh",
        overflowY: index === 8 ? "auto" : "hidden",
        position: "relative",
        backgroundColor: "#000",
      }}
    >
      {/* 고정 헤더 */}
      <Header isShow={isHeaderShow} />

      <AnimatePresence
        mode="wait"
        onExitComplete={() => setTimeout(() => setIsAnimating(false), 200)}
      >
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            width: "100%",
            height: index === 8 ? "auto" : "100dvh",
            position: index === 8 ? "relative" : "absolute",
            top: 0,
            left: 0,
            backgroundColor: SECTION_COLORS[index],
          }}
        >
          {index === 5 ? (
            <Section6
              step={internalStep}
              xProgress={xProgress}
              color={SECTION_COLORS[index]}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100dvh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h1
                style={{
                  fontSize: "clamp(2rem, 8vw, 5rem)",
                  color: index > 5 ? "#fff" : "#333",
                }}
              >
                Section {index + 1}
              </h1>
            </div>
          )}

          {index === 8 && (
            <footer
              style={{
                height: "800px",
                backgroundColor: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <h2>FOOTER</h2>
            </footer>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ParallaxScrollDemo;
