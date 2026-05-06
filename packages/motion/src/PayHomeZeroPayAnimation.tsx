import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const PayHomeZeroPayAnimation = () => {
  const FirstImgItems = [
    { id: 1, color: '#FF6B6B' },
    { id: 2, color: '#4ECDC4' },
    { id: 3, color: '#45B7D1' },
    { id: 4, color: '#96CEB4' },
    { id: 5, color: '#FFEAA7' },
    { id: 6, color: '#DDA0DD' },
  ];

  const SecoundImgItems = [
    { id: 1, color: '#98D8C8' },
    { id: 2, color: '#F7DC6F' },
    { id: 3, color: '#BB8FCE' },
    { id: 4, color: '#85C1E9' },
    { id: 5, color: '#F8C471' },
    { id: 6, color: '#82E0AA' },
  ];

  return (
    <Container>
      <CardBlock>
        <TitleBlock>
          <h3>가맹점 둘러보기</h3>
          <h2>제로페이 가맹점에서{'\n'}30% 소득 공제 혜택!</h2>
        </TitleBlock>

        <ImagesBlock>
          <Row>
            <Track>
              {[...FirstImgItems, ...FirstImgItems].map((item, idx) => (
                <ImageBox key={idx} color={item.color}>
                  <span>{idx + 1}</span>
                </ImageBox>
              ))}
            </Track>
            <Track>
              {[...FirstImgItems, ...FirstImgItems].map((item, idx) => (
                <ImageBox key={`dup-${idx}`} color={item.color}>
                  <span>{idx + 1}</span>
                </ImageBox>
              ))}
            </Track>
          </Row>

          <Row isBottom>
            <Track isBottom>
              {[...SecoundImgItems, ...SecoundImgItems].map((item, idx) => (
                <ImageBox key={idx} color={item.color}>
                  <span>{idx + 1}</span>
                </ImageBox>
              ))}
            </Track>
            <Track isBottom>
              {[...SecoundImgItems, ...SecoundImgItems].map((item, idx) => (
                <ImageBox key={`dup-${idx}`} color={item.color}>
                  <span>{idx + 1}</span>
                </ImageBox>
              ))}
            </Track>
          </Row>
        </ImagesBlock>
      </CardBlock>
    </Container>
  );
};

export default PayHomeZeroPayAnimation;

// 애니메이션 키프레임
const slideTop = keyframes`
  from {
    transform: translateX(-80px);
  }
  to {
    transform: translateX(calc(-100% - 80px));
  }
`;

const slideBottom = keyframes`
  from {
    transform: translateX(-40px);
  }
  to {
    transform: translateX(calc(-100% - 40px));
  }
`;

// 스타일 컴포넌트
const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 20px 40px;
  background: #f5f5f5;
  min-height: 100vh;
`;

const CardBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 40px;
  gap: 24px;
  border-radius: 16px;
  background: linear-gradient(97deg, #f3e8ff 1.53%, #e0e7ff 98.24%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  width: 100%;
  max-width: 600px;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 10px;
  gap: 8px;

  h3 {
    color: #7c3aed;
    font-size: 14px;
    margin: 0;
  }

  h2 {
    color: #1e293b;
    font-size: 24px;
    margin: 0;
    white-space: pre-line;
    line-height: 1.4;
  }
`;

const ImagesBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  overflow: hidden;
`;

const Row = styled.div<{ isBottom?: boolean }>`
  display: flex;
  width: 100%;
  overflow: hidden;
`;

const Track = styled.div<{ isBottom?: boolean }>`
  display: flex;
  gap: 12px;
  flex-shrink: 0;
  padding-left: ${({ isBottom }) => isBottom ? '0' : '12px'};
  padding-right: ${({ isBottom }) => isBottom ? '12px' : '0'};
  animation: ${({ isBottom }) => (isBottom ? slideBottom : slideTop)} 20s linear infinite;
`;

const ImageBox = styled.div<{ color: string }>`
  display: flex;
  width: 70px;
  height: 70px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: ${({ color }) => color};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;

  span {
    font-size: 18px;
    font-weight: bold;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
`;