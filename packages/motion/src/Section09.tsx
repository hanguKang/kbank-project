import { useState, useEffect, useRef } from 'react';

export const Section09 = ({
    phase,
    direction,
}: {
    phase: 'enter' | 'exit';
    direction: number;
}) => {
    const [visible, setVisible] = useState(direction === -1);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let firstRafId: number;
        let secondRafId: number;

        if (phase === 'enter' && direction === 1) {
            setVisible(false);
            firstRafId = requestAnimationFrame(() => {
                secondRafId = requestAnimationFrame(() => setVisible(true));
            });
        } else if (phase !== 'enter' && direction === -1) {
            setVisible(false);
        }
        return () => {
            cancelAnimationFrame(firstRafId);
            cancelAnimationFrame(secondRafId);
        };
    }, [phase, direction]);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                minHeight: '100dvh',
                backgroundColor: '#17191e',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: 'clamp(100px, 7.92vw, 152px)',
            }}
        >
            {/* 상단 타이틀 영역 */}
            <div style={{
                height: '50dvh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: 'bold',
            }}>
                <span className={`section-title-text sect09 ${visible ? 'visible' : ''}`}>
                    Section 09 Top
                </span>
            </div>

            {/* 스크롤 가능한 콘텐츠 영역 */}
            <div style={{
                flex: 1,
                width: '100%',
                backgroundColor: '#fff',
                color: '#17191e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
            }}>
                Scrollable Content Area (Section 09)
            </div>

            {/* 푸터 영역 */}
            <footer style={{
                width: '100%',
                height: '500px',
                padding: '40px 0',
                backgroundColor: '#f2f2f7',
                color: '#17191e',
                textAlign: 'center',
                fontSize: '18px',
            }}>
                Footer - Section 09
            </footer>
        </div>
    );
};

export default Section09;