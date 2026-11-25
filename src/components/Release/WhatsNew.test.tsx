import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Layout } from '../UI/Layout'

vi.mock('../../../CHANGELOG.md?raw', () => ({
  default: `# Changelog

## [1.2.0](https://github.com/o/r/compare/v1.1.0...v1.2.0) (2026-12-10)

### Novidades

* **Modo treino.** Veja o [guia](https://exemplo.com/guia) e use \`R\`

## [1.1.0](https://github.com/o/r/compare/v1.0.0...v1.1.0) (2026-12-01)

### Correções

* Histórico rola até o fim
`,
}))

const KEY = 'cube-solver:last-seen-version'
const renderLayout = () => render(<Layout><div /></Layout>)

describe('Novidades', () => {
  beforeEach(() => localStorage.clear())

  it('primeira visita: não abre sozinho, só guarda a versão', () => {
    renderLayout()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(localStorage.getItem(KEY)).toBe('1.2.0')
  })

  it('o chip de versão abre as notas da versão atual e Esc fecha', async () => {
    renderLayout()
    await userEvent.click(screen.getByRole('button', { name: 'Novidades da versão 1.2.0' }))
    const dialog = await screen.findByRole('dialog', { name: /Novidades/ })
    expect(dialog).toHaveTextContent('Modo treino.')
    expect(dialog).not.toHaveTextContent('Histórico rola')
    expect(screen.getByRole('link', { name: 'guia' })).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.getByText('build abc1234')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('button', { name: 'Fechar novidades' })).toHaveFocus())
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('depois de uma atualização: abre sozinho com tudo desde a última vista', async () => {
    localStorage.setItem(KEY, '1.0.0')
    renderLayout()
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveTextContent('v1.2.0')
    expect(dialog).toHaveTextContent('v1.1.0')
    expect(dialog).toHaveTextContent('Histórico rola até o fim')
    await userEvent.click(screen.getByRole('button', { name: 'Fechar novidades' }))
    expect(localStorage.getItem(KEY)).toBe('1.2.0')
  })

  it('sem localStorage, o app funciona e não abre o modal', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })
    renderLayout()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
