import { useMemo, useState, useEffect, useRef } from 'react';



type DigitSlotProps = { 
    maxDigit : number;
    currentDigit: number; 
}



// 순환을 위한 숫자 목록 (9부터 0까지, 그리고 0 다음에 9를 한 번 더 추가)
 
const TRANSITION_DURATION = 300; 
const TRANSITION_RESET_DELAY = 50; 
const DIGIT_HEIGHT = 36; // css span의 높이

const calculateInitialTranslateY = (digit:number, max:number)=>{ 
    const initialIndex = max - digit; 
    return `${initialIndex * DIGIT_HEIGHT }`;
}

const DigitSlot: React.FC<DigitSlotProps> = ({ currentDigit, maxDigit }) => { 
    const [translateValue, setTranslateValue] = useState<string>( calculateInitialTranslateY(currentDigit, maxDigit) );

    // 0에서 9로 전환될 때 transition을 일시적으로 끄기 위한 상태

    const [isTransitionEnabled, setIsTransitionEnabled] = useState<boolean>(true);

    const prevDigitRef = useRef<number>(currentDigit);



    // 현재 숫자의 위치를 계산합니다. (9는 0번째, 0은 9번째)

    const DIGIT_SEQUENCE = useMemo(()=>{ 
        const sequence: number[] = []; 
        for(let i=maxDigit; i>=0; i--){ 
            sequence.push(i); 
        } 
        sequence.push(maxDigit); 
        return sequence; 
    }, [maxDigit]);


    // 만약 현재 숫자가 0이라면, 다음 숫자가 9가 될 때를 대비하여 마지막 '0' 위치를 사용합니다.
    const digitListRef = useRef<HTMLDivElement>(null);

    const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
        if (e.propertyName !== 'transform') return; 

        const sequenceLength = DIGIT_SEQUENCE.length;
        const finalNthIndex = sequenceLength - 1; 
        const finalTranslateY = `${finalNthIndex * DIGIT_HEIGHT}`;

        if (parseInt(translateValue) === parseInt(finalTranslateY) - 52) {
        if (parseInt(translateValue) === parseInt(finalTranslateY) - 52) {
            const element = digitListRef.current;
            if (!element) return;

            // 1. 클래스 제거로 transition 비활성화
            element.classList.remove('transitioning');
            
            // 2. getComputedStyle로 강제 리플로우 (offsetHeight보다 확실함)
            const elementTrnsformn = window.getComputedStyle(element).transform;
            console.log(elementTransform)
            const elementTrnsformn = window.getComputedStyle(element).transform;
            console.log(elementTransform)
            // 3. 위치 리셋
            setTranslateValue('-52');
            setTranslateValue('-52');
            
            // 4. 다음 프레임에서 transition 재활성화
            setTimeout(() => {
                if (element) {
                    element.classList.add('transitioning');
                    setIsTransitionEnabled(true);
                }
            }, 50); // 10ms로 충분한 간격 확보
        } else {
            if(!isTransitionEnabled){
                setIsTransitionEnabled(true);
            }
            setTranslateValue(translateValue);
        } else {

            if(!isTransitionEnabled){
                setIsTransitionEnabled(true);
            }
            setTranslateValue(translateValue);
        }
    };
    useEffect(()=>{
        requestAnimationframe( ()=>{ setIsTransitionEnabled(true) });
        requestAnimationframe( ()=>{ setIsTransitionEnabled(true) });
        const prevDigit = prevDigitRef.current; 
        const sequenceLength = DIGIT_SEQUENCE.length; 
        const newIndex = maxDigit - currentDigit; 
        const newTranslateY = `${newIndex * DIGIT_HEIGHT}`;
        if ( ( prevDigit === 1 && currentDigit === 0 ) || 
             ( currentDigit === 0 && prevDigit === currentDigit) ){ //최초 시작이 0이라면 
        if ( ( prevDigit === 1 && currentDigit === 0 ) || 
             ( currentDigit === 0 && prevDigit === currentDigit) ){ //최초 시작이 0이라면 
            // setTimeout 제거, 애니메이션 시작만 남김
            const finalNthIndex = sequenceLength - 1;   
            const animateToN = `${finalNthIndex * DIGIT_HEIGHT}`;   
            setIsTransitionEnabled(true); 
            setTranslateValue(animateToN);  
            // 이제 리셋은 onTransitionEnd에서 처리됩니다.
        } else { 
            if(!isTransitionEnabled){ setIsTransitionEnabled(true);}
            setTranslateValue(newTranslateY); 
        }
        prevDigitRef.current = currentDigit; 

        return ()=> clearTimeout(mountTimeout); 
    }, [currentDigit, maxDigit, DIGIT_SEQUENCE, isTransitionEnabled]);





    return (
        <div className="digit-slot-container">
            <div
                className={`digit-list ${!isTransitionEnabled ? '' : 'transitioning' }`}
                // ⭐️ onTransitionEnd 핸들러 추가
                onTransitionEnd={handleTransitionEnd} 
                style={{ 
                    transform: `translateY( calc( -100% + ${DIGIT_HEIGHT}px + ${translateValue}px ) )` 
                }}
            >
                {/* ... (숫자 렌더링) ... */}
                {DIGIT_SEQUENCE.map((digit, index) => (
                // 키는 인덱스로 설정
                <span key={index}>{maxDigit - digit}</span>

                ))}
            </div>
        </div>
    );

};


export default DigitSlot;
