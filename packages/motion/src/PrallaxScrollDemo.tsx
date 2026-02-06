import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  MotionValue,
} from "framer-motion";

/** * 1. 타입 정의
 */
interface Section6Props {
  step: number;
  xProgress: MotionValue<number>;
  ref?: React.Ref<HTMLElement>; // React 19에서는 일반 prop으로 ref 전달 가능
}

/**
 * 6번 섹션: 3D 애니메이션 + 마우스 좌우 패럴럭스
 */
const Section6 = ({ step, xProgress, ref }: Section6Props) => {
  // 마우스 위치에 따라 컨테이너를 ±5% 범위로 이동
  const translateX = useTransform(xProgress, [0, 1], ["5%", "-5%"]);

  return (
    <section
      ref={ref}
      className="sect06-container"
      style={{ perspective: 1000 }}
    >
      <motion.div className="parallax-wrapper" style={{ x: translateX }}>
        <motion.div
          className="card-3d-element"
          animate={{
            z: step * 250,
            rotateY: step * 10,
            opacity: 1 - step * 0.15,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <ul className="clamp-list">
            <li>금융 리스트 아이템 1</li>
            <li>금융 리스트 아이템 2</li>
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
};

/**
 * 메인 컨테이너
 */
const ParallaxScrollDemo: React.FC = () => {
  /* 상태 관리 (Type Inference 활용) */
  const [index, setIndex] = useState<number>(0);
  const [internalStep, setInternalStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [direction, setDirection] = useState<number>(1);

  const xProgress = useMotionValue<number>(0.5);
  const MAX_S6_STEP = 2;

  // 2. 마우스 비율 계산
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      xProgress.set(e.clientX / window.innerWidth);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [xProgress]);

  // 3. 통합 휠 핸들러 (useCallback으로 최적화)
  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      // 9번 섹션 하단 스크롤 허용 로직
      if (index === 8 && window.scrollY > 0) return;

      if (isAnimating) return;
      if (Math.abs(e.deltaY) < 25) return;

      const isNext = e.deltaY > 0;
      setDirection(isNext ? 1 : -1);

      // [특수] 6번 섹션 내부 단계 제어
      if (index === 5) {
        if (isNext && internalStep < MAX_S6_STEP) {
          setInternalStep((prev) => prev + 1);
          return lock(800);
        } else if (!isNext && internalStep > 0) {
          setInternalStep((prev) => prev - 1);
          return lock(800);
        }
      }

      // [공통] 페이지 전환
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

  // 헤더 노출 조건
  const showHeader =
    (direction === -1 && index > 0) || (direction === 1 && index === 1);

  return (
    <div
      onWheel={handleWheel}
      style={{
        overflowY: index === 8 ? "auto" : "hidden",
        height: "100vh",
        position: "relative",
      }}
    >
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          // 트랙패드 관성 방어를 위한 짧은 지연시간 후 잠금 해제
          setTimeout(() => setIsAnimating(false), 200);
        }}
      >
        <motion.div
          key={index}
          initial={{ y: direction > 0 ? "100vh" : "-100vh", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: direction > 0 ? "-100vh" : "100vh", opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {index === 5 ? (
            <Section6 step={internalStep} xProgress={xProgress} />
          ) : (
            <section
              className={`sect-0${index + 1}`}
              style={{ height: "100vh" }}
            >
              <h1>Section {index + 1}</h1>
              {index === 8 && (
                <footer style={{ height: "400px", background: "#f4f4f4" }}>
                  푸터 내용
                </footer>
              )}
            </section>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ParallaxScrollDemo;
