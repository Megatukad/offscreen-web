/* Offscreen — site interactions */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FORM_URL = 'https://forms.fillout.com/t/vpHvww8ndgus';

// ── SCROLL REVEAL ────────────────────────────────
(function () {
  const els = document.querySelectorAll('.rv');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

// ── IN-PAGE ANCHOR SCROLL ────────────────────────
// One eased scroll with a capped duration. Content in and above the target is
// revealed up front, so nothing slides in while the page is still moving.
(function () {
  const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function revealUpTo(target) {
    const bottom = target.getBoundingClientRect().top + window.scrollY + window.innerHeight;
    document.querySelectorAll('.rv:not(.in)').forEach(el => {
      if (el.getBoundingClientRect().top + window.scrollY < bottom) el.classList.add('in');
    });
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href*="#"]');
    if (!link || link.classList.contains('skip-link') || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const url = new URL(link.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const target = document.getElementById(url.hash.slice(1));
    if (!target) return;
    e.preventDefault();
    history.pushState(null, '', url.hash);
    revealUpTo(target);

    const startY = window.scrollY;
    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    const endY = Math.min(maxY, target.getBoundingClientRect().top + startY);
    if (reduceMotion) { window.scrollTo(0, endY); return; }
    const dist = endY - startY;
    const duration = Math.min(1100, 450 + Math.abs(dist) * 0.3);
    const t0 = performance.now();
    let cancelled = false;
    const cancel = () => { cancelled = true; };
    window.addEventListener('wheel', cancel, { once: true, passive: true });
    window.addEventListener('touchstart', cancel, { once: true, passive: true });
    (function step(now) {
      if (cancelled) return;
      const t = Math.min(1, (now - t0) / duration);
      window.scrollTo(0, startY + dist * ease(t));
      if (t < 1) requestAnimationFrame(step);
    })(t0);
  });
})();

// ── FOUNDER STATEMENT · LETTER-BY-LETTER REVEAL ──
// Splits the statement into its rendered lines, then letters, so each letter can
// flip up from behind its line's mask. Re-split on resize, since the line breaks
// move with the width.
(function () {
  const box = document.querySelector('.home-founder');
  const p = box && box.querySelector('.founder-statement');
  if (!p) return;
  const text = p.textContent.trim();
  let lastWidth = 0;

  function split() {
    if (p.offsetWidth === lastWidth) return;
    lastWidth = p.offsetWidth;
    p.textContent = '';
    const words = text.split(/\s+/).map(w => {
      const s = document.createElement('span');
      s.textContent = w;
      p.append(s, ' ');
      return s;
    });
    const lines = [];
    let top = null;
    words.forEach(w => {
      if (w.offsetTop !== top) { lines.push([]); top = w.offsetTop; }
      lines[lines.length - 1].push(w.textContent);
    });
    p.textContent = '';
    let last = 0;
    lines.forEach((ws, li) => {
      const line = document.createElement('span');
      const inner = document.createElement('span');
      line.className = 'fs-line';
      ws.forEach((w, wi) => {
        const word = document.createElement('span');
        word.className = 'fs-word';
        [...w].forEach((c, ci) => {
          const ch = document.createElement('span');
          ch.className = 'fs-ch';
          ch.textContent = c;
          // lines overlap: each starts a beat after the one above, letters ripple along it
          last = 0.3 + li * 0.14 + (inner.textContent.length + ci) * 0.012;
          ch.style.setProperty('--d', last.toFixed(3) + 's');
          word.appendChild(ch);
        });
        inner.appendChild(word);
        if (wi < ws.length - 1) inner.append(' ');
      });
      line.appendChild(inner);
      p.appendChild(line);
    });
    p.setAttribute('aria-label', text);
    box.style.setProperty('--util-d', (last + 0.3).toFixed(2) + 's');
  }

  if (reduceMotion || !('IntersectionObserver' in window)) { box.classList.add('is-in'); return; }
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  fontsReady.then(() => {
    split();
    let t;
    window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(split, 150); });
  });
  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { box.classList.add('is-in'); io.disconnect(); }
  }, { threshold: 0.35 });
  io.observe(box);
})();

// ── SITE MOTION · HEADLINE RISES, LABEL DECODE ───
(function () {
  const rises = [...document.querySelectorAll('.case-title h1, .svc .title-md, .row-name, .next-title')];
  const labels = [...document.querySelectorAll('.sec-head .label, .archive-intro .label, .next-text .label, .case-eyebrow, .hero-tag')];
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  rises.forEach((el, i) => {
    const inner = document.createElement('span');
    inner.className = 'rise-in';
    while (el.firstChild) inner.appendChild(el.firstChild);
    el.appendChild(inner);
    el.classList.add('rise');
    if (el.closest('.hero')) el.style.setProperty('--d', '0.5s');
    else if (el.closest('.svc')) el.style.setProperty('--d', (i % 2) * 0.12 + 's');
  });

  // mono labels resolve out of random glyphs, left to right
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  function decode(el) {
    const final = el.textContent;
    el.setAttribute('aria-label', final);
    const t0 = performance.now(), dur = 300 + final.length * 28;
    (function frame(now) {
      const p = Math.min(1, (now - t0) / dur);
      const fixed = Math.floor(p * final.length);
      el.textContent = [...final].map((c, i) =>
        i < fixed || !/[A-Z0-9]/i.test(c) ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]).join('');
      if (p < 1) requestAnimationFrame(frame); else el.textContent = final;
    })(t0);
  }

  const io = new IntersectionObserver((entries) => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    if (labels.includes(el)) decode(el); else el.classList.add('in');
    io.unobserve(el);
  }), { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
  [...rises, ...labels].forEach(el => io.observe(el));
})();

