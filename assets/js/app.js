import { getStoredLang, applyLang, initLangToggle, t } from "./i18n.js";

document.documentElement.classList.add("js-enabled");

const siteRoot = document.body.dataset.root || "./";
const page = document.body.dataset.page || "home";

const navLinks = [...document.querySelectorAll("[data-nav]")];
const currentYearNodes = document.querySelectorAll("[data-current-year]");
const toggleButton = document.querySelector(".nav-toggle");
const siteHeader = document.querySelector(".site-header");

const countryNames = {
  CN: "China 中国",
  HK: "Hong Kong 香港",
  JP: "Japan 日本",
  KR: "South Korea 韩国",
  SG: "Singapore 新加坡",
  US: "United States 美国",
  TW: "Taiwan 台湾",
  TH: "Thailand 泰国",
  FR: "France 法国",
  GB: "UK 英国",
  DE: "Germany 德国",
  IT: "Italy 意大利",
};

function resolveSitePath(path) {
  if (/^(https?:|mailto:|tel:)/.test(path)) return path;
  return `${siteRoot}${path}`.replace(/([^:])(\/\/+)/g, "$1/");
}

async function fetchJSON(path) {
  const r = await fetch(resolveSitePath(path));
  if (!r.ok) throw new Error(`Failed to fetch ${path}`);
  return r.json();
}

async function fetchText(path) {
  const r = await fetch(resolveSitePath(path));
  if (!r.ok) throw new Error(`Failed to fetch ${path}`);
  return r.text();
}

function formatDate(dateString, options = {}) {
  const lang = window.__siteLang || "zh";
  const locale = lang === "zh" ? "zh-CN" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric", month: "short", day: "numeric", ...options,
  }).format(new Date(dateString));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function renderEmptyState(container, key) {
  container.innerHTML = `<div class="empty-state">${escapeHtml(t(key))}</div>`;
}

function getTravelTitle(item) {
  const lang = window.__siteLang || "zh";
  return lang === "zh"
    ? (item.title?.zh || item.title?.en || item.slug)
    : (item.title?.en || item.title?.zh || item.slug);
}

function getTravelSummary(item) {
  const lang = window.__siteLang || "zh";
  return lang === "zh"
    ? (item.summary?.zh || item.summary?.en || "")
    : (item.summary?.en || item.summary?.zh || "");
}

function getCountryLabel(country) {
  const code = typeof country === "string" ? country : country.code;
  return countryNames[code] || code;
}

function getCountryCode(country) {
  return typeof country === "string" ? country : country.code;
}

const homeDataCache = {
  profile: null,
  concerts: [],
  trips: [],
};

let homeLangListenerAttached = false;

function getLocalizedValue(value, lang = window.__siteLang || "zh") {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") return value[lang] || value.zh || value.en || "";
  return "";
}

function selectFeaturedItems(items, limit, dateAccessor) {
  const sorted = items.slice().sort((a, b) => new Date(dateAccessor(b) || 0) - new Date(dateAccessor(a) || 0));
  const curated = sorted.filter((item) => item.featuredOnHome);
  return (curated.length ? curated : sorted).slice(0, limit);
}

/* ---- Shell ---- */
function initSharedShell() {
  currentYearNodes.forEach((n) => { n.textContent = String(new Date().getFullYear()); });

  navLinks.forEach((link) => {
    if (link.dataset.nav === page || (page === "travel-detail" && link.dataset.nav === "travel")) {
      link.setAttribute("aria-current", "page");
    }
  });

  if (toggleButton && siteHeader) {
    toggleButton.addEventListener("click", () => {
      const expanded = toggleButton.getAttribute("aria-expanded") === "true";
      toggleButton.setAttribute("aria-expanded", String(!expanded));
      siteHeader.classList.toggle("is-open", !expanded);
    });
  }
}

