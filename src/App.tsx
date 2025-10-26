// src/App.tsx
import { FixedHeader } from '@components/FixedHeader';
import { Section} from '@components/Section';
import { SectionTitle } from '@components/SectionTitle';
import { TextButtonGroup } from '@components/TextButtonGroup';
import { ImageComponent } from '@common/ImageComponent';
import { ListComponent } from '@common/ListComponent';
import { ScrollTransition } from '@motion/ScrollTransition';
import { useState } from 'react';

function App() {
  const imageUrl1 = 'https://img.freepik.com/free-vector/book-open-with-fairytale-castle-unicorn_24640-46166.jpg?semt=ais_hybrid&w=740&q=80';
  const [scrollState, setScrollState] = useState<'external' | 'internal'>('external');

  return (
    <div style={{ width: '100vw', minHeight: '200vh', margin: 0, padding: 0 }}>
      <FixedHeader />
      <div style={{ marginTop: '50px' }}>
        
        <ScrollTransition
          firstSection={
            <Section 
              style={{ 
                height: '40vh',
                backgroundColor: '#f9f9f9',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <SectionTitle>섹션1 - 고정된 섹션</SectionTitle>
              <ImageComponent 
                src={imageUrl1}
                alt="동화 책 이미지"
                width="70%"
                marginBottom="16px"
              />
              <TextButtonGroup 
                button1Text="저장하기"
                button2Text="공유하기"
              />
            </Section>
          }
          secondSection={
            <Section 
              style={{ 
                minHeight: '60vh',
                backgroundColor: 'white'
              }}
            >
              <SectionTitle>섹션2 - 스크롤되는 섹션</SectionTitle>
              <ListComponent 
                itemCount={50}
                itemHeight="36px"
                padding="8px"
              />
            </Section>
          }
          headerHeight={50}
          onScrollStateChange={(state) => {
            setScrollState(state);
            console.log(`스크롤 상태: ${state}`);
          }}
        />

        {/* 추가 컨텐츠 (스크롤 테스트용) */}
        <div style={{ 
          height: '100vh', 
          padding: '20px', 
          backgroundColor: '#f0f0f0',
          display: scrollState === 'external' ? 'block' : 'none'
        }}>
          <h3>추가 컨텐츠 영역</h3>
          <p>이 부분은 외부 스크롤 상태일 때만 보입니다.</p>
        </div>

      </div>
    </div>
  );
}

export default App;