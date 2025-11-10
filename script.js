document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Accordion ---------- */
  document.querySelectorAll('.accordion .item').forEach(item => {
    const q = item.querySelector('.q');
    const a = item.querySelector('.a');
    q.addEventListener('click', () => {
      const expanded = q.getAttribute('aria-expanded') === 'true';
      // collapse all
      document.querySelectorAll('.accordion .q').forEach(el => el.setAttribute('aria-expanded', 'false'));
      document.querySelectorAll('.accordion .a').forEach(el => el.hidden = true);
      // toggle clicked
      if (!expanded) { q.setAttribute('aria-expanded', 'true'); a.hidden = false; }
    });
  });

  /* ---------- Floating CTA visibility ---------- */
  const floatCTA = document.getElementById('floatCTA');
  const setFloatCTA = () => {
    if (!floatCTA) return;
    floatCTA.style.display = window.innerWidth <= 900 ? 'block' : 'none';
  };
  setFloatCTA();
  window.addEventListener('resize', setFloatCTA);

  /* ---------- Testimonials slider (1-up mobile, 2-up desktop) ---------- */
  const slider = document.getElementById('testimonialSlider');
  if (!slider) return;

  const slidesWrap = slider.querySelector('.slides');
  let slides = Array.from(slidesWrap.querySelectorAll('.slide'));
  const prevBtn = slider.querySelector('.prev');
  const nextBtn = slider.querySelector('.next');
  const dotsWrap = slider.querySelector('.slider-dots');

  let index = 0;
  let autoplayInterval = null;

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < slides.length; i++) {
      const d = document.createElement('span');
      d.className = 'slider-dot' + (i === 0 ? ' active' : '');
      d.dataset.index = i;
      d.addEventListener('click', () => { goToSlide(i); resetAutoplay(); });
      dotsWrap.appendChild(d);
    }
  }

  // Determine how many slides visible at once
  function visibleCount() {
    return window.innerWidth >= 1100 ? 2 : 1;
  }

  // Update transform and active classes
  function update() {
    const v = visibleCount();
    // compute percentage shift depending on visible count
    const shift = (index * 100) / v;
    slidesWrap.style.transform = `translateX(-${shift}%)`;

    // set active classes for visible slides (for fade)
    slides.forEach((s, i) => {
      s.classList.remove('active');
      // when 2-up, show index and index+1 as active
      if (v === 1) {
        if (i === index) s.classList.add('active');
      } else {
        if (i === index || i === (index + 1) % slides.length) s.classList.add('active');
      }
    });

    // dots highlight (use primary visible index)
    dotsWrap.querySelectorAll('.slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
  }

  function goToSlide(i) {
    const v = visibleCount();
    const maxIndex = slides.length - 1;
    // ensure index within range
    if (i < 0) i = (maxIndex + 1 + i) % (maxIndex + 1);
    if (i > maxIndex) i = i % (maxIndex + 1);
    // If 2-up and i points to last item, clamp so second visible slot wraps
    if (v === 2 && i === slides.length - 1) {
      // allow last item to be shown with previous as pair by using last-1
      i = slides.length - 1; // we allow last to be index; translate will handle modulo logic
    }
    index = i;
    update();
  }

  // Prev / Next handlers
  prevBtn.addEventListener('click', () => { goToSlide((index - 1 + slides.length) % slides.length); resetAutoplay(); });
  nextBtn.addEventListener('click', () => { goToSlide((index + 1) % slides.length); resetAutoplay(); });

  // Autoplay
  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(() => {
      goToSlide((index + 1) % slides.length);
    }, 4500);
  }
  function stopAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
  }
  function resetAutoplay() { stopAutoplay(); startAutoplay(); }

  // Recalculate on resize (recompute layout and update)
  window.addEventListener('resize', () => {
    // re-fetch slides in case layout changed
    slides = Array.from(slidesWrap.querySelectorAll('.slide'));
    buildDots();
    // ensure index not out of bounds
    if (index >= slides.length) index = 0;
    update();
  });

  // init
  buildDots();
  update();
  startAutoplay();

  // pause on hover (desktop)
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  // keyboard support for prev/next
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { prevBtn.click(); }
    if (e.key === 'ArrowRight') { nextBtn.click(); }
  });
});
