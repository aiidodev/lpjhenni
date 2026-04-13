#!/usr/bin/env bash
# Corre a partir do TEU MAC. Sincroniza código + rebuild na VPS.
#
#   npm run deploy:vps
#
# Se o rsync falhar, o script tenta automaticamente envio por TAR (stream SSH).
# Só TAR (sem rsync):  FORCE_TAR=1 npm run deploy:vps
#
# Opcional: VPS_HOST=root@IP VPS_PATH=/var/www/lpjhenni
#
# Deploy só com Git (sem SSH a partir do Mac): faz push para origin e na VPS:
#   cd /var/www/lpjhenni && git fetch origin && git reset --hard origin/atu && bash deploy/rebuild-vps.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
HOST="${VPS_HOST:-root@217.216.94.56}"
REMOTE="${VPS_PATH:-/var/www/lpjhenni}"

RSYNC_SSH='ssh -o ServerAliveInterval=20 -o ServerAliveCountMax=6 -o ConnectTimeout=30 -o TCPKeepAlive=yes'

echo "Origem (Mac): $PROJECT_ROOT"
echo "Destino:      $HOST:$REMOTE"
echo ""

rebuild_remote() {
  echo ""
  echo "==> Na VPS: npm install + build + pm2 …"
  $RSYNC_SSH "$HOST" "cd '$REMOTE' && chmod +x deploy/rebuild-vps.sh 2>/dev/null || true && bash deploy/rebuild-vps.sh"
}

sync_rsync() {
  echo "==> rsync …"
  rsync -avz --delete --human-readable \
    -e "$RSYNC_SSH" \
    --exclude node_modules \
    --exclude .next \
    --exclude out \
    --exclude .git \
    --exclude ".env*" \
    --exclude "*.log" \
    "$PROJECT_ROOT/" "$HOST:$REMOTE/"
}

sync_tar() {
  echo "==> Envio por tar (stream SSH) — útil quando rsync desliga a sessão …"
  export COPYFILE_DISABLE=1
  # Overlay: ficheiros antigos na VPS que não vêm no arquivo mantêm-se (ex.: .env).
  tar -C "$PROJECT_ROOT" \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='out' \
    --exclude='.git' \
    --exclude='.env' \
    --exclude='.env.*' \
    --exclude='.DS_Store' \
    -czf - . | $RSYNC_SSH "$HOST" "mkdir -p '$REMOTE' && cd '$REMOTE' && tar -xzf -"
}

if [ "${FORCE_TAR:-}" = "1" ]; then
  sync_tar
  rebuild_remote
  echo ""
  echo "Feito (tar). https://jhenni.com.br — Cmd+Shift+R"
  exit 0
fi

if sync_rsync; then
  rebuild_remote
  echo ""
  echo "Feito (rsync). https://jhenni.com.br — Cmd+Shift+R"
  exit 0
fi

echo ""
echo "rsync falhou — a tentar tar …"
if sync_tar; then
  rebuild_remote
  echo ""
  echo "Feito (tar). https://jhenni.com.br — Cmd+Shift+R"
  exit 0
fi

echo ""
echo "ERRO: rsync e tar falharam."
echo "  • Testa:  ssh $HOST"
echo "  • Chave:  ssh-copy-id $HOST"
echo "  • Ou só Git na VPS (repo: github.com/aiidodev/lpjhenni, branch atu):"
echo "      ssh $HOST \"cd $REMOTE && git fetch origin && git reset --hard origin/atu && bash deploy/rebuild-vps.sh\""
exit 1
