# Demo Redesign — MedVita TMH (Viêm xoang cấp)
**Date:** 2026-05-07  
**Approach:** B — Command-driven AI, transparent traceability

---

## 1. Goals

1. AI trông thông minh và chủ động nhưng không tự mãn — bác sĩ vẫn là người quyết định
2. Mọi hành động AI tự làm đều có nguồn gốc rõ ràng (traceable) — doctor có thể verify trước khi approve
3. XN ordering flow đầy đủ: command → chọn → phiếu chỉ định → HIS → kết quả về → điền bệnh án
4. MedVita có giọng nói riêng, nói đúng 3 lần quan trọng — không gây phiền

---

## 2. Voices

| Role | Voice | Tính cách | Dùng khi |
|------|-------|-----------|----------|
| 🩺 Bác sĩ | **Enceladus** | Breathy, chắc | Tất cả dictate steps (v1–v7) |
| 🤖 MedVita | **Sadaltager** | Knowledgeable | 3 lần TTS (xem §4) |

**Re-generate toàn bộ v1–v6 với voice Enceladus.** Tạo thêm v7-xn-command.

---

## 3. Two-Phase Flow

### Phase 1 — Ghi nhận & Điền bệnh án

| Step | Actor | MedVita TTS |
|------|-------|------------|
| HIS auto-fill (admin + sinh hiệu) | AI | — |
| Lý do vào viện | Doctor dictate → AI fill | — |
| Quá trình bệnh lý | Doctor dictate → AI fill | — |
| Tiền sử bản thân | Doctor dictate → AI fill | 🔊 **Alert dị ứng** |
| Tiền sử gia đình, sinh hiệu | AI auto | — |
| Khám lâm sàng | Doctor dictate → AI fill | — |
| **Announce: Tóm tắt** | AI xin phép (Copilot card) | 🔊 **"Đủ info, điền Tóm tắt trước"** |
| Tóm tắt | AI fill (sau khi approve) | — |

### Phase 2 — Chỉ định & Hoàn thiện

| Step | Actor | MedVita TTS |
|------|-------|------------|
| Doctor command: "list XN cơ bản TMH" | Doctor dictate | — |
| XN card hiện → doctor chọn → AI tạo phiếu | AI + Doctor | — |
| Gửi HIS, chờ kết quả | AI process | — |
| Kết quả XN về | AI | 🔊 **"Kết quả về — BC và CRP tăng"** |
| AI auto-fill kết quả vào bệnh án | AI | — |
| Doctor dictate: chẩn đoán + hướng điều trị | Doctor → AI fill | — |
| Export → Review modal (cảnh báo dị ứng) | Doctor confirm | — |

---

## 4. MedVita TTS — 3 Moments

### 4.1 Alert dị ứng kháng sinh
**Trigger:** Sau khi AI điền xong field `tiensu` và detect "dị ứng kháng sinh"  
**Text:** *"Lưu ý — bệnh nhân có tiền sử dị ứng kháng sinh không rõ loại. Tôi sẽ đánh dấu cảnh báo vào hướng điều trị."*  
**Visual:** Feed item `feedAnnounce` style warning (amber)

### 4.2 Xin điền Tóm tắt
**Trigger:** Sau khi đủ: qtbl + tiensu + khamtoanthan  
**Text:** *"Đủ thông tin rồi. Tôi sẽ điền trước phần Tóm tắt — bác sĩ kiểm tra sau nhé."*  
**Visual:** Feed item `feedAnnounce` kiểu Copilot (xem §5b), auto-approve sau 2.5s

### 4.3 Kết quả XN về
**Trigger:** Sau delay simulate HIS  
**Text:** *"Kết quả xét nghiệm đã về. Bạch cầu và CRP tăng — phù hợp viêm xoang cấp."*  
**Visual:** Feed item `feedHISResult` (xem §5c)

---

## 5. New Feed Item Types

### 5a. `fieldSource` — Traceability chip trên field

Mỗi field group B (AI-filled) có chip **"Nguồn ▾"** ở góc trên phải. Click expand:

```
[Nguồn ▾]
  🎙 Audio 00:08–00:34 · "bệnh nhân ngạt mũi..."
  🎙 Audio 00:41–01:02 · "hôm nay sốt 39 độ..."
```

**Nguồn types:**
- `🎙 Audio` — timestamp range + quote snippet
- `🏥 HIS` — field name từ HIS
- `🔗 Suy ra từ` — tên field(s) khác

**Implementation:** Mỗi `setFieldB` call nhận thêm param `sources[]`. Chip render sau khi typing xong.

### 5b. `feedAnnounce` — hai variants

**Variant 1: `alert`** — thông báo quan trọng, không cần approve (dùng cho §4.1)
```
┌──────────────────────────────────────────────┐
│ ⚠ MEDVITA  Phát hiện dị ứng kháng sinh       │
│  Sẽ đánh dấu cảnh báo vào Hướng điều trị.   │
└──────────────────────────────────────────────┘
```
Màu: amber border + bg. Không có button.

**Variant 2: `permission`** — xin phép làm gì đó (dùng cho §4.2)

