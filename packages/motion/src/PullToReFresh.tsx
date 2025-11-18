import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 타입 정의
interface CategoryItemProps {
  label: string;
}

interface ListItemProps {
  label: string;
  index: number;
  showBorder: boolean;
  showNumber?: boolean;
}

// PullToRefresh Component
interface PullToRefreshProps {
  pullDistance: number;
  isRefreshing: boolean;
  isHolding: boolean;
  message: string;
  messageColor: string;
  showSpinner: boolean;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({ 
  pullDistance, 
  isRefreshing, 
  isHolding,
  message, 
  messageColor,
  showSpinner 
}) => {
  const BASE_HEIGHT = 60; // 기본 높이
  const threshold = 80;
  
  // 드래그 중: pullDistance만큼 높이 증가
  // 홀딩 중: BASE_HEIGHT로 고정
  // 사라지는 중: 0으로
  const height = isHolding 
    ? BASE_HEIGHT 
    : (isRefreshing ? 0 : Math.max(0, pullDistance * 0.7));
  
  const spinnerOpacity = Math.min(pullDistance / threshold, 1);
  const scale = Math.min(0.5 + (pullDistance / threshold) * 0.5, 1);

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1002,
        backgroundColor: 'white',
        borderBottom: height > 0 ? '1px solid #e5e5e5' : 'none',
        overflow: 'hidden',
      }}
      animate={{
        height: `${height}px`,
      }}
      transition={{
        height: { 
          duration: isHolding ? 0.3 : (isRefreshing ? 0.3 : 0),
          ease: 'easeOut'
        }
      }}
    >
      <motion.div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {/* 스피너는 showSpinner가 true일 때만 표시 */}
        {showSpinner && (
          <motion.div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: `3px solid ${messageColor}`,
              borderTopColor: 'transparent',
              opacity: spinnerOpacity,
            }}
            animate={{
              rotate: (isRefreshing || isHolding) ? 360 : pullDistance * 4,
              scale: (isRefreshing || isHolding) ? 1 : scale,
            }}
            transition={{
              rotate: (isRefreshing || isHolding)
                ? { duration: 1, repeat: Infinity, ease: 'linear' }
                : { duration: 0 }
            }}
          />
        )}
        {/* 메시지 투명도 애니메이션 */}
        <motion.span
          animate={{ 
            opacity: (pullDistance > 0 || isHolding) && !isRefreshing ? 1 : 0 
          }}
          transition={{ 
            duration: isRefreshing ? 0.3 : 0.3,
            ease: 'easeOut'
          }}
          style={{
            fontSize: '14px',
            color: messageColor,
            textAlign: 'center',
          }}
        >
          {message}
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

// Header Component
const Header: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <header
      style={{
        position: 'sticky', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '50px', 
        padding: '0 16px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        backgroundColor: 'white', 
        zIndex: 1000, 
        borderBottom: '1px solid #e5e5e5'
      }}
    >
      <span style={{ fontSize: '16px', fontWeight: 500 }}>사용자명</span>
      <button style={{ background: 'transparent', border: 'none', fontSize: '20px' }}>⚙️</button>
    </header>
  );
};

// Section Title Component
const SectionTitle: React.FC<{ children: React.ReactNode; marginTop?: string }> = ({ 
  children, 
  marginTop = '0' 
}) => (
  <h2 style={{ 
    fontSize: '18px', 
    marginBottom: '16px', 
    marginTop, 
    color: '#333', 
    fontWeight: 600 
  }}>
    {children}
  </h2>
);

// Category Item Component
const CategoryItem: React.FC<CategoryItemProps> = ({ label }) => (
  <div style={{ 
    flexShrink: 0, 
    padding: '8px 16px', 
    backgroundColor: '#f5f5f5', 
    borderRadius: '16px', 
    fontSize: '14px', 
    whiteSpace: 'nowrap' 
  }}>
    {label}
  </div>
);

