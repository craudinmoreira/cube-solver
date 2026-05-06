import * as THREE from "three";

export type Move =
  // Movimentos básicos de face
  | "U"
  | "U'"
  | "U2"
  | "U3"
  | "D"
  | "D'"
  | "D2"
  | "D3"
  | "R"
  | "R'"
  | "R2"
  | "R3"
  | "L"
  | "L'"
  | "L2"
  | "L3"
  | "F"
  | "F'"
  | "F2"
  | "F3"
  | "B"
  | "B'"
  | "B2"
  | "B3"
  // Movimentos de fatia (slice)
  | "M"
  | "M'"
  | "M2"
  | "M3"
  | "E"
  | "E'"
  | "E2"
  | "E3"
  | "S"
  | "S'"
  | "S2"
  | "S3"
  // Movimentos de dupla camada (wide)
  | "u"
  | "u'"
  | "u2"
  | "u3"
  | "d"
  | "d'"
  | "d2"
  | "d3"
  | "r"
  | "r'"
  | "r2"
  | "r3"
  | "l"
  | "l'"
  | "l2"
  | "l3"
  | "f"
  | "f'"
  | "f2"
  | "f3"
  | "b"
  | "b'"
  | "b2"
  | "b3"
  // Rotações completas do cubo
  | "X"
  | "X'"
  | "X2"
  | "X3"
  | "Y"
  | "Y'"
  | "Y2"
  | "Y3"
  | "Z"
  | "Z'"
  | "Z2"
  | "Z3";

export interface FaceColors {
  right?: string;
  left?: string;
  top?: string;
  bottom?: string;
  front?: string;
  back?: string;
}

export interface CubieState {
  id: number;
  position: [number, number, number];
  quaternion: [number, number, number, number];
  faceColors?: FaceColors;
}

// Mapeamento de letra da string para cor hex (igual à paleta de Cubie.tsx)
export const CUBE_COLOR_MAP: Record<string, string> = {
  W: "#F8FAFC", // branco
  Y: "#FDE68A", // amarelo
  R: "#F87171", // vermelho
  O: "#FDBA74", // laranja
  G: "#86EFAC", // verde
  B: "#93C5FD", // azul
};

const VALID_COLORS = new Set(Object.keys(CUBE_COLOR_MAP));
const COLOR_NAMES: Record<string, string> = {
  W: "Branco",
  Y: "Amarelo",
  R: "Vermelho",
  O: "Laranja",
  G: "Verde",
  B: "Azul",
};

/**
 * Valida a string de estado do cubo (formato da lib Python rubik.cube).
 * Layout: U(0-8), cinturão L/F/R/B linha a linha (9-44), D(45-53).
 * Retorna null se válida ou uma mensagem de erro descritiva.
 */
export const validateCubeStateString = (s: string): string | null => {
  if (s.length !== 54)
    return `A string deve ter exatamente 54 caracteres (atual: ${s.length})`;

  for (let i = 0; i < s.length; i++) {
    if (!VALID_COLORS.has(s[i]))
      return `Caractere inválido '${s[i]}' na posição ${i + 1}. Use apenas: W, R, O, Y, G, B`;
  }

  const counts: Record<string, number> = {};
  for (const ch of s) counts[ch] = (counts[ch] ?? 0) + 1;
  for (const [ch, count] of Object.entries(counts)) {
    if (count !== 9)
      return `${COLOR_NAMES[ch] ?? ch} aparece ${count} vez(es), mas deve aparecer exatamente 9`;
  }

  return null;
};

/**
 * Converte a string de estado em CubieState[] com faceColors.
 * Retorna null se a string for inválida.
 *
 * Mapeamento (coordenadas x∈{-1,0,1}, y∈{-1,0,1}, z∈{-1,0,1}):
 *   U  face (y=1) : índice = (z+1)*3 + (x+1)           → [0-8]
 *   L  face (x=-1): índice =  9 + (1-y)*12 + (z+1)     → [9-44]
 *   F  face (z=1) : índice = 12 + (1-y)*12 + (x+1)
 *   R  face (x=1) : índice = 15 + (1-y)*12 + (1-z)
 *   B  face (z=-1): índice = 18 + (1-y)*12 + (1-x)
 *   D  face (y=-1): índice = 45 + (1-z)*3  + (x+1)     → [45-53]
 */
