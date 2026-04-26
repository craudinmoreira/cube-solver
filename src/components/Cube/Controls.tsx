import React from 'react';
import { useCubeStore } from '../../store/useCubeStore';
import type { Move } from '../../utils/cubeLogic';

export const Controls: React.FC = () => {
  const { addMove, isAnimating } = useCubeStore();

  const moves: Move[] = ['U', "U'", 'D', "D'", 'R', "R'", 'L', "L'", 'F', "F'", 'B', "B'"];

  return (
    <div className="controls-panel">
      <h3>Controles</h3>
      <div className="controls-grid">
        {moves.map((move) => (
          <button
            key={move}
            onClick={() => addMove(move)}
            disabled={isAnimating}
            className="control-button"
          >
            {move}
          </button>
        ))}
      </div>
    </div>
  );
};
