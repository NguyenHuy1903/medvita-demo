# DEMO KỊCH BẢN: AI KHAI THÁC BỆNH SỬ TẠI NHÀ – KHOA TAI MŨI HỌNG
## Ca bệnh: Viêm amidan mãn tính + VA tồn dư | Nữ, 48 tuổi
### Mô hình: AI hỏi bệnh nhân tại nhà (pre-visit intake) → Tổng hợp thông tin trước khi đến viện

---

## PHÂN LOẠI TRƯỜNG THÔNG TIN

| Nhóm | Mô tả | Cách xử lý |
|------|--------|------------|
| **A – AI tự điền** | Lấy từ HIS/LIS, có sẵn khi mở app | Hiển thị sẵn, BS chỉnh nếu cần |
| **B – AI đề xuất, BS duyệt** | Trích từ hội thoại AI–BN | Cập nhật dần từng turn |
| **C – BS tự điền** | Cần phán quyết chuyên môn | AI KHÔNG điền, để trống chờ BS |

---

## TRẠNG THÁI BAN ĐẦU (Trước khi bắt đầu hội thoại)

### 🟢 NHÓM A – Đã có sẵn từ HIS/LIS

```
I. HÀNH CHÍNH
─────────────────────────────────────────────
Họ và tên       : NGUYỄN THỊ HỒNG
Sinh ngày       : 09/09/1977        Tuổi: 48
Giới            : Nữ
Nghề nghiệp     : Công nhân
Dân tộc         : Tày
Địa chỉ         : Xã Hóa Thượng, Đồng Hỷ, Thái Nguyên
CCCD            : 019xxxxxxxxx
BHYT            : Có – đến 31/12/2026
SĐT người nhà   : 019xxxxxxx

II. QUẢN LÝ NGƯỜI BỆNH
─────────────────────────────────────────────
Ngày vào viện   : 03/04/2026  11:15
Khoa điều trị   : Tai Mũi Họng
Giường           : KH047
Nơi giới thiệu  : Cơ quan y tế (BV Đồng Hỷ)
Vào viện lần thứ: (chưa rõ)

III. DẤU HIỆU SINH TỒN (nhập từ thiết bị/điều dưỡng)
─────────────────────────────────────────────
Mạch            : 78 lần/ph
Nhiệt độ        : 36.8°C
Huyết áp        : 120/75 mmHg
Nhịp thở        : 18 lần/ph
Cân nặng        : 55 kg

IV. XÉT NGHIỆM (lấy từ LIS – đã chỉ định)
─────────────────────────────────────────────
- Tổng phân tích tế bào máu ngoại vi
- Glucose, Urê, Creatinin máu
- AST (GOT), ALT (GPT)
- Điện giải đồ (Na, K, Cl)
- PT, APTT, Fibrinogen
- Nhóm máu ABO, Rh(D)
- HBsAg, HIV Ab, HCV Ab (test nhanh)
- T3, FT4, TSH
- Tổng phân tích nước tiểu
- Đo thính lực đơn âm, đo nhĩ lượng, đo phản xạ cơ bàn đạp
- Điện tim thường
- Xquang ngực thẳng
- Khám Nội (hội chẩn)
```

### 🟡 NHÓM B – Chờ khai thác qua hội thoại

```
── AI khai thác qua hội thoại với BN tại nhà ──
Lý do vào viện          : [chờ khai thác]
Quá trình bệnh lý      : [chờ khai thác]
Tiền sử bản thân       : [chờ khai thác]
Tiền sử gia đình       : [chờ khai thác]
Thói quen (thuốc lá, rượu bia, dị ứng): [chờ khai thác]

── BS khám trực tiếp tại viện (AI ghi nhận từ lời BS) ──
Khám toàn thân          : [chờ BS khám tại viện]
Khám chuyên khoa TMH    : [chờ BS khám tại viện]
Khám các cơ quan        : [chờ BS khám tại viện]

── AI tổng hợp sau khi có đủ thông tin ──
Tóm tắt bệnh án        : [tự động tổng hợp]
Hướng điều trị ban đầu  : [đề xuất sau khám]
```

### 🔴 NHÓM C – AI KHÔNG điền (chờ BS)

