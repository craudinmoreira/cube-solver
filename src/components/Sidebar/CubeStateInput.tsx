import React, { useState } from "react";
import { Grid3x3 } from "lucide-react";
import { useCubeStore } from "../../store/useCubeStore";
import { validateCubeStateString, CUBE_COLOR_MAP } from "../../utils/cubeLogic";

// Legenda de cores para guiar o usuário
const COLOR_LEGEND = [
  { char: "W", label: "Branco" },
  { char: "Y", label: "Amarelo" },
  { char: "R", label: "Vermelho" },
  { char: "O", label: "Laranja" },
  { char: "G", label: "Verde" },
  { char: "B", label: "Azul" },
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

  return (
    <section className="card">
      <div className="card-header">
        <h3 className="card-title">
          <Grid3x3 size={17} />
          Estado do cubo
        </h3>
      </div>

      <p className="card-hint">
        54 cores na ordem <strong>U (9) · L F R B (36) · D (9)</strong>.
      </p>

      <div className="color-legend">
        {COLOR_LEGEND.map(({ char, label }) => (
          <span key={char} className="color-legend-item">
            <span
              className="color-legend-dot"
              style={{ backgroundColor: CUBE_COLOR_MAP[char] }}
            />
            <b>{char}</b>
            {label}
          </span>
        ))}
      </div>

      <div className="field">
        <textarea
          id="cube-state-input"
          className={`textarea ${error ? "is-error" : ""} ${isValid ? "is-ok" : ""}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ex: WWWWWWWWWOOOGGGRRRBBB…"
          rows={3}
          spellCheck={false}
          aria-label="Estado do cubo, 54 caracteres"
        />
        <span className={`field-counter ${normalized.length === 54 ? "is-ok" : ""}`}>
          {normalized.length}/54
        </span>
      </div>

      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}

      {/* Prévia colorida, um quadrado por caractere */}
      {normalized.length > 0 && (
        <div className="state-preview" aria-hidden="true">
          {normalized.split("").map((ch, i) => (
            <i
              key={i}
              className={CUBE_COLOR_MAP[ch] ? "" : "is-invalid"}
              style={{ backgroundColor: CUBE_COLOR_MAP[ch] ?? "transparent" }}
            />
          ))}
        </div>
      )}

      <div className="btn-row">
        <button
          className="btn btn-primary"
          onClick={handleApply}
          disabled={!isValid}
          title={isValid ? "Aplicar cores ao cubo" : "Corrija os erros antes de aplicar"}
        >
          Aplicar cores
        </button>
        <button
          className="btn"
          onClick={handleClear}
          title="Limpar input e restaurar cores padrão"
        >
          Resetar
        </button>
      </div>
    </section>
  );
};
