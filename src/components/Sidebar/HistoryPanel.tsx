import React, { useEffect, useRef } from "react";
import { useCubeStore } from "../../store/useCubeStore";
import { formatMove } from "../../utils/cubeLogic";
import { Box, History, Undo2, Redo2, Trash2 } from "lucide-react";

export const HistoryPanel: React.FC = () => {
  const { history, redoHistory, undo, redo, isAnimating, clearCubeColors } = useCubeStore();
  const listRef = useRef<HTMLUListElement>(null);

  // Mantém o movimento mais recente visível
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [history.length]);

  const isEmpty = history.length === 0 && redoHistory.length === 0;

  return (
    <section className="card history-panel">
      <div className="card-header">
        <h2 className="card-title">
          <History size={17} />
          Histórico
          {history.length > 0 && (
            <span className="count-badge">{history.length}</span>
          )}
        </h2>
        <div className="history-actions">
          <button
            onClick={clearCubeColors}
            disabled={history.length === 0 || isAnimating}
            aria-label="Limpar histórico e resetar cubo"
            title="Limpar histórico e resetar cubo"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={undo}
            disabled={history.length === 0 || isAnimating}
            aria-label="Desfazer"
            title="Desfazer"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={redo}
            disabled={redoHistory.length === 0 || isAnimating}
            aria-label="Refazer"
            title="Refazer"
          >
            <Redo2 size={16} />
          </button>
        </div>
      </div>

      {isEmpty ? (
        <div className="history-empty">
          <Box size={28} strokeWidth={1.5} />
          <strong>Nenhum movimento ainda</strong>
          Toque em um movimento ou execute uma sequência.
        </div>
      ) : (
        <ul className="history-list" ref={listRef}>
          {history.map((move, index) => (
            <li
              key={`h${index}`}
              className={`history-chip ${index === history.length - 1 ? "is-last" : ""}`}
            >
              <small>{index + 1}</small>
              {formatMove(move)}
            </li>
          ))}
          {/* Próximos a refazer, na ordem em que voltariam */}
          {[...redoHistory].reverse().map((move, index) => (
            <li key={`r${index}`} className="history-chip is-redo" title="Pode ser refeito">
              {formatMove(move)}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
