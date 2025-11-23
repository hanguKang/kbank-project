import React, { useEffect, useState } from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';
import { css } from '@emotion/react';
import styled from '@emotion/styled';


const ChipButton = () => {
  return (
    <div style={{ 
      position: 'relative', 
      display: 'flex', 
      justifyContent: 'flex-end',
      padding: '50px',
      width: '300px',
    }}>
      <style>{`
        @keyframes expandButton {
          0% {
            width: 24px;
            background-color: #e0e0e0;
          }
          16.67% {
            width: 220px;
            background-color: #ffffff;
          }
          83.33% {
            width: 220px;
            background-color: #ffffff;
          }
          100% {
            width: 24px;
            background-color: #e0e0e0;
          }
        }

        @keyframes showText {
          0% {
            width: 0px;
            opacity: 0;
          }
          5% {
            width: 0px;
            opacity: 0;
          }
          16.67% {
            width: 150px;
            opacity: 1;
          }
          83.33% {
            width: 150px;
            opacity: 1;
          }
          88% {
            width: 0px;
            opacity: 0;
          }
          100% {
            width: 0px;
            opacity: 0;
          }
        }

        @keyframes changeTextColor {
          0% {
            color: #666;
          }
          16.67% {
            color: #2196f3;
          }
          83.33% {
            color: #2196f3;
          }
          100% {
            color: #666;
          }
        }

        @keyframes whiteBgSlide {
          0% {
            transform: translateX(-20px);
            opacity: 0;
          }
          5% {
            transform: translateX(-20px);
            opacity: 0;
          }
          16.67% {
            transform: translateX(240px);
            opacity: 0;
          }
          17% {
            opacity: 0;
          }
          100% {
            transform: translateX(-20px);
            opacity: 0;
          }
        }

        @keyframes whiteBgFade {
          0%, 5% {
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          15% {
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes hideComma {
          0% {
            opacity: 1;
          }
          83.33% {
            opacity: 1;
          }
          85% {
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }

        .chip-button {
          position: relative;
          display: flex;
          align-items: center;
          height: 24px;
          padding: 8px;
          border-radius: 12px;
          box-sizing: border-box;
          font-size: 14px;
          overflow: hidden;
          color: #666;
          border: none;
          cursor: pointer;
          transform-origin: 100% 50%;
          animation: expandButton 3.5s ease-in-out forwards;
        }

        .white-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 20px;
          height: 100%;
          background: linear-gradient(110deg, transparent 0%, rgba(255, 255, 255, 0.9) 50%, transparent 100%);
          filter: blur(3px);
          z-index: 1;
          pointer-events: none;
          animation: whiteBgSlide 3.5s ease-in-out forwards, whiteBgFade 3.5s ease-in-out forwards;
        }

        .center-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #666;
          margin: 0 2px;
          z-index: 2;
          position: relative;
          flex-shrink: 0;
        }

        .base-text {
          white-space: nowrap;
          z-index: 2;
          position: relative;
          margin-left: 4px;
          flex-shrink: 0;
        }

        .comma {
          z-index: 2;
          position: relative;
          flex-shrink: 0;
          animation: hideComma 3.5s ease-in-out forwards;
        }

        .text-container {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          animation: showText 3.5s ease-in-out forwards;
        }

        .additional-text {
          white-space: nowrap;
          margin-left: 12px;
          z-index: 2;
          position: relative;
          animation: changeTextColor 3.5s ease-in-out forwards;
        }
      `}</style>

      <button className="chip-button">
        {/* 흰색 배경 효과 */}
        <span className="white-bg"></span>

        {/* 중앙 점 */}
        <span className="center-dot"></span>

        {/* 사장님 텍스트 - 항상 보임 */}
        <span className="base-text">사장님</span>

        {/* 쉼표 */}
        <span className="comma">,</span>

        {/* 추가 텍스트 */}
        <span className="text-container">
          <span className="additional-text">
            매출 파이팅 <i>아이콘</i>
          </span>
        </span>
      </button>
    </div>
  );
};

export default ChipButton;