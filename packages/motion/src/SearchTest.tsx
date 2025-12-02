import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

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

// Header Component
const Header: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '50px', 
        padding: '0 16px', display: 'flex', alignItems: 'center', 
        justifyContent: 'space-between', backgroundColor: 'white', 
        zIndex: 1000, borderBottom: '1px solid #e5e5e5'
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

// CancelButton Component
interface CancelButtonProps {
  isSearching: boolean;
  onClick: () => void;
}

const CancelButton: React.FC<CancelButtonProps> = ({ isSearching, onClick }) => {
  return (
    <motion.button
      style={{
        border: 'none',
        background: 'transparent',
        color: '#007AFF',
        fontSize: '14px',
        cursor: 'pointer',
        flexShrink: 0,
        width: '48px',
        whiteSpace: 'nowrap',
        marginLeft: '8px',
        pointerEvents: isSearching ? 'auto' : 'none',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isSearching ? 1 : 0 }}
      transition={{
        duration: 0.15,
        delay: isSearching ? 0.35 : 0,
        ease: [0, 0, 1, 1],
      }}
      onClick={onClick}
    >
      취소
    </motion.button>
  );
};

// SearchBox Component
interface SearchBoxProps {
  isSearching: boolean;
  searchValue: string;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  onSearchFocus: () => void;
  onSearchChange: (value: string) => void;
  onClear: () => void;
  onCancel: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  isSearching,
  searchValue,
  searchInputRef,
  onSearchFocus,
  onSearchChange,
  onClear,
  onCancel,
}) => {
  const CANCEL_BUTTON_SPACE = 56; // 48px + 8px gap

  return (
    <div style={{ 
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    }}>
      <motion.div
        initial={{ clipPath: 'inset(0 0 0 0 round 20px)' }}
        animate={{ 
          clipPath: isSearching 
            ? `inset(0 ${CANCEL_BUTTON_SPACE}px 0 0 round 20px)` 
            : 'inset(0 0 0 0 round 20px)'
        }}
        transition={{
          duration: 0.35,
          ease: [0.4, 0, 0.2, 1],
        }}
        style={{
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: '#f5f5f5',
          borderRadius: '20px', 
          padding: '10px 16px',
          flex: 1,
          willChange: 'clip-path',
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

      <CancelButton onClick={onCancel} isSearching={isSearching} />
    </div>
  );
};

// SearchWrapper Component
interface SearchWrapperProps {
  isSearching: boolean;
  children: React.ReactNode;
}

const SearchWrapper: React.FC<SearchWrapperProps> = ({ isSearching, children }) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: isSearching ? -50 : 0 }}
      transition={{
        duration: isSearching ? 0.4 : 0,
        ease: isSearching ? [0.4, 0, 0.2, 1] : [0, 0, 1, 1],
      }}
      style={{
        position: 'fixed',
        left: 0,
        width: '100vw',
        padding: '0 16px',
        zIndex: 1001,
        display: 'flex',
        alignItems: 'center',
        top: '58px',
        willChange: 'transform',
      }}
    >
      {children}
    </motion.div>
  );
};

// SearchSection Component
const SearchSection: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ padding: '16px 16px 0', height: '68px', marginBottom: '80px' }}>
    {children}
  </div>
);

// SearchPopup Component
interface SearchPopupProps {
  isVisible: boolean;
}

const SearchPopup: React.FC<SearchPopupProps> = ({ isVisible }) => {
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
          delay: isVisible ? 0.45 : 0,
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
        <Header isVisible={!isSearching} />

        <div style={{ paddingTop: '50px', width: '100vw' }}>
          <SearchSection>
            <SearchWrapper isSearching={isSearching}>
              <SearchBox
                isSearching={isSearching}
                searchValue={searchValue}
                searchInputRef={searchInputRef}
                onSearchFocus={handleSearchFocus}
                onSearchChange={setSearchValue}
                onClear={handleClear}
                onCancel={handleCancel}
              />
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
      </div>
    </>
  );
};

export default SearchAnimation;