// Escreve a tabela de cobertura no resumo do job do GitHub Actions.
import { appendFileSync, readFileSync } from 'node:fs'

const { total } = JSON.parse(readFileSync('coverage/coverage-summary.json', 'utf8'))
const rows = ['lines', 'branches', 'functions', 'statements'].map((k) => `| ${k} | ${total[k].pct}% |`)
const md = ['### Cobertura', '| métrica | % |', '|---|---|', ...rows].join('\n') + '\n'
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md)
else console.log(md)