export const parseCubeStateString = (s: string): CubieState[] | null => {
  if (validateCubeStateString(s) !== null) return null;

  const cubies = getInitialCubies();

  for (const cubie of cubies) {
    const id = cubie.id;
    const initX =
      Math.floor(id / 9) === 2 ? 1 : Math.floor(id / 9) === 0 ? -1 : 0;
    const initY =
      Math.floor((id % 9) / 3) === 2
        ? 1
        : Math.floor((id % 9) / 3) === 0
          ? -1
          : 0;
    const initZ = id % 3 === 2 ? 1 : id % 3 === 0 ? -1 : 0;

    cubie.faceColors = {};

    if (initY === 1)
      cubie.faceColors.top = CUBE_COLOR_MAP[s[(initZ + 1) * 3 + (initX + 1)]];
    if (initY === -1)
      cubie.faceColors.bottom =
        CUBE_COLOR_MAP[s[45 + (1 - initZ) * 3 + (initX + 1)]];
    if (initZ === 1)
      cubie.faceColors.front =
        CUBE_COLOR_MAP[s[12 + (1 - initY) * 12 + (initX + 1)]];
    if (initZ === -1)
      cubie.faceColors.back =
        CUBE_COLOR_MAP[s[18 + (1 - initY) * 12 + (1 - initX)]];
    if (initX === -1)
      cubie.faceColors.left =
        CUBE_COLOR_MAP[s[9 + (1 - initY) * 12 + (initZ + 1)]];
    if (initX === 1)
      cubie.faceColors.right =
        CUBE_COLOR_MAP[s[15 + (1 - initY) * 12 + (1 - initZ)]];
  }

  return cubies;
};

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
  U3: { axis: "y", layers: [1], angle: -Math.PI * 1.5 },
  D: { axis: "y", layers: [-1], angle: Math.PI / 2 },
  "D'": { axis: "y", layers: [-1], angle: -Math.PI / 2 },
  D2: { axis: "y", layers: [-1], angle: Math.PI },
  D3: { axis: "y", layers: [-1], angle: Math.PI * 1.5 },
  R: { axis: "x", layers: [1], angle: -Math.PI / 2 },
  "R'": { axis: "x", layers: [1], angle: Math.PI / 2 },
  R2: { axis: "x", layers: [1], angle: Math.PI },
  R3: { axis: "x", layers: [1], angle: -Math.PI * 1.5 },
  L: { axis: "x", layers: [-1], angle: Math.PI / 2 },
  "L'": { axis: "x", layers: [-1], angle: -Math.PI / 2 },
  L2: { axis: "x", layers: [-1], angle: Math.PI },
  L3: { axis: "x", layers: [-1], angle: Math.PI * 1.5 },
  F: { axis: "z", layers: [1], angle: -Math.PI / 2 },
  "F'": { axis: "z", layers: [1], angle: Math.PI / 2 },
  F2: { axis: "z", layers: [1], angle: Math.PI },
  F3: { axis: "z", layers: [1], angle: -Math.PI * 1.5 },
  B: { axis: "z", layers: [-1], angle: Math.PI / 2 },
  "B'": { axis: "z", layers: [-1], angle: -Math.PI / 2 },
  B2: { axis: "z", layers: [-1], angle: Math.PI },
  B3: { axis: "z", layers: [-1], angle: Math.PI * 1.5 },
  // --- Fatias (slice) ---
  M: { axis: "x", layers: [0], angle: Math.PI / 2 }, // mesma direção que L
  "M'": { axis: "x", layers: [0], angle: -Math.PI / 2 },
  M2: { axis: "x", layers: [0], angle: Math.PI },
  M3: { axis: "x", layers: [0], angle: Math.PI * 1.5 },
  E: { axis: "y", layers: [0], angle: Math.PI / 2 }, // mesma direção que D
  "E'": { axis: "y", layers: [0], angle: -Math.PI / 2 },
  E2: { axis: "y", layers: [0], angle: Math.PI },
  E3: { axis: "y", layers: [0], angle: Math.PI * 1.5 },
  S: { axis: "z", layers: [0], angle: -Math.PI / 2 }, // mesma direção que F
  "S'": { axis: "z", layers: [0], angle: Math.PI / 2 },
  S2: { axis: "z", layers: [0], angle: Math.PI },
  S3: { axis: "z", layers: [0], angle: -Math.PI * 1.5 },
  // --- Dupla camada (wide) ---
  u: { axis: "y", layers: [0, 1], angle: -Math.PI / 2 }, // U + equatorial
  "u'": { axis: "y", layers: [0, 1], angle: Math.PI / 2 },
  u2: { axis: "y", layers: [0, 1], angle: Math.PI },
  u3: { axis: "y", layers: [0, 1], angle: -Math.PI * 1.5 },
  d: { axis: "y", layers: [-1, 0], angle: Math.PI / 2 }, // D + equatorial
  "d'": { axis: "y", layers: [-1, 0], angle: -Math.PI / 2 },
  d2: { axis: "y", layers: [-1, 0], angle: Math.PI },
  d3: { axis: "y", layers: [-1, 0], angle: Math.PI * 1.5 },
  r: { axis: "x", layers: [0, 1], angle: -Math.PI / 2 }, // R + middle
  "r'": { axis: "x", layers: [0, 1], angle: Math.PI / 2 },
  r2: { axis: "x", layers: [0, 1], angle: Math.PI },
  r3: { axis: "x", layers: [0, 1], angle: -Math.PI * 1.5 },
  l: { axis: "x", layers: [-1, 0], angle: Math.PI / 2 }, // L + middle
  "l'": { axis: "x", layers: [-1, 0], angle: -Math.PI / 2 },
  l2: { axis: "x", layers: [-1, 0], angle: Math.PI },
  l3: { axis: "x", layers: [-1, 0], angle: Math.PI * 1.5 },
  f: { axis: "z", layers: [0, 1], angle: -Math.PI / 2 }, // F + standing
  "f'": { axis: "z", layers: [0, 1], angle: Math.PI / 2 },
  f2: { axis: "z", layers: [0, 1], angle: Math.PI },
  f3: { axis: "z", layers: [0, 1], angle: -Math.PI * 1.5 },
  b: { axis: "z", layers: [-1, 0], angle: Math.PI / 2 }, // B + standing
  "b'": { axis: "z", layers: [-1, 0], angle: -Math.PI / 2 },
  b2: { axis: "z", layers: [-1, 0], angle: Math.PI },
  b3: { axis: "z", layers: [-1, 0], angle: Math.PI * 1.5 },
  // --- Rotações completas do cubo ---
  X: { axis: "x", layers: [-1, 0, 1], angle: -Math.PI / 2 }, // como R
  "X'": { axis: "x", layers: [-1, 0, 1], angle: Math.PI / 2 },
  X2: { axis: "x", layers: [-1, 0, 1], angle: Math.PI },
  X3: { axis: "x", layers: [-1, 0, 1], angle: -Math.PI * 1.5 },
  Y: { axis: "y", layers: [-1, 0, 1], angle: -Math.PI / 2 }, // como U
  "Y'": { axis: "y", layers: [-1, 0, 1], angle: Math.PI / 2 },
  Y2: { axis: "y", layers: [-1, 0, 1], angle: Math.PI },
  Y3: { axis: "y", layers: [-1, 0, 1], angle: -Math.PI * 1.5 },
  Z: { axis: "z", layers: [-1, 0, 1], angle: -Math.PI / 2 }, // como F
  "Z'": { axis: "z", layers: [-1, 0, 1], angle: Math.PI / 2 },
  Z2: { axis: "z", layers: [-1, 0, 1], angle: Math.PI },
  Z3: { axis: "z", layers: [-1, 0, 1], angle: -Math.PI * 1.5 },
};

