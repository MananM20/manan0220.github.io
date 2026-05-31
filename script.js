// ===== NAV SCROLL =====
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== HAMBURGER =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.querySelectorAll('span').forEach((s, i) => {
    s.style.transform = navLinks.classList.contains('open')
      ? i === 0 ? 'rotate(45deg) translate(5px, 5px)' : i === 1 ? 'opacity(0) scale(0)' : 'rotate(-45deg) translate(5px, -5px)'
      : '';
    if (i === 1) s.style.opacity = navLinks.classList.contains('open') ? '0' : '1';
  });
});

navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ===== INTERSECTION OBSERVER (fade in) =====
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.12 }
);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = (current < 10 ? current.toFixed(1) : Math.floor(current)) + suffix;
    if (current >= target) clearInterval(timer);
  }, 16);
}

const statsObserver = new IntersectionObserver(
  (entries) => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-target]').forEach(animateCounter);
      statsObserver.unobserve(e.target);
    }
  }),
  { threshold: 0.5 }
);

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navItems.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--text-primary)'
      : '';
  });
}, { passive: true });

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== TYPING EFFECT =====
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  const timer = setInterval(() => {
    element.textContent += text[i++];
    if (i >= text.length) clearInterval(timer);
  }, speed);
}

window.addEventListener('load', () => {
  const typed = document.querySelector('.typed-text');
  if (typed) {
    setTimeout(() => typeWriter(typed, typed.dataset.text || '', 40), 800);
  }
});
