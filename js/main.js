/**
 * FLEUR — main.js
 *
 * Módulos:
 *   - headerScroll   : adiciona .scrolled ao fazer scroll
 *   - mobileMenu     : abre/fecha menu hamburguer
 *   - activeNavLink  : marca link ativo conforme seção visível
 *   - fadeIn         : anima entrada de elementos com Intersection Observer
 *   - footerYear     : preenche o ano atual no rodapé
 *   - smoothScroll   : fallback de scroll suave para browsers antigos
 */

'use strict';

/* ── Referências DOM ─────────────────────────────────────────── */
const header     = document.getElementById('header');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');
const yearEl     = document.getElementById('year');


/* ── 1. Header scroll ────────────────────────────────────────── */
function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 60);
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader(); // estado inicial


/* ── 2. Menu mobile ──────────────────────────────────────────── */
function openMenu() {
  navLinks.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.contains('open');
  isOpen ? closeMenu() : openMenu();
});

// Fecha ao clicar em qualquer link
navLinks.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Fecha ao pressionar Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    closeMenu();
    hamburger.focus();
  }
});


/* ── 3. Active nav link (IntersectionObserver) ───────────────── */
const sections   = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navLinkEls.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));


/* ── 4. Fade-in (IntersectionObserver) ──────────────────────── */
const fadeEls = document.querySelectorAll('.fade-in');

if (fadeEls.length) {
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target); // dispara apenas uma vez
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => fadeObserver.observe(el));
}


/* ── 5. Ano no rodapé ────────────────────────────────────────── */
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ── 6. Smooth scroll (fallback) ─────────────────────────────── */
// CSS scroll-behavior: smooth cobre a maioria dos browsers modernos.
// Este fallback garante o comportamento em Safari mais antigo.
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;

    if (CSS.supports('scroll-behavior', 'smooth')) return; // CSS handle it

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
