#!/usr/bin/env python3
"""Audit the GOLD catalog without inventing or fetching product data.

This audit is intentionally conservative.  It checks repository integrity,
URL shape, cross-file consistency, and arithmetic that is already represented
in the catalog.  It does *not* claim that a retailer page still contains the
same price or weight.  That limitation is recorded in the generated report,
and every row includes its source URL for review.

Usage:
    python3 scripts/audit.py              # write reports and print summary
    python3 scripts/audit.py --check      # write reports; exit non-zero on errors
    python3 scripts/audit.py --no-write   # print summary without reports
"""

from __future__ import annotations

import argparse
import datetime as dt
import html
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE_DIR = ROOT / "data" / "evidence"
MASTER_PATH = ROOT / "data" / "rings.json"
DOCS_MASTER_PATH = ROOT / "docs" / "data" / "rings.json"
REPORT_PATH = ROOT / "data" / "review_report.json"
DOCS_REPORT_PATH = ROOT / "docs" / "data" / "review_report.json"
SOURCE_CHECKS_PATH = ROOT / "data" / "source_checks.json"
DOCS_SOURCE_CHECKS_PATH = ROOT / "docs" / "data" / "source_checks.json"
ROOT_SOURCE_PAGE = ROOT / "sources.html"
DOCS_SOURCE_PAGE = ROOT / "docs" / "sources.html"
OZ_TO_G = 31.1034768
MIN_VERIFIED_DATE = dt.date(2026, 1, 1)
TODAY = dt.date.today()
REPO_BRANCH = "arena/01a03ccc-gold"

REQUIRED_FIELDS = ("ring", "seller", "karat", "hallmark", "source_url")
PRICE_FIELDS = ("price_usd", "price_usd_from", "price_usd_to")
WEIGHT_FIELDS = ("weight_g", "weight_g_total")

# These are observations about the URL/row, not proof that a seller is bad.
# The report labels the findings as heuristics so a reviewer can decide.
THIRD_PARTY_HOSTS = {
    "wwd.com",
    "walmart.com",
    "onceuponadiamond.com",
}
REFERENCE_SELLER_MARKERS = ("reference", "price feed")
NON_RING_WORDS = (
    "bracelet",
    "bangle",
    "earring",
    "earrings",
    "necklace",
    "pendant",
    "studs",
)
COLLECTION_MARKERS = (
    "/collections/",
    "/rings-all",
    "/engagement-rings",
    "/jewelry/",
)


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def is_number(value) -> bool:
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def nonempty(value) -> bool:
    return value is not None and value != ""


def source_host(url: str) -> str:
    parsed = urlparse(url)
    return (parsed.hostname or "").lower().removeprefix("www.")


def source_kind(url: str, seller: str) -> str:
    """Return a review aid; never treat this heuristic as verification."""
    parsed = urlparse(url)
    host = source_host(url)
    path = parsed.path.lower()
    seller_l = (seller or "").lower()
    if host in THIRD_PARTY_HOSTS:
        return "third_party_or_marketplace"
    if any(marker in path for marker in COLLECTION_MARKERS):
        return "collection_or_category"
    if any(marker in seller_l for marker in REFERENCE_SELLER_MARKERS):
        return "reference_row"
    if "kitco" in host:
        return "live_reference_page"
    if (
        "/products/" in path
        or re.search(r"/p/v-[^/]+", path)
        or path.endswith(".html")
        or "/unisex/" in path
        or (host == "quince.com" and path.startswith("/women/") and "/jewelry/" not in path)
    ):
        return "product_page_like"
    return "other_page"


def row_is_non_ring(row: dict) -> bool:
    text = " ".join(str(row.get(k) or "") for k in ("ring", "ring_type", "source_url")).lower()
    return any(word in text for word in NON_RING_WORDS)


def price_is_present(row: dict) -> bool:
    return any(is_number(row.get(k)) and row.get(k) > 0 for k in PRICE_FIELDS)


