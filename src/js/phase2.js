// ===== PHASE 2: CHAT ASSISTANT =====
const chatTurns = [
  // Turn 0: doctor voice command → XN card + HIS result
  {
    isXNCommand: true,
    voiceText: 'list xét nghiệm cơ bản tai mũi họng',
    voiceAudio: '../audio/v7-xn-command/audio.wav',
    voiceMs: 2200,
  },
  // Turn 1: direct edit chandoan
  {
    isDirect: true,
    targetField: 'chandoan',
    mvText: "Ô Chẩn đoán sơ bộ đang mở chỉnh sửa trực tiếp. Bác sĩ nhấn Tab để xác nhận.",
    autoClickAction: 'tabApprove',
  },
  // Turn 2: direct edit huongdt
  {
    isDirect: true,
    targetField: 'huongdt',
    mvText: "Ô Hướng điều trị đang mở chỉnh sửa trực tiếp. Bác sĩ nhấn Tab để xác nhận.",
    autoClickAction: 'tabApproveHuongdt',
  },
];

let chatTurnIndex = 0, chatRunning = false, checklistEl = null;

function tickChecklist(idx) {
  if (!checklistEl) return;
  const icons = checklistEl.querySelectorAll('.chat-cl-icon');
  if (!icons[idx]) return;
  icons[idx].classList.add('tick-pop');
  setTimeout(function () { icons[idx].textContent = '✅'; }, 150);
}

function startPhase2() {
  document.getElementById('sideHdrTitle').textContent = 'Trợ lý MedVita';
  document.getElementById('sideHdrSub').textContent = 'Bác sĩ ra lệnh · MedVita tạo nháp';
  document.getElementById('chatSummary').style.display = '';
  document.getElementById('hdrTitle').textContent = 'Đang hỗ trợ hoàn thiện bệnh án';
  document.getElementById('hdrSub').textContent = 'Bác sĩ ra lệnh · MedVita tạo nháp · Bác sĩ duyệt trước khi lưu';
  document.getElementById('recBadge').style.display = 'none';
  paused = false;
  chatTurnIndex = 0;

  // Auto-click summary Duyệt
  setTimeout(function () {
    const btn = document.getElementById('sumDuyet');
    simClick(btn, 'sim-click-green');
    setTimeout(function () { btn.textContent = '✓ Đã duyệt'; btn.disabled = true; }, speed(300));
  }, speed(1500));

  // Start auto chat after summary
  setTimeout(function () { autoRunChat(); }, speed(2500));
}

async function autoRunChat() {
  for (let i = chatTurnIndex; i < chatTurns.length; i++) {
    chatTurnIndex = i;
    updateChatInput();
    await checkPause();
    await delay(500);
    await autoRunChatTurn(i);
    await checkPause();
    await delay(600);
  }
  chatTurnIndex = chatTurns.length;
  updateChatInput();

  // Auto-click export when all done
  await delay(speed(1200));
  const exp = document.getElementById('exportBtn');
  simClick(exp, 'sim-click-green');
  await delay(speed(500));
  // Auto confirm in review modal
  showReviewModal();
  await delay(speed(2800));
  const saveBtn = document.getElementById('reviewBtnSave');
  simClick(saveBtn, 'sim-click-green');
  setTimeout(confirmSave, speed(400));
}

function updateChatInput() {
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSendBtn');
  if (chatTurnIndex >= chatTurns.length) {
    input.value = ''; input.disabled = false; sendBtn.disabled = false;
    input.placeholder = 'Nhập yêu cầu cho MedVita...';
    const hist = document.getElementById('fpFeed');
    const d = document.createElement('div');
    d.className = 'chat-done-msg';
    d.textContent = '✓ Bệnh án sẵn sàng xuất';
    hist.appendChild(d);
    hist.scrollTop = hist.scrollHeight;
    return;
  }
  const turn = chatTurns[chatTurnIndex];
  if (turn.isDirect || turn.isXNCommand) {
    input.value = ''; input.disabled = true; sendBtn.disabled = true;
  } else {
    input.value = ''; input.disabled = false; sendBtn.disabled = true;
    input.placeholder = 'Nhập yêu cầu cho MedVita...';
  }
}

