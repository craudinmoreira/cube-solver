import React, { useState, useMemo } from "react";
import { ListOrdered, Play } from "lucide-react";
import { useCubeStore } from "../../store/useCubeStore";
import { formatMove, parseSolutionString } from "../../utils/cubeLogic";

export const SolutionInput: React.FC = () => {
  const { executeSequence, isAnimating, moveQueue, isResetting, currentMove } =
    useCubeStore();
  const [input, setInput] = useState("");

  const isBusy = isAnimating || moveQueue.length > 0 || isResetting;

  // Deriva moves e error de forma reativa ao input
  const { moves, error } = useMemo(() => parseSolutionString(input), [input]);

  const isValid = input.trim().length > 0 && moves.length > 0 && error === null;

  // Índice do movimento em execução, quando a fila atual é desta sequência
  // (fila = final da sequência e o movimento animado é o anterior a ela).
  const currentIndex = useMemo(() => {
    if (!isAnimating || isResetting || !currentMove || !isValid) return -1;
    const index = moves.length - moveQueue.length - 1;
    if (index < 0 || moves[index] !== currentMove) return -1;
    const isTail = moveQueue.every((m, i) => m === moves[index + 1 + i]);
    return isTail ? index : -1;
  }, [isAnimating, isResetting, currentMove, moveQueue, moves, isValid]);

  const handleExecute = () => {
    if (!isValid || isBusy) return;
    executeSequence(moves);
  };

  return (
    <section className="card">
      <div className="card-header">
        <h3 className="card-title">
          <ListOrdered size={17} />
          Sequência
        </h3>
        {isValid && <span className="count-badge">{moves.length}</span>}
      </div>

      <p className="card-hint">
        Separe por espaço. Use <strong>i</strong> como inverso: <code>Ri</code> ={" "}
        <code>R′</code>.
      </p>

      <div className="field">
        <textarea
          id="solution-input"
          className={`textarea ${error && input.trim() ? "is-error" : ""} ${isValid ? "is-ok" : ""}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ex: R U Ri Ui Ri F R2 Ui…"
          rows={3}
          spellCheck={false}
          disabled={isBusy}
          aria-label="Sequência de movimentos"
        />
      </div>

      {error && input.trim() && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}

      {/* Prévia dos movimentos, acompanhando a execução */}
      {isValid && (
        <div className="sequence-tokens">
          {moves.map((m, i) => (
            <span
              key={i}
              className={`sequence-token ${currentIndex >= 0 && i < currentIndex ? "is-done" : ""} ${i === currentIndex ? "is-current" : ""}`}
            >
              {formatMove(m)}
            </span>
          ))}
        </div>
      )}

      <div className="btn-row">
        <button
          className="btn btn-primary"
          onClick={handleExecute}
          disabled={!isValid || isBusy}
          title={
            isBusy
              ? "Aguarde o cubo terminar de se mover"
              : isValid
                ? `Executar ${moves.length} movimentos`
                : "Insira uma sequência válida"
          }
        >
          <Play size={15} />
          <span>
            {currentIndex >= 0
              ? `Executando (${moves.length - currentIndex})`
              : "Executar"}
          </span>
        </button>
        <button
          className="btn"
          onClick={() => setInput("")}
          title="Limpar campo"
          disabled={isBusy}
        >
          Limpar
        </button>
      </div>
    </section>
  );
};
