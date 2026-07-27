#!/usr/bin/env bash
# Bumps the "version" counter in demo/manifest.json by 1.
# Invoked by the local pre-commit/post-merge git hooks (see .git/hooks/),
# which are not tracked in this repo and must be installed manually per clone.
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
MANIFEST="$REPO_ROOT/demo/manifest.json"

if [ ! -f "$MANIFEST" ]; then
  exit 0
fi

current="$(grep -m1 -o '"version": *"[0-9]\+"' "$MANIFEST" | grep -o '[0-9]\+')"
if [ -z "$current" ]; then
  echo "bump-pwa-manifest-version: no numeric \"version\" field found in $MANIFEST, skipping" >&2
  exit 0
fi

next=$((current + 1))
sed -i.bak -E "s/\"version\": *\"[0-9]+\"/\"version\": \"${next}\"/" "$MANIFEST"
rm -f "${MANIFEST}.bak"

echo "bump-pwa-manifest-version: $current -> $next"
