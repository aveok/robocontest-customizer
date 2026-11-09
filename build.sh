#!/usr/bin/env bash
# Build the Chrome Web Store upload: dist/rc-theme-<version>.zip
# Only extension files go in (no .git, tools, README).
set -euo pipefail
cd "$(dirname "$0")"

version=$(python3 -c 'import json; print(json.load(open("manifest.json"))["version"])')
out="dist/rc-theme-${version}.zip"

mkdir -p dist
rm -f "$out"
zip -r -X -q "$out" manifest.json content.js styles popup icons -x '*.DS_Store'
echo "$out"
unzip -l "$out"
