import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCubeStore } from './useCubeStore'
import { getInitialCubies, isCubeSolved } from '../utils/cubeLogic'
import { SOLVED_STATE } from '../test/cube'

const store = () => useCubeStore.getState()

/** Conclui animações até a fila esvaziar, como o useFrame faria. */
const drain = (limit = 200) => {
  for (let i = 0; i < limit && store().isAnimating; i++) store().finishAnimation()
}

describe('useCubeStore', () => {
  beforeEach(() => {
    store().clearCubeColors()
    useCubeStore.setState({ showFaceLabels: false })
  })

  it('addMove inicia a animação e registra no histórico', () => {
    store().addMove('R')
    expect(store()).toMatchObject({ isAnimating: true, currentMove: 'R', history: ['R'] })
  })

  it('ignora movimentos enquanto anima', () => {
    store().addMove('R')
    store().addMove('U')
    expect(store().history).toEqual(['R'])
  })

  it('finishAnimation aplica a rotação e libera o cubo', () => {
    store().addMove('R')
    store().finishAnimation()
    expect(store().isAnimating).toBe(false)
    expect(isCubeSolved(store().cubies)).toBe(false)
  })

  it('finishAnimation sem movimento só encerra a animação', () => {
    useCubeStore.setState({ isAnimating: true, currentMove: null })
    store().finishAnimation()
    expect(store().isAnimating).toBe(false)
  })

  it('undo e redo andam pelo histórico', () => {
    store().addMove('R')
    drain()
    store().undo()
    expect(store().currentMove).toBe("R'")
    drain()
    expect(store().history).toEqual([])
    expect(store().redoHistory).toEqual(['R'])
    expect(isCubeSolved(store().cubies)).toBe(true)

    store().redo()
    drain()
    expect(store().history).toEqual(['R'])
    expect(store().redoHistory).toEqual([])
  })

  it('undo e redo sem histórico não fazem nada', () => {
    store().undo()
    store().redo()
    expect(store().isAnimating).toBe(false)
  })

  it('novo movimento limpa o redo', () => {
    store().addMove('R')
    drain()
    store().undo()
    drain()
    store().addMove('U')
    expect(store().redoHistory).toEqual([])
  })

  it('shuffle enfileira 20 movimentos', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0) // sempre "U"
    store().shuffle()
    expect(store().moveQueue).toHaveLength(19)
    drain()
    expect(store().history).toHaveLength(20)
    expect(store().moveQueue).toEqual([])
  })

  it('reset desfaz tudo, animado, até resolver', () => {
    store().executeSequence(['R', 'U', "F'"])
    drain()
    store().reset()
    expect(store().isResetting).toBe(true)
    drain()
    expect(store().isResetting).toBe(false)
    expect(store().history).toEqual([])
    expect(isCubeSolved(store().cubies)).toBe(true)
  })

  it('reset sem histórico não faz nada', () => {
    store().reset()
    expect(store().isResetting).toBe(false)
  })

  it('executeSequence ignora sequência vazia e bloqueia durante a fila', () => {
    store().executeSequence([])
    expect(store().isAnimating).toBe(false)
    store().executeSequence(['R', 'U'])
    store().executeSequence(['F'])
    expect(store().moveQueue).toEqual(['U'])
  })

  it('applyCubeState aplica cores válidas e ignora inválidas', () => {
    store().applyCubeState('inválida')
    expect(store().cubies).toEqual(getInitialCubies())
    store().applyCubeState(SOLVED_STATE)
    expect(store().cubies[0].faceColors).toBeDefined()
  })

  it('toggleFaceLabels alterna as letras', () => {
    store().toggleFaceLabels()
    expect(store().showFaceLabels).toBe(true)
  })
})
