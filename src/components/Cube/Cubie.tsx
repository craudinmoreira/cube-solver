import React from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { CubieState } from "../../utils/cubeLogic";

interface CubieProps {
  cubieState: CubieState;
  isAnimating: boolean;
  animatingGroupRef: React.MutableRefObject<THREE.Group | null>;
  isPartOAnimatingLayer: boolean;
}

// Paleta pastel inspirada no cubo clássico
const COLORS = {
  right: "#F87171", // vermelho pastel
  left: "#FDBA74", // laranja pastel
  top: "#F8FAFC", // branco suave
  bottom: "#FDE68A", // amarelo pastel
  front: "#86EFAC", // verde pastel
  back: "#93C5FD", // azul pastel
  core: "#1C1C1E", // plástico escuro
};

const CUBIE_SIZE = 1;
const HALF_CUBIE_SIZE = CUBIE_SIZE / 2;

// Corpo e faces internas encostam entre si para remover fresta visual.
const FILL_OFFSET = HALF_CUBIE_SIZE;
const FILL_SIZE: [number, number] = [CUBIE_SIZE, CUBIE_SIZE];

// Sticker quase cobre face inteira; pequeno recuo evita z-fighting.
const STICKER_OFFSET = HALF_CUBIE_SIZE + 0.001;
const STICKER_SIZE: [number, number] = [0.75, 0.75];
const STICKER_PROPS = {
  roughness: 0.12,
  metalness: 0.0,
  clearcoat: 1.0,
  clearcoatRoughness: 0.08,
} as const;

export const Cubie: React.FC<CubieProps> = ({ cubieState }) => {
  // Ordem de geração: x outermost → y → z innermost  ⟹  id = (x+1)*9 + (y+1)*3 + (z+1)
  const initX =
    Math.floor(cubieState.id / 9) === 2
      ? 1
      : Math.floor(cubieState.id / 9) === 0
        ? -1
        : 0;
  const initY =
    Math.floor((cubieState.id % 9) / 3) === 2
      ? 1
      : Math.floor((cubieState.id % 9) / 3) === 0
        ? -1
        : 0;
  const initZ = cubieState.id % 3 === 2 ? 1 : cubieState.id % 3 === 0 ? -1 : 0;

  const [qx, qy, qz, qw] = cubieState.quaternion;
  const quaternion = React.useMemo(
    () => new THREE.Quaternion(qx, qy, qz, qw),
    [qx, qy, qz, qw],
  );

  return (
    <group position={cubieState.position} quaternion={quaternion}>
      {/* Corpo arredondado (plástico escuro) */}
      <RoundedBox
        args={[CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE]}
        radius={0.06}
        smoothness={4}
      >
        <meshStandardMaterial
          color={COLORS.core}
          roughness={0.45}
          metalness={0.1}
        />
      </RoundedBox>

      {/* Stickers coloridos por face */}
      {initX === 1 && (
        <mesh position={[STICKER_OFFSET, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={STICKER_SIZE} />
          <meshPhysicalMaterial
            color={cubieState.faceColors?.right ?? COLORS.right}
            {...STICKER_PROPS}
          />
        </mesh>
      )}
      {initX === -1 && (
        <mesh
          position={[-STICKER_OFFSET, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <planeGeometry args={STICKER_SIZE} />
          <meshPhysicalMaterial
            color={cubieState.faceColors?.left ?? COLORS.left}
            {...STICKER_PROPS}
          />
        </mesh>
      )}
      {initY === 1 && (
        <mesh position={[0, STICKER_OFFSET, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={STICKER_SIZE} />
          <meshPhysicalMaterial
            color={cubieState.faceColors?.top ?? COLORS.top}
            {...STICKER_PROPS}
          />
        </mesh>
      )}
      {initY === -1 && (
        <mesh position={[0, -STICKER_OFFSET, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={STICKER_SIZE} />
          <meshPhysicalMaterial
            color={cubieState.faceColors?.bottom ?? COLORS.bottom}
            {...STICKER_PROPS}
          />
        </mesh>
      )}
      {initZ === 1 && (
        <mesh position={[0, 0, STICKER_OFFSET]}>
          <planeGeometry args={STICKER_SIZE} />
          <meshPhysicalMaterial
            color={cubieState.faceColors?.front ?? COLORS.front}
            {...STICKER_PROPS}
          />
        </mesh>
      )}
      {initZ === -1 && (
        <mesh position={[0, 0, -STICKER_OFFSET]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={STICKER_SIZE} />
          <meshPhysicalMaterial
            color={cubieState.faceColors?.back ?? COLORS.back}
            {...STICKER_PROPS}
          />
        </mesh>
      )}

      {/* Planos de fechamento interno: tapam os gaps nas faces não-externas */}
      {initX !== 1 && (
        <mesh position={[FILL_OFFSET, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={FILL_SIZE} />
          <meshStandardMaterial
            color={COLORS.core}
            roughness={1}
            metalness={0}
          />
        </mesh>
      )}
      {initX !== -1 && (
        <mesh position={[-FILL_OFFSET, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={FILL_SIZE} />
          <meshStandardMaterial
            color={COLORS.core}
            roughness={1}
            metalness={0}
          />
        </mesh>
      )}
      {initY !== 1 && (
        <mesh position={[0, FILL_OFFSET, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={FILL_SIZE} />
          <meshStandardMaterial
            color={COLORS.core}
            roughness={1}
            metalness={0}
          />
        </mesh>
      )}
      {initY !== -1 && (
        <mesh position={[0, -FILL_OFFSET, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={FILL_SIZE} />
          <meshStandardMaterial
            color={COLORS.core}
            roughness={1}
            metalness={0}
          />
        </mesh>
      )}
      {initZ !== 1 && (
        <mesh position={[0, 0, FILL_OFFSET]}>
          <planeGeometry args={FILL_SIZE} />
          <meshStandardMaterial
            color={COLORS.core}
            roughness={1}
            metalness={0}
          />
        </mesh>
      )}
      {initZ !== -1 && (
        <mesh position={[0, 0, -FILL_OFFSET]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={FILL_SIZE} />
          <meshStandardMaterial
            color={COLORS.core}
            roughness={1}
            metalness={0}
          />
        </mesh>
      )}
    </group>
  );
};
