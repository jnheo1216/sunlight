#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo ".env not found at ${ENV_FILE}"
  exit 1
fi

URL="$(grep '^VITE_SUPABASE_URL=' "${ENV_FILE}" | sed 's/^VITE_SUPABASE_URL=//')"
KEY="$(grep '^VITE_SUPABASE_ANON_KEY=' "${ENV_FILE}" | sed 's/^VITE_SUPABASE_ANON_KEY=//')"

if [[ -z "${URL}" || -z "${KEY}" ]]; then
  echo "VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is empty"
  exit 1
fi

echo "[1/5] anon key payload"
env KEY="${KEY}" node -e "const p=process.env.KEY.split('.')[1]; console.log(JSON.parse(Buffer.from(p,'base64url').toString()))"

echo "[2/5] upload probe (text/plain)"
TEXT_PATH="curl-diagnostic/$(date +%s)-probe.txt"
printf 'storage-probe-%s\n' "$(date -u +%Y%m%dT%H%M%SZ)" > /tmp/storage-probe.txt
TEXT_CODE="$(curl -sS -o /tmp/storage-probe-resp.json -w '%{http_code}' \
  -X POST "${URL}/storage/v1/object/plant-images/${TEXT_PATH}" \
  -H "apikey: ${KEY}" \
  -H "Authorization: Bearer ${KEY}" \
  -H "Content-Type: text/plain" \
  --data-binary @/tmp/storage-probe.txt)"
echo "HTTP ${TEXT_CODE}"
cat /tmp/storage-probe-resp.json; echo

echo "[3/5] upload probe (image/webp)"
WEBP_PATH="curl-diagnostic/$(date +%s)-probe.webp"
printf 'RIFFxxxxWEBPVP8 ' > /tmp/storage-probe.webp
WEBP_CODE="$(curl -sS -o /tmp/storage-webp-resp.json -w '%{http_code}' \
  -X POST "${URL}/storage/v1/object/plant-images/${WEBP_PATH}" \
  -H "apikey: ${KEY}" \
  -H "Authorization: Bearer ${KEY}" \
  -H "Content-Type: image/webp" \
  --data-binary @/tmp/storage-probe.webp)"
echo "HTTP ${WEBP_CODE}"
cat /tmp/storage-webp-resp.json; echo

echo "[4/5] bucket list"
BUCKET_CODE="$(curl -sS -o /tmp/storage-bucket-list.json -w '%{http_code}' \
  -H "apikey: ${KEY}" \
  -H "Authorization: Bearer ${KEY}" \
  "${URL}/storage/v1/bucket")"
echo "HTTP ${BUCKET_CODE}"
cat /tmp/storage-bucket-list.json; echo

echo "[5/5] public read probe"
PUBLIC_CODE="$(curl -sS -o /tmp/storage-public-resp.bin -w '%{http_code}' \
  "${URL}/storage/v1/object/public/plant-images/${WEBP_PATH}")"
echo "HTTP ${PUBLIC_CODE}"
if [[ "${PUBLIC_CODE}" != "200" ]]; then
  cat /tmp/storage-public-resp.bin; echo
else
  echo "public read ok"
fi

echo
echo "Summary"
echo "- text upload: ${TEXT_CODE}"
echo "- webp upload: ${WEBP_CODE}"
echo "- bucket list: ${BUCKET_CODE}"
echo "- public read: ${PUBLIC_CODE}"
