import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CubeStateInput } from './CubeStateInput'
import { SolutionInput } from './SolutionInput'
import { HistoryPanel } from './HistoryPanel'
import { useCubeStore } from '../../store/useCubeStore'
import { SOLVED_STATE } from '../../test/cube'

const store = () => useCubeStore.getState()
const drain = () => {
  for (let i = 0; i < 100 && store().isAnimating; i++) store().finishAnimation()
}

beforeEach(() => store().clearCubeColors())

describe('CubeStateInput', () => {
  it('mostra contador, erro e desabilita aplicar enquanto inválido', async () => {
    render(<CubeStateInput />)
    await userEvent.type(screen.getByLabelText(/Estado do cubo/), 'wwx')
    expect(screen.getByText('3/54')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('54 caracteres')
    expect(screen.getByRole('button', { name: 'Aplicar cores' })).toBeDisabled()
  })

  it('normaliza minúsculas e espaços e aplica o estado', async () => {
    render(<CubeStateInput />)
    const field = screen.getByLabelText(/Estado do cubo/)
    await userEvent.click(field)
    await userEvent.paste(SOLVED_STATE.toLowerCase().replace(/(.{9})/g, '$1 '))
    expect(screen.getByText('54/54')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Aplicar cores' }))
    expect(store().cubies[0].faceColors).toBeDefined()
  })

  it('resetar limpa o campo e as cores', async () => {
    store().applyCubeState(SOLVED_STATE)
    render(<CubeStateInput />)
    await userEvent.type(screen.getByLabelText(/Estado do cubo/), 'W')
    await userEvent.click(screen.getByRole('button', { name: 'Resetar' }))
    expect(screen.getByLabelText(/Estado do cubo/)).toHaveValue('')
    expect(store().cubies[0].faceColors).toBeUndefined()
  })
})

describe('SolutionInput', () => {
  it('mostra erro para movimento inválido', async () => {
    render(<SolutionInput />)
    await userEvent.type(screen.getByLabelText('Sequência de movimentos'), 'R Q')
    expect(screen.getByRole('alert')).toHaveTextContent('Movimento inválido: "Q"')
    expect(screen.getByRole('button', { name: /Executar/ })).toBeDisabled()
  })

  it('executa a sequência e mostra o progresso', async () => {
    render(<SolutionInput />)
    await userEvent.type(screen.getByLabelText('Sequência de movimentos'), 'R Ui F2')
    expect(screen.getByText('3')).toBeInTheDocument() // contador
    await userEvent.click(screen.getByRole('button', { name: /Executar/ }))
    expect(store().currentMove).toBe('R')
    expect(screen.getByRole('button', { name: /Executando \(3\)/ })).toBeDisabled()
  })

  it('limpar esvazia o campo', async () => {
    render(<SolutionInput />)
    const field = screen.getByLabelText('Sequência de movimentos')
    await userEvent.type(field, 'R')
    await userEvent.click(screen.getByRole('button', { name: 'Limpar' }))
    expect(field).toHaveValue('')
  })
})

describe('HistoryPanel', () => {
  it('mostra o estado vazio', () => {
    render(<HistoryPanel />)
    expect(screen.getByText('Nenhum movimento ainda')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Desfazer' })).toBeDisabled()
  })

  it('lista movimentos, desfaz, refaz e limpa', async () => {
    store().executeSequence(['R', "U'"])
    drain()
    render(<HistoryPanel />)
    expect(screen.getByText('U′')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Desfazer' }))
    drain()
    expect(screen.getByTitle('Pode ser refeito')).toHaveTextContent('U′')

    await userEvent.click(screen.getByRole('button', { name: 'Refazer' }))
    drain()
    expect(store().history).toEqual(['R', "U'"])

    await userEvent.click(screen.getByRole('button', { name: /Limpar histórico/ }))
    expect(screen.getByText('Nenhum movimento ainda')).toBeInTheDocument()
  })
})
