// ===== FEED ENGINE =====
var currentProcess = null;
const fpFeed = document.getElementById('fpFeed');

function feedScroll() { fpFeed.scrollTo({ top: fpFeed.scrollHeight, behavior: 'smooth' }); }

// ===== TYPING TAG =====
function showTypingTag(el, label, type) {
  var tag = document.getElementById('typingTag');
  tag.textContent = label;
  tag.className = 'typing-tag ' + (type || 'medvita');
  void tag.offsetWidth;
  tag.classList.add('show');
  _posTypingTag(el, '');
}
function hideTypingTag() {
  document.getElementById('typingTag').classList.remove('show');
}
function _posTypingTag(el, text) {
  var tag = document.getElementById('typingTag');
  if (!tag.classList.contains('show')) return;
  var r  = el.getBoundingClientRect();
  var cs = window.getComputedStyle(el);
  var pl = parseFloat(cs.paddingLeft) || 0;
  var cnv = _posTypingTag._c || (_posTypingTag._c = document.createElement('canvas'));
  var ctx = cnv.getContext('2d');
  ctx.font = (cs.fontSize || '12px') + ' ' + (cs.fontFamily || 'Inter, sans-serif');
  var tw = Math.min(pl + ctx.measureText(text).width, r.width - 8);
  tag.style.left = (r.left + tw) + 'px';
  tag.style.top  = (r.top - 24) + 'px';
}

function addFeedStatus(icon, label, text) {
  const el = document.createElement('div');
  el.className = 'fp-item';
  el.innerHTML = '<div class="fp-status"><span class="fp-status-icon">' + icon + '</span><div>' +
    (label ? '<span class="fp-status-label">' + label + '</span>' : '') + text + '</div></div>';
  fpFeed.appendChild(el); feedScroll();
}

function addFeedProcess(tagType, summary) {
  const el = document.createElement('div');
  el.className = 'fp-item';
  const tg = document.createElement('div');
  tg.className = 'fp-toggle';
  tg.innerHTML =
    '<div class="fp-toggle-head" onclick="this.parentElement.classList.toggle(\'open\')">' +
      '<span class="fp-toggle-chevron">▸</span>' +
      '<span class="fp-toggle-tag ' + tagType + '">' + tagType + '</span>' +
      '<div class="fp-spinner"></div>' +
      '<span class="fp-toggle-summary">' + summary + '</span>' +
    '</div><div class="fp-toggle-body"></div>';
  el.appendChild(tg); fpFeed.appendChild(el); feedScroll();
  return el;
}

function finishFeedProcess(el) {
  if (!el) return;
  const sp = el.querySelector('.fp-spinner');
  if (sp) sp.remove();
}

function addFeedDone(label, text) {
  const el = document.createElement('div');
  el.className = 'fp-item';
  el.innerHTML = '<div class="fp-done"><span class="fp-done-icon">✓</span><div>' +
    (label ? '<span class="fp-done-label">' + label + '</span>' : '') + text + '</div></div>';
  fpFeed.appendChild(el); feedScroll();
}

function addFeedVoice(text) {
  const el = document.createElement('div');
  el.className = 'fp-item fp-voice';
  el.innerHTML = '<div class="fp-voice-bub"><span class="fp-voice-icon">🎙</span><span>' + text + '</span></div>';
  fpFeed.appendChild(el); feedScroll();
}

async function playVoiceInput(text, audioSrc, durationMs) {
  const micBtn = document.getElementById('chatMicBtn');
  const input  = document.getElementById('chatInput');
  const wave   = document.getElementById('chatWave');

  // 1. Tap mic
  simClick(micBtn, 'sim-click');
  micBtn.classList.add('recording');
  await delay(180);

  // 2. Input → waveform
  input.style.display = 'none';
  wave.classList.add('show');

  // 3. Play audio if available; fallback uses durationMs (scaled by speed)
  var fallback = durationMs || 1600;
  await new Promise(function (resolve) {
    if (!audioSrc) { setTimeout(resolve, speed(fallback)); return; }
    var aud = new Audio(audioSrc);
    _activeAudio = aud;
    aud.onended  = function () { _activeAudio = null; resolve(); };
    aud.onerror  = function () { _activeAudio = null; setTimeout(resolve, speed(fallback)); };
    aud.play().catch(function () { _activeAudio = null; setTimeout(resolve, speed(fallback)); });
  });

  // 4. Stop → restore input
  wave.classList.remove('show');
  input.style.display = '';
  micBtn.classList.remove('recording');
  await delay(150);

  // 5. Add voice bubble to feed
  addFeedVoice(text);
}

