// ===== PLAYBACK CONTROLS =====
document.getElementById('btnPause').onclick = function () {
  paused = !paused;
  if (paused) {
    this.textContent = '▶ Tiếp tục'; this.classList.add('active');
  } else {
    this.textContent = '⏸ Tạm dừng'; this.classList.remove('active');
    if (resumeResolve) { resumeResolve(); resumeResolve = null; }
  }
};
document.getElementById('btnReplay').onclick = function () { location.reload(); };
document.getElementById('exportBtn').onclick = function () {
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(function () { t.classList.remove('show'); }, 3000);
};
document.getElementById('btnMode').onclick = toggleMode;

// ===== EDIT MODE (field drag/resize) =====
let editOn = false, drag = null;

function applyEditMode() {
  document.body.classList.toggle('edit-mode', editOn);
  document.querySelectorAll('.field').forEach(function (f) {
    if (f.querySelector('.rh')) return;
    ['nw','n','ne','e','se','s','sw','w'].forEach(function (dir) {
      const h = document.createElement('span');
      h.className = 'rh ' + dir;
      h.dataset.dir = dir;
      f.appendChild(h);
    });
  });
}

function dumpCoords() {
  const out = FIELDS.map(function (f) {
    const el = fieldEls[f.id];
    return {
      id: f.id, g: f.g, page: f.page,
      top:    +parseFloat(el.style.top).toFixed(2),
      left:   +parseFloat(el.style.left).toFixed(2),
      width:  +parseFloat(el.style.width).toFixed(2),
      height: +parseFloat(el.style.minHeight || '0').toFixed(2),
    };
  });
  const json = JSON.stringify(out, null, 2);
  console.log(json);
  if (navigator.clipboard) navigator.clipboard.writeText(json);
  alert('Coords copied');
}

document.addEventListener('mousedown', function (ev) {
  if (!editOn) return;
  const rh = ev.target.closest('.rh');
  if (rh) {
    ev.preventDefault(); ev.stopPropagation();
    const f = rh.closest('.field'), host = f.parentElement;
    const hostR = host.getBoundingClientRect(), fR = f.getBoundingClientRect();
    f.classList.add('resizing');
    drag = { mode:'resize', dir:rh.dataset.dir, el:f, hostR,
      startX:ev.clientX, startY:ev.clientY,
      origLeft:fR.left - hostR.left, origTop:fR.top - hostR.top,
      origW:fR.width, origH:fR.height };
    return;
  }
  const f = ev.target.closest('.field'); if (!f) return;
  ev.preventDefault();
  const host = f.parentElement, hostR = host.getBoundingClientRect();
  drag = { mode:'move', el:f, hostR, dx:ev.clientX - f.getBoundingClientRect().left, dy:ev.clientY - f.getBoundingClientRect().top };
});

document.addEventListener('mousemove', function (ev) {
  if (!drag) return;
  const { el, hostR } = drag;
  if (drag.mode === 'move') {
    el.style.left = ((ev.clientX - hostR.left - drag.dx) / hostR.width  * 100).toFixed(2) + '%';
    el.style.top  = ((ev.clientY - hostR.top  - drag.dy) / hostR.height * 100).toFixed(2) + '%';
  } else {
    const dx = ev.clientX - drag.startX, dy = ev.clientY - drag.startY, dir = drag.dir;
    let l = drag.origLeft, t = drag.origTop, w = drag.origW, h = drag.origH;
    if (dir.includes('e')) w += dx; if (dir.includes('s')) h += dy;
    if (dir.includes('w')) { w -= dx; l += dx; } if (dir.includes('n')) { h -= dy; t += dy; }
    if (w > 10) { el.style.width = (w / hostR.width  * 100).toFixed(2) + '%'; el.style.left = (l / hostR.width  * 100).toFixed(2) + '%'; }
    if (h >  5) { el.style.minHeight = (h / hostR.height * 100).toFixed(2) + '%'; el.style.top  = (t / hostR.height * 100).toFixed(2) + '%'; }
  }
});

