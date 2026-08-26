# GOLD — Solid Gold Engagement Ring & Jewelry Buyer's Guide

A buyer-first, evidence-based reference directory for buying **solid gold** engagement rings and wedding bands online without getting scammed.

🔗 **Live Site:** https://buffedlizard55-lab.github.io/GOLD/

> ⚠️ **Status — 2026-08-26.** A full repo + site review found that **the live URL was serving the README, not the ring directory**, because GitHub Pages is configured to publish the repository **root** instead of `docs/` (root cause and manual-verification links are in [`docs/REVIEW_2026-08-26.md`](docs/REVIEW_2026-08-26.md)). The review also found **confirmable data errors in the dataset** (wrong prices/sizes/weights vs. official pages) and that the "every row provides weight / price per gold oz" and "calculator / checklist / CI audit" claims in this README were **not true** of the shipped files. A root `index.html` redirect was added so the app is reachable at `/GOLD/` after merge; the permanent fix is the Pages source setting → `main` + `/docs` (needs repo admin).

---

## What This Project Is

- **487 tracked entries** (NOT all verified — see review): a searchable database of solid gold and platinum jewelry across 35 seller labels.
- **Evidence table with source links:** rows that have a seller-published weight show the metal karat, gram weight, calculated raw gold content, retail price, and **Price per Pure Gold Troy Ounce / Gram**; rows without a published weight show "—" (262 of 487 currently have no weight).
- **Planned but NOT yet implemented in this build:** the Interactive Melt-Value Calculator, the Size 4.5 investigation page, and the Buyer's Anti-Fraud Checklist / Post-Delivery Guide described in earlier iterations. Do not assume they ship.
- **Zero-Hallucination Policy (aspirational):** the policy states every number must be read from an official page with a citation URL. The bundled `scripts/audit.sh` only checks field **presence** (URL string, date string, no external API call) and **cannot** detect wrong values — the 2026-08-26 review proves it exits 0 while real errors are present.

---

## The No-Hallucination Policy

This is the project's foundational rule:

1. Every product price, weight, hallmark, and link on this site is extracted directly from the seller's official product listing with an active citation URL.
2. The browser application performs arithmetic calculations only and never calls external, non-deterministic price APIs.
3. Every entry has a verified date in 2026 or later.

To enforce this, run the automated security audit:

```bash
bash scripts/audit.sh
```

The audit automatically verifies:
- **[1/4]** Every JSON file in `data/evidence/` has a valid `source_url`.
- **[2/4]** `docs/index.html` contains zero orphan dollar amounts.
- **[3/4]** `docs/scripts.js` does not call external price APIs.
- **[4/4]** Every evidence file has a valid `verified_on` date.

---

## Key Metrics in the Dataset

| Metric | Value | Details |
|---|---|---|
| **Total Tracked Listings** | 487 | Entries with source URLs; **NOT all line-by-line verified** (2026-08-26 spot check: 11 of 27 confirmed wrong) |
| **Rows with seller-published weight** | 226 | Explicit metal weight published by seller |
| **Rows with any weight** | 226 of 487 | The other 261 rows show "—" for weight/raw gold/price-per-oz |
| **Investment-Grade (24K) Bands** | 12 rows | Pure 24K; 3 of them are duplicate rows for the same Menē product |
| **Tracked Seller Labels** | 35 | Includes 2 non-ring reference rows (Kitco price feed, weight chart) and 31 non-ring jewelry rows |
| **Lowest Price / Gold Oz** | ~$3,794 / oz | Computed from current rows; **inputs not re-verified** — do not quote as a fact |

---

## Repository Layout

```
.
├── docs/                     # GitHub Pages static website
│   ├── index.html            # Main web application layout
│   ├── styles.css            # Modern, responsive design system
│   ├── scripts.js            # Table rendering, filtering, sorting, calculator, exports
│   └── data/
│       ├── rings.json        # Compiled directory of 487 verified records
│       └── evidence/         # Mirrored raw JSON evidence files
├── data/
│   ├── rings.json            # Master compiled directory
│   └── evidence/             # Raw JSON evidence files (one per tracked ring)
│       ├── _schema.json      # JSON Schema definition
│       ├── _rejected.md      # Excluded / suspect listings log
│       └── *.json
├── scripts/
│   └── audit.sh              # Anti-hallucination verification audit
├── .github/workflows/
│   ├── hallucination-audit.yml # Automated CI audit on PR/push
│   └── pages.yml             # GitHub Pages automated deployment
└── README.md
```

---

## Local Development & Preview

```bash
# 1. Sync data to docs (if adding new evidence files)
cp -r data/evidence/* docs/data/evidence/

# 2. Run the anti-hallucination audit
bash scripts/audit.sh

# 3. Start a local preview server
python3 -m http.server 8000 --directory docs

# 4. Open http://localhost:8000 in your browser
```

---

## How to Add New Verified Rings

1. Add a JSON file in `data/evidence/<seller>_<ring>.json` following `data/evidence/_schema.json`.
2. Ensure `source_url`, `seller`, `karat`, `hallmark`, and `verified_on` (2026-XX-XX) are present.
3. Sync data to `docs/data/evidence/` and update `data/rings.json` / `docs/data/rings.json`.
4. Run `bash scripts/audit.sh` — it must exit with code 0 before opening a PR.

---

## Disclaimer

This project is an educational, evidence-based buyer's reference guide, not financial, legal, or gemological advice. Always independently verify metal purity and weight with a qualified jeweler before purchasing.
