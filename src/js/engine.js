// ===== FEED ENGINE =====
var currentProcess = null;
const fpFeed = document.getElementById('fpFeed');

function feedScroll() { fpFeed.scrollTo({ top: fpFeed.scrollHeight, behavior: 'smooth' }); }

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

function setFieldB(id, value, ts) {
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
  return typeText(el, slot, value);
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

function typeText(el, slot, text) {
  return new Promise(function (resolve) {
    el.classList.add('filling');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    let i = 0;
    const iv = setInterval(function () {
      if (paused) return;
      slot.textContent = text.slice(0, ++i);
      if (i >= text.length) {
        clearInterval(iv);
        el.classList.remove('filling');
        updateProgress();
        resolve();
      }
    }, devMode ? 16 : 80);
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