```
Chẩn đoán khi vào khoa  : [CHỜ BS ĐIỀN]
Chẩn đoán ra viện       : [CHỜ BS ĐIỀN]
Chẩn đoán trước PT      : [CHỜ BS ĐIỀN]
Chẩn đoán sau PT        : [CHỜ BS ĐIỀN]
Mã ICD-10               : [CHỜ BS ĐIỀN]
Tiên lượng              : [CHỜ BS ĐIỀN]
PP phẫu thuật/vô cảm    : [CHỜ BS ĐIỀN]
Tên phẫu thuật viên     : [CHỜ BS ĐIỀN]
Biến chứng/tai biến     : [CHỜ BS ĐIỀN]
Kết quả giải phẫu bệnh : [CHỜ BS ĐIỀN]
Tình trạng ra viện      : [CHỜ BS ĐIỀN]
Chữ ký số               : [CHỜ BS ĐIỀN]
```

---

## HỘI THOẠI KHAI THÁC BỆNH SỬ

---

### 🔄 TURN 1

**🤖 BS (AI):**
> Chào chị Hồng, em là trợ lý AI y tế của bệnh viện. Trước khi chị đến khám, em muốn hỏi chị một số câu để bác sĩ nắm trước tình hình. Chị vào viện lần này vì lý do gì ạ?

**🧑 BN:**
> Tôi bị nuốt vướng, cảm giác có cái gì chặn ở cổ họng, khó chịu lắm.

**📋 SUMMARY CẬP NHẬT:**
```diff
+ Lý do vào viện: Nuốt vướng
```

---

### 🔄 TURN 2

**🤖 BS (AI):**
> Nuốt vướng này chị bắt đầu từ khi nào, và có tăng dần không ạ?

**🧑 BN:**
> Ôi nó lâu lắm rồi bác sĩ ơi. Mà trước thì tôi hay bị đau họng hơn, cứ vài tháng lại sốt, đau rát cổ, ra hiệu thuốc mua kháng sinh uống thì đỡ, rồi vài tháng sau lại bị lại. Năm ngoái chắc phải đến 5-6 lần. Mà đợt này thì nó khác, cái vướng nó tăng lên, nuốt cơm cũng thấy nghẹn nghẹn, tôi sợ nên chưa dám uống thuốc gì, đi khám luôn.

**📋 SUMMARY CẬP NHẬT:**
```diff
  Lý do vào viện: Nuốt vướng
+ Quá trình bệnh lý: Đau họng tái phát nhiều năm, khoảng 5-6 đợt/năm kèm sốt.
+   Tự mua kháng sinh điều trị từng đợt, khỏi rồi tái lại.
+   Đợt này nuốt vướng tăng rõ (nghẹn khi ăn), chưa dùng thuốc.
```

---

### 🔄 TURN 3

**🤖 BS (AI):**
> Chị nói nuốt nghẹn tăng lên – vậy chị có thấy giọng nói thay đổi, hoặc người nhà phản ánh chị ngủ ngáy to không ạ?

**🧑 BN:**
> À giọng thì bình thường, mà ngủ ngáy thì có. Chồng tôi cứ kêu ca hoài, nói tôi ngáy to như đàn ông, đêm nào cũng vậy. Mà thỉnh thoảng tôi hay giật mình tỉnh dậy, thấy tức ngực khó thở. Tôi cứ nghĩ tại mệt, đi làm ca đêm về mệt nên thế.

**📋 SUMMARY CẬP NHẬT:**
```diff
  Lý do vào viện: Nuốt vướng
  Quá trình bệnh lý: Đau họng tái phát nhiều năm, khoảng 5-6 đợt/năm kèm sốt.
    Tự mua kháng sinh điều trị từng đợt, khỏi rồi tái lại.
    Đợt này nuốt vướng tăng rõ (nghẹn khi ăn), chưa dùng thuốc.
+   Ngủ ngáy to hàng đêm, thỉnh thoảng giật mình tỉnh giấc kèm tức ngực, khó thở.
+   Giọng nói chưa thay đổi.
```

---

### 🔄 TURN 4

**🤖 BS (AI):**
> Trước khi đến đây, chị có đi khám hoặc điều trị ở cơ sở y tế nào không ạ?

