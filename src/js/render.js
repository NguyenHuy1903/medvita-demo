// ===== BUILD PDF PAGES =====
const pdfScroll = document.getElementById('pdfScroll');
for (let p = 1; p <= 4; p++) {
  const pg = document.createElement('div');
  pg.className = 'pdf-page';
  pg.dataset.page = p;
  pg.innerHTML = '<span class="page-num">Trang ' + p + '</span><img src="../images/page_' + p + '.png" alt="trang ' + p + '" draggable="false">';
  pdfScroll.appendChild(pg);
}

// ===== PLACE FIELD OVERLAYS =====
const fieldEls = {};
FIELDS.forEach(function (f) {
  const host = pdfScroll.querySelector('.pdf-page[data-page="' + f.page + '"]');
  const el = document.createElement('div');

  if (f.g === 'A') {
    el.className = 'field a';
    el.innerHTML = '<span class="text-slot"></span>';
  } else if (f.g === 'C') {
    el.className = 'field c';
    el.innerHTML = '<span class="text-slot">[Chờ bác sĩ]</span><span class="field-ts"></span>';
  } else {
    const waiting = !!f.waiting;
    el.className = 'field b ' + (waiting ? 'waiting' : 'pending');
    const chips = waiting ? '' : (
      '<div class="cursor-chip">' +
        '<button class="chip-btn chip-ok"  onclick="approveField(\'' + f.id + '\')" data-chip="ok-'   + f.id + '">✓</button>' +
        '<button class="chip-btn chip-edit" onclick="editField(\''    + f.id + '\')" data-chip="edit-' + f.id + '">✎</button>' +
        '<button class="chip-btn chip-no"  onclick="rejectField(\''  + f.id + '\')" data-chip="no-'   + f.id + '">✗</button>' +
      '</div>'
    );
    el.innerHTML =
      '<span class="text-slot">' + (waiting ? '[Chờ bác sĩ]' : '') + '</span>' +
      '<span class="field-ts"></span>' +
      '<span class="approved-mark">✓ Đã duyệt</span>' +
      '<span class="edited-mark">Đã chỉnh sửa bởi bác sĩ</span>' +
      chips;
  }

  el.dataset.id = f.id;
  el.style.cssText = 'top:' + f.top + '%;left:' + f.left + '%;width:' + f.width + '%;' +
    (f.height ? 'min-height:' + f.height + '%;' : '');
  host.appendChild(el);
  fieldEls[f.id] = el;
});
