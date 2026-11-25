import React, { Suspense, lazy } from 'react';
import { Layout } from './components/UI/Layout';

// O Three.js é a maior parte do bundle: vai num chunk separado, carregado
// em paralelo enquanto a interface já aparece.
const Scene = lazy(() => import('./components/Cube/Scene'));

const App: React.FC = () => (
  <Layout>
    <Suspense fallback={<div className="scene-loading" role="status">Carregando cubo…</div>}>
      <Scene />
    </Suspense>
  </Layout>
);

export default App;
