/* scripts.js — runs in the browser, does only math + table rendering.
   Deliberately does NOT call out to any price API. The user pastes the
   spot price themselves. That's the no-hallucination contract. */

const EVIDENCE_FILES = [
  // --- reference: live price feed (NOT a product) ---
  "data/evidence/kitco_spot_price.json",

  // --- Blue Nile (US, Signet-adjacent; part of the same parent group that owns James Allen's brand until 2024) ---
  "data/evidence/blue_nile_18k_yellow_gold_classic_solitaire.json",
  "data/evidence/blue_nile_petite_solitaire_14k_yellow.json",
  "data/evidence/blue_nile_classic_comfort_fit_solitaire_14k_yellow.json",

  // --- James Allen ---
  "data/evidence/james_allen_14k_rose_gold_solitaire.json",
  "data/evidence/james_allen_petite_solitaire_14k_yellow.json",
  "data/evidence/james_allen_etched_profile_solitaire_14k_yellow.json",
  "data/evidence/james_allen_presentation_solitaire_14k_yellow.json",

  // --- Brilliant Earth ---
  "data/evidence/brilliant_earth_14k_yellow_gold_amie_diamond.json",
  "data/evidence/brilliant_earth_petite_elodie_14k_yellow.json",
  "data/evidence/brilliant_earth_atelier_solitaire_14k_yellow.json",

  // --- Signet-owned US chain stores (Kay, Zales) ---
  "data/evidence/kay_solitaire_1_4ct_14k_white.json",
  "data/evidence/kay_solitaire_1_2ct_14k_white.json",
  "data/evidence/zales_1ct_engagement_ring_14k_yellow.json",

  // --- Tiffany & Co. (LVMH) ---
  "data/evidence/tiffany_setting_18k_yellow.json",
  "data/evidence/tiffany_knot_18k_yellow.json",

  // --- Taylor & Hart (UK-founded, US ops) ---
  "data/evidence/taylorandhart_demure_solitaire_18k_yellow.json",

  // --- Clean Origin (US, lab-grown) ---
  "data/evidence/clean_origin_evangeline_14k_rose.json",
  "data/evidence/clean_origin_infinity_14k_white.json",

  // --- The Karat Store (India, BIS-hallmarked; one of the few that publishes weight) ---
  "data/evidence/the_karat_store_modulation_14k_yellow.json",

  // --- Ritani (US, publishes metal weight in grams on product detail pages) ---
  "data/evidence/ritani_geneva_14k_yellow_solitaire.json",
  "data/evidence/ritani_delia_14k_white_solitaire.json",
  "data/evidence/ritani_maddie_14k_white_octagon.json",
  "data/evidence/ritani_andy_14k_white_eight_prong.json",

  // --- David's House of Diamonds (US, publishes gold weight in grams on all products) ---
  "data/evidence/davids_house_oval_solitaire_14k.json",
  "data/evidence/davids_house_round_halo_14k.json"
];

// ---------- Evidence table ----------
async function loadEvidence() {
  const tbody = document.querySelector("#evidence-table tbody");
  tbody.innerHTML = "";

  for (const path of EVIDENCE_FILES) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) {
        throw new Error("HTTP " + res.status);
      }
      const item = await res.json();
      tbody.appendChild(renderRow(item));
    } catch (err) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 11;
      td.className = "muted";
      td.textContent = "Could not load " + path + " (" + err.message + ")";
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
  }
}

function renderRow(item) {
  const tr = document.createElement("tr");

  // Weight — handle both weight_g and the (gross, gold) split.
  let weightCell;
  if (item.weight_g != null) {
    weightCell = String(item.weight_g) + " g";
  } else if (item.weight_g_total != null) {
    const gold = item.weight_g_gold != null ? " (gold " + item.weight_g_gold + " g)" : "";
    weightCell = String(item.weight_g_total) + " g" + gold;
  } else {
    weightCell = "⚠️ not listed";
  }

  // Price — handle single value, range, setting-only, sale, etc.
  let priceCell;
  if (item.price_usd != null) {
    let s = "$" + Number(item.price_usd).toLocaleString();
    if (item.original_price_usd != null && item.original_price_usd > item.price_usd) {
      s += " (was $" + Number(item.original_price_usd).toLocaleString();
      if (item.discount_pct) s += ", -" + item.discount_pct + "%";
      s += ")";
    }
    if (item.setting_only) s += " [setting only]";
    priceCell = s;
  } else if (item.price_usd_from != null) {
    priceCell = "from $" + Number(item.price_usd_from).toLocaleString() +
                (item.setting_only ? " [setting only]" : "");
  } else {
    priceCell = "—";
  }

  // Stone — abbreviated so the column doesn't blow up the table.
  let stone = "—";
  if (item.stone_ctw != null) stone = item.stone_ctw + " ctw";
  else if (item.stone_carats != null) stone = item.stone_carats + " ct";
  else if (item.stone_range_ctw) stone = item.stone_range_ctw + " ctw";
  if (item.stone_type) stone += " " + item.stone_type.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

  // Width
  const width = item.width_mm != null ? item.width_mm + " mm" : "—";

  // Setting-only flag
  const setting = item.setting_only ? "setting only" : (item.stone_ctw || item.stone_carats ? "with stones" : "—");

  const cells = [
    item.ring || "—",
    item.seller || "—",
    item.karat || "—",
    item.hallmark || "—",
    width,
    weightCell,
    stone,
    setting,
    priceCell,
    renderSource(item.source_url, item.source_label),
    item.verified_on || "—"
  ];
  cells.forEach(v => {
    const td = document.createElement("td");
    if (v instanceof Node) td.appendChild(v);
    else td.textContent = String(v);
    tr.appendChild(td);
  });
  return tr;
}

function renderSource(url, label) {
  if (!url) {
    const span = document.createElement("span");
    span.className = "muted";
    span.textContent = "—";
    return span;
  }
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.textContent = label || url;
  return a;
}

// ---------- Calculator ----------
function runCalc() {
  const spotOz = parseFloat(document.getElementById("spot-oz").value);
  const weightG = parseFloat(document.getElementById("weight-g").value);
  const purity  = parseFloat(document.getElementById("karat").value);

  const out = document.getElementById("calc-out");
  if (!isFinite(spotOz) || !isFinite(weightG) || !isFinite(purity)) {
    out.hidden = false;
    out.innerHTML = "<p class='muted'>Please enter all three values.</p>";
    return;
  }

  // 1 troy oz = 31.1034768 grams (the standard the spot price is quoted in)
  const TROY_OZ_TO_G = 31.1034768;
  const spotPerG24K = spotOz / TROY_OZ_TO_G;
  const pureGoldG   = weightG * purity;
  const metalValue  = pureGoldG * spotPerG24K;

  document.getElementById("r-pure").textContent  = pureGoldG.toFixed(3);
  document.getElementById("r-per-g").textContent = spotPerG24K.toFixed(2);
  document.getElementById("r-melt").textContent  = metalValue.toFixed(2);
  out.hidden = false;
}

document.addEventListener("DOMContentLoaded", () => {
  loadEvidence();
  const btn = document.getElementById("calc-btn");
  if (btn) btn.addEventListener("click", runCalc);
});
