// Home page — accessible company tabs (Waystar / Solo Brands) that swap panels.
(function () {
  const tablist = document.querySelector('.tabs[role="tablist"]');
  if (tablist) {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];

    function selectTab(tab, setFocus) {
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
        t.tabIndex = active ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !active;
      });
      if (setFocus) tab.focus();
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => selectTab(tab));
      tab.addEventListener('keydown', (e) => {
        // Arrow keys move between tabs; Home/End jump to the ends.
        let next = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') next = tabs[0];
        else if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); selectTab(next, true); }
      });
    });
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
  const revealSections = document.querySelectorAll('.work, .about, .writing, .site-footer');
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
