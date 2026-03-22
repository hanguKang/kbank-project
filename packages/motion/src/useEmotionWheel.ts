import { useRef, useCallback } from 'react';
import type { EmotionItem } from './emotionData';

const TOTAL_DOTS = 20;
const DEG_PER_DOT = 360 / TOTAL_DOTS; // 18도

interface UseEmotionWheelProps {
  onEmotionChange: (item: EmotionItem, index: number) => void;
  onCircleRotate?: (deg: number) => void; // circle 회전각 전달 (화살표 상쇄용)
  isIOS?: boolean;
}

// Fisher-Yates 셔플
function shuffleArrays(arr1: string[], arr2: number[]): void {
  for (let i = arr1.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr1[i], arr1[j]] = [arr1[j], arr1[i]];
    [arr2[i], arr2[j]] = [arr2[j], arr2[i]];
  }
}

// 진동
function triggerHaptic(isIOS: boolean): void {
  if (isIOS) {
    try { (window as any).MobileCallUtils?.etc?.callDeviceHaptic('', 'oneShot', 1); } catch (_) {}
  } else {
    try { navigator.vibrate?.(10); } catch (_) {}
  }
}

export function useEmotionWheel({ onEmotionChange, onCircleRotate, isIOS = false }: UseEmotionWheelProps) {
  // SVG 링 컨테이너 (원 중심 계산용)
  const trackRef = useRef<HTMLDivElement>(null);
  // .circle div: 이걸 rotate시켜서 핸들이 링을 따라 돎
  const circleRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const currentIndex = useRef(0);

  // ── 원 중심 기준 각도 계산 (0~360) ──────────────────────────────────────────
  const getAngleDeg = useCallback((clientX: number, clientY: number): number => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let deg = Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
    if (deg < 0) deg += 360;
    return deg;
  }, []);

  // ── 각도 → 닷 인덱스 ────────────────────────────────────────────────────────
  // .circle이 rotate(180deg)로 시작하므로 180 보정 후 인덱스 계산
  const getDotIndex = useCallback((deg: number): number => {
    const adjusted = (deg + 180) % 360;
    const index = Math.round(adjusted / DEG_PER_DOT) % TOTAL_DOTS;
    return index < 0 ? index + TOTAL_DOTS : index;
  }, []);

  // ── circle div를 rotate시켜 핸들 위치 업데이트 ──────────────────────────────
  const updateCircleRotation = useCallback((deg: number): void => {
    if (circleRef.current) {
      circleRef.current.style.transform = `rotate(${deg}deg)`;
    }
    onCircleRotate?.(deg);
  }, [onCircleRotate]);

  // ── 드래그 중 처리 ──────────────────────────────────────────────────────────
  const handleDragMove = useCallback(
    (clientX: number, clientY: number, emotionList: EmotionItem[]) => {
      const deg = getAngleDeg(clientX, clientY);
      const newIndex = getDotIndex(deg);

      // 닷 인덱스가 바뀔 때만 스냅 이동
      if (newIndex !== currentIndex.current) {
        currentIndex.current = newIndex;

        // 스냅 각도: 닷 위치에 딱 맞는 각도로 circle 회전
        // getDotIndex의 역산: adjusted = newIndex * DEG_PER_DOT → deg = adjusted - 180
        const snappedDeg = (newIndex * DEG_PER_DOT - 180 + 360) % 360;
        updateCircleRotation(snappedDeg);

        const item = emotionList[newIndex];
        const textList = [...item.textList];
        const priceList = [...item.priceList];
        shuffleArrays(textList, priceList);
        onEmotionChange(
          { ...item, text: textList[0], price: priceList[0], index: newIndex },
          newIndex
        );
        triggerHaptic(isIOS);
      }
    },
    [getAngleDeg, getDotIndex, isIOS, onEmotionChange, updateCircleRotation]
  );

  // ── 이벤트 핸들러 생성 ───────────────────────────────────────────────────────
  const createHandlers = useCallback(
    (emotionList: EmotionItem[]) => {
      const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
        isDragging.current = true;
        e.preventDefault();
      };
      const onPointerMove = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        if (!isDragging.current) return;
        const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
        handleDragMove(clientX, clientY, emotionList);
      };
      const onPointerUp = () => { isDragging.current = false; };
      return { onPointerDown, onPointerMove, onPointerUp };
    },
    [handleDragMove]
  );

  // ── 초기 위치 세팅 ───────────────────────────────────────────────────────────
  const initPosition = useCallback(
    (initIdx: number, emotionList: EmotionItem[]) => {
      currentIndex.current = initIdx;
      // initIdx → 각도 역산: getDotIndex의 역연산
      // adjusted = initIdx * DEG_PER_DOT → deg = adjusted - 180
      const deg = (initIdx * DEG_PER_DOT - 180 + 360) % 360;
      updateCircleRotation(deg);
      const item = emotionList[initIdx];
      onEmotionChange(
        { ...item, text: item.textList[0], price: item.priceList[0], index: initIdx },
        initIdx
      );
    },
    [onEmotionChange, updateCircleRotation]
  );

  return { trackRef, circleRef, createHandlers, initPosition, currentIndex };
}
