import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Fontes servidas pelo próprio app (sem Google Fonts): sem vazamento de IP para
// terceiros e CSP restrita a 'self'. Só o subset latin, que cobre o pt-BR.
import '@fontsource/outfit/latin-400.css';
import '@fontsource/outfit/latin-500.css';
import '@fontsource/outfit/latin-600.css';
import '@fontsource/outfit/latin-700.css';
import '@fontsource/jetbrains-mono/latin-500.css';
import '@fontsource/jetbrains-mono/latin-700.css';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
