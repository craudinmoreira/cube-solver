# Releases e notas de versão

Inspirado no fluxo do [menew](https://github.com/quost/menew): o CHANGELOG é escrito
para quem usa o app e vira a nota da GitHub Release. A diferença: aqui não há
instalador, a "entrega" é o deploy do webapp, e as notas também aparecem **dentro
do app**, no modal "Novidades".

## Fluxo

```
PR (título em inglês: feat(cube): …)          ← commitlint barra fora do padrão
 └─ descrição com BEGIN_COMMIT_OVERRIDE em pt-BR   ← o texto que entra no CHANGELOG
      │ squash merge
      ▼
master ──► release-please atualiza o Release PR "chore(release): vX.Y.Z"
                │  (versão calculada: feat → minor, fix/perf → patch, ! → major)
                │  revise o CHANGELOG no PR
                ▼ merge
          tag vX.Y.Z + GitHub Release ──► deploy em produção (aprovação) ──► link na Release
```

| Tipo do commit | Seção no CHANGELOG | Versão |
|---|---|---|
| `feat` | Novidades | minor |
| `fix` | Correções | patch |
| `perf` | Desempenho | patch |
| `feat!` ou `BREAKING CHANGE:` | (na seção do tipo) | major |
| `docs`, `test`, `ci`, `chore`, `refactor`, `build`, `style` | não aparecem | — |

## Commits em inglês, notas em português

O título do PR (e o commit do squash) segue o Conventional Commits em **inglês**.
A nota para o usuário vai em **pt-BR** na descrição do PR, no bloco que o
release-please usa no lugar da mensagem do commit:

```
BEGIN_COMMIT_OVERRIDE
feat(cube): **Modo treino.** Mostra qual peça mover em seguida e por quê.
fix(ui): O histórico volta a rolar até o último movimento no celular.
END_COMMIT_OVERRIDE
```

- Uma linha por item, no formato `tipo(escopo): texto`. Um PR pode gerar vários itens, ou nenhum.
- Mudança invisível para o usuário (CI, testes, docs): use um tipo oculto (`chore: …`) ou omita o bloco.
- Esqueceu? Edite a descrição do PR **depois do merge**: o release-please relê o bloco na próxima execução.

## No app

- O chip `vX.Y.Z` no cabeçalho abre "Novidades" com a seção da versão atual.
- Quem volta depois de uma atualização vê o modal sozinho, com tudo o que mudou desde a última versão vista (guardada no `localStorage`). Na primeira visita ele não aparece.
- O texto vem do `CHANGELOG.md` no build. O parser (`src/release/changelog.ts`) não gera HTML, só aceita links `https` e funciona sob a CSP.

## Primeira release

`release-please-config.json` está com `"release-as": "1.0.0"`, para a primeira
versão sair como **1.0.0**. Depois que ela sair, remova essa linha num PR `chore(release)`;
a partir daí a versão é calculada pelos commits.

## Token do release-please

Um PR criado com o `GITHUB_TOKEN` não dispara workflows, e aí o check obrigatório
"CI ok" nunca rodaria no Release PR. Crie um **fine-grained PAT** só para este
repositório, com *Contents: read/write* e *Pull requests: read/write*, e salve como
secret `RELEASE_PLEASE_TOKEN`. Sem ele, o fluxo funciona, mas é preciso fechar e
reabrir o Release PR para o CI rodar.

## Rollback

Actions › **Deploy production (manual)** › *Run workflow* › em "Use workflow from", escolha a **tag** anterior
(ou `gh workflow run deploy-production.yml --ref v1.1.0`). Passa pela
mesma aprovação do environment `production`.
