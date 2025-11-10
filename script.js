// Simple carousel for testimonials (autoplay + dots + prev/next)
(function(){
  const wrap = document.getElementById('slidesWrap');
  const slides = wrap.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.carousel .prev');
  const nextBtn = document.querySelector('.carousel .next');
  const dotsWrap = document.getElementById('carouselDots');

  let index = 0;
  let autoplay = true;
  let timer = null;
  const slideCount = slides.length;

  // create dots
  function buildDots(){
    dotsWrap.innerHTML = '';
    for(let i=0;i<slideCount;i++){
      const d = document.createElement('button');
      d.className = 'dot';
      d.setAttribute('aria-label','Go to testimonial '+(i+1));
      d.addEventListener('click', ()=>{ index = i; update(); restart(); });
      dotsWrap.appendChild(d);
    }
  }

  function clampIndex(i){
    if(i<0) return slideCount-1;
    if(i>=slideCount) return 0;
    return i;
  }

  function update(){
    // decide per-step width using first slide width (handles responsive)
    const w = slides[0].getBoundingClientRect().width + 12; // include gap fallback
    wrap.style.transform = `translateX(${-index * w}px)`;
    // update dots
    Array.from(dotsWrap.children).forEach((d,idx)=>d.classList.toggle('active', idx===index));
  }

  function prev(){ index = clampIndex(index-1); update(); restart(); }
  function next(){ index = clampIndex(index+1); update(); restart(); }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // autoplay
  function startAutoplay(){
    if(!autoplay) return;
    timer = setInterval(()=>{ index = clampIndex(index+1); update(); }, 4500);
  }
  function stopAutoplay(){ clearInterval(timer); timer = null; }
  function restart(){ stopAutoplay(); startAutoplay(); }

  // init (robust)
  buildDots();
  // small retry to ensure layout ready before first update (fixes mobile timing issues)
  setTimeout(() => { index = clampIndex(index); update(); startAutoplay(); }, 60);
  // safeguard after full page load
  window.addEventListener('load', () => {
    setTimeout(() => { index = clampIndex(index); update(); }, 200);
  });

  // pause on hover/touch
  wrap.addEventListener('mouseenter', stopAutoplay);
  wrap.addEventListener('mouseleave', startAutoplay);
})();