def weight_is_present(row: dict) -> bool:
    return any(is_number(row.get(k)) and row.get(k) > 0 for k in WEIGHT_FIELDS)


def karat_fineness(karat) -> float | None:
    match = re.search(r"\b(10|14|18|24)K\b", str(karat or "").upper())
    return int(match.group(1)) / 24 if match else None


def compare_numbers(a, b, tolerance: float) -> bool:
    return is_number(a) and is_number(b) and abs(a - b) <= tolerance


def add_flag(flags: list[str], flag: str) -> None:
    if flag not in flags:
        flags.append(flag)


def validate_date(value, flags: list[str], errors: list[str], row_id: str) -> None:
    if not isinstance(value, str):
        errors.append(f"{row_id}: verified_on is not a string")
        return
    try:
        parsed = dt.date.fromisoformat(value)
    except ValueError:
        errors.append(f"{row_id}: invalid verified_on date {value!r}")
        return
    if parsed < MIN_VERIFIED_DATE:
        add_flag(flags, "verified_date_before_2026")
    if parsed > TODAY:
        add_flag(flags, "verified_date_in_future")


def validate_row(row: dict, evidence: dict, evidence_name: str, duplicate_urls: set[str], external_check: dict | None = None) -> tuple[list[str], list[str]]:
    flags: list[str] = []
    errors: list[str] = []
    row_id = str(row.get("id") or evidence_name)

    for field in REQUIRED_FIELDS:
        if not nonempty(evidence.get(field)):
            errors.append(f"{row_id}: evidence missing required field {field}")

    url = evidence.get("source_url")
    parsed = urlparse(url or "")
    if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password:
        errors.append(f"{row_id}: source_url must be an https URL without credentials")
    if url in duplicate_urls:
        add_flag(flags, "duplicate_source_url")

    if not nonempty(evidence.get("source_label")):
        add_flag(flags, "missing_source_label")
    if not nonempty(evidence.get("verified_on")):
        errors.append(f"{row_id}: evidence missing verified_on")
    else:
        validate_date(evidence["verified_on"], flags, errors, row_id)

    if not price_is_present(row):
        add_flag(flags, "price_not_published_in_catalog")
    if not weight_is_present(row):
        add_flag(flags, "weight_not_published_in_catalog")
    if row_is_non_ring(row):
        add_flag(flags, "non_ring_or_reference_item_heuristic")

    kind = source_kind(url or "", row.get("seller", ""))
    if external_check and external_check.get("result") == "mismatch":
        add_flag(flags, "live_source_mismatch")

    if kind == "third_party_or_marketplace":
        add_flag(flags, "third_party_or_marketplace_source")
    elif kind == "collection_or_category":
        add_flag(flags, "collection_or_category_source")
    elif kind in {"reference_row", "live_reference_page"}:
        add_flag(flags, "reference_or_live_page_not_product")
    elif kind == "other_page":
        add_flag(flags, "source_not_identified_as_product_page")

    # Recompute only values that have enough catalog inputs.  No values are
    # filled in by this audit.
    weight = row.get("weight_g")
    fineness = karat_fineness(row.get("karat"))
    raw_gold = row.get("raw_gold_g")
    if fineness is not None and is_number(weight) and is_number(raw_gold):
        if not compare_numbers(raw_gold, weight * fineness, 0.02):
            errors.append(f"{row_id}: raw_gold_g does not match weight_g and karat")
    if is_number(raw_gold) and is_number(row.get("raw_gold_oz")):
        if not compare_numbers(row["raw_gold_oz"], raw_gold / OZ_TO_G, 0.0002):
            errors.append(f"{row_id}: raw_gold_oz does not match raw_gold_g")
    if is_number(row.get("price_usd")) and is_number(raw_gold) and raw_gold > 0:
        if is_number(row.get("price_per_gold_g")) and not compare_numbers(row["price_per_gold_g"], row["price_usd"] / raw_gold, 2.0):
            errors.append(f"{row_id}: price_per_gold_g does not match price_usd/raw_gold_g")
        if is_number(row.get("raw_gold_oz")) and row["raw_gold_oz"] > 0 and is_number(row.get("price_per_gold_oz")):
            if not compare_numbers(row["price_per_gold_oz"], row["price_usd"] / row["raw_gold_oz"], 15.0):
                errors.append(f"{row_id}: price_per_gold_oz does not match price_usd/raw_gold_oz")

    return flags, errors


