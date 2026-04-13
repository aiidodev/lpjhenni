#!/usr/bin/env bash
# Execute NA VPS (Ubuntu), como root ou com sudo:
#   bash vps-install-letsencrypt.sh
#
# Pré-requisitos:
# - DNS: jhenni.com.br (e opcionalmente www) apontando SOMENTE para o IP deste servidor.
# - Nginx instalado e site HTTP servindo o app (veja nginx-jhenni-http.conf).
# - Portas 80 e 443 abertas no firewall.

set -euo pipefail

apt-get update -y
apt-get install -y certbot python3-certbot-nginx

nginx -t
systemctl reload nginx

certbot --nginx \
  -d jhenni.com.br \
  -d www.jhenni.com.br \
  --non-interactive \
  --agree-tos \
  --register-unsafely-without-email \
  --redirect

nginx -t
systemctl reload nginx

echo "OK. Teste: curl -sI https://jhenni.com.br | head -5"
