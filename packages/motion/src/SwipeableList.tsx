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
  const dragControls = useDragControls();
  
  const deleteButtonWidth = 80;
  const snapThreshold = 0.2;

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

  const handleDragEnd = () => {
    const currentX = dragX.get();
    const threshold = -deleteButtonWidth * snapThreshold;

    // 애니메이션 속도 조정 (duration: 초 단위, type: 애니메이션 타입)
    const transition = { duration: 0.3,ease: 'easeOut' as const };

    if (currentX < threshold) {
      //dragX.set(-deleteButtonWidth);
      animate(dragX, -deleteButtonWidth,transition); //dragX 타겟을.. 이동
    } else {
      //dragX.set(0);
      animate(dragX, 0,transition);
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
          x: dragX,
          position: 'relative',
          zIndex: 2,
          height: '80px ',
          backgroundColor: 'white',
          touchAction: 'none', // 브라우저 기본 터치 동작 방지
          userSelect: 'none', // 텍스트 선택 방지
        }}
        drag="x"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ left: -deleteButtonWidth, right: 0 }}
        dragElastic={0}
        dragMomentum={false}
        onDrag={handleDrag}
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
          onPointerDown={(e: React.PointerEvent) => {
            e.preventDefault(); // 기본 동작 방지
            dragControls.start(e);
          }}
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