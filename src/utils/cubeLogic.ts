import * as THREE from "three";

export type Move =
  // Movimentos básicos de face
  | "U"
  | "U'"
  | "U2"
  | "D"
  | "D'"
  | "D2"
  | "R"
  | "R'"
  | "R2"
  | "L"
  | "L'"
  | "L2"
  | "F"
  | "F'"
  | "F2"
  | "B"
  | "B'"
  | "B2"
  // Movimentos de fatia (slice)
  | "M"
  | "M'"
  | "M2"
  | "E"
  | "E'"
  | "E2"
  | "S"
  | "S'"
  | "S2"
  // Movimentos de dupla camada (wide)
  | "u"
  | "u'"
  | "u2"
  | "d"
  | "d'"
  | "d2"
  | "r"
  | "r'"
  | "r2"
  | "l"
  | "l'"
  | "l2"
  | "f"
  | "f'"
  | "f2"
  | "b"
  | "b'"
  | "b2"
  // Rotações completas do cubo
  | "X"
  | "X'"
  | "X2"
  | "Y"
  | "Y'"
  | "Y2"
  | "Z"
  | "Z'"
  | "Z2";

export interface CubieState {
  id: number;
  position: [number, number, number];
  quaternion: [number, number, number, number];
}

export const getInitialCubies = (): CubieState[] => {
  const cubies: CubieState[] = [];
  let id = 0;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        cubies.push({
          id: id++,
          position: [x, y, z],
          quaternion: [0, 0, 0, 1],
        });
      }
    }
  }
  return cubies;
};

export const moveDetails: Record<
  Move,
  { axis: "x" | "y" | "z"; layers: number[]; angle: number }
> = {
  // --- Movimentos de face ---
  U: { axis: "y", layers: [1], angle: -Math.PI / 2 },
  "U'": { axis: "y", layers: [1], angle: Math.PI / 2 },
  U2: { axis: "y", layers: [1], angle: Math.PI },
  D: { axis: "y", layers: [-1], angle: Math.PI / 2 },
  "D'": { axis: "y", layers: [-1], angle: -Math.PI / 2 },
  D2: { axis: "y", layers: [-1], angle: Math.PI },
  R: { axis: "x", layers: [1], angle: -Math.PI / 2 },
  "R'": { axis: "x", layers: [1], angle: Math.PI / 2 },
  R2: { axis: "x", layers: [1], angle: Math.PI },
  L: { axis: "x", layers: [-1], angle: Math.PI / 2 },
  "L'": { axis: "x", layers: [-1], angle: -Math.PI / 2 },
  L2: { axis: "x", layers: [-1], angle: Math.PI },
  F: { axis: "z", layers: [1], angle: -Math.PI / 2 },
  "F'": { axis: "z", layers: [1], angle: Math.PI / 2 },
  F2: { axis: "z", layers: [1], angle: Math.PI },
  B: { axis: "z", layers: [-1], angle: Math.PI / 2 },
  "B'": { axis: "z", layers: [-1], angle: -Math.PI / 2 },
  B2: { axis: "z", layers: [-1], angle: Math.PI },
  // --- Fatias (slice) ---
  M: { axis: "x", layers: [0], angle: Math.PI / 2 }, // mesma direção que L
  "M'": { axis: "x", layers: [0], angle: -Math.PI / 2 },
  M2: { axis: "x", layers: [0], angle: Math.PI },
  E: { axis: "y", layers: [0], angle: Math.PI / 2 }, // mesma direção que D
  "E'": { axis: "y", layers: [0], angle: -Math.PI / 2 },
  E2: { axis: "y", layers: [0], angle: Math.PI },
  S: { axis: "z", layers: [0], angle: -Math.PI / 2 }, // mesma direção que F
  "S'": { axis: "z", layers: [0], angle: Math.PI / 2 },
  S2: { axis: "z", layers: [0], angle: Math.PI },
  // --- Dupla camada (wide) ---
  u: { axis: "y", layers: [0, 1], angle: -Math.PI / 2 }, // U + equatorial
  "u'": { axis: "y", layers: [0, 1], angle: Math.PI / 2 },
  u2: { axis: "y", layers: [0, 1], angle: Math.PI },
  d: { axis: "y", layers: [-1, 0], angle: Math.PI / 2 }, // D + equatorial
  "d'": { axis: "y", layers: [-1, 0], angle: -Math.PI / 2 },
  d2: { axis: "y", layers: [-1, 0], angle: Math.PI },
  r: { axis: "x", layers: [0, 1], angle: -Math.PI / 2 }, // R + middle
  "r'": { axis: "x", layers: [0, 1], angle: Math.PI / 2 },
  r2: { axis: "x", layers: [0, 1], angle: Math.PI },
  l: { axis: "x", layers: [-1, 0], angle: Math.PI / 2 }, // L + middle
  "l'": { axis: "x", layers: [-1, 0], angle: -Math.PI / 2 },
  l2: { axis: "x", layers: [-1, 0], angle: Math.PI },
  f: { axis: "z", layers: [0, 1], angle: -Math.PI / 2 }, // F + standing
  "f'": { axis: "z", layers: [0, 1], angle: Math.PI / 2 },
  f2: { axis: "z", layers: [0, 1], angle: Math.PI },
  b: { axis: "z", layers: [-1, 0], angle: Math.PI / 2 }, // B + standing
  "b'": { axis: "z", layers: [-1, 0], angle: -Math.PI / 2 },
  b2: { axis: "z", layers: [-1, 0], angle: Math.PI },
  // --- Rotações completas do cubo ---
  X: { axis: "x", layers: [-1, 0, 1], angle: -Math.PI / 2 }, // como R
  "X'": { axis: "x", layers: [-1, 0, 1], angle: Math.PI / 2 },
  X2: { axis: "x", layers: [-1, 0, 1], angle: Math.PI },
  Y: { axis: "y", layers: [-1, 0, 1], angle: -Math.PI / 2 }, // como U
  "Y'": { axis: "y", layers: [-1, 0, 1], angle: Math.PI / 2 },
  Y2: { axis: "y", layers: [-1, 0, 1], angle: Math.PI },
  Z: { axis: "z", layers: [-1, 0, 1], angle: -Math.PI / 2 }, // como F
  "Z'": { axis: "z", layers: [-1, 0, 1], angle: Math.PI / 2 },
  Z2: { axis: "z", layers: [-1, 0, 1], angle: Math.PI },
};

