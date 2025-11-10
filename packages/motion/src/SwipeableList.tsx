import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useDragControls } from 'framer-motion';

interface SwipeToDeleteListItemProps {
  id: string | number;
  title: string;
  singer: string;
  musicDuration: string;
  thumbnail?: string;
  onRequestDelete: (id: string | number) => void;
}

const SwipeToDeleteListItem: React.FC<SwipeToDeleteListItemProps> = ({ 
  id, 
  title, 
  singer, 
  musicDuration, 
  thumbnail, 
  onRequestDelete 
}) => {
  const dragX = useMotionValue(0);
  const dragControls = useDragControls();
  
  const deleteButtonWidth = 80;
  const snapThreshold = 0.85;

  // 드래그 위치에 따라 삭제 버튼 투명도 조절
  const deleteButtonOpacity = useTransform(
    dragX,
    [-deleteButtonWidth * snapThreshold, 0],
    [1, 0]
  );

  const handleDragEnd = () => {
    const currentX = dragX.get();
    const threshold = -deleteButtonWidth * snapThreshold;

    if (currentX < threshold) {
      dragX.set(-deleteButtonWidth);
    } else {
      dragX.set(0);
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
      borderBottom: '1px solid #eee'
    }}>
      {/* 삭제 버튼 - 항상 렌더링되지만 투명도로 보이기/숨기기 */}
      <motion.button
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: deleteButtonWidth,
          backgroundColor: '#ff4444',
          border: 'none',
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold',
          zIndex: 1,
          opacity: deleteButtonOpacity,
        }}
        onClick={handleDeleteClick}
      >
        삭제
      </motion.button>

      {/* 스와이프 가능한 컨테이너 */}
      <motion.div
        style={{ 
          x: dragX,
          position: 'relative',
          zIndex: 2,
          height: '80px',
          backgroundColor: 'white'
        }}
        drag="x"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ left: -deleteButtonWidth, right: 0 }}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
      >
        <div
          style={{
            padding: '16px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
          onPointerDown={(e: React.PointerEvent) => dragControls.start(e)}
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
            앨범
          </div>
          
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
              {title}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {singer} • {musicDuration}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const SwipeableList: React.FC = () => {
  const [musicList, setMusicList] = useState([
    { id: 1, title: 'Love Story', singer: 'Taylor Swift', musicDuration: '3:55' },
    { id: 2, title: 'Blinding Lights', singer: 'The Weeknd', musicDuration: '3:20' },
    { id: 3, title: 'Dynamite', singer: 'BTS', musicDuration: '3:19' },
  ]);

  const handleRequestDelete = (id: string | number) => {
    setMusicList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>내 음악 리스트</h2>
      <div style={{ backgroundColor: 'white', borderRadius: '8px' }}>
        {musicList.map((music) => (
          <SwipeToDeleteListItem
            key={music.id}
            {...music}
            onRequestDelete={handleRequestDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default SwipeableList;