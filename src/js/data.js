// ===== FIELD DEFINITIONS =====
// Positions are in percentage of the PDF page dimensions.
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
  {id:'khamck',    g:'B', page:2, top:68.83, left:7.97,  width:86.26, height:5, waiting:true},
  {id:'tomtat',    g:'B', page:3, top:79.97, left:6.49,  width:92.44, height:12.69},
  {id:'chandoan',  g:'C', page:4, top:5.19,  left:20.31, width:78.76, height:2.57},
  {id:'huongdt',   g:'C', page:4, top:18.29, left:6.50,  width:88.76, height:4.4},
];

// ===== HIS AUTO-FILL DATA =====
const groupA = {
  hoTen:'NGUYỄN THỊ HỒNG', sD1:'1', sD2:'4', sD3:'1', sD4:'0',
  sD5:'7', sD6:'3', sD7:'5', sD8:'3',
  tuoi:'48', gioi:'X', nghe:'Nông dân', dantoc:'Kinh',
  diachiXa:'Đồng Hỷ', diachiHuyen:'', diachiTinh:'Thái Nguyên',
  bhytNgay:'31', bhytThang:'12', bhytNam:'2026', sdt:'096xxxxxxx',
  mach:'78', nhietdo:'36.8', ha:'120/75', nhiptho:'18', cannang:'52'
};

// ===== AI-FILLED TEXT CONTENT =====
const qtblText = 'Bệnh nhân thường xuyên bị đau họng, sốt tái lại nhiều lần trong năm. Kèm ngủ ngáy, nuốt vướng. Điều trị từng đợt bằng thuốc, hay tái phát. Đợt này nuốt vướng tăng lên, chưa dùng thuốc → nhập BV Đồng Hỷ → chuyển BV TWTN. Siêu âm tuyến giáp: nhân thùy phải TIRADS 1, nhân thùy trái TIRADS 3.';
const tiensuText = 'Không có tiền sử bệnh lý đặc biệt. Không dị ứng thuốc. Không hút thuốc, không uống rượu bia.';
const tiensuGDText = 'Không ghi nhận tiền sử bệnh lý đặc biệt trong gia đình.';
const khamTMHText = 'Vòm: VA tồn dư. Họng: Amidan quá phát độ III. Tai: Bình thường. Mũi: Bình thường.';
const tomtatText = 'BN nữ 48t, vào viện 11h30 ngày 03/04/2026 với lý do nuốt vướng. Đau họng, sốt tái lại nhiều lần/năm, ngủ ngáy. VA tồn dư, Amidan quá phát độ III. Chuyển từ BV Đồng Hỷ với nhân tuyến giáp TIRADS 3 trái.';
