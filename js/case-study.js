// Case Study template — scroll-reveal + scroll-driven hero expansion.
// Loaded on every case study page. Behavior is keyed off markup
// (`[data-reveal]`, `.cs-hero`) so pages opt in by using the template.
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Scroll-reveal content ---
  // .has-reveal gates the footer's initial hidden state (see concept.css);
  // pages without a script keep a fully visible footer.
  document.documentElement.classList.add('has-reveal');

  // Footer lead: wrap words in spans (preserving <br>) and stagger delays so
  // it builds left -> right, first line then second (see concept.css).
  const footerLead = document.querySelector('.footer-lead');
  if (footerLead) {
    const flLines = footerLead.innerHTML
      .split(/<br\s*\/?>/i)
      .map((html) => {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent.trim();
      })
      .filter(Boolean);
    footerLead.textContent = '';
    let wi = 0;
    flLines.forEach((line, li) => {
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

  const els = document.querySelectorAll('[data-reveal], .site-footer');
  if (els.length) {
    if (reduce) {
      els.forEach((el) => el.classList.add('is-in'));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-in');
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
      );
      els.forEach((el) => io.observe(el));
    }
  }

  // --- Hero: scroll-driven expand from container width to full page width ---
  const hero = document.querySelector('.cs-hero');
  if (hero) {
    if (reduce) {
      hero.style.setProperty('--expand', '1');
    } else {
      let ticking = false;
      const update = () => {
        ticking = false;
        // Expansion scrubs over the first ~0.6 viewport heights of scroll.
        const range = window.innerHeight * 0.6;
        const p = Math.min(1, Math.max(0, window.scrollY / range));
        hero.style.setProperty('--expand', p.toFixed(4));
      };
      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      update(); // initial state (contained at top)
    }
  }

  // --- Statement: word-by-word gray -> ink fill, driven by scroll ---
  const GRAY = 205, INK = 17; // both neutral, so interpolate one channel
  const paint = (span, local) => {
    const c = Math.round(GRAY + (INK - GRAY) * local);
    span.style.color = 'rgb(' + c + ',' + c + ',' + c + ')';
  };

  document.querySelectorAll('.cs-statement-text').forEach((el) => {
    // Split on <br> first so authored line breaks survive the word-span rebuild
    const lines = el.innerHTML
      .split(/<br\s*\/?>/i)
      .map((html) => {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent.trim();
      })
      .filter(Boolean);
    el.textContent = '';
    const spans = [];
    lines.forEach((line, li) => {
      if (li > 0) el.appendChild(document.createElement('br'));
      const words = line.split(/\s+/);
      words.forEach((w, i) => {
        const span = document.createElement('span');
        span.className = 'cs-word';
        span.textContent = w;
        el.appendChild(span);
        if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
        spans.push(span);
      });
    });

    if (reduce) {
      spans.forEach((s) => paint(s, 1));
      return;
    }

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Fill as the block travels up through the middle of the viewport.
      const start = vh * 0.85, end = vh * 0.30;
      const p = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      const N = spans.length;
      spans.forEach((span, i) => paint(span, Math.min(1, Math.max(0, p * N - i))));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  });
})();
