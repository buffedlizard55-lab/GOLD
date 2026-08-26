# scripts/

## `audit.sh`

A deliberately simple "security check" for hallucinations — 7 checks:

1. Every JSON row in `data/evidence/` must have a `source_url`.
2. `docs/index.html` must not contain an orphan `$NNN.NN` amount (one with no
   citation link near it).
3. `docs/scripts.js` must not call out to any external price API.
4. Every evidence row must have a `verified_on` date in 2026 or later.
5. No two evidence files may cite the same `source_url` (duplicates let
   conflicting numbers hide behind one link). Rows with a documented `FLAGGED`
   review note are reported as INFO instead of failing.
6. `data/rings.json` must be in sync with the evidence files, mirrored to
   `docs/data/rings.json`, and all derived arithmetic (raw gold, price per
   gold oz) must be internally consistent.
7. No evidence file may carry a physically implausible weight (< 0.8 g), and
   collection-page / third-party citations must carry a `FLAGGED` review note.

Run it after every content change:

```bash
bash scripts/audit.sh
```

If it fails, the merge should be blocked. The script catches the *common*
hallucination patterns, not all possible ones — a human still needs to open
the source links and sanity-check the values.

## `build_rings.py`

Canonical compiler: `data/evidence/*.json` (source of truth) → `data/rings.json`
and `docs/data/rings.json`, plus an exact mirror of the evidence files into
`docs/data/evidence/`. Recomputes every derived field (raw gold grams/oz,
price per gold gram/oz, discount %) with one formula set, so rounding drift
cannot creep back in. Run after ANY evidence change:

```bash
python3 scripts/build_rings.py
```

## `apply_review_fixes_2026_08_26.py`

One-time, idempotent corrections from the 2026-08-26 review, kept as an audit
trail: every change records the official page it was verified against (see
`docs/REVIEW_2026-08-26.md`). Do not extend it for new edits — edit the
evidence JSONs directly and re-run `build_rings.py`.