export const getInverseMove = (move: Move): Move => {
  if (move.endsWith("2")) return move; // 180° são auto-inversos
  if (move.endsWith("3")) return move.replace("3", "") as Move; // 270° inverso é 90° normal
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

// Conjunto de todos os movimentos válidos para uso no parser
const VALID_MOVES = new Set<string>(Object.keys(moveDetails));

/**
 * Converte uma string de solução no formato "R U Ri F2 Xi" em Move[].
 * - Letras minúsculas 'i' substituem o apóstrofo (ex: "Ri" → "R'").
 * - Tokens são separados por espaço/vírgula.
 * Retorna { moves, error } onde error é null se tudo for válido.
 */
export const parseSolutionString = (
  input: string,
): { moves: Move[]; error: string | null } => {
  if (!input.trim()) return { moves: [], error: null };

  // Normaliza 'i' como inverso apenas quando é sufixo de movimento (ex: Ri, Ui, Xi)
  // Tokeniza por espaço/vírgula/ponto-e-vírgula
  const tokens = input
    .trim()
    .split(/[\s,;]+/)
    .filter(Boolean);

  const moves: Move[] = [];

  for (const raw of tokens) {
    // Substitui trailing 'i' (case-sensitive: "Ri" → "R'", mas "ri" → "r'")
    // Remove trailing '1' para tratar R1 como R
    const token = raw.replace(/i$/, "'").replace(/1$/, "");

    if (!VALID_MOVES.has(token)) {
      return {
        moves: [],
        error: `Movimento inválido: "${raw}". Token não reconhecido. Use letras como R, U', F2, M, X, etc.`,
      };
    }
    moves.push(token as Move);
  }

  return { moves, error: null };
};
