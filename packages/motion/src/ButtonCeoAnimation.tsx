import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

const ChipButton = () => {
  const controls = useAnimation();

  useEffect(() => {
    const animateButton = async () => {
      // 1. 확장 애니메이션 (0.5초)
      await controls.start('expanded');
      // 2. 2.5초 대기
      await new Promise(resolve => setTimeout(resolve, 2500));
      // 3. 축소 애니메이션 (0.5초)
      await controls.start('collapsed');
    };

    animateButton();
  }, [controls]);

  const buttonVariants = {
    initial: {
      width: 24,
      backgroundColor: '#e0e0e0',
    },
    expanded: {
      width: 'auto',
      backgroundColor: '#ffffff',
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
    collapsed: {
      width: 24,
      backgroundColor: '#e0e0e0',
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  };

  const textVariants = {
    initial: {
      opacity: 0,
      width: 0,
    },
    expanded: {
      opacity: 1,
      width: 'auto',
      transition: {
        opacity: { delay: 0.2, duration: 0.3 },
        width: { duration: 0.4 },
      },
    },
    collapsed: {
      opacity: 0,
      width: 0,
      transition: {
        opacity: { duration: 0.1 },
        width: { duration: 0.4 },
      },
    },
  };

  const wtBgVariants = {
    initial: {
      x: -10,
      opacity: 0,
    },
    expanded: {
      x: '100%',
      opacity: [0, 0.7, 0],
      transition: {
        x: { duration: 0.5, ease: 'easeInOut' },
        opacity: { duration: 0.5 },
      },
    },
    collapsed: {
      x: -10,
      opacity: 0,
    },
  };

  const commaVariants = {
    initial: {
      opacity: 1,
    },
    expanded: {
      opacity: 1,
    },
    collapsed: {
      opacity: 0,
      transition: {
        duration: 0.1,
      },
    },
  };

  return (
    <Container>
      <StyledButton
        variants={buttonVariants}
        initial="initial"
        animate={controls}
        css={css`
          position: relative;
          display: flex;
          align-items: center;
          height: 24px;
          padding: 8px;
          border-radius: 12px;
          box-sizing: border-box;
          font-size: 14px;
          overflow: hidden;
          background-color: #e0e0e0;
          color: #333;
          border: none;
          cursor: pointer;
          transform-origin: right center;
        `}
      >
        {/* 흰색 배경 효과 */}
        <WhiteBackground
          variants={wtBgVariants}
          css={css`
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              120deg,
              transparent 10%,
              rgba(255, 255, 255, 0.8) 50%,
              transparent 90%
            );
            filter: blur(2px);
            z-index: 1;
          `}
        />

        {/* 중앙 점 - 사장님의 'ㅅ' 대체 */}
        <CenterDot
          css={css`
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background-color: #666;
            margin: 0 2px;
          `}
        />

        {/* 사장님 텍스트 - 항상 보임 */}
        <TextSpan
          css={css`
            color: #666;
            margin-left: 4px;
          `}
        >
          사장님
        </TextSpan>

        {/* 쉼표 */}
        <motion.span variants={commaVariants}>
          <TextSpan>,</TextSpan>
        </motion.span>

        {/* 추가 텍스트 */}
        <motion.span variants={textVariants}>
          <TextSpan
            css={css`
              margin-left: 12px;
              color: #2196f3;
            `}
          >
            매출 파이팅 <i>아이콘</i>
          </TextSpan>
        </motion.span>
      </StyledButton>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const StyledButton = styled(motion.button)`
  position: relative;
  display: flex;
  align-items: center;
  height: 24px;
  padding: 8px;
  border-radius: 12px;
  box-sizing: border-box;
  font-size: 14px;
  overflow: hidden;
  background-color: #e0e0e0;
  color: #333;
  border: none;
  cursor: pointer;
  transform-origin: right center;
`;

const WhiteBackground = styled(motion.span)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent 10%,
    rgba(255, 255, 255, 0.8) 50%,
    transparent 90%
  );
  filter: blur(2px);
  z-index: 1;
`;

const CenterDot = styled.span`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #666;
  margin: 0 2px;
`;

const TextSpan = styled.span`
  white-space: nowrap;
  z-index: 2;
  position: relative;
`;

export default ChipButton;