import * as THREE from 'three';

export type Move = 'U' | "U'" | 'D' | "D'" | 'R' | "R'" | 'L' | "L'" | 'F' | "F'" | 'B' | "B'";

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

export const moveDetails: Record<Move, { axis: 'x' | 'y' | 'z'; layer: number; angle: number }> = {
  'U':  { axis: 'y', layer:  1, angle: -Math.PI / 2 },
  "U'": { axis: 'y', layer:  1, angle:  Math.PI / 2 },
  'D':  { axis: 'y', layer: -1, angle:  Math.PI / 2 },
  "D'": { axis: 'y', layer: -1, angle: -Math.PI / 2 },
  'R':  { axis: 'x', layer:  1, angle: -Math.PI / 2 },
  "R'": { axis: 'x', layer:  1, angle:  Math.PI / 2 },
  'L':  { axis: 'x', layer: -1, angle:  Math.PI / 2 },
  "L'": { axis: 'x', layer: -1, angle: -Math.PI / 2 },
  'F':  { axis: 'z', layer:  1, angle: -Math.PI / 2 },
  "F'": { axis: 'z', layer:  1, angle:  Math.PI / 2 },
  'B':  { axis: 'z', layer: -1, angle:  Math.PI / 2 },
  "B'": { axis: 'z', layer: -1, angle: -Math.PI / 2 },
};

export const getInverseMove = (move: Move): Move => {
  return move.includes("'") ? (move.replace("'", '') as Move) : (`${move}'` as Move);
};

// Arredonda para evitar erros de ponto flutuante (-0.0000001 -> 0)
const roundVector = (v: THREE.Vector3) => {
  v.x = Math.round(v.x);
  v.y = Math.round(v.y);
  v.z = Math.round(v.z);
};

export const applyRotationToCubies = (cubies: CubieState[], move: Move): CubieState[] => {
  const { axis, layer, angle } = moveDetails[move];
  const axisVector = new THREE.Vector3(
    axis === 'x' ? 1 : 0,
    axis === 'y' ? 1 : 0,
    axis === 'z' ? 1 : 0
  );
  const quaternion = new THREE.Quaternion().setFromAxisAngle(axisVector, angle);

  return cubies.map((cubie) => {
    // Apenas cubies na camada selecionada são afetados
    const posIndex = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
    if (Math.round(cubie.position[posIndex]) !== layer) return cubie;

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
