import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RotateCcw, RotateCw } from 'lucide-react';

interface ViewCubeArrowsProps {
  onRotate: (axis: 'x' | 'y' | 'z', direction: 1 | -1) => void;
}

export const ViewCubeArrows: React.FC<ViewCubeArrowsProps> = ({ onRotate }) => {
  return (
    <div className="viewcube-arrows">
      <button
        className="viewcube-btn up"
        onClick={() => onRotate('x', 1)}
        aria-label="Girar visão para cima"
        title="Girar visão para cima"
      >
        <ChevronUp size={16} />
      </button>

      <button
        className="viewcube-btn down"
        onClick={() => onRotate('x', -1)}
        aria-label="Girar visão para baixo"
        title="Girar visão para baixo"
      >
        <ChevronDown size={16} />
      </button>

      <button
        className="viewcube-btn left"
        onClick={() => onRotate('y', -1)}
        aria-label="Girar visão para a esquerda"
        title="Girar visão para a esquerda"
      >
        <ChevronLeft size={16} />
      </button>

      <button
        className="viewcube-btn right"
        onClick={() => onRotate('y', 1)}
        aria-label="Girar visão para a direita"
        title="Girar visão para a direita"
      >
        <ChevronRight size={16} />
      </button>

      {/* Setas curvas para rolagem */}
      <button
        className="viewcube-btn is-round roll-right"
        onClick={() => onRotate('z', -1)}
        aria-label="Rolar visão no sentido horário"
        title="Rolar visão no sentido horário"
      >
        <RotateCw size={14} />
      </button>

      <button
        className="viewcube-btn is-round roll-left"
        onClick={() => onRotate('z', 1)}
        aria-label="Rolar visão no sentido anti-horário"
        title="Rolar visão no sentido anti-horário"
      >
        <RotateCcw size={14} />
      </button>
    </div>
  );
};
