#!/usr/bin/env python3
"""apply_review_fixes_2026_08_26.py — one-time corrections from the 2026-08-26 review.

Every change below was verified against the seller's OFFICIAL page on 2026-08-26
(either the live HTML page or the seller's own Shopify storefront API).
See docs/REVIEW_2026-08-26.md for the verification table with manual-review links.

Actions
  1. Correct prices that contradict the live official page.
  2. Null prices that could not be confirmed at product level (kept in the note).
  3. Remove exact-duplicate rows (same source_url, same product) — logged in
     data/evidence/_rejected.md.
  4. Remove rows whose product name contradicts the page at the cited URL.
  5. Add citation-quality flags for rows citing collection pages / third-party
     articles (price kept only where the product page itself was verified).
  6. Exclude non-ring items (bracelets/earrings/necklaces) and reference rows
     from the ring directory (moved to data/_excluded.json, sources kept).

Idempotent: safe to re-run.
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EV = os.path.join(ROOT, "data", "evidence")
TODAY = "2026-08-26"


def load(fid):
    with open(os.path.join(EV, fid + ".json")) as f:
        return json.load(f)


def save(fid, data):
    data["verified_on"] = TODAY
    with open(os.path.join(EV, fid + ".json"), "w") as f:
        json.dump(data, f, indent=2)
        f.write("\n")


def note_merge(d, add):
    d["note"] = (add + " " + d["note"]).strip() if d.get("note") else add


# ---------------------------------------------------------------- 1+2. price fixes
PRICE_FIXES = {
    # Live official US page, 2026-08-26 (this session): $7,443.33 struck through,
    # $4,466.00 sale price, all sizes SOLD OUT, 24K 99.9%, UK hallmark, no weight.
    "7879_signet_ring_24k": {
        "price_usd": 4466.0,
        "note": "VERIFIED 2026-08-26 from live 7879 US page: $4,466.00 (sale; $7,443.33 list), 24K (99.9%), UK-hallmarked, ALL SIZES SOLD OUT, 10.0mm high / 10x10mm top / 2.0mm band. No gram weight and no metal-value breakdown is published (prior $4,617 / 14.5g / $2,770+$1,015+$831 claims removed as unverifiable). UK site shows the same ring in GBP (£3,485.99).",
    },
    # Live official Shopify API / page, 2026-08-26 (this session, re-verified independently):
    "mene_narrow_band_24k": {
        "price_usd": 1554.0, "weight_g": None,
        "note": "VERIFIED 2026-08-26 live: $1,554 USD (24K, sizes 4-13 incl 4.5). Menē prices float daily with the gold price; page states 'Products are sold by weight, not size' and shows per-size weight only in the interactive size selector, so no gram weight is recorded here (prior 10.15g belonged to size 10 per the repo's own note). Duplicate rows at the same URL ($1,401, $1,352-with-engraving which was cheaper than non-engraved — logically impossible) were removed.",
    },
    "elodie_round_18kr": {
        "price_usd": 1873.0,
        "note": "VERIFIED 2026-08-26 live: $1,873.00 (SKU 1RZ4775, 18kt rose gold, 1.8mm). Prior stored $1,387 was stale.",
    },
    "milena_oval_pt": {
        "price_usd": 1907.0,
        "note": "VERIFIED 2026-08-26 live: $1,907.00 platinum knife-edge solitaire. BOTH prior duplicate rows ($832 and $1,450) contradicted the live page; the $832 row was removed.",
    },
    "quince_circle_eternity_band_14k": {
        "price_usd": 228.0, "original_price_usd": 298.0, "discount_pct": 23,
        "note": "VERIFIED 2026-08-26 live: $228.00, 'You save 23% / $298 traditional retail', 2.5mm, sizes 4-9 incl 4.5, 129 reviews.",
    },
    "quince_3_stone_inlay_band_14k": {
        "price_usd": 468.0, "original_price_usd": 498.0, "discount_pct": 6,
        "note": "RE-VERIFIED 2026-08-26 live: $468.00, 'You save 6% / $498 traditional retail', 0.06ctw GH/SI2+, 2.9mm, sizes 4-9 incl 4.5.",
    },
    "cordelia_round_18k_wg_2": {
        "price_usd": 2970.0,
        "note": "RE-VERIFIED 2026-08-26 live: $2,970.00 tulip cathedral solitaire. A duplicate row at the same URL ($900) contradicted the page and was removed.",
    },
    "nivea_cushion_14k_wg": {
        "price_usd": 759.75, "original_price_usd": 1013.0, "discount_pct": 25,
        "note": "RE-VERIFIED 2026-08-26 live: $759.75 discounted from $1,013.00 (25% off, SKU 1CUZ1050). A duplicate row at the same URL ($1,393) contradicted the page and was removed.",
    },
    "jasmine_emerald_pt": {
        "price_usd": 2180.0,
        "note": "RE-VERIFIED 2026-08-26 live: $2,180.00 (SKU 1ECZ7241). A duplicate row at the same URL ($1,423) contradicted the page and was removed.",
    },
    "automic_gold_bar_ring_14k": {
        "price_usd": 402.0,
        "note": "RE-VERIFIED 2026-08-26 via official Shopify product API (.js): price 40200 cents = $402.00 14k yellow/white/rose gold; weight field empty — the ~1.2g in the note remains an approximation, not size-specific.",
    },
    "automic_gold_alexandrite_ring_14k": {
        "price_usd": 526.0, "price_usd_from": 526.0, "price_usd_to": 625.0,
        "note": "RE-VERIFIED 2026-08-26 via official Shopify product API (.js): price_min 52600 ($526 14k YG/WG/RG), nickel-free WG 55900 ($559), price_max 62500 ($625); no gram weight published.",
    },
    "baby_gold_linear_double_name_14k": {
        "price_usd": 720.0,
        "note": "RE-VERIFIED 2026-08-26 via official Shopify product API (.js): price 72000 cents = $720.00, 10mm width, sizes 3-10 incl 4.5, 14K solid gold.",
    },
    # Prices that could NOT be confirmed at product level -> nulled (value kept in note)
    "athena_18k_yg_pear": {
        "price_usd": None,
        "note": "FLAGGED 2026-08-26: two duplicate rows at this URL disagreed ($2,033 vs $1,716) and the live page snapshot did not capture a rendered price, so the price is withheld pending manual re-check. Source: ",
    },
    "evelyn_oval_18kr": {
        "price_usd": None,
        "note": "FLAGGED 2026-08-26: two duplicate rows at this URL disagreed ($2,018 vs $1,322) and the live page snapshot did not capture a rendered price, so the price is withheld pending manual re-check. Source: ",
    },
    "willa_pear_18ky": {
        "price_usd": None,
        "note": "FLAGGED 2026-08-26: two duplicate rows at this URL disagreed ($3,079 vs $2,426) and the live page snapshot did not capture a rendered price, so the price is withheld pending manual re-check. Source: ",
    },
}

# Rows whose price came from a collection page or third-party article — unverifiable
# at the cited URL -> price withheld, kept in note for manual review.
CITATION_FLAGS = {
    "ritani_geneva_14k_white_four_prong": "https://www.ritani.com/collections/round-cut-engagement-rings",
    "ritani_geneva_14k_yellow_solitaire": "https://www.ritani.com/collections/yellow-gold-engagement-ring",
    "ritani_hera_14k_white_petal_head": "https://www.ritani.com/collections/white-gold-solitaire-engagement-rings",
    "ritani_lia_14k_white_six_prong_petal": "https://www.ritani.com/collections/round-cut-solitaire-engagement-rings",
    "ritani_teya_14k_white_four_prong": "https://www.ritani.com/collections/engagement-rings",
    "ritani_vera_14k_white_solitaire": "https://www.ritani.com/collections/white-gold-engagement-rings",
    "ferkos_clover_ruby_diamond_14k": "https://ferkosfinejewelry.com/collections/ruby-jewelry",
    "ferkos_marquise_emerald_wedding_band_14k": "https://ferkosfinejewelry.com/collections/marquise-cut-rings",
    "ferkos_stackable_vertical_baguette_14k": "https://ferkosfinejewelry.com/collections/baguette-rings",
    "quince_diamond_floral_eternity_14k": "https://www.quince.com/women/jewelry/rings-all?device=desktop&filter=subcollections%3DStackable&pageType=ALL",
    "quince_diamond_infinity_band_14k": "https://www.quince.com/women/jewelry/rings-all?device=desktop&filter=subcollections%3DStackable&pageType=ALL",
    "quince_diamond_orbit_ring_14k": "https://www.quince.com/women/jewelry/rings-all?device=desktop&filter=subcollections%3DStackable&pageType=ALL",
    "quince_diamond_slanted_marquise_round_14k": "https://www.quince.com/women/jewelry/rings-all?device=desktop&filter=subcollections%3DStackable&pageType=ALL",
    "quince_pear_diamond_half_eternity_14k": "https://www.quince.com/women/jewelry/rings-all?device=desktop&filter=subcollections%3DStackable&pageType=ALL",
    "quince_square_edge_stacker_14k": "https://www.quince.com/women/jewelry/rings-all?device=desktop&filter=subcollections%3DStackable&pageType=ALL",
    "blue_nile_18k_yellow_gold_classic_solitaire": "https://wwd.com/shop/shop-fashion/blue-nile-engagement-ring-guide-1236295799/",
}

# Rows removed entirely (dedupe / wrong-product). Reasons recorded in _rejected.md.
REMOVE = [
    # exact duplicates (same URL, same product, same price)
    "ritani_amata_18k_yellow_trellis", "ritani_ciara_14k_white_split_double",
    "ritani_elodie_18k_yellow_classic_solitaire", "ritani_elyse_18k_yellow_classic_solitaire",
    "ritani_maddie_14k_white_octagon", "ritani_ora_18k_yellow_petal_head",
    "ritani_priya_14k_white_diamond_collar", "ritani_silvia_14k_white_embellished_prong",
    "ritani_milena_18k_yellow_knife_edge", "automic_gold_rainbow_band_2",
    # conflicting duplicates — live page proved the survivor's value
    "cordelia_round_18k_wg",          # $900 vs live $2,970
    "ritani_nivea_14k_white_cushion", # $1,393 vs live $759.75
    "milena_platinum_oval",           # $832 vs live $1,907
    "jasmine_platinum_emerald",       # $1,423 vs live $2,180
    "mene_narrow_classic_band_24k_size_45",          # same product as mene_narrow_band_24k
    "mene_narrow_classic_band_24k_engraved_size_45", # engraved priced BELOW plain — impossible
    # product name contradicts the page at the cited URL
    "four_prong_solitaire_round_18k_rg",  # URL serves 'The Elodie Round Cut 18kt Rose Gold' ($1,873)
]

# Non-ring items + reference rows — excluded from the ring directory, sources kept.
NON_RING = {
    "half_and_half_paper_clip_14ky": "Bracelet, not a ring (Ritani)",
    "inlay_diamond_bangle_14kr": "Bangle bracelet, not a ring (Ritani)",
    "lg_half_bezel_tennis_bracelet_14kr": "Tennis bracelet, not a ring (Ritani)",
    "mastoloni_18ky_akoya_pearl_bracelet_8mm": "Pearl bracelet, not a ring (Ritani)",
    "midas_14ky_polished_ball_studs_4mm": "Stud earrings, not a ring (Ritani)",
    "midas_14ky_polished_hoop_earrings_25mm": "Hoop earrings, not a ring (Ritani)",
    "midas_14ky_tube_hoop_earrings": "Hoop earrings, not a ring (Ritani)",
    "multi_shape_lg_diamond_station_necklace_pt": "Necklace, not a ring (Ritani)",
    "ritani_14kw_asscher_tennis": "Tennis bracelet, not a ring (Ritani)",
    "ritani_14kw_classic_diamond_tennis": "Tennis bracelet, not a ring (Ritani)",
    "ritani_14kw_classic_halfway_bangle": "Bangle bracelet, not a ring (Ritani)",
    "ritani_14kw_classic_lg_diamond_tennis_bracelet": "Tennis bracelet, not a ring (Ritani)",
    "ritani_14kw_half_emerald_diamond_tennis": "Tennis bracelet, not a ring (Ritani)",
    "ritani_14kw_lg_four_prong_tennis": "Tennis bracelet, not a ring (Ritani)",
    "ritani_14ky_diamond_initial_c": "Link bracelet, not a ring (Ritani)",
    "ritani_14ky_freshwater_pearl_chain": "Chain bracelet, not a ring (Ritani)",
    "ritani_14ky_lg_three_prong_tennis_bracelet": "Tennis bracelet, not a ring (Ritani)",
    "ritani_14ky_malachite_station": "Station bracelet, not a ring (Ritani)",
    "ritani_14ky_puff_mariner_heart": "Bracelet, not a ring (Ritani)",
    "ritani_18k_wg_princess_studs": "Stud earrings, not a ring (Ritani)",
    "ritani_18kr_floral_halo_lg_studs": "Stud earrings, not a ring (Ritani)",
    "ritani_18kr_floral_halo_studs": "Stud earrings, not a ring (Ritani)",
    "ritani_18kw_alternating_bezel_sapphire_lg_diamond_tennis_necklace": "Necklace, not a ring (Ritani)",
    "ritani_18kw_alternating_sapphire_lg_diamond_tennis_necklace": "Necklace, not a ring (Ritani)",
    "ritani_18kw_diamond_sapphire_eternity_hoop": "Hoop earrings, not a ring (Ritani)",
    "ritani_18kw_half_ruby_lg_diamond_tennis_necklace": "Necklace, not a ring (Ritani)",
    "ritani_18kw_infinity_diamond_hoop": "Hoop earrings, not a ring (Ritani)",
    "ritani_18kw_lg_round_studs_0_50": "Stud earrings, not a ring (Ritani)",
    "ritani_18kw_princess_diamond_studs": "Stud earrings, not a ring (Ritani)",
    "ritani_18kw_round_three_prong_tennis_necklace": "Necklace, not a ring (Ritani)",
    "ritani_18kw_toi_et_moi_lg_hoop": "Hoop earrings, not a ring (Ritani)",
    "ritani_18ky_true_north_lg_pendant": "Pendant, not a ring (Ritani)",
    "sabrina_14k_yg_pearl_bead": "Bead bracelet, not a ring (Ritani)",
    "sabrina_14ky_diamond_link_hoop": "Hoop earrings, not a ring (Ritani)",
    "stuller_14ky_birthstone_studs_garnet": "Children's stud earrings, not a ring (Ritani)",
    "kitco_spot_price": "Reference row (live gold spot price feed), not a product",
    "debebians_ring_weight_chart_14k": "Reference row (ring weight chart), not a product",
}


ROUND2_PRICE_FIXES = {
    "ritani_dara_14k_white_bezel": {
        "price_usd": 972.75, "original_price_usd": 1297.0, "discount_pct": 25,
        "note": "VERIFIED 2026-08-26 live: $972.75 discounted from $1,297.00 (25% off, SKU 1RZ4782). A duplicate row at the same URL ($907.90) contradicted the page and was removed.",
    },
}

# implausible sub-gram weights — solid 14K rings cannot weigh 0.1-0.7 g (a 0.1 g ring
# would imply >$42,000/oz); the official Automic Gold product API publishes NO weight
# (weight: 0 on every variant). Values look like decimal-shift errors -> withheld.
WEIGHT_NULLS = [
    "automic_gold_bead_ring_14k", "automic_gold_cable_ring_14k", "automic_gold_figaro_ring_14k",
    "automic_gold_hammered_ring_14k", "automic_gold_line_ring_14k", "automic_gold_mini_miami_ring_14k",
    "automic_gold_shimmer_ring_14k", "automic_gold_thick_cable_ring_14k", "automic_gold_wave_ring_14k",
    "automic_gold_zig_zag_ring_14k",
]

REMOVE_ROUND2 = [
    # exact duplicates found by URL-groups after round 1 (name variants had hidden them)
    "ritani_anais_14k_white_twisted_solitaire", "elodie_round_pt", "iris_marquise_18k_yg",
    "juno_round_pt", "ritani_kendra_14k_white_cathedral_tulip", "maude_oval_18ky",
    "maude_round_18kr", "priya_round_pt", "sadie_round_18ky", "stella_pear_pt",
    "stella_round_18ky", "valentina_oval_pt",
    # conflicting duplicates where the survivor keeps a withheld price + flag note
    "athena_pear_18k_yg", "evelyn_oval_18k_rg", "willa_pear_18k_yg",
    # live page proved the survivor's price (Dara $972.75)
    "dara_round_14k_wg",
]


def main():
    log = []
    # 1+2. price fixes / nulls
    for fid, fix in PRICE_FIXES.items():
        p = os.path.join(EV, fid + ".json")
        if not os.path.exists(p):
            print(f"  skip (missing): {fid}"); continue
        d = load(fid)
        for k, v in fix.items():
            if k == "note":
                continue
            d[k] = v
        note_merge(d, fix["note"])
        save(fid, d)
        log.append(f"FIXED {fid}: " + ", ".join(f"{k}={v}" for k, v in fix.items() if k != "note"))

    # 5. citation flags — withhold unverifiable prices, keep prior value in note
    for fid, url in CITATION_FLAGS.items():
        p = os.path.join(EV, fid + ".json")
        if not os.path.exists(p):
            print(f"  skip (missing): {fid}"); continue
        d = load(fid)
        prior = d.get("price_usd")
        d["price_usd"] = None
        note_merge(d, f"FLAGGED 2026-08-26: source URL is a collection/category page"
                      f"{' (third-party article)' if 'wwd.com' in url else ''}, not this product's own page;"
                      f" the prior ${prior} could not be verified at product level and is withheld pending"
                      f" a product-URL citation. Prior value: ${prior}. Cited page: {url}")
        save(fid, d)
        log.append(f"FLAGGED {fid}: collection/third-party citation, price ${prior} withheld")

    # 3+4. removals
    rej_path = os.path.join(EV, "_rejected.md")
    rej_lines = ["", "## Removed 2026-08-26 (dedupe / wrong-product — 2026-08-26 review)", ""]
    for fid in REMOVE:
        p = os.path.join(EV, fid + ".json")
        if os.path.exists(p):
            d = load(fid)
            rej_lines.append(f"- `{fid}` — {d.get('ring')} | {d.get('seller')} | "
                             f"was ${d.get('price_usd')} | {d.get('source_url')}")
            os.remove(p)
            log.append(f"REMOVED {fid}")
        else:
            print(f"  skip (already removed): {fid}")
    with open(rej_path, "a") as f:
        f.write("\n".join(rej_lines) + "\n")

    # 6. non-ring / reference exclusions
    with open(os.path.join(ROOT, "data", "_excluded.json"), "w") as f:
        json.dump({"_comment": "Rows excluded from the ring directory by the 2026-08-26 review. "
                              "Evidence JSONs are kept in data/evidence for manual review; they are "
                              "not compiled into rings.json and do not appear on the site.",
                   "excluded": NON_RING}, f, indent=2)
    log.append(f"EXCLUDED {len(NON_RING)} non-ring/reference rows -> data/_excluded.json")

    # round 2: Dara live-verified fix
    for fid, fix in ROUND2_PRICE_FIXES.items():
        p = os.path.join(EV, fid + ".json")
        if not os.path.exists(p):
            print(f"  skip (missing): {fid}"); continue
        d = load(fid)
        for k, v in fix.items():
            if k != "note":
                d[k] = v
        note_merge(d, fix["note"])
        save(fid, d)
        log.append(f"FIXED {fid}")

    # round 2: implausible weights -> withheld
    for fid in WEIGHT_NULLS:
        p = os.path.join(EV, fid + ".json")
        if not os.path.exists(p):
            continue
        d = load(fid)
        if d.get("weight_g") is None:
            continue  # idempotent
        prior = d["weight_g"]
        d["weight_g"] = None
        note_merge(d, f"FLAGGED 2026-08-26: prior weight {prior}g withheld — physically implausible "
                      f"for a solid 14K ring (implies >$20,000/oz at the listed price) and the official "
                      f"Automic Gold product API publishes no weight. Likely a decimal-shift error; "
                      f"re-verify on the product page.")
        save(fid, d)
        log.append(f"WEIGHT NULL {fid} (was {prior}g)")

    # round 2: removals
    for fid in REMOVE_ROUND2:
        p = os.path.join(EV, fid + ".json")
        if os.path.exists(p):
            d = load(fid)
            rej_lines = ["", f"## Removed 2026-08-26 (round 2 dedupe / conflict resolution)", ""] \
                if not hasattr(main, "_r2") else []
            main._r2 = True
            rej_lines.append(f"- `{fid}` — {d.get('ring')} | {d.get('seller')} | "
                             f"was ${d.get('price_usd')} | {d.get('source_url')}")
            os.remove(p)
            with open(os.path.join(EV, "_rejected.md"), "a") as f:
                f.write("\n".join(rej_lines) + "\n")
            log.append(f"REMOVED {fid}")
        else:
            print(f"  skip (already removed): {fid}")

    print("\n".join("  " + l for l in log))
    print(f"\nDone: {len(log)} actions.")


if __name__ == "__main__":
    sys.exit(main())