async function typeInInput(text) {
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSendBtn');
  input.placeholder = '';
  input.value = '';
  const charDelay = devMode ? 8 : 38;
  for (let i = 0; i < text.length; i++) {
    input.value += text[i];
    await new Promise(function (r) { setTimeout(r, charDelay); });
  }
  sendBtn.disabled = false;
  await delay(220);
}

async function autoRunChatTurn(index) {
  const turn = chatTurns[index];
  const hist = document.getElementById('fpFeed');

  if (turn.isXNCommand) {
    await showXNCardDirect(turn);
    return;
  }

  if (turn.isDirect) {
    if (turn.targetField === 'huongdt') {
      await triggerDirectEditHuongdt();
      if (turn.autoClickAction === 'tabApproveHuongdt') {
        await delay(1200);
        const el = fieldEls['huongdt'];
        if (el) {
          const chip = el.querySelector('.chip-ok');
          if (chip) simClick(chip, 'sim-chip-click');
          setTimeout(function () {
            approveField('huongdt');
          }, 250);
        }
      }
    } else {
      await triggerDirectEdit();
      if (turn.autoClickAction === 'tabApprove') {
        await delay(1200);
        const el = fieldEls['chandoan'];
        if (el) {
          const chip = el.querySelector('.chip-ok');
          if (chip) simClick(chip, 'sim-chip-click');
          setTimeout(function () {
            approveField('chandoan');
          }, 250);
        }
      }
    }
    return;
  }

  // Type message into input then send
  await typeInInput(turn.doctor);
  const sendBtn = document.getElementById('chatSendBtn');
  simClick(sendBtn, 'sim-send');
  document.getElementById('chatInput').value = '';
  document.getElementById('chatInput').placeholder = 'Nhập yêu cầu cho MedVita...';
  document.getElementById('chatInput').disabled = true;
  await delay(300);

  // Doctor message
  const docMsg = document.createElement('div');
  docMsg.className = 'chat-doctor';
  docMsg.innerHTML = '<div class="chat-doctor-bub">' + turn.doctor + '</div>';
  hist.appendChild(docMsg);
  hist.scrollTop = hist.scrollHeight;

  // Typing indicator
  const typing = document.createElement('div');
  typing.className = 'chat-typing';
  typing.innerHTML = '<div class="dots"><span></span><span></span><span></span></div><span>MedVita đang xử lý...</span>';
  hist.appendChild(typing);
  hist.scrollTop = hist.scrollHeight;
  await delay(1200);
  typing.remove();

  // Field action (agent draft) — skipped for cardSelectable (handled after chip animation)
  if (turn.fieldAction && turn.fieldAction.type === 'agentDraft' && !turn.cardSelectable) {
    scrollFormToPage(turn.fieldAction.page || 2);
    await setFieldAgentDraft(turn.fieldAction.id, turn.fieldAction.value);
  }

  // MedVita response
  const mvResp = document.createElement('div');
  mvResp.className = 'chat-mv';
  let inner = '<div class="chat-mv-lbl">MEDVITA</div><div class="chat-mv-txt">' + turn.mvText + '</div>';
  if (turn.card && turn.cardSelectable) {
    inner += '<div class="chat-mv-card"><div class="chat-mv-card-tags selectable">';
    turn.cardAllTags.forEach(function (tag) {
      inner += '<button class="chat-mv-card-tag-btn" data-tag="' + tag + '">' + tag + '</button>';
    });
    inner += '</div></div>';
  } else if (turn.card) {
    inner += '<div class="chat-mv-card"><div class="chat-mv-card-tags">';
    turn.cardTags.forEach(function (tag) { inner += '<span class="chat-mv-card-tag">' + tag + '</span>'; });
    inner += '</div></div>';
  }
  if (turn.actions) {
    inner += '<div class="chat-mv-actions"><button class="mv-cta p" id="actionConfirm">Xác nhận</button><button class="mv-cta s" id="actionSkip">Bỏ qua</button></div>';
  }
  if (turn.checklist) {
    inner += '<div class="chat-checklist">';
    turn.checklist.forEach(function (item) {
      inner += '<div class="chat-cl-item"><span class="chat-cl-icon">' + item.icon + '</span><span>' + item.text + '</span></div>';
    });
    inner += '</div>';
  }
  mvResp.innerHTML = inner;
  hist.appendChild(mvResp);
  hist.scrollTop = hist.scrollHeight;
  if (turn.checklist) { checklistEl = mvResp.querySelector('.chat-checklist'); }

  // Selectable chip animation
  if (turn.cardSelectable) {
    await delay(400);
    const tagBtns = Array.from(mvResp.querySelectorAll('.chat-mv-card-tag-btn'));
    const selected = turn.cardTags;
    for (let i = 0; i < tagBtns.length; i++) {
      const btn = tagBtns[i];
      if (selected.includes(btn.dataset.tag)) {
        await delay(130);
        simClick(btn, 'sim-chip-click');
        btn.classList.add('selected');
        hist.scrollTop = hist.scrollHeight;
      }
    }
    await delay(300);
    const txtEl = mvResp.querySelector('.chat-mv-txt');
    if (txtEl) txtEl.textContent = 'Đã chọn ' + selected.length + ' xét nghiệm. Bác sĩ có thể chỉnh sửa lại trong phần chỉ định XN nếu cần nhé.';
    if (turn.fieldAction) {
      await delay(400);
      const proc = addFeedProcess('process', 'Đang điền chỉ định XN tiền phẫu…');
      scrollFormToPage(3);
      fieldEls[turn.fieldAction.id].classList.remove('waiting');
      await setFieldB(turn.fieldAction.id, turn.fieldAction.value);
      finishFeedProcess(proc);
      addFeedDone('✓ Đã thêm chỉ định XN tiền phẫu', '9 mục XN tiền phẫu đã được điền vào bệnh án.');
    }
  }

  // Auto-approve field if specified
  if (turn.autoApproveField) { await delay(500); autoApprove(turn.autoApproveField); await delay(400); }

  // Auto-click action buttons
  if (turn.autoClickAction === 'confirm') {
    await delay(600);
    const btn = document.getElementById('actionConfirm');
    if (btn) {
      simClick(btn);
      setTimeout(function () { btn.textContent = '✓ Đã xác nhận'; btn.disabled = true; }, speed(300));
    }
  }
}


