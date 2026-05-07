// ===== STEP SEQUENCE (Phase 1) =====
// var (not const) — allows video-specific files to override this array
var steps = [
  // Open record
  {t:'feedStatus', icon:'📋', label:'', text:'Đã mở bệnh án cho Nguyễn Thị Hoa · Mã BN 26063163'},
  {t:'delay', ms:1500},

  // HIS auto-fill — instant from system
  {t:'feedProcess', tag:'process', summary:'Đang điền thông tin hành chính từ HIS…'},
  {t:'fillA', ids:['hoTen','sD1','sD2','sD3','sD4','sD5','sD6','sD7','sD8','tuoi','gioi','nghe','dantoc','diachiXa','diachiHuyen','diachiTinh','bhytNgay','bhytThang','bhytNam','sdt']},
  {t:'delay', ms:1000},
  {t:'feedFinishProcess'},
  {t:'feedDone', label:'Thông tin HIS', text:'Đã điền tên, SĐT, BHYT, mã bệnh án từ hệ thống HIS.'},
  {t:'delay', ms:1800},

  // ── VOICE 1 ── Lý do vào viện
  {t:'scrollForm', page:2},
  {t:'feedProcess', tag:'process', summary:'Đang ghi nhận "Lý do vào viện"…'},
  {t:'feedVoice', text:'lý do vào viện: ho, sốt', audio:'../audio/v1-lydo/audio.wav', ms:1600},
  {t:'delay', ms:700},
  {t:'fieldB', id:'lydo', value:'Ho, sốt', sources:[
    {type:'audio', ts:'00:02–00:06', quote:'lý do vào viện: ho, sốt'},
  ]},
  {t:'feedFinishProcess'},
  {t:'autoApprove', id:'lydo'},
  {t:'feedDone', label:'Lý do vào viện', text:'✓ Đã ghi nhận.'},
  {t:'delay', ms:1800},

  // ── VOICE 2 ── Quá trình bệnh lý
  {t:'feedProcess', tag:'process', summary:'Đang ghi nhận "Quá trình bệnh lý"…'},
  {t:'feedVoice', text:'ngạt mũi, chảy mũi 1 tuần, ho có đờm — chưa dùng thuốc — hôm nay sốt 39°, đau đầu, nôn, chảy mũi tăng, vào viện — cấp cứu xử trí paracetamol rồi chuyển khoa', audio:'../audio/v2-qtbl/audio.wav', ms:5000},
  {t:'delay', ms:900},
  {t:'fieldB', id:'qtbl', value:qtblText, sources:[
    {type:'audio', ts:'00:08–00:34', quote:'bệnh nhân ngạt mũi, chảy mũi...'},
    {type:'audio', ts:'00:41–01:02', quote:'hôm nay sốt 39 độ...'},
  ]},
  {t:'feedFinishProcess'},
  {t:'autoApprove', id:'qtbl'},
  {t:'feedDone', label:'Quá trình bệnh lý', text:'✓ Đã điền xong — MedVita đã chuẩn hoá văn phong lâm sàng.'},
  {t:'delay', ms:2000},

  // ── VOICE 3 ── Tiền sử (bản thân + gia đình, trong cùng một đoạn đọc)
  {t:'feedProcess', tag:'process', summary:'Đang ghi nhận tiền sử…'},
  {t:'feedVoice', text:'tiền sử: dị ứng kháng sinh không rõ loại — không hút thuốc, không uống rượu bia — gia đình không bệnh lý gì đặc biệt', audio:'../audio/v3-tiensu/audio.wav', ms:4500},
  {t:'delay', ms:700},
  {t:'fieldB', id:'tiensu', value:tiensuText, sources:[
    {type:'audio', ts:'01:15–01:28', quote:'dị ứng kháng sinh không rõ loại'},
  ]},
  {t:'fieldB', id:'tiensuGD', value:tiensuGDText, sources:[
    {type:'audio', ts:'01:28–01:35', quote:'gia đình không bệnh lý gì đặc biệt'},
  ]},
  {t:'feedFinishProcess'},
  {t:'autoApprove', id:'tiensu'},
  {t:'autoApprove', id:'tiensuGD'},
  {t:'feedDone', label:'Tiền sử', text:'✓ Dị ứng kháng sinh · Gia đình không bệnh lý đặc biệt.'},
  {t:'delay', ms:1200},

  // MedVita TTS — alert dị ứng kháng sinh (§4.1)
  {t:'feedAnnounce', variant:'alert', title:'Phát hiện dị ứng kháng sinh', text:'Bệnh nhân có tiền sử dị ứng kháng sinh không rõ loại. Tôi sẽ đánh dấu cảnh báo vào hướng điều trị.'},
  {t:'feedMVSpeak', audio:'../audio/mv1-allergy/audio.wav', ms:3500},
  {t:'delay', ms:1800},

  // Sinh hiệu — auto từ HIS
  {t:'feedProcess', tag:'process', summary:'Đang điền sinh hiệu…'},
  {t:'fillA', ids:['mach','nhietdo','ha','nhiptho','cannang']},
  {t:'delay', ms:1000},
  {t:'feedFinishProcess'},
  {t:'feedDone', label:'Sinh hiệu', text:'Mạch 90 · T° 38.8°C · HA 110/60 · NT 20 · CN 41 kg.'},
  {t:'delay', ms:1800},

  // ── VOICE 4 ── Khám lâm sàng TMH + toàn thân
  {t:'feedProcess', tag:'process', summary:'Đang ghi nhận khám lâm sàng…'},
  {t:'feedVoice', text:'mũi khe và sàn nhiều dịch mủ đặc — họng xung huyết, hạ họng ứ đọng dịch — tai bình thường hai bên — bệnh nhân tỉnh, tiếp xúc tốt', audio:'../audio/v4-kham/audio.wav', ms:4500},
  {t:'delay', ms:800},
  {t:'fieldB', id:'khamtoanthan', value:khamtoanthanText, sources:[
    {type:'audio', ts:'02:10–02:45', quote:'mũi khe và sàn nhiều dịch mủ...'},
  ]},
  {t:'feedFinishProcess'},
  {t:'feedDone', label:'Khám lâm sàng', text:'✓ Đã ghi nhận toàn bộ kết quả thăm khám.'},
  {t:'delay', ms:2000},

  // MedVita TTS — xin điền Tóm tắt (§4.2)
  {t:'feedMVSpeak', audio:'../audio/mv2-tomtat/audio.wav', ms:3500},
  {t:'feedAnnounce', variant:'permission', title:'📝 Tóm tắt bệnh án', sources:[
    {label:'Lý do vào viện', val:'"Ho, sốt"'},
    {label:'Tiền sử', val:'"Dị ứng kháng sinh"'},
    {label:'Sinh hiệu', val:'"Sốt 38.8°C"'},
    {label:'Khám lâm sàng', val:'"Mũi dịch mủ đặc..."'},
  ], autoApprove:true},
  {t:'delay', ms:800},

  // AI fill Tóm tắt
  {t:'feedProcess', tag:'process', summary:'Đang điền "Tóm tắt bệnh án"…'},
  {t:'scrollForm', page:3},
  {t:'fieldB', id:'tomtat', value:tomtatText, sources:[
    {type:'infer', fields:['lydo','tiensu','khamtoanthan','nhietdo']},
  ]},
  {t:'feedFinishProcess'},
  {t:'autoApprove', id:'tomtat'},
  {t:'feedDone', label:'Tóm tắt bệnh án', text:'✓ Đã điền xong.'},
  {t:'delay', ms:2200},

  // Hoàn tất Phase 1
  {t:'feedStatus', icon:'✅', label:'Hoàn tất điền bệnh án', text:'Tất cả các trường đã được điền. Bác sĩ vui lòng kiểm tra và duyệt.'},
  {t:'delay', ms:2500},
  {t:'endPhase1'},
];

