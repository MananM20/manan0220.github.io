/* ══════════════════════════════════════
   LOADER
══════════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('gone');
    initCanvas();
    revealOnScroll();
  }, 1500);
});

/* ══════════════════════════════════════
   PARTICLE CANVAS — Network topology
══════════════════════════════════════ */
function initCanvas() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles, mouse = { x: null, y: null };
  const COUNT = Math.min(window.innerWidth < 768 ? 50 : 90, 90);
  const MAX_DIST = 140;
  const MOUSE_DIST = 180;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); spawn(); });

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  function Particle() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 1.8 + 0.6;
    this.alpha = Math.random() * 0.5 + 0.2;
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  function spawn() { particles = Array.from({ length: COUNT }, () => new Particle()); }
  spawn();

  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update + draw nodes
    particles.forEach(p => {
      p.update();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(96,165,250,${p.alpha})`;
      ctx.fill();
    });

    // Connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const d = dist(particles[i], particles[j]);
        if (d < MAX_DIST) {
          const opacity = (1 - d / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(96,165,250,${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Connect mouse to nearby particles
    if (mouse.x !== null) {
      particles.forEach(p => {
        const d = dist(p, { x: mouse.x, y: mouse.y });
        if (d < MOUSE_DIST) {
          const opacity = (1 - d / MOUSE_DIST) * 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(34,211,238,${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    }

    requestAnimationFrame(draw);
  }

  draw();
}

/* ══════════════════════════════════════
   NAV — scroll solid
══════════════════════════════════════ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('solid', window.scrollY > 60);
}, { passive: true });

/* ══════════════════════════════════════
   BURGER MENU
══════════════════════════════════════ */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = burger.querySelectorAll('span');
  const open = navLinks.classList.contains('open');
  spans[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
  spans[1].style.opacity   = open ? '0' : '1';
  spans[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
});

navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = burger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '1';
    spans[2].style.transform = '';
  });
});

/* ══════════════════════════════════════
   SMOOTH SCROLL
══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ══════════════════════════════════════
   REVEAL ON SCROLL
══════════════════════════════════════ */
function revealOnScroll() {
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        // stagger children
        const delay = e.target.dataset.delay || 0;
        setTimeout(() => e.target.classList.add('shown'), delay);
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.dataset.delay = (i % 4) * 100;
    revealObs.observe(el);
  });

  // Skill bars
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.sbar-fill').forEach((bar, i) => {
          setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, i * 150);
        });
        e.target.querySelectorAll('.metric-fill').forEach(f => {
          f.style.width = f.style.width;
        });
        barObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-block').forEach(el => barObs.observe(el));

  // Metric bars in hero
  const metricObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.metric-fill').forEach((f, i) => {
          const w = f.style.width;
          f.style.width = '0';
          setTimeout(() => { f.style.width = w; }, i * 200 + 400);
        });
        metricObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  const dashCard = document.querySelector('.dash-card');
  if (dashCard) metricObs.observe(dashCard);

  // Counters
  const cntObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.count').forEach(el => animateCount(el));
        cntObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  const dashMetrics = document.querySelector('.dash-metrics');
  if (dashMetrics) cntObs.observe(dashMetrics);
}

/* ══════════════════════════════════════
   COUNTER ANIMATION
══════════════════════════════════════ */
function animateCount(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const dur = 2000;
  const step = target / (dur / 16);
  let cur = 0;
  const timer = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = (target < 10 ? cur.toFixed(1) : Math.floor(cur)) + suffix;
    if (cur >= target) clearInterval(timer);
  }, 16);
}

/* ══════════════════════════════════════
   ROLE CAROUSEL
══════════════════════════════════════ */
(function () {
  const items = document.querySelectorAll('.rc-item');
  if (!items.length) return;
  let cur = 0;

  setInterval(() => {
    items[cur].classList.remove('active');
    items[cur].classList.add('exit');
    setTimeout(() => items[cur % items.length].classList.remove('exit'), 500);
    cur = (cur + 1) % items.length;
    items[cur].classList.add('active');
  }, 2800);
})();

/* ══════════════════════════════════════
   3D TILT on project cards
══════════════════════════════════════ */
document.querySelectorAll('.proj-card, .dash-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ══════════════════════════════════════
   ACTIVE NAV LINK
══════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let active = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 150) active = s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    const isActive = a.getAttribute('href') === '#' + active;
    if (!a.classList.contains('nav-hire')) {
      a.style.color = isActive ? 'var(--text)' : '';
    }
  });
}, { passive: true });
