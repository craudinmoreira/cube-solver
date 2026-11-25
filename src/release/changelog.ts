// Parser mínimo do CHANGELOG.md (formato do release-please) para o modal
// "Novidades". Produz uma estrutura de dados, não HTML: o React renderiza os
// textos escapados, sem innerHTML, e só aceita links https.

export type Inline =
  | { type: 'text'; text: string }
  | { type: 'strong'; text: string }
  | { type: 'code'; text: string }
  | { type: 'link'; text: string; href: string }

export type Block = { type: 'heading'; text: string } | { type: 'item'; content: Inline[] }

export interface Release {
  version: string
  date?: string
  blocks: Block[]
}

const VERSION_HEADING = /^##\s+\[?(\d+\.\d+\.\d+(?:-[\w.]+)?)\]?(?:\([^)]*\))?\s*(?:\((\d{4}-\d{2}-\d{2})\))?/
// Referências que só interessam no GitHub: "([abc1234](…))" e "([#12](…))"
const REFERENCE_LINKS = /\s*\(\[(?:[0-9a-f]{7,40}|#\d+)\]\([^)]*\)\)/g
const INLINE = /\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)/g

export const parseInline = (source: string): Inline[] => {
  const text = source.replace(REFERENCE_LINKS, '').trim()
  const out: Inline[] = []
  let last = 0
  for (const m of text.matchAll(INLINE)) {
    if (m.index > last) out.push({ type: 'text', text: text.slice(last, m.index) })
    if (m[1] !== undefined) out.push({ type: 'strong', text: m[1] })
    else if (m[2] !== undefined) out.push({ type: 'code', text: m[2] })
    else if (/^https:\/\//.test(m[4])) out.push({ type: 'link', text: m[3], href: m[4] })
    else out.push({ type: 'text', text: m[3] })
    last = m.index + m[0].length
  }
  if (last < text.length) out.push({ type: 'text', text: text.slice(last) })
  return out
}

export const parseChangelog = (markdown: string): Release[] => {
  const releases: Release[] = []
  let current: Release | undefined
  for (const raw of markdown.split(/\r?\n/)) {
    const line = raw.trim()
    const version = VERSION_HEADING.exec(line)
    if (version) {
      current = { version: version[1], date: version[2], blocks: [] }
      releases.push(current)
    } else if (!current || !line) {
      continue
    } else if (line.startsWith('### ')) {
      current.blocks.push({ type: 'heading', text: line.slice(4).trim() })
    } else if (/^[*-]\s+/.test(line)) {
      current.blocks.push({ type: 'item', content: parseInline(line.replace(/^[*-]\s+/, '')) })
    }
  }
  return releases
}

/** Compara versões semânticas X.Y.Z (pré-releases contam como a versão base). */
export const compareVersions = (a: string, b: string): number => {
  const pa = a.split(/[.-]/).slice(0, 3).map(Number)
  const pb = b.split(/[.-]/).slice(0, 3).map(Number)
  for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pa[i] - pb[i]
  return 0
}

/** Releases mais novas que `seen` e até `current`, da mais nova para a mais antiga. */
export const releasesSince = (releases: Release[], current: string, seen?: string) =>
  releases.filter(
    (r) => compareVersions(r.version, current) <= 0 && (!seen || compareVersions(r.version, seen) > 0),
  )