**🧑 BN:**
> Có, tuần trước tôi xuống bệnh viện huyện Đồng Hỷ khám. Bác sĩ ở dưới sờ cổ tôi rồi cho đi siêu âm, nói là có cục gì đó ở tuyến giáp, cái gì ti-rát mấy mấy gì đó, tôi không nhớ rõ. Rồi bác sĩ nói nặng quá chuyển lên tuyến trên. Tôi cũng không biết cục đó có liên quan đến cái nuốt vướng không nữa.

**📋 SUMMARY CẬP NHẬT:**
```diff
  Quá trình bệnh lý: Đau họng tái phát nhiều năm, khoảng 5-6 đợt/năm kèm sốt.
    Tự mua kháng sinh điều trị từng đợt, khỏi rồi tái lại.
    Đợt này nuốt vướng tăng rõ (nghẹn khi ăn), chưa dùng thuốc.
    Ngủ ngáy to hàng đêm, thỉnh thoảng giật mình tỉnh giấc kèm tức ngực, khó thở.
    Giọng nói chưa thay đổi.
+   Khám tại BV Đồng Hỷ: siêu âm tuyến giáp phát hiện nhân tuyến giáp
+   (BN mô tả "TIRADS mấy mấy" – cần đối chiếu giấy chuyển viện).
+   Chuyển BV TW Thái Nguyên điều trị tiếp.
```

> *(📌 Ghi chú hệ thống: AI đối chiếu giấy chuyển viện từ HIS → cập nhật chính xác:
> nhân thùy phải TIRADS 1, nhân thùy trái TIRADS 3)*

**📋 SUMMARY CẬP NHẬT (sau đối chiếu HIS):**
```diff
- Khám tại BV Đồng Hỷ: siêu âm tuyến giáp phát hiện nhân tuyến giáp
-   (BN mô tả "TIRADS mấy mấy" – cần đối chiếu giấy chuyển viện).
+ Khám tại BV Đồng Hỷ: SÂ tuyến giáp phát hiện nhân thùy phải (TIRADS 1),
+   nhân thùy trái (TIRADS 3). Chuyển BV TW Thái Nguyên.
```

---

### 🔄 TURN 5

**🤖 BS (AI):**
> Chị trước đây có mắc bệnh gì khác không? Tiểu đường, huyết áp, hay từng phải nằm viện, mổ xẻ gì chưa ạ?

**🧑 BN:**
> Không, tôi khỏe lắm, chưa mổ bao giờ. Tiểu đường huyết áp gì thì không. Mà bác sĩ ơi, tôi hay bị đau bụng trên này, ợ chua, nhất là ăn cay xong là khó chịu, nhưng chắc không liên quan đâu nhỉ?

**🤖 BS (AI) – hỏi lại:**
> Cái đau bụng ợ chua đó cũng quan trọng đấy chị ạ. Chị bị lâu chưa? Có đi khám dạ dày bao giờ chưa?

**🧑 BN:**
> Cũng cả năm rồi, tôi hay uống nghệ mật ong thôi chứ chưa đi khám.

**📋 SUMMARY CẬP NHẬT:**
```diff
+ Tiền sử bản thân: Không có tiền sử phẫu thuật.
+   Không có tiểu đường, tăng huyết áp.
+   Phát triển thể lực bình thường.
+   Có triệu chứng đau thượng vị, ợ chua khi ăn cay (~1 năm),
+   chưa khám/điều trị chuyên khoa tiêu hóa.
```

---

### 🔄 TURN 6

**🤖 BS (AI):**
> Chị có bị dị ứng gì không ạ? Thuốc hay thức ăn gì?

**🧑 BN:**
> Không, tôi không bị dị ứng gì cả.

**📋 SUMMARY CẬP NHẬT:**
```diff
  Tiền sử bản thân: Không có tiền sử phẫu thuật.
    Không có tiểu đường, tăng huyết áp.
    Phát triển thể lực bình thường.
+ Dị ứng: Không
```

---

### 🔄 TURN 7

**🤖 BS (AI):**
> Chị có hút thuốc lá không? Rượu bia thì sao ạ?

**🧑 BN:**
> Thuốc lá thì không đâu. Rượu bia à, tôi không uống... Mà thật ra đi đám cưới, liên hoan công ty thì cũng uống, nhưng ít thôi, mỗi lần một hai lon bia. Chắc tháng 1-2 lần gì đó.

