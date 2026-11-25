import React, { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  TrackballControls,
  Html,
  GizmoHelper,
  GizmoViewcube,
} from "@react-three/drei";
import * as THREE from "three";
import { useShallow } from "zustand/react/shallow";
import { useCubeStore } from "../../store/useCubeStore";
import { useAnimationSpeed } from "../../store/useAnimationSpeed";
import { useThemeStore } from "../../store/useThemeStore";
import { Cubie } from "./Cubie";
import { ViewCubeArrows } from "./ViewCubeArrows";
import type { TrackballControls as TrackballControlsImpl } from "three-stdlib";
import { moveDetails } from "../../utils/cubeLogic";

// Cores do view cube por tema (espelham os tokens de global.css)
const VIEWCUBE_COLORS = {
  dark: { color: "#4a5180", hoverColor: "#8f9bff", textColor: "#ffffff", strokeColor: "#6b73a8" },
  light: { color: "#c9cff5", hoverColor: "#4b59e6", textColor: "#1b1e33", strokeColor: "#8e97d8" },
};
// Ordem esperada pelo GizmoViewcube: direita, esquerda, cima, baixo, frente, trás
const VIEWCUBE_FACES = ["R", "L", "U", "D", "F", "B"];

type Vec3 = [number, number, number];
const FACE_LABELS: { face: string; position: Vec3; rotation: Vec3 }[] = [
  { face: "U", position: [0, 2.2, 0], rotation: [-Math.PI / 2, 0, 0] },
  { face: "D", position: [0, -2.2, 0], rotation: [Math.PI / 2, 0, 0] },
  { face: "R", position: [2.2, 0, 0], rotation: [0, Math.PI / 2, 0] },
  { face: "L", position: [-2.2, 0, 0], rotation: [0, -Math.PI / 2, 0] },
  { face: "F", position: [0, 0, 2.2], rotation: [0, 0, 0] },
  { face: "B", position: [0, 0, -2.2], rotation: [0, Math.PI, 0] },
];

export const RubiksCube: React.FC = () => {
  // Só os campos usados aqui: o componente re-renderiza uma vez por movimento,
  // não a cada mudança da store.
  const { cubies, isAnimating, currentMove, finishAnimation, showFaceLabels } =
    useCubeStore(
      useShallow((s) => ({
        cubies: s.cubies,
        isAnimating: s.isAnimating,
        currentMove: s.currentMove,
        finishAnimation: s.finishAnimation,
        showFaceLabels: s.showFaceLabels,
      })),
    );
  const theme = useThemeStore((state) => state.theme);
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

  // Progresso da animação (0 a 1) num ref: muda a cada frame sem re-renderizar
  // o React. A velocidade é lida direto da store pelo mesmo motivo.
  const animProgress = useRef(0);
  // Depois de finishAnimation(), espera o React aplicar o próximo estado antes de
  // animar de novo: evita girar, por um frame, as peças do movimento anterior.
  const awaitingCommit = useRef(false);
  useLayoutEffect(() => {
    awaitingCommit.current = false;
  }, [cubies, currentMove, isAnimating]);

  useFrame((_, delta) => {
    const group = animatingGroupRef.current;
    if (awaitingCommit.current || !isAnimating || !currentMove || !group) return;

    const speed = useAnimationSpeed.getState().speed;
    const progress = Math.min(animProgress.current + delta * speed, 1);
    const { axis, angle } = moveDetails[currentMove];

    group.rotation.set(0, 0, 0);
    group.rotation[axis] = angle * progress;
    animProgress.current = progress;

    if (progress >= 1) {
      animProgress.current = 0;
      group.rotation.set(0, 0, 0);
      awaitingCommit.current = true;
      finishAnimation();
    }
  });

  // Separa as peças da camada que gira (filhas do grupo animado) das paradas.
  const [staticCubies, movingCubies] = useMemo(() => {
    if (!isAnimating || !currentMove) return [cubies, []];
    const { axis, layers } = moveDetails[currentMove];
    const index = axis === "x" ? 0 : axis === "y" ? 1 : 2;
    const moving = (c: (typeof cubies)[number]) => layers.includes(Math.round(c.position[index]));
    return [cubies.filter((c) => !moving(c)), cubies.filter(moving)];
  }, [cubies, isAnimating, currentMove]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-4, 3, -5]} intensity={0.6} />
      <pointLight position={[0, 6, 4]} intensity={0.8} color="#ffffff" />
      <pointLight position={[4, -4, 4]} intensity={0.4} color="#e0f0ff" />

      <group>
        {staticCubies.map((cubie) => (
          <Cubie key={cubie.id} cubieState={cubie} />
        ))}

        {/* Grupo que sofre a rotação animada */}
        <group ref={animatingGroupRef}>
          {movingCubies.map((cubie) => (
            <Cubie key={cubie.id} cubieState={cubie} />
          ))}
        </group>
      </group>

      {/* Letras das faces. O occlude (raycast a cada frame) só liga quando visíveis. */}
      <group>
        {FACE_LABELS.map(({ face, position, rotation }) => (
          <Html
            key={face}
            position={position}
            rotation={rotation}
            center
            transform
            occlude={showFaceLabels}
          >
            <div className={`face-label ${showFaceLabels ? "visible" : "hidden"}`}>
              {face}
            </div>
          </Html>
        ))}
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
        <GizmoViewcube
          key={theme}
          {...VIEWCUBE_COLORS[theme]}
          faces={VIEWCUBE_FACES}
          font="700 40px 'JetBrains Mono', ui-monospace, monospace"
        />
        <Html center style={{ pointerEvents: "none" }}>
          <ViewCubeArrows onRotate={handleRotateView} />
        </Html>
      </GizmoHelper>
    </>
  );
};