// ===== FEED ANNOUNCE (alert + permission) =====
function addFeedAnnounce(variant, title, text, sources) {
  const el = document.createElement('div');
  el.className = 'fp-item';
  var inner = '';
  if (variant === 'alert') {
    inner = '<div class="fp-announce alert">' +
      '<div class="fp-announce-hdr"><span class="fp-announce-icon">⚠</span><span class="fp-announce-brand">MEDVITA</span><span class="fp-announce-title">' + title + '</span></div>' +
      '<div class="fp-announce-text">' + text + '</div>' +
      '</div>';
  } else {
    var srcsHtml = '';
    if (sources && sources.length) {
      srcsHtml = sources.map(function(s) {
        return '<div class="fp-announce-src"><span>•</span><span><strong>' + s.label + '</strong> → ' + s.val + '</span></div>';
      }).join('');
    }
    inner = '<div class="fp-announce permission">' +
      '<div class="fp-announce-hdr"><span class="fp-announce-brand">MEDVITA</span><span class="fp-announce-title">xin phép điền&nbsp;<strong>' + title + '</strong></span></div>' +
      '<div class="fp-announce-body">' +
        '<div class="fp-announce-src-label">▸ Tổng hợp từ ' + (sources ? sources.length : 0) + ' nguồn</div>' +
        srcsHtml +
      '</div>' +
      '<div class="fp-announce-actions">' +
        '<button class="fp-announce-allow">✓ Cho phép</button>' +
        '<button class="fp-announce-skip">✗ Bỏ qua</button>' +
      '</div>' +
      '</div>';
  }
  el.innerHTML = inner;
  fpFeed.appendChild(el); feedScroll();
  return el;
}

// ===== HIS RESULT CARD =====
function addFeedHISResult() {
  const el = document.createElement('div');
  el.className = 'fp-item';
  const tg = document.createElement('div');
  tg.className = 'fp-toggle fp-his open';
  tg.innerHTML =
    '<div class="fp-toggle-head" onclick="this.parentElement.classList.toggle(\'open\')">' +
      '<span class="fp-toggle-chevron">▸</span>' +
      '<span class="fp-toggle-tag his">[HIS] Kết quả XN</span>' +
      '<span class="fp-toggle-summary">#XN-2605-0042 · 04:15</span>' +
      '<a class="fp-his-link" href="#" onclick="openHISPanel();return false">Mở HIS ↗</a>' +
    '</div>' +
    '<div class="fp-toggle-body">' +
      '<table class="fp-his-table">' +
        '<tr class="fp-his-row abnormal"><td>Bạch cầu (BC)</td><td>11.2 G/L</td><td class="fp-his-flag up">↑ Cao nhẹ</td></tr>' +
        '<tr class="fp-his-row abnormal"><td>CRP</td><td>48 mg/L</td><td class="fp-his-flag up">↑ Tăng</td></tr>' +
        '<tr class="fp-his-row ok"><td>Glucose</td><td>4.35 mmol/L</td><td class="fp-his-flag ok">✓ BT</td></tr>' +
        '<tr class="fp-his-row ok"><td>Creatinin</td><td>61.05 µmol/L</td><td class="fp-his-flag ok">✓ BT</td></tr>' +
        '<tr class="fp-his-row"><td>X-quang xoang</td><td>—</td><td class="fp-his-flag pending">⏳ Đang xử lý</td></tr>' +
      '</table>' +
    '</div>';
  el.appendChild(tg); fpFeed.appendChild(el); feedScroll();
}

// ===== MEDVITA TTS (no mic animation) =====
async function playMedVitaTTS(audioSrc, durationMs) {
  var fallback = durationMs || 2000;
  await new Promise(function(resolve) {
    if (!audioSrc) { setTimeout(resolve, speed(fallback)); return; }
    var aud = new Audio(audioSrc);
    _activeAudio = aud;
    aud.onended  = function() { _activeAudio = null; resolve(); };
    aud.onerror  = function() { _activeAudio = null; setTimeout(resolve, speed(fallback)); };
    aud.play().catch(function() { _activeAudio = null; setTimeout(resolve, speed(fallback)); });
  });
}

