const siteRoot = document.body.dataset.root || "./";
const page = document.body.dataset.page || "home";

const navLinks = [...document.querySelectorAll("[data-nav]")];
const currentYearNodes = document.querySelectorAll("[data-current-year]");
const toggleButton = document.querySelector(".nav-toggle");
const siteHeader = document.querySelector(".site-header");

const countryNames = {
  CN: "China",
  HK: "Hong Kong",
  JP: "Japan",
  KR: "South Korea",
  SG: "Singapore",
  US: "United States"
};

function resolveSitePath(path) {
  if (/^(https?:|mailto:|tel:)/.test(path)) {
    return path;
  }
  return `${siteRoot}${path}`.replace(/([^:]\/)\/+/g, "$1");
}

async function fetchJSON(path) {
  const response = await fetch(resolveSitePath(path));
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }
  return response.json();
}

async function fetchText(path) {
  const response = await fetch(resolveSitePath(path));
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }
  return response.text();
}

function formatDate(dateString, options = {}) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options
  }).format(date);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderEmptyState(container, text) {
  container.innerHTML = `<div class="empty-state">${escapeHtml(text)}</div>`;
}

function getTravelTitle(item) {
  return item.title?.en || item.title?.zh || item.slug;
}

function getTravelSummary(item) {
  return item.summary?.en || item.summary?.zh || "";
}

function getCountryLabel(country) {
  if (typeof country === "string") {
    return countryNames[country] || country;
  }
  return country.name || countryNames[country.code] || country.code;
}

function getCountryCode(country) {
  if (typeof country === "string") {
    return country;
  }
  return country.code;
}