async function showXNCardDirect(turn) {
  const hist = document.getElementById('fpFeed');

  // 1. Doctor types command in chat input (avoids TTS pronunciation issues)
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSendBtn');
  input.disabled = false;
  await typeInInput(turn.voiceText);
  simClick(sendBtn, 'sim-send');
  input.value = '';
  input.placeholder = 'Nhập yêu cầu cho MedVita...';
  input.disabled = true;
  await delay(300);

  // Doctor message bubble
  const docMsg = document.createElement('div');
  docMsg.className = 'chat-doctor';
  docMsg.innerHTML = '<div class="chat-doctor-bub">' + turn.voiceText + '</div>';
  hist.appendChild(docMsg);
  hist.scrollTop = hist.scrollHeight;
  await delay(400);

  // 2. MedVita typing indicator
  const typing = document.createElement('div');
  typing.className = 'chat-typing';
  typing.innerHTML = '<div class="dots"><span></span><span></span><span></span></div><span>MedVita đang xử lý...</span>';
  hist.appendChild(typing);
  hist.scrollTop = hist.scrollHeight;
  await delay(speed(1000));
  typing.remove();

  // 4. XN card — 17 TMH tests, 5 auto-selected
  const allTags = [
    'Công thức tế bào máu','CRP','Procalcitonin','Creatinin','Ure','Glucose',
    'GOT/AST','GPT/ALT','Điện giải đồ','HBsAg','HIV','Tổng phân tích nước tiểu',
    'Cấy vi khuẩn dịch mũi','X-quang xoang mặt','CT xoang','Nội soi mũi','Thính lực đồ',
  ];
  const selected = ['Công thức tế bào máu','CRP','Creatinin','Glucose','X-quang xoang mặt'];

  const mvResp = document.createElement('div');
  mvResp.className = 'chat-mv';
  let inner = '<div class="chat-mv-lbl">MEDVITA</div>' +
    '<div class="chat-mv-txt">Xét nghiệm cơ bản TMH — tôi đã đánh dấu sẵn 5 mục phù hợp viêm xoang cấp. Bác sĩ chỉnh sửa nếu cần.</div>' +
    '<div class="chat-mv-card"><div class="chat-mv-card-tags selectable">';
  allTags.forEach(function(tag) {
    inner += '<button class="chat-mv-card-tag-btn" data-tag="' + tag + '">' + tag + '</button>';
  });
  inner += '</div></div>';
  mvResp.innerHTML = inner;
  hist.appendChild(mvResp);
  hist.scrollTop = hist.scrollHeight;

  // 5. Auto-select 5 tests — pace like a real doctor reading through the list
  await delay(600);
  const tagBtns = Array.from(mvResp.querySelectorAll('.chat-mv-card-tag-btn'));
  for (let i = 0; i < tagBtns.length; i++) {
    const btn = tagBtns[i];
    // Small pause on every item (reading), longer pause on selected ones
    const readDelay = devMode ? 80 + Math.random() * 60 : 300 + Math.random() * 200;
    await delay(readDelay);
    if (selected.includes(btn.dataset.tag)) {
      simClick(btn, 'sim-chip-click');
      btn.classList.add('selected');
      hist.scrollTop = hist.scrollHeight;
      // Extra pause after each selection — decision moment
      const selectDelay = devMode ? 180 + Math.random() * 120 : 700 + Math.random() * 400;
      await delay(selectDelay);
    }
  }
  await delay(devMode ? 300 : 800);

  // 6. Process: tạo phiếu chỉ định
  const proc1 = addFeedProcess('process', 'Đang tạo phiếu chỉ định…');
  await delay(speed(900));
  finishFeedProcess(proc1);
  addFeedDone('Phiếu chỉ định XN', 'Phiếu #XN-2605-0042 đã gửi HIS ✓');
  await delay(speed(400));

  // 7. Simulate HIS lab processing (3.5s)
  const proc2 = addFeedProcess('process', 'Đang chờ kết quả từ HIS…');
  await delay(speed(3500));
  finishFeedProcess(proc2);

  // 8. MedVita TTS — kết quả về (§4.3)
  await playMedVitaTTS('../audio/mv3-xn-result/audio.wav', 3000);

  // 9. HIS result card
  addFeedHISResult();
  await delay(500);

  // 10. AI auto-fill xetnghiemlamsan
  const proc3 = addFeedProcess('process', 'Đang điền kết quả XN vào bệnh án…');
  scrollFormToPage(3);
  if (fieldEls['xetnghiemlamsan']) fieldEls['xetnghiemlamsan'].classList.remove('waiting');
  await setFieldB('xetnghiemlamsan',
    'BC 11.2 G/L ↑ · CRP 48 mg/L ↑ · Glucose 4.35 mmol/L (BT) · Creatinin 61.05 µmol/L (BT). X-quang xoang: đang xử lý.',
    null,
    [{type:'his', field:'#XN-2605-0042'}]
  );
  finishFeedProcess(proc3);
  autoApprove('xetnghiemlamsan');
  addFeedDone('Kết quả XN', '✓ Đã cập nhật BC, CRP, Glucose, Creatinin vào bệnh án.');
  await delay(speed(1200));
}

