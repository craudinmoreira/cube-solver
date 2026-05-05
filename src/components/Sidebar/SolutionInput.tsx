import React, { useState, useMemo } from "react";
import { Play } from "lucide-react";
import { useCubeStore } from "../../store/useCubeStore";
import { parseSolutionString } from "../../utils/cubeLogic";

export const SolutionInput: React.FC = () => {
  const { executeSequence, isAnimating, moveQueue, isResetting } =
    useCubeStore();
  const [input, setInput] = useState("");

  const isBusy = isAnimating || moveQueue.length > 0 || isResetting;

  // Deriva moves e error de forma reativa ao input
  const { moves, error } = useMemo(() => parseSolutionString(input), [input]);

  const isValid = input.trim().length > 0 && moves.length > 0 && error === null;

  const handleExecute = () => {
    if (!isValid || isBusy) return;
    executeSequence(moves);
  };

  return (
    <div className="state-input-panel solution-input-panel">
      <h3>Solução</h3>

      <p className="state-input-hint">
        Cole a sequência de movimentos separados por espaço.
        <br />
        Use <strong>i</strong> como inverso: <code>Ri</code> = <code>R'</code>,{" "}
        <code>Xi</code> = <code>X'</code>.
      </p>

      <textarea
        className={`state-input-textarea${error && input.trim() ? " state-input-error" : ""}${isValid ? " state-input-ok" : ""}`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ex: R U Ri Fi R U Ri Ui Ri Fi R2 Ui Ri..."
        rows={5}
        spellCheck={false}
        disabled={isBusy}
      />

      {/* Contador de movimentos */}
      {input.trim().length > 0 && !error && (
        <div className="state-input-counter">
          <span className={moves.length > 0 ? "counter-ok" : "counter-neutral"}>
            {moves.length} movimento{moves.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Erro de parsing */}
      {error && input.trim() && (
        <p className="state-input-error-msg">{error}</p>
      )}

      {/* Preview dos tokens parseados */}
      {isValid && (
        <div className="solution-preview">
          {moves.map((m, i) => (
            <span key={i} className="solution-token">
              {m}
            </span>
          ))}
        </div>
      )}

      {/* Botão executar */}
      <div className="state-input-buttons">
        <button
          className="state-apply-button solution-execute-button"
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
          {isBusy && moveQueue.length > 0
            ? `Executando… (${moveQueue.length} restantes)`
            : "Executar"}
        </button>
        <button
          className="state-clear-button"
          onClick={() => setInput("")}
          title="Limpar campo"
          disabled={isBusy}
        >
          Limpar
        </button>
      </div>
    </div>
  );
};
