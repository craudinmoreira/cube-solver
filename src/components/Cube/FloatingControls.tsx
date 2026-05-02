import React from 'react';
import { Shuffle, RotateCcw } from 'lucide-react';
import { useCubeStore } from '../../store/useCubeStore';

export const FloatingControls: React.FC = () => {
  const { shuffle, reset, isAnimating, moveQueue, isResetting, history } = useCubeStore();

  const isBusy = isAnimating || moveQueue.length > 0 || isResetting;

  return (
    <div className="floating-controls">
      <button 
        className="floating-button" 
        onClick={shuffle} 
        disabled={isBusy}
        title="Embaralhar Aleatoriamente"
      >
        <Shuffle size={20} />
      </button>
      <button 
        className="floating-button" 
        onClick={reset} 
        disabled={isBusy || history.length === 0}
        title="Resetar Cubo"
      >
        <RotateCcw size={20} />
      </button>
    </div>
  );
};
