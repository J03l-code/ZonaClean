/* =============================================
   ZONA CLEAN — Global JS
   Custom cursor, mobile nav, scroll reveal,
   sticky header, before/after slider
   ============================================= */

// ─── CUSTOM CURSOR ───────────────────────────
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (dot)  { dot.style.left  = mouseX + 'px'; dot.style.top  = mouseY + 'px'; }
});

function animateRing() {
  if (ring) {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
  }
  requestAnimationFrame(animateRing);
}
animateRing();

// Grow cursor on interactive elements
document.querySelectorAll('a, button, .service-list-item, .gallery-item').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-grow'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-grow'));
});

document.documentElement.classList.add('js-ready');
// ─── STICKY HEADER ───────────────────────────
const header = document.querySelector('.site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ─── MOBILE NAV ──────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ─── SCROLL REVEAL ───────────────────────────
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => io.observe(el));

// ─── COUNTER ANIMATION ───────────────────────
function animateCounter(el, target, suffix) {
  let start = 0;
  const duration = 2000;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart
    const val = Math.floor(ease * target);
    el.textContent = val + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counters = document.querySelectorAll('[data-count]');
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
      counterIO.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counters.forEach(el => counterIO.observe(el));

// ─── BEFORE/AFTER SLIDER ─────────────────────
function initSlider(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const handle  = container.querySelector('.ba-handle');
  const afterEl = container.querySelector('.ba-after');
  if (!handle || !afterEl) return;

  let dragging = false;

  function setPosition(clientX) {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const pct = (x / rect.width) * 100;
    handle.style.left = pct + '%';
    afterEl.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
  }

  // Mouse
  handle.addEventListener('mousedown', e => { dragging = true; e.preventDefault(); });
  window.addEventListener('mouseup',   () => { dragging = false; });
  window.addEventListener('mousemove', e => { if (dragging) setPosition(e.clientX); });

  // Touch
  handle.addEventListener('touchstart', e => { dragging = true; e.preventDefault(); }, { passive: false });
  window.addEventListener('touchend',   () => { dragging = false; });
  window.addEventListener('touchmove',  e => {
    if (dragging) { setPosition(e.touches[0].clientX); e.preventDefault(); }
  }, { passive: false });
}

initSlider('baSlider1');
initSlider('baSlider2');

// ─── CONTACT FORM ────────────────────────────
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type=submit]');
    btn.textContent = 'Enviando...';
    btn.disabled = true;
    setTimeout(() => {
      contactForm.reset();
      btn.textContent = 'Enviar Solicitud';
      btn.disabled = false;
      if (formSuccess) formSuccess.classList.add('show');
      setTimeout(() => formSuccess && formSuccess.classList.remove('show'), 5000);
    }, 1600);
  });
}
