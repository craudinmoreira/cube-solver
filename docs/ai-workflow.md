# Desenvolvimento assistido por IA

Como agentes (Claude Code, Codex, Cursor, Copilot) trabalham neste repositório sem
furar os gates de qualidade e segurança. A ideia central: **o agente acelera, os
gates decidem**. Nenhuma regra depende só de o agente "lembrar"; cada uma é
verificada por uma camada que roda de qualquer jeito.

## Camadas

```
            instrução                      verificação automática
┌────────────────────────────┐   ┌──────────────────────────────────────────────┐
│ AGENTS.md (fonte única)    │   │ 1. Agente   .claude/hooks/guard.mjs          │
│  ├ CLAUDE.md  (@AGENTS.md) │   │             permissions.deny (segredos)      │
│  ├ copilot-instructions.md │   │ 2. Commit   husky: gitleaks · ESLint ·       │
│  └ Codex/Cursor: nativo    │   │             testes relacionados · commitlint │
│ Skills: /feature /release  │   │ 3. Push     typecheck · cobertura            │
│         /security-audit    │   │ 4. PR       CI ok · CodeQL · E2E · audit ·   │
│ Template de PR             │   │             bundle · título · preview        │
└────────────────────────────┘   │ 5. Merge    ruleset: PR + CI ok + review     │
                                 │ 6. Release  Release PR revisado · aprovação  │
                                 │             do environment production        │
                                 └──────────────────────────────────────────────┘
```

| Regra | Onde está escrita | Quem garante |
|---|---|---|
| Sem segredo no repositório | AGENTS.md › Segurança | guard (agente), gitleaks (commit e CI), push protection (GitHub) |
| Sem pular hooks / force push / deploy manual | AGENTS.md | guard + `permissions.deny` + ruleset da master |
| Conventional Commits em inglês | AGENTS.md › Fluxo | commitlint (commit-msg e CI, inclusive no título do PR) |
| Testes junto com o código | skill `/feature` | piso de cobertura (pre-push e CI) + E2E |
| Three.js fora do caminho inicial | AGENTS.md › Arquitetura | orçamento de bundle `initial` (CI) |
| Sem recurso de terceiros / `innerHTML` | AGENTS.md | CSP em produção + E2E que falha com violação de CSP |
| Actions por SHA, permissões mínimas | AGENTS.md › Segurança | CodeQL (actions) + revisão |
| Nota de versão em pt-BR | template de PR, skill `/release` | revisão do Release PR |
| Produção só por release aprovada | docs/deploy.md | environment `production` |

## Ciclo típico com um agente

1. A pessoa descreve a mudança. O agente segue `/feature`: branch, teste que falha, implementação, gate local.
2. O agente se auto-revisa com `/code-review` (e `/security-review` se tocar workflow, deploy ou dependência).
3. O agente abre o PR pelo template, com a nota de versão em pt-BR, e acompanha o CI e o preview.
4. **A pessoa** revisa e faz o merge. O agente não faz merge.
5. Na hora de lançar, `/release` revisa o Release PR; **a pessoa** faz o merge e aprova a produção.
6. Periodicamente (sugestão: mensal, ou depois de um alerta), `/security-audit`.

## Mudanças grandes

Uma tarefa que vira vários PRs vai **em stack**: cada PR tem como base a branch do
anterior, todos abertos de uma vez. Depois de cada merge, rebase do próximo na `master`.

## Manutenção destas regras

- Regra nova vale para todos os agentes: escreva no `AGENTS.md`. Específico do Claude: `CLAUDE.md` ou `.claude/`.
- Toda regra importante deve ter uma verificação automática na tabela acima. Se não tiver, crie (teste, lint, hook, check) ou assuma que ela será quebrada.
- O guard tem testes (`.claude/hooks/guard.test.mjs`), que rodam junto com o Vitest.