export const getInverseMove = (move: Move): Move => {
  if (move.endsWith("2")) return move; // 180° são auto-inversos
  if (move.endsWith("'")) return move.replace("'", "") as Move;
  return `${move}'` as Move;
};

// Arredonda para evitar erros de ponto flutuante (-0.0000001 -> 0)
const roundVector = (v: THREE.Vector3) => {
  v.x = Math.round(v.x);
  v.y = Math.round(v.y);
  v.z = Math.round(v.z);
};

export const applyRotationToCubies = (
  cubies: CubieState[],
  move: Move,
): CubieState[] => {
  const { axis, layers, angle } = moveDetails[move];
  const axisVector = new THREE.Vector3(
    axis === "x" ? 1 : 0,
    axis === "y" ? 1 : 0,
    axis === "z" ? 1 : 0,
  );
  const quaternion = new THREE.Quaternion().setFromAxisAngle(axisVector, angle);

  return cubies.map((cubie) => {
    // Apenas cubies nas camadas selecionadas são afetados
    const posIndex = axis === "x" ? 0 : axis === "y" ? 1 : 2;
    if (!layers.includes(Math.round(cubie.position[posIndex]))) return cubie;

    // Atualiza a posição (gira ao redor do centro 0,0,0)
    const pos = new THREE.Vector3(...cubie.position);
    pos.applyQuaternion(quaternion);
    roundVector(pos);

    // Atualiza a rotação (quaternion) do próprio cubie
    const currentQuat = new THREE.Quaternion(...cubie.quaternion);
    const newQuat = quaternion.clone().multiply(currentQuat);
    newQuat.normalize();

    return {
      ...cubie,
      position: [pos.x, pos.y, pos.z],
      quaternion: [newQuat.x, newQuat.y, newQuat.z, newQuat.w],
    };
  });
};