```
┌──────────────────────────────────────────────┐
│ MEDVITA  muốn điền  📝 Tóm tắt bệnh án      │
│                                              │
│  ▸ Tổng hợp từ 4 nguồn                      │
│    • Lý do vào viện → "Ho, sốt"             │
│    • Tiền sử → "Dị ứng kháng sinh"          │
│    • Sinh hiệu → "Sốt 38.8°C"              │
│    • Khám lâm sàng → "Mũi dịch mủ..."      │
│                                              │
│  [✓ Cho phép]  [✎ Xem trước]  [✗ Bỏ qua]   │
└──────────────────────────────────────────────┘
```

- Demo: auto-click **"Cho phép"** sau `speed(2500)`ms
- Sources collapsible (default collapsed)
- Màu: border indigo, header gradient nhẹ

### 5c. `feedHISResult` — HIS result card

```
┌──────────────────────────────────────────────────┐
│ ▸ [HIS] Kết quả XN · #XN-2605-0042 · 04:15     │
│                                    [Mở HIS ↗]   │
└──────────────────────────────────────────────────┘
           ↓ expand
┌──────────────────────────────────────────────────┐
│  Bạch cầu (BC)     11.2 G/L   ↑ Cao nhẹ        │
│  CRP               48 mg/L    ↑ Tăng            │
│  Glucose           4.35 mmol/L  ✓ BT            │
│  Creatinin         61.05 µmol/L ✓ BT            │
│  X-quang xoang     —            ⏳ Đang xử lý   │
└──────────────────────────────────────────────────┘
```

- Tag `[HIS]` màu tím (#7C3AED)
- Rows highlight màu nếu bất thường (amber bg cho ↑)
- "Mở HIS ↗" là anchor `href="#"` (demo, không navigate)

---

## 6. XN Ordering Card (TMH context)

**Trigger:** Doctor command "list XN cơ bản TMH"

**Full list hiển thị (17 tests):**
Công thức tế bào máu · CRP · Procalcitonin · Creatinin · Ure · Glucose · GOT/AST · GPT/ALT · Điện giải đồ · HBsAg · HIV · Tổng phân tích nước tiểu · Cấy vi khuẩn dịch mũi · X-quang xoang mặt · CT xoang · Nội soi mũi · Thính lực đồ

**Auto-selected (5 — phù hợp viêm xoang cấp + dị ứng kháng sinh):**
Công thức tế bào máu · CRP · Creatinin · Glucose · X-quang xoang mặt

**Sau khi chọn xong:**
- Feed: `[process]` "Đang tạo phiếu chỉ định..."
- Feed: `[done]` "Phiếu #XN-2605-0042 đã gửi HIS ✓"
- Delay 3.5s (simulate lab)
- → Trigger `feedHISResult` + MedVita TTS

---

## 7. Source Annotations (per field)

| Field | Sources |
|-------|---------|
| `lydo` | 🎙 Audio 00:02–00:06 · "lý do vào viện: ho, sốt" |
| `qtbl` | 🎙 Audio 00:08–00:34 · 00:41–01:02 |
| `tiensu` | 🎙 Audio 01:15–01:28 · "dị ứng kháng sinh không rõ loại" |
| `tiensuGD` | 🎙 Audio 01:30–01:35 · "gia đình không bệnh lý đặc biệt" |
| `khamtoanthan` | 🎙 Audio 02:10–02:45 |
| `tomtat` | 🔗 Suy ra từ: lydo · tiensu · khamtoanthan · nhietdo |
| `xetnghiemlamsan` | 🏥 HIS · #XN-2605-0042 |
| `chandoan` | ✍️ Bác sĩ nhập trực tiếp |
| `huongdt` | ✍️ Bác sĩ nhập trực tiếp |

---

## 8. Audio Files Plan

| File | Voice | Content |
|------|-------|---------|
| `v1-lydo` | Enceladus | "Lý do vào viện: ho, sốt." |
| `v2-qtbl` | Enceladus | Quá trình bệnh lý đầy đủ |
| `v3-tiensu` | Enceladus | Tiền sử + dị ứng |
| `v4-kham` | Enceladus | Khám TMH + toàn thân |
| `v5-tomtat` | Enceladus | Tóm tắt ngắn |
| `v6-cefuroxime` | Enceladus | Cefuroxime confirm |
| `v7-xn-command` | Enceladus | "list xét nghiệm cơ bản TMH" |
| `mv1-allergy` | Sadaltager | Alert dị ứng kháng sinh |
| `mv2-tomtat` | Sadaltager | Xin điền Tóm tắt |
| `mv3-xn-result` | Sadaltager | Kết quả XN về |

---

## 9. Files to Change

| File | Change |
|------|--------|
| `gen_tts_demo.py` | Re-gen v1–v7 với Enceladus, thêm mv1–mv3 Sadaltager |
| `src/js/data.js` | Thêm `sources[]` vào mỗi field definition |
| `src/js/engine.js` | Thêm `addFeedAnnounce`, `addFeedHISResult`, `renderFieldSource` |
| `src/js/steps.js` | Rewrite step sequence theo flow mới |
| `src/js/phase2.js` | Rewrite `showXNCardDirect` cho TMH context |
| `src/css/feed.css` | Thêm styles cho announce card, HIS result, source chip |
| `src/css/fields.css` | Thêm styles cho source chip trên field |

---

## 10. Out of Scope

- Transition button "Kết thúc thăm khám" — bỏ qua
- Real HIS integration — simulate only
- Patient voice — không có trong demo này
