# Gold Engagement Ring — No-Hallucination Buyer's Guide

A buyer-first, evidence-based reference for buying a **solid-gold**
engagement ring online without getting scammed.

🔗 **Live site:** https://buffedlizard55-lab.github.io/GOLD/

## What this project is

- A **checklist** distilled from years of marketplace gold-jewelry fraud reports.
- An **evidence table** of specific rings we are tracking, where every row
  has a source URL you can click.
- A **gold-content calculator** that does arithmetic on numbers you supply
  (it deliberately does not call a price API).
- A **live gold spot price** embedded from Kitco — we don't transcribe it,
  so we can't misquote it.
- An **independent-verification guide** for after your ring arrives
  (XRF testing, hallmarks, weights).

## The no-hallucination policy

This is the project's central rule. Every product price, weight, hallmark,
and spot-price figure on this site is either:

1. pulled from a live external source with a citation link, **or**
2. clearly labeled as user-input or a placeholder.

If you spot a number without a *Source* link, that is a bug — please
open a GitHub issue.

## How content is added

1. Drop a JSON file in `data/evidence/` following the schema in
   `data/evidence/_schema.json`.
2. Add the file's path to `EVIDENCE_FILES` in `docs/scripts.js`.
3. Run `bash scripts/audit.sh` — it must pass before you open a PR.
4. Open a PR. The CI will re-run the audit and block the merge if it
   fails.

The audit enforces:

- Every evidence row has a `source_url`.
- No orphan dollar amounts in the HTML (every number is next to a link).
- `scripts.js` does not call out to any external price API.
- Every evidence row has a `verified_on` date.

## Local preview

```bash
# from the repo root
python3 -m http.server --directory docs 8000
# then open http://localhost:8000
```

The `fetch()` calls in `docs/scripts.js` need to be served over `http://`,
not opened as a `file://` URL, because the browser blocks cross-origin
JSON reads from `file://`.

## Repository layout

```
.
├── docs/                     # GitHub Pages site (static)
│   ├── index.html
│   ├── styles.css
│   └── scripts.js
├── data/evidence/            # one JSON file per tracked ring
│   ├── _schema.json
│   └── *.json
├── scripts/
│   └── audit.sh              # the hallucination security check
├── .github/workflows/
│   ├── hallucination-audit.yml
│   └── pages.yml
└── README.md
```

## Disclaimer

This project is an educational buyer's guide, not financial or gemological
advice. Always independently verify with a qualified jeweler before
purchase.
