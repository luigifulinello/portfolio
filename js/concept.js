// Home page — work tabs + placeholder password modal for protected work.
(function () {
  const modal = document.getElementById('pwModal');
  const input = document.getElementById('pwInput');
  const error = document.getElementById('pwError');
  const form = document.getElementById('pwForm');
  let lastFocused = null;

  function openModal(trigger) {
    if (!modal) return;
    lastFocused = trigger || null;
    if (error) error.hidden = true;
    if (form) form.reset();
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (input) input.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  if (modal) {
    modal.querySelectorAll('[data-pw-close]').forEach((el) =>
      el.addEventListener('click', closeModal)
    );
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (error) error.hidden = false;
        if (input) { input.focus(); input.select(); }
      });
    }
  }

  // Tabs — Healthcare is gated: clicking it opens the modal instead of
  // filtering, so the protected cards are never revealed.
  const tabs = document.querySelectorAll('.tab');
  const cards = document.querySelectorAll('.card-item');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.dataset.filter === 'healthcare') {
        openModal(tab);
        return;
      }

      const filter = tab.dataset.filter;
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      cards.forEach((card) => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !show);
      });
      resetCarousel();
    });
  });

  // Safety net: if a healthcare card is ever shown, it opens the modal too.
  document.querySelectorAll('.card-item[data-category="healthcare"]').forEach((card) => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(card);
    });
  });

  // ---------- Work carousel: arrow controls (desktop) + swipe (touch) ----------
  const carousel = document.querySelector('.card-carousel');
  const track = carousel && carousel.querySelector('.card-track');
  const prevBtn = document.querySelector('.carousel-btn[data-dir="prev"]');
  const nextBtn = document.querySelector('.carousel-btn[data-dir="next"]');

  function step() {
    // One card width + gap, derived from the first visible card.
    const item = track && track.querySelector('.card-item:not(.is-hidden)');
    if (!item) return carousel ? carousel.clientWidth : 0;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return item.getBoundingClientRect().width + gap;
  }

  function updateButtons() {
    if (!carousel || !prevBtn || !nextBtn) return;
    const max = carousel.scrollWidth - carousel.clientWidth - 1;
    prevBtn.disabled = carousel.scrollLeft <= 0;
    nextBtn.disabled = carousel.scrollLeft >= max;
  }

  function resetCarousel() {
    if (!carousel) return;
    carousel.scrollTo({ left: 0, behavior: 'smooth' });
    // scrollTo is async; sync the buttons on the next frame too.
    requestAnimationFrame(updateButtons);
  }

  if (carousel && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () =>
      carousel.scrollBy({ left: -step(), behavior: 'smooth' })
    );
    nextBtn.addEventListener('click', () =>
      carousel.scrollBy({ left: step(), behavior: 'smooth' })
    );
    carousel.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);
    updateButtons();
  }

  // ---------- Work card parallax — images drift gently within their frame ----------
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const parallaxImgs = Array.from(document.querySelectorAll('.card img'));

  if (!reduceMotion && parallaxImgs.length) {
    const RANGE = 0.11; // fraction of card height the image travels each direction
    let ticking = false;

    function applyParallax() {
      ticking = false;
      const vh = window.innerHeight;
      for (const img of parallaxImgs) {
        const card = img.parentElement;
        const rect = card.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) continue; // skip offscreen cards
        // -1 as the card exits the top, +1 as it enters from the bottom
        const center = rect.top + rect.height / 2;
        const norm = (center - vh / 2) / (vh / 2 + rect.height / 2);
        const clamped = Math.max(-1, Math.min(1, norm));
        img.style.setProperty('--parallax', (clamped * rect.height * RANGE).toFixed(2) + 'px');
      }
    }

    function onParallaxScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(applyParallax); }
    }

    window.addEventListener('scroll', onParallaxScroll, { passive: true });
    window.addEventListener('resize', onParallaxScroll);
    applyParallax(); // set initial offsets
  }
})();
