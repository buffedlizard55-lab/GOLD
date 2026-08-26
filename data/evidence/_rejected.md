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

## Removed 2026-08-26 (dedupe / wrong-product — 2026-08-26 review)

- `ritani_amata_18k_yellow_trellis` — The Amata Oval Cut 18kt Yellow Gold Four-Prong Trellis Cathedral Solitaire | Ritani | was $2316.0 | https://www.ritani.com/products/4-prong-trellis-cathedral-solitaire-diamond-engagement-ring-metal-18kt-yellow-gold-shape-oval
- `ritani_ciara_14k_white_split_double` — The Ciara Cushion Cut 14kt White Gold Split Double Band Solitaire | Ritani | was $1088.5 | https://www.ritani.com/products/split-double-band-solitaire-engagement-ring-1-metal-14kt-white-gold-shape-cushion
- `ritani_elodie_18k_yellow_classic_solitaire` — The Elodie Oval Cut 18kt Yellow Gold Classic Solitaire | Ritani | was $1873.0 | https://www.ritani.com/products/four-prong-solitaire-diamond-engagement-ring-metal-18kt-yellow-gold-shape-oval
- `ritani_elyse_18k_yellow_classic_solitaire` — The Elyse Round Cut 18kt Yellow Gold Classic Four-Prong Solitaire | Ritani | was $2207.0 | https://www.ritani.com/products/classic-4-prong-solitaire-diamond-engagement-ring-metal-18kt-yellow-gold-shape-round
- `ritani_maddie_14k_white_octagon` — The Maddie - Princess Cut Octagon Solitaire Engagement Ring | Ritani | was $1456.0 | https://www.ritani.com/products/octagon-solitaire-engagement-ring-metal-14kt-white-gold-shape-princess
- `ritani_ora_18k_yellow_petal_head` — The Ora Round Cut 18kt Yellow Gold Petal Head Solitaire | Ritani | was $1397.9 | https://www.ritani.com/products/4-prong-petal-head-solitaire-engagement-ring-metal-18kt-yellow-gold-shape-round
- `ritani_priya_14k_white_diamond_collar` — The Priya Solitaire 14kt White Gold Diamond Collar Engagement Ring | Ritani | was $1949.0 | https://www.ritani.com/products/solitaire-diamond-engagement-ring-with-diamond-collar-metal-14kt-white-gold-shape-oval
- `ritani_silvia_14k_white_embellished_prong` — The Silvia Round Cut 14kt White Gold Solitaire Diamond Embellished Prong | Ritani | was $2728.0 | https://www.ritani.com/products/solitaire-diamond-embellished-prong-engagement-ring-metal-14kt-white-gold-shape-round
- `ritani_milena_18k_yellow_knife_edge` — The Milena Round Cut 18kt Yellow Gold Solitaire Knife-Edge | Ritani | was $1975.0 | https://www.ritani.com/products/high-set-solitaire-knife-edge-engagement-ring-metal-18kt-yellow-gold-shape-round
- `automic_gold_rainbow_band_2` — Rainbow Band | Automic Gold | was $1728.0 | https://www.automicgold.com/collections/rings/products/rainbow-band
- `cordelia_round_18k_wg` — Cordelia Solitaire 18kt White Gold Round Cut Engagement Ring | Ritani | was $900.0 | https://www.ritani.com/products/solitaire-diamond-tulip-cathedral-engagement-ring-1-metal-18kt-white-gold-shape-round
- `ritani_nivea_14k_white_cushion` — The Nivea Solitaire 14kt White Gold Cushion Cut Engagement Ring | Ritani | was $1393.0 | https://www.ritani.com/products/four-prong-petal-inspired-solitaire-diamond-engagement-ring-metal-14kt-white-gold-shape-cushion
- `milena_platinum_oval` — Milena Solitaire Platinum Oval Cut Engagement Ring | Ritani | was $832.0 | https://www.ritani.com/products/high-set-solitaire-knife-edge-engagement-ring-metal-platinum-shape-oval
- `jasmine_platinum_emerald` — Jasmine Solitaire Platinum Emerald Cut Engagement Ring | Ritani | was $1423.0 | https://www.ritani.com/products/solitaire-diamond-cathedral-tapered-engagement-ring-metal-platinum-shape-emerald
- `mene_narrow_classic_band_24k_size_45` — Narrow Classic Band 24K Gold (Standard, Size 4.5) | Menē | was $1401.0 | https://mene.com/products/mene-narrow-band-gold
- `mene_narrow_classic_band_24k_engraved_size_45` — Narrow Classic Band 24K Gold (Engraved, Size 4.5) | Menē | was $1352.0 | https://mene.com/products/mene-narrow-band-gold
- `four_prong_solitaire_round_18k_rg` — Four-Prong Solitaire Diamond Engagement Ring | Ritani | was $810.0 | https://www.ritani.com/products/four-prong-solitaire-diamond-engagement-ring-metal-18kt-rose-gold-shape-round

