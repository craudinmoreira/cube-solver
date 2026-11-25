import { describe, expect, it } from 'vitest'
import { compareVersions, parseChangelog, parseInline, releasesSince } from './changelog'

const SAMPLE = `# Changelog

Texto de introdução que não pertence a nenhuma versão.

## [1.2.0](https://github.com/o/r/compare/v1.1.0...v1.2.0) (2026-12-10)


### Novidades

* **Modo treino.** Mostra a próxima peça ([#12](https://github.com/o/r/issues/12)) ([abc1234](https://github.com/o/r/commit/abc1234))
* Atalho \`R\` no teclado

### Correções

- Link [seguro](https://exemplo.com) e [inseguro](javascript:alert(1))

## [1.1.0](https://github.com/o/r/compare/v1.0.0...v1.1.0) (2026-12-01)

### Desempenho

* Cubo 4× mais leve

## 1.0.0 (2026-11-25)

### Novidades

* Primeira versão
`

describe('parseChangelog', () => {
  const releases = parseChangelog(SAMPLE)

  it('separa as versões, com data, ignorando o texto antes delas', () => {
    expect(releases.map((r) => [r.version, r.date])).toEqual([
      ['1.2.0', '2026-12-10'],
      ['1.1.0', '2026-12-01'],
      ['1.0.0', '2026-11-25'],
    ])
  })

  it('lê seções e itens com * ou -', () => {
    expect(releases[0].blocks.map((b) => b.type)).toEqual(['heading', 'item', 'item', 'heading', 'item'])
  })

  it('remove as referências de PR e commit', () => {
    const item = releases[0].blocks[1]
    expect(item).toEqual({
      type: 'item',
      content: [
        { type: 'strong', text: 'Modo treino.' },
        { type: 'text', text: ' Mostra a próxima peça' },
      ],
    })
  })
})

describe('parseInline', () => {
  it('mantém só links https', () => {
    expect(parseInline('[a](https://x.dev) e [b](javascript:alert(1))')).toEqual([
      { type: 'link', text: 'a', href: 'https://x.dev' },
      { type: 'text', text: ' e ' },
      { type: 'text', text: 'b' },
      { type: 'text', text: ')' },
    ])
  })

  it('lê código inline', () => {
    expect(parseInline('tecla `R`')).toEqual([
      { type: 'text', text: 'tecla ' },
      { type: 'code', text: 'R' },
    ])
  })
})

describe('versões', () => {
  it.each([
    ['1.0.0', '1.0.0', 0],
    ['1.2.0', '1.10.0', -1],
    ['2.0.0', '1.9.9', 1],
    ['1.0.0-rc.1', '1.0.0', 0],
  ])('compareVersions(%s, %s)', (a, b, sign) => {
    expect(Math.sign(compareVersions(a, b))).toBe(sign)
  })

  it('releasesSince lista o que mudou desde a última vista, até a atual', () => {
    const releases = parseChangelog(SAMPLE)
    expect(releasesSince(releases, '1.2.0', '1.0.0').map((r) => r.version)).toEqual(['1.2.0', '1.1.0'])
    expect(releasesSince(releases, '1.1.0', '1.0.0').map((r) => r.version)).toEqual(['1.1.0'])
    expect(releasesSince(releases, '1.2.0').map((r) => r.version)).toHaveLength(3)
  })
})
