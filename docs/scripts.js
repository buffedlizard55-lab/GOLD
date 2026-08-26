/* scripts.js — GOLD Ring Directory
   No external API calls. Arithmetic only. */

(function () {
  "use strict";

  const DATA_URL = "data/rings.json";
  const REPORT_URL = "data/review_report.json";
  const OZ_TO_G = 31.1034768;

  const state = {
    rings: [],
    filtered: [],
    search: "",
    seller: "",
    karat: "",
    ringType: "",
    weightFilter: "",
    sortCol: "price_per_gold_oz",
    sortDir: "asc",
    page: 1,
    perPage: 50,
    active: null,
    loadError: null,
    reviewById: {}
  };

  // ---- Init ----
  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    const loaded = await load();
    await loadReview();
    buildFilters();
    bind();
    updateStats();
    if (loaded) apply();
    else renderLoadError();
  }

  // ---- Data Loading ----
  async function load() {
    try {
      const res = await fetch(DATA_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("catalog JSON is not an array");
      state.rings = data;
      state.filtered = state.rings.slice();
      state.loadError = null;
      return true;
    } catch (err) {
      console.error("Load error:", err);
      state.rings = [];
      state.filtered = [];
      state.loadError = err;
      return false;
    }
  }

  async function loadReview() {
    try {
      const res = await fetch(REPORT_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const report = await res.json();
      if (!Array.isArray(report.entries)) throw new Error("review report has no entries");
      state.reviewById = {};
      report.entries.forEach(function (entry) {
        if (entry && entry.id) state.reviewById[entry.id] = entry;
      });
    } catch (err) {
      // Review metadata is supplemental. The catalog remains usable if an
      // older deployment has not received the generated report yet.
      console.warn("Review report unavailable:", err);
      state.reviewById = {};
    }
  }

  function renderLoadError() {
    const tbody = el("tbody");
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="9" class="loading-cell" style="color:#c62828;">Catalog unavailable: ' + esc(state.loadError && state.loadError.message) + '. <a href="sources.html">Open the source-review index</a>.</td></tr>';
    }
    const pages = el("page-controls");
    if (pages) pages.innerHTML = "";
    setText("result-count", "Catalog unavailable — source-review index remains available");
  }

  // ---- Stats ----
  function updateStats() {
    const total = state.rings.length;
    const sellers = new Set(state.rings.map(r => r.seller).filter(Boolean)).size;
    const weighted = state.rings.filter(hasWeight).length;
    const ppoz = state.rings.map(r => r.price_per_gold_oz).filter(v => typeof v === "number" && v > 0);
    const best = ppoz.length ? Math.min(...ppoz) : null;

    setText("hdr-total", total);
    setText("hdr-sellers", sellers);
    setText("hdr-weight", weighted);
    setText("hdr-best", best ? "$" + fmt(Math.round(best)) : "—");
  }

  // ---- Build Filter Dropdowns ----
  function buildFilters() {
    // Sellers
    const sellerSel = el("f-seller");
    if (sellerSel) {
      const counts = countBy(state.rings, "seller");
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      sorted.forEach(([s, c]) => {
        const opt = document.createElement("option");
        opt.value = s;
        opt.textContent = s + " (" + c + ")";
        sellerSel.appendChild(opt);
      });
    }

    // Karats
    const karatSel = el("f-karat");
    if (karatSel) {
      const counts = countBy(state.rings, "karat");
      const order = ["24K", "18K", "14K", "10K", "Platinum"];
      order.forEach(k => {
        if (counts[k]) {
          const opt = document.createElement("option");
          opt.value = k;
          opt.textContent = k + " (" + counts[k] + ")";
          karatSel.appendChild(opt);
        }
      });
    }

    // Ring types
    const typeSel = el("f-type");
    if (typeSel) {
      const counts = countBy(state.rings, "ring_type");
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      sorted.forEach(([t, c]) => {
        const opt = document.createElement("option");
        opt.value = t;
        opt.textContent = t + " (" + c + ")";
        typeSel.appendChild(opt);
      });
    }
  }

  function countBy(arr, key) {
    const m = {};
    arr.forEach(r => {
      const v = r[key] || "Other";
      m[v] = (m[v] || 0) + 1;
    });
    return m;
  }

  // ---- Event Binding ----
  function bind() {
    // Search
    const searchInput = el("search");
    const clearBtn = el("search-clear");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        state.search = this.value;
        if (clearBtn) clearBtn.style.display = this.value ? "block" : "none";
        state.page = 1;
        apply();
      });
    }
    if (clearBtn && searchInput) {
      clearBtn.addEventListener("click", function () {
        searchInput.value = "";
        state.search = "";
        clearBtn.style.display = "none";
        state.page = 1;
        apply();
        searchInput.focus();
      });
    }

    // Dropdowns
    bindSel("f-seller", "seller");
    bindSel("f-karat", "karat");
    bindSel("f-type", "ringType");
    bindSel("f-weight", "weightFilter");

    // Sort
    const sortSel = el("f-sort");
    if (sortSel) {
      sortSel.addEventListener("change", function () {
        const parts = this.value.split(":");
        state.sortCol = parts[0];
        state.sortDir = parts[1] || "asc";
        state.page = 1;
        apply();
      });
    }

    // Page size
    const pageSizeSel = el("page-size");
    if (pageSizeSel) {
      pageSizeSel.addEventListener("change", function () {
        state.perPage = parseInt(this.value, 10);
        state.page = 1;
        renderTable();
        renderPagination();
      });
    }

    // Sort headers
    document.querySelectorAll("#ring-table thead th.sortable").forEach(function (th) {
      th.addEventListener("click", function () {
        const col = this.getAttribute("data-col");
        if (state.sortCol === col) {
          state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
        } else {
          state.sortCol = col;
          state.sortDir = (col === "price_per_gold_oz" || col === "price_usd") ? "asc" : "desc";
        }
        // Sync dropdown
        if (sortSel) {
          const val = state.sortCol + ":" + state.sortDir;
          for (let i = 0; i < sortSel.options.length; i++) {
            if (sortSel.options[i].value === val) { sortSel.value = val; break; }
          }
        }
        state.page = 1;
        apply();
      });
    });

    // Reset
    const resetBtn = el("btn-reset");
    if (resetBtn) resetBtn.addEventListener("click", resetFilters);

    // Export
    const csvBtn = el("btn-csv");
    if (csvBtn) csvBtn.addEventListener("click", exportCSV);
    const jsonBtn = el("btn-json");
    if (jsonBtn) jsonBtn.addEventListener("click", exportJSON);

    // Modal
    const overlay = el("modal-overlay");
    if (overlay) overlay.addEventListener("click", function (e) { if (e.target === overlay) closeModal(); });
    const closeBtn = el("m-close");
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
  }

  function bindSel(id, prop) {
    const sel = el(id);
    if (sel) {
      sel.addEventListener("change", function () {
        state[prop] = this.value;
        state.page = 1;
        apply();
      });
    }
  }

  // ---- Filter + Sort + Render ----
  function apply() {
    if (state.loadError) {
      renderLoadError();
      return;
    }
    const q = state.search.toLowerCase().trim();

    state.filtered = state.rings.filter(function (r) {
      // Search
      if (q) {
        const hay = ((r.ring || "") + " " + (r.seller || "") + " " + (r.karat || "") + " " + (r.ring_size || "") + " " + (r.hallmark || "") + " " + (r.note || "") + " " + (r.ring_type || "") + " " + (r.stone_type || "")).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      // Seller
      if (state.seller && r.seller !== state.seller) return false;
      // Karat
      if (state.karat && r.karat !== state.karat) return false;
      // Type
      if (state.ringType && r.ring_type !== state.ringType) return false;
      // Weight
      if (state.weightFilter === "yes" && !hasWeight(r)) return false;
      if (state.weightFilter === "no" && hasWeight(r)) return false;

      return true;
    });

    // Sort
    sort();

    renderTable();
    renderPagination();
    updateCount();
    updateSortHeaders();
  }

  function sort() {
    const col = state.sortCol;
    const asc = state.sortDir === "asc";

    state.filtered.sort(function (a, b) {
      let va = col === "weight_g" ? weightValue(a) : a[col];
      let vb = col === "weight_g" ? weightValue(b) : b[col];

      // Price fallback
      if (col === "price_usd") {
        va = a.price_usd != null ? a.price_usd : a.price_usd_from;
        vb = b.price_usd != null ? b.price_usd : b.price_usd_from;
      }

      // Nulls last
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;

      if (typeof va === "string") return asc ? va.localeCompare(vb) : vb.localeCompare(va);
      return asc ? va - vb : vb - va;
    });
  }

  function renderTable() {
    const tbody = el("tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (state.filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" class="loading-cell">No rings match your filters. <button class="btn btn-sm" onclick="document.getElementById(\'btn-reset\').click()">Reset Filters</button></td></tr>';
      return;
    }

    let items = state.filtered;
    if (state.perPage > 0) {
      const start = (state.page - 1) * state.perPage;
      items = state.filtered.slice(start, start + state.perPage);
    }

    const frag = document.createDocumentFragment();
    items.forEach(function (r) { frag.appendChild(buildRow(r)); });
    tbody.appendChild(frag);
  }

  function buildRow(r) {
    const tr = document.createElement("tr");
    tr.setAttribute("data-cat", r.category || "Standard Retail");
    tr.addEventListener("click", function () { openModal(r); });

    // Ring name
    var td = document.createElement("td");
    td.className = "td-name";
    var nameDiv = document.createElement("div");
    nameDiv.textContent = r.ring || "—";
    td.appendChild(nameDiv);
    var subDiv = document.createElement("div");
    subDiv.className = "sub";
    var parts = [];
    if (r.setting_only) parts.push("Setting Only");
    const stone = stoneSummary(r);
    if (stone) parts.push(stone);
    if (r.width_mm) parts.push(r.width_mm + "mm");
    subDiv.textContent = parts.join(" · ") || "";
    td.appendChild(subDiv);
    tr.appendChild(td);

    // Seller
    td = document.createElement("td");
    td.className = "td-seller";
    td.textContent = r.seller || "—";
    tr.appendChild(td);

    // Karat
    td = document.createElement("td");
    var badge = document.createElement("span");
    badge.className = "badge badge-karat";
    badge.textContent = r.karat || "—";
    td.appendChild(badge);
    tr.appendChild(td);

    // Size
    td = document.createElement("td");
    var sizeBadge = document.createElement("span");
    sizeBadge.className = "badge badge-size";
    sizeBadge.textContent = r.ring_size || "Std";
    td.appendChild(sizeBadge);
    tr.appendChild(td);

    // Weight
    td = document.createElement("td");
    td.className = "td-num";
    if (hasWeight(r)) {
      td.textContent = Number(weightValue(r)).toFixed(2) + " g";
    } else {
      var span = document.createElement("span");
      span.className = "not-listed";
      span.textContent = "Not listed";
      td.appendChild(span);
    }
    tr.appendChild(td);

    // Raw gold
    td = document.createElement("td");
    td.className = "td-num";
    if (r.raw_gold_g != null) {
      td.innerHTML = "<strong>" + r.raw_gold_g.toFixed(2) + " g</strong> <span style='color:var(--text-3);font-size:0.72rem;'>(" + r.raw_gold_oz.toFixed(3) + " oz)</span>";
    } else {
      td.innerHTML = '<span style="color:var(--text-3);">—</span>';
    }
    tr.appendChild(td);

    // Price
    td = document.createElement("td");
    td.className = "td-num";
    if (r.price_usd != null) {
      var pStr = "$" + fmt(r.price_usd);
      if (r.original_price_usd != null && r.original_price_usd > r.price_usd) {
        pStr += ' <span style="color:var(--text-3);text-decoration:line-through;font-size:0.72rem;">$' + fmt(r.original_price_usd) + "</span>";
      }
      td.innerHTML = pStr;
    } else if (r.price_usd_from != null) {
      td.textContent = "from $" + fmt(r.price_usd_from);
    } else {
      td.textContent = "—";
    }
    tr.appendChild(td);

    // Price per gold oz
    td = document.createElement("td");
    td.className = "td-num";
    if (r.price_per_gold_oz != null) {
      var scoreClass = "score-high";
      if (r.price_per_gold_oz < 6500) scoreClass = "score-great";
      else if (r.price_per_gold_oz < 15000) scoreClass = "score-good";
      td.innerHTML = '<span class="score ' + scoreClass + '">$' + fmt(Math.round(r.price_per_gold_oz)) + '/oz</span>';
      if (r.price_per_gold_g != null) {
        td.innerHTML += '<div style="font-size:0.72rem;color:var(--text-3);margin-top:2px;">$' + r.price_per_gold_g.toFixed(2) + "/g</div>";
      }
    } else {
      td.innerHTML = '<span style="color:var(--text-3);">—</span>';
    }
    tr.appendChild(td);

    // Source
    td = document.createElement("td");
    if (r.source_url) {
      var a = document.createElement("a");
      a.href = r.source_url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "source-link";
      a.title = r.source_label || "View official seller page";
      a.textContent = "Source ↗";
      a.addEventListener("click", function (e) { e.stopPropagation(); });
      td.appendChild(a);

      var review = state.reviewById[r.id];
      if (review && review.flags && review.flags.length) {
        var reviewLink = document.createElement("a");
        reviewLink.href = "sources.html#" + encodeURIComponent(r.id || "");
        reviewLink.className = "row-review";
        reviewLink.textContent = review.flags.length + " review flag" + (review.flags.length === 1 ? "" : "s");
        reviewLink.title = review.flags.join(", ").replace(/_/g, " ");
        reviewLink.addEventListener("click", function (e) { e.stopPropagation(); });
        td.appendChild(document.createElement("br"));
        td.appendChild(reviewLink);
      }
    } else {
      td.textContent = "—";
    }
    tr.appendChild(td);

    return tr;
  }

  // ---- Sort Header Indicators ----
  function updateSortHeaders() {
    document.querySelectorAll("#ring-table thead th.sortable").forEach(function (th) {
      th.classList.remove("sort-asc", "sort-desc");
      if (th.getAttribute("data-col") === state.sortCol) {
        th.classList.add(state.sortDir === "asc" ? "sort-asc" : "sort-desc");
      }
    });
  }

  // ---- Result Count ----
  function updateCount() {
    var el2 = el("result-count");
    if (!el2) return;
    var total = state.rings.length;
    var count = state.filtered.length;
    if (count === total) {
      el2.innerHTML = "Showing all <em>" + total + "</em> verified entries";
    } else {
      el2.innerHTML = "Showing <em>" + count + "</em> of " + total + " entries";
    }
  }

  // ---- Pagination ----
  function renderPagination() {
    var container = el("page-controls");
    if (!container) return;
    container.innerHTML = "";

    var total = state.filtered.length;
    if (state.perPage <= 0 || total <= state.perPage) return;

    var pages = Math.ceil(total / state.perPage);
    var cur = state.page;

    // Prev
    container.appendChild(pgBtn("‹", cur <= 1, function () {
      if (state.page > 1) { state.page--; renderTable(); renderPagination(); }
    }));

    // Page numbers
    var start = Math.max(1, cur - 2);
    var end = Math.min(pages, cur + 2);

    if (start > 1) {
      container.appendChild(pgBtn("1", false, function () { goToPage(1); }));
      if (start > 2) {
        var dots = document.createElement("span");
        dots.textContent = "…";
        dots.style.cssText = "padding:0 4px;color:var(--text-3);";
        container.appendChild(dots);
      }
    }

    for (var p = start; p <= end; p++) {
      (function (page) {
        container.appendChild(pgBtn(String(page), false, function () { goToPage(page); }, page === cur));
      })(p);
    }

    if (end < pages) {
      if (end < pages - 1) {
        var dots2 = document.createElement("span");
        dots2.textContent = "…";
        dots2.style.cssText = "padding:0 4px;color:var(--text-3);";
        container.appendChild(dots2);
      }
      container.appendChild(pgBtn(String(pages), false, function () { goToPage(pages); }));
    }

    // Next
    container.appendChild(pgBtn("›", cur >= pages, function () {
      if (state.page < pages) { state.page++; renderTable(); renderPagination(); }
    }));
  }

  function goToPage(n) {
    state.page = n;
    renderTable();
    renderPagination();
  }

  function pgBtn(text, disabled, onclick, active) {
    var btn = document.createElement("button");
    btn.className = "pg-btn" + (active ? " active" : "");
    btn.textContent = text;
    btn.disabled = disabled;
    btn.addEventListener("click", onclick);
    return btn;
  }

  // ---- Reset ----
  function resetFilters() {
    state.search = "";
    state.seller = "";
    state.karat = "";
    state.ringType = "";
    state.weightFilter = "";
    state.sortCol = "price_per_gold_oz";
    state.sortDir = "asc";
    state.page = 1;

    var searchInput = el("search");
    if (searchInput) searchInput.value = "";
    var clearBtn = el("search-clear");
    if (clearBtn) clearBtn.style.display = "none";

    ["f-seller", "f-karat", "f-type", "f-weight"].forEach(function (id) {
      var s = el(id);
      if (s) s.value = "";
    });
    var sortSel = el("f-sort");
    if (sortSel) sortSel.value = "price_per_gold_oz:asc";

    apply();
  }

  // ---- Modal ----
  function openModal(r) {
    state.active = r;
    setText("m-title", r.ring || "Ring Details");
    setText("m-seller", r.seller || "—");
    setText("m-karat", r.karat || "—");
    setText("m-hallmark", r.hallmark || "—");
    setText("m-size", r.ring_size || "—");
    setText("m-width", r.width_mm ? r.width_mm + " mm" : "—");
    setText("m-weight", hasWeight(r) ? Number(weightValue(r)).toFixed(2) + " g" : "Not published");
    setText("m-rawgold", r.raw_gold_g != null ? r.raw_gold_g.toFixed(2) + " g (" + r.raw_gold_oz.toFixed(3) + " troy oz)" : "—");
    setText("m-price", r.price_usd != null ? "$" + fmt(r.price_usd) : (r.price_usd_from != null ? "from $" + fmt(r.price_usd_from) : "—"));
    setText("m-ppoz", r.price_per_gold_oz != null ? "$" + fmt(Math.round(r.price_per_gold_oz)) + " /oz" : "—");
    setText("m-ppg", r.price_per_gold_g != null ? "$" + r.price_per_gold_g.toFixed(2) + " /g" : "—");
    setText("m-type", r.ring_type || "—");
    setText("m-cat", r.category || "—");
    setText("m-setting", r.setting_only ? "Setting Only (stone sold separately)" : "Complete Ring");
    setText("m-stones", stoneSummary(r) || "None recorded");
    setText("m-verified", r.verified_on || "—");

    var noteBox = el("m-note");
    if (noteBox) noteBox.textContent = r.note || "No specific buyer notes recorded.";

    var sourceLink = el("m-source");
    if (sourceLink) {
      sourceLink.href = r.source_url || "#";
      sourceLink.textContent = r.source_label ? r.source_label + " ↗" : "View Official Source ↗";
    }

    el("modal-overlay").classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    el("modal-overlay").classList.remove("open");
    document.body.style.overflow = "";
  }

  // ---- Export ----
  function exportCSV() {
    if (!state.filtered.length) return alert("No records to export.");
    var headers = ["Ring", "Seller", "Karat", "Hallmark", "Ring Size", "Weight (g)", "Raw Gold (g)", "Raw Gold (oz)", "Price (USD)", "Price/Gold Oz", "Price/Gold Gram", "Width (mm)", "Setting Only", "Stone Type", "Stone CTW", "Stone Carats", "Center Stone Ct", "Stone Range CTW", "White Stone Ct", "Yellow Stone Ct", "Stone SKU", "Ring Type", "Category", "Source URL", "Verified On", "Note"];
    var rows = state.filtered.map(function (r) {
      return [
        r.ring || "", r.seller || "", r.karat || "", r.hallmark || "", r.ring_size || "",
        r.weight_g != null ? r.weight_g : "", r.raw_gold_g != null ? r.raw_gold_g : "", r.raw_gold_oz != null ? r.raw_gold_oz : "",
        r.price_usd != null ? r.price_usd : (r.price_usd_from || ""),
        r.price_per_gold_oz != null ? r.price_per_gold_oz : "", r.price_per_gold_g != null ? r.price_per_gold_g : "",
        r.width_mm != null ? r.width_mm : "", r.setting_only ? "Yes" : "No",
        r.stone_type || "", r.stone_ctw != null ? r.stone_ctw : "", r.stone_carats != null ? r.stone_carats : "",
        r.center_stone_ct != null ? r.center_stone_ct : "", r.stone_range_ctw || "",
        r.stone_carats_white != null ? r.stone_carats_white : "", r.stone_carats_yellow != null ? r.stone_carats_yellow : "",
        r.stone_sku || "", r.ring_type || "", r.category || "",
        r.source_url || "", r.verified_on || "", (r.note || "").replace(/"/g, '""')
      ];
    });
    var csv = [headers.join(",")].concat(rows.map(function (row) {
      return row.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(",");
    })).join("\n");
    download(csv, "gold_rings_evidence.csv", "text/csv");
  }

  function exportJSON() {
    if (!state.filtered.length) return alert("No records to export.");
    download(JSON.stringify(state.filtered, null, 2), "gold_rings_evidence.json", "application/json");
  }

  function download(content, name, type) {
    var blob = new Blob([content], { type: type });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ---- Helpers ----
  function el(id) { return document.getElementById(id); }
  function weightValue(r) {
    return r.weight_g != null ? r.weight_g : r.weight_g_total;
  }
  function stoneSummary(r) {
    var type = r.stone_type || "";
    var amount = "";
    if (r.stone_ctw != null) amount = r.stone_ctw + " ctw";
    else if (r.stone_carats != null) amount = r.stone_carats + " ct";
    else if (r.center_stone_ct != null) amount = r.center_stone_ct + " ct center";
    else if (r.stone_range_ctw) amount = r.stone_range_ctw + " ctw";
    else if (r.stone_carats_white != null || r.stone_carats_yellow != null) {
      var white = r.stone_carats_white != null ? r.stone_carats_white + " ct white" : "";
      var yellow = r.stone_carats_yellow != null ? r.stone_carats_yellow + " ct yellow" : "";
      amount = [white, yellow].filter(Boolean).join(" + ");
    }
    var sku = r.stone_sku ? "SKU " + r.stone_sku : "";
    return [type, amount, sku].filter(Boolean).join(" · ");
  }
  function hasWeight(r) {
    var value = weightValue(r);
    return typeof value === "number" && isFinite(value) && value > 0;
  }
  function setText(id, val) { var e = el(id); if (e) e.textContent = String(val); }
  function fmt(n) {
    if (n == null || isNaN(n)) return "—";
    var parts = Number(n).toFixed(2).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts[1] === "00" ? parts[0] : parts.join(".");
  }
  function esc(s) {
    if (!s) return "";
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

})();
