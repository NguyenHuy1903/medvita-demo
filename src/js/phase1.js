// ===== PHASE 1 END — CHECKLIST OVERLAY =====
const checklistItems = [
  'Lý do vào viện',
  'Quá trình bệnh lý',
  'Tiền sử bản thân',
  'Khám thực thể TMH',
  'Khám toàn thân',
  'Tóm tắt bệnh án',
];

function showPhase1End() {
  paused = true;
  const clItems = document.getElementById('clItems');
  clItems.innerHTML = '';
  checklistItems.forEach(function (text) {
    const el = document.createElement('div');
    el.className = 'cl-item';
    el.innerHTML = '<span class="cl-check">✓</span><span>' + text + '</span>';
    clItems.appendChild(el);
  });

  document.getElementById('clOverlay').classList.add('show');

  const items = clItems.querySelectorAll('.cl-item');
  items.forEach(function (el, i) {
    setTimeout(function () { el.classList.add('show'); }, 150 + i * 120);
  });

  document.getElementById('clCta').onclick = startPhase2;

  // Auto-click CTA after checklist finishes animating
  const autoDelay = speed(150 + checklistItems.length * 120 + 800);
  setTimeout(function () {
    const cta = document.getElementById('clCta');
    simClick(cta, 'sim-click-green');
    setTimeout(function () { startPhase2(); }, speed(350));
  }, autoDelay);
}
