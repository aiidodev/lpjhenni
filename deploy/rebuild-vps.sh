#!/usr/bin/env bash
# Na VPS: cd /var/www/lpjhenni && chmod +x deploy/rebuild-vps.sh && ./deploy/rebuild-vps.sh
#
# ERR_CONNECTION_REFUSED em :3000 → na VPS: pm2 list | pm2 logs lpjhenni
# Se o processo não existir: pm2 start ecosystem.config.js && pm2 save
# Firewall (UFW) a bloquear 3000: sudo ufw allow 3000/tcp && sudo ufw reload
# (Em produção normalmente só abre 80/443 e nginx faz proxy para 3000.)
#
# Erro "Cannot find module '@tailwindcss/postcss'" ou "lightningcss.linux-x64-gnu.node":
# - Nunca exportar NODE_ENV=production antes de npm install (omitir devDependencies).
# - Se node_modules veio do Mac ou está corrompido: CLEAN_INSTALL=1 ./deploy/rebuild-vps.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ "${CLEAN_INSTALL:-}" = "1" ]; then
  echo "CLEAN_INSTALL=1 — a remover node_modules e .next …"
  rm -rf node_modules .next
fi

# Instalar devDependencies (Tailwind v4, PostCSS, TypeScript, etc.) — necessário ao next build.
npm install --include=dev

export NODE_ENV=production
npm run build

start_or_restart() {
  if pm2 describe lpjhenni >/dev/null 2>&1; then
    pm2 restart lpjhenni
    return
  fi
  if [ -f "$ROOT/ecosystem.config.cjs" ]; then
    pm2 start "$ROOT/ecosystem.config.cjs"
    return
  fi
  if [ -f "$ROOT/ecosystem.config.js" ]; then
    pm2 start "$ROOT/ecosystem.config.js"
    return
  fi
  echo "Aviso: sem ecosystem.config — a usar npm run start (package.json com --port 3000)"
  PORT=3000 pm2 start npm --name lpjhenni --cwd "$ROOT" -- run start
}

start_or_restart
pm2 save

echo ""
echo "=== Local (Node) ==="
curl -sI --max-time 5 http://127.0.0.1:3000 2>/dev/null | head -5 || echo "(curl falhou — ver: pm2 logs lpjhenni)"
echo ""
echo "Pasta do processo (confirma que é $ROOT):"
pm2 describe lpjhenni 2>/dev/null | grep -E "exec cwd|script path" || true
echo "OK — deploy nesta pasta: $ROOT"
