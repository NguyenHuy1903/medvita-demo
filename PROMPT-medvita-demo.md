<system>
Bạn là một kỹ sư frontend senior đang xây dựng một demo tương tác cho sản phẩm MedVita — công cụ hỗ trợ ghi chép bệnh án cho bác sĩ. Demo được viết bằng một file HTML duy nhất (vanilla JS + Tailwind CSS CDN), chạy hoàn toàn trên trình duyệt, không cần backend.
</system>

---

# Nhiệm vụ

Xây dựng demo tương tác MedVita theo đúng brief và kịch bản lâm sàng dưới đây. Toàn bộ nội dung transcript, dữ liệu bệnh nhân, diễn biến hội thoại và cập nhật bệnh án **phải dùng đúng kịch bản được cung cấp** — không được thay thế bằng nội dung tự tạo. Copywriting tuân thủ `<constraints>`.

---

# Bối cảnh sản phẩm

<context>
**Tên sản phẩm:** MedVita (duy nhất — không dùng "AI Assistant", "Agent", "Copilot", "Scribe" làm tên chính)

**Vấn đề cần giải quyết:** Demo cũ sai positioning — AI đang "hỏi bệnh thay bác sĩ" và chỉ auto-fill. Bác sĩ / CPO yêu cầu chuyển sang mô hình bác sĩ kiểm soát hoàn toàn.

**Câu chuyện mới:**
Bác sĩ khám bình thường → MedVita ghi nhận âm thầm → Tóm tắt có kiểm chứng → Bác sĩ ra lệnh ngắn → MedVita tạo nháp → Bác sĩ duyệt / sửa → Xuất bệnh án

**Thông điệp cốt lõi:** MedVita không yêu cầu bác sĩ thay đổi cách khám. Bác sĩ vẫn hỏi, vẫn khám, vẫn quyết định. MedVita chỉ ghi nhận, cấu trúc hóa và chuẩn bị bệnh án để bác sĩ kiểm tra nhanh hơn.

**Kịch bản demo:** Tai Mũi Họng · TRẦN VĂN MINH, Nam, 35 tuổi
**Điểm "wow" của ca bệnh:** Bệnh nhân đến vì TAI (ù tai, nghe kém) — nhưng gốc bệnh nằm ở MŨI XOANG. MedVita kết nối được chuỗi nhân quả: cơ địa dị ứng → viêm mũi dị ứng → viêm mũi xoang mạn → tắc vòi nhĩ → viêm tai giữa ứ dịch.
</context>

---

# Phân loại trường thông tin (Nhóm A / B / C)

<field_groups>
| Nhóm | Mô tả | Cách xử lý trong demo |
|---|---|---|
| **A** | Có sẵn từ HIS/LIS trước khi khám | Hiển thị sẵn ngay khi mở Phase 1, badge `Từ hệ thống` |
| **B** | Trích xuất từ hội thoại BS–BN | Cập nhật dần từng turn, badge `Chờ bác sĩ duyệt` |
| **C** | Cần phán quyết chuyên môn BS | Để trống với placeholder `[Chờ bác sĩ]`, MedVita KHÔNG điền |
</field_groups>

---

# Dữ liệu bệnh nhân — Nhóm A (hiển thị sẵn từ đầu)

<patient_data_group_a>
**I. HÀNH CHÍNH**
- Họ và tên: TRẦN VĂN MINH
- Sinh ngày: 15/03/1991 · Tuổi: 35 · Giới: Nam
- Nghề nghiệp: Nhân viên văn phòng · Dân tộc: Kinh
- Địa chỉ: P. Quang Trung, TP. Thái Nguyên
- BHYT: Có – đến 31/12/2026 · SĐT người nhà: 098xxxxxxx

**II. QUẢN LÝ NGƯỜI BỆNH**
- Ngày vào viện: 10/04/2026 09:30
- Khoa điều trị: Tai Mũi Họng · Nơi giới thiệu: Tự đến

