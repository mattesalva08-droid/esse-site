/* =========================================================
   ESSE WEBSITE INTERACTIONS - Vanilla JavaScript
   ========================================================= */

const body = document.body;
const header = document.querySelector('#siteHeader');
const progress = document.querySelector('.scroll-progress');
const backToTop = document.querySelector('.back-to-top');
const cursor = document.querySelector('.custom-cursor');
const cursorGlow = document.querySelector('.cursor-glow');

/* ---------- PRELOADER ---------- */
window.addEventListener('load', () => {
  const preloader = document.querySelector('.preloader');
  setTimeout(() => preloader?.classList.add('is-hidden'), 700);
});

/* ---------- DYNAMIC NAVBAR + PROGRESS ---------- */
function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
  progress.style.width = `${percent}%`;
  header?.classList.toggle('is-scrolled', window.scrollY > 40);
  backToTop?.classList.toggle('is-visible', window.scrollY > 700);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- MOBILE NAV ---------- */
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.classList.toggle('is-open');
  mainNav?.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle?.classList.remove('is-open');
    mainNav.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- CUSTOM CURSOR ---------- */
if (cursor && cursorGlow && matchMedia('(pointer:fine)').matches) {
  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  function animateCursor() {
    glowX += (mouseX - glowX) * 0.13;
    glowY += (mouseY - glowY) * 0.13;
    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top = `${glowY}px`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .gallery-item, .service-card, .contact-card').forEach(el => {
    el.addEventListener('mouseenter', () => body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => body.classList.remove('cursor-hover'));
  });
}

/* ---------- SCROLL REVEAL ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
  revealObserver.observe(el);
});

/* ---------- PARALLAX ---------- */
const parallaxItems = document.querySelectorAll('[data-parallax]');
function parallaxMove() {
  parallaxItems.forEach(el => {
    const speed = Number(el.dataset.parallax || 0.05);
    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height / 2 - window.innerHeight / 2;
    el.style.transform = `translate3d(0, ${center * speed}px, 0)`;
  });
}
window.addEventListener('scroll', parallaxMove, { passive: true });
parallaxMove();

/* ---------- MAGNETIC HOVER ---------- */
document.querySelectorAll('.magnetic').forEach(item => {
  item.addEventListener('mousemove', e => {
    if (!matchMedia('(pointer:fine)').matches) return;
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
  });
  item.addEventListener('mouseleave', () => item.style.transform = '');
});

/* ---------- RIPPLE FEEDBACK ---------- */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
});

/* ---------- COUNTERS ---------- */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const counter = entry.target;
    const target = Number(counter.dataset.counter);
    const duration = 1700;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      counter.textContent = Math.floor(target * eased).toLocaleString('it-IT');
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
    counterObserver.unobserve(counter);
  });
}, { threshold: 0.55 });

document.querySelectorAll('[data-counter]').forEach(counter => counterObserver.observe(counter));

/* ---------- FAQ ACCORDION ---------- */
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  btn?.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');
    document.querySelectorAll('.faq-item.is-open').forEach(openItem => {
      openItem.classList.remove('is-open');
      openItem.querySelector('.faq-answer').style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add('is-open');
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  });
});

/* ---------- LIGHTBOX GALLERY ---------- */
const galleryItems = [...document.querySelectorAll('.gallery-item')];
const lightbox = document.querySelector('.lightbox');
const lightboxImg = lightbox?.querySelector('img');
const lightboxCaption = lightbox?.querySelector('.lightbox__caption');
let currentIndex = 0;

function openLightbox(index) {
  if (!lightbox || !lightboxImg) return;
  currentIndex = index;
  const item = galleryItems[currentIndex];
  const img = item.querySelector('img');
  const caption = item.querySelector('figcaption')?.textContent || img.alt;
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = caption;
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox?.classList.remove('is-open');
  lightbox?.setAttribute('aria-hidden', 'true');
  body.style.overflow = '';
}

function nextImage(direction) {
  if (!galleryItems.length) return;
  currentIndex = (currentIndex + direction + galleryItems.length) % galleryItems.length;
  openLightbox(currentIndex);
}

galleryItems.forEach((item, index) => item.addEventListener('click', () => openLightbox(index)));
document.querySelector('.lightbox__close')?.addEventListener('click', closeLightbox);
document.querySelector('.lightbox__prev')?.addEventListener('click', () => nextImage(-1));
document.querySelector('.lightbox__next')?.addEventListener('click', () => nextImage(1));
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
window.addEventListener('keydown', e => {
  if (!lightbox?.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextImage(1);
  if (e.key === 'ArrowLeft') nextImage(-1);
});

/* ---------- LAZY IMAGE DECODE ---------- */
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  img.addEventListener('load', () => img.classList.add('loaded'));
});

/* ---------- BACK TO TOP & YEAR ---------- */
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

/* ---------- LOOP TICKER DUPLICATION ---------- */
const ticker = document.querySelector('.ticker-track');
if (ticker) {
  ticker.innerHTML += ticker.innerHTML;
}