def load_catalog() -> tuple[list[dict], list[str], dict[str, dict], dict[str, list[str]]]:
    errors: list[str] = []
    try:
        master = read_json(MASTER_PATH)
    except Exception as exc:  # pragma: no cover - exercised by a broken checkout
        return [], [f"cannot read {MASTER_PATH}: {exc}"], {}, {}
    if not isinstance(master, list):
        return [], ["data/rings.json must contain a JSON array"], {}, {}

    evidence: dict[str, dict] = {}
    for path in sorted(EVIDENCE_DIR.glob("*.json")):
        if path.name.startswith("_"):
            continue
        try:
            value = read_json(path)
            if not isinstance(value, dict):
                errors.append(f"{path}: evidence file must contain a JSON object")
            else:
                evidence[path.name] = value
        except Exception as exc:
            errors.append(f"{path}: invalid JSON: {exc}")

    by_file: dict[str, dict] = {}
    for row in master:
        if not isinstance(row, dict):
            errors.append("data/rings.json contains a non-object row")
            continue
        row_id = str(row.get("id") or "<missing id>")
        file_value = row.get("file")
        if not isinstance(file_value, str) or not file_value.startswith("data/evidence/"):
            errors.append(f"{row_id}: file must point to data/evidence/")
            continue
        name = Path(file_value).name
        if name in by_file:
            errors.append(f"duplicate compiled file: {file_value}")
        by_file[name] = row
        if name not in evidence:
            errors.append(f"{row_id}: missing evidence file {name}")
        else:
            for key, value in evidence[name].items():
                if row.get(key) != value:
                    errors.append(f"{row_id}: compiled value for {key} differs from {name}")

    expected_names = set(by_file)
    actual_names = set(evidence)
    for name in sorted(actual_names - expected_names):
        errors.append(f"evidence file {name} is not represented in data/rings.json")

    try:
        docs_master = read_json(DOCS_MASTER_PATH)
        if docs_master != master:
            errors.append("docs/data/rings.json differs from data/rings.json")
    except Exception as exc:
        errors.append(f"cannot read {DOCS_MASTER_PATH}: {exc}")

    # The public docs copy must not silently diverge from the evidence copy.
    docs_evidence_dir = ROOT / "docs" / "data" / "evidence"
    for name in sorted(actual_names):
        docs_path = docs_evidence_dir / name
        if not docs_path.exists():
            errors.append(f"docs evidence is missing {name}")
        else:
            try:
                if read_json(docs_path) != evidence[name]:
                    errors.append(f"docs evidence differs for {name}")
            except Exception as exc:
                errors.append(f"docs evidence {name} is invalid: {exc}")

    ids = [row.get("id") for row in master if isinstance(row, dict)]
    if len(ids) != len(set(ids)):
        errors.append("duplicate id in data/rings.json")

    urls: defaultdict[str, list[str]] = defaultdict(list)
    for row in master:
        if isinstance(row, dict) and isinstance(row.get("source_url"), str):
            urls[row["source_url"]].append(str(row.get("id")))
    duplicate_urls = {url for url, ids_for_url in urls.items() if len(ids_for_url) > 1}
    return master, errors, evidence, {url: ids_for_url for url, ids_for_url in urls.items() if len(ids_for_url) > 1}