**III. DẤU HIỆU SINH TỒN**
- Mạch: 74 l/ph · Nhiệt độ: 36.6°C · HA: 118/72 mmHg
- Nhịp thở: 17 l/ph · Cân nặng: 68 kg · Chiều cao: 170 cm

**IV. XÉT NGHIỆM ĐÃ CHỈ ĐỊNH (từ LIS)**
CTM, Glucose, Urê, Creatinin, AST/ALT · Đo thính lực đơn âm · Đo nhĩ lượng · CT Scanner mũi xoang (chưa có KQ) · Nội soi mũi xoang · ĐTĐ
</patient_data_group_a>

---

# Cấu trúc demo

## Opening Screen

```
MedVita
────────────────────────────────────────────────
Bác sĩ khám như thường lệ.
MedVita ghi nhận, cấu trúc hóa và chuẩn bị bệnh án để bác sĩ kiểm tra.

Kịch bản: Tai Mũi Họng · BN nam, 35 tuổi · Viêm mũi xoang + Viêm tai giữa ứ dịch

[Mục tiêu: giảm thời gian ghi chép, không thay đổi quyền kiểm soát của bác sĩ]

                            [Bắt đầu demo →]
```

---

## Phase 1 — Buổi khám diễn ra như thường lệ

**Header:** `MedVita — Đang ghi nhận buổi khám  |  🎙 Đang ghi âm`
**Subtext:** `Bác sĩ kiểm soát buổi khám · MedVita chỉ ghi chép và đề xuất`

### Layout (2 cột)

| Cột trái: Transcript trực tiếp | Cột phải: Bệnh án nháp |
|---|---|
| Live conversation log — 9 turns | PDF-style form với field status badges |

Cột phải **đã có sẵn dữ liệu Nhóm A** khi Phase 1 bắt đầu. Các field Nhóm B cập nhật dần sau mỗi turn.

### Tags trong transcript

| Role | Label hiển thị | Visual |
|---|---|---|
| `doctor` | Bác sĩ | Bubble xanh đậm / viền xanh |
| `patient` | Bệnh nhân | Bubble trung tính (xám nhạt) |
| `medvita_note` | MedVita ghi nhận | Bubble xanh nhạt, chữ nhỏ |
| `medvita_suggest` | MedVita đề xuất | Bubble tím nhạt + 2 CTA button |
| `medvita_typing` | MedVita đang nhập... | Typing animation + lý do |
| `system` | *(scene label)* | Centered text, font nhỏ, màu muted |

---

### Kịch bản hội thoại — 9 turns (dùng ĐÚNG nội dung này)

<scenario_turns>

**[Hệ thống] Turn 1 — BN đến vì tai**

> **Bác sĩ:** Chào anh Minh. Anh đi khám hôm nay vì vấn đề gì?

> **Bệnh nhân:** Dạ chào bác sĩ. Tôi bị ù tai phải mấy tuần nay rồi, nghe kém hẳn bên đó. Tôi làm văn phòng mà họp online không nghe rõ gì cả, phải đeo tai nghe bên trái. Tôi lo không biết có bị điếc không.

**MedVita ghi nhận:** Đã cập nhật "Lý do vào viện" — Ù tai phải + nghe kém tai phải (~vài tuần). *(🎙 Nguồn: 00:12–00:38)*

---

**[Hệ thống] Turn 2 — BS đào sâu triệu chứng tai**

> **Bác sĩ:** Cái ù tai đó, anh ù kiểu nào? Ù tiếng ve kêu hay ù ò ò như có nước?

> **Bệnh nhân:** Nó ù ò ò bác sĩ ạ, như bị bịt tai vậy. Mà lạ lắm, có lúc tôi ngáp hoặc nuốt nước bọt thì nghe hơi thông ra một chút, rồi lại bịt lại.

> **Bác sĩ:** Tai có chảy mủ, chảy nước, hay đau nhức gì không?

> **Bệnh nhân:** Không chảy gì cả. Đau thì không, chỉ tức tức trong tai thôi.

