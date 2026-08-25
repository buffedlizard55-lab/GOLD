/* scripts.js — GOLD Evidence-Based Buyer's Guide
   Strictly adheres to the No-Hallucination Policy.
   Does arithmetic only; does not call external price APIs. */

const DATA_PATH = "data/rings.json";
const TROY_OZ_TO_G = 31.1034768;

const KARAT_PURITY = {
  "24K": 0.999,
  "22K": 0.916,
  "18K": 0.750,
  "14K": 0.5833,
  "10K": 0.4167,
  "Platinum": 0.950,
  "24K reference": 0.999
};

const STATE = {
  rings: [],
  filtered: [],
  searchQuery: "",
  category: "all",
  seller: "all",
  karat: "all",
  ringType: "all",
  ringSize: "all",
  weightFilter: "all",
  settingFilter: "all",
  priceMin: null,
  priceMax: null,
  sortField: "price_per_gold_oz",
  sortOrder: "asc",
  currentPage: 1,
  pageSize: 25,
  activeRing: null
};

// ----------------- Initialization -----------------
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

async function initApp() {
  await loadData();
  setupEventListeners();
  renderSummaryStats();
  populateFilterOptions();
  applyFiltersAndRender();
  populateFileTree();
}

async function loadData() {
  const tbody = document.querySelector("#evidence-table tbody");
  if (tbody) {
    tbody.innerHTML = '<tr><td colspan="11" class="text-center text-muted" style="padding: 40px;">Loading verified evidence records…</td></tr>';
  }

  try {
    const res = await fetch(DATA_PATH, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    STATE.rings = data;
    STATE.filtered = [...data];
  } catch (err) {
    console.error("Error loading rings data:", err);
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="11" class="text-center" style="color: var(--danger); padding: 30px;">Failed to load data: ' + escapeHtml(err.message) + '</td></tr>';
    }
  }
}

// ----------------- Summary Statistics -----------------
function renderSummaryStats() {
  const total = STATE.rings.length;
  const transparentCount = STATE.rings.filter(r => r.weight_g != null).length;
  const investmentCount = STATE.rings.filter(r => r.karat === "24K").length;
  
  const sellersSet = new Set(STATE.rings.map(r => r.seller).filter(Boolean));
  
  const validPricedOz = STATE.rings
    .map(r => r.price_per_gold_oz)
    .filter(p => typeof p === "number" && p > 0);
  
  const lowestOz = validPricedOz.length > 0 ? Math.min(...validPricedOz) : null;
  
  setElText("stat-total-rings", total);
  setElText("stat-sellers", sellersSet.size + " Brands");
  setElText("stat-transparent", transparentCount + " Rings (" + Math.round((transparentCount / total) * 100) + "%)");
  setElText("stat-24k", investmentCount + " Bands");
  
  if (lowestOz) {
    setElText("stat-lowest-oz", "$" + formatNumber(Math.round(lowestOz)) + " /oz");
  }
}

function setElText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = String(val);
}

// ----------------- Populate Filter Options -----------------
function populateFilterOptions() {
  // Seller filter
  const sellerSelect = document.getElementById("filter-seller");
  if (sellerSelect) {
    const sellerCounts = {};
    STATE.rings.forEach(r => {
      const s = r.seller || "Other";
      sellerCounts[s] = (sellerCounts[s] || 0) + 1;
    });
    
    const sortedSellers = Object.keys(sellerCounts).sort((a, b) => sellerCounts[b] - sellerCounts[a]);
    sellerSelect.innerHTML = '<option value="all">All Sellers (' + STATE.rings.length + ')</option>';
    sortedSellers.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s + " (" + sellerCounts[s] + ")";
      sellerSelect.appendChild(opt);
    });
  }

  // Karat filter
  const karatSelect = document.getElementById("filter-karat");
  if (karatSelect) {
    const karatCounts = {};
    STATE.rings.forEach(r => {
      const k = r.karat || "Other";
      karatCounts[k] = (karatCounts[k] || 0) + 1;
    });
    const order = ["24K", "18K", "14K", "10K", "Platinum"];
    karatSelect.innerHTML = '<option value="all">All Metals / Karats</option>';
    order.forEach(k => {
      if (karatCounts[k]) {
        const opt = document.createElement("option");
        opt.value = k;
        opt.textContent = k + " (" + karatCounts[k] + ")";
        karatSelect.appendChild(opt);
      }
    });
  }

  // Ring Type filter
  const typeSelect = document.getElementById("filter-type");
  if (typeSelect) {
    const typeCounts = {};
    STATE.rings.forEach(r => {
      const t = r.ring_type || "Other";
      typeCounts[t] = (typeCounts[t] || 0) + 1;
    });
    const sortedTypes = Object.keys(typeCounts).sort((a, b) => typeCounts[b] - typeCounts[a]);
    typeSelect.innerHTML = '<option value="all">All Ring Styles</option>';
    sortedTypes.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t + " (" + typeCounts[t] + ")";
      typeSelect.appendChild(opt);
    });
  }

  // Update Category Pill counts
  const catPills = document.querySelectorAll(".cat-pill");
  catPills.forEach(pill => {
    const cat = pill.getAttribute("data-cat");
    const countEl = pill.querySelector(".pill-count");
    if (!countEl) return;
    if (cat === "all") {
      countEl.textContent = STATE.rings.length;
    } else {
      const count = STATE.rings.filter(r => r.category === cat).length;
      countEl.textContent = count;
    }
  });
}

