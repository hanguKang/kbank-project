// DigitSlot.tsx (수정된 버전)
import React, { useState, useEffect, useRef } from 'react';

interface DigitSlotProps {
    currentDigit: number; // 0부터 9까지의 현재 숫자
}

// 순환을 위한 숫자 목록: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 9] (총 11개)
const DIGIT_SEQUENCE = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 9];

// CSS transition 시간 (0.4s)과 일치
const TRANSITION_DURATION = 400; 
const TRANSITION_RESET_DELAY = 50;

const DigitSlot: React.FC<DigitSlotProps> = ({ currentDigit }) => {
    // 1. 현재 적용할 translateY 값을 상태로 관리
    const [translateValue, setTranslateValue] = useState('0%');
    // 2. transition 활성화 여부를 상태로 관리
    const [isTransitionEnabled, setIsTransitionEnabled] = useState(true); 
    
    // 이전 currentDigit 값을 저장하여 변화를 감지
    const prevDigitRef = useRef<number>(currentDigit);

    // currentDigit이 변경될 때마다 실행
    useEffect(() => {
        const prevDigit = prevDigitRef.current;
        
        // 현재 숫자에 해당하는 sequenceIndex 계산 (9:0, 8:1, ..., 0:9)
        let newIndex = currentDigit === 0 ? 9 : 9 - currentDigit;
        let newTranslateY = `-${newIndex * 100}%`;

        // ----------------------------------------------------
        // A. 0 -> 9 순환 처리 로직 (가장 복잡한 부분)
        // 이전 값이 0이었고, 현재 값이 9인 경우
        if (prevDigit === 0 && currentDigit === 9) {
            // 1. 0에서 맨 아래의 9로 애니메이션 (9번째 인덱스 -> 10번째 인덱스)
            const finalNinthIndex = 10;
            const animateToNine = `-${finalNinthIndex * 100}%`;
            
            // transition을 활성화하고 -1000%로 이동 (0.4s 애니메이션)
            setIsTransitionEnabled(true); 
            setTranslateValue(animateToNine); 

            // 2. 애니메이션 완료 후 (0.4s 후) 맨 위의 9 (0%)로 순간 리셋
            const resetTimeout = setTimeout(() => {
                // transition을 비활성화하고 0%로 즉시 변경
                setIsTransitionEnabled(false); 
                setTranslateValue('0%'); 

                // 3. DOM 업데이트 반영 후 transition 다시 활성화
                const reEnableTimeout = setTimeout(() => {
                    setIsTransitionEnabled(true);
                }, TRANSITION_RESET_DELAY); 
                
                return () => clearTimeout(reEnableTimeout);

            }, TRANSITION_DURATION); 

            prevDigitRef.current = currentDigit;
            return () => clearTimeout(resetTimeout);

        } 
        // ----------------------------------------------------
        // B. 일반적인 9 -> 8, 1 -> 0 등 연속적인 숫자 변화
        else {
            // transition이 꺼져있는 상태였다면 다시 켜야 합니다.
            if (!isTransitionEnabled) {
                setIsTransitionEnabled(true);
            }
            setTranslateValue(newTranslateY);
        }

        prevDigitRef.current = currentDigit;

    }, [currentDigit]); 
    // 의존성 배열에서 isTransitionEnabled, setTranslateValue 등은 생략 가능 (React guarantee)

    return (
        <div className="digit-slot-container">
            <div 
                // isTransitionEnabled 상태를 기반으로 클래스 적용
                className={`digit-list ${!isTransitionEnabled ? 'no-transition' : ''}`}
                style={{ transform: `translateY(${translateValue})` }}
            >
                {/* 9, 8, ..., 0, 9를 나열합니다. */}
                {DIGIT_SEQUENCE.map((digit, index) => (
                    <span key={index}>{digit}</span> 
                ))}
            </div>
        </div>
    );
};

export default DigitSlot;