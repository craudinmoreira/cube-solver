#!/usr/bin/env node
// Hook PreToolUse do Claude Code: barra o acesso a segredos e os atalhos que
// furam o gate (hooks do git, force push, deploy manual, mexer em secrets).
// Saída 2 = bloqueia; a mensagem no stderr volta para o agente.
import { readFileSync } from 'node:fs'

const input = JSON.parse(readFileSync(0, 'utf8'))
const tool = input.tool_name
const args = input.tool_input ?? {}

// Arquivos que nunca devem ser lidos nem escritos por um agente.
const SECRET_FILE = /(^|[\\/])(\.env(\.(?!example$)[\w.-]+)?|[^\\/]*\.(pem|key|p12|pfx)|[^\\/]*service-account[^\\/]*\.json|[^\\/]*-credentials\.json|gha-creds-[^\\/]*\.json)$/i

// Comandos de shell barrados, com o motivo.
const BLOCKED_COMMANDS = [
  [/\bgit\b[^\n|;&]*\s--no-verify\b|\bgit\s+commit\b[^\n|;&]*\s-n\b/, 'não pule os hooks do git (gitleaks, lint, commitlint). Corrija a causa da falha.'],
  [/\bHUSKY=0\b/, 'não desligue o husky.'],
  [/\bgit\s+push\b[^\n|;&]*(\s--force(?!-with-lease)\b|\s-f\b)/, 'force push reescreve histórico publicado. Peça à pessoa.'],
  [/\bgit\s+push\b[^\n|;&]*\s(origin\s+)?(HEAD:)?master\b/, 'a master só recebe PR. Abra um PR.'],
  [/\bfirebase(-tools)?(@[\w.]+)?\s+(deploy|hosting:channel:deploy)\b/, 'deploy é feito pelo CI (docs/deploy.md).'],
  [/\bgh\s+secret\s+(set|delete|remove)\b/, 'secrets são geridos pela pessoa, não pelo agente.'],
  [/\bgit\s+tag\b[^\n|;&]*\bv\d/, 'tags de versão são criadas pelo release-please.'],
  [/\bgit\s+config\b[^\n|;&]*core\.hooksPath/, 'não altere o caminho dos hooks.'],
  [/\b(cat|less|more|head|tail|bat|nl|strings|xxd|base64|cp|scp|curl)\b[^\n|;&]*(^|[\s'"=/])\.env(?!\.example)(\.[\w.-]+)?(\s|$|['"])/, 'não leia nem copie arquivos .env.'],
]

const block = (reason) => {
  console.error(`Bloqueado pelo guard do projeto: ${reason}`)
  process.exit(2)
}

if (tool === 'Bash') {
  const command = String(args.command ?? '')
  for (const [pattern, reason] of BLOCKED_COMMANDS) if (pattern.test(command)) block(reason)
  for (const token of command.split(/[\s'"=<>|;&()]+/)) {
    if (SECRET_FILE.test(token) && /\b(cat|less|more|head|tail|bat|nl|strings|xxd|base64|cp|scp|curl|source|\.)\b/.test(command)) {
      block(`acesso a arquivo de segredo (${token}).`)
    }
  }
} else {
  const path = String(args.file_path ?? args.notebook_path ?? args.path ?? '')
  if (path && SECRET_FILE.test(path)) block(`arquivo de segredo (${path}). Peça à pessoa o que precisar.`)
}
process.exit(0)
