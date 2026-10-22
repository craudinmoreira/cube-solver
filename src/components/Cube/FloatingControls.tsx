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
        aria-label="Embaralhar aleatoriamente"
        title="Embaralhar aleatoriamente"
      >
        <Shuffle size={19} />
      </button>
      <button
        className="floating-button"
        onClick={reset}
        disabled={isBusy || history.length === 0}
        aria-label="Resetar cubo"
        title="Resetar cubo"
      >
        <RotateCcw size={19} />
      </button>
      <button
        className={`floating-button ${showFaceLabels ? "is-active" : ""}`}
        onClick={toggleFaceLabels}
        aria-pressed={showFaceLabels}
        aria-label={showFaceLabels ? "Ocultar letras das faces" : "Mostrar letras das faces"}
        title={showFaceLabels ? "Ocultar letras das faces" : "Mostrar letras das faces"}
      >
        {showFaceLabels ? <EyeOff size={19} /> : <Eye size={19} />}
      </button>

      <span className="floating-divider" />

      {/* Controle de velocidade */}
      <label className="floating-speed" title="Velocidade da animação">
        <Gauge size={16} aria-hidden="true" />
        <input
          type="range"
          min={0.5}
          max={20}
          step={0.5}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="speed-slider"
          aria-label="Velocidade da animação"
        />
        <span className="speed-label">{speed}×</span>
      </label>
    </div>
  );
};
