/* ════════════════════════════════════════════════════════════
   FLEUR — interações
   Vanilla JS: preloader, header, menu, reveals, parallax,
   preview de marcas e lightbox da galeria.
   ════════════════════════════════════════════════════════════ */

(() => {
  "use strict";

  const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Preloader ──────────────────────────────────────────── */
  const loader = document.getElementById("loader");

  const finishLoading = () => {
    document.body.classList.add("is-loaded");
    loader.classList.add("is-done");
  };

  if (document.readyState === "complete") {
    finishLoading();
  } else {
    window.addEventListener("load", finishLoading);
    // segurança: nunca prender o visitante no loader
    setTimeout(finishLoading, 2500);
  }

  /* ── Header sólido ao rolar ─────────────────────────────── */
  const header = document.getElementById("header");

  const onScrollHeader = () => {
    header.classList.toggle("is-solid", window.scrollY > 40);
  };
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ── Menu mobile ────────────────────────────────────────── */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  const closeMenu = () => {
    navToggle.classList.remove("is-open");
    navLinks.classList.remove("is-open");
    header.classList.remove("menu-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeMenu();
  });

  /* ── Reveal on scroll ───────────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ── Parallax sutil ─────────────────────────────────────── */
  const parallaxEls = [...document.querySelectorAll("[data-parallax]")];

  if (!prefersReducedMotion && parallaxEls.length) {
    let ticking = false;

    const applyParallax = () => {
      const vh = window.innerHeight;
      parallaxEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        const strength = parseFloat(el.dataset.parallax);
        // progresso do elemento na viewport: -1 (abaixo) → 1 (acima)
        const progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2);
        el.style.transform = `translateY(${(-progress * strength).toFixed(2)}px)`;
      });
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(applyParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
    applyParallax();
  }

  /* ── Preview das marcas ─────────────────────────────────── */
  const brandsList = document.getElementById("brandsList");
  const previews = [...document.querySelectorAll("[data-preview]")];

  if (brandsList && previews.length) {
    const showPreview = (key) => {
      previews.forEach((img) =>
        img.classList.toggle("is-active", img.dataset.preview === key)
      );
    };

    brandsList.querySelectorAll(".brand").forEach((item) => {
      const key = item.dataset.brand;
      item.addEventListener("mouseenter", () => showPreview(key));
      item.addEventListener("focusin", () => showPreview(key));
    });
  }

  /* ── Lightbox da galeria ────────────────────────────────── */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const galleryItems = [...document.querySelectorAll(".gallery__item")];

  let currentIndex = -1;
  let lastFocused = null;

  const showImage = (index) => {
    currentIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    lightboxImg.src = item.dataset.full;
    lightboxImg.alt = item.querySelector("img").alt;
  };

  const openLightbox = (index) => {
    lastFocused = document.activeElement;
    showImage(index);
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add("is-open"));
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => {
      lightbox.hidden = true;
      lightboxImg.src = "";
    }, 400);
    if (lastFocused) lastFocused.focus();
  };

  galleryItems.forEach((item, i) =>
    item.addEventListener("click", () => openLightbox(i))
  );

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", () => showImage(currentIndex - 1));
  lightboxNext.addEventListener("click", () => showImage(currentIndex + 1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showImage(currentIndex - 1);
    if (e.key === "ArrowRight") showImage(currentIndex + 1);
  });

  /* ── Ano do rodapé ──────────────────────────────────────── */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
