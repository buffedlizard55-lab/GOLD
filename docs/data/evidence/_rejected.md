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

## Removed 2026-08-26 (dedupe / wrong-product — 2026-08-26 review)


## Rejected 2026-08-26 (below-$4,861/oz men's search — session 3)

Every candidate below was checked against its official product page on 2026-08-26 for the "men's ring below $4,861 per pure-gold-oz" requirement. Full math and links: `docs/REVIEW_2026-08-26-below-threshold-search.md`.

| Seller | Candidate | Why rejected | Link |
|---|---|---|---|
| Pompeii3 | 6mm 10K brushed black-inlay men's band (WB1669) | $476.64 / 3.5 g / 10K = $10,166 per gold oz (2.1x threshold) | https://www.pompeii3.com/6mm-10k-yellow-gold-mens-brushed-black-inlay-wedding-band/ |
| Pompeii3 | 8mm 10K brushed men's band (WB4491) | $828.00 / 6 g = $10,298/oz | https://www.pompeii3.com/mens-brushed-wedding-band-solid-10k-yellow-gold-ring-8mm-sz-7-12/ |
| Pompeii3 | 6mm 10K carved comfort-fit men's band (WB0652) | $810.70 / 5 g = $12,103/oz | https://www.pompeii3.com/mens-10k-yellow-gold-6mm-brushed-carved-wedding-band-comfort-fit-ring/ |
| JTV | 10K men's diamond ring 0.34ctw (1213WB) | $2,101.14 / 7.46 g = $17,684/oz | https://www.jtv.com/product/10k-yellow-gold-men-s-diamond-ring-0-34ctw/1213WB |
| JTV | 10K two-tone men's band 1.00ctw (DGB159) | $908.64 / 6.1 g = $11,118/oz | https://www.jtv.com/product/white-diamond-10k-two-tone-gold-mens-band-ring-1-00ctw/DGB159 |
| JTV | 10K WG men's band 0.20ctw (DOE530, clearance) | $449.99 / 4.7 g = $7,148/oz | https://www.jtv.com/product/white-diamond-10k-white-gold-mens-band-ring-0-20ctw/DOE530 |
| Shop LC | 10K WG diamond men's ring 6.70 g | $1,099.99 / 6.7 g = $12,253/oz; out of stock | https://www.shoplc.com/10k-white-gold-g-h-i1-diamond-0.50-ctw-mens-ring-size-9.0-6.70-grams/p/7707599.html |
| Shop LC | Luxoro 10K men's nugget ring 4.00 g | price at checkout ~2-3x melt | https://www.shoplc.com/luxoro-10k-yellow-gold-nugett-pattern-mens-ring-size-9.0-4.00-grams/p/7537924.html |
| ShopHQ | 14K band rings (catalog) | women's/stoned items, >= $24,000/oz equivalents | https://www.shophq.com/products/gilded-lane-14k-gold-4x3mm-multi-sapphire-diamond-band-ring |
| QVC | 14K bands | prices above melt; no qualifying men's items found | https://www.qvc.com/14K-Gold-Solid-Average-18%22-Oval-Hinged-Bangle-Bracelet,-156g.product.J334850.html |
| TraxNYC | 10K Pharaoh men's ring 66580 | $1,800 / 12.70 g = $10,581/oz | https://www.traxnyc.com/Mens-Rings-10K-Gold-Pharaoh-Ring-item66580.html |
| TraxNYC | 10K circular-cross men's ring 70999 | $4,800 / 17.30 g = $21,621/oz | https://traxnyc.com/products/circular-cross-mens-ring-set-with-lab-diamonds |
| Avianne & Co | 10K men's diamond band 0.38ctw | $985 / 4 g = $18,515/oz | https://www.avianneandco.com/products/10k-yellow-solid-gold-mens-diamond-wedding-ring-band-0-38-ctw |
| Sabrina Silver | 10K men's Masonic rings | $1,498+ and no gram weights published | https://sabrinasilver.com/sabrinasilver/ShopCart/impl/home.php?cat=2863 |
| Sam's Club | Comfort Fit Band 14K 2mm | $269 but NO gram weight published — price/oz unverifiable | https://www.samsclub.com/ip/Comfort-Fit-Band-in-14K-Gold-2mm/13585869873 |
| GoldenMine | 10K/14K men's comfort-fit dome bands | NO gram weights published on product pages | https://goldenmine.com/p/Plain-Bands/8mm-Classic-Light-Comfort-Fit-Dome-Mens-Wedding-Band---10K,-14K,-18K-Yellow-Gold/512819.html |
| Costco | 2.5mm band men's sizes 9-10; 5/6/7.5mm men's sizes | weights published, but price is size-dependent/dynamic ("Loading") — unverifiable; same URL already tracked | https://www.costco.com/2.5mm-comfort-fit-diamond-cut-wedding-band.product.4000322768.html |
| Midwest Jewellery | Men's solid signets 10-20 mm | NO weights published on product pages | https://midwestjewellery.com/gents-solid-signet-ring-w-brush-finished-top-14k-yellow-gold-14-00-mm-9689 |
| Midwest Jewellery | 10K men's band "3.1gm" 9mm | $599 / 3.1 g = $14,426/oz | https://midwestjewellery.com/diamond-wedding-band-mens-10k-yellow-gold-0-13ct-3-1gm-9mm-wide-ring-be-the-first-to-review-this-item |
| Midwest Jewellery | 10K men's wedding band w/ diamonds 7 g | $799 / 7 g = $8,522/oz | https://midwestjewellery.com/mens-diamond-wedding-band-wide-10mm-0-58ct-10k-white-gold-or-yellow-gold-comfort-fit |
| A&V Pawn | 10K men's comfort-fit band (Frederick Goldman) | $469.99 / 5.80 g = $6,049/oz; second-hand | https://avpawn.com/shop/10k-gold-mens-comfort-fit-wedding-ring/ |
| A&V Pawn | Vintage 14KYG men's statement ring | $1,874.99 / 7.14 g = $14,035/oz | https://avpawn.com/shop/vintage-mens-14kyg-diamond-statement-ring-by-star-diamond-group/ |
| RM Jewelry NC | 10K two-tone men's statement band | weight 5.1 g published but price not retrievable | https://rmjewelrync.com/products/10k-gold-ring-18217 |
| Mene | 24K Classic Band (sizes to 14) | "sold by weight" but NO weight published; data feed bot-blocked | https://mene.com/products/mene-classic-band-gold |
| 7879 | 24K men's signet | GBP sale pricing, sold out; above threshold in USD | https://7879.co/products/24k-gold-signet-ring |
| Provident Metals | Nebu 1/4 oz 24K Twist Ring | $1,340.34 / 7.776 g = $5,367/oz (above threshold) — existing row re-confirmed 2026-08-26 | https://www.providentmetals.com/nebu-1-4-oz-24k-bullion-twist-ring.html |
| Money Metals | Nebu 1/4 oz 24K Classic Ring | out of stock; $1,761.32 = $7,040/oz | https://www.moneymetals.com/gold-bullion-ring-classic-design-14-troy-oz-24k-pure/1029 |
| BGASC | further Nebu SKUs | site blocks automated fetch (reCAPTCHA) — unverifiable; existing $773.84 row flagged as anomaly | https://www.bgasc.com/product/nebu-1-4-oz-24k-bullion-classic-ring |
| H.Samuel / T.H. Baker / Warren James | 9K men's signets | GBP pricing — USD conversion would be an estimate (forbidden) | https://www.hsamuel.co.uk/ |
| eBay / Amazon resellers / Property Room / shopgoodwill / Etsy | various | third-party marketplaces or auctions — not first-party official sources | — |