// ----------------- Filter & Search Logic -----------------
function applyFiltersAndRender() {
  const q = STATE.searchQuery.toLowerCase().trim();
  
  STATE.filtered = STATE.rings.filter(item => {
    // Search query
    if (q) {
      const haystack = (
        (item.ring || "") + " " +
        (item.seller || "") + " " +
        (item.karat || "") + " " +
        (item.ring_size || "") + " " +
        (item.hallmark || "") + " " +
        (item.note || "") + " " +
        (item.ring_type || "") + " " +
        (item.stone_type || "")
      ).toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    // Category
    if (STATE.category !== "all" && item.category !== STATE.category) {
      return false;
    }

    // Seller
    if (STATE.seller !== "all" && item.seller !== STATE.seller) {
      return false;
    }

    // Karat
    if (STATE.karat !== "all" && item.karat !== STATE.karat) {
      return false;
    }

    // Ring Type
    if (STATE.ringType !== "all" && item.ring_type !== STATE.ringType) {
      return false;
    }

    // Ring Size
    if (STATE.ringSize === "size_45") {
      const sizeStr = (item.ring_size || "").toLowerCase();
      if (!sizeStr.includes("4.5") && !sizeStr.includes("4.0")) return false;
    }

    // Weight Transparency
    if (STATE.weightFilter === "published" && item.weight_g == null) {
      return false;
    }
    if (STATE.weightFilter === "unlisted" && item.weight_g != null) {
      return false;
    }

    // Setting Filter
    if (STATE.settingFilter === "setting_only" && !item.setting_only) {
      return false;
    }
    if (STATE.settingFilter === "with_stones" && item.setting_only) {
      return false;
    }

    // Price Range
    const price = item.price_usd != null ? item.price_usd : item.price_usd_from;
    if (STATE.priceMin != null && (price == null || price < STATE.priceMin)) {
      return false;
    }
    if (STATE.priceMax != null && (price == null || price > STATE.priceMax)) {
      return false;
    }

    return true;
  });

  // Sorting
  sortFilteredData();

  // Reset to page 1 on filter changes
  STATE.currentPage = 1;

  renderTable();
  renderPagination();
  updateResultsCount();
}

function sortFilteredData() {
  const field = STATE.sortField;
  const isAsc = STATE.sortOrder === "asc";

  STATE.filtered.sort((a, b) => {
    let valA = a[field];
    let valB = b[field];

    // Handle price fallback
    if (field === "price_usd") {
      valA = a.price_usd != null ? a.price_usd : a.price_usd_from;
      valB = b.price_usd != null ? b.price_usd : b.price_usd_from;
    }

    // Place null / undefined values at the end regardless of sort direction
    if (valA == null && valB == null) return 0;
    if (valA == null) return 1;
    if (valB == null) return -1;

    if (typeof valA === "string") {
      return isAsc
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return isAsc ? valA - valB : valB - valA;
  });
}

// ----------------- Table Rendering -----------------
function renderTable() {
  const tbody = document.querySelector("#evidence-table tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (STATE.filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="11" class="text-center text-muted" style="padding: 40px;">No verified rings match the selected filters. <button class="btn btn-secondary btn-sm" onclick="resetFilters()">Reset Filters</button></td></tr>';
    return;
  }

  // Pagination slice
  let displayItems = STATE.filtered;
  if (STATE.pageSize > 0) {
    const start = (STATE.currentPage - 1) * STATE.pageSize;
    const end = start + STATE.pageSize;
    displayItems = STATE.filtered.slice(start, end);
  }

  const fragment = document.createDocumentFragment();
  displayItems.forEach(item => {
    fragment.appendChild(createTableRow(item));
  });
  tbody.appendChild(fragment);

  updateSortHeaders();
}

function createTableRow(item) {
  const tr = document.createElement("tr");
  tr.setAttribute("data-category", item.category || "Standard Retail");
  tr.setAttribute("data-id", item.id);

  // Category Badge
  const tdCat = document.createElement("td");
  const catBadge = document.createElement("span");
  catBadge.className = "badge " + getCategoryBadgeClass(item.category);
  catBadge.textContent = item.category || "Standard";
  tdCat.appendChild(catBadge);
  tr.appendChild(tdCat);

  // Ring Name & Details
  const tdName = document.createElement("td");
  tdName.className = "cell-ring-name";
  
  const nameLink = document.createElement("a");
  nameLink.href = "javascript:void(0)";
  nameLink.textContent = item.ring || "—";
  nameLink.style.color = "var(--text-primary)";
  nameLink.style.textDecoration = "none";
  nameLink.style.fontWeight = "600";
  nameLink.onclick = () => openRingModal(item);
  tdName.appendChild(nameLink);

  // Subtitle with setting badge / style
  const subDiv = document.createElement("div");
  subDiv.style.fontSize = "0.76rem";
  subDiv.style.color = "var(--text-muted)";
  subDiv.style.marginTop = "3px";
  subDiv.style.display = "flex";
  subDiv.style.gap = "6px";
  subDiv.style.flexWrap = "wrap";
  subDiv.style.alignItems = "center";

  if (item.setting_only) {
    const setBadge = document.createElement("span");
    setBadge.style.color = "#b45309";
    setBadge.style.fontWeight = "600";
    setBadge.textContent = "Setting Only";
    subDiv.appendChild(setBadge);
  } else if (item.stone_type || item.stone_ctw) {
    const stoneBadge = document.createElement("span");
    stoneBadge.textContent = (item.stone_type || "Diamond") + (item.stone_ctw ? " (" + item.stone_ctw + "ctw)" : "");
    subDiv.appendChild(stoneBadge);
  }

  if (item.width_mm) {
    const widthSpan = document.createElement("span");
    widthSpan.textContent = "• " + item.width_mm + "mm";
    subDiv.appendChild(widthSpan);
  }

  tdName.appendChild(subDiv);
  tr.appendChild(tdName);

  // Seller
  const tdSeller = document.createElement("td");
  tdSeller.className = "cell-seller";
  tdSeller.textContent = item.seller || "—";
  tr.appendChild(tdSeller);

  // Karat / Metal
  const tdKarat = document.createElement("td");
  const karatBadge = document.createElement("span");
  karatBadge.className = "badge badge-metal";
  karatBadge.textContent = item.karat || "14K";
  tdKarat.appendChild(karatBadge);
  tr.appendChild(tdKarat);

  // Ring Size
  const tdSize = document.createElement("td");
  tdSize.className = "cell-num";
  const sizeBadge = document.createElement("span");
  sizeBadge.className = "badge badge-size";
  sizeBadge.textContent = item.ring_size || "Standard";
  tdSize.appendChild(sizeBadge);
  tr.appendChild(tdSize);

  // Total Weight (g)
  const tdWeight = document.createElement("td");
  tdWeight.className = "cell-num";
  if (item.weight_g != null) {
    tdWeight.textContent = Number(item.weight_g).toFixed(2) + " g";
  } else if (item.weight_g_total != null) {
    tdWeight.textContent = Number(item.weight_g_total).toFixed(2) + " g";
  } else {
    tdWeight.innerHTML = '<span class="text-muted" title="Seller does not publish metal weight">⚠️ Not listed</span>';
  }
  tr.appendChild(tdWeight);

  // Raw Gold Weight (pure gold g and troy oz)
  const tdGold = document.createElement("td");
  tdGold.className = "cell-num";
  if (item.raw_gold_g != null) {
    tdGold.innerHTML = '<strong>' + item.raw_gold_g.toFixed(2) + ' g</strong> <span class="text-muted" style="font-size:0.75rem;">(' + item.raw_gold_oz.toFixed(3) + ' oz)</span>';
  } else {
    tdGold.innerHTML = '<span class="text-muted">—</span>';
  }
  tr.appendChild(tdGold);

  // Price (USD)
  const tdPrice = document.createElement("td");
  tdPrice.className = "cell-num";
  if (item.price_usd != null) {
    let pStr = "$" + formatNumber(item.price_usd);
    if (item.original_price_usd != null && item.original_price_usd > item.price_usd) {
      pStr += ' <span class="text-muted" style="text-decoration:line-through; font-size:0.75rem;">$' + formatNumber(item.original_price_usd) + '</span>';
    }
    tdPrice.innerHTML = pStr;
  } else if (item.price_usd_from != null) {
    tdPrice.textContent = "from $" + formatNumber(item.price_usd_from);
  } else {
    tdPrice.textContent = "—";
  }
  tr.appendChild(tdPrice);

  // Price per Gold Oz & Gram
  const tdPriceOz = document.createElement("td");
  tdPriceOz.className = "cell-num";
  if (item.price_per_gold_oz != null) {
    const ozScoreClass = getPriceScoreClass(item.price_per_gold_oz);
    tdPriceOz.innerHTML = '<div class="score-badge ' + ozScoreClass + '">$' + formatNumber(Math.round(item.price_per_gold_oz)) + '/oz</div><div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">$' + item.price_per_gold_g.toFixed(2) + '/g</div>';
  } else {
    tdPriceOz.innerHTML = '<span class="text-muted">—</span>';
  }
  tr.appendChild(tdPriceOz);

  // Official Source Link
  const tdSource = document.createElement("td");
  if (item.source_url) {
    const a = document.createElement("a");
    a.href = item.source_url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.className = "source-btn";
    a.title = item.source_label || "View official seller page";
    a.innerHTML = 'Source ↗';
    tdSource.appendChild(a);
  } else {
    tdSource.textContent = "—";
  }
  tr.appendChild(tdSource);

  // Verified & Actions
  const tdActions = document.createElement("td");
  const actionsDiv = document.createElement("div");
  actionsDiv.className = "row-actions";

  const calcBtn = document.createElement("button");
  calcBtn.className = "action-icon-btn";
  calcBtn.title = "Load weight & karat into Melt Calculator";
  calcBtn.textContent = "Calc Melt";
  calcBtn.onclick = () => loadIntoCalculator(item);
  actionsDiv.appendChild(calcBtn);

  const detailBtn = document.createElement("button");
  detailBtn.className = "action-icon-btn";
  detailBtn.title = "View complete specifications";
  detailBtn.textContent = "Specs";
  detailBtn.onclick = () => openRingModal(item);
  actionsDiv.appendChild(detailBtn);

  tdActions.appendChild(actionsDiv);
  tr.appendChild(tdActions);

  return tr;
}

function getCategoryBadgeClass(category) {
  if (category === "Investment (24K)") return "badge-24k";
  if (category === "High Transparency") return "badge-trans";
  if (category === "Benchmark") return "badge-bench";
  return "badge-retail";
}

function getPriceScoreClass(priceOz) {
  if (priceOz < 6500) return "score-great";
  if (priceOz < 15000) return "score-good";
  return "score-high";
}

function updateSortHeaders() {
  const ths = document.querySelectorAll("#evidence-table thead th[data-sort]");
  ths.forEach(th => {
    const field = th.getAttribute("data-sort");
    th.classList.remove("sort-asc", "sort-desc");
    if (field === STATE.sortField) {
      th.classList.add(STATE.sortOrder === "asc" ? "sort-asc" : "sort-desc");
    }
  });
}

function updateResultsCount() {
  const info = document.getElementById("results-counter");
  if (!info) return;
  const total = STATE.rings.length;
  const count = STATE.filtered.length;
  if (count === total) {
    info.innerHTML = 'Showing all <span>' + total + '</span> verified entries';
  } else {
    info.innerHTML = 'Showing <span>' + count + '</span> of ' + total + ' verified entries';
  }
}

// ----------------- Pagination -----------------
function renderPagination() {
  const container = document.getElementById("pagination-controls");
  if (!container) return;
  container.innerHTML = "";

  const total = STATE.filtered.length;
  if (STATE.pageSize <= 0 || total <= STATE.pageSize) {
    return;
  }

  const totalPages = Math.ceil(total / STATE.pageSize);
  const current = STATE.currentPage;

  // Prev Button
  const prevBtn = document.createElement("button");
  prevBtn.className = "page-btn";
  prevBtn.innerHTML = "‹";
  prevBtn.disabled = current <= 1;
  prevBtn.onclick = () => {
    if (STATE.currentPage > 1) {
      STATE.currentPage--;
      renderTable();
      renderPagination();
    }
  };
  container.appendChild(prevBtn);

  // Page Numbers
  let startPage = Math.max(1, current - 2);
  let endPage = Math.min(totalPages, current + 2);

  if (startPage > 1) {
    const p1 = createPageNumBtn(1);
    container.appendChild(p1);
    if (startPage > 2) {
      const dots = document.createElement("span");
      dots.textContent = "…";
      dots.style.padding = "0 4px";
      dots.style.color = "var(--text-muted)";
      container.appendChild(dots);
    }
  }

  for (let p = startPage; p <= endPage; p++) {
    container.appendChild(createPageNumBtn(p));
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const dots = document.createElement("span");
      dots.textContent = "…";
      dots.style.padding = "0 4px";
      dots.style.color = "var(--text-muted)";
      container.appendChild(dots);
    }
    container.appendChild(createPageNumBtn(totalPages));
  }

  // Next Button
  const nextBtn = document.createElement("button");
  nextBtn.className = "page-btn";
  nextBtn.innerHTML = "›";
  nextBtn.disabled = current >= totalPages;
  nextBtn.onclick = () => {
    if (STATE.currentPage < totalPages) {
      STATE.currentPage++;
      renderTable();
      renderPagination();
    }
  };
  container.appendChild(nextBtn);
}

function createPageNumBtn(pageNum) {
  const btn = document.createElement("button");
  btn.className = "page-btn" + (pageNum === STATE.currentPage ? " active" : "");
  btn.textContent = String(pageNum);
  btn.onclick = () => {
    STATE.currentPage = pageNum;
    renderTable();
    renderPagination();
  };
  return btn;
}

// ----------------- Event Listeners -----------------
function setupEventListeners() {
  // Search
  const searchInput = document.getElementById("search-input");
  const clearSearchBtn = document.getElementById("search-clear-btn");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      STATE.searchQuery = e.target.value;
      if (clearSearchBtn) {
        clearSearchBtn.style.display = e.target.value ? "block" : "none";
      }
      applyFiltersAndRender();
    });
  }

  if (clearSearchBtn && searchInput) {
    clearSearchBtn.addEventListener("click", () => {
      searchInput.value = "";
      STATE.searchQuery = "";
      clearSearchBtn.style.display = "none";
      applyFiltersAndRender();
      searchInput.focus();
    });
  }

  // Category Pills
  const catPills = document.querySelectorAll(".cat-pill");
  catPills.forEach(pill => {
    pill.addEventListener("click", () => {
      catPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      STATE.category = pill.getAttribute("data-cat") || "all";
      applyFiltersAndRender();
    });
  });

  // Dropdown Filters
  bindSelectFilter("filter-seller", "seller");
  bindSelectFilter("filter-karat", "karat");
  bindSelectFilter("filter-type", "ringType");
  bindSelectFilter("filter-size", "ringSize");
  bindSelectFilter("filter-weight", "weightFilter");
  bindSelectFilter("filter-setting", "settingFilter");

  // Price Filters
  const minInput = document.getElementById("filter-price-min");
  const maxInput = document.getElementById("filter-price-max");
  if (minInput) {
    minInput.addEventListener("input", (e) => {
      STATE.priceMin = e.target.value ? parseFloat(e.target.value) : null;
      applyFiltersAndRender();
    });
  }
  if (maxInput) {
    maxInput.addEventListener("input", (e) => {
      STATE.priceMax = e.target.value ? parseFloat(e.target.value) : null;
      applyFiltersAndRender();
    });
  }

  // Sort Select
  const sortSelect = document.getElementById("filter-sort");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      const parts = e.target.value.split(":");
      STATE.sortField = parts[0];
      STATE.sortOrder = parts[1] || "asc";
      applyFiltersAndRender();
    });
  }

  // Page Size Select
  const pageSizeSelect = document.getElementById("page-size-select");
  if (pageSizeSelect) {
    pageSizeSelect.addEventListener("change", (e) => {
      STATE.pageSize = parseInt(e.target.value, 10);
      STATE.currentPage = 1;
      renderTable();
      renderPagination();
    });
  }

  // Sort Headers on Table
  const sortHeaders = document.querySelectorAll("#evidence-table thead th[data-sort]");
  sortHeaders.forEach(th => {
    th.addEventListener("click", () => {
      const field = th.getAttribute("data-sort");
      if (STATE.sortField === field) {
        STATE.sortOrder = STATE.sortOrder === "asc" ? "desc" : "asc";
      } else {
        STATE.sortField = field;
        STATE.sortOrder = (field === "price_per_gold_oz" || field === "price_usd") ? "asc" : "desc";
      }
      if (sortSelect) {
        sortSelect.value = STATE.sortField + ":" + STATE.sortOrder;
      }
      applyFiltersAndRender();
    });
  });

  // Calculator Form
  const calcBtn = document.getElementById("calc-btn");
  if (calcBtn) calcBtn.addEventListener("click", runCalculator);

  const calcInputs = ["calc-spot-oz", "calc-weight-g", "calc-karat", "calc-retail-price"];
  calcInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", runCalculator);
  });

  // Modal Backdrop Close
  const modal = document.getElementById("ring-modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeRingModal();
    });
  }

  const closeBtn = document.getElementById("modal-close-btn");
  if (closeBtn) closeBtn.addEventListener("click", closeRingModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeRingModal();
  });
}

