#!/usr/bin/env bash
set -euo pipefail

THEME_SRC="/home/dsmdsm/nexamos-workspace/keycloak-theme/nexamos"
THEME_DEST="/opt/keycloak/themes/nexamos"

echo "[1/4] Menyalin tema kustom 'nexamos' ke ${THEME_DEST}..."
rm -rf "${THEME_DEST}"
cp -r "${THEME_SRC}" "${THEME_DEST}"
chown -R dsmdsm:dsmdsm "${THEME_DEST}"
chmod -R 775 "${THEME_DEST}"

echo "[2/4] Membangun ulang cache tema Keycloak (kc.sh build)..."
/opt/keycloak/bin/kc.sh build

echo "[3/4] Me-restart layanan keycloak.service..."
systemctl restart keycloak.service

echo "Menunggu Keycloak aktif di port 8180..."
for i in {1..30}; do
  if curl -s http://127.0.0.1:8180/identity/realms/nexamos >/dev/null; then
    break
  fi
  sleep 1
done

echo "[4/4] Mengaktifkan loginTheme='nexamos' pada realm 'nexamos'..."
python3 - <<'PYEOF'
import json, urllib.request, urllib.parse

TOKEN_URL = "http://127.0.0.1:8180/identity/realms/master/protocol/openid-connect/token"
REALM_URL = "http://127.0.0.1:8180/identity/admin/realms/nexamos"

data = urllib.parse.urlencode({
    "client_id": "admin-cli",
    "username": "admin",
    "password": "NexaMOS_KC_Admin_2026!",
    "grant_type": "password"
}).encode()

tok = json.loads(urllib.request.urlopen(urllib.request.Request(TOKEN_URL, data=data)).read())["access_token"]
headers = {"Authorization": f"Bearer {tok}", "Content-Type": "application/json"}

req_update = urllib.request.Request(
    REALM_URL,
    data=json.dumps({
        "loginTheme": "nexamos",
        "displayName": "NexaMOS Identity Platform",
        "displayNameHtml": ""
    }).encode(),
    headers=headers,
    method="PUT"
)
urllib.request.urlopen(req_update)
print("loginTheme='nexamos' berhasil diaktifkan pada realm 'nexamos'!")
PYEOF

echo "✅ Selesai! Tema login 2-kolom & 2-row NexaMOS SSO kini aktif."
