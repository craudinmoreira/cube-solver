# Virtual Cube Solver: regras do projeto para agentes de IA

Fonte única de instruções para qualquer agente (Claude Code, Codex, Cursor, Copilot…).
`CLAUDE.md` e `.github/copilot-instructions.md` apontam para cá; não duplique regras
neles.

Webapp estático (React 19 + Three.js via @react-three/fiber, Zustand, Vite,
TypeScript), público, servido pelo Firebase Hosting em
https://virtual-cube-solver.web.app. Sem backend, sem contas, sem coleta de dados.

## Comandos

| Para | Rode |
|---|---|
| Desenvolver | `npm run dev` |
| Gate rápido (o mesmo do pre-push) | `npm run typecheck && npm run test:coverage` |
| Lint | `npm run lint -- --max-warnings=0` |
| E2E (precisa das libs do Chromium) | `npm run test:e2e`, ou `npm run test:e2e:docker` |
| Build + orçamento de bundle | `npm run build && npm run size` |
| Varredura de segredos no histórico | `npm run secrets` |

Node: versão em `.nvmrc` (22). Os hooks do husky instalam sozinhos no `npm install`.

## Arquitetura

```
src/
  utils/cubeLogic.ts   lógica pura do cubo (movimentos, parser, estado resolvido)
  utils/quat.ts        matemática de quatérnios; NÃO importe three.js em utils/
  store/               Zustand: cubo (fila de animação, undo/redo), tema, velocidade
  components/Cube/     Scene (lazy) › RubiksCube › Cubie: WebGL, coberto pelo E2E
  components/Sidebar/  entrada de estado, sequência, histórico
  components/Release/  modal "Novidades" (lazy), lê o CHANGELOG.md
  release/             parser do CHANGELOG e "última versão vista"
e2e/                   Playwright contra o build de produção sob a CSP real
scripts/               bundle budget, gitleaks, runner self-hosted, setup do GCP
docs/                  deploy, releases, fluxo com IA, auditorias de segurança
```

Regras que os testes e o orçamento de bundle defendem:

- **Three.js só no chunk da cena.** Nada fora de `components/Cube/` importa `three`, `@react-three/*` ou `three-stdlib`. O JS inicial tem limite de 80 KB gzip (`scripts/check-bundle-size.mjs`).
- **Nada de `setState` por frame.** Animação vive em `ref` dentro de `useFrame`, e a velocidade é lida com `useAnimationSpeed.getState()`.
- **Seletores sempre:** `useCubeStore((s) => s.x)` ou `useShallow`, nunca `useCubeStore()` inteiro.
- **Geometrias e materiais compartilhados** em `Cubie.tsx` (`dispose={null}`). Não crie geometria por peça.
- **Sem `innerHTML` / `dangerouslySetInnerHTML`.** A CSP é `script-src 'self'`; nada de recurso de terceiros (fontes vêm do `@fontsource`).

## Fluxo de trabalho

```
issue/pedido ──► branch (feat/…, fix/…, perf/…, ci/…, docs/…, chore/…)
  ──► testes primeiro ──► implementação ──► gate local (hooks)
  ──► PR (template) ──► CI + CodeQL + preview pr-<n> ──► review ──► squash merge
  ──► staging ──► Release PR (release-please) ──► tag ──► produção (aprovação)
```

1. **Nunca trabalhe na `master`.** Ela só recebe PR com o check "CI ok" verde. PRs dependentes podem ser abertos em stack (a base do PR é a branch anterior).
2. **Teste junto com o código.** Lógica e componentes DOM em Vitest (cobertura mínima: 95% de linhas, funções e statements; 90% de branches). Mudança visual ou no WebGL: E2E em `e2e/`.
3. **Commits:** [Conventional Commits](https://www.conventionalcommits.org) em **inglês** (`feat(cube): …`, `fix(ui): …`, `perf: …`). O commitlint barra fora do padrão. Escopos: `cube, ui, store, solver, security, deps, ci, deploy, runner, release, ai, docs`.
4. **PR:** título em Conventional Commits (vira o commit do squash). Na descrição, preencha a **nota de versão em pt-BR** no bloco `BEGIN_COMMIT_OVERRIDE` (ver `docs/releases.md`), escrita para quem usa o app. Se a mudança for invisível ao usuário, apague o bloco.
5. **Release e deploy** são automáticos: não crie tags, não rode `firebase deploy`, não edite o `CHANGELOG.md` à mão fora do Release PR. Detalhes em `docs/releases.md` e `docs/deploy.md`.

## Segurança: inegociável

- **Nunca leia, crie, imprima ou commite** `.env*`, chaves (`*.pem`, `*.key`, `*.p12`), JSON de service account ou tokens. Se precisar de uma credencial, peça à pessoa.
- **Nunca use `--no-verify`** nem desligue o gitleaks, o commitlint ou os hooks. Se um hook falhar, corrija a causa. Falso positivo do gitleaks: fingerprint em `.gitleaksignore`, com justificativa no PR.
- **Nunca reescreva histórico publicado** (`push --force` na master, rebase de branch alheia) sem pedido explícito.
- **Workflows:** toda action fixada por SHA com o comentário da versão; `permissions` mínimas; nunca `pull_request_target`; código de PR nunca roda no runner self-hosted nem num job que tenha credencial (ver `docs/deploy.md`).
- **Dependência nova** só com motivo forte, explicado no PR. Prefira código pequeno e testado (ex.: `utils/quat.ts` no lugar de importar o three.js).
- Achou uma vulnerabilidade? Não abra issue pública: ver `SECURITY.md`.

## Interface

- Textos da interface em **pt-BR**. `aria-label` em todo botão só com ícone.
- Tema claro e escuro: use as variáveis de `:root` em `global.css`, nunca cores soltas.
- Mudança visível ao usuário: confira desktop e mobile (o E2E roda os dois) e escreva a nota de versão.
