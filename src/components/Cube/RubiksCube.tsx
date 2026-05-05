import React, { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  TrackballControls,
  Html,
  GizmoHelper,
  GizmoViewcube,
} from "@react-three/drei";
import * as THREE from "three";
import { useCubeStore } from "../../store/useCubeStore";
import { useAnimationSpeed } from "../../store/useAnimationSpeed";
import { Cubie } from "./Cubie";
import { ViewCubeArrows } from "./ViewCubeArrows";
import { TrackballControls as TrackballControlsImpl } from "three-stdlib";
import { moveDetails } from "../../utils/cubeLogic";

export const RubiksCube: React.FC = () => {
  const { cubies, isAnimating, currentMove, finishAnimation, showFaceLabels } =
    useCubeStore();
  const { speed } = useAnimationSpeed();
  const animatingGroupRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<TrackballControlsImpl>(null);
  const { camera, invalidate } = useThree();

  const handleRotateView = (axis: "x" | "y" | "z", direction: 1 | -1) => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    const target = controls.target;

    const angle = ((15 * Math.PI) / 180) * direction; // 15 degrees

    // Calculate view direction
    const viewDir = new THREE.Vector3()
      .subVectors(target, camera.position)
      .normalize();

    // Calculate local axes
    const rightDir = new THREE.Vector3()
      .crossVectors(viewDir, camera.up)
      .normalize();
    const upDir = new THREE.Vector3()
      .crossVectors(rightDir, viewDir)
      .normalize();

    const quaternion = new THREE.Quaternion();

    if (axis === "x") {
      quaternion.setFromAxisAngle(rightDir, angle);
    } else if (axis === "y") {
      quaternion.setFromAxisAngle(upDir, angle);
    } else if (axis === "z") {
      quaternion.setFromAxisAngle(viewDir, angle);
    }

    // Apply rotation to position relative to target
    const offset = new THREE.Vector3().subVectors(camera.position, target);
    offset.applyQuaternion(quaternion);
    camera.position.copy(target).add(offset);

    // Apply rotation to up vector
    camera.up.applyQuaternion(quaternion);

    controls.update();
    invalidate();
  };

  // Controle de progresso da animação (de 0 a 1)
  const [animProgress, setAnimProgress] = useState(0);

  useFrame((_, delta) => {
    if (isAnimating && currentMove && animatingGroupRef.current) {
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
            const { axis, layers } = moveDetails[currentMove];
            const posIndex = axis === "x" ? 0 : axis === "y" ? 1 : 2;
            isPart = layers.includes(Math.round(cubie.position[posIndex]));
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
              const { axis, layers } = moveDetails[currentMove];
              const posIndex = axis === "x" ? 0 : axis === "y" ? 1 : 2;
              const isPart = layers.includes(
                Math.round(cubie.position[posIndex]),
              );

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

      <group>
        <Html
          position={[0, 2.2, 0]}
          center
          transform
          rotation={[-Math.PI / 2, 0, 0]}
          occlude
        >
          <div
            className={`face-label ${showFaceLabels ? "visible" : "hidden"}`}
          >
            U
          </div>
        </Html>
        <Html
          position={[0, -2.2, 0]}
          center
          transform
          rotation={[Math.PI / 2, 0, 0]}
          occlude
        >
          <div
            className={`face-label ${showFaceLabels ? "visible" : "hidden"}`}
          >
            D
          </div>
        </Html>
        <Html
          position={[2.2, 0, 0]}
          center
          transform
          rotation={[0, Math.PI / 2, 0]}
          occlude
        >
          <div
            className={`face-label ${showFaceLabels ? "visible" : "hidden"}`}
          >
            R
          </div>
        </Html>
        <Html
          position={[-2.2, 0, 0]}
          center
          transform
          rotation={[0, -Math.PI / 2, 0]}
          occlude
        >
          <div
            className={`face-label ${showFaceLabels ? "visible" : "hidden"}`}
          >
            L
          </div>
        </Html>
        <Html
          position={[0, 0, 2.2]}
          center
          transform
          rotation={[0, 0, 0]}
          occlude
        >
          <div
            className={`face-label ${showFaceLabels ? "visible" : "hidden"}`}
          >
            F
          </div>
        </Html>
        <Html
          position={[0, 0, -2.2]}
          center
          transform
          rotation={[0, Math.PI, 0]}
          occlude
        >
          <div
            className={`face-label ${showFaceLabels ? "visible" : "hidden"}`}
          >
            B
          </div>
        </Html>
      </group>

      <TrackballControls
        ref={controlsRef}
        makeDefault
        noPan={true}
        minDistance={4}
        maxDistance={12}
        rotateSpeed={4.0}
      />

      <GizmoHelper alignment="top-right" margin={[80, 80]}>
        <GizmoViewcube />
        <Html center style={{ pointerEvents: "none" }}>
          <ViewCubeArrows onRotate={handleRotateView} />
        </Html>
      </GizmoHelper>
    </>
  );
};
