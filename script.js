// GSAP ScrollTrigger animations
window.addEventListener('DOMContentLoaded', () => {
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    const panels = gsap.utils.toArray('.story .panel');
    panels.forEach((panel, i) => {
      const stack = panel.querySelector('.stack');
      // entrance animation for each panel
      gsap.fromTo(stack,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: {
            trigger: panel,
            start: 'top center+=10%',
            toggleActions: 'play none none reverse'
          }
        }
      );
      // subtle parallax on image
      const img = panel.querySelector('.bg img');
      gsap.to(img, {
        scale: 1.0,
        scrollTrigger: {
          trigger: panel,
          scrub: true,
          start: 'top bottom',
          end: 'bottom top'
        }
      });
    });

    // Optional: pin the whole story container for a smooth experience
    ScrollTrigger.create({
      trigger: '.story',
      start: 'top top',
      end: 'bottom bottom',
      pin: false // set true to pin; false keeps native sticky panels
    });
  }

  // Before/After slider logic (accessible)
  const wrap = document.getElementById('ba1');
  const beforeImg = wrap.querySelector('.ba-before');
  const handle = wrap.querySelector('.ba-handle');

  function setSplit(pct) {
    // pct: 0..100
    pct = Math.max(0, Math.min(100, pct));
    beforeImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = pct + '%';
    handle.setAttribute('aria-valuenow', String(Math.round(pct)));
  }

  // initial
  setSplit(50);

  // pointer drag support
  let dragging = false;
  const onPointerMove = (e) => {
    if (!dragging) return;
    const rect = wrap.getBoundingClientRect();
    const x = (e.clientX ?? (e.touches && e.touches[0].clientX)) - rect.left;
    const pct = (x / rect.width) * 100;
    setSplit(pct);
  };
  const start = (e) => { dragging = true; onPointerMove(e); e.preventDefault(); };
  const end = () => { dragging = false; };

  handle.addEventListener('mousedown', start);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', end);

  handle.addEventListener('touchstart', start, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: false });
  window.addEventListener('touchend', end);

  // keyboard support
  handle.addEventListener('keydown', (e) => {
    const now = Number(handle.getAttribute('aria-valuenow')) || 50;
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft') setSplit(now - step);
    if (e.key === 'ArrowRight') setSplit(now + step);
  });

  // Prevent image dragging
  wrap.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', e => e.preventDefault());
  });
});
