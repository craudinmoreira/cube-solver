import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Layout } from './components/UI/Layout';
import { RubiksCube } from './components/Cube/RubiksCube';

const App: React.FC = () => {
  return (
    <Layout>
      <Canvas camera={{ position: [5, 5, 5], fov: 45 }}>
        <RubiksCube />
      </Canvas>
    </Layout>
  );
};

export default App;
