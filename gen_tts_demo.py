"""
Gen TTS audio cho demo TMH (Viêm xoang cấp)
Giọng bác sĩ: Enceladus – Breathy, chắc, nhẹ
Giọng MedVita: Sadaltager – Knowledgeable
Model: gemini-2.5-flash-preview-tts
Output: audio/<slug>/audio.wav
"""

import wave, time, os, argparse
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()
API_KEY  = os.environ["GEMINI_API_KEY"]
MODEL    = "gemini-2.5-pro-preview-tts"

DOCTOR_VOICE  = "Enceladus"   # Breathy, chắc – giọng bác sĩ
MEDVITA_VOICE = "Sadaltager"  # Knowledgeable – giọng MedVita AI

# Format: (slug, voice, text_tts)
CLIPS = [
    # ── Doctor voice (Enceladus) ──────────────────────────────────────────────
    (
        "v1-lydo", DOCTOR_VOICE,
        "Lý do vào viện: ho, sốt.",
    ),
    (
        "v2-qtbl", DOCTOR_VOICE,
        "Ngạt mũi, chảy mũi một tuần nay, kèm ho có đờm. "
        "Ở nhà chưa dùng thuốc. "
        "Hôm nay sốt ba mươi chín độ, đau đầu, nôn nhiều, chảy mũi tăng, vào viện. "
        "Tại cấp cứu xử trí Paracetamol, sau đó chuyển khoa Tai Mũi Họng.",
    ),
    (
        "v3-tiensu", DOCTOR_VOICE,
        "Tiền sử: dị ứng kháng sinh không rõ loại. "
        "Không hút thuốc, không uống rượu bia. "
        "Gia đình không bệnh lý gì đặc biệt.",
    ),
    (
        "v4-kham", DOCTOR_VOICE,
        "Mũi khe và sàn nhiều dịch mủ đặc. "
        "Họng niêm mạc xung huyết, hạ họng ứ đọng dịch. "
        "Tai bình thường hai bên. "
        "Bệnh nhân tỉnh, tiếp xúc tốt, da niêm mạc hồng nhạt.",
    ),
    (
        "v5-tomtat", DOCTOR_VOICE,
        "Bệnh nhân nữ mười chín tuổi, vào viện hồi ba giờ rưỡi sáng ngày ba tháng năm. "
        "Lý do ho, sốt. Tiền sử dị ứng kháng sinh không rõ loại. "
        "Sốt ba mươi tám phẩy tám. Mũi nhiều dịch mủ đặc, họng xung huyết.",
    ),
    (
        "v6-cefuroxime", DOCTOR_VOICE,
        "Dùng Cefuroxime năm trăm miligam, ghi vào hướng điều trị.",
    ),
    (
        "v7-xn-command", DOCTOR_VOICE,
        "List xét nghiệm cơ bản tai mũi họng.",
    ),
    # ── MedVita voice (Sadaltager) ────────────────────────────────────────────
    (
        "mv1-allergy", MEDVITA_VOICE,
        "Lưu ý — bệnh nhân có tiền sử dị ứng kháng sinh không rõ loại. "
        "Tôi sẽ đánh dấu cảnh báo vào hướng điều trị.",
    ),
    (
        "mv2-tomtat", MEDVITA_VOICE,
        "Dạ, đã đủ thông tin. Tôi xin phép điền luôn phần Tóm tắt — bác sĩ vui lòng kiểm tra lại ạ.",
    ),
    (
        "mv3-xn-result", MEDVITA_VOICE,
        "Kết quả xét nghiệm đã về. Bạch cầu và CRP tăng — phù hợp viêm xoang cấp.",
    ),
]

# ── Helpers ───────────────────────────────────────────────────────────────────

def save_wav(path, pcm, channels=1, rate=24000, sample_width=2):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        wf.writeframes(pcm)

def gen(client, slug, voice, text, force=False):
    out_dir = os.path.join("audio", slug)
    path    = os.path.join(out_dir, "audio.wav")
    if os.path.exists(path) and not force:
        print(f"  skip  {slug}/audio.wav  (use --force to regenerate)")
        return
    resp = client.models.generate_content(
        model=MODEL,
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
    print(f"  ✓  {slug}/audio.wav  ({len(pcm)//2000:.1f}s)  [{voice}]")

# ── Main ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="Regenerate existing files")
    parser.add_argument("--slug", help="Only generate this slug")
    args = parser.parse_args()

    client = genai.Client(api_key=API_KEY)
    clips  = [c for c in CLIPS if not args.slug or c[0] == args.slug]
    total  = len(clips)

    print(f"Generating {total} demo voice clips  model={MODEL}  force={args.force}\n")
    for i, (slug, voice, text) in enumerate(clips, 1):
        print(f"[{i}/{total}]  {slug}  [{voice}]")
        try:
            gen(client, slug, voice, text, force=args.force)
        except Exception as e:
            print(f"  ✗  {e}")
        time.sleep(1.5)

    print(f"\nDone — files in audio/*/audio.wav")
