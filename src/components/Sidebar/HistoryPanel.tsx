import React from 'react';
import { useCubeStore } from '../../store/useCubeStore';
import { Undo2 } from 'lucide-react';

export const HistoryPanel: React.FC = () => {
  const { history, undo, isAnimating } = useCubeStore();

  return (
    <aside className="history-panel">
      <div className="history-header">
        <h2>Histórico</h2>
        <button 
          onClick={undo} 
          disabled={history.length === 0 || isAnimating}
          className="undo-button"
          title="Desfazer"
        >
          <Undo2 size={20} />
          Desfazer
        </button>
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
