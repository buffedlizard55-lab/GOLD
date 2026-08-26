# scripts/

## `audit.sh` / `audit.py`

Run:

```bash
bash scripts/audit.sh
```

The audit is deterministic and deliberately conservative. It does not invent
catalog values and it does not call retailer APIs. It checks:

- every evidence JSON file parses and has the required identity/source fields;
- every evidence row is represented in `data/rings.json`;
- every compiled field copied from evidence matches exactly;
- `docs/data/` is synchronized with `data/`;
- IDs, HTTPS source URLs, ISO review dates, and arithmetic are consistent;
- duplicate URLs, missing prices/weights, collection/category links,
  third-party/marketplace links, likely reference/non-ring rows, and other
  review cues are surfaced.

It writes a machine-readable report to `data/review_report.json` and the
mirrored public copy at `docs/data/review_report.json`. Targeted official-page
observations are recorded in `data/source_checks.json` and mirrored for the
site. It also generates `sources.html` and `docs/sources.html`; those pages list every row with a
direct source URL and a repository evidence link for manual review.

The audit report is **not** a live-page certification. Prices, weights,
karats, sizes, availability, and product identity can change. A reviewer must
open the source link for the row before relying on it. Static errors fail the
command; review flags are printed and retained rather than hidden or guessed.
