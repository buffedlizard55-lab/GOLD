import json
import os

today = "2026-08-25"

entries = [
    {
        "filename": "costco_green_quartz_diamond_14k.json",
        "data": {
            "ring": "Green Quartz and Diamond Ring",
            "seller": "Costco",
            "karat": "14K",
            "hallmark": "14K",
            "price_usd": 599.99,
            "setting_only": False,
            "source_url": "https://www.costco.com/green-quartz-and-diamond-14kt-yellow-gold-ring.product.4000153237.html",
            "source_label": "Product listing",
            "verified_on": today
        },
        "category": "Standard Retail"
    },
    {
        "filename": "costco_round_brilliant_0_75_ctw_14k.json",
        "data": {
            "ring": "Round Brilliant 0.75 ctw VS2 Clarity, G Color Diamond 14kt White Gold Ring",
            "seller": "Costco",
            "karat": "14K",
            "hallmark": "14K",
            "price_usd": 999.99,
            "setting_only": False,
            "source_url": "https://www.costco.com/round-brilliant-0.75-ctw-vs2-clarity,-g-color-diamond-14kt-white-gold-ring.product.4000021858.html",
            "source_label": "Product listing",
            "verified_on": today
        },
        "category": "Standard Retail"
    },
    {
        "filename": "baby_gold_linear_double_name_14k.json",
        "data": {
            "ring": "Linear Double Name Ring",
            "seller": "Baby Gold",
            "karat": "14K",
            "hallmark": "14K",
            "price_usd": 450.00,
            "width_mm": 10.0,
            "setting_only": False,
            "source_url": "https://www.babygold.com/products/14k-gold-linear-double-name-ring",
            "source_label": "Product listing",
            "verified_on": today
        },
        "category": "Standard Retail"
    },
    {
        "filename": "baby_gold_linear_name_14k.json",
        "data": {
            "ring": "Linear Name Ring",
            "seller": "Baby Gold",
            "karat": "14K",
            "hallmark": "14K",
            "price_usd": 550.00,
            "width_mm": 5.0,
            "setting_only": False,
            "source_url": "https://www.babygold.com/collections/personalized-rings/products/14k-gold-linear-name-ring",
            "source_label": "Product listing",
            "verified_on": today
        },
        "category": "Standard Retail"
    },
    {
        "filename": "baby_gold_custom_name_band_14k.json",
        "data": {
            "ring": "Custom Name Band Ring",
            "seller": "Baby Gold",
            "karat": "14K",
            "hallmark": "14K",
            "price_usd": 790.00,
            "width_mm": 6.5,
            "setting_only": False,
            "source_url": "https://www.babygold.com/products/14k-gold-custom-name-band-ring",
            "source_label": "Product listing",
            "verified_on": today
        },
        "category": "Standard Retail"
    },
    {
        "filename": "baby_gold_wishbone_14k.json",
        "data": {
            "ring": "Wishbone Ring",
            "seller": "Baby Gold",
            "karat": "14K",
            "hallmark": "14K",
            "price_usd": 320.00,
            "width_mm": 1.3,
            "setting_only": False,
            "source_url": "https://www.babygold.com/products/14k-gold-wishbone-ring",
            "source_label": "Product listing",
            "verified_on": today
        },
        "category": "Standard Retail"
    },
    {
        "filename": "baby_gold_kyanite_stone_14k.json",
        "data": {
            "ring": "Kyanite Stone Ring",
            "seller": "Baby Gold",
            "karat": "14K",
            "hallmark": "14K",
            "price_usd": 450.00,
            "setting_only": False,
            "source_url": "https://www.babygold.com/collections/statement-rings/products/14k-gold-kyanite-stone-ring",
            "source_label": "Product listing",
            "verified_on": today
        },
        "category": "Standard Retail"
    },
    {
        "filename": "baby_gold_ruby_oval_eternity_14k.json",
        "data": {
            "ring": "Genuine Ruby Oval Eternity Band",
            "seller": "Baby Gold",
            "karat": "14K",
            "hallmark": "14K",
            "price_usd": 1400.00,
            "width_mm": 6.0,
            "setting_only": False,
            "source_url": "https://www.babygold.com/products/14k-gold-genuine-ruby-oval-eternity-band",
            "source_label": "Product listing",
            "verified_on": today
        },
        "category": "Standard Retail"
    },
    {
        "filename": "baby_gold_interlocked_engravable_14k.json",
        "data": {
            "ring": "Interlocked Engravable Ring",
            "seller": "Baby Gold",
            "karat": "14K",
            "hallmark": "14K",
            "price_usd": 1190.00,
            "width_mm": 4.0,
            "setting_only": False,
            "source_url": "https://www.babygold.com/products/14k-gold-interlocked-engravable-ring",
            "source_label": "Product listing",
            "verified_on": today
        },
        "category": "Standard Retail"
    },
    {
        "filename": "baby_gold_domed_eternity_14k.json",
        "data": {
            "ring": "Domed Eternity Ring",
            "seller": "Baby Gold",
            "karat": "14K",
            "hallmark": "14K",
            "price_usd": 220.00,
            "setting_only": False,
            "source_url": "https://www.babygold.com/products/cupola-moyen-dome-band",
            "source_label": "Product listing",
            "verified_on": today
        },
        "category": "Standard Retail"
    },
    {
        "filename": "baby_gold_lucky_seven_diamond_14k.json",
        "data": {
            "ring": "Lucky Seven Diamond Band",
            "seller": "Baby Gold",
            "karat": "14K",
            "hallmark": "14K",
            "price_usd": 920.00,
            "width_mm": 2.5,
            "stone_ctw": 0.35,
            "setting_only": False,
            "source_url": "https://www.babygold.com/products/14k-gold-lucky-seven-diamond-band",
            "source_label": "Product listing",
            "verified_on": today
        },
        "category": "Standard Retail"
    },
    {
        "filename": "baby_gold_diamond_wishbone_14k.json",
        "data": {
            "ring": "Diamond Wishbone Ring",
            "seller": "Baby Gold",
            "karat": "14K",
            "hallmark": "14K",
            "price_usd": 350.00,
            "width_mm": 1.3,
            "stone_ctw": 0.03,
            "setting_only": False,
            "source_url": "https://www.babygold.com/collections/all/products/14k-gold-diamond-wishbone-ring",
            "source_label": "Product listing",
            "verified_on": today
        },
        "category": "Standard Retail"
    },
    {
        "filename": "quince_circle_ring_14k.json",
        "data": {
            "ring": "14k Gold Circle Ring",
            "seller": "Quince",
            "karat": "14K",
            "hallmark": "14K",
            "price_usd": 148.00,
            "width_mm": 1.0,
            "setting_only": False,
            "source_url": "https://www.quince.com/women/jewelry/gold-circle-ring",
            "source_label": "Product listing",
            "verified_on": today
        },
        "category": "Standard Retail"
    },
    {
        "filename": "quince_diamond_floral_eternity_14k.json",
        "data": {
            "ring": "14K Gold Diamond Floral Eternity Band",
            "seller": "Quince",
            "karat": "14K",
            "hallmark": "14K",
            "price_usd": 999.90,
            "setting_only": False,
            "source_url": "https://www.quince.com/women/jewelry/rings-all?device=desktop&filter=subcollections%3DStackable&pageType=ALL",
            "source_label": "Collection listing",
            "verified_on": today
        },
        "category": "Standard Retail"
    },
    {
        "filename": "quince_diamond_infinity_band_14k.json",
        "data": {
            "ring": "14K Gold Diamond Infinity Band",
            "seller": "Quince",
            "karat": "14K",
            "hallmark": "14K",
            "price_usd": 749.90,
            "setting_only": False,
            "source_url": "https://www.quince.com/women/jewelry/rings-all?device=desktop&filter=subcollections%3DStackable&pageType=ALL",
            "source_label": "Collection listing",
            "verified_on": today
        },
        "category": "Standard Retail"
    },
    {
        "filename": "quince_diamond_slanted_marquise_round_14k.json",
        "data": {
            "ring": "14K Gold Diamond Slanted Marquise and Round Band",
            "seller": "Quince",
            "karat": "14K",
            "hallmark": "14K",
            "price_usd": 449.90,
            "setting_only": False,
            "source_url": "https://www.quince.com/women/jewelry/rings-all?device=desktop&filter=subcollections%3DStackable&pageType=ALL",
            "source_label": "Collection listing",
            "verified_on": today
        },
        "category": "Standard Retail"
    },
    {
        "filename": "quince_pave_diamond_gemstone_band_14k.json",
        "data": {
            "ring": "14K Gold Pave Diamond and Gemstone Band",
            "seller": "Quince",
            "karat": "14K",
            "hallmark": "14K",
            "price_usd": 299.90,
            "setting_only": False,
            "source_url": "https://www.quince.com/women/jewelry/rings-all?device=desktop&filter=subcollections%3DStackable&pageType=ALL",
            "source_label": "Collection listing",
            "verified_on": today
        },
        "category": "Standard Retail"
    },
    {
        "filename": "quince_pear_diamond_half_eternity_14k.json",
        "data": {
            "ring": "14K Gold Pear Diamond Half Eternity Band",
            "seller": "Quince",
            "karat": "14K",
            "hallmark": "14K",
            "price_usd": 399.90,
            "setting_only": False,
            "source_url": "https://www.quince.com/women/jewelry/rings-all?device=desktop&filter=subcollections%3DStackable&pageType=ALL",
            "source_label": "Collection listing",
            "verified_on": today
        },
        "category": "Standard Retail"
    },
    {
        "filename": "quince_diamond_orbit_ring_14k.json",
        "data": {
            "ring": "14K Gold Diamond Orbit Ring",
            "seller": "Quince",
            "karat": "14K",
            "hallmark": "14K",
            "price_usd": 698.00,
            "setting_only": False,
            "source_url": "https://www.quince.com/women/jewelry/rings-all?device=desktop&filter=subcollections%3DStackable&pageType=ALL",
            "source_label": "Collection listing",
            "verified_on": today
        },
        "category": "Standard Retail"
    },
    {
        "filename": "quince_square_edge_stacker_14k.json",
        "data": {
            "ring": "14K Gold Square Edge Stacker Ring",
            "seller": "Quince",
            "karat": "14K",
            "hallmark": "14K",
            "price_usd": 238.00,
            "setting_only": False,
            "source_url": "https://www.quince.com/women/jewelry/rings-all?device=desktop&filter=subcollections%3DStackable&pageType=ALL",
            "source_label": "Collection listing",
            "verified_on": today
        },
        "category": "Standard Retail"
    },
    {
        "filename": "automic_gold_alexandrite_ring_14k.json",
        "data": {
            "ring": "Alexandrite Ring",
            "seller": "Automic Gold",
            "karat": "14K",
            "hallmark": "14K",
            "weight_g": 0.49,
            "price_usd": 325.00,
            "setting_only": False,
            "source_url": "https://www.automicgold.com/collections/engagement/products/alexandrite-ring",
            "source_label": "Product listing",
            "verified_on": today
        },
        "category": "High Transparency"
    }
]

scripts_js_append = ""

for entry in entries:
    path = os.path.join("/home/user/GOLD/data/evidence", entry["filename"])
    with open(path, "w") as f:
        json.dump(entry["data"], f, indent=2)
    
    scripts_js_append += f'  {{ path: "data/evidence/{entry["filename"]}", category: "{entry["category"]}" }},\n'

print(scripts_js_append)