// ===== SOURCE CHIP on field =====
function renderFieldSource(el, sources) {
  if (!sources || !sources.length) return;
  if (el.querySelector('.field-source')) return;
  var items = sources.map(function(s) {
    if (s.type === 'audio') {
      return '<div class="src-item"><span class="src-type-icon">🎙</span><span class="src-body"><span class="src-ts">Audio ' + s.ts + '</span> · <em>"' + s.quote + '"</em></span></div>';
    }
    if (s.type === 'his') {
      return '<div class="src-item"><span class="src-type-icon">🏥</span><span class="src-body">HIS · ' + s.field + '</span></div>';
    }
    if (s.type === 'infer') {
      return '<div class="src-item"><span class="src-type-icon">🔗</span><span class="src-body">Suy ra từ: ' + s.fields.join(' · ') + '</span></div>';
    }
    return '';
  }).join('');
  const chip = document.createElement('div');
  chip.className = 'field-source';
  chip.innerHTML = '<button class="field-source-btn" onclick="this.closest(\'.field-source\').classList.toggle(\'open\');event.stopPropagation()">Nguồn ▾</button>' +
    '<div class="field-source-popup">' + items + '</div>';
  el.appendChild(chip);
}

function addFeedQuestion(text) {
  const el = document.createElement('div');
  el.className = 'fp-item';
  el.innerHTML = '<div class="fp-question"><div class="fp-question-label">AI cần bổ sung</div>' + text + '</div>';
  fpFeed.appendChild(el); feedScroll();
}

function addFeedSuggestion(title, text) {
  const el = document.createElement('div');
  el.className = 'fp-item';
  el.innerHTML = '<div class="fp-suggest"><div class="fp-suggest-label">AI · Gợi ý</div>' +
    '<div class="fp-suggest-title">' + title + '</div>' + text + '</div>';
  fpFeed.appendChild(el); feedScroll();
}

function addFeedUpdate(summary, detail) {
  const el = document.createElement('div');
  el.className = 'fp-item';
  const tg = document.createElement('div');
  tg.className = 'fp-update fp-toggle';
  tg.innerHTML =
    '<div class="fp-toggle-head" onclick="this.parentElement.classList.toggle(\'open\')">' +
      '<span class="fp-toggle-chevron">▸</span>' +
      '<span class="fp-toggle-tag">cập nhật</span>' +
      '<span class="fp-toggle-summary">' + summary + '</span>' +
    '</div>' +
    '<div class="fp-toggle-body"><div class="fp-toggle-detail">' + detail + '</div></div>';
  el.appendChild(tg); fpFeed.appendChild(el); feedScroll();
}

// ===== FIELD STATE FUNCTIONS =====
let totalB = 0;

function updateProgress() {
  const badge = document.getElementById('pendingBadge');
  const btn   = document.getElementById('exportBtn');
  const fill  = document.getElementById('progFill');
  const allB  = document.querySelectorAll('.field.b:not(.waiting)');
  totalB = allB.length;
  const pend = document.querySelectorAll('.field.b.pending,.field.b.agent-draft').length;
  const done = totalB - pend;
  fill.style.width = totalB ? (done / totalB * 100) + '%' : '0%';
  if (totalB > 0 && pend === 0) {
    badge.textContent = '✓ Đã duyệt hết'; badge.classList.add('done');
    btn.disabled = false; btn.classList.add('ready');
  } else {
    badge.textContent = pend + ' mục chờ duyệt'; badge.classList.remove('done');
    btn.disabled = true; btn.classList.remove('ready');
  }
}

async function setFieldB(id, value, ts, sources) {
  const el = fieldEls[id]; if (!el) return;
  el.classList.remove('waiting', 'approved', 'edited', 'agent-draft');
  el.classList.add('pending', 'b');
  const slot = el.querySelector('.text-slot');
  const tsEl = el.querySelector('.field-ts');
  if (tsEl && ts) tsEl.textContent = ts;
  if (!el.querySelector('.cursor-chip')) {
    const c = document.createElement('div');
    c.className = 'cursor-chip';
    c.innerHTML =
      '<button class="chip-btn chip-ok"  onclick="approveField(\'' + id + '\')" data-chip="ok-'   + id + '">✓</button>' +
      '<button class="chip-btn chip-edit" onclick="editField(\''    + id + '\')" data-chip="edit-' + id + '">✎</button>' +
      '<button class="chip-btn chip-no"  onclick="rejectField(\''  + id + '\')" data-chip="no-'   + id + '">✗</button>';
    el.appendChild(c);
  }
  slot.textContent = '';
  await typeText(el, slot, value);
  if (sources) renderFieldSource(el, sources);
}

