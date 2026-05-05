import React from "react";
import { Shuffle, RotateCcw, Eye, EyeOff, Gauge } from "lucide-react";
import { useCubeStore } from "../../store/useCubeStore";
import { useAnimationSpeed } from "../../store/useAnimationSpeed";

export const FloatingControls: React.FC = () => {
  const {
    shuffle,
    reset,
    isAnimating,
    moveQueue,
    isResetting,
    history,
    toggleFaceLabels,
    showFaceLabels,
  } = useCubeStore();
  const { speed, setSpeed } = useAnimationSpeed();

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

      {/* Controle de velocidade */}
      <div className="floating-speed" title="Velocidade da animação">
        <Gauge size={16} className="speed-icon" />
        <input
          type="range"
          min={0.5}
          max={20}
          step={0.5}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="speed-slider"
          title={`Velocidade: ${speed}×`}
        />
        <span className="speed-label">{speed}×</span>
      </div>
    </div>
  );
};
