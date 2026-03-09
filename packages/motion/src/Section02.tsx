import styled from '@emotion/styled';

interface Props {
    phase: 'enter' | 'exit';
}

const Section2 = ({ phase }: Props) => {
    const isExit = phase === 'exit';

    return (
        <Wrapper>
            <TitleArea>
                <div className={`hero-title text-part1${isExit ? ' exiting' : ''}`}>
                    재미있는
                </div>
                <div style={{ position: 'relative', padding: '0 20px' }}>
                    <div className={`white-box${isExit ? ' visited exiting' : ''}`} />
                    <div
                        className={`hero-title text-part3${isExit ? ' visited exiting' : ''}`}
                        style={{ position: 'relative', color: '#4982bf', zIndex: 1 }}
                    >
                        돈 모으기
                    </div>
                </div>
            </TitleArea>

            <CardArea>
                {[0, 1, 2].map((i) => (
                    <Card
                        key={i}
                        className={`inner-card ${isExit ? 'exit' : 'enter'}`}
                        style={{ transitionDelay: isExit ? `${i * 0.15}s` : `${i * 0.2}s` }}
                    >
                        카드 {i + 1}
                    </Card>
                ))}
            </CardArea>
        </Wrapper>
    );
};

export default Section2;

const Wrapper = styled.div`
  width: 100%;
  height: 100dvh;
  background-color: #4982bf;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
`;

const TitleArea = styled.div`
  display: flex;
  gap: clamp(20px, 1.4vw, 48px);
  font-size: clamp(40px, 3.33vw, 64px);
  font-weight: 700;
  letter-spacing: -0.017em;
  white-space: nowrap;
`;

const CardArea = styled.div`
  display: flex;
  gap: 20px;
`;

const Card = styled.div`
  width: 200px;
  height: 280px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
`;