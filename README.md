# GOLD — Solid Gold Ring & Jewelry Buyer’s Guide

A buyer-first, evidence-oriented catalog of gold and platinum jewelry listings. The repository stores the values that were recorded for each listing and the URL used as its source. It does **not** silently fill missing prices or weights.

## Open the catalog and the links

- **Live catalog:** <https://buffedlizard55-lab.github.io/GOLD/>
- **All source links for manual review:** <https://buffedlizard55-lab.github.io/GOLD/sources.html>
- **Machine-readable audit report:** <https://github.com/buffedlizard55-lab/GOLD/blob/main/data/review_report.json>
- **Targeted official-page check log:** <https://github.com/buffedlizard55-lab/GOLD/blob/main/data/source_checks.json>
- **Repository:** <https://github.com/buffedlizard55-lab/GOLD>

The catalog is static and uses no external price API. Open the **Source** link on a row, or use the source-review index, to check the seller’s current page before relying on any price, weight, karat, size, availability, or product identity.

## What is in this checkout

The current snapshot contains **487 catalog rows**, **35 seller names**, **223 rows with a stored weight**, and **481 rows with a stored price or price range**. Rows without a value are retained and labeled as data gaps; they are not estimated.

The snapshot also contains a small number of reference/non-ring jewelry rows. Those rows are flagged by the audit rather than being presented as verified rings. Exact counts and every row-level flag are in [`data/review_report.json`](data/review_report.json) and on [`sources.html`](sources.html).

## Review and no-hallucination policy

A source URL alone is not proof that a listing is current or that a page supports every value in the row. The project therefore separates:

1. **Repository checks:** JSON parsing, required fields, evidence-to-catalog consistency, mirrored `docs/` data, HTTPS URL shape, and arithmetic consistency for values already present.
2. **Source review:** open the row’s URL and compare the live seller page with the stored fields. The source-review page gives a direct link for every row.

The static audit does not fetch or rewrite retailer pages. It reports missing values, duplicate URLs, collection/category links, likely reference/non-ring rows, marketplace/publication domains, and other review cues. No value is added solely to make a table look complete.

Run the audit after changing catalog content:

```bash
bash scripts/audit.sh
```

It writes:

- `data/review_report.json`
- `docs/data/review_report.json`
- `sources.html`
- `docs/sources.html`

The command exits non-zero only for static integrity errors such as malformed JSON, missing evidence, out-of-sync mirrored data, invalid HTTPS URLs, or inconsistent arithmetic. Review flags are intentionally reported for human inspection rather than hidden or converted into guessed data.

## Repository layout

```text
.
├── index.html                 # GitHub Pages root entry point
├── sources.html               # Static source-link index for root Pages hosting
├── data/
│   ├── rings.json             # Compiled catalog used by the app
│   ├── review_report.json     # Generated integrity/source-review report
│   ├── source_checks.json     # Targeted official-page observations
│   └── evidence/              # One raw evidence JSON file per catalog row
├── docs/
│   ├── index.html             # Catalog page when Pages is configured to /docs
│   ├── sources.html           # Source-link index for /docs hosting
│   ├── scripts.js             # Rendering, filters, sorting, links, exports
│   ├── styles.css
│   └── data/                  # Mirrored public catalog and evidence
├── scripts/
│   ├── audit.py               # Deterministic report generator and validator
│   └── audit.sh               # Audit entry point
├── add_rings.py               # Retired non-mutating compatibility stub
└── README.md
```

## Local preview

```bash
python3 -m http.server 8000 --bind 0.0.0.0 --directory .
# Open http://localhost:8000/
```

For a docs-only preview:

```bash
python3 -m http.server 8000 --bind 0.0.0.0 --directory docs
# Open http://localhost:8000/
```

## Data rules

- Keep `data/rings.json`, `data/evidence/*.json`, and their `docs/data/` mirrors synchronized.
- Store a direct seller/product URL when one is available. Collection pages and third-party pages remain visible but are flagged.
- If a price or gram weight is not published, use `null` or omit it; do not interpolate it.
- Calculated pure-gold fields must be reproducible from the stored weight and karat. Platinum rows do not receive a gold-content calculation.
- A `verified_on` date records the catalog’s stated review date; it is not a guarantee that the listing has not changed since then.
- Review [`data/evidence/_rejected.md`](data/evidence/_rejected.md) before adding a previously rejected listing.

## Disclaimer

This is an educational reference, not financial, legal, gemological, or purchasing advice. Retail prices, inventory, sizing, and product details can change. Independently verify the seller, metal purity, weight, stone details, and return terms before purchase.
