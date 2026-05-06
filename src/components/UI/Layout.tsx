import React, { useEffect, useState } from "react";
import { Sun, Moon, Menu, History } from "lucide-react";
import { HistoryPanel } from "../Sidebar/HistoryPanel";
import { Controls } from "../Cube/Controls";
import { CubeStateInput } from "../Sidebar/CubeStateInput";
import { SolutionInput } from "../Sidebar/SolutionInput";
import { useThemeStore } from "../../store/useThemeStore";
import { FloatingControls } from "../Cube/FloatingControls";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme, toggleTheme } = useThemeStore();
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="layout">
      <header className="header">
        <button 
          className="header-icon-btn desktop-hide" 
          onClick={() => setIsLeftMenuOpen(prev => !prev)}
          title="Menu"
        >
          <Menu size={24} />
        </button>

        <h1>Virtual Cube Solver</h1>
        
        <div className="header-actions">
          <button 
            className="header-icon-btn desktop-hide" 
            onClick={() => setIsHistoryOpen(prev => !prev)}
            title="Histórico"
          >
            <History size={22} />
          </button>

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={
              theme === "dark"
                ? "Mudar para tema claro"
                : "Mudar para tema escuro"
            }
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <main className="main-content">
        {/* Backdrop for overlays */}
        {(isLeftMenuOpen || isHistoryOpen) && (
          <div 
            className="overlay-backdrop" 
            onClick={() => {
              setIsLeftMenuOpen(false);
              setIsHistoryOpen(false);
            }}
          />
        )}

        <aside className={`drawer left-drawer ${isLeftMenuOpen ? 'open' : ''}`}>
          <CubeStateInput />
          <SolutionInput />
        </aside>

        <section className="cube-container">
          {children}
          <FloatingControls />
        </section>

        <aside className={`drawer right-drawer ${isHistoryOpen ? 'open' : ''}`}>
          <div className="desktop-controls-wrapper">
            <Controls />
          </div>
          <HistoryPanel />
        </aside>
      </main>

      <footer className="bottom-controls">
        <Controls />
      </footer>
    </div>
  );
};
