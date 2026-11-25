---
name: release
description: Revisa o Release PR do release-please do cube-solver antes do merge, conferindo versão, CHANGELOG em pt-BR, notas faltando e estado do CI, e acompanha o deploy de produção depois. Use quando a pessoa pedir para "lançar", "fazer release", "revisar as notas" ou "publicar a versão".
---

# Release

O fluxo completo está em `docs/releases.md`. Você **não** cria tags, **não** roda deploy e **não** faz merge: o release-please e o CI fazem; a pessoa aprova.

## 1. Achar o Release PR

```bash
gh pr list --label "autorelease: pending" --json number,title,url
```

Se não houver, não há nada visível para lançar desde a última versão (só `ci`, `docs`, `chore`…). Diga isso à pessoa.

## 2. Conferir a versão

Compare os PRs mergeados desde a última tag com a versão proposta:

```bash
git fetch --tags
git log "$(git describe --tags --abbrev=0)"..origin/master --oneline
```

`feat` sobe minor, `fix`/`perf` sobem patch, `!`/`BREAKING CHANGE` sobe major. Se a versão parecer errada, aponte qual commit causou.

## 3. Revisar as notas (pt-BR, para quem usa o app)

Leia o diff do `CHANGELOG.md` no Release PR. Para cada item:

- Está em português, claro para quem não programa, e diz o que a pessoa ganha?
- Algum item ainda está em inglês (o PR não tinha `BEGIN_COMMIT_OVERRIDE`)? Proponha o texto e **edite a descrição do PR de origem**, não o CHANGELOG:

  ```bash
  gh pr view <n> --json body --jq .body > /tmp/body.md   # acrescente o bloco
  gh pr edit <n> --body-file /tmp/body.md
  gh workflow run release.yml                            # o release-please regenera o Release PR
  ```

- Mudança visível ao usuário ficou de fora? Mesmo caminho.

## 4. Pronto para lançar

- CI verde no Release PR (`gh pr checks <n>`).
- Staging (`https://virtual-cube-solver--staging-*.web.app`, link no último run de "Deploy staging") funcionando.
- Primeira release: confira que `release-as` ainda está no config. Depois dela, abra um PR removendo a linha.

Resuma para a pessoa: versão, itens das notas e o que conferiu. Ela faz o merge e aprova o environment `production`.

## 5. Depois do merge

```bash
gh run list --workflow release.yml --limit 1
gh run watch <id>
```

Confirme a tag, a GitHub Release com o link "No ar em …" e o modal "Novidades" em produção. Se algo quebrar: rollback com **Deploy production (manual)** rodando a partir da tag anterior (`docs/deploy.md`).
