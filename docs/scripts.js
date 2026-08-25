/* scripts.js — runs in the browser, does only math + table rendering.
   Deliberately does NOT call out to any price API. The user pastes the
   spot price themselves. That's the no-hallucination contract. */

const EVIDENCE_FILES = [
  { path: "data/evidence/nivea_cushion_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/stella_round_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/vera_round_14k_wg.json", category: "Standard Retail" },
  { path: "data/evidence/kendra_emerald_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/stella_radiant_14k_wg.json", category: "Standard Retail" },
  { path: "data/evidence/alessia_oval_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/siena_round_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/kenzie_oval_14k_wg.json", category: "Standard Retail" },
  { path: "data/evidence/sadie_round_18k_yg.json", category: "High Transparency" },
  { path: "data/evidence/milena_round_18k_yg.json", category: "High Transparency" },
  { path: "data/evidence/quinn_round_18k_yg.json", category: "Standard Retail" },
  { path: "data/evidence/stella_marquise_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/elodie_oval_18k_yg.json", category: "High Transparency" },
  { path: "data/evidence/ottilie_round_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/jasmine_round_18k_wg.json", category: "High Transparency" },
  { path: "data/evidence/priya_pear_18k_wg.json", category: "High Transparency" },
  { path: "data/evidence/jasmine_emerald_18k_wg.json", category: "High Transparency" },
  { path: "data/evidence/evelyn_round_18k_wg.json", category: "High Transparency" },
  { path: "data/evidence/cordelia_round_18k_wg.json", category: "Standard Retail" },
  { path: "data/evidence/bella_round_18k_yg.json", category: "High Transparency" },
  { path: "data/evidence/maude_oval_18k_yg.json", category: "High Transparency" },
  { path: "data/evidence/elyse_round_18k_yg.json", category: "High Transparency" },
  { path: "data/evidence/ora_round_18k_yg.json", category: "High Transparency" },
  { path: "data/evidence/amata_oval_18k_yg.json", category: "High Transparency" },
  { path: "data/evidence/iris_marquise_18k_yg.json", category: "Standard Retail" },
  { path: "data/evidence/priya_round_platinum.json", category: "High Transparency" },
  { path: "data/evidence/valentina_oval_platinum.json", category: "High Transparency" },
  { path: "data/evidence/maude_marquise_platinum.json", category: "High Transparency" },
  { path: "data/evidence/jaclyn_asscher_platinum.json", category: "Standard Retail" },
  { path: "data/evidence/jasmine_pear_platinum.json", category: "High Transparency" },
  { path: "data/evidence/kendra_marquise_platinum.json", category: "High Transparency" },
  { path: "data/evidence/stephie_marquise_platinum.json", category: "High Transparency" },
  { path: "data/evidence/juno_round_platinum.json", category: "High Transparency" },
  { path: "data/evidence/siena_pear_platinum.json", category: "Standard Retail" },
  { path: "data/evidence/ottilie_cushion_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/milena_cushion_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/remi_cushion_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/tallulah_cushion_14k_wg.json", category: "Standard Retail" },
  { path: "data/evidence/ciara_cushion_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/jaclyn_cushion_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/evelyn_princess_14k_wg.json", category: "Standard Retail" },
  { path: "data/evidence/kat_princess_14k_wg.json", category: "Standard Retail" },
  { path: "data/evidence/maddie_princess_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/milena_princess_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/kendra_princess_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/alessia_princess_14k_wg.json", category: "Standard Retail" },
  { path: "data/evidence/hailey_princess_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/anais_emerald_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/flora_emerald_14k_wg.json", category: "Standard Retail" },
  { path: "data/evidence/callista_emerald_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/cordelia_emerald_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/kat_emerald_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/evelyn_asscher_14k_wg.json", category: "Standard Retail" },
  { path: "data/evidence/endless_love_asscher_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/lina_asscher_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/callista_round_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/agapi_round_14k_wg.json", category: "Standard Retail" },
  { path: "data/evidence/jaclyn_round_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/dara_round_14k_wg.json", category: "Standard Retail" },
  { path: "data/evidence/priya_oval_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/silvia_round_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/carmen_round_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/olympia_round_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/sadie_emerald_18k_yg.json", category: "Standard Retail" },
  { path: "data/evidence/elodie_emerald_18k_yg.json", category: "High Transparency" },
  { path: "data/evidence/milena_cushion_18k_yg.json", category: "Standard Retail" },
  { path: "data/evidence/sybil_cushion_18k_yg.json", category: "Standard Retail" },
  { path: "data/evidence/cordelia_round_18k_wg_2.json", category: "High Transparency" },
  { path: "data/evidence/ciara_emerald_18k_wg.json", category: "High Transparency" },
  { path: "data/evidence/amata_round_18k_wg.json", category: "Standard Retail" },
  { path: "data/evidence/ciara_round_18k_wg.json", category: "Standard Retail" },
  { path: "data/evidence/juno_round_18k_wg.json", category: "Standard Retail" },
  { path: "data/evidence/lia_round_18k_wg.json", category: "Standard Retail" },
  { path: "data/evidence/evelyn_oval_18k_wg.json", category: "Standard Retail" },
  { path: "data/evidence/jaclyn_platinum_round.json", category: "High Transparency" },
  { path: "data/evidence/stella_platinum_pear.json", category: "High Transparency" },
  { path: "data/evidence/elodie_platinum_round.json", category: "High Transparency" },
  { path: "data/evidence/kendra_platinum_round.json", category: "Standard Retail" },
  { path: "data/evidence/elyse_platinum_round.json", category: "High Transparency" },
  { path: "data/evidence/quinn_platinum_round.json", category: "Standard Retail" },
  { path: "data/evidence/delia_platinum_round.json", category: "High Transparency" },
  { path: "data/evidence/alessia_platinum_oval.json", category: "High Transparency" },
  { path: "data/evidence/milena_platinum_oval.json", category: "Standard Retail" },
  { path: "data/evidence/nivea_platinum_oval.json", category: "Standard Retail" },
  { path: "data/evidence/vera_platinum_oval.json", category: "Standard Retail" },
  { path: "data/evidence/amara_platinum_oval.json", category: "Standard Retail" },
  { path: "data/evidence/althea_platinum_pear.json", category: "High Transparency" },
  { path: "data/evidence/elyse_platinum_marquise.json", category: "High Transparency" },
  { path: "data/evidence/siena_radiant_14k_wg.json", category: "Standard Retail" },
  { path: "data/evidence/kendra_radiant_14k_wg.json", category: "High Transparency" },
  { path: "data/evidence/carmen_radiant_14k_wg.json", category: "Standard Retail" },
  { path: "data/evidence/stella_round_18k_yg.json", category: "Standard Retail" },
  { path: "data/evidence/sadie_oval_18k_yg.json", category: "Standard Retail" },
  { path: "data/evidence/ottilie_oval_18k_yg.json", category: "Standard Retail" },
  { path: "data/evidence/elyse_oval_18k_yg.json", category: "Standard Retail" },
  { path: "data/evidence/automic_gold_rainbow_band_2.json", category: "Standard Retail" },
  { path: "data/evidence/automic_gold_salt_and_pepper_spinner.json", category: "High Transparency" },
  { path: "data/evidence/sabrina_14k_gold_birthstone.json", category: "Standard Retail" },
  // --- Investment Grade (24K) ---
  { path: "data/evidence/mene_narrow_band_24k.json", category: "Investment (24K)" },
  { path: "data/evidence/mene_narrow_classic_band_24k_size_45.json", category: "Investment (24K)" },
  { path: "data/evidence/mene_narrow_classic_band_24k_engraved_size_45.json", category: "Investment (24K)" },
  { path: "data/evidence/mene_narrow_flat_band_24k_size_45.json", category: "Investment (24K)" },
  { path: "data/evidence/mene_classic_band_24k_size_45.json", category: "Investment (24K)" },
  { path: "data/evidence/mene_flat_band_24k_size_45.json", category: "Investment (24K)" },
  { path: "data/evidence/mene_wide_classic_band_24k_size_45.json", category: "Investment (24K)" },
  { path: "data/evidence/mene_wide_flat_band_24k_size_45.json", category: "Investment (24K)" },
  { path: "data/evidence/7879_wide_ring_24k.json", category: "Investment (24K)" },
  { path: "data/evidence/7879_signet_ring_24k.json", category: "Investment (24K)" },
  { path: "data/evidence/7879_stacker_ring_24k.json", category: "Investment (24K)" },

  // --- High Transparency (Weight Published) ---
  { path: "data/evidence/automic_gold_tiger_eye_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_sakura_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_claddagh_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_gemstone_claddagh_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_claddagh_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_transformation_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_smoky_quartz_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_engraved_star_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_baguette_rect_signet_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_cloud_diamond_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_pine_bird_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_oval_signet_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_milgrain_diamond_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_open_curvy_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_branch_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_crashing_waves_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_liquid_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_gemstone_signet_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_hexagon_signet_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_chevron_leaves_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_industrial_wood_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_mix_mirror_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_hammered_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_curvy_bee_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_gothic_initial_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_bee_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_mix_raw_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_bezel_gemstone_bar_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_curvy_mirror_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_curvy_matte_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_industrial_hammered_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_diamond_chevron_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_chevron_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_opal_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_gemstone_bar_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_bar_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_mix_stardust_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_curvy_hammered_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_diamond_cluster_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_filigree_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_chevron_filigree_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_rope_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_double_leaves_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_gemstone_industrial_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_rainbow_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_mini_miami_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_zig_zag_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_figaro_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_thick_cable_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_cable_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_curb_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/ritani_agnes_14k_white_knife_edge.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_open_filigree_chevron_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_hexagon_diamond_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_mix_organic_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/ritani_elodie_14k_white_classic_solitaire.json", category: "High Transparency" },
  { path: "data/evidence/ritani_nivea_14k_white_oval.json", category: "High Transparency" },
  { path: "data/evidence/ritani_ottilie_14k_white_marquise.json", category: "High Transparency" },
  { path: "data/evidence/ritani_lily_14k_white_princess.json", category: "High Transparency" },
  { path: "data/evidence/ritani_cordelia_14k_white_pear.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_moon_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_industrial_matte_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_thin_filigree_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_snake_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_ouroboros_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_gemstone_ouroboros_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_sun_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_sun_moon_stars_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/ritani_anais_14k_white_twisted_solitaire.json", category: "High Transparency" },
  { path: "data/evidence/ritani_kenzie_14k_white_braided.json", category: "High Transparency" },
  { path: "data/evidence/ritani_kendra_14k_white_cathedral_tulip.json", category: "High Transparency" },
  { path: "data/evidence/ritani_milena_14k_white_radiant.json", category: "High Transparency" },
  { path: "data/evidence/ritani_nivea_14k_white_cushion.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_bead_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_mountains_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_inlay_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_rainbow_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_alexandrite_cluster_14k.json", category: "High Transparency" },
  { path: "data/evidence/ritani_siena_14k_white_cathedral.json", category: "High Transparency" },
  { path: "data/evidence/ritani_priya_14k_white_diamond_collar.json", category: "High Transparency" },
  { path: "data/evidence/costco_18k_4mm_comfort_fit_band.json", category: "High Transparency" },
  { path: "data/evidence/costco_2_5mm_high_polish_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/costco_2_5mm_diamond_cut_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_heart_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_moissanite_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/ritani_elyse_18k_yellow_classic_solitaire.json", category: "High Transparency" },
  { path: "data/evidence/ritani_milena_18k_yellow_knife_edge.json", category: "High Transparency" },
  { path: "data/evidence/ritani_elodie_18k_yellow_classic_solitaire.json", category: "High Transparency" },
  { path: "data/evidence/ritani_silvia_14k_white_embellished_prong.json", category: "High Transparency" },
  { path: "data/evidence/ritani_nivea_18k_yellow_petal_solitaire.json", category: "High Transparency" },
  { path: "data/evidence/ritani_lily_14k_white_tulip_cathedral.json", category: "High Transparency" },
  { path: "data/evidence/ritani_rita_14k_white_micropave.json", category: "High Transparency" },
  { path: "data/evidence/costco_4mm_comfort_fit_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/costco_5mm_comfort_fit_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/costco_6mm_comfort_fit_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_line_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_shimmer_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_wave_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_signet_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/automic_gold_beveled_edge_band_14k.json", category: "High Transparency" },
  { path: "data/evidence/ritani_alida_14k_white_solitaire.json", category: "High Transparency" },
  { path: "data/evidence/ritani_sia_18k_white_shared_prong.json", category: "High Transparency" },
  { path: "data/evidence/ritani_ciara_14k_white_split_double.json", category: "High Transparency" },
  { path: "data/evidence/ritani_amata_18k_yellow_trellis.json", category: "High Transparency" },
  { path: "data/evidence/ritani_ora_18k_yellow_petal_head.json", category: "High Transparency" },
  { path: "data/evidence/quince_low_dome_band_3mm_14k.json", category: "High Transparency" },
  { path: "data/evidence/avariah_2mm_half_round_14k_yellow_size_45.json", category: "High Transparency" },
  { path: "data/evidence/quince_4mm_dome_band_14k_yellow.json", category: "High Transparency" },
  { path: "data/evidence/quince_4mm_dome_band_14k_white.json", category: "High Transparency" },
  { path: "data/evidence/quince_6mm_dome_band_14k_yellow.json", category: "High Transparency" },
  { path: "data/evidence/jewelryweb_4mm_plain_band_14k_yellow_size_45.json", category: "High Transparency" },
  { path: "data/evidence/saris_things_2mm_half_round_14k_yellow_size_45.json", category: "High Transparency" },
  { path: "data/evidence/oradina_1956_curb_link_14k.json", category: "High Transparency" },
  { path: "data/evidence/debebians_personalized_name_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/debebians_monogram_ring_14k.json", category: "High Transparency" },
  { path: "data/evidence/debebians_ring_weight_chart_14k.json", category: "Benchmark" },
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
  { path: "data/evidence/quince_classic_band_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_diamond_wedding_band_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_diamond_line_ring_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_twist_ring_14k.json", category: "Standard Retail" },
  { path: "data/evidence/zales_3mm_flat_square_wedding_band_14k.json", category: "Standard Retail" },
  { path: "data/evidence/zales_4mm_low_dome_wedding_band_14k.json", category: "Standard Retail" },
  { path: "data/evidence/zales_5mm_low_dome_wedding_band_14k.json", category: "Standard Retail" },
  { path: "data/evidence/zales_4_5mm_beveled_wedding_band_14k.json", category: "Standard Retail" },
  { path: "data/evidence/kay_wedding_band_14k_yellow_2mm.json", category: "Standard Retail" },
  { path: "data/evidence/jared_wedding_band_14k_yellow_2mm.json", category: "Standard Retail" },
  { path: "data/evidence/quince_stacker_ring_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_beaded_ring_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_wishbone_ring_14k.json", category: "Standard Retail" },
  { path: "data/evidence/oradina_after_hours_14k.json", category: "Standard Retail" },
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
  { path: "data/evidence/quince_bezel_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_circle_eternity_band_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_ridge_band_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_diamond_bezel_eternity_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_pave_slim_signet_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_diamond_bezel_open_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_3_stone_tapered_band_14k.json", category: "Standard Retail" },
  { path: "data/evidence/zales_baguette_diamond_wedding_band_14k.json", category: "Standard Retail" },
  { path: "data/evidence/catbird_mignon_memory_ring_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_diamond_dot_ring_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_pave_diamond_cushion_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_3_stone_inlay_band_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_lab_diamond_petite_pave_1ct.json", category: "Standard Retail" },
  { path: "data/evidence/ritani_dara_14k_white_bezel.json", category: "Standard Retail" },
  { path: "data/evidence/baby_gold_beaded_wishbone_14k.json", category: "Standard Retail" },
  { path: "data/evidence/baby_gold_wire_stacking_14k.json", category: "Standard Retail" },
  { path: "data/evidence/kay_wedding_band_14k_rose_4mm.json", category: "Standard Retail" },
  { path: "data/evidence/kay_wedding_band_14k_white_3mm.json", category: "Standard Retail" },
  { path: "data/evidence/debebians_cigar_monogram_14k.json", category: "High Transparency" },
  { path: "data/evidence/baby_gold_heart_love_knot_14k.json", category: "Standard Retail" },
  { path: "data/evidence/jared_wedding_band_14k_yellow_5mm.json", category: "Standard Retail" },
  { path: "data/evidence/jared_wedding_band_14k_rose_4mm.json", category: "Standard Retail" },
  { path: "data/evidence/jared_flat_wedding_band_14k_white_3mm.json", category: "Standard Retail" },
  { path: "data/evidence/jared_wedding_band_14k_yellow_6mm_textured.json", category: "Standard Retail" },
  { path: "data/evidence/jared_wedding_band_14k_yellow_4mm.json", category: "Standard Retail" },
  { path: "data/evidence/jared_wedding_band_14k_yellow_6mm.json", category: "Standard Retail" },
  { path: "data/evidence/catbird_heart_of_gold_14k.json", category: "Standard Retail" },
  { path: "data/evidence/kay_wedding_band_14k_white_2mm.json", category: "Standard Retail" },
  { path: "data/evidence/kay_wedding_band_14k_rose_2mm.json", category: "Standard Retail" },
  { path: "data/evidence/ritani_petra_14k_white_petal.json", category: "Standard Retail" },
  { path: "data/evidence/zales_1_5mm_rope_wedding_band_14k.json", category: "Standard Retail" },
  { path: "data/evidence/jared_flat_wedding_band_14k_white_2mm.json", category: "Standard Retail" },
  { path: "data/evidence/jared_wedding_band_14k_white_2mm.json", category: "Standard Retail" },
  { path: "data/evidence/ritani_orielle_14k_white_four_prong.json", category: "Standard Retail" },
  { path: "data/evidence/ritani_teya_14k_white_four_prong.json", category: "Standard Retail" },
  { path: "data/evidence/ritani_maude_14k_white_classic_solitaire.json", category: "Standard Retail" },
  { path: "data/evidence/ritani_lia_14k_white_six_prong_petal.json", category: "Standard Retail" },
  { path: "data/evidence/ritani_vera_14k_white_solitaire.json", category: "Standard Retail" },
  { path: "data/evidence/automic_gold_industrial_mirror_band_14k.json", category: "Standard Retail" },
  { path: "data/evidence/helzberg_wedding_band_14k_yellow_6_5mm.json", category: "Standard Retail" },
  { path: "data/evidence/helzberg_mens_bevel_edge_satin_14k_yellow_8mm.json", category: "Standard Retail" },
  { path: "data/evidence/helzberg_wedding_band_14k_rose_2mm.json", category: "Standard Retail" },
  { path: "data/evidence/helzberg_wedding_band_14k_white_5mm.json", category: "Standard Retail" },
  { path: "data/evidence/kay_mens_wedding_band_14k_yellow_3mm.json", category: "Standard Retail" },
  { path: "data/evidence/helzberg_wedding_band_14k_rose_6_5mm.json", category: "Standard Retail" },
  { path: "data/evidence/ritani_juno_14k_white_knife_edge.json", category: "Standard Retail" },
  { path: "data/evidence/baby_gold_open_diamond_14k.json", category: "Standard Retail" },
  { path: "data/evidence/ferkos_double_bezel_open_diamond_14k.json", category: "Standard Retail" },
  { path: "data/evidence/ferkos_starburst_band_14k.json", category: "Standard Retail" },
  { path: "data/evidence/ferkos_slanted_baguette_round_diamond_14k.json", category: "Standard Retail" },
  { path: "data/evidence/ferkos_marquise_round_diamond_14k.json", category: "Standard Retail" },
  { path: "data/evidence/ferkos_slanted_marquise_round_diamond_14k.json", category: "Standard Retail" },
  { path: "data/evidence/ferkos_stackable_vertical_baguette_14k.json", category: "Standard Retail" },
  { path: "data/evidence/ferkos_curved_chevron_stacking_14k.json", category: "Standard Retail" },
  { path: "data/evidence/ferkos_diamond_chevron_14k.json", category: "Standard Retail" },
  { path: "data/evidence/ferkos_stacked_beaded_diamond_14k.json", category: "Standard Retail" },
  { path: "data/evidence/ferkos_marquise_emerald_wedding_band_14k.json", category: "Standard Retail" },
  { path: "data/evidence/ritani_hera_14k_white_petal_head.json", category: "Standard Retail" },
  { path: "data/evidence/ritani_geneva_14k_white_four_prong.json", category: "Standard Retail" },
  { path: "data/evidence/automic_gold_gemstone_branch_14k.json", category: "Standard Retail" },
  { path: "data/evidence/ferkos_emerald_diamond_eternity_14k.json", category: "Standard Retail" },
  { path: "data/evidence/ferkos_infinity_diamond_eternity_14k.json", category: "Standard Retail" },
  { path: "data/evidence/ferkos_clover_ruby_diamond_14k.json", category: "Standard Retail" },
  { path: "data/evidence/ferkos_pear_emerald_diamond_14k.json", category: "Standard Retail" },
  { path: "data/evidence/ferkos_pear_ruby_diamond_14k.json", category: "Standard Retail" },
  { path: "data/evidence/ferkos_pear_ruby_ring_diamonds_14k.json", category: "Standard Retail" },
  { path: "data/evidence/costco_green_quartz_diamond_14k.json", category: "Standard Retail" },
  { path: "data/evidence/costco_round_brilliant_0_75_ctw_14k.json", category: "Standard Retail" },
  { path: "data/evidence/baby_gold_linear_double_name_14k.json", category: "Standard Retail" },
  { path: "data/evidence/baby_gold_linear_name_14k.json", category: "Standard Retail" },
  { path: "data/evidence/baby_gold_custom_name_band_14k.json", category: "Standard Retail" },
  { path: "data/evidence/baby_gold_wishbone_14k.json", category: "Standard Retail" },
  { path: "data/evidence/baby_gold_kyanite_stone_14k.json", category: "Standard Retail" },
  { path: "data/evidence/baby_gold_ruby_oval_eternity_14k.json", category: "Standard Retail" },
  { path: "data/evidence/baby_gold_interlocked_engravable_14k.json", category: "Standard Retail" },
  { path: "data/evidence/baby_gold_domed_eternity_14k.json", category: "Standard Retail" },
  { path: "data/evidence/baby_gold_lucky_seven_diamond_14k.json", category: "Standard Retail" },
  { path: "data/evidence/baby_gold_diamond_wishbone_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_circle_ring_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_diamond_floral_eternity_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_diamond_infinity_band_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_diamond_slanted_marquise_round_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_pave_diamond_gemstone_band_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_pear_diamond_half_eternity_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_diamond_orbit_ring_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_square_edge_stacker_14k.json", category: "Standard Retail" },
  { path: "data/evidence/automic_gold_alexandrite_ring_14k.json", category: "High Transparency" },

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
  { path: "data/evidence/costco_green_quartz_diamond_14k.json", category: "Standard Retail" },
  { path: "data/evidence/costco_round_brilliant_0_75_ctw_14k.json", category: "Standard Retail" },
  { path: "data/evidence/baby_gold_linear_double_name_14k.json", category: "Standard Retail" },
  { path: "data/evidence/baby_gold_linear_name_14k.json", category: "Standard Retail" },
  { path: "data/evidence/baby_gold_custom_name_band_14k.json", category: "Standard Retail" },
  { path: "data/evidence/baby_gold_wishbone_14k.json", category: "Standard Retail" },
  { path: "data/evidence/baby_gold_kyanite_stone_14k.json", category: "Standard Retail" },
  { path: "data/evidence/baby_gold_ruby_oval_eternity_14k.json", category: "Standard Retail" },
  { path: "data/evidence/baby_gold_interlocked_engravable_14k.json", category: "Standard Retail" },
  { path: "data/evidence/baby_gold_domed_eternity_14k.json", category: "Standard Retail" },
  { path: "data/evidence/baby_gold_lucky_seven_diamond_14k.json", category: "Standard Retail" },
  { path: "data/evidence/baby_gold_diamond_wishbone_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_circle_ring_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_diamond_floral_eternity_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_diamond_infinity_band_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_diamond_slanted_marquise_round_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_pave_diamond_gemstone_band_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_pear_diamond_half_eternity_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_diamond_orbit_ring_14k.json", category: "Standard Retail" },
  { path: "data/evidence/quince_square_edge_stacker_14k.json", category: "Standard Retail" },
  { path: "data/evidence/automic_gold_alexandrite_ring_14k.json", category: "High Transparency" },

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