**📋 SUMMARY CẬP NHẬT:**
```diff
+ Thói quen:
+   Thuốc lá: Không
+   Thuốc lào: Không
+   Rượu bia: Có uống xã giao (1-2 lon bia/lần, 1-2 lần/tháng)
+   Ma túy: Không
```

---

### 🔄 TURN 8

**🤖 BS (AI):**
> Trong gia đình chị, bố mẹ anh chị em có ai bị bệnh mãn tính, hoặc bệnh về họng, tuyến giáp không ạ?

**🧑 BN:**
> Bố tôi bị huyết áp, uống thuốc lâu rồi. Mẹ thì khỏe. À mà chị gái tôi cũng hay viêm họng lắm, hồi trước chị ấy cũng phải cắt cái amidan gì đó, chắc cách đây 5-6 năm.

**📋 SUMMARY CẬP NHẬT:**
```diff
+ Tiền sử gia đình: Bố bị tăng huyết áp (đang điều trị).
+   Chị gái có tiền sử cắt amidan (~5-6 năm trước).
+   Mẹ khỏe, không ghi nhận bệnh lý tuyến giáp trong gia đình.
```

---

### 🔄 TURN 9

**🤖 BS (AI):**
> Em hỏi thêm về vùng tai mũi nhé. Chị có bị nghẹt mũi, chảy mũi, hay ngửi kém không? Còn tai thì chị có thấy ù tai, nghe kém, hoặc đau tai khi nuốt không ạ?

**🧑 BN:**
> Mũi thì bình thường, không nghẹt gì. Tai cũng không ù, nghe bình thường. Mà có lúc đợt đau họng nặng thì tôi thấy đau nhói lên tai, nhưng hết đau họng thì hết luôn.

**📋 SUMMARY CẬP NHẬT:**
```diff
+ Triệu chứng tai: Không ù tai, không nghe kém.
+   Có đau nhói lan lên tai trong đợt viêm họng cấp (referred otalgia).
+ Triệu chứng mũi: Không nghẹt mũi, không chảy mũi, không giảm khứu giác.
```

---

### 🔄 TURN 10

**🤖 BS (AI):**
> Chị có hay bị hôi miệng không? Và khi đau họng, chị có ho nhiều không, ho có đờm không ạ?

**🧑 BN:**
> Hôi miệng thì chồng tôi có nói, nhất là sáng ngủ dậy, đánh răng rồi vẫn hôi. Tôi cũng ngại lắm. Ho thì thỉnh thoảng, nhất là ban đêm, ho có đờm nhầy trắng, nhưng không nhiều.

**📋 SUMMARY CẬP NHẬT:**
```diff
+ Triệu chứng khác:
+   Hơi thở hôi dai dẳng (kể cả sau vệ sinh răng miệng).
+   Ho khan/đờm nhầy trắng về đêm, mức độ nhẹ.
```

---

### 🔄 TURN 11 (AI tự động tổng hợp)

**🤖 BS (AI):**
> Cảm ơn chị Hồng đã chia sẻ. Em đã ghi nhận đầy đủ thông tin. Bác sĩ sẽ khám trực tiếp cho chị khi vào viện. Dưới đây là tóm tắt những gì chị đã chia sẻ.

**📋 SUMMARY CẬP NHẬT:**
```diff
+ Tóm tắt bệnh sử (AI tổng hợp từ hội thoại):
+   Bệnh nhân nữ, 48 tuổi, đến viện với lý do nuốt vướng.
+   Bệnh sử: đau họng sốt tái lại ~5-6 đợt/năm, tự mua kháng sinh điều trị.
+   Đợt này nuốt vướng tăng rõ (nghẹn khi ăn), kèm ngủ ngáy to hàng đêm,
+   giật mình tỉnh giấc khó thở khi ngủ. Giọng nói chưa thay đổi.
+   Hơi thở hôi dai dẳng. Ho đờm nhầy trắng về đêm (nhẹ).
+   Đau nhói lan lên tai trong đợt viêm họng cấp. Tai mũi không triệu chứng khác.
+   TS bản thân: đau thượng vị ợ chua khi ăn cay ~1 năm, chưa khám tiêu hóa.
+   TS gia đình: bố THA, chị gái cắt amidan.
+   Khám BV Đồng Hỷ: SÂ tuyến giáp → nhân thùy phải TIRADS 1,
+   nhân thùy trái TIRADS 3 → chuyển tuyến trên.
+
+ ⚠️ CÁC MỤC CHỜ BÁC SĨ KHÁM TRỰC TIẾP TẠI VIỆN:
+   Khám toàn thân, khám chuyên khoa TMH (vòm/họng/tai/mũi),
+   khám các cơ quan (tuần hoàn, hô hấp, tiêu hóa, thận-TN, thần kinh, CXK, da).
+   → Sẽ được cập nhật khi bác sĩ khám tại viện.
```

