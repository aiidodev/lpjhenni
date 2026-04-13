#!/usr/bin/env bash
# Correr **na VPS** (não no Mac). Atualiza código a partir do GitHub e faz build.
#
#   ssh root@SEU_IP
#   cd /var/www/lpjhenni
#   chmod +x deploy/vps-pull-rebuild.sh
#   BRANCH=atu ./deploy/vps-pull-rebuild.sh
#
# Requisito: esta pasta tem de ser um clone de git com remote origin (ex.: git@github.com:aiidodev/lpjhenni.git).

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
BRANCH="${BRANCH:-atu}"

if [ ! -d .git ]; then
  echo "ERRO: $ROOT não é um repositório git. Faz clone ou usa rsync/tar a partir do Mac."
  exit 1
fi

git config --global --add safe.directory "$ROOT" 2>/dev/null || true

echo "==> git fetch + checkout $BRANCH …"
git fetch origin
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"

echo "==> rebuild …"
bash "$ROOT/deploy/rebuild-vps.sh"

echo "OK — site atualizado a partir de origin/$BRANCH"