def build_report() -> tuple[dict, list[str]]:
    rows, errors, evidence, duplicate_groups = load_catalog()
    duplicate_urls = set(duplicate_groups)
    findings = []
    all_flags: Counter[str] = Counter()

    external_checks: dict[str, dict] = {}
    if SOURCE_CHECKS_PATH.exists():
        try:
            source_check_doc = read_json(SOURCE_CHECKS_PATH)
            try:
                if read_json(DOCS_SOURCE_CHECKS_PATH) != source_check_doc:
                    errors.append("docs/data/source_checks.json differs from data/source_checks.json")
            except Exception as exc:
                errors.append(f"cannot read {DOCS_SOURCE_CHECKS_PATH}: {exc}")
            checks = source_check_doc.get("checks", []) if isinstance(source_check_doc, dict) else []
            if not isinstance(checks, list):
                errors.append("data/source_checks.json checks must be an array")
                checks = []
            row_by_id = {str(row.get("id")): row for row in rows if isinstance(row, dict)}
            for check in checks:
                if not isinstance(check, dict) or not check.get("id"):
                    errors.append("data/source_checks.json contains a check without an id")
                    continue
                check_id = str(check["id"])
                if check_id in external_checks:
                    errors.append(f"duplicate source check id: {check_id}")
                external_checks[check_id] = check
                if check_id not in row_by_id:
                    errors.append(f"source check refers to unknown catalog id: {check_id}")
                elif check.get("source_url") != row_by_id[check_id].get("source_url"):
                    errors.append(f"source check URL differs for {check_id}")
        except Exception as exc:
            errors.append(f"cannot read {SOURCE_CHECKS_PATH}: {exc}")
    else:
        errors.append("data/source_checks.json is missing")

    for row in rows:
        evidence_name = Path(str(row.get("file", ""))).name
        evidence_row = evidence.get(evidence_name, {})
        external_check = external_checks.get(str(row.get("id")))
        flags, row_errors = validate_row(row, evidence_row, evidence_name, duplicate_urls, external_check)
        errors.extend(row_errors)
        all_flags.update(flags)
        findings.append(
            {
                "id": row.get("id"),
                "evidence_file": row.get("file"),
                "ring": row.get("ring"),
                "seller": row.get("seller"),
                "karat": row.get("karat"),
                "ring_size": row.get("ring_size"),
                "weight_g": row.get("weight_g") if row.get("weight_g") is not None else row.get("weight_g_total"),
                "price_usd": row.get("price_usd") if row.get("price_usd") is not None else row.get("price_usd_from"),
                "price_usd_from": row.get("price_usd_from"),
                "price_usd_to": row.get("price_usd_to"),
                "price_per_gold_oz": row.get("price_per_gold_oz"),
                "source_url": row.get("source_url"),
                "source_label": row.get("source_label"),
                "verified_on": row.get("verified_on"),
                "source_kind_heuristic": source_kind(row.get("source_url", ""), row.get("seller", "")),
                "external_source_check": external_check,
                "flags": flags,
                "static_errors": row_errors,
                "repo_evidence_url": f"https://github.com/buffedlizard55-lab/GOLD/blob/{REPO_BRANCH}/" + str(row.get("file", "")),
            }
        )

    rows_with_weight = sum(weight_is_present(row) for row in rows)
    rows_with_price = sum(price_is_present(row) for row in rows)
    rows_with_gold_math = sum(is_number(row.get("raw_gold_g")) for row in rows)
    sellers = sorted({row.get("seller") for row in rows if row.get("seller")})
    flagged = sum(bool(item["flags"]) for item in findings)
    report = {
        "generated_on": TODAY.isoformat(),
        "audit": "static_integrity_and_source_link_review",
        "audit_basis": [
            "JSON was parsed line by line and required fields were checked.",
            "The compiled catalog was compared with every evidence JSON field and with the public docs copy.",
            "Existing gold-content and price-per-gold arithmetic was recomputed where inputs were present.",
            "URLs were checked for HTTPS shape and classified with conservative path/hostname heuristics.",
            "Targeted page observations, when present, are copied into data/source_checks.json; they are not an exhaustive live crawl.",
        ],
        "important_limitation": "This report does not fetch retailer pages and therefore does not certify that a live page still matches any catalog value. Open each source_url for manual review before relying on price, weight, karat, availability, or product identity.",
        "summary": {
            "catalog_rows": len(rows),
            "seller_names": len(sellers),
            "rows_with_weight": rows_with_weight,
            "rows_without_weight": len(rows) - rows_with_weight,
            "rows_with_price": rows_with_price,
            "rows_without_price": len(rows) - rows_with_price,
            "rows_with_raw_gold_math": rows_with_gold_math,
            "rows_with_any_static_flag": flagged,
            "duplicate_source_url_groups": len(duplicate_groups),
            "external_source_checks": len(external_checks),
            "external_source_mismatches": sum(check.get("result") == "mismatch" for check in external_checks.values()),
            "static_error_count": len(errors),
            "flag_counts": dict(sorted(all_flags.items())),
        },
        "flag_definitions": {
            "duplicate_source_url": "More than one catalog row points to the exact same URL; confirm whether these are variants or accidental duplicates.",
            "price_not_published_in_catalog": "No numeric price_usd, price_usd_from, or price_usd_to was stored.",
            "weight_not_published_in_catalog": "No numeric weight_g or weight_g_total was stored.",
            "non_ring_or_reference_item_heuristic": "The row text contains a non-ring jewelry term; this is a review cue, not a final classification.",
            "third_party_or_marketplace_source": "The URL hostname is a marketplace or publication rather than the named seller; it may not be an official product source.",
            "collection_or_category_source": "The URL path looks like a collection/category page rather than a unique product page.",
            "reference_or_live_page_not_product": "The row appears to be reference/live pricing content rather than a product listing.",
            "source_not_identified_as_product_page": "The URL did not match the conservative product-page heuristic.",
            "live_source_mismatch": "A targeted official-page check found a current-page difference from the stored value; read the external_source_check observations.",
        },
        "external_source_checks": [external_checks[key] for key in sorted(external_checks)],
        "entries": findings,
    }
    return report, errors


