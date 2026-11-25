import { applyRotationToCubies, getInitialCubies, type CubieState, type Move } from '../utils/cubeLogic'

/** String de estado do cubo resolvido (U, cinturão L F R B, D). */
export const SOLVED_STATE =
  'WWWWWWWWW' + 'OOOGGGRRRBBB'.repeat(3) + 'YYYYYYYYY'

export const applyMoves = (moves: Move[], cubies: CubieState[] = getInitialCubies()) =>
  moves.reduce((acc, m) => applyRotationToCubies(acc, m), cubies)

/** Compara posições e orientações ignorando ruído de ponto flutuante e o sinal do quaternion. */
export const sameCube = (a: CubieState[], b: CubieState[]) =>
  a.every((ca, i) => {
    const cb = b[i]
    if (ca.id !== cb.id || ca.position.some((v, k) => v !== cb.position[k])) return false
    const dot = ca.quaternion.reduce((s, v, k) => s + v * cb.quaternion[k], 0)
    return Math.abs(Math.abs(dot) - 1) < 1e-9
  })
