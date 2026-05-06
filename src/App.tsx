import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Layout } from './components/UI/Layout';
import { RubiksCube } from './components/Cube/RubiksCube';

const App: React.FC = () => {
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([5, 5, 5]);

  useEffect(() => {
    const handleResize = () => {
      // Zoom out on mobile portrait to prevent cube from being cut off
      if (window.innerWidth < 600 && window.innerHeight > window.innerWidth) {
        setCameraPosition([8.5, 8.5, 8.5]);
      } else {
        setCameraPosition([5, 5, 5]);
      }
    };

    // Set initial position
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Layout>
      <Canvas camera={{ position: cameraPosition, fov: 45 }}>
        <RubiksCube />
      </Canvas>
    </Layout>
  );
};

export default App;
