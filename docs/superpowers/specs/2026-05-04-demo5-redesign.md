# demo5.html Redesign — MedVita Phase 1 Focus Panel + Phase 2 Chat

**Date:** 2026-05-04  
**File:** `demo5.html`  
**Status:** Approved

---

## Overview

Redesign `demo5.html` to remove the transcript panel from Phase 1 and replace it with a calm "focus panel", add a transition interstitial between phases, and replace Phase 2's command buttons with a chat-style doctor–agent interface. Medical case changes from sinusitis/otitis (male 35y) to chronic tonsillitis with thyroid nodules (female 48y).

---

## App Flow

```
Opening Screen → Phase 1 (form auto-fill + focus panel) → Interstitial → Phase 2 (chat)
```

### Opening Screen (unchanged)
- Logo, tagline, scenario description, start button
- Update scenario text to: "Kịch bản: Tai Mũi Họng · BN nữ, 48 tuổi · Viêm amydan mãn tính"

---

## Section 1 — Phase 1: Focus Panel

### Layout (unchanged)
- Left 65%: PDF form panel — fields auto-fill as before
- Right 35%: **Focus Panel** (replaces transcript panel)

### Focus Panel content
- Centered layout with MedVita icon (✦), blue background (#F0F4FF)
- **Headline:** "Bác sĩ chỉ cần tập trung khám"
- **Subline:** "Phần ghi nhớ và ghi chép đã có MedVita lo"
- **Progress tags:** pill badges that update as fields fill in
  - States: `wait` (grey) → `active` (blue, pulsing) → `done` (green)
  - Tags: Lý do vào viện · Quá trình bệnh lý · Tiền sử · Khám toàn thân · Khám TMH · Tóm tắt

### Phase 1 animation sequence (same step engine, new content)
- No transcript messages — right panel is static focus panel
- Form auto-fills based on tonsillitis case data (see Medical Case below)
- Progress tags update in sync with field fills

### Header
- Keep recording badge + pause button during Phase 1

---

## Section 2 — Transition Interstitial

Replaces the existing checklist overlay (`#clOverlay`). Shown as a centered card over the form panel after Phase 1 animation completes.

### Card content
- **Badge:** "✓ MedVita đã xử lý xong audio"
- **Title:** "Bệnh án đã được điền tự động"
- **Sub:** "Sẵn sàng chuyển sang giai đoạn hoàn thiện"
- **Checklist** (animated in, one by one):
  - ✓ Lý do vào viện
  - ✓ Quá trình bệnh lý
  - ✓ Tiền sử bản thân
  - ✓ Khám thực thể TMH
  - ✓ Khám toàn thân
  - ✓ Tóm tắt bệnh án
- **Note (italic):** "Chẩn đoán, CLS, hướng điều trị — chờ bác sĩ xác nhận"
- **CTA button:** "Chuyển sang hoàn thiện bệnh án →"

---

## Section 3 — Phase 2: Chat Interface

### Layout
- Left 65%: Same form panel (mostly filled, Group C fields still empty/waiting)
- Right 35%: **Chat panel** (replaces cmd-panel)

### Chat panel structure
1. **Clinical summary card** (top, fixed)
   - Label: "Tóm tắt lâm sàng"
   - Text: "BN nữ 48t, vào viện vì nuốt vướng tái phát nhiều lần trong năm. Amidan quá phát độ III, VA tồn dư. Nhân tuyến giáp TIRADS 3 trái (phát hiện tại BV Đồng Hỷ). Chẩn đoán: J35.0 Viêm amydan mãn tính. Hướng xử lý: ngoại khoa."
   - Quick action buttons: ✓ Duyệt · ✎ Sửa

2. **Chat history** (scrollable, auto-scroll)
   - Doctor messages: right-aligned, blue bubble
   - MedVita messages: left-aligned, light blue, with label "MEDVITA"
   - MedVita thinking indicator (dots) before each response

3. **Pre-scripted chat turns** (triggered by clicking send or turn buttons)

   **Turn 1 — Doctor:** "điền kết quả xét nghiệm tiền phẫu"  
   **MedVita:** "Đã điền 22 xét nghiệm từ phác đồ tiền phẫu chuẩn. Bác sĩ duyệt trước khi lưu."  
   + Card: PT · APTT · Fibrinogen · Glucose · Ure · Creatinin · AST · ALT · Điện giải đồ · Nhóm máu · HIV · HBsAg · HCV · Tổng phân tích máu · Nước tiểu · Điện tim · X-quang ngực · Thính lực · Nhĩ lượng · T3 · FT4 · TSH  
   → fills `khamck` field on form as agent-draft (maps to specialist exam field, page 2)

   **Turn 2 — Doctor:** "nhân tuyến giáp TIRADS 3 có cần theo dõi không?"  
   **MedVita:** "TIRADS 3 cần siêu âm tuyến giáp theo dõi sau 6–12 tháng theo hướng dẫn ACR. Tôi có thể thêm vào mục khuyến nghị theo dõi. Bác sĩ xác nhận?"  
   + Approve/Skip buttons

   **Turn 3 — Doctor:** "cần hoàn tất gì?"  
   **MedVita:** "Còn 3 mục chờ bác sĩ:" + checklist:
   - ⬜ Chẩn đoán sơ bộ — đề xuất đã có, chờ duyệt
   - ⬜ Mã ICD-10 — đề xuất: J35.0
   - ⬜ Hướng điều trị — chờ bác sĩ điền (ngoại khoa / phác đồ cụ thể)
   - ⬜ Tiên lượng

   **Turn 4 — Doctor** directly edits diagnosis field (click to edit, Tab to approve)  
   **MedVita:** "Field 'Chẩn đoán sơ bộ' đang ở chế độ chỉnh sửa. Nhấn Tab để xác nhận."

4. **Input area** (bottom)
   - Fake text input pre-filled with next doctor message text (read-only)
   - Send button click: doctor bubble appears → thinking indicator → MedVita response
   - Each send click advances to next turn; input updates with next pre-scripted text
   - Turn 4 (direct edit) is triggered by a "Chỉnh sửa trực tiếp" button inside the chat, not via send
   - When all turns done: input disabled, "Bệnh án sẵn sàng xuất" message shown

### Header updates at Phase 2 start
- Hide recording badge, hide pause button
- Title: "Đang hỗ trợ hoàn thiện bệnh án"
- Sub: "Bác sĩ ra lệnh · MedVita tạo nháp · Bác sĩ duyệt trước khi lưu"

---

## Medical Case Data

**Patient:** Nữ, 48 tuổi, MABN 14107353  
**Specialty:** Tai Mũi Họng (TMH)  
**Chief complaint:** Nuốt vướng, đau họng, sốt tái phát nhiều lần trong năm + ngủ ngáy

### Key fields
| Field | Value |
|---|---|
| Lý do vào viện | Nuốt vướng |
| Quá trình bệnh lý | Bệnh nhân thường xuyên bị đau họng, sốt tái lại nhiều lần trong năm. Kèm ngủ ngáy, nuốt vướng. Điều trị từng đợt bằng thuốc, hay tái phát. Đợt này nuốt vướng tăng lên, chưa dùng thuốc → nhập BV Đồng Hỷ → chuyển BV TWTN. Siêu âm tuyến giáp: nhân thùy phải TIRADS 1, nhân thùy trái TIRADS 3. |
| Khám toàn thân | Tỉnh, tiếp xúc tốt. Da niêm mạc hồng. Không phù. Hạch ngoại vi, tuyến giáp bình thường. |
| Khám TMH | Vòm: VA tồn dư. Họng: Amidan quá phát. Tai, mũi: Bình thường. |
| Chẩn đoán | J35.0 Viêm amydan mãn tính |
| Hướng điều trị | Ngoại khoa |
| Tóm tắt | BN nữ 48t, vào viện 11h30 ngày 03/04/2026 với lý do nuốt vướng. Đau họng, sốt tái lại nhiều lần/năm, ngủ ngáy. VA tồn dư, Amidan quá phát. Chuyển từ BV Đồng Hỷ với nhân tuyến giáp TIRADS 3 trái. |
| Sinh hiệu | Mạch: 78 · Nhiệt độ: 36.8 · HA: 120/75 · Nhịp thở: 18 · Cân nặng: 52 |
| NHANTU (Nhập tự) | 2 (Chuyển viện) |
| TIENLUONG | Khá |

---

## Technical Changes to demo5.html

### Remove
- `.transcript-panel` HTML and all related CSS (`.tp-*`, `.mv-note`, `.mv-suggest`, `.mv-typing`, `.turn-label`, `.tp-msg`)
- All `addMessage()`, `addMvNote()`, `addMvSuggest()`, `addTurnLabel()` JS functions
- All step entries with `t:'msg'`, `t:'note'`, `t:'suggest'`, `t:'label'`
- `.cmd-panel` with numbered command buttons — replace with chat panel

### Add
- `.focus-panel` CSS + HTML in right column
- Progress tag update logic (synced to field fills)
- New `.chat-panel` CSS + HTML
- Chat turn engine: `runChatTurn(index)` triggered by send button
- Interstitial card update (reuse `#clOverlay` structure, update content)

### Keep
- All field definitions (FIELDS array) — update data values
- `setFieldB`, `setFieldAgentDraft`, `approveField`, `editField`, `rejectField`
- `typeText` animation engine
- Edit mode (`E` key)
- Pause/replay controls (Phase 1 only)
- Export button + toast
- Progress bar + pending badge

### Update
- `groupA` data → female patient demographics
- `qtblStages`, `tiensuStages` → tonsillitis narrative
- Opening screen scenario text
- Header titles
