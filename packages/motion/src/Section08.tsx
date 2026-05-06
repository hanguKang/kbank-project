import React, { useState, useEffect, useRef } from 'react';

export const Section08 = ({
    phase,
    direction,
    //index,
}: {
    phase: 'enter' | 'exit';
    direction: number;
    //index: number;
}) => {
    const [visible, setVisible] = useState(direction === -1);
    const [internalStep, setInternalStep] = useState(direction === -1 ? 1 : 0);
    const prevDirection = useRef<number>(direction);

    useEffect(() => {
        let firstRafId: number;
        let secondRafId: number;

        if (phase === 'enter') {
            if (direction === 1) {
                if (prevDirection.current === direction) {
                    setInternalStep(0);
                    setVisible(false);
                    firstRafId = requestAnimationFrame(() => {
                        secondRafId = requestAnimationFrame(() => setVisible(true));
                    });
                }
                prevDirection.current = direction;
            } else {
                setInternalStep(1);
                setVisible(true);
                firstRafId = requestAnimationFrame(() => {
                    requestAnimationFrame(() => setInternalStep(0));
                });
                prevDirection.current = direction;
            }
        } else {
            if (direction === 1) {
                setInternalStep(1);
            } else {
                setVisible(false);
                setInternalStep(0);
            }
        }
        return () => {
            cancelAnimationFrame(firstRafId);
            cancelAnimationFrame(secondRafId);
        };
    }, [phase, direction]);

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0114a7',
            color: '#fff',
            fontSize: '32px',
            fontWeight: 'bold',
        }}>
            <div className={`section-title-wrapper sect08 ${internalStep === 1 && direction === -1 ? 'up' : ''}`}>
                <span className={`section-title-text sect08 ${visible ? 'visible' : ''}`}>
                    Section 08 Content
                </span>
            </div>
        </div>
    );
};

export default Section08;