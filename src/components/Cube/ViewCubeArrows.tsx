import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RotateCcw, RotateCw } from 'lucide-react';

interface ViewCubeArrowsProps {
  onRotate: (axis: 'x' | 'y' | 'z', direction: 1 | -1) => void;
}

export const ViewCubeArrows: React.FC<ViewCubeArrowsProps> = ({ onRotate }) => {

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '100px',
        height: '100px',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      <button
        style={{ ...baseBtnStyle, top: '-20px', left: '50%', transform: 'translateX(-50%)' }}
        onClick={() => onRotate('x', 1)}
        title="Rotate Up"
      >
        <ChevronUp size={16} />
      </button>
      
      <button
        style={{ ...baseBtnStyle, bottom: '-20px', left: '50%', transform: 'translateX(-50%)' }}
        onClick={() => onRotate('x', -1)}
        title="Rotate Down"
      >
        <ChevronDown size={16} />
      </button>
      
      <button
        style={{ ...baseBtnStyle, top: '50%', left: '-20px', transform: 'translateY(-50%)' }}
        onClick={() => onRotate('y', -1)}
        title="Rotate Left"
      >
        <ChevronLeft size={16} />
      </button>
      
      <button
        style={{ ...baseBtnStyle, top: '50%', right: '-20px', transform: 'translateY(-50%)' }}
        onClick={() => onRotate('y', 1)}
        title="Rotate Right"
      >
        <ChevronRight size={16} />
      </button>
      
      {/* Curved arrows for roll */}
      <button
        style={{ ...baseBtnStyle, top: '-15px', right: '-15px', borderRadius: '50%' }}
        onClick={() => onRotate('z', -1)}
        title="Roll Right"
      >
        <RotateCw size={14} />
      </button>

      <button
        style={{ ...baseBtnStyle, top: '-15px', left: '-15px', borderRadius: '50%' }}
        onClick={() => onRotate('z', 1)}
        title="Roll Left"
      >
        <RotateCcw size={14} />
      </button>
    </div>
  );
};

const baseBtnStyle: React.CSSProperties = {
  position: 'absolute',
  pointerEvents: 'auto',
  background: 'rgba(255, 255, 255, 0.9)',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  borderRadius: '6px',
  width: '26px',
  height: '26px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  color: '#333',
  boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
  transition: 'background 0.2s, transform 0.1s',
};
