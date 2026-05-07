// MedVita - Pitch Deck for Hospital Leadership
// Audience: Bệnh viện - Lãnh đạo / quản lý
// Style: Modern healthcare-tech, deep teal palette

const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaStethoscope, FaBrain, FaShieldAlt, FaChartLine, FaUserMd,
  FaClock, FaFileMedical, FaCheckCircle, FaArrowRight, FaMicrophone,
  FaRobot, FaHospital, FaServer, FaLock, FaCogs,
  FaHandshake, FaFlask, FaGraduationCap, FaCommentMedical, FaClipboardList,
  FaBolt, FaUsers, FaLanguage, FaDatabase, FaExclamationTriangle
} = require("react-icons/fa");

// =====================
// COLOR PALETTE — Trivita AI brand
// =====================
const C = {
  primary: "1F3864",      // deep navy (Trivita brand)
  secondary: "5B9BD5",    // light blue (AI wordmark, accent)
  light: "D9E2F3",        // very light blue
  ice: "F2F2F2",          // light gray (card bg)
  accent: "A5C447",       // lime green (Trivita brand accent)
  accentDark: "7E9C2E",   // deeper green
  dark: "1F3864",         // brand navy as dark
  bodyText: "404040",
  muted: "595959",
  white: "FFFFFF",
  bg: "FFFFFF",           // white slides like reference
  divider: "D0D0D0",
  success: "A5C447",      // green as success
  warning: "E9A53A",
};

const FONT_HEADER = "Calibri";
const FONT_BODY = "Calibri";

// =====================
// HELPERS
// =====================
function shadow() {
  return { type: "outer", color: "000000", blur: 8, offset: 2, angle: 90, opacity: 0.10 };
}

function renderIconSvg(IconComponent, color = "#0F4C75", size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}

async function iconPng(IconComponent, color = "#" + C.primary, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// dot matrix decoration (top-right) — Trivita brand motif
function addDotMatrix(slide, baseColor) {
  // grid of small dots: 7 cols x 3 rows (light)
  const cols = 7, rows = 3;
  const dotSize = 0.10;
  const gap = 0.10;
  const startX = 8.65;
  const startY = 0.30;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      slide.addShape(pres.shapes.OVAL, {
        x: startX + c * (dotSize + gap),
        y: startY + r * (dotSize + gap),
        w: dotSize, h: dotSize,
        fill: { color: baseColor }, line: { color: baseColor }
      });
    }
  }
}

// page chrome — Trivita AI brand: wordmark top-left, dot matrix top-right, lime footer bar
function addChrome(slide, pageNum, totalPages) {
  // wordmark top-left: "Trivita AI"
  slide.addText([
    { text: "Trivita ", options: { bold: true, color: C.primary } },
    { text: "AI", options: { bold: true, color: C.secondary } },
  ], {
    x: 0.4, y: 0.18, w: 2.5, h: 0.28,
    fontSize: 14, fontFace: FONT_HEADER, margin: 0
  });
  slide.addText("AI for Life", {
    x: 0.4, y: 0.42, w: 2.5, h: 0.18,
    fontSize: 8, italic: true, fontFace: FONT_BODY,
    color: C.muted, margin: 0
  });

  // dot matrix top-right (light blue, low key)
  addDotMatrix(slide, C.light);

  // bottom lime green footer bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.50, w: 10, h: 0.125,
    fill: { color: C.accent }, line: { color: C.accent }
  });
  // page number on right
  slide.addText(`${pageNum}`, {
    x: 9.20, y: 5.20, w: 0.65, h: 0.25,
    fontSize: 10, color: C.muted, fontFace: FONT_BODY, align: "right", margin: 0
  });
}

// title bar — Trivita reference style: bold navy title, muted gray subtitle, no accent bar
function addTitle(slide, title, subtitle) {
  slide.addText(title, {
    x: 0.4, y: 0.85, w: 9.0, h: 0.50,
    fontSize: 26, bold: true, fontFace: FONT_HEADER,
    color: C.primary, margin: 0
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.4, y: 1.32, w: 9.0, h: 0.28,
      fontSize: 11, fontFace: FONT_BODY,
      color: C.muted, margin: 0
    });
  }
}

// =====================
// PRES SETUP
// =====================
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";   // 10 x 5.625
pres.author = "Trivita AI";
pres.company = "Trivita AI";
pres.title = "MedVita - Trợ lý AI cho hồ sơ bệnh án điện tử";

