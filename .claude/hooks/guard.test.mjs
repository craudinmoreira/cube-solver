// @vitest-environment node
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const GUARD = join(import.meta.dirname, 'guard.mjs')
const run = (tool_name, tool_input) =>
  spawnSync('node', [GUARD], { input: JSON.stringify({ tool_name, tool_input }), encoding: 'utf8' })

describe('guard: comandos', () => {
  it.each([
    'git commit --no-verify -m "x"',
    'git commit -n -m x',
    'HUSKY=0 git commit -m x',
    'git push --force origin feat/x',
    'git push -f',
    'git push origin master',
    'git push origin HEAD:master',
    'npx firebase-tools@15.37.0 deploy --only hosting',
    'firebase hosting:channel:deploy pr-1',
    'gh secret set TOKEN --body x',
    'git tag v1.2.0',
    'git config core.hooksPath /dev/null',
    'cat .env',
    'cat .env.local',
    'head -n 3 ./config/.env.production',
    'cp service-account.json /tmp/',
    'cat key.pem',
  ])('bloqueia: %s', (command) => {
    const r = run('Bash', { command })
    expect(r.status).toBe(2)
    expect(r.stderr).toMatch(/Bloqueado pelo guard/)
  })

  it.each([
    'npm run test:coverage',
    'git push -u origin feat/novo-modo',
    'git push --force-with-lease origin feat/x',
    'git commit -m "feat(cube): add x"',
    'cat .env.example',
    'gh pr view 3',
    'grep -rn "env" src',
    'git log --oneline',
  ])('permite: %s', (command) => {
    expect(run('Bash', { command }).status).toBe(0)
  })
})

describe('guard: arquivos', () => {
  it.each(['.env', '/repo/.env.local', 'certs/server.pem', 'id.key', 'firebase-service-account.json', 'gha-creds-123.json'])(
    'bloqueia ler/escrever %s',
    (file_path) => {
      expect(run('Read', { file_path }).status).toBe(2)
      expect(run('Write', { file_path, content: 'x' }).status).toBe(2)
    },
  )

  it.each(['.env.example', 'src/App.tsx', 'docs/deploy.md', 'keyboard.ts', 'src/environment.ts'])('permite %s', (file_path) => {
    expect(run('Read', { file_path }).status).toBe(0)
  })
})
