// ─────────────────────────────────────────────────────────────────────────────
// EmotionContainer.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState, useCallback } from 'react';
import './EmotionContainer.css';
import { EMOTION_DATA, } from './emotionData';
import type { EmotionItem } from './emotionData';
import { useEmotionWheel } from './useEmotionWheel';

// ── SVG 도넛 링 위의 20개 닷 좌표 ─────────────────────────────────────────────
// 원본 HTML에서 추출한 cx, cy, rotate 값 그대로 사용
const DOTS = [
  { index: 1, cx: 252.549, cy: 196.111, rotate: -63, label: 'soso 쏘쏘한 날' },
  { index: 2, cx: 229.011, cy: 228.510, rotate: -45, label: '아무 생각이 없다' },
  { index: 3, cx: 196.611, cy: 252.049, rotate: -27, label: '영혼탈출' },
  { index: 4, cx: 158.524, cy: 264.424, rotate: -9, label: '안 풀리는 하루' },
  { index: 5, cx: 118.476, cy: 264.424, rotate: -171, label: '눈물이 또르르' },
  { index: 6, cx: 80.3896, cy: 252.049, rotate: -153, label: '혼자 있고싶은 오늘' },
  { index: 7, cx: 47.9902, cy: 228.509, rotate: -135, label: '우울하다 우울해' },
  { index: 8, cx: 24.4512, cy: 196.111, rotate: -117, label: '잠이 안오네' },
  { index: 9, cx: 12.0766, cy: 158.024, rotate: -99, label: '오구 힐링이 필요해' },
  { index: 10, cx: 12.0763, cy: 117.976, rotate: -81, label: '때려치고 싶은 날' },
  { index: 11, cx: 24.4517, cy: 79.8892, rotate: -63, label: '나한테 다들 왜그래' },
  { index: 12, cx: 47.9915, cy: 47.4902, rotate: -45, label: '세상 짜증날때' },
  { index: 13, cx: 80.3892, cy: 23.9512, rotate: -27, label: '왜 나한테만 그래' },
  { index: 14, cx: 118.477, cy: 11.5758, rotate: -9, label: '10년치 스트레스' },
  { index: 15, cx: 158.523, cy: 11.5755, rotate: -171, label: '뭘해도 되는 날' },
  { index: 16, cx: 196.611, cy: 23.9510, rotate: -153, label: '오늘은 설레는 날!' },
  { index: 17, cx: 229.010, cy: 47.4901, rotate: -135, label: '케뱅아 생일 축하해' },
  { index: 18, cx: 252.549, cy: 79.8891, rotate: -117, label: '빵터졌네 ㅋㅋㅋ' },
  { index: 19, cx: 264.925, cy: 117.976, rotate: -99, label: '하루종일 행복한 날' },
  { index: 0, cx: 264.925, cy: 158.023, rotate: -81, label: '담담한 기분' },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface EmotionContainerProps {
  emotionList?: EmotionItem[];    // 외부 주입 가능, 없으면 기본 데이터 사용
  initIdx?: number;               // 초기 선택 인덱스
  isIOS?: boolean;                // iOS 햅틱 여부
  onEmotionChange?: (item: EmotionItem) => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

// ── 컴포넌트 ──────────────────────────────────────────────────────────────────
const EmotionContainer: React.FC<EmotionContainerProps> = ({
  emotionList = EMOTION_DATA,
  initIdx = 0,
  isIOS = false,
  onEmotionChange,
  onEditClick,
  onDeleteClick,
}) => {
  // 현재 선택된 감정
  const [currentEmotion, setCurrentEmotion] = useState<EmotionItem>({
    ...emotionList[initIdx],
    text: emotionList[initIdx].textList[0],
    price: emotionList[initIdx].priceList[0],
  });

  // 화살표 아이콘 회전각 (circle 회전 상쇄 + 90도)
  const [arrowDeg, setArrowDeg] = useState(90);

  // 편집 여부 (텍스트 직접 수정 시 true)
  const [isEdited, setIsEdited] = useState(false);
  // 사용자가 직접 입력한 텍스트
  const [inputText, setInputText] = useState('');

  // 툴팁: 진입 후 2초간 표시
  const [showTooltip, setShowTooltip] = useState(true);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 이미지 ref 배열 (preloader)
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

  // ── 감정 변경 콜백 ──────────────────────────────────────────────────────────
  const handleEmotionChange = useCallback(
    (item: EmotionItem, index: number) => {
      setCurrentEmotion(item);
      // 이미지 전환: 이전 on 제거 → 현재 on 추가
      imgRefs.current.forEach((img) => img?.classList.remove('on'));
      imgRefs.current[index]?.classList.add('on');
      onEmotionChange?.(item);
    },
    [onEmotionChange]
  );

  // ── 훅 초기화 ───────────────────────────────────────────────────────────────
  const { trackRef, circleRef, createHandlers, initPosition } = useEmotionWheel({
    onEmotionChange: handleEmotionChange,
    onCircleRotate: (deg) => setArrowDeg(-deg + 90),
    isIOS,
  });

  // 드래그 핸들러 (emotionList 바인딩)
  const { onPointerDown, onPointerMove, onPointerUp } = createHandlers(emotionList);

  // ── 마운트 시 초기화 ─────────────────────────────────────────────────────────
  useEffect(() => {
    // 초기 이미지 세팅
    imgRefs.current[initIdx]?.classList.add('on');
    // 초기 핸들 위치 세팅
    initPosition(initIdx, emotionList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 툴팁 타이머 ─────────────────────────────────────────────────────────────
  useEffect(() => {
    tooltipTimerRef.current = setTimeout(() => setShowTooltip(false), 2000);
    return () => {
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    };
  }, []);

  // ── document 레벨 이벤트 (드래그가 핸들 밖으로 나가도 추적) ────────────────
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => onPointerMove(e as any);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      onPointerMove(e as any);
    };
    const handleUp = () => onPointerUp();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleUp);
    };
  }, [onPointerMove, onPointerUp]);

  // ── 표시 텍스트: 편집됐으면 inputText, 아니면 현재 감정 text ────────────────
  const displayText = isEdited ? inputText : (currentEmotion.text ?? '');

  // ── 편집 팝업 열기 ───────────────────────────────────────────────────────────
  const handleEditClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onEditClick?.();
    },
    [onEditClick]
  );

  // ── 삭제(편집 초기화) ────────────────────────────────────────────────────────
  const handleDeleteClick = useCallback(() => {
    setIsEdited(false);
    setInputText('');
    onDeleteClick?.();
  }, [onDeleteClick]);

  // ── SVG 링 색상: 현재 감정의 color ──────────────────────────────────────────
  const ringColor = currentEmotion.color ?? '#f2f6fc';

  return (
    <div className="content_feeling feeling_renew" data-indicator="true">
      {/* 파티클 영역 */}
      <div className="particle_wrap" aria-hidden="true" tabIndex={-1}>
        <div className="particle_inner">
          {['🤔', '🥳', '😎', '😚', '👏'].flatMap((emoji, i) =>
            Array.from({ length: 3 }, (_, j) => (
              <div key={`${i}-${j}`}>{emoji}</div>
            ))
          )}
        </div>
      </div>

      {/* 상단 편집 영역 */}
      <div className="edit_box">
        <button
          type="button"
          className={`btn_input_wrap${isEdited ? ' edited' : ''}`}
          onClick={handleEditClick}
        >
          <span className="text">{displayText}</span>
          <i className="btn_edit_text">
            <span className="blind">기분 메세지 변경</span>
          </i>
        </button>
        {isEdited && (
          <button type="button" className="btn_delete" onClick={handleDeleteClick}>
            <span className="blind">삭제</span>
          </button>
        )}
      </div>

      {/* 원형 휠 영역 */}
      <div className="circle_wheel_wrap">
        <div className="circle_wheel_inner new-color">

          {/* SVG 링 + 20개 닷 */}
          <div className="circle_line no-drag" ref={trackRef}>
            <svg
              width="276"
              height="276"
              viewBox="0 0 276 276"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* 도넛 링: 현재 감정 색상으로 fill */}
              <path
                fill={ringColor}
                fillRule="evenodd"
                clipRule="evenodd"
                d="M137.964 20C72.8141 20 20 72.8141 20 137.964C20 203.113 72.8141 255.927 137.964 255.927C203.113 255.927 255.927 203.113 255.927 137.964C255.927 72.8141 203.113 20 137.964 20ZM0 137.964C0 61.7684 61.7684 0 137.964 0C214.159 0 275.927 61.7684 275.927 137.964C275.927 214.159 214.159 275.927 137.964 275.927C61.7684 275.927 0 214.159 0 137.964Z"
              />
              {/* 20개 닷 */}
              {DOTS.map((dot) => (
                <circle
                  key={dot.index}
                  role="button"
                  data-index={dot.index}
                  className={`dot_${dot.index}`}
                  cx={dot.cx}
                  cy={dot.cy}
                  r={2}
                  transform={`rotate(${dot.rotate} ${dot.cx} ${dot.cy})`}
                  aria-label={`기분이미지 선택 ${dot.label}`}
                />
              ))}
            </svg>

            {/* 이미지 preloader: 모든 이미지를 미리 DOM에 올려두고 on 클래스로 표시 */}
            <div className="preloader-wrap">
              {emotionList.map((item, i) => (
                <img
                  key={item.cd}
                  ref={(el) => { imgRefs.current[i] = el; }}
                  className="feeling-img"
                  src={item.img}
                  alt=""
                />
              ))}
            </div>
          </div>

          {/* 드래그 핸들: circle div 전체를 rotate시켜서 wheel(핸들)이 링 위를 따라 돎 */}
          <div className="circle" ref={circleRef}>
            <button
              type="button"
              className="wheel"
              aria-label="감정 선택 핸들"
              onMouseDown={onPointerDown}
              onTouchStart={(e) => { e.preventDefault(); onPointerDown(e); }}
            >
              {/* 화살표: circle 회전 상쇄 + 90도 → 항상 접선 방향 유지 */}
              <span
                className="wheel-arrow"
                style={{ transform: `rotate(${arrowDeg}deg)` }}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        {/* 툴팁: 진입 후 2초간 표시 */}
        {showTooltip && (
          <div className="tooltip-focus-group tooltip-handle">
            <div className="tooltip-area align-center">
              <p className="txt">{displayText}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionContainer;
