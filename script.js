// Basic UI helpers for FAQs and floating CTA
document.addEventListener('DOMContentLoaded', () => {
  // FAQ accordion
  document.querySelectorAll('.accordion .item').forEach(item => {
    const q = item.querySelector('.q');
    const a = item.querySelector('.a');
    q.addEventListener('click', () => {
      const expanded = q.getAttribute('aria-expanded') === 'true';
      // collapse all
      document.querySelectorAll('.accordion .q').forEach(el => el.setAttribute('aria-expanded', 'false'));
      document.querySelectorAll('.accordion .a').forEach(el => el.hidden = true);
      if (!expanded) {
        q.setAttribute('aria-expanded', 'true');
        a.hidden = false;
      }
    });
  });

  // Floating CTA show/hide logic: show on small screens
  const floatCTA = document.getElementById('floatCTA');
  if (floatCTA) {
    const toggle = () => {
      if (window.innerWidth <= 900) floatCTA.style.display = 'block';
      else floatCTA.style.display = 'none';
    };
    toggle();
    window.addEventListener('resize', toggle);
  }
});
