#!/usr/bin/env python3
"""Retired catalog seeder.

The old version of this file wrote a small hard-coded batch of rows into
``data/evidence`` but did not rebuild the catalog or its ``docs/`` mirror.
That made it possible for unsupported prices and stale URLs to look like
published data. It is intentionally non-mutating now.

Use ``bash scripts/audit.sh`` after making a separately sourced evidence
change. The audit will refuse malformed or out-of-sync catalog data and will
regenerate the source-review index.
"""


def main() -> int:
    print("add_rings.py is retired and will not write catalog data.")
    print("Add a separately sourced evidence JSON row, then run: bash scripts/audit.sh")
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
