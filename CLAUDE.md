@AGENTS.md

## Específico do Claude Code

- `.claude/settings.json` bloqueia a leitura de arquivos de segredo, e `.claude/hooks/guard.mjs` barra comandos perigosos (`--no-verify`, force push, `firebase deploy`, `gh secret`…). Se o hook barrar algo, não contorne: explique à pessoa.
- Skills do projeto: `/feature` (mudança ponta a ponta até o PR), `/release` (revisar o Release PR e as notas) e `/security-audit` (auditoria periódica).
- Antes de abrir o PR, rode `/code-review` sobre o diff e corrija o que for real.
