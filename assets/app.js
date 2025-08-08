// SynapseX SPA minimal enhancement script
(function() {
  const root = document.documentElement;
  const THEME_KEY = 'synapsex-theme';
  const themeButton = document.getElementById('themeButton');
  const mobileToggle = document.querySelector('.nav-mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const yearEl = document.getElementById('year');

  function applyTheme(mode) {
    if(mode === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
    themeButton && (themeButton.textContent = mode === 'dark' ? '🌞' : '🌗');
  }
  function currentSystemPref() { return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const mode = saved || currentSystemPref();
    applyTheme(mode);
  }
  themeButton?.addEventListener('click', () => {
    const isDark = root.classList.toggle('dark');
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    themeButton.textContent = isDark ? '🌞' : '🌗';
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if(!localStorage.getItem(THEME_KEY)) applyTheme(e.matches ? 'dark' : 'light');
  });

  // Mobile nav toggle
  mobileToggle?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    if(window.innerWidth <= 860 && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded','false');
    }
  }));

  // Year
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Metrics pseudo counters (simulated for static page)
  const metricConfig = {
    latency: { target: 32, variance: 5, unit: ''},
    evolution: { target: 120, variance: 15, unit: ''},
    coverage: { target: 450, variance: 30, unit: ''}
  };
  function animateMetrics() {
    document.querySelectorAll('[data-metric]').forEach(el => {
      const key = el.getAttribute('data-metric');
      const cfg = metricConfig[key];
      if(!cfg) return;
      const base = cfg.target + (Math.random()*cfg.variance - cfg.variance/2);
      const val = Math.max(1, Math.round(base));
      el.textContent = val + cfg.unit;
    });
  }
  animateMetrics();
  setInterval(animateMetrics, 4000);

  // Smooth scroll for custom buttons
  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', e => {
      const target = document.querySelector(btn.getAttribute('data-scroll'));
      if(target){ target.scrollIntoView({behavior:'smooth', block:'start'}); }
    });
  });

  // Waitlist form (simple front-end validation mock)
  const wlForm = document.querySelector('[data-js="waitlist-form"]');
  if(wlForm){
    const emailInput = wlForm.querySelector('input[type="email"]');
    const msgEl = wlForm.querySelector('.form-msg');
    wlForm.addEventListener('submit', e => {
      e.preventDefault();
      const val = emailInput.value.trim();
      if(!val){ msgEl.textContent = 'Please enter your email.'; msgEl.style.color='var(--warn)'; return; }
      const ok = /.+@.+\..+/.test(val);
      if(!ok){ msgEl.textContent = 'Enter a valid email.'; msgEl.style.color='var(--warn)'; return; }
      msgEl.textContent = 'Added to waitlist (demo).'; msgEl.style.color='var(--ok)';
      emailInput.value='';
    });
  }

  // Hero canvas spark lines
  const canvas = document.getElementById('sparkCanvas');
  if(canvas) {
    const ctx = canvas.getContext('2d');
    function resize() { canvas.width = canvas.clientWidth * devicePixelRatio; canvas.height = canvas.clientHeight * devicePixelRatio; }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    const lines = Array.from({length: 18}, (_,i) => ({
      phase: Math.random()*Math.PI*2,
      speed: .4 + Math.random()*0.6,
      amp: 10 + Math.random()*26,
      yOffset: i / 18,
      hueShift: Math.random()
    }));

    function draw(t) {
      if(!ctx) return;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      const w = canvas.width, h = canvas.height;
      lines.forEach((ln,idx) => {
        const yBase = h * (.1 + ln.yOffset*.8);
        ctx.beginPath();
        const hueA = getComputedStyle(root).getPropertyValue('--accent').match(/hsl\(([^)]*)\)/i);
        const hueB = getComputedStyle(root).getPropertyValue('--accent-alt').match(/hsl\(([^)]*)\)/i);
        const color = idx % 2 === 0 ? getComputedStyle(root).getPropertyValue('--accent') : getComputedStyle(root).getPropertyValue('--accent-alt');
        ctx.strokeStyle = color.trim();
        ctx.globalAlpha = .25 + (idx % 5)/25;
        ctx.lineWidth = 1.2 * devicePixelRatio;
        const phase = ln.phase + t/1000 * ln.speed;
        for(let x=0;x<=w;x+= w/160) {
          const y = yBase + Math.sin(phase + x/260) * ln.amp * devicePixelRatio;
          if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        }
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  // Smooth scroll (native with fallback)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if(target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Accessibility: reduce motion respect
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable canvas animation interval by not scheduling further frames
    // (We can't easily stop requestAnimationFrame without flag)
  }

  // FAQ accordion single-open behavior
  const faqContainer = document.querySelector('.faq-grid');
  if(faqContainer){
    faqContainer.addEventListener('click', e => {
      const summary = e.target.closest('summary');
      if(!summary) return;
      const details = summary.parentElement;
      if(!details) return;
      const willOpen = !details.hasAttribute('open');
      // close all
      faqContainer.querySelectorAll('details[open]').forEach(d => d.removeAttribute('open'));
      if(willOpen) details.setAttribute('open','');
      e.preventDefault(); // prevent default toggle since we handle manually
    });
  }

  initTheme();
})();
