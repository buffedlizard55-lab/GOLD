# scripts/

## `audit.sh`

A deliberately simple "security check" for hallucinations. It enforces the
no-hallucination policy in four ways:

1. Every JSON row in `data/evidence/` must have a `source_url`.
2. `docs/index.html` must not contain a `$NNN.NN` amount that isn't tied to a
   known placeholder, a link, or a citation.
3. `docs/scripts.js` must not call out to any external price API (so the
   calculator can't quietly "make up" a spot price).
4. Every evidence row must have a `verified_on` date.

Run it after every content change:

```bash
bash scripts/audit.sh
```

If it fails, the merge should be blocked.

The script is intentionally dumb. It catches the common hallucination
pattern (orphan numbers), not all possible hallucinations. A human still
needs to read the source links and check the math.
