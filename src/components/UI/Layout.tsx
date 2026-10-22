import React, { useEffect, useState } from "react";
import { Sun, Moon, Menu, History, X } from "lucide-react";
import { HistoryPanel } from "../Sidebar/HistoryPanel";
import { Controls } from "../Cube/Controls";
import { CubeStateInput } from "../Sidebar/CubeStateInput";
import { SolutionInput } from "../Sidebar/SolutionInput";
import { useThemeStore } from "../../store/useThemeStore";
import { useCubeStore } from "../../store/useCubeStore";
import { FloatingControls } from "../Cube/FloatingControls";
import { CubeStatus } from "../Cube/CubeStatus";
import { CUBE_COLOR_MAP } from "../../utils/cubeLogic";

// Mini cubo do logotipo: uma face embaralhada
const LOGO_STICKERS = ["W", "R", "G", "B", "Y", "O", "G", "W", "R"];

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme, toggleTheme } = useThemeStore();
  const historyCount = useCubeStore((state) => state.history.length);
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const closeDrawers = () => {
    setIsLeftMenuOpen(false);
    setIsHistoryOpen(false);
  };

  useEffect(() => {
    if (!isLeftMenuOpen && !isHistoryOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawers();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLeftMenuOpen, isHistoryOpen]);

  return (
    <div className="layout">
      <header className="header">
        <button
          className="icon-btn desktop-hide"
          onClick={() => setIsLeftMenuOpen((prev) => !prev)}
          aria-label="Abrir estado e sequência"
          title="Estado e sequência"
        >
          <Menu size={20} />
        </button>

        <h1 className="brand">
          <span className="brand-logo" aria-hidden="true">
            {LOGO_STICKERS.map((color, i) => (
              <i key={i} style={{ backgroundColor: CUBE_COLOR_MAP[color] }} />
            ))}
          </span>
          Virtual Cube <span className="brand-sub">Solver</span>
        </h1>

        <div className="header-actions">
          <button
            className="icon-btn desktop-hide"
            onClick={() => setIsHistoryOpen((prev) => !prev)}
            aria-label="Abrir histórico"
            title="Histórico"
          >
            <History size={20} />
            {historyCount > 0 && (
              <span className="icon-btn-badge">{historyCount}</span>
            )}
          </button>

          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? "Mudar para tema claro"
                : "Mudar para tema escuro"
            }
            title="Alternar tema"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <main className="main-content">
        {(isLeftMenuOpen || isHistoryOpen) && (
          <div className="overlay-backdrop" onClick={closeDrawers} />
        )}

        <aside className={`drawer left-drawer ${isLeftMenuOpen ? "open" : ""}`}>
          <div className="drawer-header desktop-hide">
            Entrada
            <button className="icon-btn" onClick={closeDrawers} aria-label="Fechar">
              <X size={18} />
            </button>
          </div>
          <CubeStateInput />
          <SolutionInput />
        </aside>

        <section className="cube-container">
          {children}
          <CubeStatus />
          <FloatingControls />
        </section>

        <aside className={`drawer right-drawer ${isHistoryOpen ? "open" : ""}`}>
          {/* O título já está no cartão do histórico */}
          <div className="drawer-header is-end desktop-hide">
            <button className="icon-btn" onClick={closeDrawers} aria-label="Fechar">
              <X size={18} />
            </button>
          </div>
          <div className="desktop-only">
            <Controls />
          </div>
          <HistoryPanel />
        </aside>
      </main>

      <footer className="bottom-controls">
        <Controls compact />
      </footer>
    </div>
  );
};