---

## TRẠNG THÁI CUỐI CÙNG SAU KHAI THÁC

### 🟢 NHÓM A – Không thay đổi (đã có sẵn)
*(giữ nguyên như ban đầu)*

### 🟡 NHÓM B – Đã được AI điền (từ hội thoại), chờ BS duyệt

```
═══ PHẦN AI ĐÃ KHAI THÁC QUA HỘI THOẠI ═══

Lý do vào viện     : Nuốt vướng
Vào ngày thứ mấy   : 1

Quá trình bệnh lý  : Đau họng tái phát nhiều năm, khoảng 5-6 đợt/năm kèm sốt.
                      Tự mua kháng sinh điều trị từng đợt, khỏi rồi tái lại.
                      Đợt này nuốt vướng tăng rõ (nghẹn khi ăn), chưa dùng thuốc.
                      Ngủ ngáy to hàng đêm, giật mình tỉnh giấc kèm tức ngực, khó thở.
                      Giọng nói chưa thay đổi. Hơi thở hôi dai dẳng.
                      Ho đờm nhầy trắng về đêm (nhẹ).
                      Đau nhói lan lên tai trong đợt viêm họng cấp.
                      Tai mũi không triệu chứng khác.
                      Khám BV Đồng Hỷ: SÂ tuyến giáp → nhân thùy phải (TIRADS 1),
                      nhân thùy trái (TIRADS 3) → chuyển BV TW Thái Nguyên.

Tiền sử bản thân   : Không tiền sử PT. Không TĐ, THA.
                      Phát triển thể lực bình thường.
                      Đau thượng vị, ợ chua khi ăn cay ~1 năm, chưa khám tiêu hóa.
Dị ứng              : Không
Thói quen           : Thuốc lá: Không | Rượu bia: Xã giao 1-2 lon/lần, 1-2 lần/tháng
                      | Ma túy: Không
Tiền sử gia đình   : Bố THA (đang điều trị). Chị gái cắt amidan (~5-6 năm trước).
                      Mẹ khỏe. Không bệnh lý tuyến giáp gia đình.

═══ PHẦN CHỜ BÁC SĨ KHÁM TRỰC TIẾP TẠI VIỆN (AI chưa điền) ═══

Khám toàn thân      : [CHỜ BS KHÁM]
Khám chuyên khoa TMH:
  Vòm               : [CHỜ BS KHÁM]
  Họng              : [CHỜ BS KHÁM]
  Tai               : [CHỜ BS KHÁM]
  Mũi               : [CHỜ BS KHÁM]
Khám các cơ quan     :
  Tuần hoàn         : [CHỜ BS KHÁM]
  Hô hấp            : [CHỜ BS KHÁM]
  Tiêu hóa          : [CHỜ BS KHÁM]
  Thận-TN           : [CHỜ BS KHÁM]
  Thần kinh         : [CHỜ BS KHÁM]
  CXK               : [CHỜ BS KHÁM]
  Da-mô dưới da     : [CHỜ BS KHÁM]

Tóm tắt bệnh án    : [Tự động tổng hợp sau khi BS khám xong]
Hướng điều trị      : [Đề xuất sau khi BS khám xong]
```

### 🔴 NHÓM C – AI KHÔNG điền (toàn bộ chờ BS)