**MedVita ghi nhận:** Đã cập nhật "Triệu chứng tai" — Ù kiểu bít tắc ("ò ò, như bịt tai"). Ngáp/nuốt thoáng thông rồi bịt lại. Không chảy dịch, không đau. → Gợi ý rối loạn chức năng vòi nhĩ / viêm tai giữa ứ dịch. *(🎙 Nguồn: 00:42–01:20)*

---

**[Hệ thống] Turn 3 — BS chuyển hỏi mũi (phát hiện gốc bệnh)**

> **Bác sĩ:** Anh Minh, tôi hỏi thêm nhé. Anh có bị nghẹt mũi không? Chảy mũi?

> **Bệnh nhân:** *(ngạc nhiên)* Ơ, mũi hả bác sĩ? Tôi tưởng tôi bị tai... Mũi thì cũng có nghẹt, mà tôi nghẹt mũi quen rồi, cả năm nay rồi. Bên phải nặng hơn bên trái. Chảy mũi thì có, mũi đặc vàng xanh, nhất là sáng dậy.

> **Bác sĩ:** Anh có bị đau đầu, nặng mặt vùng má hay vùng trán không?

> **Bệnh nhân:** Có! Đau vùng má bên phải nhiều, nhất là khi cúi xuống. Có khi đau lên trán nữa. Tôi cứ tưởng đau đầu bình thường, uống paracetamol cho qua.

**MedVita ghi nhận:** Đã cập nhật "Triệu chứng mũi xoang" — Nghẹt mũi cả năm (P > T). Mũi đặc vàng xanh buổi sáng. Đau má phải tăng khi cúi, lan lên trán. BN không nhận ra liên quan giữa mũi và tai. → Gợi ý viêm mũi xoang mạn tính (bên phải ưu thế). *(🎙 Nguồn: 01:25–02:10)*

---

**[Hệ thống] Turn 4 — BS kết nối mũi → tai, hỏi dị ứng**

> **Bác sĩ:** Đấy anh, cái mũi xoang viêm lâu ngày nó làm tắc cái ống nối mũi với tai, gọi là vòi nhĩ. Tắc vòi nhĩ nên tai anh mới bị ù và nghe kém. Tôi hỏi thêm: anh có hay hắt hơi liên tục buổi sáng không? Ngứa mũi, chảy nước mắt?

> **Bệnh nhân:** Có bác sĩ ơi! Hắt hơi thì sáng nào cũng hắt hơi, có khi hắt 10–15 cái liền. Ngứa mũi, chảy nước mắt. Trời lạnh hoặc hít phải bụi là hắt hơi dữ lắm. Hồi nhỏ tôi cũng bị viêm mũi dị ứng rồi, mà lớn lên tưởng hết.

**MedVita ghi nhận:** Đã cập nhật "Dị ứng / cơ địa" — Hắt hơi liên tục sáng (10–15 cái), ngứa mũi, chảy nước mắt. Yếu tố kích phát: trời lạnh, bụi. Tiền sử VMDƯ từ nhỏ, không điều trị duy trì. → Viêm mũi dị ứng là yếu tố nền → VMX mạn → tắc vòi nhĩ → VTG ứ dịch. *(🎙 Nguồn: 02:13–02:55)*

**MedVita đề xuất:** Cân nhắc hỏi thêm về giảm khứu giác và chảy dịch mũi sau — liên quan bệnh cảnh viêm xoang nặng. `[Gợi ý câu hỏi]` `[Bỏ qua]`

---

**[Hệ thống] Turn 5 — BS hỏi giảm ngửi + chảy mũi sau**

> **Bác sĩ:** Anh có thấy giảm ngửi không? Nấu ăn, ngửi nước hoa có thấy mờ đi không?

> **Bệnh nhân:** Nói thật là có bác sĩ ạ. Vợ tôi nấu ăn mà tôi không ngửi thấy mùi, phải sát mũi vào nồi mới ngửi được. Cũng lâu rồi mà tôi không để ý.

