// ===== STEP SEQUENCE (Phase 1 — AI auto-fill) =====
const steps = [
  // Open record
  {t:'feedStatus', icon:'📋', label:'', text:'Đã mở bệnh án cho Nguyễn Thị Hồng'},
  {t:'delay', ms:500},

  // HIS auto-fill
  {t:'feedProcess', tag:'process', summary:'Đang điền thông tin hành chính từ HIS…'},
  {t:'fillA', ids:['hoTen','sD1','sD2','sD3','sD4','sD5','sD6','sD7','sD8','tuoi','gioi','nghe','dantoc','diachiXa','diachiHuyen','diachiTinh','bhytNgay','bhytThang','bhytNam','sdt']},
  {t:'delay', ms:400},
  {t:'feedFinishProcess'},
  {t:'feedDone', label:'Thông tin HIS', text:'Đã điền tên, SĐT, BHYT, dấu hiệu sinh tồn từ hệ thống HIS.'},
  {t:'delay', ms:400},

  // Lý do vào viện
  {t:'feedProcess', tag:'process', summary:'Đang điền "Lý do vào viện"…'},
  {t:'scrollForm', page:2},
  {t:'fieldB', id:'lydo', value:'Nuốt vướng'},
  {t:'feedFinishProcess'},
  {t:'autoApprove', id:'lydo'},
  {t:'feedDone', label:'Lý do vào viện', text:'✓ Đã điền xong trường "Lý do vào viện".'},
  {t:'delay', ms:300},

  // Quá trình bệnh lý
  {t:'feedProcess', tag:'process', summary:'Đang điền "Quá trình bệnh lý"…'},
  {t:'fieldB', id:'qtbl', value:qtblText},
  {t:'feedFinishProcess'},
  {t:'autoApprove', id:'qtbl'},
  {t:'feedDone', label:'Quá trình bệnh lý', text:'✓ Đã điền xong trường "Quá trình bệnh lý".'},
  {t:'delay', ms:300},

  // Tiền sử bản thân
  {t:'feedProcess', tag:'process', summary:'Đang điền "Tiền sử bản thân"…'},
  {t:'fieldB', id:'tiensu', value:tiensuText},
  {t:'feedFinishProcess'},
  {t:'autoApprove', id:'tiensu'},
  {t:'feedDone', label:'Tiền sử bản thân', text:'✓ Đã điền xong trường "Tiền sử bản thân".'},
  {t:'delay', ms:200},

  // Tiền sử gia đình
  {t:'feedProcess', tag:'process', summary:'Đang điền "Tiền sử gia đình"…'},
  {t:'fieldB', id:'tiensuGD', value:tiensuGDText},
  {t:'feedFinishProcess'},
  {t:'autoApprove', id:'tiensuGD'},
  {t:'feedDone', label:'Tiền sử gia đình', text:'✓ Đã điền xong trường "Tiền sử gia đình".'},
  {t:'delay', ms:300},

  // Sinh hiệu
  {t:'feedProcess', tag:'process', summary:'Đang điền sinh hiệu…'},
  {t:'fillA', ids:['mach','nhietdo','ha','nhiptho','cannang']},
  {t:'delay', ms:400},
  {t:'feedFinishProcess'},
  {t:'feedDone', label:'Sinh hiệu', text:'Mạch 78 · T° 36.8 · HA 120/75 · NT 18 · CN 52 kg.'},
  {t:'delay', ms:300},

  // Khám TMH
  {t:'feedProcess', tag:'process', summary:'Đang điền "Khám TMH"…'},
  {t:'fieldBWaiting2Pending', id:'khamck', value:khamTMHText},
  {t:'feedFinishProcess'},
  {t:'autoApprove', id:'khamck'},
  {t:'feedDone', label:'Khám TMH', text:'✓ Đã điền xong trường "Khám TMH".'},
  {t:'delay', ms:300},

  // Tóm tắt
  {t:'feedProcess', tag:'process', summary:'Đang điền "Tóm tắt bệnh án"…'},
  {t:'scrollForm', page:3},
  {t:'fieldB', id:'tomtat', value:tomtatText},
  {t:'feedFinishProcess'},
  {t:'autoApprove', id:'tomtat'},
  {t:'feedDone', label:'Tóm tắt bệnh án', text:'✓ Đã điền xong trường "Tóm tắt bệnh án".'},
  {t:'delay', ms:500},

  // Hoàn tất điền cơ bản
  {t:'feedStatus', icon:'✅', label:'Hoàn tất điền bệnh án', text:'Tất cả các trường đã được điền. Bác sĩ vui lòng kiểm tra và duyệt.'},
  {t:'delay', ms:800},

  // AI follow-up question
  {t:'feedQuestion', text:'Tôi nhận thấy trong hồ sơ, BN có đề cập "nhân tuyến giáp TIRADS 3 trái" phát hiện tại BV Đồng Hỷ nhưng chưa có ghi chú theo dõi. Bác sĩ bổ sung giúp ạ.'},
  {t:'delay', ms:1000},

  // Doctor voice command
  {t:'feedVoice', text:'Thêm ghi chú: nhân tuyến giáp TIRADS 3 trái, siêu âm theo dõi sau 6–12 tháng theo ACR.'},
  {t:'delay', ms:600},
  {t:'feedUpdate', summary:'Đã cập nhật trường "Tiền sử bản thân"', detail:'Thêm dòng: Nhân tuyến giáp TIRADS 3 trái, cần siêu âm theo dõi sau 6–12 tháng (hướng dẫn ACR).'},
  {t:'delay', ms:600},

  // Additional clinical note via voice
  {t:'feedVoice', text:'thêm vào khám toàn thân — vẻ mặt mệt mỏi, có quầng thâm mắt, gợi ý thiếu ngủ kéo dài do ngủ ngáy'},
  {t:'delay', ms:600},
  {t:'feedUpdate', summary:'Đã thêm ghi nhận lâm sàng vào "Khám toàn thân"', detail:'Bổ sung: Vẻ mặt mệt mỏi, quầng thâm mắt, gợi ý thiếu ngủ kéo dài do ngủ ngáy và khó thở khi ngủ.'},
  {t:'delay', ms:700},

  // AI surgical prep suggestion
  {t:'feedSuggestion', title:'Amidan quá phát III + VA tồn dư — gợi ý phác đồ tiền phẫu?', text:'BN nuốt vướng tái phát nhiều lần/năm, amidan quá phát độ III. Nếu chỉ định ngoại khoa, cần bộ XN tiền phẫu chuẩn (22 mục). Các XN đều trong danh mục BHYT.'},
  {t:'delay', ms:1000},
  {t:'feedVoice', text:'đúng rồi, chuẩn bị phác đồ tiền phẫu luôn'},
  {t:'delay', ms:600},
  {t:'feedDone', label:'✓ Đã thêm chỉ định XN tiền phẫu', text:'22 mục XN tiền phẫu chuẩn đã được chuẩn bị.'},
  {t:'delay', ms:500},

  // Final
  {t:'feedStatus', icon:'✅', label:'Hoàn tất', text:'Bệnh án đã hoàn tất. Bác sĩ có thể duyệt và ký.'},
  {t:'delay', ms:600},
  {t:'endPhase1'},
];

// ===== STEP RUNNER =====
async function runStep(step) {
  await checkPause();
  switch (step.t) {
    case 'delay':               await delay(step.ms); break;
    case 'scrollForm':          scrollFormToPage(step.page); await delay(400); break;
    case 'fillA':               step.ids.forEach(function (id) { fillA(id); }); await delay(devMode ? 0 : 300); break;
    case 'fieldB':              await setFieldB(step.id, step.value, step.ts); break;
    case 'fieldBWaiting2Pending': fieldEls[step.id].classList.remove('waiting'); await setFieldB(step.id, step.value, step.ts); break;
    case 'feedStatus':          addFeedStatus(step.icon, step.label, step.text); break;
    case 'feedProcess':         currentProcess = addFeedProcess(step.tag, step.summary); break;
    case 'feedFinishProcess':   finishFeedProcess(currentProcess); currentProcess = null; break;
    case 'feedDone':            addFeedDone(step.label, step.text); break;
    case 'feedVoice':           addFeedVoice(step.text); break;
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
