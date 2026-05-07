"""
Generate voice samples for doctor + MedVita voice selection
Doctor: Orus, Gacrux, Kore  (trầm, già, uy tín)
MedVita: Zephyr, Alula, Sadaltager, Schedar
"""
import wave, time, os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
MODEL  = "gemini-2.5-flash-preview-tts"
OUT    = "audio/voice-samples"

DOCTOR_TEXT  = "Tiền sử: dị ứng kháng sinh không rõ loại. Không hút thuốc, không uống rượu bia."
MEDVITA_TEXT = "Đủ thông tin rồi. Tôi sẽ điền trước phần Tóm tắt — bác sĩ kiểm tra sau nhé."

CLIPS = [
    # Doctor candidates — male only, trầm già uy tín
    ("doc_charon",      "Charon",      DOCTOR_TEXT),   # current baseline
    ("doc_orus",        "Orus",        DOCTOR_TEXT),   # firm
    ("doc_alnilam",     "Alnilam",     DOCTOR_TEXT),   # firm
    ("doc_iapetus",     "Iapetus",     DOCTOR_TEXT),   # clear
    ("doc_enceladus",   "Enceladus",   DOCTOR_TEXT),   # ?
    ("doc_rasalgethi",  "Rasalgethi",  DOCTOR_TEXT),   # ?
    ("doc_zuben",       "Zubenelgenubi", DOCTOR_TEXT), # ?
]

def save_wav(path, pcm, rate=24000):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, "wb") as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(rate)
        wf.writeframes(pcm)

for slug, voice, text in CLIPS:
    path = f"{OUT}/{slug}.wav"
    if os.path.exists(path):
        print(f"  skip  {slug}"); continue
    print(f"  [{voice:12s}] {slug}...", end=" ", flush=True)
    try:
        r = client.models.generate_content(
            model=MODEL, contents=text,
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=voice)
                )),
            ),
        )
        save_wav(path, r.candidates[0].content.parts[0].inline_data.data)
        print("✓")
    except Exception as e:
        print(f"✗  {e}")
    time.sleep(1.2)

print(f"\nDone → {OUT}/")
