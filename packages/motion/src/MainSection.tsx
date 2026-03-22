// type import 없이 전부 그냥 import
import { motion } from 'framer-motion';
//import type { Variants } from 'framer-motion';



const innerVariants: any = {
  initial: (dir: number) => ({ y: dir > 0 ? '40px' : '-40px', opacity: 0.3 }),
  animate: { y: 0, opacity: 1, transition: { duration: 1.6, ease: [0.4, 0, 0.2, 1] } },
  exit: (dir: number) => ({ y: dir > 0 ? '-40px' : '40px', opacity: 0 }),
};

const MainSection = ({
  direction,
  sect1CompoVariants,
  sect1CompoItemVariants,
  onUnlock,
}: {
  direction: number;
  sect1CompoVariants: any
  sect1CompoItemVariants: any;
  onUnlock: () => void;
}) => {
  return (
    <motion.div
      animate="animate"
      initial="initial"
      exit="exit"
      custom={direction}
      variants={innerVariants}
      style={{
        width: '100%',
        maxWidth: '1600px',
        maxHeight: '860px',
        height: 'calc(100dvh - clamp(60px, 16.17vw, 80px) - clamp(60px, 16.17vw, 80px))',
        position: 'absolute',
        left: 0, right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 clamp(24px, 8.33vw, 160px)',
        boxSizing: 'border-box',
      }}
      onAnimationComplete={definition => {
        console.log('%c[MainSection] onAnimationComplete:', 'color: #f472b6', definition);
        if (definition === 'animate') {
          console.log('%c[MainSection] → onUnlock 호출', 'color: #4ade80');
          onUnlock();
        }
      }}
    >
      <motion.div
        custom={direction}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={sect1CompoVariants}
        style={{ display: 'flex', gap: 'clamp(12px, 1.04vw, 20px)', width: '100%', maxWidth: 1600, height: '100%', maxHeight: 860 }}
      >
        {/* 메인 카드 (큰 카드) */}
        <motion.div
          custom={direction}
          variants={sect1CompoItemVariants}
          style={{ flex: '0 1 auto', minWidth: 'clamp(400px, 26vw, 500px)', height: '100%', borderRadius: 'clamp(20px, 1.67vw, 32px)', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span style={{ color: '#999', fontSize: 20, fontWeight: 600 }}>메인 카드</span>
        </motion.div>

        {/* 사이드 카드들 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 1.04vw, 20px)', width: 'clamp(280px, 22.2vw, 426px)', flexShrink: 0, height: '100%' }}>
          <motion.div
            custom={direction}
            variants={sect1CompoItemVariants}
            style={{ flex: 1, borderRadius: 'clamp(20px, 1.67vw, 32px)', background: '#c8d8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <span style={{ color: '#4982bf', fontSize: 16, fontWeight: 600 }}>인재영입 카드</span>
          </motion.div>

          <motion.div
            custom={direction}
            variants={sect1CompoItemVariants}
            style={{ flex: 1, borderRadius: 'clamp(20px, 1.67vw, 32px)', background: '#0114a7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <span style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>QR 카드</span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MainSection;
