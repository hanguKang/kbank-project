import React from 'react';

const HeroSection = ({ isLoaded }: { isLoaded: boolean }) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}>
      {/* 텍스트 영역 */}
      <div style={{
        display: 'flex',
        gap: 'clamp(20px, 3.33vw, 64px)',
        alignItems: 'center',
      }}>
        <span style={{
          color: '#fff',
          fontSize: 'clamp(40px, 3.33vw, 64px)',
          fontWeight: 700,
          letterSpacing: '-0.017em',
          lineHeight: 1.35,
          whiteSpace: 'nowrap',
          opacity: isLoaded ? 1 : 0,
          animation: isLoaded ? 'none' : 'fadeInUp 0.8s ease-out 0.2s both',
        }}>
          새로운 금융
        </span>

        <span style={{
          color: '#fff',
          fontSize: 'clamp(40px, 3.33vw, 64px)',
          fontWeight: 700,
          letterSpacing: '-0.017em',
          lineHeight: 1.35,
          whiteSpace: 'nowrap',
          opacity: isLoaded ? 1 : 0,
          animation: isLoaded ? 'none' : 'fadeInUp 0.8s ease-out 0.6s both',
        }}>
          의 시작,
        </span>

        {/* 흰 박스 + 텍스트 */}
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: '#fff',
            borderRadius: 8,
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateX(0)' : undefined,
            animation: isLoaded ? 'none' : 'slideInBox 1.3s cubic-bezier(0.68,-0.55,0.265,1.55) 1.8s both',
          }} />
          <span style={{
            position: 'relative',
            zIndex: 1,
            color: '#0114a7',
            fontSize: 'clamp(40px, 3.33vw, 64px)',
            fontWeight: 700,
            letterSpacing: '-0.017em',
            lineHeight: 1.35,
            whiteSpace: 'nowrap',
            padding: '0 8px',
            opacity: isLoaded ? 1 : 0,
            animation: isLoaded ? 'none' : 'fadeIn 0.5s ease-out 1.4s both',
          }}>
            케이뱅크
          </span>
        </div>
      </div>

      {/* 스크롤 인디케이터 */}
      <div style={{
        position: 'absolute',
        bottom: 'clamp(28px, 2.08vw, 40px)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'clamp(40px, 2.86vw, 55px)',
        opacity: 0,
        animation: 'fadeIn 0.8s ease-out 1.8s forwards, bounce 2s ease-in-out 2.6s infinite',
      }}>
        <svg fill="none" viewBox="0 0 55 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
          <path d="M7.86 6.5L27.5 18L47.14 6.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideInBox {
          0%   { opacity: 0; transform: translateX(-100vw); }
          60%  { opacity: 1; transform: translateX(20px); }
          75%  { transform: translateX(-8px); }
          85%  { transform: translateX(4px); }
          92%  { transform: translateX(-2px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
