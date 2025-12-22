

// import { Section} from '@components/Section';
// import { SectionTitle } from '@components/SectionTitle';
// import { TextButtonGroup } from '@components/TextButtonGroup';
// import { ImageComponent } from '@common/ImageComponent';
// import { ListComponent } from '@common/ListComponent';
// import { ParallaxTransition } from '@motion/ParallaxTransition';
// import { useState } from 'react';


// function App() {
//   const imageUrl1 = 'https://img.freepik.com/free-vector/book-open-with-fairytale-castle-unicorn_24640-46166.jpg?semt=ais_hybrid&w=740&q=80';
//   const headerHeight = 50; 
//   const [showHeaderTitle, setShowHeaderTitle] = useState(false);

//   return (
//     <div style={{ width: '100vw', margin: 0, padding: 0, minHeight: '300vh' }}>
//       {/* 1. Fixed Header (컴포넌트 정의 없이 JSX에 직접 스타일 적용) */}
//       <header 
//         style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           height: headerHeight,
//           backgroundColor: '#333', 
//           zIndex: 100,
//           boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
//         }}
//       >
//         <div style={{ 
//           paddingLeft: '16px', 
//           lineHeight: `${headerHeight}px`,
//           fontWeight: 'bold',
//           color: '#fff'
//         }}>
//           메인 헤더 | <span className={showHeaderTitle ? 'show' : ''} style={{ 
//             transition: 'opacity 0.3s', 
//             opacity: showHeaderTitle ? 1 : 0 
//           }}>Section 2 Title</span>
//         </div>
//       </header>

//       {/* 💡 Header Height만큼 공간 확보 */}
//       <div style={{ height: headerHeight }} />

//       {/* 2. Parallax Transition Area */}
//       <ParallaxTransition
//         headerHeight={headerHeight}
        
//         // Section 1 Content: imgWrapper 내부의 콘텐츠
//         section1Content={
//           <Section 
//             style={{ 
//               height: '80vh', 
//               backgroundColor: '#f9f9f9',
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: 'center',
//               alignItems: 'center',
//               paddingTop: '60px'
//             }}
//           >
//             <SectionTitle>섹션1 - 패럴랙스 배경</SectionTitle>
//             <ImageComponent 
//               src={imageUrl1}
//               alt="동화 책 이미지"
//               width="70%"
//               maxWidth="500px"
//               marginBottom="16px"
//             />
//             <TextButtonGroup 
//               button1Text="더 보기"
//               button2Text="나가기"
//             />
//           </Section>
//         }

//         // Section 2 Content: Relative, Sticky Title + Scrollable List
//         section2Content={
//           <Section 
//             style={{ 
//               backgroundColor: 'white',
//               minHeight: '200vh', 
//               padding: '0 20px 20px' 
//             }}
//           >
//             {/* ⭐️ Sticky Title (컴포넌트 정의 없이 JSX에 직접 스타일 적용) */}
//             <SectionTitle 
//                 style={{
//                   position: 'sticky', 
//                   top: headerHeight,  // Header 바로 아래에 붙도록 설정
//                   backgroundColor: 'white',
//                   zIndex: 30, 
//                   padding: '16px 0',
//                   borderBottom: '1px solid #eee'
//                 }}
//               >
//                 섹션2 제목 (Sticky Title)
//             </SectionTitle>

//             {/* 목록 (페이지 전체 스크롤 유발) */}
//             <ListComponent 
//               itemCount={100}
//               itemHeight="36px"
//               padding="8px"
//               style={{ padding: '20px 0' }}
//             />
//           </Section>
//         }
        
//         // Header Title 'show' 클래스 부착 로직
//         onScrollEnd={(isEnd) => {
//           setShowHeaderTitle(isEnd);
//         }}
//       />
//     </div>
//   );
// }

//export default App;

import ParallaxScroll from '@motion/ParallaxScroll';

function App() {
  return <ParallaxScroll />;
}
export default App;


// import SwipeableList from '@motion/SwipeableList';

// function App() {
//   return <SwipeableList />;
// }
// export default App;
// import ButtonCeoAnimation from '@motion/ButtonCeoAnimation'; 
// function App() {
//   return <ButtonCeoAnimation />;
// }
// export default App;

// import SearchAnimation from "@motion/SearchAnimation";
// function App() {
//   return <SearchAnimation />;
// }
// export default App;
// import DgitDisplayTime from "@motion/DigitDisplayTime";
// function App() {
//   return <DgitDisplayTime />;
// }
// export default App;