function bindSelectFilter(elementId, stateProp) {
  const el = document.getElementById(elementId);
  if (el) {
    el.addEventListener("change", (e) => {
      STATE[stateProp] = e.target.value;
      applyFiltersAndRender();
    });
  }
}

function resetFilters() {
  STATE.searchQuery = "";
  STATE.category = "all";
  STATE.seller = "all";
  STATE.karat = "all";
  STATE.ringType = "all";
  STATE.ringSize = "all";
  STATE.weightFilter = "all";
  STATE.settingFilter = "all";
  STATE.priceMin = null;
  STATE.priceMax = null;
  STATE.sortField = "price_per_gold_oz";
  STATE.sortOrder = "asc";
  STATE.currentPage = 1;

  // Reset inputs
  const searchInput = document.getElementById("search-input");
  if (searchInput) searchInput.value = "";
  
  const clearBtn = document.getElementById("search-clear-btn");
  if (clearBtn) clearBtn.style.display = "none";

  const selects = [
    "filter-seller", "filter-karat", "filter-type", 
    "filter-size", "filter-weight", "filter-setting"
  ];
  selects.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "all";
  });

  const minInput = document.getElementById("filter-price-min");
  const maxInput = document.getElementById("filter-price-max");
  if (minInput) minInput.value = "";
  if (maxInput) maxInput.value = "";

  const sortSelect = document.getElementById("filter-sort");
  if (sortSelect) sortSelect.value = "price_per_gold_oz:asc";

  const catPills = document.querySelectorAll(".cat-pill");
  catPills.forEach(p => {
    p.classList.toggle("active", p.getAttribute("data-cat") === "all");
  });

  applyFiltersAndRender();
}

