// ===== SPEED MODE =====
var devMode = false;

function speed(ms) { return devMode ? Math.round(ms / 5) : ms; }

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

// ===== AUDIO UNLOCK (browser autoplay policy) =====
// Chrome blocks audio unless triggered by a real user gesture.
// We play a silent token on the first real click/keydown to prime the permission.
(function () {
  var done = false;
  function unlock() {
    if (done) return;
    done = true;
    var a = new Audio();
    a.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
    a.play().catch(function () {});
  }
  document.addEventListener('click', unlock);
  document.addEventListener('keydown', unlock);
}());

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
