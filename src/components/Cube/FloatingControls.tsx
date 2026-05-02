import React from 'react';
import { Shuffle, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { useCubeStore } from '../../store/useCubeStore';

export const FloatingControls: React.FC = () => {
  const { shuffle, reset, isAnimating, moveQueue, isResetting, history, toggleFaceLabels, showFaceLabels } = useCubeStore();

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
      <button 
        className="floating-button" 
        onClick={toggleFaceLabels} 
        title={showFaceLabels ? "Ocultar Faces" : "Mostrar Faces"}
      >
        {showFaceLabels ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};
