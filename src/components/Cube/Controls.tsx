import React from "react";
import { useCubeStore } from "../../store/useCubeStore";
import type { Move } from "../../utils/cubeLogic";

type MoveGroup = {
  label: string;
  cols: number;
  moves: Move[];
};

const moveGroups: MoveGroup[] = [
  {
    label: "Faces",
    cols: 6,
    moves: [
      "U",
      "U'",
      "U2",
      "D",
      "D'",
      "D2",
      "R",
      "R'",
      "R2",
      "L",
      "L'",
      "L2",
      "F",
      "F'",
      "F2",
      "B",
      "B'",
      "B2",
    ],
  },
  {
    label: "Fatias",
    cols: 3,
    moves: ["M", "M'", "M2", "E", "E'", "E2", "S", "S'", "S2"],
  },
  {
    label: "Dupla camada",
    cols: 6,
    moves: [
      "u",
      "u'",
      "u2",
      "d",
      "d'",
      "d2",
      "r",
      "r'",
      "r2",
      "l",
      "l'",
      "l2",
      "f",
      "f'",
      "f2",
      "b",
      "b'",
      "b2",
    ],
  },
  {
    label: "Rotações",
    cols: 3,
    moves: ["X", "X'", "X2", "Y", "Y'", "Y2", "Z", "Z'", "Z2"],
  },
];

export const Controls: React.FC = () => {
  const { addMove, isAnimating } = useCubeStore();

  return (
    <div className="controls-panel">
      <h3>Controles</h3>
      {moveGroups.map((group) => (
        <div key={group.label} className="controls-section">
          <span className="controls-section-label">{group.label}</span>
          <div
            className="controls-grid"
            style={{ gridTemplateColumns: `repeat(${group.cols}, 1fr)` }}
          >
            {group.moves.map((move) => (
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
      ))}
    </div>
  );
};
