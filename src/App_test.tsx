// src/App.tsx
import { FixedHeader } from './components/FixedHeader'; // 경로를 현재 프로젝트 구조에 맞게 수정하세요.
import { Section} from './components/Section'; // 경로를 현재 프로젝트 구조에 맞게 수정하세요.
import { SectionTitle } from './components/SectionTitle'; // 경로를 현재 프로젝트 구조에 맞게 수정하세요.
import { TextButtonGroup } from './components/TextButtonGroup'; // 경로를 현재 프로젝트 구조에 맞게 수정하세요.
import { ImageComponent } from './common/ImageComponent'; // 경로를 현재 프로젝트 구조에 맞게 수정하세요.
import { ListComponent } from './common/ListComponent'; // 경로를 현재 프로젝트 구조에 맞게 수정하세요.
import { ParallaxTransition } from './motion/ParallaxTransition'; // 경로를 현재 프로젝트 구조에 맞게 수정하세요.
import { useState } from 'react';

// Section2 내부의 Sticky Title 역할을 수행할 컴포넌트
const StickySectionTitle: React.FC<{ headerHeight: number }> = ({ headerHeight }) => (
  <SectionTitle 
    style={{
      position: 'sticky', // 📌 요구사항: 전체 스크롤 시 뷰포트 상단에 달라붙음
      top: headerHeight,  // Header (40px) 바로 아래에 붙도록 설정
      backgroundColor: 'white',
      zIndex: 30, // Section2 본체(20)보다 높게 설정
      padding: '16px 0',
      borderBottom: '1px solid #eee'
    }}
  >
    섹션2 제목 (Sticky Title)
  </SectionTitle>
);

function App() {
  const imageUrl1 = 'https://img.freepik.com/free-vector/book-open-with-fairytale-castle-unicorn_24640-46166.jpg?semt=ais_hybrid&w=740&q=80';
  const headerHeight = 40; // 📌 요구사항: Header 높이 40px 고정
  const [showHeaderTitle, setShowHeaderTitle] = useState(false);

  return (
    <div style={{ width: '100vw', margin: 0, padding: 0 }}>
      {/* 1. Fixed Header (z-index: 100) */}
      <FixedHeader 
        style={{ height: headerHeight }} 
        titleClassName={showHeaderTitle ? 'show' : ''} // HeaderTitle에 클래스 전달
      >
        <div style={{ 
          paddingLeft: '16px', 
          lineHeight: `${headerHeight}px`,
          fontWeight: 'bold',
          color: '#fff'
        }}>
          메인 헤더 | <span className={showHeaderTitle ? 'show' : ''} style={{ 
            transition: 'opacity 0.3s', 
            opacity: showHeaderTitle ? 1 : 0 
          }}>Section 2 Title</span>
        </div>
      </FixedHeader>

      {/* 2. Parallax Transition Area */}
      <ParallaxTransition
        headerHeight={headerHeight}
        
        // 📌 Section 1 Content: Fixed, Parallax 이동 (Image + Text)
        section1Content={
          <Section 
            style={{ 
              height: '80vh', // 이미지 높이 설정 (Section1Height 측정에 사용됨)
              backgroundColor: '#f9f9f9',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: '60px' // 헤더와의 여백
            }}
          >
            <SectionTitle>섹션1 - 패럴랙스 배경</SectionTitle>
            <ImageComponent 
              src={imageUrl1}
              alt="동화 책 이미지"
              width="70%"
              maxWidth="500px"
              marginBottom="16px"
            />
            <TextButtonGroup 
              button1Text="더 보기"
              button2Text="나가기"
            />
          </Section>
        }

        // 📌 Section 2 Content: Relative, Sticky Title + Scrollable List
        section2Content={
          <Section 
            style={{ 
              backgroundColor: 'white',
              minHeight: '200vh', // Section2의 스크롤을 위해 충분한 높이 확보
              padding: '0 20px 20px' // Sticky Title을 위해 좌우 패딩만 유지
            }}
          >
            {/* 요구사항: Section2의 자식요소로 제목 (Sticky) */}
            <StickySectionTitle headerHeight={headerHeight} />

            {/* 요구사항: 목록은 이미지 아래로 스크롤 */}
            <ListComponent 
              itemCount={100} // 긴 스크롤을 위해 항목 수를 늘림
              itemHeight="36px"
              padding="8px"
              style={{ padding: '20px 0' }}
            />
          </Section>
        }
        
        // 📌 요구사항: 전체 스크롤이 끝나면 header의 title 컴포넌트에 show 클래스 부착
        onScrollEnd={(isEnd) => {
          setShowHeaderTitle(isEnd);
          console.log(`헤더 타이틀 show 상태: ${isEnd}`);
        }}
      />
    </div>
  );
}

export default App;