function initSharedShell() {
  currentYearNodes.forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

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

function buildLightbox() {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Close image viewer">×</button>
    <div class="lightbox-dialog">
      <img alt="">
      <p class="lightbox-caption"></p>
    </div>
  `;
  document.body.append(lightbox);

  const image = lightbox.querySelector("img");
  const caption = lightbox.querySelector(".lightbox-caption");
  const closeButton = lightbox.querySelector(".lightbox-close");

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-lightbox-src]");
    if (!trigger) {
      return;
    }

    image.src = trigger.dataset.lightboxSrc;
    image.alt = trigger.dataset.lightboxAlt || "";
    caption.textContent = trigger.dataset.lightboxCaption || "";
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  });

  closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
}

async function initHome() {
  const [profile, concerts, trips, nowEntries, gallery] = await Promise.all([
    fetchJSON("data/profile.json"),
    fetchJSON("data/concerts.json"),
    fetchJSON("data/travel.json"),
    fetchJSON("data/now.json"),
    fetchJSON("data/gallery.json")
  ]);

  document.getElementById("profile-name").textContent = profile.name;
  document.getElementById("profile-tagline").textContent = profile.tagline.en;
  document.getElementById("profile-intro").textContent = `${profile.intro.en} ${profile.intro.zh}`;

  const linkRow = document.getElementById("profile-links");
  linkRow.innerHTML = profile.links
    .map((link) => {
      const href = escapeHtml(link.url);
      const label = escapeHtml(`${link.label} / ${link.labelZh}`);
      return `<a class="pill-link" href="${href}" target="${link.external ? "_blank" : "_self"}" rel="noopener noreferrer">${label}</a>`;
    })
    .join("");

  const snapshotGrid = document.getElementById("snapshot-grid");
  const galleryCount = gallery.reduce((total, group) => total + group.items.length, 0);
  const snapshotItems = [
    { value: concerts.length, label: "concert entries" },
    { value: trips.length, label: "travel logs" },
    { value: nowEntries.length, label: "now notes" },
    { value: galleryCount, label: "gallery images" }
  ];

  snapshotGrid.innerHTML = snapshotItems
    .map((item) => `<article class="stat-card"><strong>${item.value}</strong><span>${escapeHtml(item.label)}</span></article>`)
    .join("");

  const homeConcerts = document.getElementById("home-concerts");
  concerts
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 2)
    .forEach((concert) => {
      const item = document.createElement("article");
      item.className = "stack-item";
      item.innerHTML = `
        <strong>${escapeHtml(concert.artist)}</strong>
        <p>${escapeHtml(concert.event)}</p>
        <span>${escapeHtml(concert.city)} · ${escapeHtml(formatDate(concert.date))}</span>
      `;
      homeConcerts.append(item);
    });

  const homeNow = document.getElementById("home-now");
  nowEntries
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 2)
    .forEach((entry) => {
      const item = document.createElement("article");
      item.className = "stack-item";
      item.innerHTML = `
        <strong>${escapeHtml(entry.title)}</strong>
        <p>${escapeHtml(entry.body)}</p>
        <span>${escapeHtml(formatDate(entry.timestamp))}</span>
      `;
      homeNow.append(item);
    });
}

async function initConcerts() {
  const concerts = await fetchJSON("data/concerts.json");
  const grid = document.getElementById("concerts-grid");
  const yearFilter = document.getElementById("concert-year-filter");
  const artistFilter = document.getElementById("concert-artist-filter");

  const sorted = concerts.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  const years = [...new Set(sorted.map((concert) => String(new Date(concert.date).getFullYear())))];
  const artists = [...new Set(sorted.map((concert) => concert.artist))];

  yearFilter.innerHTML += years.map((year) => `<option value="${escapeHtml(year)}">${escapeHtml(year)}</option>`).join("");
  artistFilter.innerHTML += artists.map((artist) => `<option value="${escapeHtml(artist)}">${escapeHtml(artist)}</option>`).join("");

  function render() {
    const selectedYear = yearFilter.value;
    const selectedArtist = artistFilter.value;
    const filtered = sorted.filter((concert) => {
      const year = String(new Date(concert.date).getFullYear());
      const matchYear = selectedYear === "all" || year === selectedYear;
      const matchArtist = selectedArtist === "all" || concert.artist === selectedArtist;
      return matchYear && matchArtist;
    });

    if (!filtered.length) {
      renderEmptyState(grid, "No concerts match the current filters yet.");
      return;
    }

    grid.innerHTML = filtered
      .map((concert) => {
        const cover = concert.coverImage ? `<img class="concert-cover" src="${escapeHtml(resolveSitePath(concert.coverImage))}" alt="${escapeHtml(concert.artist)}">` : "";
        const venue = concert.venue ? ` · ${escapeHtml(concert.venue)}` : "";
        const note = concert.note ? `<p>${escapeHtml(concert.note)}</p>` : "";
        return `
          <article class="concert-card">
            ${cover}
            <span class="card-kicker">${escapeHtml(formatDate(concert.date, { year: "numeric", month: "long", day: "numeric" }))}</span>
            <h3>${escapeHtml(concert.artist)}</h3>
            <p>${escapeHtml(concert.event)}</p>
            <div class="card-meta">${escapeHtml(concert.city)}${venue}</div>
            ${note}
            <div class="card-actions">
              <a class="button-link" href="${escapeHtml(concert.bilibiliUrl)}" target="_blank" rel="noopener noreferrer">Watch on Bilibili</a>
            </div>
          </article>
        `;
      })
      .join("");
  }

  yearFilter.addEventListener("change", render);
  artistFilter.addEventListener("change", render);
  render();
}

function renderTravelCard(item) {
  const detailUrl = `${resolveSitePath("travel/detail.html")}?slug=${encodeURIComponent(item.slug)}`;
  const cover = item.coverImage ? `<img class="travel-cover" src="${escapeHtml(resolveSitePath(item.coverImage))}" alt="${escapeHtml(getTravelTitle(item))}">` : "";
  const countries = item.countries.map(getCountryLabel).join(", ");
  return `
    <article class="travel-card">
      ${cover}
      <span class="card-kicker">${escapeHtml(item.dateRange.label)}</span>
      <h3>${escapeHtml(getTravelTitle(item))}</h3>
      <p>${escapeHtml(getTravelSummary(item))}</p>
      <div class="meta-chip-row">
        <span class="meta-chip">${escapeHtml(countries)}</span>
        <span class="meta-chip">${escapeHtml(`${item.routeCities.length} stops`)}</span>
      </div>
      <div class="card-actions">
        <a class="button-link" href="${escapeHtml(detailUrl)}">Open trip log</a>
      </div>
    </article>
  `;
}

async function initTravelIndex() {
  const trips = await fetchJSON("data/travel.json");
  const grid = document.getElementById("travel-grid");
  const stats = document.getElementById("travel-stats");

  const sorted = trips.slice().sort((a, b) => new Date(b.dateRange.start) - new Date(a.dateRange.start));
  grid.innerHTML = sorted.map(renderTravelCard).join("");

  const visitedCodes = [...new Set(sorted.flatMap((trip) => trip.countries.map(getCountryCode)))];
  const visitedStops = sorted.reduce((total, trip) => total + trip.routeCities.length, 0);
  stats.innerHTML = `
    <span>${visitedCodes.length} countries / regions</span>
    <span>${sorted.length} trips</span>
    <span>${visitedStops} mapped stops</span>
  `;

  const mapContainer = document.getElementById("travel-map");
  if (mapContainer && window.jsVectorMap) {
    new window.jsVectorMap({
      selector: "#travel-map",
      map: "world",
      zoomButtons: false,
      selectedRegions: visitedCodes,
      regionStyle: {
        initial: {
          fill: "#f6eee7",
          stroke: "#cab2a3",
          strokeWidth: 1
        },
        hover: {
          fill: "#f2ccb4"
        },
        selected: {
          fill: "#d88f74"
        }
      },
      backgroundColor: "transparent",
      onRegionTooltipShow(_, tooltip, code) {
        if (visitedCodes.includes(code)) {
          tooltip.text(`${tooltip.text()} · visited`);
        }
      }
    });
  }
}

async function initTravelDetail() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const trips = await fetchJSON("data/travel.json");
  const trip = trips.find((item) => item.slug === slug) || trips[0];

  if (!trip) {
    return;
  }

  document.title = `${getTravelTitle(trip)} | Oeight`;
  document.getElementById("travel-detail-title").textContent = getTravelTitle(trip);
  document.getElementById("travel-detail-summary").textContent = `${trip.summary.en} ${trip.summary.zh}`;
  document.getElementById("travel-detail-cover").src = resolveSitePath(trip.coverImage);
  document.getElementById("travel-detail-cover").alt = getTravelTitle(trip);

  const meta = document.getElementById("travel-detail-meta");
  const metaItems = [
    trip.dateRange.label,
    trip.countries.map(getCountryLabel).join(", "),
    `${trip.routeCities.length} route stops`
  ];
  meta.innerHTML = metaItems.map((item) => `<span class="meta-chip">${escapeHtml(item)}</span>`).join("");

  const bodyContainer = document.getElementById("travel-detail-body");
  const markdown = await fetchText(trip.markdownPath);
  if (window.marked?.parse) {
    bodyContainer.innerHTML = window.marked.parse(markdown);
  } else {
    bodyContainer.innerHTML = `<p>${escapeHtml(markdown)}</p>`;
  }

  const gallery = document.getElementById("travel-detail-gallery");
  gallery.innerHTML = trip.gallery
    .map((item) => {
      const imagePath = resolveSitePath(item.image);
      return `
        <figure class="gallery-card">
          <button
            class="gallery-image-button"
            type="button"
            data-lightbox-src="${escapeHtml(imagePath)}"
            data-lightbox-alt="${escapeHtml(item.alt || item.caption)}"
            data-lightbox-caption="${escapeHtml(item.caption)}"
          >
            <img src="${escapeHtml(imagePath)}" alt="${escapeHtml(item.alt || item.caption)}">
          </button>
          <figcaption class="gallery-caption">${escapeHtml(item.caption)}</figcaption>
        </figure>
      `;
    })
    .join("");

  const routeList = document.getElementById("travel-route-list");
  routeList.innerHTML = trip.routeCities
    .map(
      (stop, index) => `
        <li>
          <strong>${escapeHtml(`${index + 1}. ${stop.name}`)}</strong>
          <div>${escapeHtml(stop.note)}</div>
        </li>
      `
    )
    .join("");

  if (window.L) {
    const map = window.L.map("travel-route-map", {
      scrollWheelZoom: false
    });

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const latLngs = trip.routeCities.map((stop) => [stop.latitude, stop.longitude]);
    const polyline = window.L.polyline(latLngs, {
      color: "#c66f53",
      weight: 4,
      opacity: 0.9
    }).addTo(map);

    trip.routeCities.forEach((stop, index) => {
      const marker = window.L.marker([stop.latitude, stop.longitude], {
        icon: window.L.divIcon({
          className: "",
          html: `<span class="route-marker">${index + 1}</span>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        })
      }).addTo(map);
      marker.bindPopup(`<strong>${escapeHtml(stop.name)}</strong><br>${escapeHtml(stop.note)}`);
    });

    map.fitBounds(polyline.getBounds(), {
      padding: [24, 24]
    });
  }
}

