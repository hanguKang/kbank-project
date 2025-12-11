// DigitDisplayTime.tsx
import React, { useState, useEffect } from 'react';
import DigitSlot from './DigitSlot';
import './DigitDisplayTime.css'; // CSS 파일 임포트

// 이벤트까지 남은 시간을 초 단위로 계산하는 더미 함수
const calculateRemainingSeconds = (targetTime: Date) => {
    const now = new Date().getTime();
    const target = targetTime.getTime();
    return Math.max(0, Math.floor((target - now) / 1000));
};

const DgitDisplayTime: React.FC = () => {
    // 예시 목표 시간: 현재 시간으로부터 1시간 뒤
    const [targetDate] = useState(() => {
        const date = new Date();
        date.setHours(date.getHours() + 1);
        return date;
    });
    
    const [remainingSeconds, setRemainingSeconds] = useState(
        calculateRemainingSeconds(targetDate)
    );

    // 1초마다 남은 시간 업데이트
    useEffect(() => {
        const intervalId = setInterval(() => {
            setRemainingSeconds(prev => calculateRemainingSeconds(targetDate));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [targetDate]);

    // 남은 시간을 시:분:초 2자리 숫자로 분리
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;
    
    const timeString = 
        String(hours).padStart(2, '0') + 
        String(minutes).padStart(2, '0') + 
        String(seconds).padStart(2, '0');

    // ['0', '1', '2', '3', '4', '5'] 형태로 분리
    const digits = timeString.split('').map(Number);
    
    if (remainingSeconds <= 0) {
        return <div className="countdown-timer">카운트다운 완료!</div>;
    }

    return (
        <div className="countdown-timer">
            {/* 시 (Hour) */}
            <DigitSlot currentDigit={digits[0]} maxDigit={11} />
            <DigitSlot currentDigit={digits[1]} maxDigit={1}/>
            <span className="separator">:</span>
            
            {/* 분 (Minute) */}
            <DigitSlot currentDigit={digits[2]} maxDigit={5}/>
            <DigitSlot currentDigit={digits[3]} maxDigit={9}/>
            <span className="separator">:</span>
            
            {/* 초 (Second) */}
            <DigitSlot currentDigit={digits[4]} maxDigit={5}/>
            <DigitSlot currentDigit={digits[5]} maxDigit={9}/>
        </div>
    );
};

export default DgitDisplayTime;