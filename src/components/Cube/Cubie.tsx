import React from "react";
import * as THREE from "three";
import { toCreasedNormals } from "three-stdlib";
import type { CubieState, FaceColors } from "../../utils/cubeLogic";

interface CubieProps {
  cubieState: CubieState;
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
// Sticker quase cobre face inteira; pequeno recuo evita z-fighting.
const STICKER_OFFSET = HALF_CUBIE_SIZE + 0.001;

/**
 * Mesmo algoritmo do <RoundedBox> do drei (radius 0.06, smoothness 4), mas
 * criado uma única vez: extrusão de um quadrado com bisel e normais vincadas.
 */
function createRoundedBox(size: number, radius: number) {
  const eps = 0.00001;
  const r = radius - eps;
  const shape = new THREE.Shape();
  shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
  shape.absarc(eps, size - r * 2, eps, Math.PI, Math.PI / 2, true);
  shape.absarc(size - r * 2, size - r * 2, eps, Math.PI / 2, 0, true);
  shape.absarc(size - r * 2, eps, eps, 0, -Math.PI / 2, true);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: size - radius * 2,
    bevelEnabled: true,
    bevelSegments: 8,
    steps: 1,
    bevelSize: radius - eps,
    bevelThickness: radius,
    curveSegments: 4,
  });
  geometry.center();
  return toCreasedNormals(geometry, 0.4);
}

// Geometrias e materiais compartilhados pelos 27 cubies: uma única alocação na
// GPU em vez de uma por peça. `dispose={null}` no grupo impede que o R3F os
// descarte quando a peça troca de grupo durante a animação.
const BODY_GEOMETRY = createRoundedBox(CUBIE_SIZE, 0.06);
const STICKER_GEOMETRY = new THREE.PlaneGeometry(0.75, 0.75);
const FILL_GEOMETRY = new THREE.PlaneGeometry(CUBIE_SIZE, CUBIE_SIZE);
const BODY_MATERIAL = new THREE.MeshStandardMaterial({ color: COLORS.core, roughness: 0.45, metalness: 0.1 });
const FILL_MATERIAL = new THREE.MeshStandardMaterial({ color: COLORS.core, roughness: 1, metalness: 0 });

const stickerMaterials = new Map<string, THREE.MeshPhysicalMaterial>();
const stickerMaterial = (color: string) => {
  let material = stickerMaterials.get(color);
  if (!material) {
    material = new THREE.MeshPhysicalMaterial({
      color,
      roughness: 0.12,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    });
    stickerMaterials.set(color, material);
  }
  return material;
};

type Vec3 = [number, number, number];
const FACES: { key: keyof FaceColors; axis: 0 | 1 | 2; sign: 1 | -1; rotation: Vec3 }[] = [
  { key: "right", axis: 0, sign: 1, rotation: [0, Math.PI / 2, 0] },
  { key: "left", axis: 0, sign: -1, rotation: [0, -Math.PI / 2, 0] },
  { key: "top", axis: 1, sign: 1, rotation: [-Math.PI / 2, 0, 0] },
  { key: "bottom", axis: 1, sign: -1, rotation: [Math.PI / 2, 0, 0] },
  { key: "front", axis: 2, sign: 1, rotation: [0, 0, 0] },
  { key: "back", axis: 2, sign: -1, rotation: [0, Math.PI, 0] },
];

const offset = (axis: number, distance: number): Vec3 => {
  const v: Vec3 = [0, 0, 0];
  v[axis] = distance;
  return v;
};

// Memoizado: só re-renderiza quando o estado desta peça muda (applyRotationToCubies
// preserva a referência das peças fora da camada girada).
export const Cubie: React.FC<CubieProps> = React.memo(({ cubieState }) => {
  // Posição inicial derivada do id: id = (x+1)*9 + (y+1)*3 + (z+1)
  const { id } = cubieState;
  const initial: Vec3 = [Math.floor(id / 9) - 1, Math.floor((id % 9) / 3) - 1, (id % 3) - 1];

  const [qx, qy, qz, qw] = cubieState.quaternion;
  const quaternion = React.useMemo(
    () => new THREE.Quaternion(qx, qy, qz, qw),
    [qx, qy, qz, qw],
  );

  return (
    <group position={cubieState.position} quaternion={quaternion} dispose={null}>
      {/* Corpo arredondado (plástico escuro) */}
      <mesh geometry={BODY_GEOMETRY} material={BODY_MATERIAL} />

      {FACES.map(({ key, axis, sign, rotation }) =>
        initial[axis] === sign ? (
          // Face externa: adesivo colorido
          <mesh
            key={key}
            geometry={STICKER_GEOMETRY}
            material={stickerMaterial(cubieState.faceColors?.[key] ?? COLORS[key])}
            position={offset(axis, sign * STICKER_OFFSET)}
            rotation={rotation}
          />
        ) : (
          // Face interna: plano de fechamento que tapa o vão entre as peças
          <mesh
            key={key}
            geometry={FILL_GEOMETRY}
            material={FILL_MATERIAL}
            position={offset(axis, sign * FILL_OFFSET)}
            rotation={rotation}
          />
        ),
      )}
    </group>
  );
});
Cubie.displayName = "Cubie";
