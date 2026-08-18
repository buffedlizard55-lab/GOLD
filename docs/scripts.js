/* scripts.js — runs in the browser, does only math + table rendering.
   Deliberately does NOT call out to any price API. The user pastes the
   spot price themselves. That's the no-hallucination contract. */

const EVIDENCE_FILES = [
  // --- Investment Grade (24K) ---
  { path: "data/evidence/mene_narrow_band_24k.json", category: "Investment (24K)" },
  { path: "data/evidence/7879_wide_ring_24k.json", category: "Investment (24K)" },
  { path: "data/evidence/7879_signet_ring_24k.json", category: "Investment (24K)" },

  // --- High Transparency (Weight Published) ---
  { path: "data/evidence/ritani_delia_14k_white_solitaire.json", category: "High Transparency" },
  { path: "data/evidence/ritani_andy_14k_white_eight_prong.json", category: "High Transparency" },
  { path: "data/evidence/ritani_maddie_14k_white_octagon.json", category: "High Transparency" },
  { path: "data/evidence/ritani_geneva_14k_yellow_solitaire.json", category: "High Transparency" },
  { path: "data/evidence/davids_house_oval_solitaire_14k.json", category: "High Transparency" },
  { path: "data/evidence/davids_house_round_halo_14k.json", category: "High Transparency" },
  { path: "data/evidence/oradina_anchor_14k.json", category: "High Transparency" },
  { path: "data/evidence/oradina_west_side_14k.json", category: "High Transparency" },
  { path: "data/evidence/moriarty_14k_solitaire.json", category: "High Transparency" },
  { path: "data/evidence/devata_solitaire_14k.json", category: "High Transparency" },
  { path: "data/evidence/the_karat_store_modulation_14k_yellow.json", category: "High Transparency" },

  // --- Benchmarks ---
  { path: "data/evidence/pompeii3_solitaire_benchmark.json", category: "Benchmark" },
  { path: "data/evidence/midwest_jewellery_benchmark.json", category: "Benchmark" },

  // --- Standard Retail (Weight Not Listed) ---
  { path: "data/evidence/blue_nile_18k_yellow_gold_classic_solitaire.json", category: "Standard Retail" },
  { path: "data/evidence/blue_nile_petite_solitaire_14k_yellow.json", category: "Standard Retail" },
  { path: "data/evidence/blue_nile_classic_comfort_fit_solitaire_14k_yellow.json", category: "Standard Retail" },
  { path: "data/evidence/james_allen_14k_rose_gold_solitaire.json", category: "Standard Retail" },
  { path: "data/evidence/james_allen_petite_solitaire_14k_yellow.json", category: "Standard Retail" },
  { path: "data/evidence/james_allen_etched_profile_solitaire_14k_yellow.json", category: "Standard Retail" },
  { path: "data/evidence/james_allen_presentation_solitaire_14k_yellow.json", category: "Standard Retail" },
  { path: "data/evidence/brilliant_earth_14k_yellow_gold_amie_diamond.json", category: "Standard Retail" },
  { path: "data/evidence/brilliant_earth_petite_elodie_14k_yellow.json", category: "Standard Retail" },
  { path: "data/evidence/brilliant_earth_atelier_solitaire_14k_yellow.json", category: "Standard Retail" },
  { path: "data/evidence/kay_solitaire_1_4ct_14k_white.json", category: "Standard Retail" },
  { path: "data/evidence/kay_solitaire_1_2ct_14k_white.json", category: "Standard Retail" },
  { path: "data/evidence/zales_1ct_engagement_ring_14k_yellow.json", category: "Standard Retail" },
  { path: "data/evidence/tiffany_setting_18k_yellow.json", category: "Standard Retail" },
  { path: "data/evidence/tiffany_knot_18k_yellow.json", category: "Standard Retail" },
  { path: "data/evidence/taylorandhart_demure_solitaire_18k_yellow.json", category: "Standard Retail" },
  { path: "data/evidence/clean_origin_evangeline_14k_rose.json", category: "Standard Retail" },
  { path: "data/evidence/clean_origin_infinity_14k_white.json", category: "Standard Retail" },
  { path: "data/evidence/quince_bezel_14k.json", category: "Standard Retail" }
];

async function loadEvidence() {
  const tbody = document.querySelector("#evidence-table tbody");
  tbody.innerHTML = "";

  for (const entry of EVIDENCE_FILES) {
    try {
      const res = await fetch(entry.path, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const item = await res.json();
      tbody.appendChild(renderRow(item, entry.category));
    } catch (err) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 12;
      td.className = "muted";
      td.textContent = "Could not load " + entry.path + " (" + err.message + ")";
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
  }
}

function renderRow(item, category) {
  const tr = document.createElement("tr");
  tr.setAttribute("data-category", category);

  // Weight
  let weightValue = null;
  let weightCell;
  if (item.weight_g != null) {
    weightValue = item.weight_g;
    weightCell = String(item.weight_g) + " g";
  } else if (item.weight_g_total != null) {
    weightValue = item.weight_g_gold || item.weight_g_total;
    const gold = item.weight_g_gold != null ? " (gold " + item.weight_g_gold + " g)" : "";
    weightCell = String(item.weight_g_total) + " g" + gold;
  } else {
    weightCell = "⚠️ not listed";
  }

  // Karat Fraction
  const karatMap = { "24K": 0.999, "22K": 0.916, "18K": 0.750, "14K": 0.583, "10K": 0.417 };
  const purity = karatMap[item.karat] || 0.583;

  // Price
  let priceValue = item.price_usd || item.price_usd_from;
  let priceCell = "—";
  if (item.price_usd != null) {
    priceCell = "$" + Number(item.price_usd).toLocaleString();
    if (item.original_price_usd != null && item.original_price_usd > item.price_usd) {
      priceCell += " (was $" + Number(item.original_price_usd).toLocaleString() + ")";
    }
  } else if (item.price_usd_from != null) {
    priceCell = "from $" + Number(item.price_usd_from).toLocaleString();
  }

  // Price per Gold Gram (Value Score)
  let valueScoreCell = "—";
  if (priceValue && weightValue) {
    const pureGoldG = weightValue * purity;
    const pricePerG = priceValue / pureGoldG;
    valueScoreCell = "$" + pricePerG.toFixed(2) + " /g";
  }

  const cells = [
    category,
    item.ring || "—",
    item.seller || "—",
    item.karat || "—",
    weightCell,
    valueScoreCell,
    priceCell,
    item.setting_only ? "Setting Only" : "Includes Stones",
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
  if (!url) return document.createTextNode("—");
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.textContent = label || "Source";
  return a;
}

function populateFileList() {
  const list = document.getElementById("file-list");
  if (!list) return;
  list.innerHTML = "";
  const repoUrl = "https://github.com/buffedlizard55-lab/GOLD/blob/main/data/evidence/";
  EVIDENCE_FILES.forEach(entry => {
    const filename = entry.path.split("/").pop();
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = repoUrl + filename;
    a.target = "_blank";
    const code = document.createElement("code");
    code.textContent = filename;
    a.appendChild(code);
    li.appendChild(a);
    list.appendChild(li);
  });
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
  populateFileList();
  const btn = document.getElementById("calc-btn");
  if (btn) btn.addEventListener("click", runCalc);
});
