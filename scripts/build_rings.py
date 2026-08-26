#!/usr/bin/env python3
"""build_rings.py — canonical compiler: data/evidence/*.json -> rings.json (site data).

Single source of truth = the per-product evidence JSONs. This script:
  1. loads every evidence file (skipping `_*.json`),
  2. drops rows excluded by review (data/_excluded.json — non-ring items, reference rows),
  3. carries over review metadata (ring_size / ring_type / category) from the previous
     build by id so nothing is lost,
  4. recomputes ALL derived fields with one canonical formula set (this kills the
     rounding drift found in the 2026-08-26 audit),
  5. writes data/rings.json + docs/data/rings.json and mirrors the evidence files
     into docs/data/evidence/ (exact mirror, stale files removed).

Run after ANY change to data/evidence/:
    python3 scripts/build_rings.py
"""
import json, os, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EV = os.path.join(ROOT, "data", "evidence")
DOCS_EV = os.path.join(ROOT, "docs", "data", "evidence")
OZ_G = 31.1034768
PURITY = {"24K": 0.999, "22K": 22 / 24, "18K": 0.75, "14K": 14 / 24, "10K": 10 / 24}
RING_TYPES = ["Signet", "Band", "Eternity", "Solitaire", "Stacker", "Stackable",
              "Cluster", "Cocktail", "Promise", "Engagement", "Ring"]


def purity_of(karat):
    k = (karat or "").upper()
    if "PT" in k or "PLAT" in k:
        return None
    for key in ("24K", "22K", "18K", "14K", "10K"):
        if key in k:
            return PURITY[key]
    return None


def ring_type_of(name, old=None):
    if old:
        return old
    n = (name or "").lower()
    for t in RING_TYPES:
        if t.lower() in n:
            if t == "Signet":
                return "Signet Ring"
            if t == "Ring":
                return "Fashion / Specialty"
            return t + (" Band" if t == "Band" else " Ring")
    return "Fashion / Specialty"


def category_of(d, purity):
    if (d.get("karat") or "").upper().startswith("24"):
        return "Investment (24K)"
    if purity is None:
        return "Platinum"
    return "Standard Retail"


def main():
    # previous build metadata (ring_size / ring_type / category continuity)
    old_meta = {}
    old_path = os.path.join(ROOT, "data", "rings.json")
    if os.path.exists(old_path):
        with open(old_path) as f:
            for r in json.load(f):
                old_meta[r["id"]] = {k: r.get(k) for k in ("ring_size", "ring_type", "category")}

    excluded = {}
    ex_path = os.path.join(ROOT, "data", "_excluded.json")
    if os.path.exists(ex_path):
        with open(ex_path) as f:
            excluded = json.load(f).get("excluded", {})

    rows, skipped = [], []
    for fn in sorted(os.listdir(EV)):
        if not fn.endswith(".json") or fn.startswith("_"):
            continue
        fid = fn[:-5]
        with open(os.path.join(EV, fn)) as f:
            d = json.load(f)
        if fid in excluded:
            skipped.append(fid)
            continue
        pur = purity_of(d.get("karat"))
        w = d.get("weight_g")
        price = d.get("price_usd") or d.get("price_usd_from")
        meta = old_meta.get(fid, {})
        # stale legacy values must never survive a rebuild
        if meta.get("ring_type"):
            bad = ("ref" in meta["ring_type"].lower()) or meta["ring_type"] == "Ring Ring"
            if bad or "necklace" in meta["ring_type"].lower() or "bracelet" in meta["ring_type"].lower() \
                    or "earring" in meta["ring_type"].lower():
                meta["ring_type"] = None
        r = {
            "id": fid,
            "file": f"data/evidence/{fn}",
            "ring": d.get("ring"),
            "seller": d.get("seller"),
            "karat": d.get("karat"),
            "hallmark": d.get("hallmark"),
            "ring_size": d.get("ring_size", meta.get("ring_size")),
            "weight_g": w,
            "weight_g_total": d.get("weight_g_total"),
            "weight_g_gold": d.get("weight_g_gold"),
            "raw_gold_g": round(w * pur, 4) if (w and pur) else None,
            "raw_gold_oz": round(w * pur / OZ_G, 5) if (w and pur) else None,
            "price_usd": d.get("price_usd"),
            "price_usd_from": d.get("price_usd_from"),
            "price_usd_to": d.get("price_usd_to"),
            "original_price_usd": d.get("original_price_usd"),
            "discount_pct": d.get("discount_pct"),
            "price_per_gold_g": round(price / (w * pur), 2) if (price and w and pur) else None,
            "price_per_gold_oz": round(price / (w * pur) * OZ_G, 2) if (price and w and pur) else None,
            "width_mm": d.get("width_mm"),
            "setting_only": d.get("setting_only", False),
            "ring_type": ring_type_of(d.get("ring"), meta.get("ring_type")),
            "category": category_of(d, pur) if not meta.get("category") else meta["category"],
            "stone_type": d.get("stone_type"),
            "stone_ctw": d.get("stone_ctw"),
            "note": d.get("note"),
            "source_label": d.get("source_label"),
            "source_url": d.get("source_url"),
            "verified_on": d.get("verified_on"),
        }
        if r["discount_pct"] is None and r["original_price_usd"] and r["price_usd"] \
                and r["original_price_usd"] > r["price_usd"]:
            r["discount_pct"] = round((1 - r["price_usd"] / r["original_price_usd"]) * 100)
        rows.append(r)

    out_paths = [os.path.join(ROOT, "data", "rings.json"),
                 os.path.join(ROOT, "docs", "data", "rings.json")]
    for p in out_paths:
        with open(p, "w") as f:
            json.dump(rows, f, indent=1)

    # exact mirror of evidence into docs (remove stale, copy current)
    if os.path.isdir(DOCS_EV):
        shutil.rmtree(DOCS_EV)
    shutil.copytree(EV, DOCS_EV)

    priced = sum(1 for r in rows if r["price_usd"])
    weighted = sum(1 for r in rows if r["weight_g"])
    ppo = sum(1 for r in rows if r["price_per_gold_oz"])
    print(f"compiled {len(rows)} ring rows ({len(skipped)} excluded by review)")
    print(f"  with price: {priced} | with weight: {weighted} | with price/oz: {ppo}")
    print(f"  sellers: {len({r['seller'] for r in rows})}")
    for p in out_paths:
        print(f"  wrote {os.path.relpath(p, ROOT)}")
    print("  mirrored evidence -> docs/data/evidence/")


if __name__ == "__main__":
    sys.exit(main())