// =====================
// MAIN BUILD
// =====================
(async () => {

  // pre-render icons
  const ic = {
    stethoscope: await iconPng(FaStethoscope, "#" + C.white),
    brain: await iconPng(FaBrain, "#" + C.white),
    shield: await iconPng(FaShieldAlt, "#" + C.white),
    chart: await iconPng(FaChartLine, "#" + C.white),
    doctor: await iconPng(FaUserMd, "#" + C.primary),
    clock: await iconPng(FaClock, "#" + C.accent),
    file: await iconPng(FaFileMedical, "#" + C.secondary),
    check: await iconPng(FaCheckCircle, "#" + C.success),
    arrow: await iconPng(FaArrowRight, "#" + C.secondary),
    mic: await iconPng(FaMicrophone, "#" + C.white),
    robot: await iconPng(FaRobot, "#" + C.white),
    hospital: await iconPng(FaHospital, "#" + C.primary),
    server: await iconPng(FaServer, "#" + C.secondary),
    lock: await iconPng(FaLock, "#" + C.success),
    cogs: await iconPng(FaCogs, "#" + C.secondary),
    handshake: await iconPng(FaHandshake, "#" + C.white),
    flask: await iconPng(FaFlask, "#" + C.primary),
    grad: await iconPng(FaGraduationCap, "#" + C.primary),
    comment: await iconPng(FaCommentMedical, "#" + C.white),
    clipboard: await iconPng(FaClipboardList, "#" + C.white),
    bolt: await iconPng(FaBolt, "#" + C.accent),
    users: await iconPng(FaUsers, "#" + C.primary),
    lang: await iconPng(FaLanguage, "#" + C.white),
    db: await iconPng(FaDatabase, "#" + C.secondary),
    warn: await iconPng(FaExclamationTriangle, "#" + C.accentDark),
  };

  const TOTAL = 15;

  // ============================================================
  // SLIDE 1 — TITLE (Trivita brand: solid navy bg, white title, lime tagline)
  // ============================================================
  {
    let s = pres.addSlide();
    s.background = { color: C.primary };

    // wordmark top-left in white
    s.addText([
      { text: "Trivita ", options: { bold: true, color: C.white } },
      { text: "AI", options: { bold: true, color: C.secondary } },
    ], {
      x: 0.6, y: 0.6, w: 4, h: 0.45,
      fontSize: 22, fontFace: FONT_HEADER, margin: 0
    });
    s.addText("Research & Development", {
      x: 0.6, y: 1.05, w: 4, h: 0.30,
      fontSize: 12, italic: true, fontFace: FONT_BODY,
      color: C.light, margin: 0
    });

    // dot matrix top-right (lighter navy)
    {
      const cols = 7, rows = 3, dotSize = 0.13, gap = 0.12;
      const startX = 8.20, startY = 0.55;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          s.addShape(pres.shapes.OVAL, {
            x: startX + c * (dotSize + gap),
            y: startY + r * (dotSize + gap),
            w: dotSize, h: dotSize,
            fill: { color: "3A5485" }, line: { color: "3A5485" }
          });
        }
      }
    }

    // Big title
    s.addText("MedVita", {
      x: 0.6, y: 2.10, w: 9.0, h: 0.85,
      fontSize: 60, bold: true, fontFace: FONT_HEADER,
      color: C.white, margin: 0
    });

    // tagline (lime green)
    s.addText("Trợ lý AI cho bác sĩ | Tự động hoá hồ sơ bệnh án điện tử", {
      x: 0.6, y: 2.95, w: 9.0, h: 0.40,
      fontSize: 18, fontFace: FONT_HEADER, color: C.accent, margin: 0
    });

    // sub-line in white
    s.addText("Giảm gánh nặng hành chính · Tăng năng suất khám · Chuẩn hoá dữ liệu y khoa tiếng Việt", {
      x: 0.6, y: 3.42, w: 9.0, h: 0.35,
      fontSize: 13, fontFace: FONT_BODY, color: C.white, margin: 0
    });

    // info card bottom (light gray fill, like reference's "Hardware Configuration")
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 4.10, w: 5.0, h: 0.85,
      fill: { color: "E8E8E8" }, line: { color: "E8E8E8" }
    });
    s.addText("Audience", {
      x: 0.85, y: 4.18, w: 4.5, h: 0.25,
      fontSize: 11, bold: true, fontFace: FONT_HEADER,
      color: C.accentDark, margin: 0
    });
    s.addText("Lãnh đạo / Quản lý Bệnh viện", {
      x: 0.85, y: 4.45, w: 4.5, h: 0.40,
      fontSize: 14, fontFace: FONT_HEADER,
      color: C.muted, margin: 0
    });

    // footer
    s.addText("Status: Bản trình bày demo  |  Phiên bản 1.0", {
      x: 0.6, y: 5.10, w: 6, h: 0.22,
      fontSize: 10, fontFace: FONT_BODY, color: C.white, margin: 0
    });
    s.addText("Prepared by: Trivita AI  |  Date: 05/2026", {
      x: 0.6, y: 5.32, w: 6, h: 0.22,
      fontSize: 9, italic: true, fontFace: FONT_BODY, color: C.light, margin: 0
    });
  }

  // ============================================================
  // SLIDE 2 — EXECUTIVE SUMMARY
  // ============================================================
  {
    let s = pres.addSlide();
    s.background = { color: C.bg };
    addChrome(s, 2, TOTAL);
    addTitle(s, "Tóm tắt điều hành",
      "Vì sao MedVita đáng được lãnh đạo bệnh viện cân nhắc triển khai");

    // 3 big stat cards
    const stats = [
      { num: "≈49%", label: "Thời gian bác sĩ dành cho EHR và việc hành chính", color: C.primary, icon: ic.clock },
      { num: "−40%", label: "Giảm thời gian lập hồ sơ bệnh án mỗi ca khám¹", color: C.secondary, icon: ic.bolt },
      { num: "100%", label: "Form bệnh án Việt Nam, ngôn ngữ y khoa tiếng Việt", color: C.accentDark, icon: ic.lang },
    ];

    stats.forEach((st, i) => {
      const x = 0.5 + i * 3.05;
      const y = 1.7;
      const w = 2.85;
      const h = 2.25;

      // card
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w, h,
        fill: { color: C.white }, line: { color: C.divider, width: 0.75 },
        shadow: shadow()
      });
      // top color bar
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w, h: 0.10, fill: { color: st.color }, line: { color: st.color }
      });
      // icon circle
      s.addShape(pres.shapes.OVAL, {
        x: x + 0.3, y: y + 0.32, w: 0.55, h: 0.55,
        fill: { color: st.color }, line: { color: st.color }
      });
      s.addImage({
        data: st.icon, x: x + 0.41, y: y + 0.43, w: 0.33, h: 0.33
      });
      // big number
      s.addText(st.num, {
        x, y: y + 0.95, w, h: 0.8,
        fontSize: 50, bold: true, fontFace: FONT_HEADER,
        color: st.color, align: "center", margin: 0
      });
      // label
      s.addText(st.label, {
        x: x + 0.2, y: y + 1.7, w: w - 0.4, h: 0.5,
        fontSize: 11, fontFace: FONT_BODY,
        color: C.bodyText, align: "center", margin: 0
      });
    });

    // bottom CTA strip
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 4.25, w: 9, h: 0.8,
      fill: { color: C.primary }, line: { color: C.primary }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 4.25, w: 0.10, h: 0.8,
      fill: { color: C.accent }, line: { color: C.accent }
    });
    s.addText("Giá trị cốt lõi: trả lại thời gian chuyên môn cho bác sĩ — vận hành chuẩn HIS, dữ liệu nội viện, không vendor lock-in.", {
      x: 0.85, y: 4.30, w: 8.5, h: 0.7,
      fontSize: 13, fontFace: FONT_BODY, italic: true,
      color: C.white, valign: "middle", margin: 0
    });

    // citation note
    s.addText("¹ Ước tính nội bộ dựa trên Sinsky et al., Ann Intern Med. 2016 — sẽ được hiệu chỉnh sau pilot.", {
      x: 0.5, y: 5.10, w: 9, h: 0.22,
      fontSize: 8, italic: true, fontFace: FONT_BODY, color: C.muted, margin: 0
    });
  }

  // ============================================================
  // SLIDE 3 — VẤN ĐỀ
  // ============================================================
  {
    let s = pres.addSlide();
    s.background = { color: C.bg };
    addChrome(s, 3, TOTAL);
    addTitle(s, "Gánh nặng hành chính trong y tế",
      "Chi phí ẩn lớn nhất của bệnh viện không nằm ở thiết bị — nằm ở thời gian bác sĩ");

    // left: chart
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 1.7, w: 4.4, h: 3.4,
      fill: { color: C.white }, line: { color: C.divider, width: 0.75 },
      shadow: shadow()
    });
    s.addText("Phân bổ thời gian làm việc của bác sĩ", {
      x: 0.7, y: 1.85, w: 4.0, h: 0.32,
      fontSize: 13, bold: true, fontFace: FONT_HEADER, color: C.primary, margin: 0
    });
    s.addChart(pres.charts.DOUGHNUT, [{
      name: "Phân bổ",
      labels: ["EHR & hành chính", "Khám trực tiếp BN", "Việc khác"],
      values: [49, 33, 18]
    }], {
      x: 0.7, y: 2.25, w: 4.0, h: 2.7,
      chartColors: [C.accentDark, C.primary, C.light],
      showLegend: true, legendPos: "b", legendFontSize: 10,
      showPercent: true, dataLabelFontSize: 11, dataLabelColor: "FFFFFF",
      chartArea: { fill: { color: C.white } }
    });

    // right: 3 pain points
    const pains = [
      { t: "Thời gian chuyên môn bị bào mòn",
        d: "≈49% giờ làm việc và 1/3 thời gian mỗi ca khám của bác sĩ phải dành cho hồ sơ bệnh án và thủ tục giấy tờ." },
      { t: "Giảm công suất khám và chất lượng dịch vụ",
        d: "Bác sĩ ít thời gian tương tác, dễ bỏ sót thông tin lâm sàng quan trọng — ảnh hưởng trải nghiệm bệnh nhân và doanh thu/giường." },
      { t: "Nguy cơ burnout và thiếu nhân lực",
        d: "Quá tải hành chính là một trong các nguyên nhân chính dẫn đến kiệt sức nghề nghiệp, làm tăng chi phí tuyển dụng và đào tạo lại." },
    ];

    pains.forEach((p, i) => {
      const x = 5.3, y = 1.7 + i * 1.16, w = 4.2, h = 1.05;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w, h,
        fill: { color: C.white }, line: { color: C.divider, width: 0.5 },
        shadow: shadow()
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 0.08, h,
        fill: { color: C.accentDark }, line: { color: C.accentDark }
      });
      // number
      s.addShape(pres.shapes.OVAL, {
        x: x + 0.20, y: y + 0.18, w: 0.42, h: 0.42,
        fill: { color: C.accentDark }, line: { color: C.accentDark }
      });
      s.addText(`${i + 1}`, {
        x: x + 0.20, y: y + 0.18, w: 0.42, h: 0.42,
        fontSize: 14, bold: true, fontFace: FONT_HEADER,
        color: C.white, align: "center", valign: "middle", margin: 0
      });
      s.addText(p.t, {
        x: x + 0.7, y: y + 0.12, w: w - 0.85, h: 0.32,
        fontSize: 13, bold: true, fontFace: FONT_HEADER,
        color: C.primary, margin: 0
      });
      s.addText(p.d, {
        x: x + 0.7, y: y + 0.43, w: w - 0.85, h: 0.6,
        fontSize: 10.5, fontFace: FONT_BODY,
        color: C.bodyText, margin: 0
      });
    });

    // citation
    s.addText("Nguồn: Sinsky C et al. \"Allocation of Physician Time in Ambulatory Practice\". Ann Intern Med. 2016;165:753-760. doi:10.7326/M16-0961", {
      x: 0.5, y: 5.10, w: 9, h: 0.22,
      fontSize: 8, italic: true, fontFace: FONT_BODY, color: C.muted, margin: 0
    });
  }

  // ============================================================
  // SLIDE 4 — TÁC ĐỘNG KINH DOANH
  // ============================================================
  {
    let s = pres.addSlide();
    s.background = { color: C.bg };
    addChrome(s, 4, TOTAL);
    addTitle(s, "Tác động đến vận hành bệnh viện",
      "Cùng một con số “49% thời gian” — nhưng quy ra chi phí và doanh thu thực sự là gì?");

    // 4 metric cards in a row
    const metrics = [
      { k: "Chi phí ẩn", v: "Cao", desc: "Bác sĩ làm việc hành chính = chi phí lương cho công việc lẽ ra dành cho điều trị." },
      { k: "Công suất khám", v: "Giảm 25–35%", desc: "Mỗi ca khám có thể rút ngắn 5–10 phút — tăng số bệnh nhân/ngày tương ứng." },
      { k: "Sai sót lâm sàng", v: "Tăng", desc: "Ghi chép thủ công vội dễ bỏ sót triệu chứng / tiền sử dị ứng." },
      { k: "Trải nghiệm BN", v: "Kém", desc: "Bác sĩ nhìn màn hình nhiều hơn nhìn bệnh nhân — giảm điểm hài lòng." },
    ];

    metrics.forEach((m, i) => {
      const x = 0.5 + i * 2.30;
      const y = 1.75;
      const w = 2.15;
      const h = 1.85;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w, h, fill: { color: C.white }, line: { color: C.divider, width: 0.5 }, shadow: shadow()
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: y + h - 0.08, w, h: 0.08, fill: { color: C.secondary }, line: { color: C.secondary }
      });
      s.addText(m.k.toUpperCase(), {
        x: x + 0.15, y: y + 0.18, w: w - 0.3, h: 0.25,
        fontSize: 9, bold: true, fontFace: FONT_HEADER, charSpacing: 3,
        color: C.muted, margin: 0
      });
      s.addText(m.v, {
        x: x + 0.15, y: y + 0.43, w: w - 0.3, h: 0.55,
        fontSize: 22, bold: true, fontFace: FONT_HEADER, color: C.primary, margin: 0
      });
      s.addText(m.desc, {
        x: x + 0.15, y: y + 1.00, w: w - 0.3, h: 0.8,
        fontSize: 9.5, fontFace: FONT_BODY, color: C.bodyText, margin: 0
      });
    });

    // bottom comparison: with vs without MedVita
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 3.85, w: 4.4, h: 1.20,
      fill: { color: "FBE9E7" }, line: { color: C.accentDark, width: 0.5 }
    });
    s.addText("Hiện tại — không có MedVita", {
      x: 0.7, y: 3.92, w: 4, h: 0.28,
      fontSize: 11, bold: true, fontFace: FONT_HEADER, color: C.accentDark, margin: 0
    });
    s.addText([
      { text: "Bác sĩ gõ tay từng dòng bệnh án", options: { bullet: true, breakLine: true, fontSize: 10.5, color: C.bodyText } },
      { text: "Mỗi ca khám 15–20 phút, ⅓ là thủ tục", options: { bullet: true, breakLine: true, fontSize: 10.5, color: C.bodyText } },
      { text: "Dữ liệu rời rạc, khó tổng hợp báo cáo", options: { bullet: true, fontSize: 10.5, color: C.bodyText } },
    ], { x: 0.7, y: 4.20, w: 4, h: 0.85, margin: 0, paraSpaceAfter: 1, fontFace: FONT_BODY });

    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.10, y: 3.85, w: 4.4, h: 1.20,
      fill: { color: "E0F2EF" }, line: { color: C.success, width: 0.5 }
    });
    s.addText("Sau khi triển khai MedVita", {
      x: 5.30, y: 3.92, w: 4, h: 0.28,
      fontSize: 11, bold: true, fontFace: FONT_HEADER, color: C.success, margin: 0
    });
    s.addText([
      { text: "AI ghi âm và soạn bệnh án theo form viện", options: { bullet: true, breakLine: true, fontSize: 10.5, color: C.bodyText } },
      { text: "Thời gian thủ tục giảm rõ rệt mỗi ca", options: { bullet: true, breakLine: true, fontSize: 10.5, color: C.bodyText } },
      { text: "Dữ liệu chuẩn hoá, sẵn sàng phân tích", options: { bullet: true, fontSize: 10.5, color: C.bodyText } },
    ], { x: 5.30, y: 4.20, w: 4, h: 0.85, margin: 0, paraSpaceAfter: 1, fontFace: FONT_BODY });
  }

  // ============================================================
  // SLIDE 5 — GIẢI PHÁP MEDVITA (overview 3 bước)
  // ============================================================
  {
    let s = pres.addSlide();
    s.background = { color: C.bg };
    addChrome(s, 5, TOTAL);
    addTitle(s, "Giải pháp MedVita",
      "Trợ lý AI đồng hành cùng bác sĩ trên toàn bộ luồng khám — từ trước, trong, đến sau khám");

    const steps = [
      { n: "01", t: "Trước khám", sub: "Tuỳ chọn", icon: ic.comment, color: C.secondary,
        desc: "Đọc thông tin từ HIS, chatbot khai thác triệu chứng & tiền sử, gửi bản tóm tắt cho bác sĩ trước khi tiếp nhận." },
      { n: "02", t: "Trong khám", sub: "Realtime", icon: ic.mic, color: C.primary,
        desc: "Lắng nghe hội thoại, hiển thị tóm tắt sống, tự động điền form, gợi ý nhóm bệnh và chỉ định cận lâm sàng." },
      { n: "03", t: "Sau khám", sub: "Lập hồ sơ", icon: ic.clipboard, color: C.accentDark,
        desc: "Hoàn thiện bệnh án theo form bệnh viện, nhắc trường còn thiếu, chatbot bổ sung — bác sĩ chỉ duyệt và ký." },
    ];

    steps.forEach((st, i) => {
      const x = 0.5 + i * 3.10;
      const y = 1.80;
      const w = 2.90;
      const h = 3.15;

      // card
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w, h, fill: { color: C.white }, line: { color: C.divider, width: 0.5 }, shadow: shadow()
      });
      // top color band
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w, h: 0.85, fill: { color: st.color }, line: { color: st.color }
      });
      // step number (huge, behind)
      s.addText(st.n, {
        x: x + 0.15, y: y + 0.10, w: 1.0, h: 0.7,
        fontSize: 32, bold: true, fontFace: FONT_HEADER,
        color: C.white, margin: 0
      });
      // icon
      s.addImage({ data: st.icon, x: x + w - 0.85, y: y + 0.20, w: 0.55, h: 0.55 });

      // title
      s.addText(st.t, {
        x: x + 0.20, y: y + 0.95, w: w - 0.4, h: 0.40,
        fontSize: 18, bold: true, fontFace: FONT_HEADER,
        color: C.primary, margin: 0
      });
      // sub-tag
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.20, y: y + 1.40, w: 0.85, h: 0.25,
        fill: { color: C.ice }, line: { color: C.light }
      });
      s.addText(st.sub, {
        x: x + 0.20, y: y + 1.40, w: 0.85, h: 0.25,
        fontSize: 9, bold: true, fontFace: FONT_HEADER,
        color: C.primary, align: "center", valign: "middle", margin: 0
      });
      // desc
      s.addText(st.desc, {
        x: x + 0.20, y: y + 1.78, w: w - 0.4, h: 1.30,
        fontSize: 11, fontFace: FONT_BODY,
        color: C.bodyText, margin: 0
      });

      // arrow between cards
      if (i < 2) {
        s.addImage({
          data: ic.arrow, x: x + w - 0.04, y: y + 1.45, w: 0.20, h: 0.20
        });
      }
    });

    // bottom highlight
    s.addText("Đặc biệt: bám form bệnh án viện ban hành — thuật ngữ y khoa tiếng Việt — không thay đổi quy trình hiện hữu.", {
      x: 0.5, y: 5.07, w: 9, h: 0.25,
      fontSize: 10.5, italic: true, fontFace: FONT_BODY,
      color: C.primary, align: "center", margin: 0
    });
  }

  // ============================================================
  // SLIDE 6 — BƯỚC 1: PRE-VISIT
  // ============================================================
  {
    let s = pres.addSlide();
    s.background = { color: C.bg };
    addChrome(s, 6, TOTAL);
    addTitle(s, "Bước 1 — Trước khi bệnh nhân gặp bác sĩ",
      "Chatbot khai thác bệnh sử + đọc HIS · giúp bác sĩ vào phòng khám đã có sẵn bối cảnh");

    // left: capability list
    const caps = [
      { t: "Đọc HIS / EMR sẵn có", d: "Lấy tiền sử, dị ứng, đơn thuốc gần nhất nếu hệ thống đã có." },
      { t: "Chatbot khai thác triệu chứng", d: "Hỏi BN bằng tiếng Việt, theo logic y khoa, ghi nhận có cấu trúc." },
      { t: "Tóm tắt bệnh sử", d: "Tự động sinh bản tóm tắt 1 trang gửi bác sĩ trước khi tiếp nhận." },
    ];
    caps.forEach((c, i) => {
      const x = 0.5, y = 1.75 + i * 1.12, w = 4.6, h = 1.0;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w, h, fill: { color: C.white }, line: { color: C.divider, width: 0.5 }, shadow: shadow()
      });
      s.addShape(pres.shapes.OVAL, {
        x: x + 0.20, y: y + 0.20, w: 0.55, h: 0.55, fill: { color: C.secondary }, line: { color: C.secondary }
      });
      s.addText(`${i + 1}`, {
        x: x + 0.20, y: y + 0.20, w: 0.55, h: 0.55,
        fontSize: 18, bold: true, fontFace: FONT_HEADER, color: C.white,
        align: "center", valign: "middle", margin: 0
      });
      s.addText(c.t, {
        x: x + 0.95, y: y + 0.13, w: w - 1.1, h: 0.32,
        fontSize: 13, bold: true, fontFace: FONT_HEADER, color: C.primary, margin: 0
      });
      s.addText(c.d, {
        x: x + 0.95, y: y + 0.46, w: w - 1.1, h: 0.55,
        fontSize: 10.5, fontFace: FONT_BODY, color: C.bodyText, margin: 0
      });
    });

    // right: chatbot mockup
    const mx = 5.5, my = 1.75, mw = 4.0, mh = 3.3;
    s.addShape(pres.shapes.RECTANGLE, {
      x: mx, y: my, w: mw, h: mh,
      fill: { color: C.white }, line: { color: C.divider, width: 0.75 }, shadow: shadow()
    });
    // header
    s.addShape(pres.shapes.RECTANGLE, {
      x: mx, y: my, w: mw, h: 0.45, fill: { color: C.primary }, line: { color: C.primary }
    });
    s.addShape(pres.shapes.OVAL, { x: mx + 0.15, y: my + 0.13, w: 0.18, h: 0.18, fill: { color: C.accent }, line: { color: C.accent } });
    s.addText("MedVita · Trò chuyện với bệnh nhân", {
      x: mx + 0.4, y: my + 0.07, w: mw - 0.5, h: 0.30,
      fontSize: 10.5, bold: true, fontFace: FONT_HEADER, color: C.white, valign: "middle", margin: 0
    });
    // chat bubbles (bot)
    s.addShape(pres.shapes.RECTANGLE, {
      x: mx + 0.20, y: my + 0.62, w: 2.7, h: 0.50,
      fill: { color: C.ice }, line: { color: C.light, width: 0.5 }
    });
    s.addText("Chào anh/chị, hôm nay anh/chị thấy khó chịu ở đâu ạ?", {
      x: mx + 0.30, y: my + 0.65, w: 2.5, h: 0.45,
      fontSize: 9.5, fontFace: FONT_BODY, color: C.bodyText, valign: "middle", margin: 0
    });
    // user
    s.addShape(pres.shapes.RECTANGLE, {
      x: mx + 1.10, y: my + 1.20, w: 2.7, h: 0.45,
      fill: { color: C.primary }, line: { color: C.primary }
    });
    s.addText("Đau bụng vùng thượng vị 2 ngày nay, có buồn nôn.", {
      x: mx + 1.20, y: my + 1.22, w: 2.5, h: 0.40,
      fontSize: 9.5, fontFace: FONT_BODY, color: C.white, valign: "middle", margin: 0
    });
    // bot
    s.addShape(pres.shapes.RECTANGLE, {
      x: mx + 0.20, y: my + 1.73, w: 3.0, h: 0.65,
      fill: { color: C.ice }, line: { color: C.light, width: 0.5 }
    });
    s.addText("Anh/chị có sốt, đi ngoài hay tiền sử viêm dạ dày không ạ? Có dùng thuốc giảm đau gần đây không?", {
      x: mx + 0.30, y: my + 1.76, w: 2.8, h: 0.6,
      fontSize: 9.5, fontFace: FONT_BODY, color: C.bodyText, valign: "middle", margin: 0
    });
    // summary card at bottom
    s.addShape(pres.shapes.RECTANGLE, {
      x: mx + 0.20, y: my + 2.50, w: mw - 0.4, h: 0.65,
      fill: { color: "FFF8E1" }, line: { color: C.warning, width: 0.5 }
    });
    s.addText([
      { text: "Tóm tắt gửi bác sĩ: ", options: { bold: true, color: C.primary, fontSize: 9.5 } },
      { text: "Đau thượng vị 2 ngày, kèm buồn nôn, không sốt, có dùng NSAID. Đề nghị khám bụng + chỉ định CTM, men gan.", options: { color: C.bodyText, fontSize: 9.5 } },
    ], { x: mx + 0.30, y: my + 2.55, w: mw - 0.5, h: 0.55, fontFace: FONT_BODY, valign: "middle", margin: 0 });
  }

  // ============================================================
  // SLIDE 7 — BƯỚC 2: TRONG KHÁM
  // ============================================================
  {
    let s = pres.addSlide();
    s.background = { color: C.bg };
    addChrome(s, 7, TOTAL);
    addTitle(s, "Bước 2 — Trong khi bác sĩ đang khám",
      "Một màn hình 4 vùng — bác sĩ tập trung khám, AI lo phần ghi chép và gợi ý");

    // mock screen container
    const sx = 0.5, sy = 1.75, sw = 5.6, sh = 3.30;
    s.addShape(pres.shapes.RECTANGLE, {
      x: sx, y: sy, w: sw, h: sh,
      fill: { color: "1B2D3D" }, line: { color: "1B2D3D" }, shadow: shadow()
    });
    // browser bar
    s.addShape(pres.shapes.RECTANGLE, {
      x: sx, y: sy, w: sw, h: 0.28, fill: { color: "0B1E3A" }, line: { color: "0B1E3A" }
    });
    [0, 1, 2].forEach(i => {
      s.addShape(pres.shapes.OVAL, {
        x: sx + 0.10 + i * 0.18, y: sy + 0.08, w: 0.12, h: 0.12,
        fill: { color: i === 0 ? "FF5F56" : i === 1 ? "FFBD2E" : "27C93F" },
        line: { color: i === 0 ? "FF5F56" : i === 1 ? "FFBD2E" : "27C93F" }
      });
    });
    s.addText("Màn hình bác sĩ — 4 vùng làm việc", {
      x: sx + 0.7, y: sy + 0.04, w: 4.5, h: 0.20,
      fontSize: 9, bold: true, fontFace: FONT_HEADER, color: C.light, valign: "middle", margin: 0
    });

    // 4 quadrants
    const qx = sx + 0.15, qy = sy + 0.40;
    const qw = (sw - 0.45) / 2;
    const qh = (sh - 0.55) / 2;
    const quads = [
      { x: qx, y: qy, color: C.secondary, t: "Tóm tắt bệnh sử (Bước 1)", body: "Đau thượng vị 2 ngày · NSAID · không sốt · có buồn nôn" },
      { x: qx + qw + 0.15, y: qy, color: C.accent, t: "Ghi chép realtime", body: "Bác sĩ vừa hỏi về tiền sử dạ dày · BN báo có viêm 3 năm trước" },
      { x: qx, y: qy + qh + 0.15, color: C.success, t: "Form bệnh án — đang điền", body: "✓ Họ tên · ✓ CCCD · ✓ Triệu chứng · ◔ Khám lâm sàng (đang nhập)" },
      { x: qx + qw + 0.15, y: qy + qh + 0.15, color: C.accentDark, t: "Gợi ý lâm sàng", body: "Khám: ấn thượng vị · CLS: CTM, men gan, HP test · Cân nhắc: viêm dạ dày, loét HP" },
    ];
    quads.forEach(q => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: q.x, y: q.y, w: qw, h: qh, fill: { color: C.white }, line: { color: q.color, width: 1 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: q.x, y: q.y, w: qw, h: 0.30, fill: { color: q.color }, line: { color: q.color }
      });
      s.addText(q.t, {
        x: q.x + 0.10, y: q.y + 0.04, w: qw - 0.2, h: 0.22,
        fontSize: 9.5, bold: true, fontFace: FONT_HEADER, color: C.white, valign: "middle", margin: 0
      });
      s.addText(q.body, {
        x: q.x + 0.10, y: q.y + 0.36, w: qw - 0.2, h: qh - 0.4,
        fontSize: 9, fontFace: FONT_BODY, color: C.bodyText, margin: 0, valign: "top"
      });
    });

    // right: caption / explainer
    s.addShape(pres.shapes.RECTANGLE, {
      x: 6.30, y: 1.75, w: 3.20, h: 3.30,
      fill: { color: C.white }, line: { color: C.divider, width: 0.5 }, shadow: shadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 6.30, y: 1.75, w: 0.08, h: 3.30, fill: { color: C.primary }, line: { color: C.primary }
    });
    s.addText("Bác sĩ làm gì?", {
      x: 6.50, y: 1.85, w: 2.9, h: 0.32,
      fontSize: 12, bold: true, fontFace: FONT_HEADER, color: C.primary, margin: 0
    });
    s.addText([
      { text: "Khám bệnh nhân như bình thường", options: { bullet: true, breakLine: true, fontSize: 10.5, color: C.bodyText } },
      { text: "Liếc màn hình để chốt thông tin", options: { bullet: true, breakLine: true, fontSize: 10.5, color: C.bodyText } },
      { text: "Tham khảo gợi ý CLS khi cần", options: { bullet: true, fontSize: 10.5, color: C.bodyText } },
    ], { x: 6.50, y: 2.20, w: 2.9, h: 1.2, margin: 0, paraSpaceAfter: 2, fontFace: FONT_BODY });

    s.addText("MedVita làm gì?", {
      x: 6.50, y: 3.45, w: 2.9, h: 0.32,
      fontSize: 12, bold: true, fontFace: FONT_HEADER, color: C.accentDark, margin: 0
    });
    s.addText([
      { text: "Lắng nghe và phiên âm hội thoại", options: { bullet: true, breakLine: true, fontSize: 10.5, color: C.bodyText } },
      { text: "Tự điền các trường nhận diện được", options: { bullet: true, breakLine: true, fontSize: 10.5, color: C.bodyText } },
      { text: "Gợi ý nhóm bệnh & cận lâm sàng", options: { bullet: true, fontSize: 10.5, color: C.bodyText } },
    ], { x: 6.50, y: 3.80, w: 2.9, h: 1.20, margin: 0, paraSpaceAfter: 2, fontFace: FONT_BODY });
  }

  // ============================================================
  // SLIDE 8 — BƯỚC 3: SAU KHÁM
  // ============================================================
  {
    let s = pres.addSlide();
    s.background = { color: C.bg };
    addChrome(s, 8, TOTAL);
    addTitle(s, "Bước 3 — Sau khi khám: lập hồ sơ bệnh án",
      "AI hoàn thiện bệnh án theo form viện, bác sĩ chỉ trao đổi và duyệt");

    // left: form mockup
    const fx = 0.5, fy = 1.75, fw = 5.0, fh = 3.30;
    s.addShape(pres.shapes.RECTANGLE, {
      x: fx, y: fy, w: fw, h: fh,
      fill: { color: C.white }, line: { color: C.divider, width: 0.75 }, shadow: shadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: fx, y: fy, w: fw, h: 0.35, fill: { color: C.primary }, line: { color: C.primary }
    });
    s.addText("Hồ sơ bệnh án điện tử — Bệnh viện ABC", {
      x: fx + 0.2, y: fy + 0.05, w: fw - 0.3, h: 0.25,
      fontSize: 11, bold: true, fontFace: FONT_HEADER, color: C.white, valign: "middle", margin: 0
    });

    const fields = [
      { l: "Họ và tên", v: "Nguyễn Văn A · Nam · 42t", ok: true },
      { l: "Lý do vào viện", v: "Đau thượng vị 2 ngày", ok: true },
      { l: "Bệnh sử", v: "Đau âm ỉ thượng vị, lan ra sau lưng, kèm buồn nôn…", ok: true },
      { l: "Tiền sử", v: "Viêm dạ dày HP+ điều trị 2023, đang dùng NSAID", ok: true },
      { l: "Khám lâm sàng", v: "[ Cần bác sĩ bổ sung — ấn bụng, mạch, HA ]", ok: false },
      { l: "Cận lâm sàng", v: "CTM, men gan, HP test (gợi ý)", ok: true },
    ];

    fields.forEach((f, i) => {
      const yy = fy + 0.55 + i * 0.43;
      s.addShape(pres.shapes.RECTANGLE, {
        x: fx + 0.20, y: yy, w: fw - 0.40, h: 0.36,
        fill: { color: f.ok ? C.white : "FFF8E1" }, line: { color: f.ok ? C.divider : C.warning, width: 0.5 }
      });
      // status dot
      s.addShape(pres.shapes.OVAL, {
        x: fx + 0.30, y: yy + 0.10, w: 0.18, h: 0.18,
        fill: { color: f.ok ? C.success : C.warning }, line: { color: f.ok ? C.success : C.warning }
      });
      s.addText(f.l, {
        x: fx + 0.55, y: yy + 0.05, w: 1.5, h: 0.26,
        fontSize: 9.5, bold: true, fontFace: FONT_HEADER, color: C.primary, valign: "middle", margin: 0
      });
      s.addText(f.v, {
        x: fx + 2.05, y: yy + 0.05, w: fw - 2.30, h: 0.26,
        fontSize: 9.5, fontFace: FONT_BODY, color: C.bodyText, valign: "middle", margin: 0
      });
    });

    // right: chatbot fill-in mockup
    const cx = 5.7, cy = 1.75, cw = 3.8, ch = 3.30;
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: cw, h: ch,
      fill: { color: C.white }, line: { color: C.divider, width: 0.75 }, shadow: shadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: cw, h: 0.35, fill: { color: C.accentDark }, line: { color: C.accentDark }
    });
    s.addText("MedVita · Trợ lý hoàn thiện bệnh án", {
      x: cx + 0.2, y: cy + 0.05, w: cw - 0.3, h: 0.25,
      fontSize: 10.5, bold: true, fontFace: FONT_HEADER, color: C.white, valign: "middle", margin: 0
    });

    // bot bubble
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx + 0.15, y: cy + 0.55, w: 3.5, h: 0.65,
      fill: { color: C.ice }, line: { color: C.light, width: 0.5 }
    });
    s.addText("BS ơi, mình còn thiếu trường ‘Khám lâm sàng’. BS ấn bụng có điểm đau khu trú không ạ?", {
      x: cx + 0.25, y: cy + 0.58, w: 3.3, h: 0.60,
      fontSize: 9.5, fontFace: FONT_BODY, color: C.bodyText, valign: "middle", margin: 0
    });
    // doctor
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx + 0.40, y: cy + 1.30, w: 3.25, h: 0.50,
      fill: { color: C.primary }, line: { color: C.primary }
    });
    s.addText("Ấn thượng vị đau, không có phản ứng thành bụng. Mạch 84, HA 120/80.", {
      x: cx + 0.50, y: cy + 1.32, w: 3.05, h: 0.46,
      fontSize: 9.5, fontFace: FONT_BODY, color: C.white, valign: "middle", margin: 0
    });
    // bot ack
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx + 0.15, y: cy + 1.90, w: 3.5, h: 0.55,
      fill: { color: "E0F2EF" }, line: { color: C.success, width: 0.5 }
    });
    s.addText("Đã điền xong. Bệnh án đầy đủ — mời BS xem lại và ký.", {
      x: cx + 0.25, y: cy + 1.93, w: 3.3, h: 0.50,
      fontSize: 9.5, bold: true, fontFace: FONT_BODY, color: C.success, valign: "middle", margin: 0
    });

    // value highlight
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx + 0.15, y: cy + 2.60, w: 3.5, h: 0.55,
      fill: { color: C.primary }, line: { color: C.primary }
    });
    s.addText("Bác sĩ chỉ duyệt và ký — không gõ tay nguyên bệnh án.", {
      x: cx + 0.25, y: cy + 2.62, w: 3.3, h: 0.50,
      fontSize: 10, bold: true, italic: true, fontFace: FONT_BODY, color: C.white, valign: "middle", margin: 0
    });
  }

  // ============================================================
  // SLIDE 9 — TÍCH HỢP HIS / EMR
  // ============================================================
  {
    let s = pres.addSlide();
    s.background = { color: C.bg };
    addChrome(s, 9, TOTAL);
    addTitle(s, "Tích hợp với hệ thống bệnh viện",
      "MedVita gắn vào HIS / EMR sẵn có — không thay đổi quy trình hiện hữu");

    // architecture diagram - horizontal flow
    const ay = 2.20;
    const blockW = 1.55, blockH = 1.20;
    const startX = 0.6;
    const gap = 0.20;

    // pre-render icons in white
    const archIcons = [
      await iconPng(FaUsers, "#FFFFFF"),
      await iconPng(FaUserMd, "#FFFFFF"),
      await iconPng(FaBrain, "#FFFFFF"),
      await iconPng(FaHospital, "#FFFFFF"),
      await iconPng(FaChartLine, "#FFFFFF"),
    ];
    const blocks = [
      { t: "Bệnh nhân", sub: "Điện thoại / Web", color: C.secondary },
      { t: "Bác sĩ", sub: "Máy khám", color: C.primary },
      { t: "MedVita AI", sub: "Engine xử lý", color: C.accentDark },
      { t: "HIS / EMR", sub: "Hệ thống viện", color: C.success },
      { t: "Báo cáo & BI", sub: "Phân tích", color: C.accent },
    ];

    blocks.forEach((b, i) => {
      const x = startX + i * (blockW + gap);
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: ay, w: blockW, h: blockH,
        fill: { color: C.white }, line: { color: b.color, width: 1.5 }, shadow: shadow()
      });
      s.addShape(pres.shapes.OVAL, {
        x: x + (blockW - 0.55) / 2, y: ay + 0.18, w: 0.55, h: 0.55,
        fill: { color: b.color }, line: { color: b.color }
      });
      s.addImage({ data: archIcons[i], x: x + (blockW - 0.32) / 2, y: ay + 0.30, w: 0.32, h: 0.32 });

      s.addText(b.t, {
        x, y: ay + 0.78, w: blockW, h: 0.25,
        fontSize: 11.5, bold: true, fontFace: FONT_HEADER, color: C.primary, align: "center", margin: 0
      });
      s.addText(b.sub, {
        x, y: ay + 1.00, w: blockW, h: 0.20,
        fontSize: 9, fontFace: FONT_BODY, color: C.muted, align: "center", margin: 0
      });

      if (i < blocks.length - 1) {
        const ax = x + blockW + 0.02;
        s.addShape(pres.shapes.LINE, {
          x: ax, y: ay + blockH / 2, w: gap - 0.04, h: 0,
          line: { color: C.secondary, width: 1.5 }
        });
        s.addImage({ data: ic.arrow, x: ax + gap - 0.16, y: ay + blockH / 2 - 0.07, w: 0.14, h: 0.14 });
      }
    });

    // bottom: integration capabilities
    const items = [
      { t: "API chuẩn HL7 / FHIR", d: "Sẵn sàng kết nối các HIS phổ biến tại Việt Nam." },
      { t: "Triển khai On-prem hoặc Cloud", d: "Tuỳ chính sách dữ liệu của bệnh viện." },
      { t: "Form bệnh án theo viện", d: "Cấu hình theo mẫu, không ép quy trình." },
    ];
    items.forEach((it, i) => {
      const x = 0.5 + i * 3.05;
      const y = 4.05;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 2.95, h: 0.95,
        fill: { color: C.white }, line: { color: C.divider, width: 0.5 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 0.06, h: 0.95, fill: { color: C.primary }, line: { color: C.primary }
      });
      s.addText(it.t, {
        x: x + 0.18, y: y + 0.10, w: 2.7, h: 0.30,
        fontSize: 11.5, bold: true, fontFace: FONT_HEADER, color: C.primary, margin: 0
      });
      s.addText(it.d, {
        x: x + 0.18, y: y + 0.42, w: 2.7, h: 0.50,
        fontSize: 10, fontFace: FONT_BODY, color: C.bodyText, margin: 0
      });
    });
  }

  // ============================================================
  // SLIDE 10 — TUÂN THỦ & BẢO MẬT
  // ============================================================
  {
    let s = pres.addSlide();
    s.background = { color: C.bg };
    addChrome(s, 10, TOTAL);
    addTitle(s, "Tuân thủ & Bảo mật dữ liệu y tế",
      "Dữ liệu bệnh nhân không rời khỏi vòng kiểm soát của bệnh viện");

    // big shield on left
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 1.75, w: 3.0, h: 3.30,
      fill: { color: C.primary }, line: { color: C.primary }, shadow: shadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 5.0, w: 3.0, h: 0.05, fill: { color: C.accent }, line: { color: C.accent }
    });
    const shieldLg = await iconPng(FaShieldAlt, "#FFFFFF", 256);
    s.addImage({ data: shieldLg, x: 1.5, y: 2.05, w: 1.0, h: 1.0 });
    s.addText("Security-first", {
      x: 0.5, y: 3.20, w: 3.0, h: 0.4,
      fontSize: 22, bold: true, fontFace: FONT_HEADER, color: C.white, align: "center", margin: 0
    });
    s.addText("Thiết kế bảo mật từ tầng dữ liệu — không phải bổ sung sau cùng.", {
      x: 0.7, y: 3.65, w: 2.6, h: 0.7,
      fontSize: 11, fontFace: FONT_BODY, color: C.light, align: "center", margin: 0, italic: true
    });

    // 4 compliance cards on right (2x2)
    const items = [
      { t: "Triển khai On-prem", d: "Server đặt trong bệnh viện — dữ liệu BN không gửi ra ngoài.", icon: ic.server },
      { t: "Mã hoá end-to-end", d: "Mã hoá khi lưu trữ và khi truyền — TLS 1.3, AES-256.", icon: ic.lock },
      { t: "Phân quyền & Audit log", d: "Theo vai trò bác sĩ / điều dưỡng / quản trị, ghi log mọi thao tác.", icon: ic.cogs },
      { t: "Tuân thủ pháp lý VN", d: "Luật KCB, Luật An toàn TT mạng, Nghị định 13 về dữ liệu cá nhân.", icon: ic.shield },
    ];
    items.forEach((it, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = 3.8 + col * 2.95;
      const y = 1.75 + row * 1.70;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 2.85, h: 1.55,
        fill: { color: C.white }, line: { color: C.divider, width: 0.5 }, shadow: shadow()
      });
      s.addShape(pres.shapes.OVAL, {
        x: x + 0.20, y: y + 0.22, w: 0.50, h: 0.50,
        fill: { color: C.ice }, line: { color: C.light }
      });
      s.addImage({ data: it.icon, x: x + 0.30, y: y + 0.32, w: 0.30, h: 0.30 });
      s.addText(it.t, {
        x: x + 0.85, y: y + 0.20, w: 1.95, h: 0.30,
        fontSize: 12, bold: true, fontFace: FONT_HEADER, color: C.primary, margin: 0
      });
      s.addText(it.d, {
        x: x + 0.20, y: y + 0.80, w: 2.55, h: 0.65,
        fontSize: 10, fontFace: FONT_BODY, color: C.bodyText, margin: 0
      });
    });
  }

  // ============================================================
  // SLIDE 11 — ROI cho bệnh viện
  // ============================================================
  {
    let s = pres.addSlide();
    s.background = { color: C.bg };
    addChrome(s, 11, TOTAL);
    addTitle(s, "ROI dự kiến cho bệnh viện",
      "Mô hình minh hoạ — dựa trên 100 bác sĩ, 20 ca khám/ngày/BS, 250 ngày/năm");

    // chart on left - hours saved per year
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 1.75, w: 5.5, h: 3.30,
      fill: { color: C.white }, line: { color: C.divider, width: 0.75 }, shadow: shadow()
    });
    s.addText("Thời gian bác sĩ tiết kiệm được (giờ/năm) theo % cải thiện", {
      x: 0.7, y: 1.85, w: 5.1, h: 0.3,
      fontSize: 12, bold: true, fontFace: FONT_HEADER, color: C.primary, margin: 0
    });
    s.addChart(pres.charts.BAR, [{
      name: "Giờ tiết kiệm",
      labels: ["10% cải thiện", "20% cải thiện", "30% cải thiện", "40% cải thiện"],
      values: [16667, 33333, 50000, 66667]
    }], {
      x: 0.6, y: 2.20, w: 5.3, h: 2.80,
      barDir: "col",
      chartColors: [C.primary],
      chartArea: { fill: { color: C.white } },
      catAxisLabelColor: C.muted,
      valAxisLabelColor: C.muted,
      valGridLine: { color: C.divider, size: 0.5 },
      catGridLine: { style: "none" },
      showValue: true, dataLabelPosition: "outEnd", dataLabelColor: C.bodyText,
      dataLabelFontSize: 10,
      showLegend: false,
    });

    // right: ROI bullets
    const xx = 6.20, yy = 1.75;
    s.addShape(pres.shapes.RECTANGLE, {
      x: xx, y: yy, w: 3.30, h: 3.30,
      fill: { color: C.primary }, line: { color: C.primary }, shadow: shadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: xx, y: yy, w: 3.30, h: 0.10, fill: { color: C.accent }, line: { color: C.accent }
    });
    s.addText("Quy đổi giá trị", {
      x: xx + 0.25, y: yy + 0.25, w: 3.0, h: 0.35,
      fontSize: 16, bold: true, fontFace: FONT_HEADER, color: C.white, margin: 0
    });

    const benefits = [
      { v: "+15–25%", l: "công suất khám tiềm năng" },
      { v: "−30–40%", l: "thời gian thủ tục mỗi ca" },
      { v: ">90%", l: "trường bệnh án được điền tự động" },
      { v: "Cao hơn", l: "điểm hài lòng BN & bác sĩ" },
    ];
    benefits.forEach((b, i) => {
      const by = yy + 0.75 + i * 0.60;
      s.addShape(pres.shapes.LINE, {
        x: xx + 0.25, y: by + 0.55, w: 3.0, h: 0,
        line: { color: C.secondary, width: 0.5, dashType: "dash" }
      });
      s.addText(b.v, {
        x: xx + 0.25, y: by, w: 1.4, h: 0.45,
        fontSize: 18, bold: true, fontFace: FONT_HEADER, color: C.accent, margin: 0
      });
      s.addText(b.l, {
        x: xx + 1.65, y: by + 0.05, w: 1.6, h: 0.45,
        fontSize: 10.5, fontFace: FONT_BODY, color: C.white, valign: "middle", margin: 0
      });
    });

    s.addText("* Mô hình minh hoạ — sẽ được hiệu chỉnh theo dữ liệu thực tế của bệnh viện sau pilot.", {
      x: 0.5, y: 5.10, w: 9, h: 0.22,
      fontSize: 8, italic: true, fontFace: FONT_BODY, color: C.muted, margin: 0
    });
  }

  // ============================================================
  // SLIDE 12 — LỘ TRÌNH TRIỂN KHAI
  // ============================================================
  {
    let s = pres.addSlide();
    s.background = { color: C.bg };
    addChrome(s, 12, TOTAL);
    addTitle(s, "Lộ trình triển khai (18 tháng)",
      "Đồng hành cùng 1 bệnh viện đối tác — từ khảo sát, pilot đến nhân rộng");

    // timeline horizontal line
    const ty = 2.60;
    s.addShape(pres.shapes.LINE, {
      x: 1.0, y: ty, w: 8.0, h: 0,
      line: { color: C.secondary, width: 2 }
    });

    const phases = [
      { n: "Giai đoạn 1", time: "06/2026 – 11/2026", t: "Khảo sát & Chuẩn bị dữ liệu",
        items: ["Khảo sát workflow tại các khoa", "Xây dựng & chuẩn hoá dataset y khoa tiếng Việt", "Huấn luyện mô hình ASR / NLU lõi"], color: C.secondary },
      { n: "Giai đoạn 2", time: "12/2026 – 05/2027", t: "Phát triển & Pilot",
        items: ["Hoàn thiện hệ thống MedVita", "Tích hợp với HIS bệnh viện đối tác", "Pilot tại 1–2 khoa, đo hiệu quả"], color: C.primary },
      { n: "Giai đoạn 3", time: "06/2027 – 11/2027", t: "Đánh giá & Mở rộng",
        items: ["Đánh giá hiệu quả lâm sàng và kinh doanh", "Cải tiến mô hình theo phản hồi", "Sẵn sàng nhân rộng các khoa khác"], color: C.accentDark },
    ];

    phases.forEach((p, i) => {
      const x = 0.7 + i * 3.05;
      // dot on timeline
      s.addShape(pres.shapes.OVAL, {
        x: x + 1.30, y: ty - 0.12, w: 0.24, h: 0.24,
        fill: { color: p.color }, line: { color: p.color }
      });
      // card BELOW timeline
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 2.95, w: 2.85, h: 2.10,
        fill: { color: C.white }, line: { color: C.divider, width: 0.5 }, shadow: shadow()
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 2.95, w: 2.85, h: 0.08, fill: { color: p.color }, line: { color: p.color }
      });
      s.addText(p.n, {
        x: x + 0.15, y: 1.85, w: 2.55, h: 0.28,
        fontSize: 11, bold: true, fontFace: FONT_HEADER, color: p.color, margin: 0
      });
      s.addText(p.time, {
        x: x + 0.15, y: 2.13, w: 2.55, h: 0.25,
        fontSize: 9, fontFace: FONT_BODY, color: C.muted, margin: 0
      });
      s.addText(p.t, {
        x: x + 0.15, y: 3.10, w: 2.55, h: 0.30,
        fontSize: 13, bold: true, fontFace: FONT_HEADER, color: C.primary, margin: 0
      });
      s.addText(p.items.map((it, k) => ({
        text: it,
        options: { bullet: true, breakLine: k < p.items.length - 1, fontSize: 10, color: C.bodyText }
      })), { x: x + 0.18, y: 3.50, w: 2.55, h: 1.50, margin: 0, paraSpaceAfter: 2, fontFace: FONT_BODY });
    });

    // start indicator
    s.addText("HÔM NAY", {
      x: 0.5, y: 2.40, w: 0.8, h: 0.20,
      fontSize: 8, bold: true, fontFace: FONT_HEADER, color: C.accent, margin: 0, charSpacing: 2
    });
    s.addShape(pres.shapes.OVAL, {
      x: 0.85, y: ty - 0.06, w: 0.12, h: 0.12, fill: { color: C.accent }, line: { color: C.accent }
    });
  }

  // ============================================================
  // SLIDE 13 — NĂNG LỰC TRIVITA AI
  // ============================================================
  {
    let s = pres.addSlide();
    s.background = { color: C.bg };
    addChrome(s, 13, TOTAL);
    addTitle(s, "Năng lực Trivita AI",
      "Đội ngũ nghiên cứu xuất bản tại các hội nghị AI hàng đầu — chuyên sâu y tế & vision-language");

    // 3 capability cards top
    const top = [
      { v: "7+", l: "Bài báo NeurIPS / ICLR / TMLR", icon: ic.flask, color: C.primary },
      { v: "Y khoa", l: "Vision-Language Models y tế (LVM-Med, ExGra-Med)", icon: ic.brain, color: C.secondary },
      { v: "Việt Nam", l: "Xử lý ngôn ngữ y khoa tiếng Việt — lợi thế bản địa", icon: ic.lang, color: C.accentDark },
    ];
    top.forEach((c, i) => {
      const x = 0.5 + i * 3.05, y = 1.75;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 2.95, h: 1.55,
        fill: { color: C.white }, line: { color: C.divider, width: 0.5 }, shadow: shadow()
      });
      s.addShape(pres.shapes.OVAL, {
        x: x + 0.25, y: y + 0.30, w: 0.55, h: 0.55,
        fill: { color: c.color }, line: { color: c.color }
      });
      // re-render icon white
      // we'll use generic inline
    });
    // re-add icons (white) explicitly
    const iconsTop = [
      await iconPng(FaFlask, "#FFFFFF"),
      await iconPng(FaBrain, "#FFFFFF"),
      await iconPng(FaLanguage, "#FFFFFF"),
    ];
    top.forEach((c, i) => {
      const x = 0.5 + i * 3.05, y = 1.75;
      s.addImage({ data: iconsTop[i], x: x + 0.36, y: y + 0.41, w: 0.33, h: 0.33 });
      s.addText(c.v, {
        x: x + 0.95, y: y + 0.30, w: 1.95, h: 0.45,
        fontSize: 22, bold: true, fontFace: FONT_HEADER, color: c.color, margin: 0
      });
      s.addText(c.l, {
        x: x + 0.25, y: y + 0.95, w: 2.55, h: 0.55,
        fontSize: 10.5, fontFace: FONT_BODY, color: C.bodyText, margin: 0
      });
    });

    // bottom: research highlights table-style
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 3.50, w: 9.0, h: 1.65,
      fill: { color: C.white }, line: { color: C.divider, width: 0.5 }, shadow: shadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 3.50, w: 0.10, h: 1.65, fill: { color: C.primary }, line: { color: C.primary }
    });
    s.addText("Một số công trình tiêu biểu liên quan tới MedVita", {
      x: 0.75, y: 3.58, w: 8.5, h: 0.30,
      fontSize: 12, bold: true, fontFace: FONT_HEADER, color: C.primary, margin: 0
    });

    const papers = [
      { v: "NeurIPS 2023", t: "LVM-Med: Self-Supervised Vision Models for Medical Imaging" },
      { v: "NeurIPS 2024", t: "FuseMoE: Mixture-of-Experts Transformers for Fleximodal Fusion" },
      { v: "NeurIPS 2025", t: "ExGra-Med: Extended Context Graph Alignment for Medical Vision-Language" },
      { v: "TMLR 2025",    t: "MGPATH: Vision-language model with multi-granular prompt for pathology" },
      { v: "ICLR 2026",    t: "Revisit Visual Prompt Tuning · One-Prompt Strikes Back (continual learning)" },
    ];
    papers.forEach((p, i) => {
      const yy = 3.92 + i * 0.24;
      s.addText(p.v, {
        x: 0.85, y: yy, w: 1.5, h: 0.22,
        fontSize: 9.5, bold: true, fontFace: FONT_HEADER, color: C.accentDark, margin: 0
      });
      s.addText(p.t, {
        x: 2.40, y: yy, w: 7.0, h: 0.22,
        fontSize: 9.5, fontFace: FONT_BODY, color: C.bodyText, margin: 0
      });
    });
  }

  // ============================================================
  // SLIDE 14 — LỢI THẾ CẠNH TRANH
  // ============================================================
  {
    let s = pres.addSlide();
    s.background = { color: C.bg };
    addChrome(s, 14, TOTAL);
    addTitle(s, "Lợi thế cạnh tranh tại thị trường Việt Nam",
      "Vì sao một bệnh viện VN nên chọn MedVita thay vì giải pháp nước ngoài (ví dụ Abridge, định giá ~5,3 tỷ USD)");

    // 3 advantage cards (top row, light gray with green left bar — match reference card style)
    const advs = [
      { t: "Form bệnh án Việt Nam", d: "Khớp mẫu BYT và mẫu riêng từng viện — không phải mẫu form Mỹ. Toàn bộ trường thông tin theo quy định trong nước.", color: C.accent },
      { t: "Tiếng Việt y khoa", d: "Mô hình ASR/NLU tinh chỉnh cho thuật ngữ y khoa tiếng Việt và phương ngữ Bắc-Trung-Nam. Lợi thế dữ liệu bản địa.", color: C.secondary },
      { t: "Hỗ trợ tại chỗ", d: "Đội ngũ Trivita AI tại VN — pilot, tích hợp HIS, đào tạo, fine-tune theo phản hồi đều trực tiếp tại bệnh viện.", color: C.accent },
    ];
    advs.forEach((a, i) => {
      const x = 0.4 + i * 3.10, y = 2.00, w = 2.95, h = 1.55;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w, h, fill: { color: C.ice }, line: { color: C.ice }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 0.10, h, fill: { color: a.color }, line: { color: a.color }
      });
      s.addText(a.t, {
        x: x + 0.25, y: y + 0.18, w: w - 0.40, h: 0.35,
        fontSize: 13, bold: true, fontFace: FONT_HEADER, color: C.primary, margin: 0
      });
      s.addText(a.d, {
        x: x + 0.25, y: y + 0.58, w: w - 0.40, h: 0.92,
        fontSize: 10.5, fontFace: FONT_BODY, color: C.bodyText, margin: 0
      });
    });

    // comparison table — MedVita vs Abridge
    const tableY = 3.70;
    const headerH = 0.32;
    const rowH = 0.26;
    const colXs = [0.4, 3.40, 6.10];
    const colWs = [3.0, 2.70, 3.10];

    // header row navy
    colXs.forEach((cx, i) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: cx, y: tableY, w: colWs[i], h: headerH,
        fill: { color: C.primary }, line: { color: C.primary }
      });
    });
    const headers = ["Tiêu chí", "MedVita (Trivita AI)", "Abridge (US)"];
    headers.forEach((h, i) => {
      s.addText(h, {
        x: colXs[i] + 0.12, y: tableY + 0.04, w: colWs[i] - 0.24, h: headerH - 0.08,
        fontSize: 11, bold: true, fontFace: FONT_HEADER, color: C.white, valign: "middle", margin: 0
      });
    });

    const rows = [
      ["Form bệnh án",       "✓ Form BYT & form viện",    "Form mẫu Mỹ"],
      ["Ngôn ngữ y khoa",    "✓ Tiếng Việt chuyên sâu",   "Tiếng Anh"],
      ["Tích hợp HIS VN",    "✓ HL7/FHIR + tuỳ biến",     "Hạn chế ở VN"],
      ["Hỗ trợ on-prem",     "✓ Có",                       "Cloud-only"],
      ["Đội ngũ tại VN",     "✓ Trực tiếp tại VN",         "Không"],
    ];
    rows.forEach((r, ri) => {
      const yy = tableY + headerH + ri * rowH;
      // alt row fill
      const fillC = ri % 2 === 0 ? C.white : "FAFAFA";
      colXs.forEach((cx, i) => {
        s.addShape(pres.shapes.RECTANGLE, {
          x: cx, y: yy, w: colWs[i], h: rowH,
          fill: { color: fillC }, line: { color: C.divider, width: 0.25 }
        });
      });
      s.addText(r[0], {
        x: colXs[0] + 0.12, y: yy + 0.03, w: colWs[0] - 0.24, h: rowH - 0.06,
        fontSize: 10, bold: true, fontFace: FONT_HEADER, color: C.primary, valign: "middle", margin: 0
      });
      s.addText(r[1], {
        x: colXs[1] + 0.12, y: yy + 0.03, w: colWs[1] - 0.24, h: rowH - 0.06,
        fontSize: 10, fontFace: FONT_BODY, color: C.accentDark, bold: true, valign: "middle", margin: 0
      });
      s.addText(r[2], {
        x: colXs[2] + 0.12, y: yy + 0.03, w: colWs[2] - 0.24, h: rowH - 0.06,
        fontSize: 10, fontFace: FONT_BODY, color: C.muted, valign: "middle", margin: 0
      });
    });
  }

  // ============================================================
  // SLIDE 15 — Q&A / THANK YOU (Trivita brand: solid navy bg)
  // ============================================================
  {
    let s = pres.addSlide();
    s.background = { color: C.primary };

    // wordmark top-left
    s.addText([
      { text: "Trivita ", options: { bold: true, color: C.white } },
      { text: "AI", options: { bold: true, color: C.secondary } },
    ], {
      x: 0.6, y: 0.5, w: 4, h: 0.40,
      fontSize: 18, fontFace: FONT_HEADER, margin: 0
    });
    s.addText("AI for Life", {
      x: 0.6, y: 0.88, w: 4, h: 0.25,
      fontSize: 10, italic: true, fontFace: FONT_BODY,
      color: C.light, margin: 0
    });

    // dot matrix top-right
    {
      const cols = 7, rows = 3, dotSize = 0.13, gap = 0.12;
      const startX = 8.20, startY = 0.45;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          s.addShape(pres.shapes.OVAL, {
            x: startX + c * (dotSize + gap),
            y: startY + r * (dotSize + gap),
            w: dotSize, h: dotSize,
            fill: { color: "3A5485" }, line: { color: "3A5485" }
          });
        }
      }
    }

    // Big "Câu hỏi?" / "Questions?"
    s.addText("Câu hỏi?", {
      x: 0.6, y: 1.85, w: 9.0, h: 0.85,
      fontSize: 56, bold: true, fontFace: FONT_HEADER,
      color: C.white, margin: 0
    });

    // sub-statement
    s.addText("Cảm ơn quý lãnh đạo bệnh viện đã dành thời gian.", {
      x: 0.6, y: 2.78, w: 9.0, h: 0.40,
      fontSize: 16, fontFace: FONT_HEADER, color: C.accent, margin: 0
    });
    s.addText("Bước tiếp theo đề xuất: workshop khảo sát quy trình 1 buổi · pilot 1 khoa trong 6 tháng", {
      x: 0.6, y: 3.20, w: 9.0, h: 0.35,
      fontSize: 13, italic: true, fontFace: FONT_BODY, color: C.white, margin: 0
    });

    // contact card (light gray, like reference)
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 3.85, w: 5.5, h: 1.15,
      fill: { color: "E8E8E8" }, line: { color: "E8E8E8" }
    });
    s.addText("Liên hệ với Trivita AI Research Team", {
      x: 0.85, y: 3.95, w: 5.0, h: 0.30,
      fontSize: 12, bold: true, fontFace: FONT_HEADER,
      color: C.primary, margin: 0
    });
    s.addText("contact@trivita.ai", {
      x: 0.85, y: 4.25, w: 5.0, h: 0.32,
      fontSize: 14, fontFace: FONT_HEADER,
      color: C.muted, margin: 0
    });
    s.addText("Đề xuất pilot: 1 khoa · 6 tháng · báo cáo hiệu quả lâm sàng & kinh doanh", {
      x: 0.85, y: 4.58, w: 5.0, h: 0.30,
      fontSize: 10, italic: true, fontFace: FONT_BODY,
      color: C.muted, margin: 0
    });

    // footer
    s.addText("MedVita · 2026", {
      x: 6.5, y: 5.20, w: 3.0, h: 0.25,
      fontSize: 10, italic: true, fontFace: FONT_BODY, color: C.light, align: "right", margin: 0
    });
  }

  // ============================================================
  await pres.writeFile({ fileName: "MedVita_DeckHospitalLeadership.pptx" });
  console.log("Wrote MedVita_DeckHospitalLeadership.pptx");
})();
