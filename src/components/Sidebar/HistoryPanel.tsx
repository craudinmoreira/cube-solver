import React from "react";
import { useCubeStore } from "../../store/useCubeStore";
import { Undo2, Redo2, Trash2 } from "lucide-react";

export const HistoryPanel: React.FC = () => {
  const { history, redoHistory, undo, redo, isAnimating, clearCubeColors } = useCubeStore();

  return (
    <aside className="history-panel">
      <div className="history-header">
        <h2>
          Histórico
          {history.length > 0 && (
            <span className="history-count">{history.length}</span>
          )}
        </h2>
        <div className="history-actions">
          <button
            onClick={clearCubeColors}
            disabled={history.length === 0 || isAnimating}
            className="clear-history-button"
            title="Limpar histórico e resetar cubo"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={undo}
            disabled={history.length === 0 || isAnimating}
            className="undo-button"
            title="Desfazer"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={redo}
            disabled={redoHistory.length === 0 || isAnimating}
            className="redo-button"
            title="Refazer"
          >
            <Redo2 size={16} />
          </button>
        </div>
      </div>

      <div className="history-list">
        {history.length === 0 ? (
          <p className="empty-text">Nenhum movimento realizado.</p>
        ) : (
          <ul>
            {history.map((move, index) => (
              <li key={index} className="history-item">
                <span className="move-number">{index + 1}.</span>
                <span className="move-name">{move}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};
