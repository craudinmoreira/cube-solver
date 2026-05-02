import React, { useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { HistoryPanel } from "../Sidebar/HistoryPanel";
import { Controls } from "../Cube/Controls";
import { useThemeStore } from "../../store/useThemeStore";
import { FloatingControls } from "../Cube/FloatingControls";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="layout">
      <header className="header">
        <h1>Virtual Cube Solver</h1>
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
      </header>

      <main className="main-content">
        <section className="cube-container">
          {children}
          <FloatingControls />
        </section>

        <aside className="sidebar">
          <Controls />
          <HistoryPanel />
        </aside>
      </main>
    </div>
  );
};
