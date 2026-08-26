#!/usr/bin/env bash
# audit.sh — "security check" for hallucinations.
#
# Deliberately simple. It catches the most common hallucination patterns:
# missing citations, duplicate rows, arithmetic drift, invented weights, and
# numbers cited to pages that don't contain the product.
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
echo "[1/7] Checking data/evidence/*.json for required source_url..."
while IFS= read -r f; do
  if ! grep -q '"source_url"' "$f"; then
    echo "  FAIL  $f is missing source_url"
    FAIL=1
  fi
done < <(find data/evidence -maxdepth 1 -name '*.json' ! -name '_*')
echo "  done."

# ---------------------------------------------------------------------------
# Check 2: docs/index.html must not contain orphan dollar amounts
# (a $ amount not adjacent to a citation link within 3 lines)
# ---------------------------------------------------------------------------
echo "[2/7] Scanning docs/index.html for orphan dollar amounts..."
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
# Check 3: scripts.js must not call external price APIs (local fetch paths only)
# ---------------------------------------------------------------------------
echo "[3/7] Verifying scripts.js does not call external price APIs..."
RAW=$(grep -nE 'fetch\([^)]*https?://' docs/scripts.js || true)
if [ -n "$RAW" ]; then
  echo "  FAIL  scripts.js appears to call an external API:"
  echo "$RAW" | sed 's/^/    /'
  FAIL=1
else
  echo "  ok"
fi

# ---------------------------------------------------------------------------
# Check 4: every product JSON has a verified_on date >= 2026
# ---------------------------------------------------------------------------
echo "[4/7] Checking verified_on dates..."
while IFS= read -r f; do
  DATE=$(grep -oE '"verified_on":\s*"[0-9-]+"' "$f" | grep -oE '[0-9-]+' || true)
  if [ -z "$DATE" ]; then
    echo "  FAIL  $f has no verified_on date"
    FAIL=1
  elif [[ "$DATE" < "2026" ]]; then
    echo "  FAIL  $f verified_on ($DATE) is before 2026"
    FAIL=1
  fi
done < <(find data/evidence -maxdepth 1 -name '*.json' ! -name '_*')
echo "  done."

# ---------------------------------------------------------------------------
# Check 5: no two evidence files may cite the same source_url
# (duplicate rows let conflicting numbers hide behind one link).
# Exception: rows whose note carries a "FLAGGED" review marker (documented
# placeholders awaiting a product-level URL) are reported, not failed.
# ---------------------------------------------------------------------------
echo "[5/7] Checking for duplicate source_url citations..."
DUPES=$(find data/evidence -maxdepth 1 -name '*.json' ! -name '_*' -exec grep -Ho '"source_url":\s*"[^"]*"' {} \; \
        | sed 's|data/evidence/||; s/".*": *"/  /; s/"$//' \
        | sort -t$'\t' -k2 | awk -F'  ' '{if ($2==prev) print "    " $1 " shares " $2; prev=$2}' || true)
if [ -n "$DUPES" ]; then
  # split into flagged (documented) and unflagged (hard failure)
  DUP_OK=""
  DUP_BAD=""
  while IFS= read -r line; do
    fid=$(echo "$line" | sed 's/^ *\(.*\.json\): shares.*/\1/')
    url=$(echo "$line" | sed 's/^ *.*\.json: shares //')
    if grep -q '"note".*FLAGGED' "data/evidence/$fid" 2>/dev/null; then
      DUP_OK="${DUP_OK}${line}\n"
    else
      DUP_BAD="${DUP_BAD}${line}\n"
    fi
  done <<< "$DUPES"
  [ -n "$DUP_OK" ] && { echo "  INFO  documented shared citations (flagged, price withheld):"; printf '%b' "$DUP_OK" | sed 's/^/    /'; }
  if [ -n "$DUP_BAD" ]; then
    echo "  FAIL  multiple evidence files cite the same URL without a review flag:"
    printf '%b' "$DUP_BAD" | sed 's/^/    /'
    FAIL=1
  else
    [ -z "$DUP_OK" ] && echo "  ok"
  fi
else
  echo "  ok"
fi