async function triggerDirectEdit() {
  const hist = document.getElementById('fpFeed');
  const el = fieldEls['chandoan']; if (!el) return;
  scrollFormToPage(4);
  await delay(400);
  el.classList.remove('waiting', 'c', 'agent-draft');
  el.classList.add('b', 'edited');
  const slot = el.querySelector('.text-slot') || createSlot(el);
  if (!el.querySelector('.cursor-chip')) {
    const c = document.createElement('div');
    c.className = 'cursor-chip';
    c.innerHTML =
      '<button class="chip-btn chip-ok"  onclick="approveField(\'chandoan\')" data-chip="ok-chandoan">✓</button>' +
      '<button class="chip-btn chip-edit" onclick="editField(\'chandoan\')"   data-chip="edit-chandoan">✎</button>' +
      '<button class="chip-btn chip-no"  onclick="rejectField(\'chandoan\')" data-chip="no-chandoan">✗</button>';
    el.appendChild(c);
  }
  if (!el.querySelector('.edited-mark')) {
    const am = document.createElement('span'); am.className = 'approved-mark'; am.textContent = '✓ Đã duyệt'; el.appendChild(am);
    const em = document.createElement('span'); em.className = 'edited-mark'; em.textContent = 'Đang chỉnh sửa bởi bác sĩ'; el.appendChild(em);
  }
  slot.textContent = '';
  await typeText(el, slot, 'J01 Viêm xoang cấp. Bệnh kèm: Viêm họng cấp', 'doctor');
  updateProgress();

  const mvResp = document.createElement('div');
  mvResp.className = 'chat-mv';
  mvResp.innerHTML = '<div class="chat-mv-lbl">MEDVITA</div><div class="chat-mv-txt">Ô <em>Chẩn đoán sơ bộ</em> đang mở chỉnh sửa trực tiếp. Bác sĩ nhấn <strong>Tab</strong> để xác nhận.</div>';
  hist.appendChild(mvResp);
  hist.scrollTop = hist.scrollHeight;
}

