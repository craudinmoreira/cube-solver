import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Layout } from './Layout'
import { useCubeStore } from '../../store/useCubeStore'
import { useAnimationSpeed } from '../../store/useAnimationSpeed'
import { useThemeStore } from '../../store/useThemeStore'

const store = () => useCubeStore.getState()

beforeEach(() => {
  store().clearCubeColors()
  useThemeStore.setState({ theme: 'dark' })
})

const renderLayout = () => render(<Layout><div data-testid="canvas" /></Layout>)
const movesCard = () => screen.getAllByRole('button', { name: 'Movimento R' })[0]

describe('Layout', () => {
  it('renderiza o conteúdo e o status inicial', () => {
    renderLayout()
    expect(screen.getByTestId('canvas')).toBeInTheDocument()
    expect(screen.getByText('Resolvido')).toBeInTheDocument()
  })

  it('alterna o tema e marca o <html>', async () => {
    renderLayout()
    await userEvent.click(screen.getByRole('button', { name: 'Mudar para tema claro' }))
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
  })

  it('abre e fecha as gavetas no mobile, inclusive com Esc', async () => {
    const { container } = renderLayout()
    await userEvent.click(screen.getByRole('button', { name: 'Abrir estado e sequência' }))
    expect(container.querySelector('.left-drawer')).toHaveClass('open')
    await userEvent.keyboard('{Escape}')
    expect(container.querySelector('.left-drawer')).not.toHaveClass('open')

    await userEvent.click(screen.getByRole('button', { name: 'Abrir histórico' }))
    expect(container.querySelector('.right-drawer')).toHaveClass('open')
    await userEvent.click(container.querySelector('.overlay-backdrop')!)
    expect(container.querySelector('.right-drawer')).not.toHaveClass('open')
  })
})

describe('Controls', () => {
  it('aplica movimento ao clicar e mostra a contagem', async () => {
    renderLayout()
    await userEvent.click(movesCard())
    expect(store().currentMove).toBe('R')
    store().finishAnimation()
    expect(await screen.findByText('1 movimento')).toBeInTheDocument()
  })

  it('expande os grupos de movimentos', async () => {
    renderLayout()
    const [toggle] = screen.getAllByRole('button', { name: /Mais movimentos/ })
    await userEvent.click(toggle)
    const [tabs] = screen.getAllByRole('tablist')
    await userEvent.click(within(tabs).getByRole('tab', { name: 'Fatias' }))
    expect(within(tabs).getByRole('tab', { name: 'Fatias' })).toHaveAttribute('aria-selected', 'true')
    await userEvent.click(screen.getAllByRole('button', { name: 'Movimento M' })[0])
    expect(store().currentMove).toBe('M')
    await userEvent.click(screen.getAllByRole('button', { name: /Menos movimentos/ })[0])
  })
})

describe('FloatingControls', () => {
  it('embaralha, mostra letras e ajusta a velocidade', async () => {
    renderLayout()
    await userEvent.click(screen.getByRole('button', { name: 'Embaralhar aleatoriamente' }))
    expect(store().moveQueue).toHaveLength(19)
    expect(screen.getByRole('button', { name: 'Resetar cubo' })).toBeDisabled()

    await userEvent.click(screen.getByRole('button', { name: 'Mostrar letras das faces' }))
    expect(store().showFaceLabels).toBe(true)

    const slider = screen.getByRole('slider', { name: 'Velocidade da animação' })
    // jsdom não implementa o teclado em <input type=range>
    fireEvent.change(slider, { target: { value: '4.5' } })
    expect(useAnimationSpeed.getState().speed).toBe(4.5)
    expect(screen.getByText('4.5×')).toBeInTheDocument()
  })
})