function setFieldAgentDraft(id, value) {
  const el = fieldEls[id]; if (!el) return;
  el.classList.remove('waiting', 'approved', 'edited', 'pending', 'c');
  el.classList.add('b', 'agent-draft');
  const slot = el.querySelector('.text-slot') || createSlot(el);
  const tsEl = el.querySelector('.field-ts');
  if (tsEl) tsEl.textContent = 'MedVita đề xuất';
  if (!el.querySelector('.cursor-chip')) {
    const c = document.createElement('div');
    c.className = 'cursor-chip';
    c.innerHTML =
      '<button class="chip-btn chip-ok"  onclick="approveField(\'' + id + '\')" data-chip="ok-'   + id + '">✓</button>' +
      '<button class="chip-btn chip-edit" onclick="editField(\''    + id + '\')" data-chip="edit-' + id + '">✎</button>' +
      '<button class="chip-btn chip-no"  onclick="rejectField(\''  + id + '\')" data-chip="no-'   + id + '">✗</button>';
    el.appendChild(c);
  }
  slot.textContent = '';
  return typeText(el, slot, value);
}

function createSlot(el) {
  const s = document.createElement('span');
  s.className = 'text-slot';
  el.appendChild(s);
  return s;
}

function typeText(el, slot, text, who) {
  return new Promise(function (resolve) {
    var label = (who === 'doctor') ? 'Bác sĩ đang điền' : 'MedVita đang điền';
    var type  = (who === 'doctor') ? 'doctor' : 'medvita';
    el.classList.add('filling');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showTypingTag(slot, label, type);
    let i = 0;
    var charInterval = (who === 'doctor') ? (devMode ? 16 : 80) : (devMode ? 3 : 16);
    const iv = setInterval(function () {
      if (paused) return;
      slot.textContent = text.slice(0, ++i);
      _posTypingTag(slot, slot.textContent);
      if (i >= text.length) {
        clearInterval(iv);
        el.classList.remove('filling');
        hideTypingTag();
        updateProgress();
        resolve();
      }
    }, charInterval);
  });
}

function fillA(id) {
  const el = fieldEls[id]; if (!el) return;
  const slot = el.querySelector('.text-slot');
  el.classList.add('filling');
  slot.textContent = groupA[id] || '';
  setTimeout(function () { el.classList.remove('filling'); }, 500);
}

function approveField(id) {
  const el = fieldEls[id]; if (!el) return;
  el.classList.remove('pending', 'edited', 'agent-draft');
  el.classList.add('approved');
  const slot = el.querySelector('.text-slot');
  if (slot) slot.contentEditable = 'false';
  updateProgress();
}

function rejectField(id) {
  const el = fieldEls[id]; if (!el) return;
  el.classList.remove('pending', 'approved', 'edited', 'agent-draft');
  el.classList.add('waiting');
  const slot = el.querySelector('.text-slot');
  if (slot) { slot.textContent = '[Chờ bác sĩ]'; slot.contentEditable = 'false'; }
  const tsEl = el.querySelector('.field-ts');
  if (tsEl) tsEl.textContent = '';
  updateProgress();
}

function editField(id) {
  const el = fieldEls[id]; if (!el) return;
  el.classList.remove('approved', 'agent-draft');
  el.classList.add('edited');
  const slot = el.querySelector('.text-slot');
  slot.contentEditable = 'true';
  slot.focus();
  updateProgress();
}

function scrollFormToPage(p) {
  const pg = pdfScroll.querySelector('.pdf-page[data-page="' + p + '"]');
  if (pg) pg.scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.getElementById('pageInfo').textContent = 'Trang ' + p + '/4';
}

// ===== AUTO-APPROVE WITH VISUAL CLICK =====
function autoApprove(id) {
  const el = fieldEls[id]; if (!el) return;
  const chip = el.querySelector('.chip-ok');
  if (chip) simClick(chip, 'sim-chip-click');
  setTimeout(function () { approveField(id); }, 250);
}
