import React, { useState } from "react";
import { useCubeStore } from "../../store/useCubeStore";
import { formatMove, getMoveFaceColor, type Move } from "../../utils/cubeLogic";
import { Box, ChevronUp, ChevronDown } from "lucide-react";

const basicMoves: Move[] = ["U", "D", "R", "L", "F", "B"];
const basicInverses: Move[] = ["U'", "D'", "R'", "L'", "F'", "B'"];

const extendedMoves: { label: string; moves: Move[] }[] = [
  { label: "Duplos", moves: ["U2", "D2", "R2", "L2", "F2", "B2"] },
  { label: "Fatias", moves: ["M", "M'", "E", "E'", "S", "S'"] },
  { label: "Wide", moves: ["u", "u'", "r", "r'", "f", "f'"] },
  { label: "Rotação", moves: ["X", "X'", "Y", "Y'", "Z", "Z'"] },
];

interface ControlsProps {
  /** Versão do painel fixo embaixo, no mobile: sem cabeçalho. */
  compact?: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ compact = false }) => {
  const { addMove, isAnimating } = useCubeStore();
  const [expanded, setExpanded] = useState(false);
  const [activeGroup, setActiveGroup] = useState(0);

  const renderKey = (move: Move, isAlt: boolean) => (
    <button
      key={move}
      onClick={() => addMove(move)}
      disabled={isAnimating}
      className={`move-key ${isAlt ? "is-alt" : ""}`}
      style={{ "--fc": getMoveFaceColor(move) } as React.CSSProperties}
      aria-label={`Movimento ${formatMove(move)}`}
    >
      {formatMove(move)}
    </button>
  );

  return (
    <section className="card moves-card">
      {!compact && (
        <div className="card-header">
          <h3 className="card-title">
            <Box size={17} />
            Movimentos
          </h3>
          <span className="card-hint">horário · anti-horário</span>
        </div>
      )}

      <div className="moves-grid">
        {basicMoves.map((move) => renderKey(move, false))}
        {basicInverses.map((move) => renderKey(move, true))}
      </div>

      {expanded && (
        <div className="extended-moves">
          <div className="segmented" role="tablist" aria-label="Tipo de movimento">
            {extendedMoves.map((group, i) => (
              <button
                key={group.label}
                role="tab"
                aria-selected={activeGroup === i}
                className={activeGroup === i ? "is-active" : ""}
                onClick={() => setActiveGroup(i)}
              >
                {group.label}
              </button>
            ))}
          </div>
          <div className="moves-grid">
            {extendedMoves[activeGroup].moves.map((move) =>
              renderKey(move, move.length > 1),
            )}
          </div>
        </div>
      )}

      <button
        className="more-toggle"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        {expanded ? "Menos movimentos" : "Mais movimentos"}
        {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
    </section>
  );
};
