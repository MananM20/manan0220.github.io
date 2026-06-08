/* ════════════════════════════════════════
   LOADER
════════════════════════════════════════ */
const ldBar = document.getElementById("ldBar");
const ldStatus = document.getElementById("ldStatus");
const loader = document.getElementById("loader");
const statuses = [
  "BOOTING KERNEL...",
  "LOADING MODULES...",
  "CONNECTING SYSTEMS...",
  "DEPLOYING PORTFOLIO...",
  "READY.",
];
let ldProg = 0;

const ldInterval = setInterval(() => {
  ldProg = Math.min(ldProg + Math.random() * 12, 100);
  ldBar.style.width = ldProg + "%";
  ldStatus.textContent =
    statuses[Math.floor((ldProg / 100) * (statuses.length - 1))];

  if (ldProg >= 100) {
    clearInterval(ldInterval);
    setTimeout(() => {
      loader.classList.add("out");
      initAll();
    }, 400);
  }
}, 80);

/* ════════════════════════════════════════
   INIT ALL
════════════════════════════════════════ */
function initAll() {
  initGlow();
  initNav();
  initProgress();
  initReveal();
  initBars();
  initCounters();
  initScramble();
  initMagnetic();
  initBurger();
  initSmoothScroll();
  animateHeroName();
  initRoleTypewriter();
}

/* ════════════════════════════════════════
   MOUSE GLOW FOLLOWER
════════════════════════════════════════ */
function initGlow() {
  const glow = document.getElementById("glow");
  let tx = -500,
    ty = -500;
  let cx = tx,
    cy = ty;

  document.addEventListener("mousemove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });

  function track() {
    cx += (tx - cx) * 0.1;
    cy += (ty - cy) * 0.1;
    glow.style.left = cx + "px";
    glow.style.top = cy + "px";
    requestAnimationFrame(track);
  }
  track();
}

/* ════════════════════════════════════════
   NAV SCROLL
════════════════════════════════════════ */
function initNav() {
  const nav = document.getElementById("nav");
  window.addEventListener(
    "scroll",
    () => {
      nav.classList.toggle("scrolled", window.scrollY > 60);
    },
    { passive: true },
  );
}

/* ════════════════════════════════════════
   SCROLL PROGRESS BAR
════════════════════════════════════════ */
function initProgress() {
  const bar = document.getElementById("progress");
  window.addEventListener(
    "scroll",
    () => {
      const pct =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;
      bar.style.width = pct + "%";
    },
    { passive: true },
  );
}

/* ════════════════════════════════════════
   REVEAL ON SCROLL
════════════════════════════════════════ */
function initReveal() {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          const delay = parseFloat(e.target.dataset.delay || 0);
          setTimeout(() => e.target.classList.add("shown"), delay);
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08 },
  );

  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.dataset.delay = (i % 5) * 80;
    obs.observe(el);
  });
}

/* ════════════════════════════════════════
   TECH CHIP — hover stagger
════════════════════════════════════════ */
function initBars() {
  // Stagger-animate tech chips when section enters view
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.querySelectorAll(".tg-chip").forEach((chip, i) => {
            chip.style.opacity = "0";
            chip.style.transform = "translateY(10px)";
            setTimeout(
              () => {
                chip.style.transition =
                  "opacity 0.4s ease, transform 0.4s ease";
                chip.style.opacity = "1";
                chip.style.transform = "translateY(0)";
              },
              i * 30 + 100,
            );
          });
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  const grid = document.querySelector(".tech-grid");
  if (grid) obs.observe(grid);
}

/* ════════════════════════════════════════
   COUNTERS
════════════════════════════════════════ */
function runCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || "";
  // Set final value immediately so it's never stuck at 0
  el.textContent = target + suffix;
  // Then animate from 0
  let cur = 0;
  const step = target / (2000 / 16);
  el.textContent = "0" + suffix;
  const t = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = (target < 10 ? cur.toFixed(1) : Math.floor(cur)) + suffix;
    if (cur >= target) {
      el.textContent = target + suffix;
      clearInterval(t);
    }
  }, 16);
}

function initCounters() {
  const strip = document.querySelector(".impact-strip");
  if (!strip) return;

  // Fire immediately if already in viewport (hero/about visible on load)
  const rect = strip.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    strip.querySelectorAll(".count").forEach(runCounter);
    return;
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.querySelectorAll(".count").forEach(runCounter);
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.4 },
  );

  obs.observe(strip);
}

