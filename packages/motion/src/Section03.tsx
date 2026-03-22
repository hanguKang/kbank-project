import React, { useEffect, useState } from 'react';

const Section03 = ({
  phase,
  direction,
  internalStep,
  onExitComplete,
  onUnlock,
}: {
  phase: string;
  direction: number;
  internalStep: number;
  onExitComplete: () => void;
  onUnlock: () => void;
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (internalStep >= 2) {
      const timer = setTimeout(() => onExitComplete(), 600);
      return () => clearTimeout(timer);
    }
  }, [internalStep, onExitComplete]);

  useEffect(() => {
    let firstRafId: number;
    let secondRafId: number;
    if (phase === 'enter') {
      firstRafId = requestAnimationFrame(() => {
        secondRafId = requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
    }
    return () => {
      cancelAnimationFrame(firstRafId);
      cancelAnimationFrame(secondRafId);
    };
  }, [phase]);

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0,
      width: '100%', height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#17191e',
    }}>
      {/* 타이틀 */}
      <div
        className={`section-title-wrapper ${internalStep >= 1 && direction === 1 ? 'up' : ''}`}
        onTransitionEnd={(e) => {
          console.log('[Section03] Title onTransitionEnd:', e.propertyName, '| internalStep:', internalStep);
          if (e.propertyName === 'transform' && internalStep === 0) {
            console.log('%c[Section03] Title → onUnlock 호출', 'color: #4ade80');
            onUnlock();
          }
        }}
        style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 2vw, 28px)', position: 'absolute', top: '50%', left: '50%', whiteSpace: 'nowrap' }}
      >
        <span
          className={`section-title-text scale section-title-text1 ${visible && internalStep >= 0 ? 'visible' : ''} ${internalStep === 2 ? 'fadeOut' : ''}`}
          style={{ fontSize: 'clamp(32px, 2.92vw, 56px)', fontWeight: 700, color: '#fff' }}
        >
          카드 한 장으로 골라쓰는
        </span>
        <div style={{ position: 'relative', height: 'clamp(43px, 3.96vw, 76px)', padding: '0 clamp(12px, 1.04vw, 20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <div
            className={`section-title-white-box ${visible && internalStep >= 0 ? 'visible' : ''} ${internalStep === 2 ? 'fadeOut' : ''}`}
            style={{ position: 'absolute', top: 0, left: 0, background: '#f2f2f7', borderRadius: 8, height: '100%', width: '100%' }}
          />
          <span
            className={`section-title-text section-title-highlight ${visible && internalStep >= 0 ? 'visible' : ''} ${internalStep === 2 ? 'fadeOut' : ''}`}
            style={{ fontSize: 'clamp(32px, 2.92vw, 56px)', fontWeight: 700, color: '#17191e', position: 'relative', zIndex: 1 }}
          >
            혜택.
          </span>
        </div>
      </div>

      {/* 비디오 자리 (빈 박스) */}
      <div
        className={`videoBox ${internalStep === 1 && direction === 1 ? 'visible' : ''}`}
        onTransitionEnd={(e) => {
          console.log('[Section03] VideoContainer onTransitionEnd:', e.propertyName, '| internalStep:', internalStep);
          if (e.propertyName === 'opacity' && internalStep === 1) {
            console.log('%c[Section03] Video → onUnlock 호출', 'color: #4ade80');
            onUnlock();
          }
        }}
        style={{
          position: 'absolute',
          top: 'calc(clamp(120px, 9.38vw, 180px) + clamp(56px, 3.96vw, 76px))',
          left: '50%',
          width: 'clamp(600px, 46.88vw, 900px)',
          height: 'clamp(300px, 25vw, 480px)',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 18, fontWeight: 600 }}>VIDEO</span>
      </div>
    </div>
  );
};

export default Section03;
