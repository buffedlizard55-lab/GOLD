# Rejected / insufficient-detail listings

These are URLs we considered for the evidence table but did **not** add,
because the page did not let us verify the rings as "legitimate, solid gold,
with weight in grams" against the checklist.

The "why" is recorded so we can revisit if the seller publishes more detail.

## Insufficient public detail (would be a yellow flag on the checklist)

These are legitimate-looking sellers whose product pages simply do not
publish the ring's weight in grams. They are *not* scams — they just
don't satisfy the "weight in grams" item on our checklist without an
offline request to customer service.

| Seller | URL | Why skipped |
|---|---|---|
| Blue Nile — Classic Four Prong Solitaire (18K Yellow) | https://wwd.com/shop/shop-fashion/blue-nile-engagement-ring-guide-1236295799/ | Third-party article, not Blue Nile's own page; weight not given. |
| Mejuri — Dôme Figure Ring 14K Yellow Gold | (resold via eragem.com) | Reseller listing, not Mejuri's own product page. |
| Mejuri — Bold Open Dôme Ring 18K Vermeil | https://mejuri.com/collections/rings | Listed as "18K Gold Vermeil" — explicitly NOT solid gold per FTC. |
| Luxurian Jewels — Moissanite Solitaire 14K | https://www.luxurianjewels.com/products/14k-gold-round-cut-moissanite-solitaire-engagement-ring | States "Stamp/Hallmark: Yes" but does not publish gram weight; small bespoke seller. |
| Ritani — various settings | https://www.ritani.com/ | ~~Standard catalog did not surface gram weights in the snippets pulled. Worth a deeper re-check.~~ **RESOLVED 2026-08-17:** Ritani's product detail pages display "The metal weight of this ring is X.XXg" (e.g. The Delia 4.04g, The Maddie 3.84g). Added 4 Ritani settings to evidence table. See `data/evidence/ritani_*.json`. |
| Verragio — various settings | https://www.verragio.com/ | Designer brand; no gram weights in catalog snippets. |
| David's House of Diamonds — various engagement rings | https://davidshouseofdiamonds.com/ | ~~Under initial review~~ **UPGRADED 2026-08-17:** Seller publishes "Gold Weight" in grams on every product page (e.g. oval solitaire 2.8g). Added 2 David's House rings to evidence table. See `data/evidence/davids_house_*.json`. |

## Suspect or excluded

| Listing | Why rejected |
|---|---|
| Etsy listings that mention "14K" but no maker's mark, no weight, and third-party "appraisal" PDFs | Plated/mis-stamped rings are routine on Etsy. Always request XRF before buying from any Etsy seller. |
| eBay "James Allen" resale listings | Third-party, not jamesallen.com. The seller's claim of "James Allen" can be true (it was a legitimate returned item) or false. We added the original James Allen product page instead. |
| Any listing that uses words "gold-tone", "gold-plated", "gold overlay", "vermeil", "gold-filled" in place of "solid gold" | Per checklist rule 2: must explicitly say "solid gold". Vermeil, plated, and filled are not. |
| AliExpress, Temu, Wish listings for "14K gold rings" | Almost universally gold-plated base metal at $20–$60 prices. The price-below-melt math fails instantly. |

## How to add a previously-rejected listing

1. Visit the seller's product page.
2. Confirm the page shows: karat (10K/14K/18K), hallmark photo or text, weight in grams, and a verifiable seller (real domain, real address).
3. If yes, create `data/evidence/<seller>_<ring>.json` and add it to `EVIDENCE_FILES` in `docs/scripts.js`.
4. If no, leave it in this file with a one-line explanation of what's still missing.
5. Re-run `bash scripts/audit.sh` and the site will pick up the new row.
