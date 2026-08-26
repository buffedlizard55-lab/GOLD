#!/usr/bin/env bash
# GOLD static audit.
#
# This command validates the catalog and regenerates the manual source-review
# index. It deliberately does not invent values or claim that live retailer
# pages still match the stored values; the generated report links every row to
# its stored source URL and flags gaps for review.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

python3 scripts/audit.py --check

echo
printf '%s\n' 'Generated:' \
  '  data/review_report.json' \
  '  docs/data/review_report.json' \
  '  docs/data/source_checks.json' \
  '  sources.html' \
  '  docs/sources.html'
