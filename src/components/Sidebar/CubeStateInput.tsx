import React, { useState } from "react";
import { useCubeStore } from "../../store/useCubeStore";
import { validateCubeStateString, CUBE_COLOR_MAP } from "../../utils/cubeLogic";

// Legenda de cores para guiar o usuário
const COLOR_LEGEND = [
  { char: "W", label: "Branco", hex: CUBE_COLOR_MAP["W"] },
  { char: "Y", label: "Amarelo", hex: CUBE_COLOR_MAP["Y"] },
  { char: "R", label: "Vermelho", hex: CUBE_COLOR_MAP["R"] },
  { char: "O", label: "Laranja", hex: CUBE_COLOR_MAP["O"] },
  { char: "G", label: "Verde", hex: CUBE_COLOR_MAP["G"] },
  { char: "B", label: "Azul", hex: CUBE_COLOR_MAP["B"] },
];

export const CubeStateInput: React.FC = () => {
  const { applyCubeState, clearCubeColors } = useCubeStore();
  const [input, setInput] = useState("");

  // Normaliza para maiúsculas e remove espaços
  const normalized = input.trim().toUpperCase().replace(/\s/g, "");
  const error =
    normalized.length > 0 ? validateCubeStateString(normalized) : null;
  const isValid = normalized.length === 54 && error === null;

  const handleApply = () => {
    if (!isValid) return;
    applyCubeState(normalized);
  };

  const handleClear = () => {
    setInput("");
    clearCubeColors();
  };

  // Colorize cada char do input com a cor correspondente
  const renderColorizedInput = () => {
    if (!normalized) return null;
    return (
      <div className="cube-state-preview">
        {normalized.split("").map((ch, i) => (
          <span
            key={i}
            className="cube-state-char"
            style={{
              backgroundColor: CUBE_COLOR_MAP[ch] ?? "transparent",
              color: ch === "W" ? "#333" : "#1a1a1a",
            }}
          >
            {ch}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="state-input-panel">
      <h3>Estado do Cubo</h3>

      <p className="state-input-hint">
        Insira os 54 caracteres representando cada face do cubo na ordem:
        <br />
        <strong>U (9) · L F R B (36) · D (9)</strong>
      </p>

      {/* Legenda de cores */}
      <div className="color-legend">
        {COLOR_LEGEND.map(({ char, label, hex }) => (
          <span key={char} className="color-legend-item">
            <span
              className="color-legend-dot"
              style={{
                backgroundColor: hex,
                border: char === "W" ? "1px solid #aaa" : "none",
              }}
            />
            <span className="color-legend-text">
              {char} = {label}
            </span>
          </span>
        ))}
      </div>

      <textarea
        className={`state-input-textarea ${error && normalized.length > 0 ? "state-input-error" : ""} ${isValid ? "state-input-ok" : ""}`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ex: OOOOOOOOOYYYWWWGGGBBB..."
        rows={4}
        spellCheck={false}
      />

      {/* Contador de caracteres */}
      <div className="state-input-counter">
        <span
          className={
            normalized.length === 54 ? "counter-ok" : "counter-neutral"
          }
        >
          {normalized.length}/54 caracteres
        </span>
      </div>

      {/* Mensagem de erro */}
      {error && normalized.length > 0 && (
        <p className="state-input-error-msg">{error}</p>
      )}

      {/* Preview colorido */}
      {normalized.length > 0 && renderColorizedInput()}

      {/* Botões */}
      <div className="state-input-buttons">
        <button
          className="state-apply-button"
          onClick={handleApply}
          disabled={!isValid}
          title={
            isValid
              ? "Aplicar cores ao cubo"
              : "Corrija os erros antes de aplicar"
          }
        >
          Aplicar Cores
        </button>
        <button
          className="state-clear-button"
          onClick={handleClear}
          title="Limpar input e restaurar cores padrão"
        >
          Resetar
        </button>
      </div>
    </div>
  );
};
