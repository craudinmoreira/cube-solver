// Orçamento de tamanho do bundle (gzip). Falha o CI se o JS ou o CSS inicial
// passarem do limite. Ao baixar o tamanho de propósito, baixe o limite junto.
import { readdirSync, readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { join } from 'node:path'

const BUDGET_KB = { js: 320, css: 8 }
const dir = 'dist/assets'

const totals = { js: 0, css: 0 }
const rows = []
for (const file of readdirSync(dir)) {
  const ext = file.split('.').pop()
  if (!(ext in totals)) continue
  const gz = gzipSync(readFileSync(join(dir, file))).length / 1024
  totals[ext] += gz
  rows.push(`${file.padEnd(40)} ${gz.toFixed(1).padStart(7)} KB`)
}
console.log(rows.sort().join('\n'))

let failed = false
for (const [ext, kb] of Object.entries(totals)) {
  const ok = kb <= BUDGET_KB[ext]
  failed ||= !ok
  console.log(`${ok ? '✔' : '✖'} ${ext}: ${kb.toFixed(1)} KB gzip (limite ${BUDGET_KB[ext]} KB)`)
}
if (process.env.GITHUB_STEP_SUMMARY) {
  const { appendFileSync } = await import('node:fs')
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    `### Bundle (gzip)\n| | tamanho | limite |\n|---|---|---|\n` +
      Object.entries(totals).map(([e, kb]) => `| ${e} | ${kb.toFixed(1)} KB | ${BUDGET_KB[e]} KB |`).join('\n') + '\n',
  )
}
process.exit(failed ? 1 : 0)