def money(value) -> str:
    if not is_number(value):
        return "—"
    return "$" + f"{value:,.2f}"


def number(value, suffix="") -> str:
    return (f"{value:,.2f}{suffix}" if is_number(value) else "—")


def render_sources_page(report: dict, for_docs: bool) -> str:
    asset_prefix = "" if for_docs else "docs/"
    home_href = "index.html"
    report_href = "data/review_report.json" if for_docs else "data/review_report.json"
    summary = report["summary"]
    rows_html = []
    for index, item in enumerate(report["entries"], 1):
        flags = item["flags"]
        flag_html = " ".join(
            f'<span class="review-flag">{html.escape(flag.replace("_", " "))}</span>' for flag in flags
        ) or '<span class="review-ok">No static flags</span>'
        row_class = " flagged" if flags else ""
        anchor = html.escape(str(item.get("id") or "row-" + str(index)))
        source = html.escape(str(item.get("source_url") or ""), quote=True)
        repo = html.escape(str(item.get("repo_evidence_url") or ""), quote=True)
        check = item.get("external_source_check")
        check_html = ""
        if check:
            result = html.escape(str(check.get("result") or "unknown").replace("_", " "))
            check_class = " check-mismatch" if check.get("result") == "mismatch" else " check-supported"
            observations = "".join(f"<li>{html.escape(str(observation))}</li>" for observation in check.get("observations", []))
            check_html = f'<details class="source-check{check_class}"><summary>Targeted check: {result}</summary><ul>{observations}</ul><p>{html.escape(str(check.get("action_taken") or ""))}</p></details>'
        rows_html.append(
            f'<tr id="{anchor}" class="{row_class}">'
            f'<td class="num">{index}</td>'
            f'<td><strong>{html.escape(str(item.get("ring") or "—"))}</strong><br><span class="muted">{html.escape(str(item.get("evidence_file") or ""))}</span></td>'
            f'<td>{html.escape(str(item.get("seller") or "—"))}</td>'
            f'<td>{html.escape(str(item.get("karat") or "—"))}</td>'
            f'<td class="num">{number(item.get("weight_g"), " g")}</td>'
            f'<td class="num">{money(item.get("price_usd"))}</td>'
            f'<td class="num">{money(item.get("price_per_gold_oz"))}</td>'
            f'<td class="flags">{flag_html}</td>'
            f'<td><a class="source-link" href="{source}" target="_blank" rel="noopener noreferrer">Open source ↗</a><br><a class="repo-link" href="{repo}" target="_blank" rel="noopener noreferrer">Evidence JSON</a>{check_html}</td>'
            "</tr>"
        )

    flag_summary = " ".join(
        f'<span class="summary-chip">{html.escape(k.replace("_", " "))}: {v}</span>' for k, v in summary["flag_counts"].items()
    ) or '<span class="summary-chip">No static flags</span>'
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GOLD — Source Review Index</title>
  <link rel="stylesheet" href="{asset_prefix}styles.css">
  <style>
    .review-page {{ max-width: 1700px; margin: 0 auto; padding: 24px; }}
    .review-head {{ display:flex; justify-content:space-between; gap:16px; align-items:flex-start; flex-wrap:wrap; }}
    .review-head h1 {{ margin:0; color:var(--gold-dark); }}
    .review-head p {{ max-width: 850px; color:var(--text-2); }}
    .review-nav a {{ margin-right:12px; }}
    .review-notice {{ background:#fffbeb; border:1px solid #f6d365; border-radius:8px; padding:14px 16px; margin:16px 0; color:#5f4700; }}
    .review-summary {{ display:flex; flex-wrap:wrap; gap:8px; margin:12px 0 18px; }}
    .summary-chip {{ background:#f5f5f0; border:1px solid var(--border); border-radius:999px; padding:5px 10px; font-size:.8rem; }}
    .review-table-wrap {{ overflow:auto; background:var(--card); border:1px solid var(--border); border-radius:10px; box-shadow:var(--shadow); }}
    .review-table {{ width:100%; border-collapse:collapse; min-width:1250px; font-size:.82rem; }}
    .review-table th {{ position:sticky; top:0; background:#f5f5f0; text-align:left; padding:10px; border-bottom:2px solid var(--border); white-space:nowrap; }}
    .review-table td {{ padding:9px 10px; border-bottom:1px solid var(--border-light); vertical-align:top; }}
    .review-table tr.flagged {{ background:#fffdf4; }}
    .num {{ font-family:var(--mono); white-space:nowrap; }}
    .muted {{ color:var(--text-3); font-size:.72rem; overflow-wrap:anywhere; }}
    .flags {{ max-width:300px; }}
    .review-flag {{ display:inline-block; background:#fff1f2; color:#9f1239; border:1px solid #fecdd3; border-radius:4px; padding:2px 5px; margin:1px 2px 1px 0; font-size:.68rem; }}
    .review-ok {{ color:var(--green); font-size:.75rem; }}
    .repo-link {{ font-size:.7rem; color:var(--text-3); }}
    .source-check {{ margin-top:6px; font-size:.7rem; max-width:260px; }}
    .source-check summary {{ cursor:pointer; font-weight:700; }}
    .check-mismatch summary {{ color:#9f1239; }}
    .check-supported summary {{ color:var(--green); }}
    .source-check ul {{ margin:5px 0; padding-left:17px; }}
    .source-check p {{ margin:4px 0; color:var(--text-2); }}
    .review-foot {{ color:var(--text-3); font-size:.8rem; margin-top:16px; }}
  </style>
</head>
<body>
  <header class="header"><div class="container header-inner">
    <div class="brand"><div class="brand-logo">Au</div><div><div class="brand-title">GOLD</div><div class="brand-sub">Source Review Index</div></div></div>
    <div class="review-nav"><a class="btn btn-gold" href="{home_href}">← Catalog</a><a class="btn" href="{report_href}">Raw audit JSON</a></div>
  </div></header>
  <main class="review-page">
    <div class="review-head"><div><h1>Source links for manual review</h1><p>Every catalog row is listed below with its stored source URL and repository evidence file. The static audit checks repository integrity and arithmetic only; it does not certify that a live retailer page still matches the stored price, weight, karat, or availability.</p></div></div>
    <div class="review-notice"><strong>Do not treat this report as live pricing.</strong> Open the source link in each row before purchase. Rows with missing values, duplicate URLs, collection pages, non-ring terms, or non-seller domains are explicitly flagged instead of being filled with guesses.</div>
    <div class="review-summary">
      <span class="summary-chip"><strong>{summary["catalog_rows"]}</strong> catalog rows</span>
      <span class="summary-chip"><strong>{summary["seller_names"]}</strong> seller names</span>
      <span class="summary-chip"><strong>{summary["rows_with_weight"]}</strong> rows with weight</span>
      <span class="summary-chip"><strong>{summary["rows_with_price"]}</strong> rows with price</span>
      <span class="summary-chip"><strong>{summary["duplicate_source_url_groups"]}</strong> duplicate URL groups</span>
      <span class="summary-chip"><strong>{summary["rows_with_any_static_flag"]}</strong> rows with flags</span>
    </div>
    <div class="review-summary">{flag_summary}</div>
    <div class="review-table-wrap"><table class="review-table"><thead><tr><th>#</th><th>Catalog item / evidence file</th><th>Seller</th><th>Karat</th><th>Weight</th><th>Price</th><th>Calc. $/gold oz</th><th>Static review flags</th><th>Source / repo links</th></tr></thead><tbody>{''.join(rows_html)}</tbody></table></div>
    <p class="review-foot">Generated {html.escape(report["generated_on"])} from <code>data/rings.json</code> and <code>data/evidence/*.json</code>. <a href="{report_href}">Download the complete machine-readable report</a>.</p>
  </main>
</body></html>
'''


def write_reports(report: dict) -> None:
    serialized = json.dumps(report, indent=2, ensure_ascii=False) + "\n"
    REPORT_PATH.write_text(serialized, encoding="utf-8")
    DOCS_REPORT_PATH.write_text(serialized, encoding="utf-8")
    DOCS_SOURCE_CHECKS_PATH.write_text(SOURCE_CHECKS_PATH.read_text(encoding="utf-8"), encoding="utf-8")
    ROOT_SOURCE_PAGE.write_text(render_sources_page(report, for_docs=False), encoding="utf-8")
    DOCS_SOURCE_PAGE.write_text(render_sources_page(report, for_docs=True), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="exit 1 when static integrity errors are found")
    parser.add_argument("--no-write", action="store_true", help="do not write the report or source pages")
    args = parser.parse_args()

    report, errors = build_report()
    if not args.no_write:
        write_reports(report)

    summary = report["summary"]
    print("==> GOLD static audit and source-link review")
    print(f"    catalog rows: {summary['catalog_rows']}")
    print(f"    rows with stored weight: {summary['rows_with_weight']}")
    print(f"    rows with stored price: {summary['rows_with_price']}")
    print(f"    rows with static flags: {summary['rows_with_any_static_flag']}")
    print(f"    duplicate source URL groups: {summary['duplicate_source_url_groups']}")
    print(f"    targeted official-page checks: {summary['external_source_checks']}")
    print(f"    targeted live mismatches: {summary['external_source_mismatches']}")
    print(f"    static errors: {len(errors)}")
    for key, value in summary["flag_counts"].items():
        print(f"    flag {key}: {value}")
    if errors:
        print("\nSTATIC ERRORS:")
        for error in errors:
            print(f"  - {error}")
    else:
        print("\n==> Static integrity checks passed.")
        print("    This is not a live product-page verification; use sources.html for manual source review.")
    return 1 if args.check and errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
