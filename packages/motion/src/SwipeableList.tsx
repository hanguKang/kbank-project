import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useDragControls, animate } from 'framer-motion';
import type { PanInfo } from 'framer-motion';

interface SwipeToDeleteListItemProps {
  id: string | number;
  user: string;
  bankName: string;
  account: number;
  bankIcon?: string;
  onRequestDelete: (id: string | number) => void;
}

const SwipeToDeleteListItem: React.FC<SwipeToDeleteListItemProps> = ({ 
  id, 
  user, 
  bankName, 
  account, 
  bankIcon, 
  onRequestDelete 
}) => {
  const dragX = useMotionValue(0);
  //const dragControls = useDragControls(); 드래그 시작지점 제어
  
  const deleteButtonWidth = 80;
  const snapThreshold = 0.2;
  let startX = 0;

//   const deleteButtonOpacity = useTransform(
//     dragX,
//     [-deleteButtonWidth * snapThreshold, 0],
//     [1, 0]
//   );

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // 오른쪽으로 드래그 방지 - dragX가 0 이상이 되지 않도록
    const currentX = dragX.get();
    if (currentX > 0 || info.delta.x > 0) {
      dragX.set(Math.min(0, currentX));
    }
  };

  const handleDragStart = () => {
    startX = dragX.get(); // 드래그 시작 시점 기록
  };
  const handleDragEnd = () => {
    const endX = dragX.get(); // 드래그 끝 지점
    const deltaX = endX - startX; // 방향 및 이동량 계산
    const transition = { duration: 0.3, ease: "easeOut" as const };
    const openThreshold = -deleteButtonWidth * snapThreshold; // 예: -20
    const closeThreshold = -deleteButtonWidth * (1 - snapThreshold); // 예: -80

    // 왼쪽으로 밀었을 때 (deltaX < 0)
    if (deltaX < 0 && endX < openThreshold) {
        animate(dragX, -deleteButtonWidth, transition); // 열기
        return;
    }

    // 오른쪽으로 밀었을 때 (deltaX > 0)
    if (deltaX > 0 && endX > closeThreshold) {
        animate(dragX, 0, transition); // 닫기
        return;
    }

    // 그 외: 가장 가까운 쪽으로 스냅
    const halfway = -deleteButtonWidth / 2;
    if (endX < halfway) {
        animate(dragX, -deleteButtonWidth, transition);
    } else {
        animate(dragX, 0, transition);
    }
  };



  const handleDeleteClick = () => {
    onRequestDelete(id);
  };

  return (
    <div style={{ 
      position: 'relative', 
      overflow: 'hidden', 
      height: '80px',
      borderBottom: '1px solid #eee',
      touchAction: 'pan-y', // 모바일 프레임이 드래그할 때 움직이는 것을 막아준다. 세로 스크롤만 허용, 가로는 차단
    }}>
      <motion.button
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          height: '80px',
          width: deleteButtonWidth,
          backgroundColor: '#ff4444',
          border: 'none',
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold',
          zIndex: 1,
          //opacity: deleteButtonOpacity,
        }}
        onClick={handleDeleteClick}
      >
        삭제
      </motion.button>

      <motion.div
        style={{ 
          x: dragX, //useMotionValue의 값을 x축으로 값을 지정
          position: 'relative',
          zIndex: 2,
          height: '80px ',
          backgroundColor: 'white',
          touchAction: 'none', // 브라우저 기본 터치 동작 방지
          userSelect: 'none', // 텍스트 선택 방지
        }}
        drag="x" //드래그는 가로로만 지정
        //dragControls={dragControls}
        dragListener={true}
        dragConstraints={{ left: -deleteButtonWidth, right: 0 }}
        dragElastic={0}
        dragMomentum={false}
        onDrag={handleDrag}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div
          style={{
            padding: '16px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'grab',
          }}
        
        //   onPointerDown={(e: React.PointerEvent) => { // motion.div 쪽에서 dragListener = {false}로 지정하고 자식 요소에게 드래그 시작 지점을 지정한다. 
        //     e.preventDefault(); // 기본 동작 방지
        //     dragControls.start(e);
        //   }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              backgroundColor: '#e0e0e0',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#666'
            }}
          >
            {bankIcon? bankIcon : '기본 아이콘'}
          </div>
          
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
              {user}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {bankName} • {account}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface MusicItem {
  id: number;
  user: string;
  bankName: string;
  account: number;
  bankIcon?: string;
}

const SwipeableList: React.FC = () => {
  const [musicList, setMusicList] = useState<MusicItem[]>([
    { id: 1, user: '홍길동님', bankName: 'kb국민', account: 123456789 },
    { id: 2, user: '둘리님이다', bankName: 'SC제일', account: 1234556789 },
    { id: 3, user: '만만한철수', bankName: '하나은행', account: 123456789 },
  ]);

  const handleRequestDelete = (id: string | number) => {
    setMusicList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2> 목록 삭제 리스트</h2>
      <div style={{ backgroundColor: 'white', borderRadius: '8px' }}>
        {musicList.map((list) => (
          <SwipeToDeleteListItem
            key={list.id}
            id={list.id}
            user={list.user}
            bankName={list.bankName}
            account={list.account}
            bankIcon={list.bankIcon}
            onRequestDelete={handleRequestDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default SwipeableList;