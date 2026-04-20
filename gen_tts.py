"""
Gen TTS toàn bộ kịch bản demo TMH
- Giọng bác sĩ (AI): Charon – trầm ấm, informative → nam
- Giọng bệnh nhân: Aoede – breezy, tự nhiên → nữ 48 tuổi
Output: thư mục audio/
"""

import wave, time, os
from google import genai
from google.genai import types

API_KEY   = "AIzaSyAM1S0_RP994SoPYwVnAg21YSas-yWKwM8"
OUT_DIR   = "audio"
BS_VOICE  = "Charon"   # Informative – bác sĩ nam
BN_VOICE  = "Aoede"    # Breezy – bệnh nhân nữ

# ── Toàn bộ kịch bản ──────────────────────────────────────────────────────────
# Format: (tên file, giọng, nội dung)
SCRIPTS = [
    # Turn 1 ──────────────────────────────────────────────────────
    ("t01_bs_chao_hoi_ly_do",
     BS_VOICE,
     "Chào chị Hồng, em là trợ lý AI y tế của bệnh viện. "
     "Trước khi chị đến khám, em muốn hỏi chị một số câu để bác sĩ nắm trước tình hình. "
     "Chị vào viện lần này vì lý do gì ạ?"),

    ("t01_bn_nuot_vuong",
     BN_VOICE,
     "Tôi bị nuốt vướng, cảm giác có cái gì chặn ở cổ họng, khó chịu lắm."),

    # Turn 2 ──────────────────────────────────────────────────────
    ("t02_bs_hoi_thoi_gian_muc_do",
     BS_VOICE,
     "Nuốt vướng này chị bắt đầu từ khi nào, và có tăng dần không ạ?"),

    ("t02_bn_benh_su_dau_hong_tai_phat",
     BN_VOICE,
     "Ôi nó lâu lắm rồi bác sĩ ơi. Mà trước thì tôi hay bị đau họng hơn, "
     "cứ vài tháng lại sốt, đau rát cổ, ra hiệu thuốc mua kháng sinh uống thì đỡ, "
     "rồi vài tháng sau lại bị lại. Năm ngoái chắc phải đến 5-6 lần. "
     "Mà đợt này thì nó khác, cái vướng nó tăng lên, nuốt cơm cũng thấy nghẹn nghẹn, "
     "tôi sợ nên chưa dám uống thuốc gì, đi khám luôn."),

    # Turn 3 ──────────────────────────────────────────────────────
    ("t03_bs_hoi_giong_noi_ngu_ngay",
     BS_VOICE,
     "Chị nói nuốt nghẹn tăng lên – vậy chị có thấy giọng nói thay đổi, "
     "hoặc người nhà phản ánh chị ngủ ngáy to không ạ?"),

    ("t03_bn_ngu_ngay_tuc_nguc_kho_tho",
     BN_VOICE,
     "À giọng thì bình thường, mà ngủ ngáy thì có. Chồng tôi cứ kêu ca hoài, "
     "nói tôi ngáy to như đàn ông, đêm nào cũng vậy. "
     "Mà thỉnh thoảng tôi hay giật mình tỉnh dậy, thấy tức ngực khó thở. "
     "Tôi cứ nghĩ tại mệt, đi làm ca đêm về mệt nên thế."),

    # Turn 4 ──────────────────────────────────────────────────────
    ("t04_bs_hoi_da_kham_truoc_chua",
     BS_VOICE,
     "Trước khi đến đây, chị có đi khám hoặc điều trị ở cơ sở y tế nào không ạ?"),

    ("t04_bn_kham_bv_dong_hy_tuyen_giac",
     BN_VOICE,
     "Có, tuần trước tôi xuống bệnh viện huyện Đồng Hỷ khám. "
     "Bác sĩ ở dưới sờ cổ tôi rồi cho đi siêu âm, nói là có cục gì đó ở tuyến giáp, "
     "cái gì ti-rát mấy mấy gì đó, tôi không nhớ rõ. "
     "Rồi bác sĩ nói nặng quá chuyển lên tuyến trên. "
     "Tôi cũng không biết cục đó có liên quan đến cái nuốt vướng không nữa."),

    # Turn 5a ─────────────────────────────────────────────────────
    ("t05a_bs_hoi_tien_su_benh",
     BS_VOICE,
     "Chị trước đây có mắc bệnh gì khác không? "
     "Tiểu đường, huyết áp, hay từng phải nằm viện, mổ xẻ gì chưa ạ?"),

    ("t05a_bn_khoe_chua_mo_dau_bung_thuong_vi",
     BN_VOICE,
     "Không, tôi khỏe lắm, chưa mổ bao giờ. Tiểu đường huyết áp gì thì không. "
     "Mà bác sĩ ơi, tôi hay bị đau bụng trên này, ợ chua, "
     "nhất là ăn cay xong là khó chịu, nhưng chắc không liên quan đâu nhỉ?"),

    # Turn 5b (AI hỏi lại về dạ dày) ─────────────────────────────
    ("t05b_bs_hoi_them_ve_dau_bung",
     BS_VOICE,
     "Cái đau bụng ợ chua đó cũng quan trọng đấy chị ạ. "
     "Chị bị lâu chưa? Có đi khám dạ dày bao giờ chưa?"),

    ("t05b_bn_chua_kham_dung_nghe_mat_ong",
     BN_VOICE,
     "Cũng cả năm rồi, tôi hay uống nghệ mật ong thôi chứ chưa đi khám."),

    # Turn 6 ──────────────────────────────────────────────────────
    ("t06_bs_hoi_di_ung",
     BS_VOICE,
     "Chị có bị dị ứng gì không ạ? Thuốc hay thức ăn gì?"),

    ("t06_bn_khong_di_ung",
     BN_VOICE,
     "Không, tôi không bị dị ứng gì cả."),

    # Turn 7 ──────────────────────────────────────────────────────
    ("t07_bs_hoi_thuoc_la_ruou_bia",
     BS_VOICE,
     "Chị có hút thuốc lá không? Rượu bia thì sao ạ?"),

    ("t07_bn_khong_hut_thuoc_bia_xa_giao",
     BN_VOICE,
     "Thuốc lá thì không đâu. Rượu bia à, tôi không uống... "
     "Mà thật ra đi đám cưới, liên hoan công ty thì cũng uống, "
     "nhưng ít thôi, mỗi lần một hai lon bia. Chắc tháng 1-2 lần gì đó."),

    # Turn 8 ──────────────────────────────────────────────────────
    ("t08_bs_hoi_tien_su_gia_dinh",
     BS_VOICE,
     "Trong gia đình chị, bố mẹ anh chị em có ai bị bệnh mãn tính, "
     "hoặc bệnh về họng, tuyến giáp không ạ?"),

    ("t08_bn_bo_huyet_ap_chi_gai_cat_amidan",
     BN_VOICE,
     "Bố tôi bị huyết áp, uống thuốc lâu rồi. Mẹ thì khỏe. "
     "À mà chị gái tôi cũng hay viêm họng lắm, "
     "hồi trước chị ấy cũng phải cắt cái amidan gì đó, chắc cách đây 5-6 năm."),

    # Turn 9 ──────────────────────────────────────────────────────
    ("t09_bs_hoi_tai_mui",
     BS_VOICE,
     "Em hỏi thêm về vùng tai mũi nhé. "
     "Chị có bị nghẹt mũi, chảy mũi, hay ngửi kém không? "
     "Còn tai thì chị có thấy ù tai, nghe kém, hoặc đau tai khi nuốt không ạ?"),

    ("t09_bn_tai_mui_ok_dau_nhoi_len_tai",
     BN_VOICE,
     "Mũi thì bình thường, không nghẹt gì. Tai cũng không ù, nghe bình thường. "
     "Mà có lúc đợt đau họng nặng thì tôi thấy đau nhói lên tai, "
     "nhưng hết đau họng thì hết luôn."),

    # Turn 10 ─────────────────────────────────────────────────────
    ("t10_bs_hoi_hoi_mieng_ho_dom",
     BS_VOICE,
     "Chị có hay bị hôi miệng không? "
     "Và khi đau họng, chị có ho nhiều không, ho có đờm không ạ?"),

    ("t10_bn_hoi_mieng_ho_dom_trang_dem",
     BN_VOICE,
     "Hôi miệng thì chồng tôi có nói, nhất là sáng ngủ dậy, đánh răng rồi vẫn hôi. "
     "Tôi cũng ngại lắm. Ho thì thỉnh thoảng, nhất là ban đêm, "
     "ho có đờm nhầy trắng, nhưng không nhiều."),

    # Turn 11 – AI tổng kết ───────────────────────────────────────
    ("t11_bs_cam_on_tom_tat",
     BS_VOICE,
     "Cảm ơn chị Hồng đã chia sẻ. Em đã ghi nhận đầy đủ thông tin. "
     "Bác sĩ sẽ khám trực tiếp cho chị khi vào viện. "
     "Dưới đây là tóm tắt những gì chị đã chia sẻ."),
]

