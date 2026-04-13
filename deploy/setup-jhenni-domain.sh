#!/usr/bin/env bash
# =============================================================================
# Executar NA VPS como root:
#   sudo bash /var/www/lpjhenni/deploy/setup-jhenni-domain.sh
#
# Certificado: por defeito só jhenni.com.br (apex). O www costuma apontar para
# outro IP (ex.: Cloudflare 185.158.x) e o Let's Encrypt falha com 409.
# Depois de: dig +short www.jhenni.com.br A → IP desta VPS, podes expandir:
#   sudo certbot --nginx --expand -d jhenni.com.br -d www.jhenni.com.br
#
# INCLUDE_WWW=1 no ambiente força pedir os dois (só use se www já resolver para aqui).
# =============================================================================
set -euo pipefail

SITE_NAME="jhenni"
DOMAIN_A="jhenni.com.br"
DOMAIN_B="www.jhenni.com.br"
UPSTREAM="127.0.0.1:3000"

if [[ "${EUID:-0}" -ne 0 ]]; then
  echo "Execute com sudo: sudo bash $0"
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y nginx certbot python3-certbot-nginx

cat >"/etc/nginx/sites-available/${SITE_NAME}" <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN_A} ${DOMAIN_B};

    location / {
        proxy_pass http://${UPSTREAM};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }
}
NGINX

ln -sf "/etc/nginx/sites-available/${SITE_NAME}" "/etc/nginx/sites-enabled/${SITE_NAME}"

if [[ -f /etc/nginx/sites-enabled/default ]]; then
  rm -f /etc/nginx/sites-enabled/default || true
fi

nginx -t
systemctl reload nginx

echo ""
echo ">>> HTTP OK. Certificado Let's Encrypt..."
echo ""

CERT_ARGS=(--nginx --non-interactive --agree-tos --register-unsafely-without-email --redirect)

if [[ "${INCLUDE_WWW:-0}" == "1" ]]; then
  certbot "${CERT_ARGS[@]}" -d "${DOMAIN_A}" -d "${DOMAIN_B}"
else
  # Só apex — evita falha quando www está noutro IP (Cloudflare).
  certbot "${CERT_ARGS[@]}" -d "${DOMAIN_A}"
fi

nginx -t
systemctl reload nginx

echo ""
echo "OK → https://${DOMAIN_A}"
echo "www: aponte o A (ou CNAME) para este servidor e depois: sudo certbot --nginx --expand -d ${DOMAIN_A} -d ${DOMAIN_B}"