**Accepted instead (2):** Midwest Jewellery men's 14K mountings — 6.35 g @ $499 ($4,190/oz) and 7.99 g @ $579 ($3,864/oz). See `data/evidence/midwest_jewellery_mens_mounting_*.json`.

---

## Session 4 — 2026-08-27 (below-threshold men's search, round 2)

Spot gold 2026-08-27: $4,584.96 (CNBC) / $4,615.40 (Bullion.com) / $4,648.90 (USAGOLD, Yahoo Finance). Threshold $4,861/pure-gold-oz = **melt + 5.35%**. Ceilings: 10K $65.12/g · 14K $91.17/g · 18K $117.21/g · 22K $143.26/g · 24K $156.13/g of finished ring.
FX reference: Federal Reserve H.10, release 2026-08-24 — HKD 7.8397, THB 32.63, CNY 6.7210, INR 95.70, MYR 4.0354 (https://www.federalreserve.gov/releases/h10/current/).

| Seller | Candidate | Measured data (own official page, 2026-08-26/27) | Verdict | Link |
|---|---|---|---|---|
| Costco | 2.5mm Comfort Fit Diamond Cut Band 14kt | **$449.99** live (was $329.99 on 08-19); WG4.5 3.62g / YG4 3.45g / men's YG10 4.40g / men's WG10 4.65g | ❌ $6,628 (WG4.5) · $6,955 (YG4) · $5,453 (men's YG10) · $5,160 (men's WG10) — +37% to +50% over melt | https://www.costco.com/p/-/25mm-comfort-fit-diamond-cut-wedding-band/4000322768 |
| Costco | 5mm Comfort Fit Band 14kt | $699.99 (unchanged); men's size 10 = 5.89g | ❌ men's size 10 = $6,337/oz (+37%) | https://www.costco.com/p/-/5mm-comfort-fit-wedding-band/4000322632 |
| Costco | 6mm Comfort Fit Band 14kt | weight table re-verified (men's size 10 = 6.84g) but **price renders "Loading"** | ⚠️ price not verifiable today; stale $829.99 would give $6,208 for men's size 10 | https://www.costco.com/p/-/6mm-comfort-fit-wedding-band/4000322620 |
| Ross-Simons | Men's 5mm 14kt YG Milgrain Wedding Ring | "Gold Weight: 4.9 grams", sale from $596.25 (list $795.00) | ❌ $6,488/oz (+41%) | https://www.ross-simons.com/mens-5mm-14kt-yellow-gold-milgrain-wedding-ring-571214.html |
| Ross-Simons | Men's 5mm 14kt YG Wedding Ring | "Gold Weight: 5.0 grams" | ❌ ~$6,360/oz at the same sale price | https://www.ross-simons.com/mens-5mm-14kt-yellow-gold-wedding-ring-571213.html |
| Midwest Jewellery | **entire men's-ring catalogue** (875 items, $51–$5,918) | cheapest items are 925 sterling; every gold item with a published gram weight is +110% to +187% over melt — 10K 4.81g/$999 = $15,503/oz · 14K 5.49g/$1,000 = $9,713/oz · 10K 7.7g/$1,299 = $12,594/oz · 10K 14.10g/$2,499 = $13,230/oz | ❌ below-melt inventory **exhausted**: "mens ring mounting" search returns exactly 3 products, all already tracked | https://midwestjewellery.com/men-s-jewelry/wedding-bands · https://midwestjewellery.com/catalogsearch/result/?q=mens+ring+mounting |
| Tex Metals | Nebü 24k Classic Bullion Ring 0.25oz | $1,334.68 | ❌ $5,339/oz (+15.7%) | https://texmetals.com/p/classic-bullion-ring |
| Provident Metals | Nebü 1/4 oz 24K Bullion Twist Ring | $1,340.34 (1+) / $1,354.30 / $1,396.19; ticker Gold $4,608.19 | ❌ $5,361/oz (+16.2%) | https://www.providentmetals.com/nebu-1-4-oz-24k-bullion-twist-ring.html |
| JM Bullion | Nebü 1/4 oz 24K Bullion Twist Ring (ID 5649774, In Stock) | $1,373.53 eCheck / $1,387.84 crypto / $1,430.76 card | ❌ $5,494/oz (+19.1%) | https://www.jmbullion.com/nebu-1-4-oz-24k-bullion-twist-ring/ |
| SD Bullion | non-bullion Nebü rings (8.7g Modern Infinity $1,545.93 · 7.5g Arrow $1,332.70 · 8.5g Double Banded $1,510.39) | weights published in product names | ❌ $5,532/oz each (+19.9%) | https://sdbullion.com/jewelry/gold-jewelry |
| Menē | Classic / Narrow / Wide / Flat / Wide-Flat 24K bands | $1,934 live (default size 4) · "From $1,472 / $2,350 / $2,392 / $2,622"; **no gram weight published** ("sold by weight, not size"); `.js` endpoint returns 404 | ⚠️ price/oz cannot be computed without estimating | https://mene.com/products/mene-classic-band-gold · /mene-narrow-band-gold · /mene-wide-band-gold |
| Chow Tai Fook | 999 / 999.9 gold rings, HK eShop ("Priced by Weight": Gold Value + Commission + Labour Charge, per-size tael weights) | live site header 2026-08-27: **"999.9 Gold Selling Price HK$ 1,411.00/gram \| About HK$ 52,814.00/tael"** = $179.98/g | ❌ **$5,597/pure-gold-oz (+21.3%) — whole HK channel eliminated** | https://www.chowtaifook.com/en-hk/eshop/jewellery/rings/999.9-gold-ring/F1376.html · https://www.chowtaifook.com/en-hk/eshop/wedding/pure-gold/999.9-gold-ring/F609.html |
| Chow Sang Sang | 999 / 999.9 gold rings, eShop-HK (per-variant URLs `…-WT-0.1820`, labour HK$70–780) | structure confirmed on the seller's own pages, but **every product URL returns "Page unavailable"** to an automated fetch (3 attempts) and `/en/search?keyword=…` returns "no items matching your request" | ⚠️ no live price obtainable | https://www.chowsangsang.com/eshop-hk/en/999.9-Gold-Ring/999.9-Gold-Ring/p/PRD-82810GAR-408883-WT-0.2120 |
| Hua Seng Heng (Thailand) | 23 rings, 96.5% gold | **weights published** (dragon ring 0.50–2 baht; classic ring 0.125–2 baht) but **no price on any product page** — all route to LINE "Chat & Shop". Their FAQ: "Price set by the Gold Traders Association / gold baht + making price (starting from 800/gold baht)" | ⚠️ computing a price from the formula would be an estimate | https://www.huasengheng.com/en/product-category/chat-shop-en/jewelry-en/rings-en/ · https://www.huasengheng.com/en/product/square-frame-dragon-ring/ · https://www.huasengheng.com/en/product/classic-ring/ |
| Gold Traders Assoc. of Thailand | official 96.5% price, 27/08/2569 17:11 (#29) | gold bar buy 71,150 / sell 71,350; **ornament sell 72,150** THB/baht; Spot $4,581.50, USD/THB 32.89 | ⚠️ = **$4,664/pure-gold-oz (+1.1%)** — structurally eligible, but no official per-item price exists to cite | https://www.goldtraders.or.th/ |
| Baht Gold Jewelry Co. | Thai 96.5% men's rings (23kgold.com) | "as of January 2026": 2 baht (30.32g) $4,998 · 1 baht (15.16g) $2,533; men's dragon ring GR-101-US size 11.5, 30.4g, $4,998 | ❌ $5,313 (2 baht) / $5,385 (1 baht), and pricing is 7 months stale | http://www.23kgold.com/gold_rings.htm |
| BGASC | Nebü 1/4 oz 24K Bullion Classic Ring at $773.84 | **stale feed**: same page's metal ticker reads "Gold $2,653.35" vs live spot $4,585–$4,649; three other dealers quote the identical ring at $1,334.68–$1,373.53 | ⚠️ **quarantined** — excluded from the below-threshold count | https://www.bgasc.com/product/nebu-1-4-oz-24k-bullion-classic-ring |

**Accepted instead (2):** SD Bullion 1/4 oz Nebü 24K Bullion **Twist** Ring (SKU GJBRGTWIST-025) and 1/4 oz Nebü 24K **Classic** Gold Bullion Ring (SKU GJBRGCLASSIC-025) — both $1,198.84 / 7.776 g = **$4,800.08/pure-gold-oz** (+4.0% over SD Bullion's own spot quote of $4,614.34). Caveats recorded in the evidence files: both product pages are currently out of stock and render no price (price cited from the seller's official category listing, rows carry a FLAGGED marker), and both are **unisex** bullion rings (Medium 6–7.5), not men's-specific listings.
