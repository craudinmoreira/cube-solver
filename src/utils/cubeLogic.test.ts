import { describe, expect, it } from 'vitest'
import {
  CUBE_COLOR_MAP,
  applyRotationToCubies,
  formatMove,
  getInitialCubies,
  getInverseMove,
  getMoveFaceColor,
  isCubeSolved,
  moveDetails,
  parseCubeStateString,
  parseSolutionString,
  validateCubeStateString,
  type Move,
} from './cubeLogic'
import { SOLVED_STATE, applyMoves, sameCube } from '../test/cube'

const ALL_MOVES = Object.keys(moveDetails) as Move[]

describe('getInitialCubies', () => {
  it('gera 27 cubies em posições únicas, sem rotação', () => {
    const cubies = getInitialCubies()
    expect(cubies).toHaveLength(27)
    expect(new Set(cubies.map((c) => c.position.join())).size).toBe(27)
    expect(cubies.every((c) => c.quaternion.join() === '0,0,0,1')).toBe(true)
  })

  it('segue a ordem de id usada pelo Cubie: id = (x+1)*9 + (y+1)*3 + (z+1)', () => {
    for (const { id, position: [x, y, z] } of getInitialCubies()) {
      expect(id).toBe((x + 1) * 9 + (y + 1) * 3 + (z + 1))
    }
  })
})

describe('applyRotationToCubies', () => {
  it.each(ALL_MOVES)('%s seguido do inverso volta ao estado inicial', (move) => {
    const initial = getInitialCubies()
    expect(sameCube(applyMoves([move, getInverseMove(move)]), initial)).toBe(true)
  })

  it.each(ALL_MOVES)('%s repetido 4 vezes é a identidade', (move) => {
    expect(sameCube(applyMoves([move, move, move, move]), getInitialCubies())).toBe(true)
  })

  it('(R U R′ U′) × 6 é a identidade', () => {
    const sexy: Move[] = ['R', 'U', "R'", "U'"]
    expect(sameCube(applyMoves(Array(6).fill(sexy).flat()), getInitialCubies())).toBe(true)
  })

  it('só move os cubies da camada girada', () => {
    const after = applyRotationToCubies(getInitialCubies(), 'R')
    const rotated = after.filter((c) => c.quaternion[3] !== 1)
    expect(rotated).toHaveLength(9)
    expect(rotated.every((c) => c.position[0] === 1)).toBe(true)
  })

  it('não altera o array de entrada', () => {
    const initial = getInitialCubies()
    const snapshot = JSON.stringify(initial)
    applyRotationToCubies(initial, 'F')
    expect(JSON.stringify(initial)).toBe(snapshot)
  })

  it('X2, Y2 e Z2 equivalem a dois quartos de volta', () => {
    for (const [half, quarter] of [['X2', 'X'], ['Y2', 'Y'], ['Z2', 'Z']] as [Move, Move][]) {
      expect(sameCube(applyMoves([half]), applyMoves([quarter, quarter]))).toBe(true)
    }
  })
})

describe('getInverseMove', () => {
  it.each([
    ['R', "R'"],
    ["R'", 'R'],
    ['R2', 'R2'],
    ['R3', 'R'],
    ['u', "u'"],
  ] as [Move, Move][])('%s → %s', (move, inverse) => {
    expect(getInverseMove(move)).toBe(inverse)
  })
})

describe('isCubeSolved', () => {
  it('cubo inicial está resolvido', () => {
    expect(isCubeSolved(getInitialCubies())).toBe(true)
  })

  it('um movimento de face desfaz o estado resolvido', () => {
    expect(isCubeSolved(applyMoves(['R']))).toBe(false)
  })

  it.each(['X', "Y'", 'Z2'] as Move[])('rotação do cubo inteiro (%s) mantém resolvido', (move) => {
    expect(isCubeSolved(applyMoves([move]))).toBe(true)
  })

  it('respeita as cores aplicadas por string', () => {
    expect(isCubeSolved(parseCubeStateString(SOLVED_STATE)!)).toBe(true)
  })
})

describe('validateCubeStateString', () => {
  it('aceita o cubo resolvido', () => {
    expect(validateCubeStateString(SOLVED_STATE)).toBeNull()
  })

  it('exige 54 caracteres', () => {
    expect(validateCubeStateString('WWW')).toMatch(/exatamente 54 caracteres \(atual: 3\)/)
  })

  it('aponta o caractere inválido e a posição (base 1)', () => {
    const s = 'X' + SOLVED_STATE.slice(1)
    expect(validateCubeStateString(s)).toMatch(/Caractere inválido 'X' na posição 1/)
  })

  it('exige 9 de cada cor', () => {
    const s = 'Y' + SOLVED_STATE.slice(1)
    expect(validateCubeStateString(s)).toMatch(/aparece (8|10) vez\(es\)/)
  })
})

describe('parseCubeStateString', () => {
  it('retorna null para string inválida', () => {
    expect(parseCubeStateString('W'.repeat(54))).toBeNull()
  })

  it('mapeia cada face para o cubie certo', () => {
    // Troca só o adesivo central da face F (índice 12 + 12 + 1 = 25) e o do centro de U (4)
    const s = SOLVED_STATE.split('')
    ;[s[4], s[25]] = [s[25], s[4]]
    const cubies = parseCubeStateString(s.join(''))!
    const at = (x: number, y: number, z: number) =>
      cubies.find((c) => c.position.join() === [x, y, z].join())!
    expect(at(0, 1, 0).faceColors?.top).toBe(CUBE_COLOR_MAP.G)
    expect(at(0, 0, 1).faceColors?.front).toBe(CUBE_COLOR_MAP.W)
    expect(at(1, 0, 0).faceColors?.right).toBe(CUBE_COLOR_MAP.R)
    expect(at(-1, 0, 0).faceColors?.left).toBe(CUBE_COLOR_MAP.O)
    expect(at(0, 0, -1).faceColors?.back).toBe(CUBE_COLOR_MAP.B)
    expect(at(0, -1, 0).faceColors?.bottom).toBe(CUBE_COLOR_MAP.Y)
  })
})

describe('parseSolutionString', () => {
  it('string vazia não é erro', () => {
    expect(parseSolutionString('   ')).toEqual({ moves: [], error: null })
  })

  it('aceita i como inverso, 1 como opcional e vários separadores', () => {
    expect(parseSolutionString("R Ui, F2; M' X1").moves).toEqual([
      'R',
      "U'",
      'F2',
      "M'",
      'X',
    ])
  })

  it('diferencia maiúsculas (face) de minúsculas (wide)', () => {
    expect(parseSolutionString('r ri').moves).toEqual(['r', "r'"])
  })

  it('rejeita token desconhecido e não devolve movimentos parciais', () => {
    const { moves, error } = parseSolutionString('R Q U')
    expect(moves).toEqual([])
    expect(error).toMatch(/Movimento inválido: "Q"/)
  })
})

describe('formatação e cores', () => {
  it('formatMove troca o apóstrofo por prime', () => {
    expect(formatMove("R'")).toBe('R′')
    expect(formatMove('R2')).toBe('R2')
  })

  it.each([
    ['R', CUBE_COLOR_MAP.R],
    ["u'", CUBE_COLOR_MAP.W],
    ['F2', CUBE_COLOR_MAP.G],
    ['M', undefined],
    ['X', undefined],
  ])('getMoveFaceColor(%s)', (move, color) => {
    expect(getMoveFaceColor(move)).toBe(color)
  })
})