document.addEventListener('mouseup', function () {
  if (drag && drag.mode === 'resize') drag.el.classList.remove('resizing');
  drag = null;
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function (e) {
  if (e.target.isContentEditable) return;
  if (e.code === 'Space')  { e.preventDefault(); document.getElementById('btnPause').click(); }
  if (e.code === 'KeyR' && !editOn) location.reload();
  if (e.code === 'KeyE')  { editOn = !editOn; applyEditMode(); }
  if (e.code === 'KeyS' && editOn) { e.preventDefault(); dumpCoords(); }
  if (e.code === 'KeyA' && !editOn) {
    document.querySelectorAll('.field.b.pending,.field.b.agent-draft').forEach(function (el) {
      if (el.dataset.id) approveField(el.dataset.id);
    });
  }
  if (e.key === 'Tab' && !e.shiftKey && !editOn) {
    const p = document.querySelector('.field.b.pending,.field.b.agent-draft');
    if (p && p.dataset.id) { e.preventDefault(); approveField(p.dataset.id); }
  }
  if (e.code === 'Escape') {
    if (editOn) { editOn = false; applyEditMode(); return; }
    const ed = document.querySelector('.field.b.edited [contenteditable="true"]');
    if (ed) { ed.contentEditable = 'false'; ed.closest('.field').classList.remove('edited'); updateProgress(); }
  }
});

// ===== PAGE TRACKER =====
const pageObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (en) {
    if (en.isIntersecting)
      document.getElementById('pageInfo').textContent = 'Trang ' + en.target.dataset.page + '/4';
  });
}, { threshold: 0.4, root: pdfScroll });
document.querySelectorAll('.pdf-page').forEach(function (p) { pageObserver.observe(p); });

// ===== INIT — OPENING → CONTEXT → FILL =====
let fillStartAdded = false;
function addFillStartButton() {
  if (fillStartAdded) return;
  fillStartAdded = true;
  const el = document.createElement('div');
  el.className = 'fp-item';
  el.id = 'fillStartItem';
  el.innerHTML =
    '<div class="fp-fill-start">' +
      '<div class="fp-fill-start-icon">📋</div>' +
      '<div class="fp-fill-start-info">' +
        '<div class="fp-fill-start-title">Bệnh án — Nguyễn Thị Hồng</div>' +
        '<div class="fp-fill-start-sub">Tai Mũi Họng · BN nữ, 48 tuổi</div>' +
      '</div>' +
      '<button class="fp-fill-start-btn" id="fillStartBtn">▶ Bắt đầu điền bệnh án</button>' +
    '</div>';
  fpFeed.appendChild(el);
  feedScroll();

  document.getElementById('fillStartBtn').onclick = function () {
    this.textContent = '✓ Đang điền...';
    this.classList.add('done');
    this.disabled = true;
    processQueue();
  };

  // Auto-click start button
  setTimeout(function () {
    const btn = document.getElementById('fillStartBtn');
    if (btn) {
      simClick(btn, 'sim-click');
      setTimeout(function () { btn.click(); }, speed(350));
    }
  }, speed(900));
}

function showCtxScreen() {
  const ctx = document.getElementById('ctxScreen');
  ctx.classList.add('show');
  const ctxSteps = [
    document.getElementById('ctxS1'), document.getElementById('ctxS2'),
    document.getElementById('ctxS3'), document.getElementById('ctxS4'),
  ];
  const patient = document.getElementById('ctxPatient');
  const cta     = document.getElementById('ctxCta');
  ctxSteps.forEach(function (s, i) { setTimeout(function () { s.classList.add('visible'); }, 180 + i * 220); });
  setTimeout(function () { patient.classList.add('visible'); }, 180 + ctxSteps.length * 220 + 80);
  setTimeout(function () { cta.classList.add('visible'); }, 180 + ctxSteps.length * 220 + 220);

  // Auto-dismiss context screen
  const autoDismiss = 180 + ctxSteps.length * 220 + 220 + 1200;
  setTimeout(function () {
    simClick(cta, 'sim-click-green');
    setTimeout(function () { cta.click(); }, speed(350));
  }, autoDismiss);
}

document.getElementById('ctxCta').onclick = function () {
  const ctx = document.getElementById('ctxScreen');
  ctx.classList.add('hide');
  ctx.addEventListener('animationend', function () { ctx.style.display = 'none'; }, { once: true });
  addFillStartButton();
};

document.getElementById('startBtn').onclick = function () {
  const op = document.getElementById('opening');
  op.classList.add('fade-out');
  op.addEventListener('animationend', function () { op.style.display = 'none'; showCtxScreen(); }, { once: true });
};

// Auto-click start button after opening animations
setTimeout(function () {
  const btn = document.getElementById('startBtn');
  simClick(btn, 'sim-click-green');
  setTimeout(function () { btn.click(); }, speed(350));
}, speed(2200));
