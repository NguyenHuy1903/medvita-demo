// ===== SPEED MODE =====
var devMode = false;

function speed(ms) { return devMode ? ms : ms * 5; }

function toggleMode() {
  devMode = !devMode;
  var btn = document.getElementById('btnMode');
  if (devMode) {
    btn.innerHTML = '⚡';
    btn.className = 'ctrl-btn mode-dev';
    btn.title = 'Dev mode: tốc độ nhanh (click để tắt)';
  } else {
    btn.innerHTML = '⚡';
    btn.className = 'ctrl-btn';
    btn.title = 'Dev mode: tốc độ nhanh';
  }
}

// ===== SIMULATE CLICK VISUAL =====
function simClick(el, cls) {
  if (!el) return;
  cls = cls || 'sim-click';
  el.classList.remove(cls);
  void el.offsetWidth; // force reflow
  el.classList.add(cls);
  el.addEventListener('animationend', function once() {
    el.classList.remove(cls);
    el.removeEventListener('animationend', once);
  });
}

// ===== PAUSE / RESUME STATE =====
var paused = false, resumeResolve = null;

function delay(ms) {
  return new Promise(function (r) { setTimeout(r, speed(ms)); });
}

function waitResume() {
  return new Promise(function (r) { resumeResolve = r; });
}

function checkPause() {
  return paused ? waitResume() : Promise.resolve();
}
