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

// 스와이프 삭제 리스트 아이템 컴포넌트
const SwipeToDeleteListItem: React.FC<SwipeToDeleteListItemProps> = ({ 
  id, 
  title, 
  singer, 
  musicDuration, 
  thumbnail, 
  onRequestDelete 
}) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isSwiped, setIsSwiped] = useState<boolean>(false);
  const dragX = useMotionValue(0);
  const dragControls = useDragControls();
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const swipeAnimateRef = useRef<HTMLDivElement>(null);
  
  const deleteButtonWidth: number = 80; // 삭제 버튼 너비
  const snapThreshold: number = 0.8; // 스냅 임계값 (80%)
  
  // 드래그 위치에 따른 배경색 변화
  const backgroundColor = useTransform(
    dragX,
    [-deleteButtonWidth, 0],
    ["#ffebee", "#ffffff"]
  );

  // 삭제 버튼 투명도 - 스와이프 거리에 따라 변화
  const deleteButtonOpacity = useTransform(
    dragX,
    [-deleteButtonWidth * snapThreshold, 0],
    [1, 0]
  );

  // 삭제 버튼 스케일 - 스와이프 거리에 따라 커짐
  const deleteButtonScale = useTransform(
    dragX,
    [-deleteButtonWidth * snapThreshold, -deleteButtonWidth * 0.3, 0],
    [1, 0.5, 0]
  );

  const handleDragEnd = (): void => {
    const x = dragX.get();
    const threshold = -deleteButtonWidth * snapThreshold;
    
    // 스냅 임계값을 넘으면 삭제 버튼으로 스냅
    if (x < threshold) {
      dragX.set(-deleteButtonWidth);
      setIsSwiped(true);
    } else {
      // 아니면 원위치
      dragX.set(0);
      setIsSwiped(false);
    }
  };

  // 삭제 버튼 직접 클릭 시
  const handleDeleteClick = (): void => {
    setIsDeleting(true);
    setTimeout(() => {
      onRequestDelete(id);
    }, 300);
  };

  // 아이템 클릭 시 원위치 (삭제 버튼 숨김)
  const handleItemClick = (): void => {
    if (isSwiped) {
      dragX.set(0);
      setIsSwiped(false);
    }
  };

  // 컨테이너 variants
  const containerVariants = {
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      exit="exit"
      variants={containerVariants}
      style={{
        position: 'relative',
        overflow: 'hidden',
        height: isDeleting ? 0 : 'auto'
      }}
      animate={{ height: isDeleting ? 0 : 'auto' }}
      transition={{ duration: 0.3 }}
    >
      {/* 삭제 버튼 */}
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
          scale: deleteButtonScale,
          transformOrigin: 'right center'
        }}
        onClick={handleDeleteClick}
        ref={deleteButtonRef}
        whileTap={{ scale: 0.95 }}
      >
        삭제
      </motion.button>

      {/* 스와이프 가능한 컨테이너 */}
      <motion.div
        style={{ 
          x: dragX,
          backgroundColor,
          position: 'relative',
          zIndex: 2
        }}
        drag="x"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ left: -deleteButtonWidth, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        ref={swipeAnimateRef}
        whileTap={{ cursor: 'grabbing' }}
      >
        {/* 리스트 아이템 내용 */}
        <div
          style={{
            padding: '16px',
            backgroundColor: 'inherit',
            cursor: isSwiped ? 'pointer' : 'grab',
            userSelect: 'none'
          }}
          onPointerDown={(e: React.PointerEvent) => !isSwiped && dragControls.start(e)}
          onClick={handleItemClick}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* 썸네일 */}
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
                color: '#666',
                flexShrink: 0,
                overflow: 'hidden'
              }}
            >
              {thumbnail ? (
                <img 
                  src={thumbnail} 
                  alt={title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                '앨범'
              )}
            </div>
            
            {/* 설명 */}
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontWeight: 'bold', 
                marginBottom: '4px',
                fontSize: '16px'
              }}>
                {title}
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: '#666',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>{singer}</span>
                <span>•</span>
                <span>{musicDuration}</span>
              </div>
            </div>

            {/* 스와이프 힌트 (스와이프되지 않은 상태에서만 표시) */}
            {!isSwiped && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                style={{
                  fontSize: '12px',
                  color: '#ccc',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                ← 스와이프
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// 음악 아이템 타입 정의
interface MusicItem {
  id: number;
  title: string;
  singer: string;
  musicDuration: string;
  thumbnail?: string;
}

// 전체 리스트 컴포넌트
const SwipeableList: React.FC = () => {
  const [musicList, setMusicList] = useState<MusicItem[]>([
    { 
      id: 1, 
      title: 'Love Story', 
      singer: 'Taylor Swift', 
      musicDuration: '3:55',
      thumbnail: '' 
    },
    { 
      id: 2, 
      title: 'Blinding Lights', 
      singer: 'The Weeknd', 
      musicDuration: '3:20',
      thumbnail: '' 
    },
    { 
      id: 3, 
      title: 'Dynamite', 
      singer: 'BTS', 
      musicDuration: '3:19',
      thumbnail: '' 
    },
  ]);

  const handleRequestDelete = (id: string | number): void => {
    setMusicList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h2 style={{ marginBottom: '20px' }}>내 음악 리스트</h2>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {musicList.map((music) => (
          <SwipeToDeleteListItem
            key={music.id}
            id={music.id}
            title={music.title}
            singer={music.singer}
            musicDuration={music.musicDuration}
            thumbnail={music.thumbnail}
            onRequestDelete={handleRequestDelete}
          />
        ))}
        
        {musicList.length === 0 && (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: '#999'
          }}>
            음악이 없습니다
          </div>
        )}
      </div>
    </div>
  );
};

export default SwipeableList;