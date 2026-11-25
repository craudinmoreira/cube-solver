# Contribuindo

Obrigado pelo interesse! As regras completas estão em [`AGENTS.md`](AGENTS.md), que
vale para pessoas e agentes de IA. O resumo:

## Preparar

```bash
nvm install            # Node da versão em .nvmrc
npm install            # instala também os hooks do git (husky)
scripts/install-gitleaks.sh   # opcional: sem ele, o hook usa o Docker
npm run dev
```

## Fazer uma mudança

1. Branch a partir da `master`: `feat/…`, `fix/…`, `perf/…`, `docs/…`.
2. Teste junto com o código (`npm run test:watch`). Mudança visual: confira desktop e mobile.
3. Commits em [Conventional Commits](https://www.conventionalcommits.org), **em inglês**: `feat(cube): add training mode`.
4. Abra o PR pelo template. A **nota de versão em português** vai no bloco `BEGIN_COMMIT_OVERRIDE` (ver [`docs/releases.md`](docs/releases.md)).
5. O CI precisa ficar verde ("CI ok"). Cada PR do próprio repositório ganha um preview com link no PR.

Os hooks barram commits com segredos, lint quebrado ou mensagem fora do padrão. Se
um hook falhar, corrija a causa; não o pule.

## Segurança

Vulnerabilidade? Não abra issue pública. Veja [`SECURITY.md`](SECURITY.md).

## Mais

- [Deploy e runner self-hosted](docs/deploy.md)
- [Releases e notas de versão](docs/releases.md)
- [Desenvolvimento assistido por IA](docs/ai-workflow.md)