/* ---- Scroll reveal ---- */
function initScrollReveal() {
  const targets = document.querySelectorAll(".reveal:not(.is-visible)");
  if (!targets.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
  targets.forEach((el) => obs.observe(el));
}

/* ---- Lightbox ---- */
function buildLightbox() {
  const box = document.createElement("div");
  box.className = "lightbox";
  box.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Close">×</button>
    <div class="lightbox-dialog">
      <img alt="">
      <p class="lightbox-caption"></p>
    </div>`;
  document.body.append(box);
  const img = box.querySelector("img");
  const cap = box.querySelector(".lightbox-caption");
  const close = box.querySelector(".lightbox-close");
  const closeLb = () => { box.classList.remove("is-open"); document.body.style.overflow = ""; };
  document.addEventListener("click", (e) => {
    const tr = e.target.closest("[data-lightbox-src]");
    if (!tr) return;
    img.src = tr.dataset.lightboxSrc;
    img.alt = tr.dataset.lightboxAlt || "";
    cap.textContent = tr.dataset.lightboxCaption || "";
    box.classList.add("is-open");
    document.body.style.overflow = "hidden";
  });
  close.addEventListener("click", closeLb);
  box.addEventListener("click", (e) => { if (e.target === box) closeLb(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLb(); });
}

/* ---- Home ---- */
async function initHome() {
  const [profile, concerts, trips] = await Promise.all([
    fetchJSON("data/profile.json"),
    fetchJSON("data/concerts.json"),
    fetchJSON("data/travel.json"),
  ]);

  homeDataCache.profile = profile;
  homeDataCache.concerts = concerts;
  homeDataCache.trips = trips;

  renderHome();

  if (!homeLangListenerAttached) {
    document.addEventListener("site:langchange", () => {
      if (page === "home") renderHome();
    });
    homeLangListenerAttached = true;
  }
}

function renderHome() {
  const { profile, concerts, trips } = homeDataCache;
  if (!profile) return;
  const lang = window.__siteLang || "zh";
  const introText = getLocalizedValue(profile.home_intro, lang).trim();
  const aboutText = getLocalizedValue(profile.home_about_summary, lang).trim();

  document.title = lang === "zh"
    ? `${profile.name || "Oeight"} | 个人档案`
    : `${profile.name || "Oeight"} | Personal Archive`;

  const nameEl = document.getElementById("profile-name");
  if (nameEl) {
    nameEl.textContent = profile.name || "Oeight";
  }

  const introEl = document.getElementById("profile-home-intro");
  if (introEl) {
    introEl.textContent = introText || t("home.copy.placeholder");
    introEl.classList.toggle("is-placeholder", !introText);
  }

  const aboutEl = document.getElementById("profile-home-about");
  if (aboutEl) {
    aboutEl.textContent = aboutText || t("home.copy.placeholder");
    aboutEl.classList.toggle("is-placeholder", !aboutText);
  }

  const linkRow = document.getElementById("profile-links");
  if (linkRow && profile.links?.length) {
    linkRow.innerHTML = profile.links.map((l) =>
      `<a class="pill-link" href="${escapeHtml(resolveSitePath(l.url))}" target="${l.external ? "_blank" : "_self"}" rel="noopener noreferrer">${escapeHtml(lang === "zh" ? (l.labelZh || l.label) : (l.label || l.labelZh || l.url))}</a>`
    ).join("");
  }

  const educationGrid = document.getElementById("home-education-grid");
  if (educationGrid) {
    const education = Array.isArray(profile.education) ? profile.education : [];
    if (!education.length) {
      educationGrid.innerHTML = `
        <article class="home-education-card is-placeholder">
          <span class="home-education-period">TBD</span>
          <strong class="home-education-school">${escapeHtml(t("home.education.label"))}</strong>
          <p class="home-education-meta">${escapeHtml(t("home.education.placeholder"))}</p>
        </article>`;
    } else {
      educationGrid.innerHTML = education.map((entry) => {
        const degreeLine = [entry.program, entry.field].filter(Boolean).join(" · ");
        const metaLine = [entry.location, entry.status].filter(Boolean).join(" · ");
        return `
          <article class="home-education-card">
            <span class="home-education-period">${escapeHtml(entry.period || "")}</span>
            <strong class="home-education-school">${escapeHtml(entry.school || "")}</strong>
            ${degreeLine ? `<p class="home-education-program">${escapeHtml(degreeLine)}</p>` : ""}
            ${metaLine ? `<p class="home-education-meta">${escapeHtml(metaLine)}</p>` : ""}
          </article>`;
      }).join("");
    }
  }

  const featuredConcerts = document.getElementById("home-featured-concerts");
  if (featuredConcerts) {
    const picks = selectFeaturedItems(concerts, 2, (item) => item.date);
    if (!picks.length) {
      renderEmptyState(featuredConcerts, "home.copy.placeholder");
    } else {
      featuredConcerts.innerHTML = picks.map((item) => {
        const image = item.coverImage
          ? `<img class="home-preview-thumb" src="${escapeHtml(resolveSitePath(item.coverImage))}" alt="${escapeHtml(item.artist)}" loading="lazy">`
          : `<div class="home-preview-thumb home-preview-thumb--placeholder" aria-hidden="true">C</div>`;
        const meta = [formatDate(item.date), item.city].filter(Boolean).join(" · ");
        return `
          <article class="home-preview-card">
            ${image}
            <div class="home-preview-body">
              <p class="home-preview-kicker">${escapeHtml(item.event || "")}</p>
              <h4 class="home-preview-title">${escapeHtml(item.artist || item.slug)}</h4>
              <p class="home-preview-meta">${escapeHtml(meta)}</p>
            </div>
            <a class="home-preview-action" href="${escapeHtml(item.bilibiliUrl || resolveSitePath("concerts/index.html"))}" target="_blank" rel="noopener noreferrer">${escapeHtml(t("home.featured.watch"))}</a>
          </article>`;
      }).join("");
    }
  }

  const featuredTravel = document.getElementById("home-featured-travel");
  if (featuredTravel) {
    const picks = selectFeaturedItems(trips, 2, (item) => item.dateRange?.start);
    if (!picks.length) {
      renderEmptyState(featuredTravel, "home.copy.placeholder");
    } else {
      featuredTravel.innerHTML = picks.map((item) => {
        const detailUrl = `${resolveSitePath("travel/detail.html")}?slug=${encodeURIComponent(item.slug)}`;
        const image = item.coverImage
          ? `<img class="home-preview-thumb" src="${escapeHtml(resolveSitePath(item.coverImage))}" alt="${escapeHtml(getTravelTitle(item))}" loading="lazy">`
          : `<div class="home-preview-thumb home-preview-thumb--placeholder" aria-hidden="true">T</div>`;
        const meta = [formatDate(item.dateRange?.start), item.countries?.map(getCountryLabel).join(", ")].filter(Boolean).join(" · ");
        return `
          <article class="home-preview-card">
            ${image}
            <div class="home-preview-body">
              <p class="home-preview-kicker">${escapeHtml(item.routeCities?.length ? `${item.routeCities.length} ${lang === "zh" ? "站路线" : "stops"}` : "")}</p>
              <h4 class="home-preview-title">${escapeHtml(getTravelTitle(item))}</h4>
              <p class="home-preview-meta">${escapeHtml(meta)}</p>
            </div>
            <a class="home-preview-action" href="${escapeHtml(detailUrl)}">${escapeHtml(t("home.featured.read"))}</a>
          </article>`;
      }).join("");
    }
  }

  setTimeout(() => initScrollReveal(), 80);
}

/* ---- Concerts ---- */
async function initConcerts() {
  const concerts = await fetchJSON("data/concerts.json");
  const grid = document.getElementById("concerts-grid");
  const yf = document.getElementById("concert-year-filter");
  const af = document.getElementById("concert-artist-filter");

  const sorted = concerts.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  const years = [...new Set(sorted.map((c) => String(new Date(c.date).getFullYear())))];
  const artists = [...new Set(sorted.map((c) => c.artist))];

  yf.innerHTML = `<option value="all">${t("concerts.filter.all")}</option>` +
    years.map((y) => `<option value="${escapeHtml(y)}">${escapeHtml(y)}</option>`).join("");
  af.innerHTML = `<option value="all">${t("concerts.filter.all")}</option>` +
    artists.map((a) => `<option value="${escapeHtml(a)}">${escapeHtml(a)}</option>`).join("");

  function render() {
    const sy = yf.value, sa = af.value;
    const filtered = sorted.filter((c) => {
      const y = String(new Date(c.date).getFullYear());
      return (sy === "all" || y === sy) && (sa === "all" || c.artist === sa);
    });
    if (!filtered.length) { renderEmptyState(grid, "concerts.empty"); return; }

    grid.innerHTML = filtered.map((c) => {
      const cover = c.coverImage
        ? `<img src="${escapeHtml(resolveSitePath(c.coverImage))}" alt="${escapeHtml(c.artist)}" loading="lazy">`
        : `<div style="aspect-ratio:4/3;background:var(--accent-soft);display:grid;place-items:center;font-size:3rem;">🎤</div>`;
      const venue = c.venue ? ` · ${escapeHtml(c.venue)}` : "";
      return `
        <article class="content-card reveal">
          <div class="card-image-wrapper">
            ${cover}
            <div class="card-kicker-overlay">${escapeHtml(formatDate(c.date))}</div>
          </div>
          <div class="card-body">
            <h3>${escapeHtml(c.artist)}</h3>
            <div class="card-meta">${escapeHtml(c.city)}${venue}</div>
            <p class="card-desc">${escapeHtml(c.event)}${c.note ? "<br>" + escapeHtml(c.note) : ""}</p>
            <div class="card-actions">
              <a class="btn-primary" href="${escapeHtml(c.bilibiliUrl)}" target="_blank" rel="noopener noreferrer"
                data-i18n="concerts.watch">${t("concerts.watch")}</a>
            </div>
          </div>
        </article>`;
    }).join("");
    setTimeout(() => initScrollReveal(), 80);
  }

  yf.addEventListener("change", render);
  af.addEventListener("change", render);
  render();
}

/* ---- Travel card ---- */
function renderTravelCard(item) {
  const detailUrl = `${resolveSitePath("travel/detail.html")}?slug=${encodeURIComponent(item.slug)}`;
  const cover = item.coverImage
    ? `<img src="${escapeHtml(resolveSitePath(item.coverImage))}" alt="${escapeHtml(getTravelTitle(item))}" loading="lazy">`
    : `<div style="aspect-ratio:4/3;background:var(--accent-soft);display:grid;place-items:center;font-size:3rem;">🗺️</div>`;
  const countries = item.countries.map(getCountryLabel).join(", ");
  return `
    <article class="content-card reveal">
      <div class="card-image-wrapper">
        ${cover}
        <div class="card-kicker-overlay">${escapeHtml(item.dateRange.label)}</div>
      </div>
      <div class="card-body">
        <h3>${escapeHtml(getTravelTitle(item))}</h3>
        <div class="card-meta">${escapeHtml(countries)} · ${item.routeCities.length} stops</div>
        <p class="card-desc">${escapeHtml(getTravelSummary(item))}</p>
        <div class="card-actions">
          <a class="btn-primary" href="${escapeHtml(detailUrl)}" data-i18n="travel.open">${t("travel.open")}</a>
        </div>
      </div>
    </article>`;
}

/* ---- Travel Index ---- */
async function initTravelIndex() {
  const trips = await fetchJSON("data/travel.json");
  const grid = document.getElementById("travel-grid");
  const stats = document.getElementById("travel-stats");
  const sorted = trips.slice().sort((a, b) => new Date(b.dateRange.start) - new Date(a.dateRange.start));
  grid.innerHTML = sorted.map(renderTravelCard).join("");

  const codes = [...new Set(sorted.flatMap((tr) => tr.countries.map(getCountryCode)))];
  const stops = sorted.reduce((n, tr) => n + tr.routeCities.length, 0);
  stats.innerHTML = [
    { n: codes.length, key: "travel.regions" },
    { n: sorted.length, key: "travel.trips"  },
    { n: stops,        key: "travel.stops"   },
  ].map(({ n, key }) =>
    `<div class="stat-item"><strong>${n}</strong><span data-i18n="${key}">${t(key)}</span></div>`
  ).join("");

  const mapEl = document.getElementById("travel-map");
  if (mapEl && window.jsVectorMap) {
    new window.jsVectorMap({
      selector: "#travel-map", map: "world", zoomButtons: false,
      selectedRegions: codes,
      regionStyle: {
        initial:  { fill: "#ececee", stroke: "#d4d4d8", strokeWidth: 1 },
        hover:    { fill: "#ddd" },
        selected: { fill: "#d4764e" },
      },
      backgroundColor: "transparent",
      onRegionTooltipShow(_, tooltip, code) {
        if (codes.includes(code)) tooltip.text(`${tooltip.text()} ✓`);
      },
    });
  }
}

/* ---- Travel Detail ---- */
async function initTravelDetail() {
  const slug = new URLSearchParams(window.location.search).get("slug");
  const trips = await fetchJSON("data/travel.json");
  const trip = trips.find((it) => it.slug === slug) || trips[0];
  if (!trip) return;

  document.title = `${getTravelTitle(trip)} | Oeight`;
  document.getElementById("travel-detail-title").textContent = getTravelTitle(trip);
  document.getElementById("travel-detail-summary").textContent = getTravelSummary(trip);

  const coverEl = document.getElementById("travel-detail-cover");
  coverEl.src = resolveSitePath(trip.coverImage);
  coverEl.alt = getTravelTitle(trip);

  const metaEl = document.getElementById("travel-detail-meta");
  metaEl.innerHTML = [trip.dateRange.label, trip.countries.map(getCountryLabel).join(", "), `${trip.routeCities.length} stops`]
    .map((tx) => `<span class="eyebrow" style="background:white;border:1px solid rgba(0,0,0,0.1);margin:0;">${escapeHtml(tx)}</span>`)
    .join("");

  const body = document.getElementById("travel-detail-body");
  const md = await fetchText(trip.markdownPath);
  body.innerHTML = window.marked?.parse ? window.marked.parse(md) : `<p>${escapeHtml(md)}</p>`;

  const galleryEl = document.getElementById("travel-detail-gallery");
  galleryEl.innerHTML = trip.gallery.map((item) => {
    const src = resolveSitePath(item.image);
    return `
      <article class="content-card reveal">
        <div class="card-image-wrapper">
          <button type="button" style="width:100%;height:100%;display:block;border:none;background:transparent;padding:0;cursor:pointer;overflow:hidden;"
            data-lightbox-src="${escapeHtml(src)}"
            data-lightbox-alt="${escapeHtml(item.alt || item.caption)}"
            data-lightbox-caption="${escapeHtml(item.caption)}">
            <img src="${escapeHtml(src)}" alt="${escapeHtml(item.alt || item.caption)}" loading="lazy" style="width:100%;aspect-ratio:4/3;object-fit:cover;">
          </button>
        </div>
        <div class="card-body"><p class="card-desc" style="margin:0;">${escapeHtml(item.caption)}</p></div>
      </article>`;
  }).join("");

  const routeEl = document.getElementById("travel-route-list");
  routeEl.innerHTML = trip.routeCities.map((stop, i) =>
    `<li><strong style="display:block;margin-bottom:.25rem;">${escapeHtml(`${i + 1}. ${stop.name}`)}</strong>
     <div style="color:var(--text-muted);font-size:.9rem;">${escapeHtml(stop.note)}</div></li>`
  ).join("");

  if (window.L) {
    const map = window.L.map("travel-route-map", { scrollWheelZoom: false });
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
    const lls = trip.routeCities.map((s) => [s.latitude, s.longitude]);
    const poly = window.L.polyline(lls, { color: "#d4764e", weight: 4, opacity: 0.9 }).addTo(map);
    trip.routeCities.forEach((stop, i) => {
      window.L.marker([stop.latitude, stop.longitude], {
        icon: window.L.divIcon({ className: "", html: `<span class="route-marker">${i + 1}</span>`, iconSize: [30, 30], iconAnchor: [15, 15] }),
      }).addTo(map).bindPopup(`<strong>${escapeHtml(stop.name)}</strong><br>${escapeHtml(stop.note)}`);
    });
    map.fitBounds(poly.getBounds(), { padding: [24, 24] });
  }
}

/* ---- Now ---- */
async function initNow() {
  const entries = await fetchJSON("data/now.json");
  const stream = document.getElementById("now-stream");
  const sorted = entries.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  if (!sorted.length) { renderEmptyState(stream, "now.empty"); return; }

  stream.innerHTML = sorted.map((e) => `
    <article class="timeline-item reveal">
      <div class="timeline-card">
        <time class="timeline-time" datetime="${escapeHtml(e.timestamp)}">${escapeHtml(formatDate(e.timestamp))}</time>
        <h3>${escapeHtml(e.title)}</h3>
        <p style="color:var(--text-muted);line-height:1.6;margin-bottom:.5rem;">${escapeHtml(e.body)}</p>
        <div style="font-size:.8rem;color:var(--text-light);text-transform:uppercase;letter-spacing:.05em;">${escapeHtml(e.tag)}</div>
      </div>
    </article>`).join("");
}

/* ---- Gallery ---- */
async function initGallery() {
  const groups = await fetchJSON("data/gallery.json");
  const container = document.getElementById("gallery-groups");
  if (!groups.length) { renderEmptyState(container, "gallery.empty"); return; }

  container.innerHTML = groups.map((group) => {
    const items = group.items.map((item) => {
      const src = resolveSitePath(item.image);
      const related = item.relatedLink
        ? `<a class="btn-primary" style="padding:.4rem .8rem;font-size:.8rem;margin-top:.5rem;" href="${escapeHtml(resolveSitePath(item.relatedLink.url))}" ${item.relatedLink.external ? 'target="_blank" rel="noopener noreferrer"' : ""}>${escapeHtml(item.relatedLink.label)}</a>`
        : "";
      return `
        <article class="content-card reveal">
          <div class="card-image-wrapper">
            <button type="button" style="width:100%;height:100%;display:block;border:none;background:transparent;padding:0;cursor:pointer;overflow:hidden;"
              data-lightbox-src="${escapeHtml(src)}"
              data-lightbox-alt="${escapeHtml(item.alt || item.caption)}"
              data-lightbox-caption="${escapeHtml(item.caption)}">
              <img src="${escapeHtml(src)}" alt="${escapeHtml(item.alt || item.caption)}" loading="lazy" style="width:100%;aspect-ratio:4/3;object-fit:cover;">
            </button>
          </div>
          <div class="card-body">
            <p class="card-desc" style="margin:0;">${escapeHtml(item.caption)}</p>
            ${related}
          </div>
        </article>`;
    }).join("");

    const lang = window.__siteLang || "zh";
    const groupTitle = lang === "zh" ? (group.labelZh || group.title) : (group.labelEn || group.title);
    return `
      <section class="gallery-group section-card reveal" style="margin-bottom:2.5rem;">
        <div class="section-heading" style="text-align:center;margin-bottom:1.5rem;">
          <p class="eyebrow">${escapeHtml(group.labelEn)} · ${escapeHtml(group.labelZh)}</p>
          <h2>${escapeHtml(groupTitle)}</h2>
          ${group.description ? `<p style="color:var(--text-muted);max-width:600px;margin:.5rem auto 0;">${escapeHtml(group.description)}</p>` : ""}
        </div>
        <div class="card-grid">${items}</div>
      </section>`;
  }).join("");
}

/* ---- Init ---- */
async function initPage() {
  // 1. Init language FIRST (before any content renders)
  initLangToggle();
  applyLang(getStoredLang());

  // 2. Shell
  initSharedShell();
  buildLightbox();

  // 3. Page content
  try {
    if (page === "home")          await initHome();
    if (page === "concerts")      await initConcerts();
    if (page === "travel")        await initTravelIndex();
    if (page === "travel-detail") await initTravelDetail();
    if (page === "now")           await initNow();
    if (page === "gallery")       await initGallery();
  } catch (err) {
    console.error(err);
  }

  // 4. Scroll reveal
  setTimeout(() => initScrollReveal(), 100);
}

initPage();