async function triggerDirectEditHuongdt() {
  const hist = document.getElementById('fpFeed');
  const el = fieldEls['huongdt']; if (!el) return;
  scrollFormToPage(4);
  await delay(400);
  el.classList.remove('waiting', 'c');
  el.classList.add('b', 'edited');
  const slot = el.querySelector('.text-slot') || createSlot(el);
  if (!el.querySelector('.cursor-chip')) {
    const c = document.createElement('div');
    c.className = 'cursor-chip';
    c.innerHTML =
      '<button class="chip-btn chip-ok"  onclick="approveField(\'huongdt\')" data-chip="ok-huongdt">✓</button>' +
      '<button class="chip-btn chip-edit" onclick="editField(\'huongdt\')"   data-chip="edit-huongdt">✎</button>' +
      '<button class="chip-btn chip-no"  onclick="rejectField(\'huongdt\')" data-chip="no-huongdt">✗</button>';
    el.appendChild(c);
  }
  if (!el.querySelector('.edited-mark')) {
    const am = document.createElement('span'); am.className = 'approved-mark'; am.textContent = '✓ Đã duyệt'; el.appendChild(am);
    const em = document.createElement('span'); em.className = 'edited-mark'; em.textContent = 'Đang chỉnh sửa bởi bác sĩ'; el.appendChild(em);
  }
  // Hide chip during typing to avoid cluttered UI
  var huongChip = el.querySelector('.cursor-chip');
  if (huongChip) huongChip.style.display = 'none';
  slot.textContent = '';
  await typeText(el, slot, huongdtText); // use MedVita speed (16ms/char) — text is too long for doctor speed
  if (huongChip) huongChip.style.display = '';
  updateProgress();

  const mvResp = document.createElement('div');
  mvResp.className = 'chat-mv';
  mvResp.innerHTML = '<div class="chat-mv-lbl">MEDVITA</div><div class="chat-mv-txt">Ô <em>Hướng điều trị</em> đang mở chỉnh sửa trực tiếp. Bác sĩ nhấn <strong>Tab</strong> để xác nhận.</div>';
  hist.appendChild(mvResp);
  hist.scrollTop = hist.scrollHeight;
}

// Summary panel quick actions
function summaryAction(type, btn) {
  const map = { duyet: '✓ Đã duyệt', sua: 'Đang sửa...' };
  btn.textContent = map[type] || btn.textContent;
  btn.disabled = true;
}
document.getElementById('sumDuyet').onclick = function () { summaryAction('duyet', this); };
document.getElementById('sumSua').onclick   = function () { summaryAction('sua',   this); };
