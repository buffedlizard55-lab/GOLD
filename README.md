# GOLD — Solid Gold Engagement Ring & Jewelry Buyer's Guide

A buyer-first, evidence-based reference directory for buying **solid gold** engagement rings and wedding bands online without getting scammed.

🔗 **Live Site:** https://buffedlizard55-lab.github.io/GOLD/

> ⚠️ **Status — 2026-08-26 (review session 2, all fixes applied).** The live URL was serving the README, not the ring directory (GitHub Pages publishes the repo **root**, not `docs/`). A root `index.html` redirect now fixes the site once this branch is merged; the permanent fix is the Pages source setting → `main` + `/docs` (needs repo admin). The dataset was also **re-verified line by line against official seller pages** — wrong prices corrected, duplicate rows removed, implausible weights withheld, non-ring items excluded — full evidence and manual-review links in [`docs/REVIEW_2026-08-26.md`](docs/REVIEW_2026-08-26.md).

---

## What This Project Is

- **417 ring rows** after the 2026-08-26 re-verification (was 487: 35 non-ring items such as bracelets/earrings/necklaces and 2 reference rows are now excluded, 32 duplicate or contradicting rows removed, 16 unverifiable prices withheld with flags): a searchable directory of solid gold and platinum rings across 33 seller labels.
- **Evidence table with source links:** rows with a seller-published weight show the metal karat, gram weight, calculated raw gold content, retail price, and **Price per Pure Gold Troy Ounce / Gram**; rows without a published weight show "—" (223 of 417 currently have no published weight — the site does not invent one).
- **Planned but NOT yet implemented in this build:** the Interactive Melt-Value Calculator, the Size 4.5 investigation page, and the Buyer's Anti-Fraud Checklist / Post-Delivery Guide described in earlier iterations. Do not assume they ship.
- **Zero-Hallucination Policy (enforced where verification is possible):** every price/weight now either (a) was re-checked against the official page on 2026-08-26, or (b) is shown as "—"/flagged in a note when it could not be confirmed. Values that contradict the official page are corrected, not averaged. See `docs/REVIEW_2026-08-26.md` for the per-row verification table with links.

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
- **[1/7]** Every JSON file in `data/evidence/` has a valid `source_url`.
- **[2/7]** `docs/index.html` contains zero orphan dollar amounts.
- **[3/7]** `docs/scripts.js` does not call external price APIs.
- **[4/7]** Every evidence file has a valid `verified_on` date.
- **[5/7]** No two evidence files cite the same `source_url` (duplicate rows).
- **[6/7]** `data/rings.json` is in sync with the evidence files (`scripts/build_rings.py` output), and all derived arithmetic (raw gold, price per oz/gram) is internally consistent.
- **[7/7]** No evidence file has a physically implausible weight (< 0.8 g) or a collection-page citation left unflagged.

---

## Key Metrics in the Dataset

| Metric | Value | Details |
|---|---|---|
| **Ring rows in the directory** | 417 | Each with an official `source_url`; 16 unverifiable prices withheld and flagged, not published |
| **Rows with seller-published weight** | 194 | Explicit metal weight; the other 223 show "—" (no weight is invented) |
| **Rows with price + weight → price per gold oz** | 166 | All derived arithmetic is recomputed by `scripts/build_rings.py` (0 inconsistencies in the 2026-08-26 audit) |
| **Investment-Grade (24K) rows** | 9 | Pure 24K; the triple-listed Menē narrow band now appears once |
| **Tracked Seller Labels** | 33 | Reference rows (Kitco feed, weight chart) and 35 non-ring items excluded from the directory |
| **Excluded / flagged for review** | 37 excluded + 32 removed dupes | Full lists with links: `data/_excluded.json`, `data/evidence/_rejected.md`, `docs/REVIEW_2026-08-26.md` |

---

## Repository Layout

```
.
├── docs/                     # GitHub Pages static website
│   ├── index.html            # Main web application layout
│   ├── REVIEW_2026-08-26.md  # Full review: findings, fixes, manual-verification links
│   ├── styles.css            # Modern, responsive design system
│   ├── scripts.js            # Table rendering, filtering, sorting, exports
│   └── data/
│       ├── rings.json        # Compiled directory (generated — do not edit by hand)
│       └── evidence/         # Mirror of data/evidence (generated)
├── data/
│   ├── rings.json            # Compiled directory (generated)
│   ├── _excluded.json        # Rows excluded from the directory (non-ring/reference) + reasons
│   └── evidence/             # Raw JSON evidence files (one per tracked ring) — SOURCE OF TRUTH
│       ├── _schema.json      # JSON Schema definition
│       ├── _rejected.md      # Excluded / suspect / deduplicated listings log
│       └── *.json
├── scripts/
│   ├── audit.sh              # Anti-hallucination verification audit (7 checks)
│   ├── build_rings.py        # Canonical compiler: evidence/*.json -> rings.json
│   └── apply_review_fixes_2026_08_26.py  # One-time verified corrections from the review
└── README.md
```

Note: there is **no** `.github/workflows/` CI yet (the earlier README advertised one — it never existed). Adding a workflow that runs `scripts/audit.sh` on PRs is recommended follow-up work.

---

## Local Development & Preview

```bash
# 1. After changing anything in data/evidence/, recompile the site data:
python3 scripts/build_rings.py

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
3. Recompile the site data: `python3 scripts/build_rings.py` (updates both `data/rings.json` and the `docs/` mirror — never edit those by hand).
4. Run `bash scripts/audit.sh` — it must exit with code 0 before opening a PR.

---

## Disclaimer

This project is an educational, evidence-based buyer's reference guide, not financial, legal, or gemological advice. Always independently verify metal purity and weight with a qualified jeweler before purchasing.
