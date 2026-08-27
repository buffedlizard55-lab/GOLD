# GOLD — Solid Gold Engagement Ring & Jewelry Buyer's Guide

A buyer-first, evidence-based reference directory for buying **solid gold** engagement rings and wedding bands online without getting scammed.

🔗 **Live Site:** https://buffedlizard55-lab.github.io/GOLD/

> ⚠️ **Status — 2026-08-27 (review session 4: line-by-line re-verification + correction of two bad below-threshold rows).** Full write-up with every link: [`docs/REVIEW_2026-08-27.md`](docs/REVIEW_2026-08-27.md). Two headline findings.
>
> **(1) The "5 rows below $4,861/oz" claim was overstated — 2 of the 5 did not hold up.** The Costco 2.5 mm band had repriced from **$329.99 to $449.99** (gold flat on both dates), moving it from $4,861/oz to **$6,628/oz** — i.e. *above* threshold; and the BGASC Nebü ring at $773.84 ($3,098/oz, 33% below melt) is a **stale pricing feed**, proven by BGASC's own on-page ticker reading "Gold $2,653.35" while live spot was $4,585–$4,649/oz, and by three other official dealers quoting the identical ring at $1,334.68–$1,373.53. Both were corrected/quarantined. Five evidence files were corrected in total; Costco 5 mm re-verified clean; Menē's Classic Band corrected $1,817 → **$1,934**.
>
> **(2) The requested 50 new below-threshold men's entries still do not exist, and now the reason is measured rather than asserted.** At today's spot ($4,585–$4,649/oz), $4,861/pure-gold-oz is **melt + 5.35%**. This session measured the real premium of every reachable channel: Costco **+37% to +50%**, Ross-Simons **+41%**, Midwest's gold rings **+110% to +187%**, Chow Tai Fook 999.9 gold **+21%** (live header: "999.9 Gold Selling Price HK$ 1,411.00/gram"), branded 24K jewellery **+16% to +20%**. Only **1/4 oz .9999 bullion rings at bullion premiums** clear the line — **2 new rows added** (SD Bullion Nebü Twist + Classic, $1,198.84 = **$4,800/oz**), and Midwest's below-melt inventory is confirmed exhausted (their "mens ring mounting" search returns exactly 3 products, all already tracked). Thailand's 96.5% gold *is* priced at melt+1.1% (official GTA rate THB 72,150/baht → $4,664/pure-oz), but **no Thai seller publishes a per-item price online** (Hua Seng Heng publishes weights only; ordering is via LINE), so citing one would be an estimate.
>
> Earlier sessions: [`docs/REVIEW_2026-08-26.md`](docs/REVIEW_2026-08-26.md) (line-by-line re-verification) · [`docs/REVIEW_2026-08-26-below-threshold-search.md`](docs/REVIEW_2026-08-26-below-threshold-search.md) (27-seller sweep). Pages still serves the repo **root**; the root `index.html` redirect is the workaround and the permanent fix is Pages source → `main` + `/docs` (needs repo admin).

---

## What This Project Is

- **475 ring rows** (473 after session 3, +2 verified 24K bullion-ring adds from session 4; 37 non-ring/reference rows excluded): a searchable directory of solid gold and platinum rings across 41 seller labels.
- **Evidence table with source links:** rows with a seller-published weight show the metal karat, gram weight, calculated raw gold content, retail price, and **Price per Pure Gold Troy Ounce / Gram**; rows without a published weight show "—" (223 of 475 currently have no published weight — the site does not invent one).
- **Planned but NOT yet implemented in this build:** the Interactive Melt-Value Calculator, the Size 4.5 investigation page, and the Buyer's Anti-Fraud Checklist / Post-Delivery Guide described in earlier iterations. Do not assume they ship.
- **Zero-Hallucination Policy (enforced where verification is possible):** every price/weight now either (a) was re-checked against the official page on 2026-08-26, or (b) is shown as "—"/flagged in a note when it could not be confirmed. Values that contradict the official page are corrected, not averaged. See `docs/REVIEW_2026-08-26.md` and `docs/REVIEW_2026-08-26-below-threshold-search.md` for the per-row verification tables with links.

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
| **Ring rows in the directory** | 475 | Each with an official `source_url`; 21 unverifiable prices withheld and flagged, not published |
| **Rows with seller-published weight** | 252 | Explicit metal weight; the other 223 show "—" (no weight is invented) |
| **Rows with price + weight → price per gold oz** | 224 | All derived arithmetic is recomputed by `scripts/build_rings.py` (0 inconsistencies in the 2026-08-27 audit) |
| **Rows below $4,861 / pure-gold-oz (≈ melt +5.35%)** | 6 stored, **5 credible** | 3 Midwest Jewellery men's 14K mountings ($3,794–$4,190) + 2 SD Bullion 1/4 oz Nebü 24K bullion rings added 2026-08-27 ($4,800) = 5 credible. The 6th (BGASC Nebü, $3,098) is **quarantined as a stale pricing feed**, not counted. The Costco row previously counted here was corrected to $6,628/oz and dropped out. |
| **Investment-Grade (24K) rows** | 65 | Pure 24K bullion-jewelry rings (Nebü, Kuvera, Menē, 7879, Goldzenn) |
| **Tracked Seller Labels** | 41 | Reference rows and non-ring items excluded from the directory |
| **Excluded / flagged for review** | 37 excluded + dupes removed | Full lists with links: `data/_excluded.json`, `data/evidence/_rejected.md`, `docs/REVIEW_2026-08-27.md` |

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
