/* ===============================================================
   Afrin Kousar — Portfolio
   Custom cursor · Parallax · Scroll reveals · Counters · Progress
   =============================================================== */

(() => {
  // ---------- Year ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Custom cursor ----------
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;

  const isMobile = window.matchMedia('(max-width: 900px)').matches;

  if (!isMobile && dot && ring) {
    window.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(animateRing);
    };
    requestAnimationFrame(animateRing);

    document.querySelectorAll('a, button, .project, .skill-block, .photo-frame').forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.classList.add('hover');
        dot.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        ring.classList.remove('hover');
        dot.classList.remove('hover');
      });
    });

    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });
  }

  // ---------- Scroll progress + nav state ----------
  const progress = document.querySelector('.progress-bar');
  const nav = document.getElementById('nav');

  const onScroll = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (scrolled / max) * 100 : 0;
    if (progress) progress.style.width = pct + '%';
    if (nav) nav.classList.toggle('scrolled', scrolled > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Reveal on scroll ----------
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  // ---------- Parallax (background orbs + hero halves) ----------
  const orbs = document.querySelectorAll('.orb');
  const parallaxEls = document.querySelectorAll('[data-parallax]');

  let ticking = false;
  const onParallax = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;

      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 0.06;
        orb.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });

      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0;
        el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });

      ticking = false;
    });
  };
  window.addEventListener('scroll', onParallax, { passive: true });

  // ---------- Photo tilt on mouse (subtle 3D) ----------
  const photo = document.querySelector('.photo-frame');
  if (photo && !isMobile) {
    const wrap = photo.parentElement;
    wrap.addEventListener('mousemove', e => {
      const rect = wrap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      photo.style.transform = `rotate(${-1.5 + x * 4}deg) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) scale(1.01)`;
    });
    wrap.addEventListener('mouseleave', () => {
      photo.style.transform = '';
    });
  }

  // ---------- Counters ----------
  const counters = document.querySelectorAll('.counter');
  const animateCounter = el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const start = performance.now();
    const tick = now => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(c => cio.observe(c));
  } else {
    counters.forEach(animateCounter);
  }

  // ---------- Smooth anchor (avoids native jump on older browsers) ----------
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

})();
