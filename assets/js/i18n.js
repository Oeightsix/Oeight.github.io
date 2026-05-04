// ============================================================
//  i18n.js — Bilingual (ZH / EN) language switcher
//  Reads data-i18n="key" on elements and swaps text on toggle.
// ============================================================

export const translations = {
  zh: {
    /* Nav */
    "nav.home":     "首页",
    "nav.concerts": "演唱会",
    "nav.travel":   "足迹",
    "nav.now":      "近况",
    "nav.gallery":  "照片集",

    /* Brand subtitle */
    "brand.sub": "个人档案",

    /* Homepage hero */
    "hero.eyebrow":  "个人档案",
    "hero.tagline":  "把演唱会、足迹与温柔日常慢慢收集起来。",
    "hero.intro":    "这里更像一座个人档案馆，而不是一张正式的简历。演唱会的现场、旅行的路线、零散的照片，以及那些不想遗失的小念头，都会慢慢放进来。",

    /* Homepage explore section */
    "explore.eyebrow":   "探索",
    "explore.concerts":  "演唱会",
    "explore.travel":    "足迹",
    "explore.now":       "近况",
    "explore.gallery":   "照片集",

    /* Homepage redesign */
    "home.hero.eyebrow": "个人档案",
    "home.hero.meta": "现场笔记 01",
    "home.education.label": "教育背景",
    "home.about.eyebrow": "关于",
    "home.about.title": "简短说明",
    "home.featured.eyebrow": "精选栏目",
    "home.featured.title": "演唱会与足迹",
    "home.featured.concerts.eyebrow": "演唱会",
    "home.featured.concerts.title": "精选演出",
    "home.featured.travel.eyebrow": "足迹",
    "home.featured.travel.title": "精选旅行",
    "home.featured.watch": "观看",
    "home.featured.read": "阅读",
    "home.copy.placeholder": "等待你审核后的文字放在这里。",
    "home.education.placeholder": "教育信息会在你确认后展示在这里。",

    /* Stats labels (JS-rendered) */
    "stats.concerts": "场演唱会",
    "stats.trips":    "次旅行",
    "stats.notes":    "条近况",
    "stats.photos":   "张照片",

    /* Concerts page */
    "concerts.eyebrow": "演唱会档案",
    "concerts.title":   "每一个现场夜晚",
    "concerts.desc":    "城市、场馆与 Bilibili 录像，一一记录在档。",
    "concerts.filter.year":   "年份",
    "concerts.filter.artist": "歌手",
    "concerts.filter.all":    "全部",
    "concerts.watch":         "在 Bilibili 观看",
    "concerts.empty":         "没有符合筛选条件的演唱会。",

    /* Travel page */
    "travel.eyebrow": "足迹日志",
    "travel.title":   "去过的地方",
    "travel.desc":    "访问过的地区总览，以及每次旅行的路线日志。",
    "travel.regions": "个地区",
    "travel.trips":   "次旅行",
    "travel.stops":   "个停留点",
    "travel.map.eyebrow": "总览",
    "travel.map.title":   "地图总览",
    "travel.log.eyebrow": "旅行日志",
    "travel.log.title":   "每一次出发",
    "travel.open":        "打开旅行日志",

    /* Travel detail */
    "detail.eyebrow":  "旅行日志",
    "detail.gallery":  "旅途影像",

    /* Now page */
    "now.eyebrow": "近况流",
    "now.title":   "此刻",
    "now.desc":    "以时间戳记录，而不是精心打磨的文章。",
    "now.empty":   "暂无内容。",

    /* Gallery page */
    "gallery.eyebrow": "照片集",
    "gallery.title":   "照片集",
    "gallery.desc":    "按感觉分组的影像碎片，而非按时间线。",
    "gallery.empty":   "暂无照片组。",

    /* Lang toggle label */
    "lang.toggle": "EN",
  },

  en: {
    /* Nav */
    "nav.home":     "Home",
    "nav.concerts": "Concerts",
    "nav.travel":   "Travel",
    "nav.now":      "Now",
    "nav.gallery":  "Gallery",

    /* Brand subtitle */
    "brand.sub": "Personal Archive",

    /* Homepage hero */
    "hero.eyebrow":  "Personal Archive",
    "hero.tagline":  "An archive of concerts, routes, and warm ordinary moments.",
    "hero.intro":    "This is more like a personal archive than a formal portfolio — live show memories, travel routes, scattered photos, and small thoughts I don't want to lose.",

    /* Homepage explore section */
    "explore.eyebrow":   "Explore",
    "explore.concerts":  "Concerts",
    "explore.travel":    "Travel",
    "explore.now":       "Now",
    "explore.gallery":   "Gallery",

    /* Homepage redesign */
    "home.hero.eyebrow": "Personal Archive",
    "home.hero.meta": "Field Notes 01",
    "home.education.label": "Education",
    "home.about.eyebrow": "About",
    "home.about.title": "A concise note",
    "home.featured.eyebrow": "Featured",
    "home.featured.title": "Concerts & Travel",
    "home.featured.concerts.eyebrow": "Concerts",
    "home.featured.concerts.title": "Featured Concerts",
    "home.featured.travel.eyebrow": "Travel",
    "home.featured.travel.title": "Featured Travel",
    "home.featured.watch": "Watch",
    "home.featured.read": "Read",
    "home.copy.placeholder": "Approved homepage copy will appear here.",
    "home.education.placeholder": "Education details will appear here after approval.",

    /* Stats labels */
    "stats.concerts": "concerts",
    "stats.trips":    "trips",
    "stats.notes":    "notes",
    "stats.photos":   "photos",

    /* Concerts page */
    "concerts.eyebrow": "Concert Archive",
    "concerts.title":   "Every Live Night",
    "concerts.desc":    "Cities, venues, and Bilibili recordings — all archived.",
    "concerts.filter.year":   "Year",
    "concerts.filter.artist": "Artist",
    "concerts.filter.all":    "All",
    "concerts.watch":         "Watch on Bilibili",
    "concerts.empty":         "No concerts match the current filters.",

    /* Travel page */
    "travel.eyebrow": "Travel Logs",
    "travel.title":   "Places Visited",
    "travel.desc":    "An overview map of visited regions, with route logs for each trip.",
    "travel.regions": "regions",
    "travel.trips":   "trips",
    "travel.stops":   "stops",
    "travel.map.eyebrow": "Overview",
    "travel.map.title":   "World Map",
    "travel.log.eyebrow": "Trip Logs",
    "travel.log.title":   "Every Departure",
    "travel.open":        "Open Trip Log",

    /* Travel detail */
    "detail.eyebrow":  "Travel Log",
    "detail.gallery":  "Trip Gallery",

    /* Now page */
    "now.eyebrow": "Now Stream",
    "now.title":   "Right Now",
    "now.desc":    "Timestamped notes, not polished articles.",
    "now.empty":   "No entries yet.",

    /* Gallery page */
    "gallery.eyebrow": "Gallery",
    "gallery.title":   "Gallery",
    "gallery.desc":    "Moments grouped by feeling, not trapped in a timeline.",
    "gallery.empty":   "No gallery groups yet.",

    /* Lang toggle label */
    "lang.toggle": "中",
  }
};