// ===== STEP RUNNER =====
async function runStep(step) {
  await checkPause();
  switch (step.t) {
    case 'delay':               await delay(step.ms); break;
    case 'scrollForm':          scrollFormToPage(step.page); await delay(400); break;
    case 'fillA':               step.ids.forEach(function (id) { fillA(id); }); await delay(devMode ? 0 : 300); break;
    case 'fieldB':              await setFieldB(step.id, step.value, step.ts, step.sources); break;
    case 'feedStatus':          addFeedStatus(step.icon, step.label, step.text); break;
    case 'feedProcess':         currentProcess = addFeedProcess(step.tag, step.summary); break;
    case 'feedFinishProcess':   finishFeedProcess(currentProcess); currentProcess = null; break;
    case 'feedDone':            addFeedDone(step.label, step.text); break;
    case 'feedVoice':           await playVoiceInput(step.text, step.audio, step.ms); break;
    case 'feedMVSpeak':         await playMedVitaTTS(step.audio, step.ms); break;
    case 'feedAnnounce': {
      const annEl = addFeedAnnounce(step.variant, step.title, step.text, step.sources);
      if (step.variant === 'permission' && step.autoApprove) {
        // Always wait real 2500ms so the card is visible before auto-approve
        await new Promise(function(r) { setTimeout(r, 2500); });
        const btn = annEl.querySelector('.fp-announce-allow');
        if (btn) { simClick(btn, 'sim-click-green'); await delay(300); btn.textContent = '✓ Cho phép'; btn.disabled = true; }
      }
      break;
    }
    case 'feedHISResult':       addFeedHISResult(); break;
    case 'feedQuestion':        addFeedQuestion(step.text); break;
    case 'feedSuggestion':      addFeedSuggestion(step.title, step.text); break;
    case 'feedUpdate':          addFeedUpdate(step.summary, step.detail); break;
    case 'autoApprove':         autoApprove(step.id); await delay(400); break;
    case 'endPhase1':           showPhase1End(); break;
  }
}

async function processQueue() {
  for (let i = 0; i < steps.length; i++) {
    await runStep(steps[i]);
  }
}