// ----------------- Ring Modal -----------------
function openRingModal(item) {
  STATE.activeRing = item;
  const modal = document.getElementById("ring-modal");
  if (!modal) return;

  setElText("modal-title", item.ring || "Ring Details");
  setElText("modal-seller", item.seller || "—");
  setElText("modal-karat", item.karat || "—");
  setElText("modal-hallmark", item.hallmark || "—");
  setElText("modal-size", item.ring_size || "—");
  
  const weightStr = item.weight_g != null ? item.weight_g.toFixed(2) + " g" : "⚠️ Not published";
  setElText("modal-weight", weightStr);

  const rawGoldStr = item.raw_gold_g != null 
    ? item.raw_gold_g.toFixed(2) + " g (" + item.raw_gold_oz.toFixed(3) + " troy oz)"
    : "—";
  setElText("modal-raw-gold", rawGoldStr);

  const priceStr = item.price_usd != null 
    ? "$" + formatNumber(item.price_usd) 
    : (item.price_usd_from != null ? "from $" + formatNumber(item.price_usd_from) : "—");
  setElText("modal-price", priceStr);

  const priceOzStr = item.price_per_gold_oz != null 
    ? "$" + formatNumber(Math.round(item.price_per_gold_oz)) + " /oz ($" + item.price_per_gold_g.toFixed(2) + " /g)"
    : "—";
  setElText("modal-price-oz", priceOzStr);

  setElText("modal-width", item.width_mm ? item.width_mm + " mm" : "—");
  setElText("modal-setting", item.setting_only ? "Setting Only (Diamond sold separately)" : "Complete Ring (Includes stones / metal)");
  
  const stonesStr = (item.stone_type || "None") + (item.stone_ctw ? " (" + item.stone_ctw + " ctw)" : "");
  setElText("modal-stones", stonesStr);
  
  setElText("modal-verified", item.verified_on || "—");

  // Note
  const noteBox = document.getElementById("modal-note");
  if (noteBox) {
    noteBox.textContent = item.note || "No specific buyer notes recorded for this listing.";
  }

  // Source link
  const sourceLink = document.getElementById("modal-source-link");
  if (sourceLink) {
    sourceLink.href = item.source_url || "#";
    sourceLink.textContent = item.source_label || "View Official Product Listing ↗";
  }

  // Category Badge
  const catBadge = document.getElementById("modal-cat-badge");
  if (catBadge) {
    catBadge.className = "badge " + getCategoryBadgeClass(item.category);
    catBadge.textContent = item.category || "Standard";
  }

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeRingModal() {
  const modal = document.getElementById("ring-modal");
  if (modal) modal.classList.remove("open");
  document.body.style.overflow = "";
}

function loadActiveIntoCalculator() {
  if (!STATE.activeRing) return;
  loadIntoCalculator(STATE.activeRing);
  closeRingModal();
}

// ----------------- Calculator -----------------
function loadIntoCalculator(item) {
  if (item.weight_g != null) {
    const weightInput = document.getElementById("calc-weight-g");
    if (weightInput) weightInput.value = item.weight_g;
  }

  const karatSelect = document.getElementById("calc-karat");
  if (karatSelect) {
    if (item.karat === "24K") karatSelect.value = "0.999";
    else if (item.karat === "18K") karatSelect.value = "0.750";
    else if (item.karat === "14K") karatSelect.value = "0.5833";
    else if (item.karat === "10K") karatSelect.value = "0.4167";
  }

  const priceInput = document.getElementById("calc-retail-price");
  if (priceInput) {
    const p = item.price_usd || item.price_usd_from;
    priceInput.value = p != null ? p : "";
  }

  runCalculator();

  const calcSec = document.getElementById("calculator");
  if (calcSec) {
    calcSec.scrollIntoView({ behavior: "smooth" });
  }
}

function loadCalculatorPreset(weightG, purityVal, priceVal) {
  const weightInput = document.getElementById("calc-weight-g");
  const karatSelect = document.getElementById("calc-karat");
  const priceInput = document.getElementById("calc-retail-price");

  if (weightInput) weightInput.value = weightG;
  if (karatSelect) karatSelect.value = purityVal;
  if (priceInput) priceInput.value = priceVal || "";

  runCalculator();
}

function runCalculator() {
  const spotOzInput = document.getElementById("calc-spot-oz");
  const weightInput = document.getElementById("calc-weight-g");
  const karatSelect = document.getElementById("calc-karat");
  const retailInput = document.getElementById("calc-retail-price");

  const spotOz = parseFloat(spotOzInput.value);
  const weightG = parseFloat(weightInput.value);
  const purity = parseFloat(karatSelect.value);
  const retailPrice = retailInput.value ? parseFloat(retailInput.value) : null;

  if (isNaN(spotOz) || isNaN(weightG) || isNaN(purity) || weightG <= 0 || spotOz <= 0) {
    setElText("calc-out-pure-g", "—");
    setElText("calc-out-pure-oz", "—");
    setElText("calc-out-melt-val", "—");
    setElText("calc-out-spot-g", "—");
    setElText("calc-out-markup-dlr", "—");
    setElText("calc-out-markup-pct", "—");
    return;
  }

  const spotPerGramPure = spotOz / TROY_OZ_TO_G;
  const pureGoldG = weightG * purity;
  const pureGoldOz = pureGoldG / TROY_OZ_TO_G;
  const meltValueUSD = pureGoldG * spotPerGramPure;

  setElText("calc-out-pure-g", pureGoldG.toFixed(2) + " g");
  setElText("calc-out-pure-oz", pureGoldOz.toFixed(3) + " oz t");
  setElText("calc-out-melt-val", "$" + formatNumber(meltValueUSD.toFixed(2)));
  setElText("calc-out-spot-g", "$" + spotPerGramPure.toFixed(2) + "/g");

  if (retailPrice != null && !isNaN(retailPrice) && retailPrice > 0) {
    const markupDollar = retailPrice - meltValueUSD;
    const markupPct = ((retailPrice - meltValueUSD) / meltValueUSD) * 100;

    const markupSign = markupDollar >= 0 ? "+" : "";
    setElText("calc-out-markup-dlr", markupSign + "$" + formatNumber(markupDollar.toFixed(2)));
    setElText("calc-out-markup-pct", markupSign + markupPct.toFixed(1) + "%");
  } else {
    setElText("calc-out-markup-dlr", "—");
    setElText("calc-out-markup-pct", "—");
  }
}

// ----------------- Export Functions -----------------
function exportCSV() {
  if (STATE.filtered.length === 0) {
    alert("No records to export.");
    return;
  }

  const headers = [
    "Category", "Ring Name", "Seller", "Karat", "Hallmark",
    "Ring Size", "Weight (g)", "Raw Pure Gold (g)", "Raw Pure Gold (oz t)",
    "Price (USD)", "Price / Gold Oz", "Price / Gold Gram", "Width (mm)",
    "Setting Only", "Stone Type", "Stone CTW", "Source URL", "Verified Date", "Note"
  ];

  const rows = STATE.filtered.map(r => [
    r.category || "",
    r.ring || "",
    r.seller || "",
    r.karat || "",
    r.hallmark || "",
    r.ring_size || "",
    r.weight_g != null ? r.weight_g : "",
    r.raw_gold_g != null ? r.raw_gold_g : "",
    r.raw_gold_oz != null ? r.raw_gold_oz : "",
    r.price_usd != null ? r.price_usd : (r.price_usd_from || ""),
    r.price_per_gold_oz != null ? r.price_per_gold_oz : "",
    r.price_per_gold_g != null ? r.price_per_gold_g : "",
    r.width_mm != null ? r.width_mm : "",
    r.setting_only ? "Yes" : "No",
    r.stone_type || "",
    r.stone_ctw || "",
    r.source_url || "",
    r.verified_on || "",
    (r.note || "").replace(/"/g, '""')
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(","))
  ].join("\n");

  downloadBlob(csvContent, "gold_rings_evidence.csv", "text/csv;charset=utf-8;");
}

function exportJSON() {
  if (STATE.filtered.length === 0) {
    alert("No records to export.");
    return;
  }
  const jsonContent = JSON.stringify(STATE.filtered, null, 2);
  downloadBlob(jsonContent, "gold_rings_evidence.json", "application/json;charset=utf-8;");
}

function downloadBlob(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ----------------- Repository File Tree Browser -----------------
function populateFileTree() {
  const list = document.getElementById("file-list");
  if (!list) return;
  list.innerHTML = "";

  const countBadge = document.getElementById("file-count-badge");
  if (countBadge) countBadge.textContent = STATE.rings.length + " files";

  const searchInput = document.getElementById("file-search-input");
  
  function renderFiles(filterText = "") {
    list.innerHTML = "";
    const filter = filterText.toLowerCase();
    
    STATE.rings.forEach(entry => {
      const filename = (entry.file || "").split("/").pop();
      if (!filename || (filter && !filename.toLowerCase().includes(filter))) return;

      const li = document.createElement("li");
      li.style.marginBottom = "4px";
      
      const code = document.createElement("code");
      code.textContent = filename;
      code.style.color = "#9cdcfe";
      code.style.cursor = "pointer";
      code.onclick = () => openRingModal(entry);
      
      const noteSpan = document.createElement("span");
      noteSpan.style.color = "#6a9955";
      noteSpan.style.marginLeft = "10px";
      noteSpan.style.fontSize = "0.78rem";
      noteSpan.textContent = "// " + entry.seller + " - " + entry.ring.slice(0, 40);

      li.appendChild(code);
      li.appendChild(noteSpan);
      list.appendChild(li);
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => renderFiles(e.target.value));
  }

  renderFiles();
}

// ----------------- Utility Helpers -----------------
function formatNumber(num) {
  if (num == null || isNaN(num)) return "—";
  const parts = Number(num).toFixed(2).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts[1] === "00" ? parts[0] : parts.join(".");
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