# ── Helpers ───────────────────────────────────────────────────────────────────

def save_wav(path, pcm, channels=1, rate=24000, sample_width=2):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        wf.writeframes(pcm)

def gen(client, name, voice, text):
    path = os.path.join(OUT_DIR, f"{name}.wav")
    if os.path.exists(path):
        print(f"  skip  {name}.wav")
        return
    resp = client.models.generate_content(
        model="gemini-3.1-flash-tts-preview",
        contents=text,
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name=voice,
                    )
                )
            ),
        ),
    )
    pcm = resp.candidates[0].content.parts[0].inline_data.data
    save_wav(path, pcm)
    print(f"  ✓  {name}.wav")

# ── Main ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    os.makedirs(OUT_DIR, exist_ok=True)
    client = genai.Client(api_key=API_KEY)

    total = len(SCRIPTS)
    for i, (name, voice, text) in enumerate(SCRIPTS, 1):
        label = "BS" if voice == BS_VOICE else "BN"
        print(f"[{i:02d}/{total}] {label}  {name}")
        try:
            gen(client, name, voice, text)
        except Exception as e:
            print(f"  ✗  {e}")
        time.sleep(1.2)   # tránh rate-limit

    print(f"\nXong! {total} file trong thư mục ./{OUT_DIR}/")
