// Home page — work tabs. Healthcare routes straight to the Waystar case study.
(function () {
  const tabs = document.querySelectorAll('.tab');
  const cards = document.querySelectorAll('.card-item');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      // Healthcare is a direct link to the Waystar case study (see index.html);
      // let the anchor's href navigate, and skip the filter logic.
      if (tab.dataset.filter === 'healthcare') return;

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

  // ---------- Section intro reveal ----------
  // Adds .is-in when a section scrolls into view; fires on load for sections
  // already visible (e.g. Selected Work near the top). CSS handles the motion.
  // .has-reveal gates the initial hidden state so script-less pages stay visible.
  document.documentElement.classList.add('has-reveal');

  // Footer lead: wrap words in spans (preserving <br>) and stagger delays so
  // it builds left -> right, first line then second (see concept.css).
  const footerLead = document.querySelector('.footer-lead');
  if (footerLead) {
    const lines = footerLead.innerHTML
      .split(/<br\s*\/?>/i)
      .map((html) => {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent.trim();
      })
      .filter(Boolean);
    footerLead.textContent = '';
    let wi = 0;
    lines.forEach((line, li) => {
      if (li > 0) footerLead.appendChild(document.createElement('br'));
      const words = line.split(/\s+/);
      words.forEach((w, i) => {
        const span = document.createElement('span');
        span.className = 'fl-word';
        span.textContent = w;
        span.style.transitionDelay = (wi * 0.12 + li * 0.15).toFixed(2) + 's';
        footerLead.appendChild(span);
        if (i < words.length - 1) footerLead.appendChild(document.createTextNode(' '));
        wi++;
      });
    });
  }
  const revealSections = document.querySelectorAll('.work, .about, .site-footer');
  if ('IntersectionObserver' in window && revealSections.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealSections.forEach((s) => io.observe(s));
  } else {
    revealSections.forEach((s) => s.classList.add('is-in'));
  }
})();