```
Chẩn đoán khi vào khoa  : [CHỜ BS ĐIỀN]
  + Bệnh chính           : [CHỜ BS ĐIỀN]  → VD: Viêm amidan mãn tính (J35.0)
  + Bệnh kèm theo        : [CHỜ BS ĐIỀN]  → VD: U lành tuyến giáp (D34); Phì đại VA
  + Phân biệt            : [CHỜ BS ĐIỀN]
Chẩn đoán trước PT      : [CHỜ BS ĐIỀN]
Chẩn đoán sau PT        : [CHỜ BS ĐIỀN]
Mã ICD-10               : [CHỜ BS ĐIỀN]
Tiên lượng              : [CHỜ BS ĐIỀN]  → VD: Khá
PP phẫu thuật           : [CHỜ BS ĐIỀN]
PP vô cảm               : [CHỜ BS ĐIỀN]
Tên PTV / BS gây mê     : [CHỜ BS ĐIỀN]
Biến chứng              : [CHỜ BS ĐIỀN]
Tai biến                : [CHỜ BS ĐIỀN]
Kết quả giải phẫu bệnh : [CHỜ BS ĐIỀN]
Tình trạng BN ra viện   : [CHỜ BS ĐIỀN]
Ngày ra viện             : [CHỜ BS ĐIỀN]
Tổng số ngày điều trị   : [CHỜ BS ĐIỀN]
Chữ ký số BS làm BA     : [CHỜ BS ĐIỀN]
Chữ ký số BS điều trị   : [CHỜ BS ĐIỀN]
```

---

## GHI CHÚ KỸ THUẬT

1. **Format output**: Mỗi turn gồm 3 phần: `BS (AI) → BN → Summary Update`
2. **Summary update**: Chỉ hiển thị phần thay đổi/thêm mới (dùng `diff` format với dấu `+`)
3. **Nhóm A**: Pre-populated trước khi conversation bắt đầu, không thay đổi trong quá trình khai thác
4. **Nhóm B chia 2 giai đoạn**:
   - **Giai đoạn 1 – AI khai thác tại nhà** (demo này): Lý do vào viện, QTBL, tiền sử, thói quen, gia đình, triệu chứng TMH qua hỏi
   - **Giai đoạn 2 – BS khám tại viện** (ngoài scope demo): Khám toàn thân, chuyên khoa TMH, các cơ quan → AI ghi nhận từ lời BS
5. **Nhóm C**: Luôn hiển thị `[CHỜ BS ĐIỀN]`, AI không bao giờ tự điền
6. **AI KHÔNG khám bệnh**: Đây là AI khai thác bệnh sử tại nhà, không thể khám thực thể. Thay vào đó, AI hỏi triệu chứng screening (tai, mũi, họng, ho, hôi miệng...) để chuẩn bị thông tin cho BS
7. **Ca bệnh tham khảo**: Dựa trên dữ liệu thật từ BV TW Thái Nguyên, khoa TMH, MABN 14107353

### Điểm thể hiện AI thông minh trong demo:
- **Turn 2**: BN nói lộn xộn ("ra hiệu thuốc mua kháng sinh", "nghẹn nghẹn") → AI vẫn tách đúng: tần suất, cách tự điều trị, mức độ hiện tại
- **Turn 3**: AI chủ động hỏi ngủ ngáy/giọng nói dựa trên ngữ cảnh nuốt vướng (suy luận lâm sàng: amidan quá phát → bít tắc đường thở)
- **Turn 4**: BN không nhớ rõ "ti-rát mấy mấy" → AI ghi nhận tạm, rồi đối chiếu HIS để cập nhật chính xác TIRADS
- **Turn 5**: BN kể đau bụng ợ chua "chắc không liên quan" → AI nhận ra có thể liên quan (GERD gây kích ứng họng mạn tính) và hỏi lại thêm
- **Turn 7**: BN ban đầu nói "không uống" rồi thêm chi tiết → AI ghi đúng mức độ thực tế
- **Turn 8**: BN nhớ ra chị gái cắt amidan → AI ghi nhận tiền sử gia đình TMH (yếu tố liên quan)
- **Turn 9**: AI hỏi screening tai-mũi theo evidence-based (referred otalgia, nghẹt mũi, khứu giác) – thay vì khám thực thể
- **Turn 10**: AI hỏi hôi miệng (dấu hiệu sỏi amidan/viêm amidan hốc mủ) và ho đờm (biến chứng xuống đường hô hấp)