# ---------------------------------------------------------------------------
# Check 6: rings.json is in sync with evidence + arithmetic is consistent
# ---------------------------------------------------------------------------
echo "[6/7] Checking rings.json sync + derived arithmetic..."
python3 - <<'PY' || FAIL=1
import json, os, sys

OZ = 31.1034768
PURITY = {"24K": 0.999, "22K": 22/24, "18K": 0.75, "14K": 14/24, "10K": 10/24}
def purity(k):
    k = (k or "").upper()
    if "PT" in k or "PLAT" in k: return None
    for key in ("24K","22K","18K","14K","10K"):
        if key in k: return PURITY[key]
    return None

rows = json.load(open("data/rings.json"))
excluded = set()
if os.path.exists("data/_excluded.json"):
    excluded = set(json.load(open("data/_excluded.json"))["excluded"])

ev_ids = {f[:-5] for f in os.listdir("data/evidence") if f.endswith(".json") and not f.startswith("_")}
row_ids = {r["id"] for r in rows}
problems = []
for missing in (ev_ids - row_ids - excluded):
    problems.append(f"evidence row not compiled: {missing}")
for extra in (row_ids - ev_ids):
    problems.append(f"rings.json row has no evidence file: {extra}")
if json.load(open("data/rings.json")) != json.load(open("docs/data/rings.json")):
    problems.append("data/rings.json and docs/data/rings.json differ (rebuild the mirror)")

def close(a, b, tol):
    return a is not None and b is not None and abs(a - b) <= tol

for r in rows:
    pur = purity(r.get("karat")); w = r.get("weight_g"); p = r.get("price_usd") or r.get("price_usd_from")
    if w and pur:
        if not close(r.get("raw_gold_g"), round(w * pur, 4), 0.02):
            problems.append(f"{r['id']}: raw_gold_g {r.get('raw_gold_g')} != weight*purity {round(w*pur,4)}")
        if p and not close(r.get("price_per_gold_oz"), round(p / (w * pur) * OZ, 2), 1.0):
            problems.append(f"{r['id']}: price_per_gold_oz {r.get('price_per_gold_oz')} inconsistent")
if problems:
    print("  FAIL  rings.json consistency:")
    for p in problems[:30]:
        print("   ", p)
    sys.exit(1)
print("  ok")
PY

# ---------------------------------------------------------------------------
# Check 7: no implausible weights (< 0.8 g) and no unflagged collection-page
# citations (a collection page cannot verify a product's price)
# ---------------------------------------------------------------------------
echo "[7/7] Checking implausible weights + citation quality..."
while IFS= read -r f; do
  W=$(python3 -c "import json,sys;d=json.load(open('$f'));print(d.get('weight_g') or '')" 2>/dev/null)
  if [ -n "$W" ] && python3 -c "exit(0 if float('$W') < 0.8 else 1)" 2>/dev/null; then
    echo "  FAIL  $f has implausible weight ${W}g (withhold or re-verify)"
    FAIL=1
  fi
  U=$(grep -oE '"source_url":\s*"[^"]*"' "$f" | head -1)
  case "$U" in
    # /collections/X/products/Y is Shopify's canonical PRODUCT URL — fine.
    # A /collections/... URL WITHOUT /products/ (or a filter/query page, or a
    # third-party article) cannot verify a product -> must carry a FLAGGED note.
    *"wwd.com"*)
      if ! grep -q '"note".*FLAGGED' "$f"; then
        echo "  FAIL  $f cites a third-party article without a FLAGGED note: $U"
        FAIL=1
      fi ;;
    *"filter="*)
      if ! grep -q '"note".*FLAGGED' "$f"; then
        echo "  FAIL  $f cites a filtered collection page without a FLAGGED note: $U"
        FAIL=1
      fi ;;
    *"/collections/"*)
      if [[ "$U" != *"/products/"* ]] && ! grep -q '"note".*FLAGGED' "$f"; then
        echo "  FAIL  $f cites a collection page without a FLAGGED note: $U"
        FAIL=1
      fi ;;
  esac
done < <(find data/evidence -maxdepth 1 -name '*.json' ! -name '_*')
echo "  done."

echo
if [ "$FAIL" -eq 0 ]; then
  echo "==> audit PASSED — no hallucinations detected."
  exit 0
else
  echo "==> audit FAILED — fix the items above before merging."
  exit 1
fi
