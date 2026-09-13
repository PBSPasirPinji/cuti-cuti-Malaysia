/* ============================================================================
   JOM CUTI — script.js
   All interactive behaviour. Reads content from window.CONTENT (content.js).
   Organised by feature: navigation, favourites, destinations, things-to-do,
   recommendations, itinerary planner, contact form, and small utilities.
   ========================================================================== */

(function () {
  "use strict";

  const DATA = window.CONTENT;

  /* =========================================================================
     STATE
  ========================================================================= */
  const state = {
    currentPage: "home",
    favourites: new Set(),
    destFilters: { search: "", region: "", stateName: "", categories: new Set(), favOnly: false, sort: "rating" },
    activeThingsCategory: DATA.activityCategories[0].id,
    recFilters: { duration: "", style: "" },
    itinerary: null, // { destinationId, days: [{day, activities:[{uid,title,description,category,timeOfDay,duration}]}] }
    editingActivityUid: null,
    addingActivityForDay: null,
    uidCounter: 1,
  };

  const STORAGE_KEYS = {
    favourites: "jomcuti_favourites",
    itinerary: "jomcuti_itinerary",
  };

  /* =========================================================================
     UTILITIES
  ========================================================================= */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $all = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  function escapeHTML(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[m]));
  }

  function capitalize(str) {
    return String(str).charAt(0).toUpperCase() + String(str).slice(1);
  }

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function nextUid() {
    return "act-" + state.uidCounter++;
  }

  function getDestination(id) {
    return DATA.destinations.find((d) => d.id === id);
  }

  function getCategoryMeta(id) {
    return DATA.activityCategories.find((c) => c.id === id) || DATA.activityCategories[0];
  }

  function debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  function safeLocalStorage() {
    try {
      const k = "__jomcuti_test__";
      window.localStorage.setItem(k, "1");
      window.localStorage.removeItem(k);
      return window.localStorage;
    } catch (e) {
      return null;
    }
  }
  const LS = safeLocalStorage();

  function showToast(message, type) {
    const container = $("#toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast" + (type ? " " + type : "");
    toast.innerHTML = `<svg class="icon icon-sm"><use href="#icon-${type === "error" ? "info" : "check"}"/></svg><span>${escapeHTML(message)}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity .3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /* =========================================================================
     NAVIGATION / ROUTING
  ========================================================================= */
  const VALID_PAGES = ["home", "destinations", "things-to-do", "recommendations", "itinerary", "about", "contact"];

  function navigateTo(page, opts) {
    opts = opts || {};
    if (!VALID_PAGES.includes(page)) page = "home";
    state.currentPage = page;

    $all(".page").forEach((el) => el.classList.toggle("hidden", el.dataset.pageSection !== page));
    $all(".nav-link").forEach((el) => el.classList.toggle("active", el.dataset.page === page));

    if (location.hash.slice(1) !== page) {
      history.replaceState(null, "", "#" + page);
    }

    closeMobileNav();
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (page === "things-to-do") {
      renderThingsToDoPage(opts.category || state.activeThingsCategory);
    }
    if (page === "destinations" && opts.search != null) {
      $("#destSearchInput").value = opts.search;
      state.destFilters.search = opts.search;
      renderDestinationsPage();
    }
    if (page === "destinations" && opts.favOnly) {
      $("#destFavOnly").checked = true;
      state.destFilters.favOnly = true;
      renderDestinationsPage();
    }
  }

  function closeMobileNav() {
    $("#mainNav").classList.remove("open");
    $("#navToggle").setAttribute("aria-expanded", "false");
  }

  function initNavigation() {
    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-page]");
      if (link) {
        e.preventDefault();
        navigateTo(link.dataset.page);
      }
    });

    $("#navToggle").addEventListener("click", () => {
      const nav = $("#mainNav");
      const open = nav.classList.toggle("open");
      $("#navToggle").setAttribute("aria-expanded", String(open));
    });

    window.addEventListener("hashchange", () => {
      const page = location.hash.replace("#", "") || "home";
      navigateTo(page);
    });

    const initial = location.hash.replace("#", "");
    navigateTo(VALID_PAGES.includes(initial) ? initial : "home");
  }

  /* =========================================================================
     FAVOURITES
  ========================================================================= */
  function loadFavourites() {
    if (!LS) return;
    try {
      const raw = JSON.parse(LS.getItem(STORAGE_KEYS.favourites) || "[]");
      state.favourites = new Set(raw);
    } catch (e) {
      state.favourites = new Set();
    }
  }

  function saveFavourites() {
    if (!LS) return;
    LS.setItem(STORAGE_KEYS.favourites, JSON.stringify(Array.from(state.favourites)));
  }

  function toggleFavourite(id) {
    if (state.favourites.has(id)) {
      state.favourites.delete(id);
      showToast("Removed from favourites", "info");
    } else {
      state.favourites.add(id);
      showToast("Added to favourites!", "success");
    }
    saveFavourites();
    updateFavouritesUI();
  }

  function updateFavouritesUI() {
    const count = state.favourites.size;
    const badge = $("#favouritesCount");
    badge.textContent = String(count);
    badge.classList.toggle("hidden", count === 0);

    $all(".fav-btn").forEach((btn) => {
      const active = state.favourites.has(btn.dataset.id);
      btn.classList.toggle("active", active);
    });
  }

  /* =========================================================================
     HOME PAGE
  ========================================================================= */
  function renderHome() {
    $("#heroHeadline").textContent = DATA.siteInfo.heroHeadline;
    $("#heroSubheadline").textContent = DATA.siteInfo.heroSubheadline;
    $("#statDestinations").textContent = DATA.destinations.length;
    $("#statStates").textContent = DATA.states.length;

    renderPopularDestinations();
    renderThingsToDoPreview();
    renderRecommendationsPreview();
    renderTravelTipsPreview();
  }

  function renderPopularDestinations() {
    const featured = DATA.destinations
      .filter((d) => d.featured)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
    $("#popularDestinationsGrid").innerHTML = featured.map(destinationCardHTML).join("");
    bindDestinationCardEvents($("#popularDestinationsGrid"));
  }

  function renderThingsToDoPreview() {
    $("#thingsToDoPreview").innerHTML = DATA.activityCategories
      .map(
        (cat) => `
      <div class="category-card cat-${cat.color}" data-page="things-to-do" data-category="${cat.id}">
        <div class="category-icon"><svg class="icon"><use href="#icon-${cat.icon}"/></svg></div>
        <h3>${escapeHTML(cat.label)}</h3>
        <p>${escapeHTML(cat.description)}</p>
      </div>`
      )
      .join("");

    $all("#thingsToDoPreview .category-card").forEach((card) => {
      card.addEventListener("click", () => {
        state.activeThingsCategory = card.dataset.category;
        navigateTo("things-to-do", { category: card.dataset.category });
      });
    });
  }

  function renderRecommendationsPreview() {
    const picks = DATA.recommendations.slice(0, 3);
    $("#recommendationsPreview").innerHTML = picks.map(recommendationCardHTML).join("");
    bindRecommendationCardEvents($("#recommendationsPreview"));
  }

  function renderTravelTipsPreview() {
    $("#travelTipsPreview").innerHTML = DATA.travelTips.map(tipCardHTML).join("");
  }

  function tipCardHTML(tip) {
    return `
      <div class="tip-card">
        <div class="tip-card-header">
          <svg class="icon"><use href="#icon-${tip.icon}"/></svg>
          <h4>${escapeHTML(tip.title)}</h4>
        </div>
        <p>${escapeHTML(tip.tip)}</p>
      </div>`;
  }

  /* =========================================================================
     DESTINATION CARD (shared: home + destinations page)
  ========================================================================= */
  function destinationCardHTML(dest) {
    const isFav = state.favourites.has(dest.id);
    const primaryTags = dest.tags.slice(0, 3);
    return `
      <article class="dest-card" data-id="${dest.id}">
        <div class="dest-card-image theme-${dest.heroTheme}">
          <svg class="icon"><use href="#icon-${getCategoryMeta(dest.tags[0]).icon}"/></svg>
          <button class="fav-btn ${isFav ? "active" : ""}" data-id="${dest.id}" aria-label="Toggle favourite">
            <svg class="icon"><use href="#icon-heart"/></svg>
          </button>
          <span class="rating-badge"><svg class="icon"><use href="#icon-star"/></svg>${dest.rating.toFixed(1)}</span>
        </div>
        <div class="dest-card-body">
          <h3>${escapeHTML(dest.name)}</h3>
          <div class="dest-card-location"><svg class="icon"><use href="#icon-map-pin"/></svg>${escapeHTML(dest.state)}</div>
          <p class="dest-card-tagline">${escapeHTML(dest.tagline)}</p>
          <div class="dest-card-tags">
            ${primaryTags.map((t) => `<span class="tag tag-${t}">${escapeHTML(t)}</span>`).join("")}
          </div>
          <div class="dest-card-footer">
            <span class="dest-card-days">${dest.suggestedDays.min}–${dest.suggestedDays.max} days</span>
            <button class="view-details-btn" data-id="${dest.id}">View Details <svg class="icon icon-sm"><use href="#icon-arrow-right"/></svg></button>
          </div>
        </div>
      </article>`;
  }

  function bindDestinationCardEvents(container) {
    $all(".fav-btn", container).forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavourite(btn.dataset.id);
      });
    });
    $all(".dest-card", container).forEach((card) => {
      card.addEventListener("click", () => openDestinationModal(card.dataset.id));
    });
  }

  /* =========================================================================
     DESTINATIONS PAGE
  ========================================================================= */
  function populateDestinationFilterOptions() {
    const regionSelect = $("#destRegionFilter");
    DATA.regions.forEach((r) => {
      const opt = document.createElement("option");
      opt.value = r.id;
      opt.textContent = r.name;
      regionSelect.appendChild(opt);
    });

    const stateSelect = $("#destStateFilter");
    DATA.states
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((s) => {
        const opt = document.createElement("option");
        opt.value = s.name;
        opt.textContent = s.name;
        stateSelect.appendChild(opt);
      });

    $("#destCategoryFilters").innerHTML = DATA.activityCategories
      .map((cat) => `<button class="pill" data-category="${cat.id}"><svg class="icon icon-sm"><use href="#icon-${cat.icon}"/></svg>${escapeHTML(cat.label)}</button>`)
      .join("");
  }

  function initDestinationsPage() {
    populateDestinationFilterOptions();

    $("#destSearchInput").addEventListener("input", debounce((e) => {
      state.destFilters.search = e.target.value.trim().toLowerCase();
      renderDestinationsPage();
    }, 150));

    $("#destRegionFilter").addEventListener("change", (e) => {
      state.destFilters.region = e.target.value;
      renderDestinationsPage();
    });
    $("#destStateFilter").addEventListener("change", (e) => {
      state.destFilters.stateName = e.target.value;
      renderDestinationsPage();
    });
    $("#destSort").addEventListener("change", (e) => {
      state.destFilters.sort = e.target.value;
      renderDestinationsPage();
    });
    $("#destFavOnly").addEventListener("change", (e) => {
      state.destFilters.favOnly = e.target.checked;
      renderDestinationsPage();
    });
    $all("#destCategoryFilters .pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        const cat = pill.dataset.category;
        if (state.destFilters.categories.has(cat)) {
          state.destFilters.categories.delete(cat);
          pill.classList.remove("active");
        } else {
          state.destFilters.categories.add(cat);
          pill.classList.add("active");
        }
        renderDestinationsPage();
      });
    });

    renderDestinationsPage();
  }

  function renderDestinationsPage() {
    const f = state.destFilters;
    let list = DATA.destinations.filter((d) => {
      if (f.favOnly && !state.favourites.has(d.id)) return false;
      if (f.region && d.region !== f.region) return false;
      if (f.stateName && d.state !== f.stateName) return false;
      if (f.categories.size && !Array.from(f.categories).every((c) => d.tags.includes(c))) return false;
      if (f.search) {
        const haystack = `${d.name} ${d.state} ${d.tagline} ${d.tags.join(" ")}`.toLowerCase();
        if (!haystack.includes(f.search)) return false;
      }
      return true;
    });

    list.sort((a, b) => {
      if (f.sort === "name") return a.name.localeCompare(b.name);
      if (f.sort === "days") return a.suggestedDays.min - b.suggestedDays.min;
      return b.rating - a.rating;
    });

    $("#destResultsCount").textContent = list.length;
    $("#destinationsEmpty").classList.toggle("hidden", list.length > 0);
    $("#destinationsGrid").innerHTML = list.map(destinationCardHTML).join("");
    bindDestinationCardEvents($("#destinationsGrid"));
  }

  /* =========================================================================
     DESTINATION DETAIL MODAL
  ========================================================================= */
  function openDestinationModal(id) {
    const dest = getDestination(id);
    if (!dest) return;
    const isFav = state.favourites.has(dest.id);

    $("#modalBody").innerHTML = `
      <div class="modal-hero theme-${dest.heroTheme}">
        <h2 id="modalDestName">${escapeHTML(dest.name)}</h2>
      </div>
      <div class="modal-body-content">
        <div class="modal-location"><svg class="icon"><use href="#icon-map-pin"/></svg>${escapeHTML(dest.state)} &middot; ${escapeHTML(DATA.regions.find((r) => r.id === dest.region).name)}</div>
        <div class="dest-card-tags">${dest.tags.map((t) => `<span class="tag tag-${t}">${escapeHTML(t)}</span>`).join("")}</div>
        <p>${escapeHTML(dest.description)}</p>

        <div class="modal-meta-grid">
          <div class="modal-meta-item"><span>Suggested stay</span>${dest.suggestedDays.min}–${dest.suggestedDays.max} days</div>
          <div class="modal-meta-item"><span>Rating</span>${dest.rating.toFixed(1)} / 5</div>
          <div class="modal-meta-item"><span>Best time</span>${escapeHTML(dest.bestTime)}</div>
          <div class="modal-meta-item"><span>Budget levels</span>${dest.budgetLevels.map(capitalize).join(", ")}</div>
        </div>

        <div class="modal-section">
          <h4>Highlights</h4>
          <ul class="modal-highlights">${dest.highlights.map((h) => `<li>${escapeHTML(h)}</li>`).join("")}</ul>
        </div>

        <div class="modal-section">
          <h4>Things to do here</h4>
          <ul class="modal-highlights">${dest.activityPool.slice(0, 8).map((a) => `<li>${escapeHTML(a.title)}</li>`).join("")}</ul>
        </div>

        <div class="modal-actions">
          <button class="btn btn-primary" id="modalPlanBtn" data-id="${dest.id}"><svg class="icon icon-sm"><use href="#icon-calendar"/></svg> Plan an Itinerary Here</button>
          <button class="btn btn-ghost fav-btn ${isFav ? "active" : ""}" id="modalFavBtn" data-id="${dest.id}"><svg class="icon icon-sm"><use href="#icon-heart"/></svg> ${isFav ? "Saved" : "Save to Favourites"}</button>
        </div>
      </div>`;

    $("#modalPlanBtn").addEventListener("click", () => {
      closeModal();
      navigateTo("itinerary");
      $("#itinDestinationSelect").value = dest.id;
      $("#itinDaysInput").value = Math.round((dest.suggestedDays.min + dest.suggestedDays.max) / 2);
      generateItinerary(dest.id, Number($("#itinDaysInput").value));
    });
    $("#modalFavBtn").addEventListener("click", () => {
      toggleFavourite(dest.id);
      const btn = $("#modalFavBtn");
      const nowFav = state.favourites.has(dest.id);
      btn.classList.toggle("active", nowFav);
      btn.innerHTML = `<svg class="icon icon-sm"><use href="#icon-heart"/></svg> ${nowFav ? "Saved" : "Save to Favourites"}`;
    });

    $("#destinationModal").classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    $("#destinationModal").classList.add("hidden");
    document.body.style.overflow = "";
  }

  function initModal() {
    $("#modalCloseBtn").addEventListener("click", closeModal);
    $("#destinationModal").addEventListener("click", (e) => {
      if (e.target === $("#destinationModal")) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  /* =========================================================================
     THINGS TO DO PAGE
  ========================================================================= */
  function initThingsToDoPage() {
    $("#thingsTabBar").innerHTML = DATA.activityCategories
      .map((cat) => `<button class="tab-btn" data-category="${cat.id}"><svg class="icon icon-sm"><use href="#icon-${cat.icon}"/></svg>${escapeHTML(cat.label)}</button>`)
      .join("");

    $all("#thingsTabBar .tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.activeThingsCategory = btn.dataset.category;
        renderThingsToDoPage(btn.dataset.category);
      });
    });
  }

  function renderThingsToDoPage(categoryId) {
    state.activeThingsCategory = categoryId;
    $all("#thingsTabBar .tab-btn").forEach((btn) => btn.classList.toggle("active", btn.dataset.category === categoryId));

    const cat = getCategoryMeta(categoryId);
    const items = [];
    DATA.destinations.forEach((dest) => {
      dest.activityPool
        .filter((a) => a.category === categoryId)
        .forEach((a) => items.push({ ...a, destId: dest.id, destName: dest.name, destState: dest.state }));
    });

    $("#thingsToDoContent").innerHTML = `
      <div class="activity-section">
        <div class="activity-section-header">
          <div class="category-icon cat-${cat.color}" style="margin:0;"><svg class="icon"><use href="#icon-${cat.icon}"/></svg></div>
          <h2>${escapeHTML(cat.label)}</h2>
        </div>
        <p>${escapeHTML(cat.description)}</p>
        <div class="activity-list">
          ${items
            .map(
              (a) => `
            <div class="activity-item">
              <h4>${escapeHTML(a.title)}</h4>
              <p>${escapeHTML(a.description)}</p>
              <div class="activity-meta"><span>⏱ ${escapeHTML(a.duration)}</span><span>${capitalize(a.timeOfDay)}</span></div>
              <button class="activity-dest-link" data-id="${a.destId}"><svg class="icon icon-sm"><use href="#icon-map-pin"/></svg>${escapeHTML(a.destName)}, ${escapeHTML(a.destState)}</button>
            </div>`
            )
            .join("")}
        </div>
        ${items.length === 0 ? '<p class="empty-state">No activities listed for this category yet.</p>' : ""}
      </div>`;

    $all(".activity-dest-link").forEach((btn) => {
      btn.addEventListener("click", () => openDestinationModal(btn.dataset.id));
    });
  }

  /* =========================================================================
     RECOMMENDATIONS PAGE
  ========================================================================= */
  const DURATION_LABELS = { weekend: "Weekend (2–3 days)", week: "One Week (4–7 days)", twoweeks: "Two Weeks+" };
  const DURATION_DAYS = { weekend: 3, week: 5, twoweeks: 10 };

  function recommendationCardHTML(rec) {
    const destNames = rec.destinationIds.map((id) => getDestination(id).name).join(" + ");
    return `
      <article class="recommend-card">
        <div class="recommend-tags">
          <span class="recommend-tag">${DURATION_LABELS[rec.duration]}</span>
          <span class="recommend-tag style-${rec.style}">${capitalize(rec.style)}</span>
        </div>
        <h3>${escapeHTML(rec.title)}</h3>
        <p>${escapeHTML(rec.description)}</p>
        <p class="recommend-destinations"><svg class="icon icon-sm"><use href="#icon-map-pin"/></svg> ${escapeHTML(destNames)}</p>
        <p class="recommend-meta">${escapeHTML(rec.estimatedBudget)}</p>
        <div class="recommend-highlights">${rec.highlights.map((h) => `<span>${escapeHTML(h)}</span>`).join("")}</div>
        <button class="btn btn-ghost" data-rec="${rec.id}">
          <svg class="icon icon-sm"><use href="#icon-calendar"/></svg> Plan This Trip
        </button>
      </article>`;
  }

  function bindRecommendationCardEvents(container) {
    $all("[data-rec]", container).forEach((btn) => {
      btn.addEventListener("click", () => {
        const rec = DATA.recommendations.find((r) => r.id === btn.dataset.rec);
        if (!rec) return;
        const destId = rec.destinationIds[0];
        navigateTo("itinerary");
        $("#itinDestinationSelect").value = destId;
        $("#itinDaysInput").value = DURATION_DAYS[rec.duration] || 3;
        generateItinerary(destId, Number($("#itinDaysInput").value));
      });
    });
  }

  function initRecommendationsPage() {
    $("#recDurationFilter").addEventListener("change", (e) => {
      state.recFilters.duration = e.target.value;
      renderRecommendationsPage();
    });
    $("#recStyleFilter").addEventListener("change", (e) => {
      state.recFilters.style = e.target.value;
      renderRecommendationsPage();
    });
    renderRecommendationsPage();
  }

  function renderRecommendationsPage() {
    const f = state.recFilters;
    const list = DATA.recommendations.filter((r) => (!f.duration || r.duration === f.duration) && (!f.style || r.style === f.style));
    $("#recResultsCount").textContent = list.length;
    $("#recommendationsEmpty").classList.toggle("hidden", list.length > 0);
    $("#recommendationsGrid").innerHTML = list.map(recommendationCardHTML).join("");
    bindRecommendationCardEvents($("#recommendationsGrid"));
  }

  /* =========================================================================
     ITINERARY PLANNER
  ========================================================================= */
  function initItineraryPlanner() {
    const select = $("#itinDestinationSelect");
    DATA.regions.forEach((region) => {
      const group = document.createElement("optgroup");
      group.label = region.name;
      DATA.destinations
        .filter((d) => d.region === region.id)
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((d) => {
          const opt = document.createElement("option");
          opt.value = d.id;
          opt.textContent = `${d.name} (${d.state})`;
          group.appendChild(opt);
        });
      if (group.children.length) select.appendChild(group);
    });

    $("#itinGenerateBtn").addEventListener("click", () => {
      const destId = select.value;
      const days = clamp(Number($("#itinDaysInput").value) || 3, 1, 14);
      $("#itinDaysInput").value = days;
      generateItinerary(destId, days);
    });

    $("#itinSaveBtn").addEventListener("click", saveItinerary);
    $("#itinResetBtn").addEventListener("click", resetItinerary);

    loadSavedItinerary();
  }

  function generateItinerary(destId, days) {
    const dest = getDestination(destId);
    if (!dest) return;
    days = clamp(days, 1, 14);

    const byTime = { morning: [], afternoon: [], evening: [] };
    dest.activityPool.forEach((a) => (byTime[a.timeOfDay] || byTime.morning).push(a));
    const counters = { morning: 0, afternoon: 0, evening: 0 };
    const slots = ["morning", "afternoon", "evening"];

    const daysArr = [];
    for (let d = 1; d <= days; d++) {
      const activities = [];
      slots.forEach((slot) => {
        const pool = byTime[slot].length ? byTime[slot] : dest.activityPool;
        if (!pool.length) return;
        const item = pool[counters[slot] % pool.length];
        counters[slot]++;
        activities.push({
          uid: nextUid(),
          title: item.title,
          description: item.description,
          category: item.category,
          timeOfDay: slot,
          duration: item.duration,
        });
      });
      daysArr.push({ day: d, activities });
    }

    state.itinerary = { destinationId: destId, days: daysArr };
    state.editingActivityUid = null;
    state.addingActivityForDay = null;
    renderItinerary();
    showToast(`${days}-day itinerary generated for ${dest.name}!`, "success");
  }

  function renderItinerary() {
    const it = state.itinerary;
    $("#itinEmptyState").classList.toggle("hidden", !!it);
    $("#plannerToolbar").classList.toggle("hidden", !it);

    if (!it) {
      $("#itinResultContainer").innerHTML = "";
      return;
    }

    const dest = getDestination(it.destinationId);
    $("#plannerSummary").textContent = `${it.days.length}-day itinerary for ${dest ? dest.name : "your trip"}`;

    $("#itinResultContainer").innerHTML = it.days
      .map((day) => {
        const activityRows = day.activities
          .map((act, idx) => activityRowHTML(act, day.day, idx, day.activities.length))
          .join("");
        const addForm = state.addingActivityForDay === day.day ? addActivityFormHTML(day.day) : "";
        return `
        <div class="itinerary-day">
          <div class="itinerary-day-header">
            <h3><span class="day-badge">${day.day}</span> Day ${day.day}</h3>
          </div>
          <div class="itinerary-activities">${activityRows || '<p class="empty-state">No activities yet — add one below.</p>'}</div>
          ${addForm}
          <div class="add-activity-row">
            <button class="add-activity-btn" data-day="${day.day}" data-action="toggle-add">
              <svg class="icon icon-sm"><use href="#icon-plus"/></svg> Add Activity
            </button>
          </div>
        </div>`;
      })
      .join("");

    bindItineraryEvents();
  }

  function activityRowHTML(act, dayNum, idx, total) {
    if (state.editingActivityUid === act.uid) {
      return `
        <div class="activity-row">
          <div class="activity-row-body">
            <div class="add-activity-form">
              <input type="text" class="edit-title full" value="${escapeHTML(act.title)}" placeholder="Activity title" />
              <select class="edit-timeofday">
                <option value="morning" ${act.timeOfDay === "morning" ? "selected" : ""}>Morning</option>
                <option value="afternoon" ${act.timeOfDay === "afternoon" ? "selected" : ""}>Afternoon</option>
                <option value="evening" ${act.timeOfDay === "evening" ? "selected" : ""}>Evening</option>
              </select>
              <input type="text" class="edit-duration" value="${escapeHTML(act.duration || "")}" placeholder="Duration e.g. 2h" />
              <textarea class="edit-description full" rows="2" placeholder="Description">${escapeHTML(act.description || "")}</textarea>
              <div class="add-activity-form-actions full">
                <button class="btn btn-ghost" data-action="cancel-edit" data-uid="${act.uid}">Cancel</button>
                <button class="btn btn-primary" data-action="save-edit" data-uid="${act.uid}" data-day="${dayNum}">Save Changes</button>
              </div>
            </div>
          </div>
        </div>`;
    }

    return `
      <div class="activity-row">
        <div class="drag-handle">
          <button class="reorder-btn" data-action="move-up" data-uid="${act.uid}" data-day="${dayNum}" ${idx === 0 ? "disabled" : ""} aria-label="Move up"><svg class="icon icon-sm"><use href="#icon-chevron-up"/></svg></button>
          <button class="reorder-btn" data-action="move-down" data-uid="${act.uid}" data-day="${dayNum}" ${idx === total - 1 ? "disabled" : ""} aria-label="Move down"><svg class="icon icon-sm"><use href="#icon-chevron-down"/></svg></button>
        </div>
        <div class="activity-row-body">
          <span class="activity-row-time">${capitalize(act.timeOfDay)}${act.duration ? " · " + escapeHTML(act.duration) : ""}</span>
          <h4>${escapeHTML(act.title)}</h4>
          <p>${escapeHTML(act.description || "")}</p>
        </div>
        <div class="activity-row-actions">
          <button class="row-action-btn" data-action="edit" data-uid="${act.uid}" aria-label="Edit"><svg class="icon icon-sm"><use href="#icon-edit"/></svg></button>
          <button class="row-action-btn" data-action="remove" data-uid="${act.uid}" data-day="${dayNum}" aria-label="Remove"><svg class="icon icon-sm"><use href="#icon-trash"/></svg></button>
        </div>
      </div>`;
  }

  function addActivityFormHTML(dayNum) {
    const catOptions = DATA.activityCategories.map((c) => `<option value="${c.id}">${escapeHTML(c.label)}</option>`).join("");
    return `
      <div class="add-activity-form" data-day="${dayNum}">
        <input type="text" class="new-title full" placeholder="Activity title" />
        <select class="new-timeofday">
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
        </select>
        <select class="new-category">${catOptions}</select>
        <input type="text" class="new-duration full" placeholder="Duration (e.g. 2h)" />
        <textarea class="new-description full" rows="2" placeholder="Short description (optional)"></textarea>
        <div class="add-activity-form-actions full">
          <button class="btn btn-ghost" data-action="cancel-add" data-day="${dayNum}">Cancel</button>
          <button class="btn btn-primary" data-action="save-add" data-day="${dayNum}">Add Activity</button>
        </div>
      </div>`;
  }

  function bindItineraryEvents() {
    const root = $("#itinResultContainer");

    $all("[data-action='toggle-add']", root).forEach((btn) =>
      btn.addEventListener("click", () => {
        state.addingActivityForDay = Number(btn.dataset.day);
        renderItinerary();
      })
    );
    $all("[data-action='cancel-add']", root).forEach((btn) =>
      btn.addEventListener("click", () => {
        state.addingActivityForDay = null;
        renderItinerary();
      })
    );
    $all("[data-action='save-add']", root).forEach((btn) =>
      btn.addEventListener("click", () => {
        const day = state.itinerary.days.find((d) => d.day === Number(btn.dataset.day));
        const form = btn.closest(".add-activity-form");
        const title = form.querySelector(".new-title").value.trim();
        if (!title) {
          showToast("Please give the activity a title", "error");
          return;
        }
        day.activities.push({
          uid: nextUid(),
          title,
          description: form.querySelector(".new-description").value.trim(),
          category: form.querySelector(".new-category").value,
          timeOfDay: form.querySelector(".new-timeofday").value,
          duration: form.querySelector(".new-duration").value.trim(),
        });
        state.addingActivityForDay = null;
        renderItinerary();
        showToast("Activity added", "success");
      })
    );

    $all("[data-action='edit']", root).forEach((btn) =>
      btn.addEventListener("click", () => {
        state.editingActivityUid = btn.dataset.uid;
        renderItinerary();
      })
    );
    $all("[data-action='cancel-edit']", root).forEach((btn) =>
      btn.addEventListener("click", () => {
        state.editingActivityUid = null;
        renderItinerary();
      })
    );
    $all("[data-action='save-edit']", root).forEach((btn) =>
      btn.addEventListener("click", () => {
        const day = state.itinerary.days.find((d) => d.day === Number(btn.dataset.day));
        const act = day.activities.find((a) => a.uid === btn.dataset.uid);
        const form = btn.closest(".activity-row");
        act.title = form.querySelector(".edit-title").value.trim() || act.title;
        act.timeOfDay = form.querySelector(".edit-timeofday").value;
        act.duration = form.querySelector(".edit-duration").value.trim();
        act.description = form.querySelector(".edit-description").value.trim();
        state.editingActivityUid = null;
        renderItinerary();
        showToast("Activity updated", "success");
      })
    );

    $all("[data-action='remove']", root).forEach((btn) =>
      btn.addEventListener("click", () => {
        const day = state.itinerary.days.find((d) => d.day === Number(btn.dataset.day));
        day.activities = day.activities.filter((a) => a.uid !== btn.dataset.uid);
        renderItinerary();
        showToast("Activity removed", "info");
      })
    );

    $all("[data-action='move-up']", root).forEach((btn) =>
      btn.addEventListener("click", () => moveActivity(Number(btn.dataset.day), btn.dataset.uid, -1))
    );
    $all("[data-action='move-down']", root).forEach((btn) =>
      btn.addEventListener("click", () => moveActivity(Number(btn.dataset.day), btn.dataset.uid, 1))
    );
  }

  function moveActivity(dayNum, uid, direction) {
    const day = state.itinerary.days.find((d) => d.day === dayNum);
    const idx = day.activities.findIndex((a) => a.uid === uid);
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= day.activities.length) return;
    const [item] = day.activities.splice(idx, 1);
    day.activities.splice(newIdx, 0, item);
    renderItinerary();
  }

  function saveItinerary() {
    if (!state.itinerary || !LS) {
      showToast("Nothing to save yet", "error");
      return;
    }
    LS.setItem(STORAGE_KEYS.itinerary, JSON.stringify(state.itinerary));
    showToast("Itinerary saved to this browser!", "success");
  }

  function loadSavedItinerary() {
    if (!LS) return;
    try {
      const saved = JSON.parse(LS.getItem(STORAGE_KEYS.itinerary) || "null");
      if (saved && saved.destinationId && Array.isArray(saved.days)) {
        state.itinerary = saved;
        state.uidCounter = Math.max(state.uidCounter, saved.days.reduce((m, d) => m + d.activities.length, 0) + 1);
        $("#itinDestinationSelect").value = saved.destinationId;
        $("#itinDaysInput").value = saved.days.length;
        renderItinerary();
      }
    } catch (e) {
      /* ignore corrupted storage */
    }
  }

  function resetItinerary() {
    state.itinerary = null;
    state.editingActivityUid = null;
    state.addingActivityForDay = null;
    if (LS) LS.removeItem(STORAGE_KEYS.itinerary);
    $("#itinDaysInput").value = 3;
    renderItinerary();
    showToast("Itinerary reset", "info");
  }

  /* =========================================================================
     CONTACT PAGE
  ========================================================================= */
  function renderContactInfo() {
    const c = DATA.contact;
    $("#contactInfoBlock").innerHTML = `
      <h2>Reach Us Directly</h2>
      <div class="contact-info-item"><svg class="icon"><use href="#icon-mail"/></svg><div><strong>Email</strong>${escapeHTML(c.email)}</div></div>
      <div class="contact-info-item"><svg class="icon"><use href="#icon-phone"/></svg><div><strong>Phone</strong>${escapeHTML(c.phone)}</div></div>
      <div class="contact-info-item"><svg class="icon"><use href="#icon-chat"/></svg><div><strong>WhatsApp</strong>${escapeHTML(c.whatsapp)}</div></div>
      <div class="contact-info-item"><svg class="icon"><use href="#icon-map-pin"/></svg><div><strong>Office</strong>${escapeHTML(c.address)}</div></div>
      <div class="contact-info-item"><svg class="icon"><use href="#icon-calendar"/></svg><div><strong>Hours</strong>${escapeHTML(c.officeHours)}</div></div>
      <div class="contact-social">
        <a href="#" onclick="return false;">Instagram ${escapeHTML(c.socialMedia.instagram)}</a>
        <a href="#" onclick="return false;">TikTok ${escapeHTML(c.socialMedia.tiktok)}</a>
      </div>`;

    // Footer contact + social
    $("#footerContactBlock").innerHTML = `
      <h4>Get in touch</h4>
      <p>${escapeHTML(c.email)}</p>
      <p>${escapeHTML(c.phone)}</p>`;
    $("#footerSocialLinks").innerHTML = `
      <a href="#" onclick="return false;">${escapeHTML(c.socialMedia.instagram)}</a>
      <a href="#" onclick="return false;">${escapeHTML(c.socialMedia.facebook)}</a>
      <a href="#" onclick="return false;">${escapeHTML(c.socialMedia.tiktok)}</a>`;
  }

  function initContactForm() {
    const form = $("#contactForm");
    const fields = {
      name: { input: $("#contactName"), error: $("#contactNameError"), validate: (v) => v.trim().length > 0 || "Please enter your name." },
      email: { input: $("#contactEmail"), error: $("#contactEmailError"), validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Please enter a valid email." },
      subject: { input: $("#contactSubject"), error: $("#contactSubjectError"), validate: (v) => v.trim().length > 0 || "Please add a subject." },
      message: { input: $("#contactMessage"), error: $("#contactMessageError"), validate: (v) => v.trim().length >= 10 || "Message should be at least 10 characters." },
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      Object.values(fields).forEach((f) => {
        const result = f.validate(f.input.value);
        if (result !== true) {
          f.error.textContent = result;
          valid = false;
        } else {
          f.error.textContent = "";
        }
      });

      const statusEl = $("#contactFormStatus");
      if (!valid) {
        statusEl.className = "form-status error";
        statusEl.textContent = "Please fix the highlighted fields above.";
        return;
      }

      const submitBtn = form.querySelector("button[type=submit]");
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      // No backend is connected — we simulate a network request so the form
      // is fully functional to try. Wire this to your API / email service.
      setTimeout(() => {
        statusEl.className = "form-status success";
        statusEl.textContent = `Thanks, ${fields.name.input.value.trim()}! Your message has been received — we'll reply within 1–2 business days.`;
        statusEl.classList.remove("hidden");
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
        showToast("Message sent!", "success");
      }, 700);
    });
  }

  /* =========================================================================
     FOOTER
  ========================================================================= */
  function renderFooterMisc() {
    $("#currentYear").textContent = new Date().getFullYear();
  }

  /* =========================================================================
     INIT
  ========================================================================= */
  function init() {
    loadFavourites();
    renderHome();
    initDestinationsPage();
    initThingsToDoPage();
    initRecommendationsPage();
    initItineraryPlanner();
    renderContactInfo();
    initContactForm();
    initModal();
    renderFooterMisc();
    initNavigation();
    updateFavouritesUI();

    $("#favouritesBtn").addEventListener("click", () => navigateTo("destinations", { favOnly: true }));

    $("#heroSearchForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const query = $("#heroSearchInput").value.trim();
      navigateTo("destinations", { search: query.toLowerCase() });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
