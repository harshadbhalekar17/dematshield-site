// Simple multi-step form script for Demat Shield

let currentStep = 1;

function showStep(n) {
  document.querySelectorAll('.step').forEach(el => el.style.display = 'none');
  const el = document.querySelector('.step[data-step="' + n + '"]');
  if (el) el.style.display = 'block';
  currentStep = n;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextStep() {
  // simple validation for required fields on the step
  const stepEl = document.querySelector('.step[data-step="' + currentStep + '"]');
  const required = stepEl ? stepEl.querySelectorAll('[required]') : [];
  for (const r of required) {
    if (!r.value.trim()) {
      r.focus();
      alert('Please fill required fields.');
      return;
    }
  }
  showStep(currentStep + 1);
}

function prevStep() {
  if (currentStep > 1) showStep(currentStep - 1);
}

function toggleResponse() {
  const sel = document.getElementById('approachedDP');
  const block = document.getElementById('dpResponseBlock');
  if (sel && block) {
    block.style.display = sel.value === 'Yes' ? 'block' : 'none';
  }
}

showStep(1);