async function initNow() {
  const entries = await fetchJSON("data/now.json");
  const stream = document.getElementById("now-stream");
  const sorted = entries.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (!sorted.length) {
    renderEmptyState(stream, "No now entries yet.");
    return;
  }

  stream.innerHTML = sorted
    .map(
      (entry) => `
        <article class="timeline-item">
          <time datetime="${escapeHtml(entry.timestamp)}">${escapeHtml(formatDate(entry.timestamp))}</time>
          <strong>${escapeHtml(entry.title)}</strong>
          <p>${escapeHtml(entry.body)}</p>
          <div class="timeline-meta">${escapeHtml(entry.tag)}</div>
        </article>
      `
    )
    .join("");
}

async function initGallery() {
  const groups = await fetchJSON("data/gallery.json");
  const container = document.getElementById("gallery-groups");

  if (!groups.length) {
    renderEmptyState(container, "No gallery groups yet.");
    return;
  }

  container.innerHTML = groups
    .map((group) => {
      const items = group.items
        .map((item) => {
          const imagePath = resolveSitePath(item.image);
          const relatedLink = item.relatedLink
            ? `<a class="card-link" href="${escapeHtml(resolveSitePath(item.relatedLink.url))}" ${item.relatedLink.external ? 'target="_blank" rel="noopener noreferrer"' : ""}>${escapeHtml(item.relatedLink.label)}</a>`
            : "";
          return `
            <figure class="gallery-card">
              <button
                class="gallery-image-button"
                type="button"
                data-lightbox-src="${escapeHtml(imagePath)}"
                data-lightbox-alt="${escapeHtml(item.alt || item.caption)}"
                data-lightbox-caption="${escapeHtml(item.caption)}"
              >
                <img src="${escapeHtml(imagePath)}" alt="${escapeHtml(item.alt || item.caption)}">
              </button>
              <figcaption class="gallery-caption">
                ${escapeHtml(item.caption)}
                ${relatedLink}
              </figcaption>
            </figure>
          `;
        })
        .join("");

      return `
        <section class="gallery-group section-card">
          <div class="section-heading">
            <p class="eyebrow">${escapeHtml(group.labelZh)} / ${escapeHtml(group.labelEn)}</p>
            <h2>${escapeHtml(group.title)}</h2>
            <p>${escapeHtml(group.description)}</p>
          </div>
          <div class="gallery-grid">${items}</div>
        </section>
      `;
    })
    .join("");
}

async function initPage() {
  initSharedShell();
  buildLightbox();

  try {
    if (page === "home") {
      await initHome();
    }
    if (page === "concerts") {
      await initConcerts();
    }
    if (page === "travel") {
      await initTravelIndex();
    }
    if (page === "travel-detail") {
      await initTravelDetail();
    }
    if (page === "now") {
      await initNow();
    }
    if (page === "gallery") {
      await initGallery();
    }
  } catch (error) {
    console.error(error);
  }
}

initPage();
