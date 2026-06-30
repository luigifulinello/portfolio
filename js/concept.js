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
  const cards = document.querySelectorAll('.card');

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
    });
  });

  // Safety net: if a healthcare card is ever shown, it opens the modal too.
  document.querySelectorAll('.card[data-category="healthcare"]').forEach((card) => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(card);
    });
  });
})();
