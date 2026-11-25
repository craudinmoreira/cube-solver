# Instruções para o GitHub Copilot

As regras do projeto estão em [`AGENTS.md`](../AGENTS.md), a fonte única para todos os agentes. Leia-o antes de sugerir mudanças. O essencial:

- Commits e títulos de PR em Conventional Commits, **em inglês**. A nota de versão vai em **pt-BR** no bloco `BEGIN_COMMIT_OVERRIDE` da descrição do PR.
- Teste junto com o código (Vitest; E2E com Playwright para WebGL e mudanças visuais).
- Three.js só em `src/components/Cube/`; animação em `ref`, nunca `setState` por frame; seletores do Zustand sempre.
- Nunca leia nem commite `.env*`, chaves ou credenciais; nunca use `--no-verify`.
- Sem `innerHTML`, sem recursos de terceiros (a CSP é `'self'`).