> **Bác sĩ:** Còn nước mũi có chảy xuống họng không? Ho đờm?

> **Bệnh nhân:** Có, hay bị nước chảy xuống cổ lắm. Sáng dậy phải khạc đờm. Đờm đặc, hơi vàng.

**MedVita ghi nhận:** Đã bổ sung vào "Triệu chứng mũi xoang" — Giảm khứu giác rõ (phải sát mũi mới ngửi được), lâu ngày. Chảy dịch mũi sau, đờm đặc vàng buổi sáng. *(🎙 Nguồn: 03:02–03:40)*

---

**[Hệ thống] Turn 6 — BS hỏi tiền sử điều trị**

> **Bác sĩ:** Anh đã đi khám mũi xoang bao giờ chưa? Có chụp CT xoang lần nào không?

> **Bệnh nhân:** Cách đây 2 năm tôi có đi khám ở phòng khám tư, bác sĩ nội soi nói viêm xoang, cho thuốc uống và xịt mũi. Uống được 1 tuần thấy đỡ nên tôi ngưng. Mà rồi cũng bị lại. Chụp CT thì chưa bao giờ.

**MedVita ghi nhận:** Đã cập nhật "Điều trị trước đó" — 2 năm trước: PK tư, nội soi viêm xoang. Dùng KS + xịt mũi 1 tuần, tự ngưng khi đỡ → tái phát. Chưa chụp CT xoang. *(🎙 Nguồn: 03:45–04:15)*

---

**[Hệ thống] Turn 7 — BS hỏi tiền sử bản thân, gia đình**

> **Bác sĩ:** Anh có bệnh gì khác không? Hen suyễn, chàm da?

> **Bệnh nhân:** Hen thì không. Nhưng hồi nhỏ tôi bị chàm ở khuỷu tay, lớn lên hết rồi.

> **Bác sĩ:** Dị ứng thuốc, thức ăn?

> **Bệnh nhân:** Tôi ăn tôm hay bị nổi mề đay. Thuốc thì không.

> **Bác sĩ:** Thuốc lá, rượu bia?

> **Bệnh nhân:** Hút thuốc được 10 năm rồi bác sĩ ạ. Ngày nửa gói. Rượu bia thì uống xã giao.

> **Bác sĩ:** Gia đình có ai bị dị ứng, hen suyễn không?

> **Bệnh nhân:** Mẹ tôi bị hen. Em gái tôi cũng bị viêm mũi dị ứng.

**MedVita ghi nhận:** Đã cập nhật "Tiền sử bản thân" — Cơ địa atopy: chàm da hồi nhỏ + dị ứng tôm (mề đay) + VMDƯ. Không dị ứng thuốc. Thuốc lá: 10 năm, nửa gói/ngày (~5 pack-years). Rượu bia xã giao. "Tiền sử gia đình" — Mẹ hen suyễn. Em gái VMDƯ. → Gia đình có tiền sử atopy rõ. *(🎙 Nguồn: 04:18–05:10)*

---

**[Hệ thống] Turn 8 — BS khám thực thể**

> **Bác sĩ:** Được rồi, tôi khám cho anh nhé.
> *(Bác sĩ tiến hành nội soi mũi, soi tai, sờ cổ, nghe phổi)*
>
> Mũi: Niêm mạc nhợt, phù nề. Cuốn dưới 2 bên quá phát. Khe giữa phải có mủ đặc. Vách ngăn lệch nhẹ sang trái.
> Tai phải: Màng nhĩ lõm, mờ đục, mất nón sáng. Có mức dịch sau MN. Tai trái bình thường.
> Họng: Thành sau họng có dịch nhầy đục chảy từ trên xuống. Amidan bình thường.
> Cổ: Hạch không sờ thấy. Tim đều. Phổi trong. Bụng mềm.

