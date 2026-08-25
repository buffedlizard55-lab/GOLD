# GOLD — Solid Gold Engagement Ring & Jewelry Buyer's Guide

A buyer-first, evidence-based reference directory for buying **solid gold** engagement rings and wedding bands online without getting scammed.

🔗 **Live Site:** https://buffedlizard55-lab.github.io/GOLD/

---

## What This Project Is

- **487 Verified Entries:** A comprehensive, searchable database of solid gold and platinum rings across 35 trusted retailers and bullion makers.
- **Strict Evidence Table:** Every single row provides the official source link, metal karat, total gram weight, calculated raw gold content, retail price, and **Price per Pure Gold Troy Ounce / Gram**.
- **Interactive Melt-Value Calculator:** Real-time arithmetic tool to calculate the exact raw gold content, spot metal melt value, and retail markup percentage for any ring.
- **Size 4.5 Focus & Investigation:** Deep analysis of small-size ring availability (~48mm circumference) and weight disclosure across top brands.
- **Buyer's Anti-Fraud Checklist & Post-Delivery Guide:** Practical 5-step checklist and testing procedures (XRF spectrometry, specific gravity, digital scale, hallmark inspection) to prevent fraud.
- **Zero-Hallucination Policy:** Every product price, metal weight, hallmark, and spot-price reference is verified line by line against official live retailer pages.

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
| **Total Tracked Listings** | 487 | 100% verified with official source links |
| **High-Transparency Listings** | 219+ | Explicit metal weight published by seller |
| **Investment-Grade (24K) Bands** | 11 | Pure 24K solid gold (99.9% purity) |
| **Tracked Retailers & Brands** | 35 | Ritani, Automic Gold, Quince, Menē, Costco, 7879, Baby Gold, Ferko's, etc. |
| **Lowest Price / Gold Oz** | ~$3,794 / oz | Solid gold mountings and bullion-linked bands |

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
