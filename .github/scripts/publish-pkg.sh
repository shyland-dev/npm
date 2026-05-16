#!/usr/bin/env bash
set -euo pipefail

PKG_DIR="$1"
PKG_NAME=$(node -p "require('./$PKG_DIR/package.json').name")
PKG_VERSION=$(node -p "require('./$PKG_DIR/package.json').version")

if [[ -z "${NODE_AUTH_TOKEN:-}" ]]; then
  echo "Erro: NODE_AUTH_TOKEN não está definido. Configure o secret NPM_TOKEN nas configurações do repositório."
  exit 1
fi

echo "Verificando $PKG_NAME@$PKG_VERSION..."

if npm show "$PKG_NAME@$PKG_VERSION" version > /dev/null 2>&1; then
  echo "Versão $PKG_VERSION de $PKG_NAME já publicada, pulando."
  exit 0
fi

if [[ "$PKG_VERSION" == *"-"* ]]; then
  PRE_TAG=$(echo "$PKG_VERSION" | sed 's/.*-\([^.]*\).*/\1/')
  echo "Publicando $PKG_NAME@$PKG_VERSION como pre-release com tag: $PRE_TAG"
  npm publish "$PKG_DIR" --tag "$PRE_TAG" --access public
else
  echo "Publicando $PKG_NAME@$PKG_VERSION como latest"
  npm publish "$PKG_DIR" --access public
fi
