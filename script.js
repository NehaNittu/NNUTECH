// ================================================================
//  PCBSolutions – Main Script
// ================================================================

// ---- NAVIGATION ----
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  document.querySelectorAll('[data-section]').forEach(a => {
    a.classList.toggle('active', a.dataset.section === id);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById('mainNav').classList.remove('open');
  document.getElementById('mobileMenuBtn').classList.remove('open');
  history.replaceState(null, '', '#' + id);
  initAnimations();
}
window.showSection = showSection;

document.addEventListener('click', e => {
  const link = e.target.closest('[data-section]');
  if (!link) return;
  e.preventDefault();
  showSection(link.dataset.section);
});

// ---- MOBILE MENU ----
const mBtn = document.getElementById('mobileMenuBtn');
mBtn.addEventListener('click', () => {
  mBtn.classList.toggle('open');
  document.getElementById('mainNav').classList.toggle('open');
});

document.querySelectorAll('.has-dropdown > a').forEach(a => {
  a.addEventListener('click', e => {
    if (window.innerWidth > 768) return;
    e.preventDefault();
    a.parentElement.classList.toggle('open');
  });
});

// ---- HEADER SCROLL CLASS ----
window.addEventListener('scroll', () => {
  document.getElementById('header').classList.toggle('scrolled', window.scrollY > 20);
  document.querySelector('.scroll-top').classList.toggle('show', window.scrollY > 400);
}, { passive: true });

// ---- SCROLL-TO-TOP ----
document.querySelector('.scroll-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- SCROLL ANIMATIONS (Intersection Observer) ----
function initAnimations() {
  const els = document.querySelectorAll('[data-a]:not(.in)');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

// ---- COUNTER ANIMATION ----
function animateCounters() {
  document.querySelectorAll('.stat-num[data-count]').forEach(el => {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur = 1400;
    const start = performance.now();
    const isDecimal = String(target).includes('.');
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = target * ease;
      el.textContent = (isDecimal ? val.toFixed(1) : Math.round(val)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  });
}

// Trigger counters when stat cards enter view
const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) animateCounters(); });
}, { threshold: 0.3 });
document.querySelectorAll('.about-stats').forEach(el => statObs.observe(el));

// ---- FILE UPLOAD ----
const fileZone = document.getElementById('fileUploadArea');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');

if (fileZone) {
  fileZone.addEventListener('click', () => fileInput.click());
  fileZone.addEventListener('dragover', e => { e.preventDefault(); fileZone.classList.add('drag-over'); });
  fileZone.addEventListener('dragleave', () => fileZone.classList.remove('drag-over'));
  fileZone.addEventListener('drop', e => { e.preventDefault(); fileZone.classList.remove('drag-over'); renderFiles(e.dataTransfer.files); });
  fileInput.addEventListener('change', () => renderFiles(fileInput.files));
}

function renderFiles(files) {
  fileList.innerHTML = '';
  Array.from(files).forEach(f => {
    const d = document.createElement('div');
    d.className = 'file-item';
    d.innerHTML = `<span>📄</span><span>${f.name}</span><span class="file-sz">${(f.size/1024).toFixed(1)} KB</span>`;
    fileList.appendChild(d);
  });
}

// ---- FORMS ----
document.getElementById('quoteForm')?.addEventListener('submit', e => {
  e.preventDefault(); openModal();
  e.target.reset(); if (fileList) fileList.innerHTML = '';
});
document.getElementById('contactForm')?.addEventListener('submit', e => {
  e.preventDefault(); openModal(); e.target.reset();
});

function openModal() { document.getElementById('successModal').style.display = 'flex'; }
function closeModal() { document.getElementById('successModal').style.display = 'none'; }
window.closeModal = closeModal;

document.getElementById('successModal')?.addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

// ---- INIT ----
(function () {
  const valid = ['home','about','services','pcb-design','pcb-fabrication','pcb-assembly','industries','quality','why-choose-us','request-quote','contact'];
  const hash = location.hash.replace('#', '');
  showSection(valid.includes(hash) ? hash : 'home');
})();
