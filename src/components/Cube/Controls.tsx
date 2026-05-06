import React, { useState } from "react";
import { useCubeStore } from "../../store/useCubeStore";
import type { Move } from "../../utils/cubeLogic";
import { ChevronUp, ChevronDown } from "lucide-react";

export const Controls: React.FC = () => {
  const { addMove, isAnimating } = useCubeStore();
  const [expanded, setExpanded] = useState(false);

  const basicMoves: Move[] = ["U", "D", "R", "L", "F", "B"];
  const basicInverses: Move[] = ["U'", "D'", "R'", "L'", "F'", "B'"];
  
  const extendedMoves: { label: string; moves: Move[] }[] = [
    { label: "Múltiplos", moves: ["U2", "D2", "R2", "L2", "F2", "B2"] },
    { label: "Fatias", moves: ["M", "M'", "E", "E'", "S", "S'"] },
    { label: "Dupla", moves: ["u", "u'", "r", "r'", "f", "f'"] },
    { label: "Rotação", moves: ["X", "X'", "Y", "Y'", "Z", "Z'"] },
  ];

  return (
    <div className={`bottom-controls-panel ${expanded ? 'expanded' : ''}`}>
      <div className="basic-controls">
        <div className="controls-row">
          {basicMoves.map((move) => (
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
        <div className="controls-row">
          {basicInverses.map((move) => (
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
      
      {expanded && (
        <div className="extended-controls">
          {extendedMoves.map((group) => (
            <div key={group.label} className="extended-group">
              <span className="controls-section-label">{group.label}</span>
              <div className="controls-row small">
                {group.moves.map((move) => (
                  <button
                    key={move}
                    onClick={() => addMove(move)}
                    disabled={isAnimating}
                    className="control-button small-btn"
                  >
                    {move}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button 
        className="expand-controls-btn" 
        onClick={() => setExpanded(!expanded)}
        title={expanded ? "Ocultar extras" : "Mostrar mais controles"}
      >
        {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>
    </div>
  );
};
