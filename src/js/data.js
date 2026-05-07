// ===== FIELD DEFINITIONS =====
// g:'A' = handwriting (Caveat font, auto-fill from HIS)
// g:'B' = typed (Inter font, AI-filled, doctor approves)
// g:'C' = placeholder (doctor must fill manually)
const FIELDS = [
  {id:'hoTen',   g:'A', page:1, top:10.08, left:26.11, width:36,    height:2.0},
  {id:'sD1',     g:'A', page:1, top:10.74, left:65.15, width:3,     height:0.64},
  {id:'sD2',     g:'A', page:1, top:10.84, left:67.85, width:3,     height:2.0},
  {id:'sD3',     g:'A', page:1, top:10.83, left:70.99, width:3,     height:2.0},
  {id:'sD4',     g:'A', page:1, top:10.95, left:74.15, width:1.68,  height:2.0},
  {id:'sD5',     g:'A', page:1, top:10.84, left:76.85, width:1.68,  height:2.0},
  {id:'sD6',     g:'A', page:1, top:10.73, left:79.70, width:1.68,  height:2.0},
  {id:'sD7',     g:'A', page:1, top:10.84, left:82.71, width:1.68,  height:2.0},
  {id:'sD8',     g:'A', page:1, top:10.95, left:85.11, width:1.53,  height:2.0},
  {id:'tuoi',    g:'A', page:1, top:8.55,  left:93.27, width:5,     height:2.0},
  {id:'gioi',    g:'A', page:1, top:12.64, left:24.69, width:5,     height:2.0},
  {id:'nghe',    g:'A', page:1, top:12.74, left:67.59, width:20,    height:2.0},
  {id:'dantoc',  g:'A', page:1, top:14.87, left:19.86, width:15,    height:2.0},
  {id:'diachiXa',     g:'A', page:1, top:16.47, left:69.38, width:30, height:2.0},
  {id:'diachiHuyen',  g:'A', page:1, top:18.83, left:19.67, width:30, height:2.0},
  {id:'diachiTinh',   g:'A', page:1, top:18.75, left:67.75, width:30, height:2.0},
  {id:'bhytNgay',  g:'A', page:1, top:22.79, left:27.32, width:6,  height:2.0},
  {id:'bhytThang', g:'A', page:1, top:22.68, left:35.08, width:6,  height:2.0},
  {id:'bhytNam',   g:'A', page:1, top:22.47, left:42.15, width:8,  height:2.0},
  {id:'sdt',       g:'A', page:1, top:26.12, left:66.96, width:22, height:2.0},
  {id:'lydo',      g:'B', page:2, top:5.30,  left:24.48, width:42.19, height:0.83},
  {id:'qtbl',      g:'B', page:2, top:11.66, left:6.19,  width:86.55, height:13.23},
  {id:'tiensu',    g:'B', page:2, top:30.19, left:6.18,  width:92.57, height:5.28},
  {id:'tiensuGD',  g:'B', page:2, top:48.38, left:6.78,  width:89.79, height:4.79},
  {id:'mach',      g:'A', page:2, top:57.77, left:83.91, width:12,  height:1.8},
  {id:'nhietdo',   g:'A', page:2, top:59.35, left:85.52, width:12,  height:1.8},
  {id:'ha',        g:'A', page:2, top:61.24, left:84.35, width:12,  height:1.8},
  {id:'nhiptho',   g:'A', page:2, top:62.82, left:85.81, width:12,  height:1.49},
  {id:'cannang',   g:'A', page:2, top:64.53, left:85.95, width:12,  height:1.8},
  {id:'khamtoanthan',    g:'B', page:2, top:58.14, left:6.19,  width:69.04, height:7.54},
  {id:'xetnghiemlamsan', g:'B', page:3, top:70.39, left:6.65,  width:94.64, height:5, waiting:true},
  {id:'tomtat',    g:'B', page:3, top:80.07, left:6.49,  width:92.44, height:12.69},
  {id:'chandoan',  g:'C', page:4, top:5.19,  left:20.31, width:78.76, height:2.57},
  {id:'huongdt',   g:'C', page:4, top:17.98, left:6.20,  width:88.76, height:4.4},
];

// ===== HIS AUTO-FILL DATA (from BN 26063163 · TMH2600572) =====
const groupA = {
  hoTen:'NGUYỄN THỊ HOA',
  sD1:'1', sD2:'2', sD3:'0', sD4:'7', sD5:'2', sD6:'0', sD7:'0', sD8:'7',
  tuoi:'19', gioi:'X', nghe:'Sinh viên', dantoc:'Kinh',
  diachiXa:'P. Vĩnh Phúc', diachiHuyen:'Tp. Việt Trì', diachiTinh:'Phú Thọ',
  bhytNgay:'31', bhytThang:'12', bhytNam:'2026', sdt:'0983xxxxxx',
  mach:'90', nhietdo:'38.8', ha:'110/60', nhiptho:'20', cannang:'41'
};

// ===== AI-FILLED TEXT CONTENT =====
const qtblText = 'Bệnh nhân xuất hiện ngạt mũi, chảy mũi 1 tuần nay kèm ho có đờm. Ở nhà chưa dùng thuốc gì. Ngày nay sốt 39°C kèm đau tức ngực, đau đầu, nôn nhiều, chảy mũi tăng → vào viện. Tại khoa cấp cứu được xử trí Paracetamol 500 mg × 2 viên, sau đó chuyển khoa Tai Mũi Họng.';

const tiensuText = 'Dị ứng kháng sinh (không rõ loại). Không hút thuốc, không uống rượu bia. Không tiền sử bệnh lý đặc biệt.';

const tiensuGDText = 'Không ghi nhận tiền sử bệnh lý đặc biệt trong gia đình.';

const khamtoanthanText = 'BN tỉnh, tiếp xúc được. Da, niêm mạc hồng nhạt. Hạch ngoại vi không to. Tuyến giáp không sờ thấy. Sốt 38.8°C. Mũi: khe và sàn nhiều dịch mủ đặc. Họng: niêm mạc xung huyết, hạ họng ứ đọng dịch. Tai: bình thường hai bên.';

const tomtatText = 'BN nữ 19 tuổi, vào viện hồi 3h30 ngày 03/05/2026 với lý do ngạt mũi, chảy mũi, ho có đờm kéo dài 1 tuần — hôm nay sốt 38.8°C, đau đầu, nôn. Tiền sử dị ứng kháng sinh không rõ loại. Toàn thân sốt 38.8°C. Khám chuyên khoa: mũi khe và sàn nhiều dịch mủ đặc, họng niêm mạc xung huyết. Mã BN: 26063163 · Lưu trữ: TMH2600572.';

const huongdtText = 'Nội khoa. ⚠ Lưu ý dị ứng kháng sinh: dùng Cefuroxime 500 mg × 2 lần/ngày × 7 ngày (thay Amoxicillin). Paracetamol 500 mg khi sốt > 38.5°C. Nước muối sinh lý nhỏ mũi 3–4 lần/ngày. Tái khám sau 7 ngày hoặc khi triệu chứng nặng hơn.';
