/* ═══════════════════════════════════════════════════
   ASOCIACIÓN — Shared JS
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── SLIDER ─────────────────────────────────────────
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('dots');
  let current = 0;
  let timer;

  if (slides.length && dotsContainer) {
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Slide ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(d);
    });

    function getDots() { return document.querySelectorAll('.dot'); }

    function goTo(n) {
      slides[current].classList.remove('active');
      getDots()[current].classList.remove('active');
      current = (n + slides.length) % slides.length;
      slides[current].classList.add('active');
      getDots()[current].classList.add('active');
      resetTimer();
    }

    window.changeSlide = function(dir) { goTo(current + dir); };

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), 5500);
    }

    resetTimer();
  }

  // ── SCROLL REVEAL ──────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));

  // Pillars green line animation
  const pillars = document.querySelectorAll('.pillar');
  const pillarObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        pillarObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  pillars.forEach(p => pillarObserver.observe(p));

  // ── FORM ───────────────────────────────────────────
  const form    = document.getElementById('suggestionForm');
  const success = document.getElementById('formSuccess');

  if (form && success) {
    form.addEventListener('submit', async (e) => {
      const action = form.getAttribute('action');

      if (!action || action === 'ACTION_URL_AQUÍ') {
        e.preventDefault();
        form.style.display = 'none';
        success.classList.add('visible');
        return;
      }

      e.preventDefault();
      const data = new FormData(form);
      const btn  = form.querySelector('.btn-submit');
      const originalHTML = btn.innerHTML;
      btn.textContent = '…';
      btn.disabled = true;

      try {
        const res = await fetch(action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          form.style.display = 'none';
          success.classList.add('visible');
        } else {
          btn.innerHTML = originalHTML;
          btn.disabled = false;
        }
      } catch {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
      }
    });
  }

  // ── NAV SCROLL SHRINK ──────────────────────────────
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ── LANGUAGE SWITCHER ──────────────────────────────
  const switcher = document.querySelector('.lang-switcher');
  if (switcher) {
    const btn = switcher.querySelector('.lang-btn');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      switcher.classList.toggle('open');
    });
    document.addEventListener('click', () => {
      switcher.classList.remove('open');
    });
  }

});