/* ════════════════════════════════════════
   TEXT SCRAMBLE
════════════════════════════════════════ */
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&";

function scramble(el, final) {
  let frame = 0;
  const total = final.length * 4;
  const timer = setInterval(() => {
    el.textContent = final
      .split("")
      .map((c, i) => {
        if (c === " ") return " ";
        if (frame > i * 4) return final[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join("");
    if (frame >= total) {
      clearInterval(timer);
      el.textContent = final;
    }
    frame++;
  }, 28);
}

function initScramble() {
  // Scramble section titles on scroll
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const final = e.target.dataset.scramble;
          if (final) scramble(e.target, final);
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  document.querySelectorAll("[data-scramble]").forEach((el) => obs.observe(el));

  // Scramble hero name on load (after reveal)
  setTimeout(() => {
    const a = document.querySelector(".hn-a");
    const b = document.querySelector(".hn-b");
    if (a) scramble(a, "MANAN");
    setTimeout(() => {
      if (b) scramble(b, "MITTAL");
    }, 300);
  }, 200);
}

/* ════════════════════════════════════════
   MAGNETIC BUTTONS
════════════════════════════════════════ */
function initMagnetic() {
  document.querySelectorAll(".mag").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
      btn.style.transition = "transform 0.5s cubic-bezier(0.16,1,0.3,1)";
      setTimeout(() => {
        btn.style.transition = "";
      }, 500);
    });
  });
}

/* ════════════════════════════════════════
   BURGER MENU
════════════════════════════════════════ */
function initBurger() {
  const burger = document.getElementById("burger");
  const links = document.getElementById("nLinks");

  burger?.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    const spans = burger.querySelectorAll("span");
    spans[0].style.transform = open ? "rotate(45deg) translate(6px, 6px)" : "";
    spans[1].style.transform = open ? "rotate(-45deg) translate(0, 0)" : "";
    spans[1].style.marginTop = open ? "-8px" : "";
  });

  links?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      const spans = burger.querySelectorAll("span");
      spans[0].style.transform = "";
      spans[1].style.transform = "";
      spans[1].style.marginTop = "";
    });
  });
}

/* ════════════════════════════════════════
   SMOOTH SCROLL
════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const t = document.querySelector(a.getAttribute("href"));
      if (t) {
        e.preventDefault();
        t.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

/* ════════════════════════════════════════
   HERO NAME ANIMATE IN
════════════════════════════════════════ */
function animateHeroName() {
  const a = document.querySelector(".hn-a");
  const b = document.querySelector(".hn-b");
  if (!a || !b) return;

  a.style.opacity = "0";
  a.style.transform = "translateY(60px)";
  b.style.opacity = "0";
  b.style.transform = "translateY(60px)";

  const ease = "cubic-bezier(0.16, 1, 0.3, 1)";
  setTimeout(() => {
    a.style.transition = `opacity 1s ${ease}, transform 1s ${ease}`;
    a.style.opacity = "1";
    a.style.transform = "translateY(0)";
    setTimeout(() => {
      b.style.transition = `opacity 1s ${ease}, transform 1s ${ease}`;
      b.style.opacity = "1";
      b.style.transform = "translateY(0)";
    }, 150);
  }, 100);
}

/* ════════════════════════════════════════
   HERO ROLE TYPEWRITER
════════════════════════════════════════ */
function initRoleTypewriter() {
  const el = document.getElementById("heroRole");
  if (!el) return;

  const roles = ["Cloud Engineer", "AI Cloud Engineer", "DevOps Engineer"];
  let roleIdx = 0,
    charIdx = 0,
    deleting = false;

  function tick() {
    const current = roles[roleIdx];

    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 80);
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, 45);
    }
  }

  setTimeout(tick, 900);
}

/* ════════════════════════════════════════
   ACTIVE NAV HIGHLIGHT
════════════════════════════════════════ */
window.addEventListener(
  "scroll",
  () => {
    let active = "";
    document.querySelectorAll("section[id]").forEach((s) => {
      if (window.scrollY >= s.offsetTop - 160) active = s.id;
    });
    document.querySelectorAll(".n-links a").forEach((a) => {
      const isActive = a.getAttribute("href") === "#" + active;
      if (!a.classList.contains("n-cta")) {
        a.style.color = isActive ? "var(--text)" : "";
      }
    });
  },
  { passive: true },
);
