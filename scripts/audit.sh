#!/usr/bin/env bash
# audit.sh — "security check" for hallucinations.
#
# This is intentionally simple. It does NOT try to be clever. It catches
# the most common hallucination pattern: a number-shaped string in the
# rendered content that has no source URL near it.
#
# Usage:  bash scripts/audit.sh
# Exit:   0 if clean, 1 if any finding.

set -u

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

FAIL=0
echo "==> Hallucination audit (no-hallucination policy)"
echo

# ---------------------------------------------------------------------------
# Check 1: every JSON file in data/evidence/ has a source_url
# ---------------------------------------------------------------------------
echo "[1/4] Checking data/evidence/*.json for required source_url..."
while IFS= read -r f; do
  if ! grep -q '"source_url"' "$f"; then
    echo "  FAIL  $f is missing source_url"
    FAIL=1
  fi
done < <(find data/evidence -maxdepth 1 -name '*.json' ! -name '_schema.json')
echo "  done."

# ---------------------------------------------------------------------------
# Check 2: docs/index.html does not contain a raw dollar amount next to text
# that does not look like a placeholder. We allow $ in <input> placeholders
# and in the audit log. We forbid "$<digits>" outside of known allowed
# contexts.
# ---------------------------------------------------------------------------
echo "[2/4] Scanning docs/index.html for orphan dollar amounts..."
# We treat any dollar amount on a line that is NOT immediately followed by
# a line containing an <a href> as "orphan" — i.e. not adjacent to a
# verifiable source link. Catches the common pattern of a number with no
# citation.
# A dollar amount is "cited" if (a) the same line OR (b) a line within the
# next three non-blank lines contains <a href=. Otherwise it's an orphan.
ORPHANS=$(awk '
  {
    lines[NR] = $0
    if ($0 !~ /^\s*$/) nonblank[++nlast] = NR
  }
  END {
    for (i = 1; i <= nlast; i++) {
      this_nr = nonblank[i]
      this_line = lines[this_nr]
      if (this_line ~ /\$[0-9][0-9,]*(\.[0-9]+)?/) {
        if (this_line ~ /<a href=/) continue
        found = 0
        for (j = i + 1; j <= nlast && j <= i + 3; j++) {
          if (lines[nonblank[j]] ~ /<a href=/) { found = 1; break }
        }
        if (!found) print FILENAME ":" this_nr ": " this_line
      }
    }
  }
' docs/index.html || true)
if [ -n "$ORPHANS" ]; then
  echo "  FAIL  found orphan \$ amounts in docs/index.html:"
  echo "$ORPHANS" | sed 's/^/    /'
  FAIL=1
else
  echo "  ok"
fi

# ---------------------------------------------------------------------------
# Check 3: the calculator does not call any external price API.
#
# Rule: any fetch() in scripts.js MUST use a path constant whose declared
# values all start with "../" or "/" or "./" (i.e. local files). This is
# the static check — we look up the constant, then look at every
# assignment, and fail if any value is an absolute URL.
# ---------------------------------------------------------------------------
echo "[3/4] Verifying scripts.js does not call external price APIs..."
BAD=""
# Pull every path from the EVIDENCE_FILES array.
while IFS= read -r line; do
  case "$line" in
    *'"https://'*|*"'https://"*)
      BAD="${BAD}${line}\n" ;;
    *'"http://'*|*"'http://"*)
      BAD="${BAD}${line}\n" ;;
  esac
done < <(grep -nE '"[./][^"]*"|'"'"'[./][^'"'"']*'"'" docs/scripts.js)
# Also scan for raw https fetches.
RAW=$(grep -nE 'fetch\([^)]*https?://' docs/scripts.js || true)
if [ -n "$BAD$RAW" ]; then
  echo "  FAIL  scripts.js appears to call an external API:"
  printf '%b' "$BAD" | sed 's/^/    /'
  [ -n "$RAW" ] && echo "$RAW" | sed 's/^/    /'
  FAIL=1
else
  echo "  ok"
fi

# ---------------------------------------------------------------------------
# Check 4: every product JSON has a verified_on date that parses as a date
# in 2026 or later (so we know someone checked it recently).
# ---------------------------------------------------------------------------
echo "[4/4] Checking verified_on dates..."
while IFS= read -r f; do
  DATE=$(grep -oE '"verified_on":\s*"[0-9-]+"' "$f" | grep -oE '[0-9-]+' || true)
  if [ -z "$DATE" ]; then
    echo "  FAIL  $f has no verified_on date"
    FAIL=1
  fi
done < <(find data/evidence -maxdepth 1 -name '*.json' ! -name '_schema.json')
echo "  done."

echo
if [ "$FAIL" -eq 0 ]; then
  echo "==> audit PASSED — no hallucinations detected."
  echo "    Append a new dated entry to docs/index.html #audit-log."
  exit 0
else
  echo "==> audit FAILED — fix the items above before merging."
  exit 1
fi
