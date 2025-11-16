import React, { useState, useRef, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// React Functional Component 타입 정의
const SearchAnimation: FC = () => {
  // 상태 변수 타입 정의
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  
  // useRef 타입 정의: HTMLInputElement 또는 null
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 🚨 취소 버튼의 공간 확보 값 (48px)
  const CANCEl_BUTTON_SPACE: number = 48; 
  
  const handleSearchFocus = () => {
    setIsSearching(true);
  };

  const handleCancel = () => {
    // isSearching을 false로 바꾸고, 모든 복귀 애니메이션이 즉시 일어나도록 함
    setIsSearching(false); 
    setSearchValue('');
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  const handleClear = () => {
    setSearchValue('');
    searchInputRef.current?.focus();
  };
  
  // 1. SearchWrapper의 위치(y) 애니메이션 (GPU 가속 유지)
  const wrapperVariants = {
    initial: { y: 0 },  
    animate: { y: -50 } 
  };

  // 2. SearchBox의 너비 (Width 애니메이션)
  const searchBoxWidthVariants = {
    initial: { width: '100%' }, 
    // 너비 축소 로직: 취소 버튼 공간 확보
    animate: { width: `calc(100% - ${CANCEl_BUTTON_SPACE}px)` }  
  };
  
  // 🚨 즉시 퇴장 트랜지션 (duration: 0)
  const instantExitTransition = { duration: 0, ease: "linear" };
  // 🚨 안전 버퍼를 포함한 지연 시간 (0.4s 메인 애니메이션 + 0.05s 안정화)
  const APPEARANCE_DELAY: number = 0.45; 
  // 🚨 새로운 진입 너비 이징 (바운스 방지 강화)
  const entryWidthEase = [0.4, 0, 0.6, 1]; 


  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        * {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }
        html, body {
          margin: 0;
          padding: 0;
          width: 100vw;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
      
      <div style={{ position: 'relative', minHeight: '100vh', width: '100vw', backgroundColor: 'white' }}>
        {/* 헤더: isSearching이 false일 때만 표시 */}
        <header
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '50px', padding: '0 16px',
            // isSearching이 false일 때만 flex로 표시
            display: isSearching ? 'none' : 'flex', alignItems: 'center', justifyContent: 'space-between',
            backgroundColor: 'white', zIndex: 1000, borderBottom: '1px solid #e5e5e5'
          }}
        >
          <span style={{ fontSize: '16px', fontWeight: 500 }}>사용자명</span>
          <button style={{ background: 'transparent', border: 'none', fontSize: '20px' }}>⚙️</button>
        </header>

        {/* 메인 컨텐츠 */}
        <div style={{ paddingTop: '50px', width: '100vw' }}>
          {/* SearchSection - 레이아웃 공간 확보 */}
          <div style={{ padding: '16px 16px 0', height: '68px', marginBottom: '80px' }}>
            
            {/* SearchWrapper: 위치(y) 애니메이션 */}
            <motion.div
              layout={false} // 자동 레이아웃 애니메이션 비활성화
              variants={wrapperVariants}
              initial="initial"
              animate={isSearching ? "animate" : "initial"} 
              // Y축 트랜지션: 진입 easeOut 적용, 복귀 0s (즉시)
              transition={{
                y: {
                  type: "tween",
                  duration: isSearching ? 0.4 : 0, 
                  ease: isSearching ? "easeOut" : "linear", // 요청하신 대로 easeOut 적용
                }
              }}
              style={{
                position: 'fixed', left: 0, width: '100vw', padding: '0 16px', zIndex: 1001,
                display: 'flex', alignItems: 'center', top: '58px', // top은 고정
              }}
            >
              {/* SearchBox: width 애니메이션 적용 */}
              <motion.div
                layout={false} // 자동 레이아웃 애니메이션 비활성화
                variants={searchBoxWidthVariants}
                initial="initial"
                animate={isSearching ? "animate" : "initial"} 
                // Width 트랜지션: 새로운 커스텀 Bézier 곡선 적용으로 바운스 방지 강화
                transition={{
                    width: {
                        type: "tween",
                        duration: isSearching ? 0.4 : 0, 
                        ease: isSearching ? entryWidthEase : "linear", // 새로운 이징 적용
                    }
                }}
                style={{
                  display: 'flex', alignItems: 'center', backgroundColor: '#f5f5f5', 
                  borderRadius: '20px', padding: '10px 16px', 
                  width: '100%', // Variants에서 제어됨
                  willChange: 'width', 
                  flexShrink: 0, // Shrink 방지
                }}
              >
                <svg style={{ width: '18px', height: '18px', flexShrink: 0, color: '#666' }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                  <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                
                {/* 입력 필드 (flex: 1로 남은 공간 채우기) */}
                <input
                  ref={searchInputRef}
                  type="text" placeholder="검색어를 입력하세요"
                  value={searchValue} onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={handleSearchFocus}
                  style={{
                    border: 'none', background: 'transparent', outline: 'none', 
                    flex: 1, // 남은 공간을 모두 차지
                    margin: '0 8px', fontSize: '14px', 
                    width: '100%', 
                  }}
                />
                
                {searchValue && (
                  <button
                    onClick={handleClear}
                    style={{
                      border: 'none', background: 'transparent', padding: 0, width: '18px',
                      height: '18px', cursor: 'pointer', flexShrink: 0, opacity: 0.6,
                      fontSize: '18px', lineHeight: 1, color: '#666'
                    }}
                  >
                    ×
                  </button>
                )}
              </motion.div>
              
              {/* 3. 취소 버튼 (재활성화) */}
              <AnimatePresence>
                {isSearching && (
                  <motion.button
                    key="cancel-button"
                    style={{
                      border: 'none', background: 'transparent', marginLeft: '8px',
                      color: '#007AFF', fontSize: '14px', cursor: 'pointer', flexShrink: 0,
                      width: '40px', // 공간 확보
                    }}
                    initial={{ opacity: 0, x: 5 }} 
                    animate={{ opacity: 1, x: 0 }}
                    // 복귀 시 즉시 사라짐 (바운스 방지)
                    exit={{ opacity: 0, x: 5, transition: instantExitTransition }} 
                    // 🚨 메인 애니메이션 완료 후 안전하게 지연 후 나타남
                    transition={{ duration: 0.15, delay: APPEARANCE_DELAY }} 
                    onClick={handleCancel}
                  >
                    취소
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* 컨텐츠 (항상 표시됨) */}
          <div style={{ padding: '0 16px' }}> 
            <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#333', fontWeight: 600 }}>인기 카테고리</h2>
            <div style={{ display: 'flex', overflowX: 'auto', gap: '12px', marginBottom: '24px', paddingBottom: '8px' }} className="scrollbar-hide">
              {['전자제품', '의류', '가구', '도서', '스포츠', '뷰티'].map((item, index) => (
                <div key={index} style={{ flexShrink: 0, padding: '8px 16px', backgroundColor: '#f5f5f5', borderRadius: '16px', fontSize: '14px', whiteSpace: 'nowrap' }}>
                  {item}
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#333', fontWeight: 600 }}>추천 상품</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['스마트폰', '노트북', '태블릿', '스마트워치', '이어폰'].map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: index < 4 ? '1px solid #f0f0f0' : 'none' }}>
                  <span style={{ width: '20px', fontWeight: 700, color: '#007AFF', marginRight: '12px' }}>{index + 1}</span>
                  <span style={{ fontSize: '14px' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 풀팝업: isSearching일 때만 나타나 컨텐츠를 덮습니다. */}
        <AnimatePresence>
            {isSearching && (
                <motion.div
                    key="full-popup"
                    style={{ 
                      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
                      backgroundColor: 'white', zIndex: 999, overflowY: 'auto', 
                      paddingTop: '76px' 
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    // Exit 애니메이션: duration 0으로 설정하여 즉시 사라짐
                    exit={{ opacity: 0, transition: instantExitTransition }} 
                    transition={{ duration: 0.2 }}
                >
                    {/* 4. 풀 팝업 컨텐츠 */}
                    <motion.div
                        style={{ padding: '0 16px' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        // 🚨 지연 시간: 메인 애니메이션 완료 후 안전하게 나타남
                        transition={{ duration: 0.2, delay: APPEARANCE_DELAY }} 
                    >
                        <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#333', fontWeight: 600 }}>최근 검색어</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {['노트북', '스마트폰', '이어폰'].map((item, index) => (
                            <div key={index} style={{ padding: '12px 0', borderBottom: index < 2 ? '1px solid #f0f0f0' : 'none' }}>
                                <span style={{ fontSize: '14px' }}>{item}</span>
                            </div>
                            ))}
                        </div>

                        <h2 style={{ fontSize: '18px', marginBottom: '16px', marginTop: '24px', color: '#333', fontWeight: 600 }}>인기 검색어</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {['아이폰', '갤럭시', '에어팟', '아이패드', '맥북'].map((item, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: index < 4 ? '1px solid #f0f0f0' : 'none' }}>
                                <span style={{ width: '20px', fontWeight: 700, color: '#007AFF', marginRight: '12px' }}>{index + 1}</span>
                                <span style={{ fontSize: '14px' }}>{item}</span>
                            </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default SearchAnimation;