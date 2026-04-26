import React from 'react';
import { HistoryPanel } from '../Sidebar/HistoryPanel';
import { Controls } from '../Cube/Controls';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="layout">
      <header className="header">
        <h1>Cubo Mágico 3D</h1>
      </header>
      
      <main className="main-content">
        <section className="cube-container">
          {children}
        </section>
        
        <aside className="sidebar">
          <Controls />
          <HistoryPanel />
        </aside>
      </main>
    </div>
  );
};
