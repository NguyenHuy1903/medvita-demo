"""
Gen audio hội thoại bác sĩ - bệnh nhân cho MedVita Video 1

Kịch bản: Tai Mũi Họng · BN Nguyễn Thị Hoa, nữ 19t · Viêm xoang cấp
Giọng BN (bệnh nhân): Zephyr   — trẻ, nhẹ nhàng
Giọng BS (bác sĩ):    Charon   — bình tĩnh, chuyên nghiệp

Output: audio/conversation/audio.wav  (~75-80 giây)

Cách dùng:
  python gen_conversation_audio.py
  python gen_conversation_audio.py --force   # regenerate dù đã có file
"""

import os, wave, time, argparse
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()
API_KEY = os.environ["GEMINI_API_KEY"]
MODEL   = "gemini-2.5-pro-preview-tts"

# ── Voices ────────────────────────────────────────────────────────────────────
PATIENT_VOICE = "Zephyr"    # sáng, trẻ — bệnh nhân nữ 19t
DOCTOR_VOICE  = "Charon"    # trầm, bình tĩnh — bác sĩ

# ── Conversation script ───────────────────────────────────────────────────────
# Ngôn ngữ: tiếng Việt tự nhiên, không quá chỉnh chu
# Thể hiện: cuộc khám thật — có ngập ngừng, nói đan xen
# Thời lượng mục tiêu: ~75–80 giây

CONVERSATION_TEXT = """BS: Em vào khám gì vậy?
BN: Dạ bác sĩ... em bị ngạt mũi, chảy mũi hơn một tuần nay rồi ạ. Với lại ho có đờm nữa.
BS: Ở nhà em có uống thuốc gì chưa?
BN: Dạ chưa ạ, em chưa uống gì hết.
BS: Hôm nay nặng hơn hay sao mà vào viện?
BN: Dạ hôm nay em sốt ạ, đau đầu dữ lắm. Rồi nôn mấy lần, chảy mũi cũng tăng hơn. Người nhà mới đưa vào.
BS: Ừm. Em bị dị ứng thuốc bao giờ chưa?
BN: Dạ... hồi nhỏ em bị dị ứng kháng sinh bác sĩ ạ. Nhưng em không nhớ loại gì nữa.
BS: Gia đình có ai bệnh gì đặc biệt không?
BN: Dạ không ạ.
BS: Thôi bác khám cho em nhé... Nhìn vào đây... Mũi em nhiều dịch mủ đặc lắm. Họng cũng đỏ, xung huyết nhiều. Tai hai bên bình thường.
BN: Bác sĩ ơi... đầu em đau nhiều lắm ạ, nhất là vùng trán.
BS: Đó là do xoang viêm, áp lực đẩy lên đó. Bác cho xét nghiệm máu rồi xem kết quả, sau đó ra thuốc cho em nhé. Em yên tâm.
BN: Dạ cảm ơn bác sĩ ạ."""

# ── Helper ────────────────────────────────────────────────────────────────────
def save_wav(path: str, pcm: bytes, channels=1, rate=24000, sample_width=2):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        wf.writeframes(pcm)

def gen_conversation(client, force=False):
    out_path = os.path.join("audio", "conversation", "audio.wav")
    if os.path.exists(out_path) and not force:
        print(f"  skip  {out_path}  (use --force to regenerate)")
        return

    print(f"  Generating conversation audio  model={MODEL}")
    print(f"  BN voice: {PATIENT_VOICE}  ·  BS voice: {DOCTOR_VOICE}")

    resp = client.models.generate_content(
        model=MODEL,
        contents=CONVERSATION_TEXT,
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                multi_speaker_voice_config=types.MultiSpeakerVoiceConfig(
                    speaker_voice_configs=[
                        types.SpeakerVoiceConfig(
                            speaker="BN",
                            voice_config=types.VoiceConfig(
                                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                    voice_name=PATIENT_VOICE,
                                )
                            ),
                        ),
                        types.SpeakerVoiceConfig(
                            speaker="BS",
                            voice_config=types.VoiceConfig(
                                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                    voice_name=DOCTOR_VOICE,
                                )
                            ),
                        ),
                    ]
                )
            ),
        ),
    )

    pcm = resp.candidates[0].content.parts[0].inline_data.data
    duration_s = len(pcm) / (24000 * 2)
    save_wav(out_path, pcm)
    print(f"  ✓  {out_path}  ({duration_s:.1f}s)")

# ── Main ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Gen MedVita conversation audio")
    parser.add_argument("--force", action="store_true", help="Regenerate even if file exists")
    args = parser.parse_args()

    client = genai.Client(api_key=API_KEY)

    print("MedVita — gen conversation audio\n")
    try:
        gen_conversation(client, force=args.force)
    except Exception as e:
        print(f"  ✗  {e}")

    print("\nDone — file at audio/conversation/audio.wav")
    print("Estimated duration: ~75–80 giây")
    print("\nTimestamps for steps.js (approximate):")
    print("  00:02–00:10  BN describes symptoms → lý do vào viện")
    print("  00:10–00:35  Timeline, severity      → quá trình bệnh lý")
    print("  00:36–00:48  Dị ứng kháng sinh       → tiền sử (doctor cmd)")
    print("  00:49–01:05  Physical exam           → khám lâm sàng (doctor cmd)")
    print("  01:05–01:20  Wrap-up                → AI tóm tắt")