**MedVita ghi nhận:** Đã cập nhật "Khám chuyên khoa TMH" — Mũi: NM nhợt phù nề, cuốn dưới quá phát 2 bên, khe giữa P mủ đặc, VN lệch nhẹ T. Tai: MN phải lõm mờ đục, mất nón sáng, mức dịch sau MN; tai T bình thường. Họng: TSH dịch nhầy đục (post-nasal drip). "Khám toàn thân" — Tỉnh, tiếp xúc tốt. Da NM hồng. Hạch (-). Tim đều. Phổi trong. Bụng mềm. *(Nguồn: ghi chú bác sĩ)*

---

**[Hệ thống] Turn 9 — BS tổng kết cho bệnh nhân**

> **Bác sĩ:** Anh Minh, tôi giải thích cho anh nhé. Anh đến vì tai, nhưng gốc vấn đề nằm ở mũi xoang. Anh bị viêm mũi dị ứng từ nhỏ, không điều trị duy trì, cộng thêm hút thuốc, nên niêm mạc mũi phù nề mãn tính, lỗ thông xoang bít → viêm xoang kéo dài. Viêm xoang lâu ngày làm tắc vòi nhĩ phải → dịch ứ trong tai giữa → ù tai, nghe kém. Muốn hết tai thì phải trị gốc ở mũi xoang trước. Chờ kết quả CT xoang và đo thính lực rồi tôi sẽ trao đổi phương án cụ thể.

> **Bệnh nhân:** Trời, vậy mà tôi cứ tưởng bị điếc. Cảm ơn bác sĩ.

**MedVita ghi nhận:** Đã tổng hợp "Tóm tắt bệnh án" — BN nam 35 tuổi, đến vì ù tai P + nghe kém vài tuần. Khai thác: nghẹt mũi P > T cả năm, mũi đặc vàng xanh, đau má P khi cúi, giảm khứu giác, chảy dịch mũi sau. VMDƯ từ nhỏ, cơ địa atopy (chàm, dị ứng tôm). GĐ atopy (mẹ hen, em gái VMDƯ). Hút thuốc 10 năm. 2 năm trước viêm xoang, bỏ thuốc sớm. Khám: NM mũi nhợt phù nề, mủ khe giữa P, VN lệch T. MN phải lõm mờ đục, dịch sau MN. TSH dịch nhầy đục. → VMX mạn / nền VMDƯ → tắc vòi nhĩ P → VTG ứ dịch P. Hướng điều trị: chờ CT xoang + đo thính lực — bác sĩ quyết định.

</scenario_turns>

---

### Kết Phase 1

Hiện summary checklist:
- ✓ Lý do vào viện
- ✓ Triệu chứng tai
- ✓ Triệu chứng mũi xoang
- ✓ Dị ứng / cơ địa atopy
- ✓ Điều trị trước đó
- ✓ Tiền sử bản thân & gia đình
- ✓ Khám thực thể TMH & toàn thân
- ✓ Tóm tắt bệnh án

*Ghi chú nhỏ: "Chẩn đoán, mã ICD-10, hướng điều trị cụ thể — chờ bác sĩ duyệt"*

**CTA:** `[Chuyển sang giai đoạn hoàn thiện bệnh án →]`

---

## Phase 2 — Bác sĩ hoàn thiện bệnh án cùng MedVita

**Header:** `MedVita — Đang hỗ trợ hoàn thiện bệnh án`
**Subtext:** `Bác sĩ ra lệnh · MedVita tạo nháp · Bác sĩ duyệt trước khi lưu`

### Mở đầu Phase 2

MedVita hiện summary card lâm sàng ngắn gọn (dựa trên tóm tắt Turn 9):
> *"VMX mạn / nền VMDƯ → tắc vòi nhĩ P → VTG ứ dịch P. Chờ CT xoang + đo thính lực."*

Bác sĩ chọn: `[Duyệt]`  `[Sửa]`  `[Đối chiếu ghi âm]`

---

### 4 Command demo — dùng đúng nội dung ca này

