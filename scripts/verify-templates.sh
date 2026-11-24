#!/usr/bin/env bash
# Scaffold every curated template, install, and build it. Fails if any generated project doesn't build.
# Usage: scripts/verify-templates.sh [template-id ...]   (default: all curated templates)
set -uo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLI="$ROOT/packages/cli/bin/create-forgestack-app.js"
OUT="${VERIFY_OUT:-$(mktemp -d)}"
mkdir -p "$OUT"
TEMPLATES=("$@")
[ ${#TEMPLATES[@]} -eq 0 ] && TEMPLATES=(enterprise-monorepo ai-agent-rag tauri-desktop nextjs-fullstack micro-frontend distributed-worker standalone-fe standalone-be)

failed=()
for t in "${TEMPLATES[@]}"; do
  dir="$OUT/$t"
  rm -rf "$dir"
  echo "::group::$t"
  if (cd "$OUT" && node "$CLI" "$t" --template "$t" --no-git --install </dev/null) >"$OUT/$t.log" 2>&1 \
    && (cd "$dir" && pnpm run build) >>"$OUT/$t.log" 2>&1 \
    && { ! node -e "process.exit(require('$dir/package.json').scripts?.typecheck ? 0 : 1)" || (cd "$dir" && pnpm run typecheck) >>"$OUT/$t.log" 2>&1; }; then
    echo "✅ $t"
  else
    echo "❌ $t (log: $OUT/$t.log)"; tail -40 "$OUT/$t.log"; failed+=("$t")
  fi
  echo "::endgroup::"
done

[ ${#failed[@]} -eq 0 ] && { echo "All ${#TEMPLATES[@]} templates build."; exit 0; }
echo "Failed: ${failed[*]}"; exit 1
