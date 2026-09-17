// =========================================================
// This file reads the `photos` array from js/photos-data.js
// (that file must be loaded first in index.html — it already is).
// =========================================================

// Pick exactly which photos float in the hero bubbles by listing
// their filenames here (must match a "src" in photos-data.js exactly).
// Leave the array empty [] to fall back to auto-picking a spread of photos.
const HERO_BUBBLE_PHOTOS = [
  "images/Photo-35.jpg",
  "images/Photo-06.jpg",
  "images/Photo-10.jpg",
  "images/Photo-15.jpg",
];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  buildGallery();
  buildFeatured();
  setupFilters();
  setupNavToggle();
  setupLightbox();
  setupAmbientSparkles();
  setupCursorSparkles();
  setupHeroBubbles();
});

/* ---------------------------------------------------------
   Build gallery cards from the photos array
--------------------------------------------------------- */
function buildGallery() {
  const grid = document.getElementById("galleryGrid");
  if (typeof photos === "undefined" || !photos.length) {
    grid.innerHTML = "<p style='text-align:center;'>Add your photos in js/photos-data.js!</p>";
    return;
  }

  photos.forEach((photo, index) => {
    const card = document.createElement("button");
    card.className = "photo-card";
    card.dataset.category = photo.category;
    card.dataset.index = index;
    card.setAttribute("aria-label", "Open photo " + (index + 1));

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = "Cosplay photography — " + photo.category;
    img.loading = "lazy";

    card.appendChild(img);
    card.addEventListener("click", () => openLightbox(index));
    grid.appendChild(card);
  });
}

/* ---------------------------------------------------------
   Build the Favorites section from photos marked featured: true
--------------------------------------------------------- */
function buildFeatured() {
  const section = document.getElementById("featured");
  const grid = document.getElementById("featuredGrid");
  if (typeof photos === "undefined" || !photos.length) return;

  const featuredPhotos = photos
    .map((photo, index) => ({ photo, index }))
    .filter((entry) => entry.photo.featured);

  if (!featuredPhotos.length) {
    section.style.display = "none";
    return;
  }

  const featuredIndices = featuredPhotos.map((entry) => entry.index);

  featuredPhotos.forEach(({ photo, index }) => {
    const card = document.createElement("button");
    card.className = "featured-card";
    card.setAttribute("aria-label", "Open favorite photo " + (index + 1));

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = "Favorite cosplay photo — " + photo.category;
    img.loading = "lazy";

    card.appendChild(img);
    card.addEventListener("click", () => openLightbox(index, featuredIndices));
    grid.appendChild(card);
  });
}

/* ---------------------------------------------------------
   Hero cover-photo bubbles
   Picks a handful of photos spread across the array so the
   hero shows a preview of different shoots. Edit HERO_BUBBLE_COUNT
   or the picked indices below if you want specific photos featured.
--------------------------------------------------------- */
function setupHeroBubbles() {
  const container = document.getElementById("heroBubbles");
  if (typeof photos === "undefined" || !photos.length) return;

  const HERO_BUBBLE_COUNT = 4;
  let chosen = [];

  if (HERO_BUBBLE_PHOTOS.length) {
    // Use the exact photos listed at the top of this file
    chosen = HERO_BUBBLE_PHOTOS
      .map((src) => photos.find((p) => p.src === src))
      .filter(Boolean); // ignores any filename that doesn't match
  }

  if (!chosen.length) {
    // Fallback: auto-pick a spread across the full photo list
    const step = Math.max(1, Math.floor(photos.length / HERO_BUBBLE_COUNT));
    for (let i = 0; i < HERO_BUBBLE_COUNT; i++) {
      chosen.push(photos[(i * step) % photos.length]);
    }
  }

  chosen.forEach((photo, i) => {
    const bubble = document.createElement("div");
    bubble.className = "hero-bubble hero-bubble-" + (i + 1);

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = "";
    img.loading = "lazy";

    bubble.appendChild(img);
    container.appendChild(bubble);
  });
}

/* ---------------------------------------------------------
   Filter buttons
--------------------------------------------------------- */
function setupFilters() {
  const bar = document.getElementById("filterBar");
  const buttons = bar.querySelectorAll(".filter-pill");

  bar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-pill");
    if (!btn) return;

    buttons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    document.querySelectorAll(".photo-card").forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !show);
    });
  });
}

/* ---------------------------------------------------------
   Mobile nav toggle
--------------------------------------------------------- */
function setupNavToggle() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen);
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------------------------------------------------------
   Lightbox
--------------------------------------------------------- */
let currentIndex = 0;
let visibleIndices = [];

function setupLightbox() {
  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  document.getElementById("lightboxPrev").addEventListener("click", () => stepLightbox(-1));
  document.getElementById("lightboxNext").addEventListener("click", () => stepLightbox(1));

  const lightbox = document.getElementById("lightbox");
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.hasAttribute("hidden")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });
}

function getVisibleIndices() {
  return Array.from(document.querySelectorAll(".photo-card"))
    .filter((card) => !card.classList.contains("hidden"))
    .map((card) => Number(card.dataset.index));
}

function openLightbox(index, indices) {
  visibleIndices = indices || getVisibleIndices();
  currentIndex = index;
  renderLightbox();
  document.getElementById("lightbox").removeAttribute("hidden");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.getElementById("lightbox").setAttribute("hidden", "");
  document.body.style.overflow = "";
}

function stepLightbox(direction) {
  const pos = visibleIndices.indexOf(currentIndex);
  const nextPos = (pos + direction + visibleIndices.length) % visibleIndices.length;
  currentIndex = visibleIndices[nextPos];
  renderLightbox();
}

function renderLightbox() {
  const photo = photos[currentIndex];
  document.getElementById("lightboxImg").src = photo.src;
  document.getElementById("lightboxImg").alt = "Cosplay photography — " + photo.category;
  document.getElementById("lightboxCaption").textContent = photo.category;
}

/* ---------------------------------------------------------
   Ambient drifting sparkles in the background
--------------------------------------------------------- */
function setupAmbientSparkles() {
  const field = document.getElementById("sparkleField");
  const symbols = ["✦", "✧", "⋆", "✩", "☆"];
  const count = window.innerWidth < 640 ? 12 : 22;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "sparkle";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 100 + "vw";
    el.style.setProperty("--size", (0.6 + Math.random() * 1.4) + "rem");
    el.style.setProperty("--dur", (8 + Math.random() * 10) + "s");
    el.style.setProperty("--delay", (Math.random() * 10) + "s");
    el.style.setProperty("--drift", (Math.random() * 80 - 40) + "px");
    field.appendChild(el);
  }
}

/* ---------------------------------------------------------
   Little sparkles that follow the cursor (throttled)
--------------------------------------------------------- */
function setupCursorSparkles() {
  // Skip on touch-only devices — no cursor to follow
  if (window.matchMedia("(hover: none)").matches) return;

  const symbols = ["✦", "✧", "⋆"];
  let lastTime = 0;

  document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastTime < 60) return; // throttle
    lastTime = now;

    const el = document.createElement("span");
    el.className = "cursor-sparkle";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = e.clientX + "px";
    el.style.top = e.clientY + "px";
    document.body.appendChild(el);

    setTimeout(() => el.remove(), 700);
  });
}