<phase2_commands>

**Command 1 — Bổ sung kết quả khám chuyên khoa:**

Bác sĩ gõ (giả lập lệnh thô):
> *"mũi nhợt phù nề cuốn dưới phát khe giữa P mủ VN lệch T, tai P MN lõm mờ mất nón sáng có dịch tai T bt, họng dịch nhầy đục chảy từ trên"*

MedVita tự tách, điền vào đúng field + văn phong bệnh án chuẩn, trạng thái **Chờ duyệt**:
- **Khám CK TMH → Mũi:** Niêm mạc nhợt, phù nề. Cuốn dưới quá phát 2 bên. Khe giữa phải: mủ đặc. Vách ngăn lệch nhẹ sang trái.
- **Khám CK TMH → Tai:** MN phải lõm, mờ đục, mất nón sáng, mức dịch sau MN. Tai trái bình thường.
- **Khám CK TMH → Họng:** Thành sau họng có dịch nhầy đục (post-nasal drip). Amidan bình thường.
- **Chẩn đoán sơ bộ (đề xuất):** Viêm mũi xoang mạn tính (P ưu thế) / nền viêm mũi dị ứng → Rối loạn vòi nhĩ P → Viêm tai giữa ứ dịch P. *(Chờ bác sĩ duyệt)*

*MedVita ghi chú: "Đã tách ghi chú thành 4 phần theo cơ quan. Chẩn đoán sơ bộ là đề xuất — bác sĩ duyệt trước khi lưu."*

---

**Command 2 — Sửa wording "Quá trình bệnh lý":**

Bác sĩ gõ: *"rút gọn phần quá trình bệnh lý lại"*

MedVita đề xuất bản rút gọn:
> *"Ù tai P + nghe kém ~vài tuần (kiểu bít tắc, cải thiện khi ngáp). Nghẹt mũi P > T cả năm, mũi đặc vàng xanh sáng, đau má P khi cúi, giảm ngửi, chảy dịch mũi sau. VMDƯ từ nhỏ không điều trị duy trì. Hút thuốc 10 năm (nửa gói/ngày). 2 năm trước khám PK tư: viêm xoang, dùng KS 1 tuần tự ngưng → tái phát."*

CTA: `[Áp dụng]` `[Chỉnh thêm]` `[Bỏ qua]`

---

**Command 3 — Gợi ý hoàn tất:**

Bác sĩ gõ: *"cần hoàn tất gì?"*

MedVita liệt kê các mục Nhóm C còn trống:
- ⬜ Chẩn đoán khi vào khoa *(chờ bác sĩ xác nhận — đề xuất đã có)*
- ⬜ Mã ICD-10
- ⬜ Tiên lượng
- ⬜ Hướng điều trị cụ thể *(chờ CT xoang + thính lực)*
- ⬜ Phương pháp phẫu thuật *(nếu chỉ định: FESS? Đặt ống thông khí?)*
- ⬜ Chữ ký số bác sĩ

*MedVita: "Em có thể tạo nháp cho mục nào bác sĩ muốn. Các mục cần phán quyết chuyên môn em sẽ để trống chờ bác sĩ điền trực tiếp."*

---

**Command 4 — Bác sĩ trực tiếp edit field "Chẩn đoán sơ bộ":**

Bác sĩ bấm icon ✎ trên field → Field hiện viền xanh + label `"Đang chỉnh sửa bởi bác sĩ"` → Bác sĩ sửa thành chẩn đoán chính thức → Nút `[Lưu]` / `[Hủy]`

Sau khi lưu: field chuyển badge `Đã chỉnh sửa bởi bác sĩ` (xanh dương nhạt).

</phase2_commands>

### Kết Phase 2

MedVita xác nhận: *"Tất cả nội dung đã được bác sĩ duyệt hoặc chỉnh sửa. Bệnh án sẵn sàng xuất."*

**CTA:** `[Xuất bệnh án]`

---

# Hệ thống trạng thái field

