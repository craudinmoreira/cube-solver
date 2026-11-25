---
name: feature
description: Leva uma mudança no cube-solver (feature, correção, melhoria de performance) do pedido ao PR aberto, passando por branch, testes, gate local, auto-revisão e nota de versão em pt-BR. Use quando a pessoa pedir para implementar, corrigir ou melhorar algo no app.
---

# Mudança ponta a ponta

Siga o `AGENTS.md` (regras, arquitetura, segurança). Este é o roteiro.

## 1. Entender e fatiar

- Releia o pedido. Se faltar uma decisão de produto (texto da interface, comportamento visível), pergunte antes de codar.
- Uma mudança por PR. Se o pedido tiver partes independentes, proponha PRs separados (em stack, se dependerem um do outro).

## 2. Branch

```bash
git switch master && git pull --ff-only
git switch -c <tipo>/<descricao-curta>   # feat/, fix/, perf/, refactor/, docs/, ci/, chore/
```

## 3. Testes primeiro

- Lógica (`src/utils`, `src/store`, `src/release`): escreva o teste que falha antes do código.
- Componente DOM: Testing Library, consultando por papel e rótulo (`getByRole`, `getByLabelText`).
- WebGL ou mudança visual: caso em `e2e/app.spec.ts`; confira desktop e mobile.

## 4. Implementar

Respeite as regras de arquitetura do `AGENTS.md`: three.js só em `components/Cube/`, nada de `setState` por frame, seletores no Zustand, sem `innerHTML`, sem recursos de terceiros, textos em pt-BR, cores pelas variáveis do tema.

## 5. Gate local

```bash
npm run lint -- --max-warnings=0
npm run typecheck
npm run test:coverage
npm run build && npm run size
npm run test:e2e        # ou npm run test:e2e:docker
```

Se algo falhar, corrija a causa. Nunca pule hooks nem baixe limites (cobertura, bundle) para fazer passar. Se um limite precisar mudar, explique o motivo no PR.

## 6. Commits

Conventional Commits em inglês, um assunto por commit: `feat(cube): add training mode`. O hook roda gitleaks, ESLint, os testes relacionados e o commitlint.

## 7. Auto-revisão

Rode `/code-review` sobre o diff e corrija o que for real. Mudança em workflow, deploy ou dependência: rode também `/security-review`.

## 8. PR

```bash
git push -u origin HEAD
gh pr create --base master --title "<tipo>(<escopo>): <resumo em inglês>" --body-file <arquivo>
```

Preencha o template (`.github/pull_request_template.md`):

- **O que muda** e **Como validei**, com números quando houver (testes, bundle, screenshots).
- **Nota de versão (pt-BR)** no bloco `BEGIN_COMMIT_OVERRIDE`, escrita para quem usa o app: o que a pessoa ganha, não o que mudou no código. Mudança invisível: apague o bloco.

Depois acompanhe o CI (`gh pr checks --watch`) e o preview `pr-<n>`. Não faça merge: isso é da pessoa.
