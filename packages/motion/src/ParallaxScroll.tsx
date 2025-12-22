import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { css } from '@emotion/react';

// -------------------------------------------------------------------------
// 💡 App.tsx에서 사용되던 컴포넌트 목업 및 실제 정의
// -------------------------------------------------------------------------
const Section: React.FC<React.PropsWithChildren<{ style?: React.CSSProperties }>> = ({ children, style }) => (
    <section style={style}>{children}</section>
);
const SectionTitle: React.FC<React.PropsWithChildren<{ style?: React.CSSProperties }>> = ({ children, style }) => (
    <h2 style={{ fontSize: '24px', margin: '0 0 16px', textAlign: 'center', ...style }}>{children}</h2>
);
// TextButtonGroup: motion.div로 감싸서 별도의 Y 변환을 적용할 수 있도록 수정
const TextButtonGroup: React.FC<{ button1Text: string; button2Text: string; y: any; zIndex: number }> = ({ button1Text, button2Text, y, zIndex }) => (
    <motion.div 
        style={{ 
            display: 'flex', 
            gap: '8px', 
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            x: '-50%',
            y: y,
            zIndex: zIndex
        }}
    >
        <button style={{ padding: '8px 16px' }}>{button1Text}</button>
        <button style={{ padding: '8px 16px' }}>{button2Text}</button>
    </motion.div>
);

// ImageComponent: 배경색상(파란색)이 덮도록 수정. opacity 적용을 위해 motion.img 대신 일반 img 사용 후, 래퍼에 opacity 적용
const ImageComponent: React.FC<{ src: string; alt: string; opacity: any }> = ({ src, alt, opacity }) => (
    <div 
        style={{ 
            position: 'absolute', 
            top: 0, 
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%', 
            height: '100%', 
            backgroundColor: 'skyblue',
            zIndex: 1 
        }}
    >
        <motion.img 
            src={src} 
            alt={alt} 
            style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                display: 'block',
                opacity: opacity
            }}
        />
    </div>
);

const ListComponent: React.FC<{ itemCount: number; itemHeight: string; padding: string; style?: React.CSSProperties }> = ({ itemCount, itemHeight, padding, style }) => (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, ...style }}>
        {Array.from({ length: itemCount }, (_, i) => (
            <li key={i} style={{ height: itemHeight, lineHeight: itemHeight, padding: padding, borderBottom: '1px solid #f0f0f0' }}>목록 아이템 {i + 1}</li>
        ))}
    </ul>
);

