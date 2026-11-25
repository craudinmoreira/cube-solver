#!/usr/bin/env bash
# Configura o deploy sem chave: GitHub Actions (OIDC) → Workload Identity
# Federation → service account com permissão só de Firebase Hosting.
#
# Pré-requisitos: gcloud autenticado como dono do projeto (gcloud auth login).
# Idempotente: pode rodar de novo. No fim, imprime os comandos `gh variable set`.
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-virtual-cube-solver}"
REPO="${REPO:-craudinmoreira/cube-solver}"
REPO_ID="${REPO_ID:-1221688724}"       # id numérico: não muda se o repo for renomeado
POOL="github"
PROVIDER="cube-solver"
SA_NAME="github-deployer"
SA="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud config set project "$PROJECT_ID" >/dev/null
PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"

gcloud services enable iamcredentials.googleapis.com sts.googleapis.com \
  firebasehosting.googleapis.com --quiet

gcloud iam service-accounts describe "$SA" >/dev/null 2>&1 ||
  gcloud iam service-accounts create "$SA_NAME" --display-name "GitHub Actions deploy (cube-solver)"

# Mínimo para publicar no Hosting (inclui canais de preview)
for role in roles/firebasehosting.admin roles/serviceusage.serviceUsageConsumer; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" --quiet --condition=None \
    --member "serviceAccount:$SA" --role "$role" >/dev/null
done

gcloud iam workload-identity-pools describe "$POOL" --location global >/dev/null 2>&1 ||
  gcloud iam workload-identity-pools create "$POOL" --location global --display-name "GitHub Actions"

# Só tokens emitidos para ESTE repositório (pelo id) são aceitos.
CONDITION="assertion.repository_id == '${REPO_ID}'"
if gcloud iam workload-identity-pools providers describe "$PROVIDER" \
  --location global --workload-identity-pool "$POOL" >/dev/null 2>&1; then
  gcloud iam workload-identity-pools providers update-oidc "$PROVIDER" \
    --location global --workload-identity-pool "$POOL" --attribute-condition "$CONDITION"
else
  gcloud iam workload-identity-pools providers create-oidc "$PROVIDER" \
    --location global --workload-identity-pool "$POOL" \
    --issuer-uri "https://token.actions.githubusercontent.com" \
    --attribute-mapping "google.subject=assertion.sub,attribute.repository_id=assertion.repository_id,attribute.environment=assertion.environment,attribute.ref=assertion.ref" \
    --attribute-condition "$CONDITION"
fi

POOL_ID="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL}"
gcloud iam service-accounts add-iam-policy-binding "$SA" --quiet \
  --role roles/iam.workloadIdentityUser \
  --member "principalSet://iam.googleapis.com/${POOL_ID}/attribute.repository_id/${REPO_ID}" >/dev/null

PROVIDER_ID="${POOL_ID}/providers/${PROVIDER}"
cat <<MSG

✔ Workload Identity Federation pronta.

1) Configure o repositório:
   gh variable set GCP_WORKLOAD_IDENTITY_PROVIDER -R $REPO --body "$PROVIDER_ID"
   gh variable set GCP_SERVICE_ACCOUNT            -R $REPO --body "$SA"

2) Rode um deploy (abra/atualize um PR) e confira o preview.

3) Só então aposente a chave antiga:
   gh secret delete FIREBASE_SERVICE_ACCOUNT_VIRTUAL_CUBE_SOLVER -R $REPO
   gcloud iam service-accounts list --project $PROJECT_ID   # ache a SA "github-action-..."
   gcloud iam service-accounts keys list --iam-account <SA antiga>
   gcloud iam service-accounts keys delete <KEY_ID> --iam-account <SA antiga>
MSG
