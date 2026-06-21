/* main.js — Offscreen interactions */

// ── THEME TOGGLE ─────────────────────────────────
(function () {
  const root = document.documentElement;
  const toggles = document.querySelectorAll('[data-theme-toggle]');

  let currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', currentTheme);
  updateToggleIcon(currentTheme);

  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', currentTheme);
      updateToggleIcon(currentTheme);
      btn.setAttribute('aria-label', `Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`);
    });
  });

  function updateToggleIcon(theme) {
    const moonSVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    const sunSVG  = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    toggles.forEach(btn => {
      btn.innerHTML = theme === 'dark' ? sunSVG : moonSVG;
    });
  }
})();

// ── MOBILE NAV ───────────────────────────────────
(function () {
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.getElementById('nav-mobile');
  if (!hamburger || !mobileNav) return;

  let open = false;

  hamburger.addEventListener('click', () => {
    open = !open;
    hamburger.setAttribute('aria-expanded', String(open));
    mobileNav.setAttribute('aria-hidden', String(!open));
    mobileNav.classList.toggle('is-open', open);
    hamburger.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      open = false;
      hamburger.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
      mobileNav.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  const style = document.createElement('style');
  style.textContent = `
    .nav-hamburger.is-open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    .nav-hamburger.is-open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
    .nav-hamburger.is-open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
  `;
  document.head.appendChild(style);
})();

// ── SCROLL REVEAL ────────────────────────────────
(function () {
  const root = document.documentElement;
  let pending = Array.from(document.querySelectorAll('.reveal'));
  if (!pending.length) return;

  const revealAll = () => pending.forEach(el => el.classList.add('is-visible'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) { revealAll(); return; }

  root.classList.add('js-reveal');

  const check = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    pending = pending.filter(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < vh - 40 && rect.bottom > 0) {
        el.classList.add('is-visible');
        return false;
      }
      return true;
    });
    if (!pending.length) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; check(); });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('load', onScroll);

  check();
  requestAnimationFrame(check);
  setTimeout(check, 300);

  setTimeout(() => { if (pending.length) revealAll(); }, 4000);
})();

// ── NAV SCROLL STATE ─────────────────────────────
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ── SMOOTH ANCHOR SCROLL ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
