import React, { useEffect, useState, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';

const CARDS = [
  { label: '생활통장', desc: '쓰면 쓸수록 쌓이는 리워드', color: '#e8f0fb' },
  { label: '기분통장', desc: '감정에도 매일매일 이자가', color: '#dff0e8' },
  { label: '궁금한 적금', desc: '하루하루 재미있는 저축', color: '#f0e8df' },
];

const Section02 = ({
  phase,
  sectCardStepVariants,
  sectCardItemStepVariants,
  onUnlock,
}: {
  phase: 'enter' | 'exit';
  sectCardStepVariants: any;
  sectCardItemStepVariants: any;
  onUnlock: () => void;
}) => {
  const [visible, setVisible] = useState(false);
  const [animateState, setAnimateState] = useState('initial');

  // 마운트 시 initial → animate 전환
  useLayoutEffect(() => {
    setAnimateState('animate');
  }, []);

  // phase 변경 시 exit 처리
  useEffect(() => {
    if (phase === 'exit') {
      setAnimateState('exit');
      setVisible(false);
    }
  }, [phase]);

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0,
      width: '100%', height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {/* 타이틀 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 1.46vw, 28px)', marginBottom: 'clamp(24px, 2.08vw, 40px)' }}>
        <span
          className={`section-title-text section-title-text1 ${visible ? 'visible' : ''}`}
          style={{ fontSize: 'clamp(32px, 2.92vw, 56px)', fontWeight: 700 }}
        >
          재미있는&nbsp;
        </span>
        <div style={{ position: 'relative', height: 'clamp(56px, 3.96vw, 76px)', padding: '0 clamp(12px, 1.04vw, 20px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className={`section-title-white-box ${visible ? 'visible' : ''}`} />
          <span
            className={`section-title-text color02 section-title-highlight ${visible ? 'visible' : ''}`}
            style={{ fontSize: 'clamp(32px, 2.92vw, 56px)', fontWeight: 700, position: 'relative', zIndex: 1 }}
          >
            돈 모으기.
          </span>
        </div>
      </div>

      {/* 카드들 */}
      <motion.div
        key="section02-cards"
        initial="initial"
        animate={animateState}
        variants={sectCardStepVariants}
        style={{ display: 'flex', gap: 'clamp(16px, 1.25vw, 24px)', width: 'clamp(800px, 56.25vw, 1080px)' }}
      >
        {CARDS.map((card, i) => (
          <motion.div
            key={i}
            variants={sectCardItemStepVariants}
            onAnimationComplete={i === CARDS.length - 1 ? (definition) => {
              console.log('%c[Section02] 마지막 카드 onAnimationComplete:', 'color: #f472b6', definition);
              if (definition === 'animate') {
                console.log('%c[Section02] → onUnlock 호출', 'color: #4ade80');
                onUnlock();
              }
            } : undefined}
            style={{
              flex: 1,
              height: 'clamp(300px, 25vw, 480px)',
              borderRadius: 'clamp(16px, 1.25vw, 24px)',
              background: card.color,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 'clamp(18px, 1.46vw, 28px)', fontWeight: 700, color: '#333' }}>{card.label}</span>
            <span style={{ fontSize: 'clamp(13px, 1vw, 16px)', color: '#666', textAlign: 'center', padding: '0 16px' }}>{card.desc}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Section02;