/** Return the stored or browser-preferred language. Defaults to 'zh'. */
export function getStoredLang() {
  const stored = localStorage.getItem("oeight-lang");
  if (stored === "en" || stored === "zh") return stored;
  // Use browser preference as a hint
  const browser = navigator.language?.startsWith("zh") ? "zh" : "en";
  return browser;
}

/** Apply a language: update <html lang>, all [data-i18n] elements, and the toggle button. */
export function applyLang(lang) {
  const dict = translations[lang] || translations.zh;
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

  // Update all tagged elements
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key] !== undefined) {
      el.textContent = dict[key];
    }
  });

  // Update the toggle button label to show the OTHER language
  const btn = document.getElementById("lang-toggle-btn");
  if (btn) {
    btn.textContent = dict["lang.toggle"];
    btn.setAttribute("aria-label", lang === "zh" ? "Switch to English" : "切换为中文");
    btn.dataset.currentLang = lang;
  }

  // Persist
  localStorage.setItem("oeight-lang", lang);
  // Expose globally for JS-rendered content
  window.__siteLang = lang;
  window.__siteDict = dict;
  document.dispatchEvent(new CustomEvent("site:langchange", { detail: { lang } }));
}

/** Inject the toggle button into the nav and wire click to flip language. */
export function initLangToggle() {
  const nav = document.querySelector(".site-nav");
  if (!nav) return;

  const btn = document.createElement("button");
  btn.id = "lang-toggle-btn";
  btn.className = "lang-toggle";
  btn.type = "button";
  btn.textContent = "EN"; // will be overwritten by applyLang
  btn.setAttribute("aria-label", "Switch language");
  nav.after(btn);

  btn.addEventListener("click", () => {
    const current = btn.dataset.currentLang || "zh";
    applyLang(current === "zh" ? "en" : "zh");
  });
}

/** Convenience: get a translated string from the current active dict. */
export function t(key) {
  return (window.__siteDict || translations.zh)[key] || key;
}