## Removed 2026-08-26 (dedupe / wrong-product — 2026-08-26 review)


## Removed 2026-08-26 (round 2 dedupe / conflict resolution)

- `ritani_anais_14k_white_twisted_solitaire` — The Anais Emerald Cut 14kt White Gold Twisted Solitaire Engagement Ring | Ritani | was $1159.2 | https://www.ritani.com/products/twisted-solitaire-diamond-engagement-ring-1-metal-14kt-white-gold-shape-emerald
- `elodie_round_pt` — The Elodie Round Cut Platinum Classic Solitaire Engagement Ring | Ritani | was $1387.0 | https://www.ritani.com/products/four-prong-solitaire-diamond-engagement-ring-metal-platinum-shape-round
- `iris_marquise_18k_yg` — The Iris Marquise Cut 18kt Yellow Gold Bezel-Set Solitaire Engagement Ring | Ritani | was $2253.0 | https://www.ritani.com/products/the-iris-bypass-bezel-metal-18kt-yellow-gold-shape-marquise
- `juno_round_pt` — The Juno Round Cut Platinum Solitaire Six-Prong Knife-Edge Engagement Ring | Ritani | was $2193.0 | https://www.ritani.com/products/solitaire-diamond-six-prong-knife-edge-engagement-ring-metal-platinum-shape-round
- `ritani_kendra_14k_white_cathedral_tulip` — The Kendra Princess Cut 14kt White Gold Solitaire Cathedral Tulip Engagement Ring | Ritani | was $1772.0 | https://www.ritani.com/products/solitaire-diamond-cathedral-tulip-engagement-ring-metal-14kt-white-gold-shape-princess
- `maude_oval_18ky` — The Maude Oval Cut 18kt Yellow Gold Classic Solitaire Engagement Ring | Ritani | was $1655.25 | https://www.ritani.com/products/classic-solitaire-diamond-engagement-ring-metal-18kt-yellow-gold-shape-oval
- `maude_round_18kr` — The Maude Round Cut 18kt Rose Gold Classic Solitaire Engagement Ring | Ritani | was $1655.25 | https://www.ritani.com/products/classic-solitaire-diamond-engagement-ring-metal-18kt-rose-gold-shape-round
- `priya_round_pt` — The Priya Round Cut Platinum Classic Solitaire Engagement Ring | Ritani | was $1718.5 | https://www.ritani.com/products/solitaire-diamond-engagement-ring-with-diamond-collar-metal-platinum-shape-round
- `sadie_round_18ky` — The Sadie Round Cut 18kt Yellow Gold Tapered Cathedral Solitaire Engagement Ring | Ritani | was $2360.0 | https://www.ritani.com/products/tapered-cathedral-solitaire-engagement-ring-metal-18kt-yellow-gold-shape-round
- `stella_pear_pt` — The Stella Pear Cut Platinum Classic Solitaire Engagement Ring with Hidden Halo | Ritani | was $2638.0 | https://www.ritani.com/products/classic-solitaire-diamond-engagement-ring-with-hidden-halo-metal-platinum-shape-pear
- `stella_round_18ky` — The Stella Round Cut 18kt Yellow Gold Classic Solitaire Engagement Ring with Hidden Halo | Ritani | was $2247.0 | https://www.ritani.com/products/classic-solitaire-diamond-engagement-ring-with-hidden-halo-metal-18kt-yellow-gold-shape-round
- `valentina_oval_pt` — The Valentina Oval Cut Platinum Solitaire Channel Set Diamond Band Engagement Ring | Ritani | was $1903.3 | https://www.ritani.com/products/solitaire-channel-set-diamond-band-engagement-ring-metal-platinum-shape-oval
- `athena_pear_18k_yg` — Athena Solitaire 18kt Yellow Gold Pear Cut Engagement Ring | Ritani | was $1716.0 | https://www.ritani.com/products/solitaire-diamond-cathedral-engagement-ring-6-metal-18kt-yellow-gold-shape-pear
- `evelyn_oval_18k_rg` — Evelyn 18kt Rose Gold Oval Cut Engagement Ring | Ritani | was $1322.0 | https://www.ritani.com/products/solitaire-kite-set-swirl-diamond-engagement-ring-metal-18kt-rose-gold-shape-oval
- `willa_pear_18k_yg` — Willa Solitaire 18kt Yellow Gold Pear Cut Engagement Ring | Ritani | was $2426.0 | https://www.ritani.com/products/solitaire-diamond-tulip-cathedral-engagement-ring-6-metal-18kt-yellow-gold-shape-pear
- `dara_round_14k_wg` — The Dara Round Cut 14kt White Gold Bezel-Set Solitaire Engagement Ring | Ritani | was $907.9 | https://www.ritani.com/products/the-dara-bezel-metal-14kt-white-gold-shape-round