// -------------------------------------------------------------------------
// 1. Section1Wrapper (높이 측정 및 공간 확보 역할) - 기존과 동일
// -------------------------------------------------------------------------
const Section1Wrapper: React.FC<{ children: React.ReactNode; setHeight: (height: number) => void; currentHeight: number; contentRef: React.RefObject<HTMLDivElement | null> }> = ({ children, setHeight, currentHeight, contentRef }) => {
  const measure = useCallback(() => {
    if (contentRef.current) {
      const rect = contentRef.current.getBoundingClientRect();
      const height = rect.height;
      //console.log('높이', height);
      if (height > 0 && height !== currentHeight) {
          setHeight(height);
      }
    }
  }, [setHeight, currentHeight, contentRef]);

  useEffect(() => {
    measure(); 
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  return (
    <div 
      style={{ 
        height: currentHeight > 0 ? currentHeight : 'auto', 
        position: 'relative', 
        zIndex: 10,
        marginTop: '0px'
      }}
    >
      {children}
    </div>
  );
};
// -------------------------------------------------------------------------
// 2. ParallaxScroll 컴포넌트
// -------------------------------------------------------------------------
const ParallaxScroll = () => {
    
    // --- 상수 및 State ---
    const imageUrl1 = 'https://img.freepik.com/free-vector/book-open-with-fairytale-castle-unicorn_24640-46166.jpg?semt=ais_hybrid&w=740&q=80';
    const headerHeight = 50; 
    const [showHeaderTitle, setShowHeaderTitle] = useState(false);
    //const [headerWhite, setHeaderWhite] = useState(false);
    const [section1ContentHeight, setSection1ContentHeight] = useState(0); 
    const section1ContentRef = useRef<HTMLDivElement>(null); 
    const { scrollY } = useScroll();
    
    const headerRef = useRef<HTMLDivElement | null>(null);
    // useTransform 사용
    const transitionPoint = section1ContentHeight - 20;
    console.log('transitionPoint', transitionPoint);
    const scrollProgress = useTransform(scrollY, 
        [0, transitionPoint], 
        [0, 1]
    );
    
    const opacityBg = useTransform(scrollProgress, [0, 1], [1, 0]);
    const backgroundY = useTransform(scrollProgress, [0, 1], [0, -45]);
    const buttonY = useTransform(scrollProgress, [0, 1], [0, -75]);

    const HeaderStyle = css`
        &::after { 
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 100%;
            background-color: red;
            opacity: 0;
            transition: opacity 0.3s;
            z-index: -1;
        }
        &.is-scrolled::after{
            opacity: 1;
        }
    `;

    useEffect(() => {
    const handleScroll = () => {
        if(!headerRef.current) return;
        headerRef.current?.classList.toggle(
        'is-scrolled', 
        window.pageYOffset > transitionPoint
        );
    };
    
    window.addEventListener('scroll', handleScroll, { 
        passive: true, 
        capture: true 
    });
    
    return () => window.removeEventListener('scroll', handleScroll, { capture: true });
    }, []);

    // --- 애니메이션 로직 통합 ---
    useEffect(() => {
        if (transitionPoint === 0) return;

        const unsubscribe = scrollY.on('change', (latestScrollY) => {
            const isInternal = latestScrollY >= transitionPoint;
            console.log('스크롤Y:', latestScrollY, '이동지점:', transitionPoint, '내부영역:', isInternal);
            setShowHeaderTitle(isInternal);
            //setHeaderWhite(isInternal);
        });

        return () => unsubscribe();
    }, [scrollY, transitionPoint]);


    // -------------------------------------------------------------------------
    // 3. Render
    // -------------------------------------------------------------------------
    
    const section1Content = (
        <Section 
            style={{ 
                height: '80vh', 
                position: 'relative',
                backgroundColor: 'transparent',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: '0'
            }}
        >
            {/* ⭐️ 1. 배경 이미지 (Opacity 1 -> 0) */}
            <ImageComponent 
                src={imageUrl1}
                alt="동화 책 이미지"
                opacity={opacityBg}
            />

            {/* ⭐️ 2. 섹션 타이틀 (ImageComponent 위에 보이도록 z-index 2) */}
            <SectionTitle style={{ zIndex: 2, color: 'white' }}>섹션1 - 패럴랙스 배경</SectionTitle>

            {/* ⭐️ 3. 버튼 그룹 (배경보다 빠르게 Y 이동) */}
            <TextButtonGroup 
                button1Text="더 보기"
                button2Text="나가기"
                y={buttonY}
                zIndex={2}
            />
        </Section>
    );

    const section2Content = (
        <Section 
            style={{ 
                backgroundColor: 'white',
                minHeight: '200vh', 
                padding: '0 20px 20px' 
            }}
        >
            <SectionTitle 
                style={{
                    position: 'sticky', 
                    top: headerHeight,
                    backgroundColor: 'white',
                    zIndex: 30, 
                    padding: '16px 0',
                    borderBottom: '1px solid #eee'
                }}
            >
                섹션2 제목 (Sticky Title)
            </SectionTitle>
            <ListComponent 
                itemCount={5}
                itemHeight="36px"
                padding="8px"
                style={{ padding: '20px 0' }}
            />
        </Section>
    );

    return (
        <div style={{ width: '100vw', margin: 0, padding: 0, minHeight: 'calc(100vh - 50px)' }}>
            {/* 1. Fixed Header */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: headerHeight,
                    zIndex: 100,
                    boxShadow: 'none',
                    transform: 'translateZ(0)', // GPU 가속
                }}
                css={HeaderStyle}

                ref={headerRef}
            >
                <div style={{ 
                    paddingLeft: '16px', 
                    lineHeight: `${headerHeight}px`,
                    fontWeight: 'bold',
                    color: '#000'
                }}>
                    메인 헤더 | <span className={showHeaderTitle ? 'show' : ''} style={{ 
                        transition: 'opacity 0.3s', 
                        opacity: showHeaderTitle ? 1 : 0
                    }}>Section 2 Title</span>
                </div>
            </div>

            {/* 2. Parallax Transition Area */}
            <div>
                {/* Debug UI (Optional) */}
                {/* <div style={{ position: 'fixed', top: 0, left: 10, zIndex: 9999, backgroundColor: 'yellow', padding: '5px', fontSize: '12px' }}>
                    S1 H: {section1ContentHeight.toFixed(0)}px | Bg Y: {backgroundY.get().toFixed(1)} | Btn Y: {buttonY.get().toFixed(1)} | Opacity: {opacityBg.get().toFixed(2)} | ScrollY: {scrollY.get().toFixed(0)} | Trans: {transitionPoint.toFixed(0)} | White: {headerWhite ? 'Y' : 'N'}
                </div> */}
                
                {/* 2-1. div.section1 역할: 높이 확보 */}
                <Section1Wrapper 
                    setHeight={setSection1ContentHeight} 
                    currentHeight={section1ContentHeight}
                    contentRef={section1ContentRef} 
                >
                    {/* 2-1-1. div.imgWrapper 역할: position: fixed + motion.div 적용 */}
                    <motion.div
                        ref={section1ContentRef} 
                        style={{
                            position: 'fixed', 
                            top: 0, 
                            left: 0,
                            right: 0,
                            width: '100%',
                            y: backgroundY,
                            zIndex: 10 
                        }}
                    >
                        {section1Content}
                    </motion.div>
                </Section1Wrapper>

                {/* 2-2. div.section2 역할: position: relative */}
                <div
                    style={{
                        position: 'relative', 
                        zIndex: 20, 
                        backgroundColor: 'white',
                        minHeight: 'calc(100vh - 50px)', // 헤더 높이 제외
                    }}
                >
                    {section2Content}
                </div>
            </div>
        </div>
    );
};

export default ParallaxScroll;