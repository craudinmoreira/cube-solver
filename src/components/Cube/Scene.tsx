import React, { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { RubiksCube } from "./RubiksCube";

// Distância da câmera ao centro: mais longe em celular em retrato (pela janela,
// não pelo canvas, que no desktop também é alto), para o cubo não ser cortado.
// 12 é o maxDistance do TrackballControls.
const DEFAULT_DISTANCE = Math.hypot(5, 5, 5);
const PORTRAIT_DISTANCE = 12;

/** Ajusta a distância da câmera a cada resize, mantendo a direção atual. */
const ResponsiveCamera: React.FC = () => {
  const camera = useThree((s) => s.camera);
  const invalidate = useThree((s) => s.invalidate);
  // O size do canvas muda junto com a janela: serve de gatilho do efeito.
  const { width, height } = useThree((s) => s.size);

  useEffect(() => {
    const portrait = window.innerWidth < 600 && window.innerHeight > window.innerWidth;
    camera.position.setLength(portrait ? PORTRAIT_DISTANCE : DEFAULT_DISTANCE);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, invalidate, width, height]);

  return null;
};

/** Cena 3D: carregada sob demanda para o resto da interface aparecer antes do Three.js. */
const Scene: React.FC = () => (
  <Canvas camera={{ position: [5, 5, 5], fov: 45 }}>
    <ResponsiveCamera />
    <RubiksCube />
  </Canvas>
);

export default Scene;
