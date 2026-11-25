# Deploy e runner

## Fluxo

```
PR aberto ──► CI (gate) + preview  pr-<n>.web.app   (expira em 7 dias, link no PR)
merge na master ──► canal staging                    (sempre a master atual)
Release PR mergeado ──► tag vX.Y.Z ──► produção      (environment "production", com aprovação)
rollback ──► Actions › "Deploy production (manual)" com a tag anterior
```

| Workflow | Quando | Canal | Runner |
|---|---|---|---|
| `deploy-preview.yml` | PR do próprio repo (fork e Dependabot não) | `pr-<n>` | GitHub |
| `deploy-staging.yml` | push na `master` | `staging` | self-hosted, se ligado |
| `release.yml` | Release PR mergeado | `live` | self-hosted, se ligado |
| `deploy-production.yml` | manual, informando a tag | `live` | self-hosted, se ligado |

Todos chamam `_firebase-deploy.yml`, que separa privilégios:

1. **build**: roda o código do app **sem credencial nenhuma** e guarda o `dist/`.
2. **deploy**: recebe o token OIDC, faz checkout só do `firebase.json` e do `.firebaserc` e publica o `dist/` pronto. Termina com um smoke test que exige os headers de segurança no ar.

## Autenticação sem chave (OIDC)

O GitHub emite um token OIDC por job, e o GCP o troca, via Workload Identity Federation, por credenciais de curta duração da service account `github-deployer`, que só tem permissão de Firebase Hosting. O provider só aceita tokens **deste repositório** (condição por `repository_id`). Não existe chave guardada no GitHub.

### Configurar (uma vez)

```bash
gcloud auth login
scripts/gcp/setup-wif.sh                 # cria pool, provider, SA e permissões
gh variable set GCP_WORKLOAD_IDENTITY_PROVIDER --body "<impresso pelo script>"
gh variable set GCP_SERVICE_ACCOUNT --body "github-deployer@virtual-cube-solver.iam.gserviceaccount.com"
```

Depois que um preview funcionar com o OIDC, **aposente a chave antiga** com os comandos que o script imprime: apague o secret e a chave na service account antiga. Até lá, o deploy usa a chave legada e mostra um aviso no job.

### Environments (Settings › Environments)

| Environment | Regra |
|---|---|
| `production` | aprovação obrigatória (você) e só a partir de tags `v*` |
| `staging` | só a branch `master` |
| `preview` | sem regra |

## Runner self-hosted

O repositório é **público**, e um runner self-hosted que rodasse PRs executaria código de qualquer pessoa na sua máquina. Por isso:

- **PRs (inclusive de fork) e merge queue rodam sempre em máquinas do GitHub.**
- O self-hosted só recebe eventos confiáveis: push na `master`, release e dispatch manual. E só quando `vars.SELF_HOSTED_RUNNER == 'true'`.
- Cada job roda num **container novo e efêmero** (`--ephemeral` e `--rm`), sem `docker.sock`, sem volumes do host e com CPU/memória limitadas. O token de registro vai por stdin e não aparece no `docker inspect`.

```bash
scripts/runner/runner.sh start                       # sobe o loop em background
gh variable set SELF_HOSTED_RUNNER --body true       # workflows passam a usar
scripts/runner/runner.sh status
gh variable set SELF_HOSTED_RUNNER --body false      # volta tudo para o GitHub
scripts/runner/runner.sh stop
```

Para manter o runner no ar mesmo após reiniciar a máquina, use a unit systemd `scripts/runner/cube-solver-runner.service` (as instruções estão no próprio arquivo).

> Se a variável estiver `true` com o runner desligado, os jobs confiáveis ficam na fila esperando. Desligue a variável antes de parar o runner por muito tempo.

Também em Settings › Actions › General: **"Require approval for all external contributors"** para workflows de PRs de fork.