// List Item Component
const ListItem: React.FC<ListItemProps> = ({ label, index, showBorder, showNumber = false }) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    padding: '12px 0', 
    borderBottom: showBorder ? '1px solid #f0f0f0' : 'none' 
  }}>
    {showNumber && (
      <span style={{ 
        width: '20px', 
        fontWeight: 700, 
        color: '#007AFF', 
        marginRight: '12px' 
      }}>
        {index}
      </span>
    )}
    <span style={{ fontSize: '14px' }}>{label}</span>
  </div>
);

// SearchBox Component
interface SearchBoxProps {
  isSearching: boolean;
  searchValue: string;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  onSearchFocus: () => void;
  onSearchChange: (value: string) => void;
  onClear: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  isSearching,
  searchValue,
  searchInputRef,
  onSearchFocus,
  onSearchChange,
  onClear
}) => {
  const CANCEL_BUTTON_SPACE = 48;
  const entryWidthEase: [number, number, number, number] = [0.4, 0, 0.6, 1];

  const searchBoxWidthVariants = {
    initial: { width: 'calc(100% - 0px)' },
    animate: { width: `calc(100% - ${CANCEL_BUTTON_SPACE}px)` }
  };

  return (
    <motion.div
      layout={false}
      variants={searchBoxWidthVariants}
      initial="initial"
      animate={isSearching ? "animate" : "initial"}
      transition={{
        width: {
          type: "tween" as const,
          duration: isSearching ? 0.4 : 0,
          ease: isSearching ? entryWidthEase : [0, 0, 1, 1],
        }
      }}
      style={{
        display: 'flex', 
        alignItems: 'center', 
        backgroundColor: '#f5f5f5',
        borderRadius: '20px', 
        padding: '10px 16px',
        width: 'calc(100% - 0px)',
        willChange: 'width',
        flexShrink: 0,
      }}
    >
      <svg 
        style={{ width: '18px', height: '18px', flexShrink: 0, color: '#666' }} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor"
      >
        <circle cx="11" cy="11" r="8" strokeWidth="2"/>
        <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
      </svg>

      <input
        ref={searchInputRef}
        type="text"
        placeholder="검색어를 입력하세요"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={onSearchFocus}
        style={{
          border: 'none',
          background: 'transparent',
          outline: 'none',
          flex: 1,
          margin: '0 8px',
          fontSize: '14px',
          width: '100%',
        }}
      />

      {searchValue && (
        <button
          onClick={onClear}
          style={{
            border: 'none',
            background: 'transparent',
            padding: 0,
            width: '18px',
            height: '18px',
            cursor: 'pointer',
            flexShrink: 0,
            opacity: 0.6,
            fontSize: '18px',
            lineHeight: 1,
            color: '#666'
          }}
        >
          ×
        </button>
      )}
    </motion.div>
  );
};

// CancelButton Component
interface CancelButtonProps {
  onClick: () => void;
  isVisible: boolean;
}

const CancelButton: React.FC<CancelButtonProps> = ({ onClick, isVisible }) => {
  const APPEARANCE_DELAY = 0.45;

  return (
    <motion.button
      style={{
        border: 'none',
        background: 'transparent',
        marginLeft: '8px',
        color: '#007AFF',
        fontSize: '14px',
        cursor: 'pointer',
        flexShrink: 0,
        width: '40px',
        pointerEvents: isVisible ? 'auto' : 'none',
        wordBreak:'keep-all',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{
        duration: isVisible ? 0.15 : 0,
        delay: isVisible ? APPEARANCE_DELAY : 0,
      }}
      onClick={onClick}
    >
      취소
    </motion.button>
  );
};

// SearchWrapper Component
interface SearchWrapperProps {
  isSearching: boolean;
  children: React.ReactNode;
}

const SearchWrapper: React.FC<SearchWrapperProps> = ({ isSearching, children }) => {
  const wrapperVariants = {
    initial: { y: 0 },
    animate: { y: -50 }
  };

  return (
    <motion.div
      layout={false}
      variants={wrapperVariants}
      initial="initial"
      animate={isSearching ? "animate" : "initial"}
      transition={{
        y: {
          type: "tween" as const,
          duration: isSearching ? 0.4 : 0,
          ease: isSearching ? "easeOut" : [0, 0, 1, 1],
        }
      }}
      style={{
        position: 'sticky',
        top: '50px',
        left: 0,
        width: '100%',
        padding: '0 16px',
        zIndex: 1001,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
      }}
    >
      {children}
    </motion.div>
  );
};

// SearchSection Component
const SearchSection: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ height: '68px', marginBottom: '80px' }}>
    {children}
  </div>
);

