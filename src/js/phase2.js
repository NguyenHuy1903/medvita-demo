// ===== PHASE 2: CHAT ASSISTANT =====
const chatTurns = [
  {
    doctor: 'điền chỉ định xét nghiệm tiền phẫu',
    mvText: 'Dưới đây là các xét nghiệm tiền phẫu thường dùng cho bệnh nhân chuẩn bị phẫu thuật tai mũi họng. Bác sĩ vui lòng chọn những xét nghiệm cần thiết để tôi lưu vào bệnh án nhé.',
    card: true,
    cardSelectable: true,
    cardAllTags: ['PT','APTT','Fibrinogen','Nhóm máu','Glucose','Creatinin','Ure','AST','ALT','HIV','HBsAg','HCV','Tổng phân tích máu','Nước tiểu','Điện tim','X-quang ngực','Thính lực','Nhĩ lượng'],
    cardTags: ['PT','APTT','Nhóm máu','Glucose','HIV','HBsAg','Tổng phân tích máu','Điện tim','X-quang ngực'],
    fieldAction: {type:'agentDraft', id:'khamck', value:'XN tiền phẫu: PT, APTT, Nhóm máu, Glucose, HIV, HBsAg, Tổng phân tích máu, Điện tim, X-quang ngực.'},
    autoApproveField: 'khamck',
  },
  {
    doctor: 'nhân tuyến giáp TIRADS 3 trái trong bệnh sử — cần xử lý gì không?',
    mvText: 'TIRADS 3 chưa cần sinh thiết ngay. Tôi đề xuất bổ sung T3, FT4, TSH vào chỉ định XN để đánh giá chức năng tuyến giáp, và hẹn siêu âm kiểm tra lại sau 12 tháng theo ACR TI-RADS. Bác sĩ xác nhận?',
    actions: true,
    autoClickAction: 'confirm',
  },
  {
    doctor: 'cần hoàn tất gì?',
    mvText: 'Đã hoàn tất 2/4 mục. Còn lại:',
    checklist: [
      {icon:'✅', text:'Chỉ định XN tiền phẫu — 9 xét nghiệm đã duyệt'},
      {icon:'✅', text:'Theo dõi nhân tuyến giáp — siêu âm kiểm tra lại sau 12 tháng'},
      {icon:'⬜', text:'Chẩn đoán sơ bộ — đề xuất J35.0, chờ bác sĩ duyệt'},
      {icon:'⬜', text:'Hướng điều trị — chờ bác sĩ điền phác đồ / chỉ định phẫu thuật'},
    ],
    directEditBtn: true,
    autoClickAction: 'directEdit',
  },
  {
    isDirect: true,
    mvText: "Field 'Chẩn đoán sơ bộ' đang ở chế độ chỉnh sửa. Nhấn Tab để xác nhận.",
    autoClickAction: 'tabApprove',
  },
  {
    doctor: 'điền hướng điều trị',
    mvText: 'Dựa trên chẩn đoán J35.0, tôi đề xuất phác đồ ngoại khoa. Bác sĩ duyệt?',
    fieldAction: {type:'agentDraft', id:'huongdt', page:4, value:'Phẫu thuật: Cắt amidan (phương pháp lạnh) + Nạo VA.\nTheo dõi: Nhân tuyến giáp TIRADS 3 trái — siêu âm kiểm tra lại sau 12 tháng (ACR TI-RADS).'},
    autoApproveField: 'huongdt',
    tickChecklistIdx: 3,
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
  document.getElementById('chatInputArea').style.display = '';
  document.getElementById('hdrTitle').textContent = 'Đang hỗ trợ hoàn thiện bệnh án';
  document.getElementById('hdrSub').textContent = 'Bác sĩ ra lệnh · MedVita tạo nháp · Bác sĩ duyệt trước khi lưu';
  document.getElementById('recBadge').style.display = 'none';
  document.getElementById('btnPause').style.display = 'none';
  paused = false;
  chatTurnIndex = 0;

  // Auto-click summary Duyệt
  setTimeout(function () {
    const btn = document.getElementById('sumDuyet');
    simClick(btn, 'sim-click-green');
    setTimeout(function () { btn.textContent = '✓ Đã duyệt'; btn.disabled = true; }, speed(300));
  }, speed(600));

  // Start auto chat after summary
  setTimeout(function () { autoRunChat(); }, speed(1400));
}

async function autoRunChat() {
  for (let i = 0; i < chatTurns.length; i++) {
    chatTurnIndex = i;
    updateChatInput();
    await delay(500);
    await autoRunChatTurn(i);
    await delay(600);
  }
  chatTurnIndex = chatTurns.length;
  updateChatInput();

  // Auto-click export when all done
  await delay(speed(800));
  const exp = document.getElementById('exportBtn');
  simClick(exp, 'sim-click-green');
  await delay(speed(500));
  // Auto confirm in review modal
  showReviewModal();
  await delay(speed(1400));
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
  if (turn.isDirect) {
    input.value = ''; input.disabled = true; sendBtn.disabled = true;
  } else {
    input.value = turn.doctor; input.disabled = false; sendBtn.disabled = false;
  }
}

async function autoRunChatTurn(index) {
  const turn = chatTurns[index];
  const hist = document.getElementById('fpFeed');

  if (turn.isDirect) {
    await triggerDirectEdit();
    if (turn.autoClickAction === 'tabApprove') {
      await delay(1200);
      const el = fieldEls['chandoan'];
      if (el) {
        const chip = el.querySelector('.chip-ok');
        if (chip) simClick(chip, 'sim-chip-click');
        setTimeout(function () {
          approveField('chandoan');
          setTimeout(function () { tickChecklist(2); }, 400);
        }, 250);
      }
    }
    return;
  }

  // Visual: click send button
  const sendBtn = document.getElementById('chatSendBtn');
  simClick(sendBtn);
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
  if (turn.directEditBtn) {
    inner += '<div style="margin-top:8px;"><button class="mv-cta p" id="directEditTrigger">Chỉnh sửa trực tiếp chẩn đoán</button></div>';
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
    if (turn.fieldAction) {
      scrollFormToPage(2);
      await setFieldAgentDraft(turn.fieldAction.id, turn.fieldAction.value);
    }
    await delay(300);
    const txtEl = mvResp.querySelector('.chat-mv-txt');
    if (txtEl) txtEl.textContent = 'Đã chọn ' + selected.length + ' xét nghiệm. Bác sĩ có thể chỉnh sửa lại trong phần chỉ định XN nếu cần nhé.';
  }

  // Auto-approve field if specified
  if (turn.autoApproveField) { await delay(500); autoApprove(turn.autoApproveField); await delay(400); }

  // Tick checklist item after approval
  if (turn.tickChecklistIdx !== undefined) {
    await delay(300);
    tickChecklist(turn.tickChecklistIdx);
  }

  // Auto-click action buttons
  if (turn.autoClickAction === 'confirm') {
    await delay(600);
    const btn = document.getElementById('actionConfirm');
    if (btn) {
      simClick(btn);
      setTimeout(function () { btn.textContent = '✓ Đã xác nhận'; btn.disabled = true; }, speed(300));
    }
  }
  if (turn.autoClickAction === 'directEdit') {
    await delay(800);
    const btn = document.getElementById('directEditTrigger');
    if (btn) {
      simClick(btn);
      await delay(350);
      btn.disabled = true;
      btn.style.opacity = '.4';
    }
  }
}

async function triggerDirectEdit() {
  const hist = document.getElementById('fpFeed');
  const el = fieldEls['chandoan']; if (!el) return;
  scrollFormToPage(4);
  await delay(400);
  el.classList.remove('waiting', 'c');
  el.classList.add('b', 'agent-draft');
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
  el.classList.remove('agent-draft');
  el.classList.add('edited');
  await typeText(el, slot, 'J35.0 Viêm amydan mãn tính');
  updateProgress();

  const mvResp = document.createElement('div');
  mvResp.className = 'chat-mv';
  mvResp.innerHTML = '<div class="chat-mv-lbl">MEDVITA</div><div class="chat-mv-txt">Ô <em>Chẩn đoán sơ bộ</em> đang mở chỉnh sửa trực tiếp. Bác sĩ nhấn <strong>Tab</strong> để xác nhận.</div>';
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