// ── PARALLAX + FOOTER WORDMARK REVEAL ────────────
(function () {
  if (reduceMotion) return;
  const pars = [...document.querySelectorAll('.par')];
  const page = document.querySelector('.page');
  const reveal = document.documentElement.classList.contains('reveal-footer');
  const bigmark = document.querySelector('.bigmark');
  const frow = document.querySelector('.footer-links');
  const wide = window.matchMedia('(min-width: 768px)');
  let ticking = false;

  function update() {
    const vh = window.innerHeight;
    pars.forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) el.style.transform = 'translateY(' + (-r.top * parseFloat(el.dataset.par)) + 'px)';
    });
    if (reveal && page && bigmark && frow) {
      if (wide.matches) {
        // p reaches 1 exactly when the page is scrolled to its end
        const p = Math.min(1, Math.max(0, 1 - page.getBoundingClientRect().bottom / vh));
        bigmark.style.transform = 'translateY(' + ((1 - p) * 105) + '%)';
        frow.style.transform = 'translateY(' + ((1 - p) * 90) + 'px)';
        frow.style.opacity = 0.25 + p * 0.75;
      } else {
        bigmark.style.transform = frow.style.transform = frow.style.opacity = '';
      }
    }
    ticking = false;
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();

// ── BRIEF FORM OVERLAY (Fillout) ─────────────────
// Every "Let's talk" link opens the same form in an overlay.
// Without JS (or with a modifier-click) the link opens the form in a new tab.
(function () {
  const dialog = document.getElementById('brief');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const body = dialog.querySelector('.brief-body');
  let lastTrigger = null;

  function open(trigger) {
    lastTrigger = trigger;
    if (!body.querySelector('iframe')) {
      const iframe = document.createElement('iframe');
      iframe.src = FORM_URL;
      iframe.title = "Let's talk — project brief form";
      iframe.allow = 'clipboard-write';
      iframe.addEventListener('load', () => body.querySelector('.brief-loading')?.remove());
      body.appendChild(iframe);
    }
    dialog.showModal();
    document.body.classList.add('brief-open');
  }

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-brief]');
    if (!trigger || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    open(trigger);
  });
  dialog.querySelector('.brief-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.classList.remove('brief-open');
    lastTrigger?.focus();
  });
})();

// ── ALL WORK · FILTERS, COUNT, HOVER PREVIEW ─────
(function () {
  const list = document.querySelector('.rows');
  if (!list) return;
  const items = [...list.querySelectorAll('li')];
  const count = document.getElementById('count');
  const filters = document.querySelector('.filters');
  const FILTERS_MIN = 3; // filters stay hidden until the archive has this many projects

  function setCount(visible) {
    const years = visible.map(li => Number(li.dataset.year)).filter(Boolean);
    const lo = Math.min(...years), hi = Math.max(...years);
    const span = !years.length ? '' : (lo === hi ? ' · ' + lo : ' · ' + lo + '–' + hi);
    count.textContent = String(visible.length).padStart(2, '0') + (visible.length === 1 ? ' PROJECT' : ' PROJECTS') + span;
  }
  setCount(items);

  if (filters && items.length >= FILTERS_MIN) {
    filters.hidden = false;
    const chips = [...filters.querySelectorAll('.flt')];
    chips.forEach(chip => chip.addEventListener('click', () => {
      chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
      const cat = chip.dataset.f;
      const visible = items.filter(li => cat === 'all' || li.dataset.cat.split(' ').includes(cat));
      items.forEach(li => { li.hidden = !visible.includes(li); });
      setCount(visible);
    }));
  }

  // cursor-following preview (mouse only)
  const prev = document.querySelector('.row-preview');
  if (!prev || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const prevImg = prev.querySelector('img');
  items.forEach(li => {
    const row = li.querySelector('.row');
    row.addEventListener('mouseenter', () => {
      prevImg.src = row.dataset.img;
      prev.classList.add('on');
      list.classList.add('has-hover');
    });
    row.addEventListener('mouseleave', () => {
      prev.classList.remove('on');
      list.classList.remove('has-hover');
    });
    row.addEventListener('mousemove', (e) => {
      const x = Math.min(e.clientX + 24, window.innerWidth - 320);
      const y = Math.max(8, Math.min(e.clientY - 190, window.innerHeight - 388));
      prev.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    });
  });
})();
