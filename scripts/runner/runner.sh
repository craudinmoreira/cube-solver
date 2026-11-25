#!/usr/bin/env bash
# Runner self-hosted EFÊMERO do GitHub Actions em Docker.
#
# Cada job roda num container novo, registrado com --ephemeral: ao terminar o
# job o runner se desregistra e o container é destruído (--rm). Nada sobrevive
# entre jobs: nem código, nem node_modules, nem credenciais.
#
# Segurança (o repositório é PÚBLICO):
#  - Os workflows só mandam para cá eventos confiáveis (push na master, tags,
#    workflow_dispatch). PRs, inclusive de fork, rodam sempre no GitHub.
#  - Sem docker.sock, sem volumes do host, CPU e memória limitadas.
#  - O token de registro é de uso curto (1 h) e pedido a cada job via `gh`.
#
# Uso:
#   scripts/runner/runner.sh start    # sobe o loop em background
#   scripts/runner/runner.sh stop     # para o loop e remove o runner atual
#   scripts/runner/runner.sh status
#   scripts/runner/runner.sh run      # loop em primeiro plano (para systemd)
#
# Depois de subir, ligue nos workflows: gh variable set SELF_HOSTED_RUNNER --body true
set -euo pipefail

REPO="${RUNNER_REPO:-craudinmoreira/cube-solver}"
IMAGE="ghcr.io/actions/actions-runner:${RUNNER_VERSION:-2.338.2}"
LABELS="cube-solver"
CPUS="${RUNNER_CPUS:-2}"
MEMORY="${RUNNER_MEMORY:-4g}"
STATE_DIR="${XDG_STATE_HOME:-$HOME/.local/state}/cube-solver-runner"
PID_FILE="$STATE_DIR/loop.pid"
LOG_FILE="$STATE_DIR/runner.log"
CONTAINER="cube-solver-runner"

mkdir -p "$STATE_DIR"

registration_token() {
  gh api -X POST "repos/$REPO/actions/runners/registration-token" --jq .token
}

run_one_job() {
  local token name
  token="$(registration_token)"
  name="cube-solver-$(hostname -s)-$(date +%s)"
  # O token vai por stdin, não por variável de ambiente: não aparece no `docker inspect`.
  printf '%s\n' "$token" | docker run --rm -i \
    --name "$CONTAINER" \
    --cpus "$CPUS" --memory "$MEMORY" --pids-limit 4096 \
    "$IMAGE" bash -c '
      set -e
      read -r TOKEN
      ./config.sh --url "https://github.com/'"$REPO"'" --token "$TOKEN" \
        --name "'"$name"'" --labels "'"$LABELS"'" \
        --ephemeral --unattended --disableupdate --replace >/dev/null
      unset TOKEN
      exec ./run.sh
    '
}

loop() {
  echo "[$(date -Is)] runner loop iniciado ($REPO, labels: self-hosted,linux,x64,$LABELS)"
  while true; do
    if ! run_one_job; then
      echo "[$(date -Is)] runner saiu com erro; nova tentativa em 30 s"
      sleep 30
    fi
  done
}

case "${1:-}" in
  run) loop ;;
  start)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      echo "Já está rodando (pid $(cat "$PID_FILE"))."; exit 0
    fi
    if ! command -v gh >/dev/null || ! gh auth status >/dev/null 2>&1; then
      echo "Faça gh auth login antes." >&2; exit 1
    fi
    docker pull -q "$IMAGE" >/dev/null
    nohup "$0" run >>"$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    echo "✔ Runner no ar (pid $!). Log: $LOG_FILE"
    ;;
  stop)
    [ -f "$PID_FILE" ] && kill "$(cat "$PID_FILE")" 2>/dev/null || true
    rm -f "$PID_FILE"
    docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
    # Remove os registros desta máquina (o container já foi destruído)
    prefix="cube-solver-$(hostname -s)-"
    for id in $(gh api "repos/$REPO/actions/runners" --jq ".runners[] | select(.name | startswith(\"$prefix\")) | .id"); do
      gh api -X DELETE "repos/$REPO/actions/runners/$id" >/dev/null
    done
    echo "✔ Runner parado."
    ;;
  status)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      echo "Loop: rodando (pid $(cat "$PID_FILE"))"
    else
      echo "Loop: parado"
    fi
    gh api "repos/$REPO/actions/runners" --jq '.runners[] | "\(.name)  \(.status)  busy=\(.busy)"'
    echo "SELF_HOSTED_RUNNER=$(gh variable get SELF_HOSTED_RUNNER -R "$REPO" 2>/dev/null || echo '(não definida)')"
    ;;
  *) sed -n '2,24p' "$0"; exit 2 ;;
esac
