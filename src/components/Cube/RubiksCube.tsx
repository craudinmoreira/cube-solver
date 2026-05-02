import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { useCubeStore } from "../../store/useCubeStore";
import { Cubie } from "./Cubie";
import { moveDetails } from "../../utils/cubeLogic";

export const RubiksCube: React.FC = () => {
  const { cubies, isAnimating, currentMove, finishAnimation, showFaceLabels } = useCubeStore();
  const animatingGroupRef = useRef<THREE.Group>(null);

  // Controle de progresso da animação (de 0 a 1)
  const [animProgress, setAnimProgress] = useState(0);

  useFrame((_, delta) => {
    if (isAnimating && currentMove && animatingGroupRef.current) {
      const speed = 4.0; // Velocidade da animação (ajustável)
      const nextProgress = Math.min(animProgress + delta * speed, 1);

      const { axis, angle } = moveDetails[currentMove];

      // Reseta a rotação do grupo para evitar soma contínua antes de setar o valor final
      animatingGroupRef.current.rotation.set(0, 0, 0);

      if (axis === "x")
        animatingGroupRef.current.rotation.x = angle * nextProgress;
      if (axis === "y")
        animatingGroupRef.current.rotation.y = angle * nextProgress;
      if (axis === "z")
        animatingGroupRef.current.rotation.z = angle * nextProgress;

      setAnimProgress(nextProgress);

      if (nextProgress >= 1) {
        // Animação terminou
        setAnimProgress(0);
        animatingGroupRef.current.rotation.set(0, 0, 0);
        finishAnimation();
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-4, 3, -5]} intensity={0.6} />
      <pointLight position={[0, 6, 4]} intensity={0.8} color="#ffffff" />
      <pointLight position={[4, -4, 4]} intensity={0.4} color="#e0f0ff" />

      <group>
        {cubies.map((cubie) => {
          let isPart = false;
          if (isAnimating && currentMove) {
            const { axis, layer } = moveDetails[currentMove];
            const posIndex = axis === "x" ? 0 : axis === "y" ? 1 : 2;
            isPart = Math.round(cubie.position[posIndex]) === layer;
          }

          // Se a peça faz parte da camada que está girando, não a renderizamos solta,
          // renderizamos ela como filha do Animating Group abaixo.
          if (isPart) return null;

          return (
            <Cubie
              key={cubie.id}
              cubieState={cubie}
              isAnimating={isAnimating}
              isPartOAnimatingLayer={false}
              animatingGroupRef={animatingGroupRef}
            />
          );
        })}

        {/* Grupo que sofre a rotação animada */}
        <group ref={animatingGroupRef}>
          {isAnimating &&
            currentMove &&
            cubies.map((cubie) => {
              const { axis, layer } = moveDetails[currentMove];
              const posIndex = axis === "x" ? 0 : axis === "y" ? 1 : 2;
              const isPart = Math.round(cubie.position[posIndex]) === layer;

              if (!isPart) return null;

              return (
                <Cubie
                  key={cubie.id}
                  cubieState={cubie}
                  isAnimating={true}
                  isPartOAnimatingLayer={true}
                  animatingGroupRef={animatingGroupRef}
                />
              );
            })}
        </group>
      </group>

      {showFaceLabels && (
        <group>
          <Html position={[0, 2.2, 0]} center transform rotation={[-Math.PI / 2, 0, 0]} occlude>
            <div className="face-label">U</div>
          </Html>
          <Html position={[0, -2.2, 0]} center transform rotation={[Math.PI / 2, 0, 0]} occlude>
            <div className="face-label">D</div>
          </Html>
          <Html position={[2.2, 0, 0]} center transform rotation={[0, Math.PI / 2, 0]} occlude>
            <div className="face-label">R</div>
          </Html>
          <Html position={[-2.2, 0, 0]} center transform rotation={[0, -Math.PI / 2, 0]} occlude>
            <div className="face-label">L</div>
          </Html>
          <Html position={[0, 0, 2.2]} center transform rotation={[0, 0, 0]} occlude>
            <div className="face-label">F</div>
          </Html>
          <Html position={[0, 0, -2.2]} center transform rotation={[0, Math.PI, 0]} occlude>
            <div className="face-label">B</div>
          </Html>
        </group>
      )}

      <OrbitControls enablePan={false} minDistance={4} maxDistance={12} />
    </>
  );
};
