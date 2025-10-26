// packages/motion/src/bottom-sheet.tsx
import React from 'react';

export interface Motion_BottomSheetProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export const Motion_BottomSheet: React.FC<Motion_BottomSheetProps> = ({ isOpen, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="bottom-sheet">
      {children}
    </div>
  );
};