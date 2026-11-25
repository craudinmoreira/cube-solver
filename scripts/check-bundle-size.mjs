// Orçamento de tamanho do bundle (gzip). Falha o CI se algum limite estourar.
//  - initial: JS que o index.html carrega de cara (script + modulepreload).
//    É o que atrasa a interface aparecer.
//  - js / css: tudo que o app pode baixar, inclusive a cena 3D sob demanda.
// Ao baixar o tamanho de propósito, baixe o limite junto.
import { appendFileSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

const BUDGET_KB = { initial: 80, js: 320, css: 8 }
const dir = 'dist/assets'

const gz = (file) => gzipSync(readFileSync(join(dir, file))).length / 1024

const html = readFileSync('dist/index.html', 'utf8')
const initialFiles = [...html.matchAll(/(?:src|href)="\/assets\/([^"]+\.js)"/g)].map((m) => m[1])

const totals = { initial: 0, js: 0, css: 0 }
const rows = []
for (const file of readdirSync(dir).sort()) {
  const ext = file.split('.').pop()
  if (ext !== 'js' && ext !== 'css') continue
  const kb = gz(file)
  totals[ext] += kb
  const initial = initialFiles.includes(file)
  if (initial) totals.initial += kb
  rows.push(`${file.padEnd(36)} ${kb.toFixed(1).padStart(7)} KB${initial ? '  (inicial)' : ''}`)
}
console.log(rows.join('\n'))

let failed = false
for (const [key, kb] of Object.entries(totals)) {
  const ok = kb <= BUDGET_KB[key]
  failed ||= !ok
  console.log(`${ok ? '✔' : '✖'} ${key}: ${kb.toFixed(1)} KB gzip (limite ${BUDGET_KB[key]} KB)`)
}

if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    '### Bundle (gzip)\n| | tamanho | limite |\n|---|---|---|\n' +
      Object.entries(totals)
        .map(([key, kb]) => `| ${key} | ${kb.toFixed(1)} KB | ${BUDGET_KB[key]} KB |`)
        .join('\n') +
      '\n',
  )
}
process.exit(failed ? 1 : 0)