// SearchPopup Component
interface SearchPopupProps {
  isVisible: boolean;
}

const SearchPopup: React.FC<SearchPopupProps> = ({ isVisible }) => {
  const APPEARANCE_DELAY = 0.45;

  const recentSearches = ['노트북', '스마트폰', '이어폰'];
  const popularSearches = ['아이폰', '갤럭시', '에어팟', '아이패드', '맥북'];

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'white',
        zIndex: 999,
        overflowY: 'auto',
        paddingTop: '76px',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{
        duration: isVisible ? 0.2 : 0,
      }}
    >
      <motion.div
        style={{ padding: '0 16px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{
          duration: isVisible ? 0.2 : 0,
          delay: isVisible ? APPEARANCE_DELAY : 0,
        }}
      >
        <SectionTitle>최근 검색어</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recentSearches.map((item, index) => (
            <ListItem
              key={index}
              label={item}
              index={index + 1}
              showBorder={index < recentSearches.length - 1}
            />
          ))}
        </div>

        <SectionTitle marginTop="24px">인기 검색어</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {popularSearches.map((item, index) => (
            <ListItem
              key={index}
              label={item}
              index={index + 1}
              showBorder={index < popularSearches.length - 1}
              showNumber
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main Component
const SearchAnimation: React.FC = () => {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Pull to Refresh 상태
  const [pullDistance, setPullDistance] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isHolding, setIsHolding] = useState<boolean>(false); // 홀딩 상태
  const [touchStart, setTouchStart] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 랜덤 메시지와 색상
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [messageColor, setMessageColor] = useState<string>('#007AFF');
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  
  // 메시지 배열
  const messages = [
    '새로운 소식을 찾고 있어요 ✨',
    '최신 정보를 가져오는 중... 🔄',
    '잠시만 기다려주세요 ⏳',
    '새로고침 중입니다 🌟',
    '업데이트를 확인하고 있어요 📱',
  ];
  
  // 색상 배열
  const colors = [
    '#007AFF', // 파랑
    '#FF3B30', // 빨강
    '#34C759', // 초록
    '#FF9500', // 주황
    '#AF52DE', // 보라
    '#FF2D55', // 분홍
    '#5856D6', // 인디고
    '#00C7BE', // 청록
  ];
  
  // 새로고침 대기 시간 설정 (밀리초)
  const REFRESH_HOLD_DURATION = 1500;
  const BASE_HEIGHT = 60;

  const categories = ['전자제품', '의류', '가구', '도서', '스포츠', '뷰티'];
  const products = ['스마트폰', '노트북', '태블릿', '스마트워치', '이어폰'];

  const handleSearchFocus = () => setIsSearching(true);

  const handleCancel = () => {
    setIsSearching(false);
    setSearchValue('');
    searchInputRef.current?.blur();
  };

  const handleClear = () => {
    setSearchValue('');
    searchInputRef.current?.focus();
  };

  // Pull to Refresh 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    // 애니메이션 진행 중이면 이벤트 무시
    if (isHolding || isRefreshing) return;
    
    if (containerRef.current && containerRef.current.scrollTop === 0 && !isSearching) {
      setTouchStart(e.touches[0].clientY);
      // 당기기 시작할 때 랜덤 메시지와 색상 선택
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setCurrentMessage(randomMessage);
      setMessageColor(randomColor);
      // '새로고침 중입니다' 메시지일 때만 스피너 표시
      setShowSpinner(randomMessage === '새로고침 중입니다 🌟');
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // 애니메이션 진행 중이면 이벤트 무시
    if (touchStart === 0 || isRefreshing || isSearching || isHolding) return;
    
    const currentTouch = e.touches[0].clientY;
    const distance = currentTouch - touchStart;
    
    // 스크롤이 가장 위에 있고, 당기는 방향일 때만 처리
    if (distance > 0 && containerRef.current && containerRef.current.scrollTop === 0) {
      e.preventDefault(); 
      setPullDistance(Math.min(distance, 250));
    }
  };

  const handleTouchEnd = () => {
    // 애니메이션 진행 중이면 이벤트 무시
    if (isHolding || isRefreshing) return;
    
    if (pullDistance > 80 && !isRefreshing) {
      // 1단계: 홀딩 상태로 전환 (높이를 BASE_HEIGHT로 줄임)
      setIsHolding(true);
      setPullDistance(0);
      
      // 2단계: REFRESH_HOLD_DURATION 후 위로 사라짐
      setTimeout(() => {
        setIsRefreshing(true);
        setIsHolding(false);
        
        // 3단계: 애니메이션 완료 후 상태 초기화
        setTimeout(() => {
          setIsRefreshing(false);
        }, 300);
      }, REFRESH_HOLD_DURATION);
    } else {
      setPullDistance(0);
    }
    setTouchStart(0);
  };

  // 컨텐츠의 top 위치 계산
  const contentTop = isHolding 
    ? BASE_HEIGHT 
    : (isRefreshing ? 0 : pullDistance * 0.7);

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

      <PullToRefresh 
        pullDistance={pullDistance} 
        isRefreshing={isRefreshing}
        isHolding={isHolding}
        message={currentMessage}
        messageColor={messageColor}
        showSpinner={showSpinner}
      />

      <motion.div 
        ref={containerRef}
        style={{ 
          position: 'relative', 
          minHeight: '100vh', 
          width: '100vw', 
          backgroundColor: 'white',
          overflowY: 'auto',
        }}
        animate={{
          y: contentTop
        }}
        transition={{
          duration: isHolding ? 0.3 : (isRefreshing ? 0.3 : 0),
          ease: 'easeOut'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Header isVisible={!isSearching} />

        <div style={{ width: '100vw' }}>
          <SearchSection>
            <SearchWrapper isSearching={isSearching}>
              <SearchBox
                isSearching={isSearching}
                searchValue={searchValue}
                searchInputRef={searchInputRef}
                onSearchFocus={handleSearchFocus}
                onSearchChange={setSearchValue}
                onClear={handleClear}
              />
              <CancelButton onClick={handleCancel} isVisible={isSearching} />
            </SearchWrapper>
          </SearchSection>

          <div style={{ padding: '0 16px' }}>
            <SectionTitle>인기 카테고리</SectionTitle>
            <div
              style={{
                display: 'flex',
                overflowX: 'auto',
                gap: '12px',
                marginBottom: '24px',
                paddingBottom: '8px'
              }}
              className="scrollbar-hide"
            >
              {categories.map((item, index) => (
                <CategoryItem key={index} label={item} />
              ))}
            </div>

            <SectionTitle>추천 상품</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {products.map((item, index) => (
                <ListItem
                  key={index}
                  label={item}
                  index={index + 1}
                  showBorder={index < products.length - 1}
                  showNumber
                />
              ))}
            </div>
          </div>
        </div>

        <SearchPopup isVisible={isSearching} />
      </motion.div>
    </>
  );
};

export default SearchAnimation;