<field_status_system>
| Status key | Label hiển thị | Màu nền badge |
|---|---|---|
| `system` | Từ hệ thống (HIS/LIS) | Xám nhạt `#F3F4F6` |
| `pending` | Chờ bác sĩ duyệt | Vàng nhạt `#FEF9C3` |
| `approved` | Đã duyệt bởi bác sĩ | Xanh lá nhạt `#DCFCE7` |
| `edited` | Đã chỉnh sửa bởi bác sĩ | Xanh dương nhạt `#DBEAFE` |
| `agent_draft` | MedVita đề xuất | Tím nhạt `#EDE9FE` |
| `waiting` | Chờ bác sĩ | Đỏ nhạt `#FEE2E2`, placeholder `[Chờ bác sĩ]` |

Metadata schema mỗi field:
```json
{
  "source": "his_lis" | "recording" | "doctor_command" | "medvita_suggestion",
  "status": "system" | "pending" | "approved" | "edited" | "waiting",
  "timestamp": "02:13–02:48"
}
```

Mỗi field từ ghi âm phải có icon 🎙 + timestamp nguồn để tăng trust và khả năng kiểm chứng.
Mỗi field Nhóm C phải hiển thị `[Chờ bác sĩ]` — không bao giờ có nội dung tự sinh.
</field_status_system>

---

# Constraints

<constraints>

## Tên sản phẩm
- Chỉ dùng "MedVita" — không dùng "AI Assistant", "Agent", "Copilot", "Scribe" làm tên chính
- "AI" chỉ xuất hiện trong mô tả trạng thái kỹ thuật nếu thực sự cần

## Nội dung kịch bản
- **Phải dùng đúng** tên bệnh nhân, hội thoại, và dữ liệu lâm sàng đã cung cấp trong `<scenario_turns>` và `<patient_data_group_a>`
- Không được thay bằng nội dung placeholder hoặc lorem ipsum
- Phase 2 commands phải dùng đúng nội dung từ ca bệnh này

## Tone & Copywriting

**Dùng:**
- "MedVita ghi nhận…", "Đã cập nhật…", "MedVita đề xuất…"
- "Chờ bác sĩ duyệt…", "Theo dõi…", "Cân nhắc…"
- "Đã tách ghi chú thành N phần" *(luôn nêu lý do)*

**Tuyệt đối tránh:**
- "Chẩn đoán là…" (dùng "Gợi ý / Đề xuất chẩn đoán")
- "Cần điều trị…"
- "Độ tin cậy 96%"
- Mã ICD-10 chắc nịch không kèm "đề xuất" / "cân nhắc"
- Bất kỳ ngôn ngữ nào ngụ ý MedVita ra quyết định thay bác sĩ

## Quy tắc hành vi MedVita
1. Mọi hành động kèm lý do rõ ràng
2. Không bao giờ auto-finalize — luôn có bước bác sĩ duyệt
3. Nội dung luôn là "Bệnh án nháp" cho đến khi bác sĩ chủ động duyệt
4. Mọi field từ ghi âm phải có timestamp nguồn
5. Nhóm C (chẩn đoán, ICD, tiên lượng, PP PT) — MedVita KHÔNG tự điền, chỉ đề xuất kèm CTA duyệt
6. Bác sĩ có thể bỏ qua bất kỳ gợi ý nào

</constraints>

---

# Output yêu cầu

Tạo một file `demo.html` duy nhất:
- Vanilla JavaScript (không dùng framework)
- Tailwind CSS via CDN
- Hoạt động hoàn toàn offline sau khi load
- Animated step-by-step: 9 turns tự chạy với delay tự nhiên, có nút Pause/Resume
- Responsive tốt trên màn hình 1280px+
- Dùng Inter hoặc font sans-serif sạch

**Luồng:** Opening Screen → Phase 1 (9 turns tự chạy, bệnh án cập nhật song song) → Transition + summary checklist → Phase 2 (4 command demo, có thể click từng command).
