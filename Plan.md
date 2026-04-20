# Plan: Update demo.html for TMH Scenario + Add Replay/Pause Buttons

## Context
The demo shows an AI auto-filling a medical record form. The form images (page_1-4.png) are already TMH (Tai Mũi Họng - ENT) form images, but the code still has dental case data, wrong field positions, and no visible playback controls. We need to align everything to the TMH scenario from `demo_conversation_TMH.md` (patient: Nguyễn Thị Hồng, 48F, tonsillitis/VA case, 11-turn conversation).

## Changes (all in `demo.html`)

### Step 1: Add Replay + Pause Buttons

**HTML** — Add button group in `.chat-header` (after the title div, line ~101):
```html
<div class="ctrl-btns">
  <button class="ctrl-btn" id="btnPause" title="Tạm dừng (Space)">⏸</button>
  <button class="ctrl-btn" id="btnReplay" title="Phát lại (R)">↻</button>
</div>
```

**CSS** — Add styles for `.ctrl-btns` and `.ctrl-btn` (circular, Google-style, right-aligned via `margin-left:auto`). Pause button toggles icon between ⏸/▶ and gets `.active` highlight.

**JS** — Extract pause logic from the Space key handler into a `togglePause()` function. Wire `btnPause.onclick = togglePause` and `btnReplay.onclick = () => location.reload()`. Keep keyboard shortcuts (Space, R) working too.

### Step 2: Remap FIELDS Array for TMH Form

Replace the entire FIELDS array. New fields mapped to the TMH form images:

**Page 1 (Hành chính):** `hoTen`, `sinh`, `tuoi`(new), `gioi`, `nghe`, `dantoc`(new), `diachi`, `bhyt`, `sdt`

**Page 2 (Bệnh án):** `lydo`, `qtbl`, `tiensu`, `tiensuGD`(new), vital signs (`mach`, `nhietdo`, `ha`, `nhiptho`(new), `cannang`(new)), `khamck`

**Page 3:** `tomtat`

**Page 4:** `huongdt`

Positions are initial estimates from the form images — use edit mode (`?edit=1` / press E) to fine-tune after implementation.

### Step 3: Update Patient Data

**groupA** — Nguyễn Thị Hồng's admin info from the scenario:
- Họ tên: NGUYỄN THỊ HỒNG, Sinh: 09/09/1977, Tuổi: 48, Giới: Nữ
- Nghề: Công nhân, Dân tộc: Tày, Địa chỉ: Xã Hóa Thượng, Đồng Hỷ, Thái Nguyên
- BHYT: Có – đến 31/12/2026, SĐT: 019xxxxxxx
- Vital signs: Mạch 78, Nhiệt độ 36.8, HA 120/75, Nhịp thở 18, Cân nặng 55

**groupB** — Final-state text for each AI-extracted field (from scenario summary). `khamck` and `huongdt` left empty (waiting for doctor).

### Step 4: Rewrite Conversation Timeline

11-turn conversation matching the TMH scenario:

1. **Phase 0** (t=0.5-4s): AI greets, fills all Group A admin fields on page 1
2. **Turn 1** (t=4.5-8s): AI asks reason → BN says "nuốt vướng" → fill `lydo`
3. **Turn 2** (t=9.5-18s): Onset/history → fill `qtbl` (partial)
4. **Turn 3** (t=18-26s): Snoring/voice → update `qtbl` (append)
5. **Turn 4** (t=26-34s): Prior treatment at BV Đồng Hỷ → update `qtbl` (append)
6. **Turns 5-6** (t=34-43s): Medical + allergy history → fill `tiensu`
7. **Turn 7** (t=43-49s): Smoking/drinking → fill habit fields
8. **Turn 8** (t=49-56s): Family history → fill `tiensuGD`
9. **Turns 9-10** (t=56-65s): Ear/nose/cough symptoms → final `qtbl` update
10. **Vital signs** (t=65-67s): Fill mạch, nhiệt độ, HA, nhịp thở, cân nặng
11. **Turn 11** (t=69-78s): AI summary → scroll page 3 → fill `tomtat`
12. **Triage** (t=78-80s): Show triage card + review banner

**Progressive qtbl handling:** Modify `typeB()` to support delta typing — each timeline event for `qtbl` carries the full cumulative text up to that turn. The function compares what's already displayed and only types new characters. This avoids re-typing the entire field on each update.

### Step 5: Update Triage Card + Toast

- Triage: Khoa đề xuất → "Tai Mũi Họng" (96% confidence), alternatives: Nội tiết (4%), Tiêu hóa (2%)
- Description: Nuốt vướng, viêm amidan tái phát, ngủ ngáy, nhân tuyến giáp
- Toast: "Đã xuất benh_an_NguyenThiHong.pdf"

### Step 6: Handle "Waiting for Doctor" Fields

Fields `khamck` and `huongdt` exist in FIELDS but are NOT filled by the timeline. Add a CSS class `.waiting` (muted gray style, italic) and show placeholder text "[Chờ BS khám tại viện]". These don't count toward the review counter.

## Critical Files
- `/Volumes/Huy/Trivita AI/demo/DEMO/demo.html` — all changes here
- `/Volumes/Huy/Trivita AI/demo/DEMO/demo_conversation_TMH.md` — scenario reference
- `/Volumes/Huy/Trivita AI/demo/DEMO/images/page_1.png` through `page_4.png` — form layout reference

## Verification
1. Open `demo.html` in browser — full 11-turn conversation should play automatically
2. Click Pause button → animation stops, button shows ▶. Click again → resumes
3. Click Replay → page reloads, demo restarts
4. Text fields should overlay correctly on the form images
5. `qtbl` field should grow progressively across turns 2/3/4/9-10
6. After animation completes, Group B fields should be reviewable (✓/✎/✗)
7. `khamck` and `huongdt` should show gray "[Chờ BS khám tại viện]" placeholder
8. Use `?edit=1` to drag-calibrate any misaligned fields, press S to save coords














## Current progress on `demo.html` includes the new FIELDS array, updated patient data, and the conversation timeline
Now I'll implement the plan. Since changes touch nearly every section of the file, I'll write the complete updated
  version.

⏺ Write(demo.html)                                      
  ⎿  Added 235 lines, removed 130 lines                                                   
      61  .field.b.approved { background: rgba(230, 244, 234, 0.9); border-left-color: #34A853; }
      62  .field.b.approved .review-btns { opacity: 1; }                                                              
      63  .field.b.approved .rbtn { display: none; }
      64 -.field.b.approved .review-btns::after { content: '✓'; color: #1E8E3E; font-size: 11px; font-weight: 6       
         -00; padding: 2px 6px; background: #fff; border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,.1); }       
      64 +.field.b.approved .review-btns::after { content: '\2713'; color: #1E8E3E; font-size: 11px; font-weigh       
         +t: 600; padding: 2px 6px; background: #fff; border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,.1);     
         + }                                                                                                   
      65  .field.b.rejected { background: rgba(241, 243, 244, 0.9); border-left-color: #9AA0A6; color: #9AA0A6;
           text-decoration: line-through; }
      66  .field.b.rejected .rbtn { display: none; }
      67  .field.b.edited { background: rgba(254, 247, 224, 0.9); border-left-color: #FBBC04; }
      68 -.field.b.edited .review-btns::before { content: '✎'; color: #7D5A00; font-size: 11px; font-weight: 60
         -0; padding: 2px 6px; background: #fff; border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,.1); marg
         -in-right: 2px; }                                                                                     
      68 +.field.b.edited .review-btns::before { content: '\270E'; color: #7D5A00; font-size: 11px; font-weight
         +: 600; padding: 2px 6px; background: #fff; border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,.1); 
         +margin-right: 2px; }                                                                                 
      69  
      70 +/* Waiting for doctor */                                                                             
      71 +.field.b.waiting { background: rgba(241,243,244,0.7); border-left-color: #9AA0A6; color: #9AA0A6; fon
         +t-style: italic; }                                                                                   
      72 +.field.b.waiting .review-btns { display: none; }                                                     
      73 +                                                                                                     
      74  /* Edit mode (?edit=1 or press E) */
      75  body.edit-mode .field { outline: 1px dashed #1A73E8; cursor: move; }
      76  body.edit-mode .field:hover { outline: 2px solid #1A73E8; background: rgba(26,115,232,0.1); }
     ...
       88  /* Toast */
       89  .toast { position: fixed; right: 24px; bottom: 24px; background: #202124; color: #fff; padding: 14px
            20px; border-radius: 8px; font-size: 13px; display: none; z-index: 20; }
       90  .toast.show { display: block; animation: slide .3s; }
       91 +                                                                                                    
       92 +/* ---------- Playback Controls ---------- */                                                       
       93 +.ctrl-btns { margin-left: auto; display: flex; gap: 6px; }                                          
       94 +.ctrl-btn { width: 34px; height: 34px; border: 1px solid #DADCE0; border-radius: 50%; background: #f
          +ff; color: #5F6368; font-size: 16px; cursor: pointer; display: grid; place-items: center; transition
          +: all .2s; padding: 0; }                                                                            
       95 +.ctrl-btn:hover { background: #F1F3F4; color: #1A73E8; border-color: #1A73E8; }                     
       96 +.ctrl-btn.active { background: #E8F0FE; color: #1A73E8; border-color: #1A73E8; }                    
       97  </style>
       98  </head>
       99  <body>
       90 -<div class="edit-banner">✏ Edit mode — drag fields to adjust · <b>S</b> save JSON to console · <b>E<
          -/b> exit</div>                                                                                      
      100 +<div class="edit-banner">&#9998; Edit mode — drag fields to adjust &middot; <b>S</b> save JSON to co
          +nsole &middot; <b>E</b> exit</div>                                                                  
      101  
      102  <div class="app">
      103  
     ...
      107        <div class="logo">M</div>
      108        <div>
      109          <div class="chat-title">Appoint Ready</div>
      100 -        <div class="chat-sub">Trợ lý tiếp nhận · MedGemma</div>                                     
      110 +        <div class="chat-sub">Tr&#7907; l&#253; ti&#7871;p nh&#7853;n &middot; MedGemma</div>       
      111        </div>
      112 +      <div class="ctrl-btns">                                                                       
      113 +        <button class="ctrl-btn" id="btnPause" title="T&#7841;m d&#7915;ng (Space)">&#9208;</button>
      114 +        <button class="ctrl-btn" id="btnReplay" title="Ph&#225;t l&#7841;i (R)">&#8635;</button>    
      115 +      </div>                                                                                        
      116      </div>
      117      <div class="banner" id="banner"></div>
      118      <div class="chat-body" id="chat"></div>
     ...
      121    <!-- RIGHT PDF -->
      122    <div class="pdf-wrap">
      123      <div class="pdf-toolbar">
      110 -      <span>📄 benh_an_TMH.pdf</span>                                                               
      124 +      <span>&#128196; benh_an_TMH.pdf</span>                                                        
      125        <span id="pageInfo">Trang 1/4</span>
      112 -      <span class="counter" id="counter">Còn 0 mục cần duyệt</span>                                 
      113 -      <button class="export-btn" id="exportBtn" disabled>Xuất bệnh án</button>                      
      126 +      <span class="counter" id="counter">C&#242;n 0 m&#7909;c c&#7847;n duy&#7879;t</span>          
      127 +      <button class="export-btn" id="exportBtn" disabled>Xu&#7845;t b&#7879;nh &#225;n</button>     
      128      </div>
      129      <div class="pdf-scroll" id="scroll"></div>
      130    </div>
     ...
      132  
      133  <!-- Triage card -->
      134  <div class="triage" id="triage">
      121 -  <div class="conf">Độ tin cậy 94%</div>                                                            
      122 -  <h3>Khoa đề xuất: Răng - Hàm - Mặt</h3>                                                           
      123 -  <div style="font-size:13px;color:#5F6368;margin-top:6px">Đau răng hàm P, sưng, nghi viêm tủy / áp 
          -xe quanh chóp.</div>                                                                                
      124 -  <div class="alt">Phương án khác: Tai Mũi Họng (8%)</div>                                          
      135 +  <div class="conf">&#272;&#7897; tin c&#7853;y 96%</div>                                           
      136 +  <h3>Khoa &#273;&#7873; xu&#7845;t: Tai M&#361;i H&#7885;ng</h3>                                   
      137 +  <div style="font-size:13px;color:#5F6368;margin-top:6px">Nu&#7889;t v&#432;&#7899;ng, vi&#234;m am
          +idan t&#225;i ph&#225;t, ng&#7911; ng&#225;y, nh&#226;n tuy&#7871;n gi&#225;p &#8211; nghi vi&#234;m
          + amidan m&#227;n t&#237;nh / VA t&#7891;n d&#432;.</div>                                            
      138 +  <div class="alt">Ph&#432;&#417;ng &#225;n kh&#225;c: N&#7897;i ti&#7871;t (4%) &middot; Ti&#234;u 
          +h&#243;a (2%)</div>                                                                                 
      139  </div>
      140  
      127 -<div class="toast" id="toast">✓ Đã xuất benh_an_NguyenVanA.pdf</div>                                
      141 +<div class="toast" id="toast">&#10003; &#272;&#227; xu&#7845;t benh_an_NguyenThiHong.pdf</div>      
      142  
      143  <script>
      144  // ---------- FIELD COORDS (% of page image) ----------
      131 -// Tuned on 1191×1684 PNG. Use ?edit=1 or press E to adjust + save.                                 
      145 +// Tuned on 1191x1684 PNG. Use ?edit=1 or press E to adjust + save.                                 
      146  const FIELDS = [
      133 -  // --- Page 1 : I. HÀNH CHÍNH ---                                                                 
      134 -  { id: 'hoTen',   group: 'A', page: 1, top: 8.3,  left: 14,  width: 42, height: 2.0, placeholder: '
          -Họ tên' },                                                                                          
      135 -  { id: 'sinh',    group: 'A', page: 1, top: 10.3, left: 18,  width: 16, height: 2.0, placeholder: '
          -Ngày sinh' },                                                                                       
      136 -  { id: 'gioi',    group: 'A', page: 1, top: 10.3, left: 44,  width: 8,  height: 2.0, placeholder: '
          -Giới' },                                                                                            
      137 -  { id: 'nghe',    group: 'A', page: 1, top: 12.3, left: 18,  width: 35, height: 2.0, placeholder: '
          -Nghề' },                                                                                            
      138 -  { id: 'diachi',  group: 'A', page: 1, top: 14.3, left: 19,  width: 72, height: 2.0, placeholder: '
          -Địa chỉ' },                                                                                         
      139 -  { id: 'bhyt',    group: 'A', page: 1, top: 24.8, left: 23,  width: 35, height: 2.0, placeholder: '
          -BHYT' },                                                                                            
      140 -  { id: 'sdt',     group: 'A', page: 1, top: 29.0, left: 66,  width: 24, height: 2.0, placeholder: '
          -SĐT' },                                                                                             
      147 +  // --- Page 1 : I. HANH CHINH ---                                                                 
      148 +  { id: 'hoTen',    group: 'A', page: 1, top: 8.3,  left: 22,  width: 36, height: 2.0, placeholder: 
          +'H\u1ecd t\u00ean' },                                                                               
      149 +  { id: 'sinh',     group: 'A', page: 1, top: 10.0, left: 15,  width: 14, height: 2.0, placeholder: 
          +'Ng\u00e0y sinh' },                                                                                 
      150 +  { id: 'tuoi',     group: 'A', page: 1, top: 10.0, left: 34,  width: 5,  height: 2.0, placeholder: 
          +'' },                                                                                               
      151 +  { id: 'gioi',     group: 'A', page: 1, top: 11.7, left: 20,  width: 5,  height: 2.0, placeholder: 
          +'Gi\u1edbi' },                                                                                      
      152 +  { id: 'nghe',     group: 'A', page: 1, top: 11.7, left: 42,  width: 20, height: 2.0, placeholder: 
          +'Ngh\u1ec1' },                                                                                      
      153 +  { id: 'dantoc',   group: 'A', page: 1, top: 13.3, left: 15,  width: 15, height: 2.0, placeholder: 
          +'D\u00e2n t\u1ed9c' },                                                                              
      154 +  { id: 'diachi',   group: 'A', page: 1, top: 15.0, left: 16,  width: 78, height: 2.0, placeholder: 
          +'\u0110\u1ecba ch\u1ec9' },                                                                         
      155 +  { id: 'bhyt',     group: 'A', page: 1, top: 20.5, left: 42,  width: 30, height: 2.0, placeholder: 
          +'BHYT' },                                                                                           
      156 +  { id: 'sdt',      group: 'A', page: 1, top: 23.0, left: 18,  width: 22, height: 2.0, placeholder: 
          +'S\u0110T' },                                                                                       
      157  
      142 -  // --- Page 2 : Lý do / QTBL / Tiền sử / Vital / Chuyên khoa ---                                  
      143 -  { id: 'lydo',    group: 'B', page: 2, top: 5.0,  left: 21,  width: 72, height: 2.4, placeholder: '
          -Lý do vào viện' },                                                                                  
      144 -  { id: 'qtbl',    group: 'B', page: 2, top: 12.0, left: 6,   width: 88, height: 11,  placeholder: '
          -Quá trình bệnh lý' },                                                                               
      145 -  { id: 'tiensu',  group: 'B', page: 2, top: 32.0, left: 6,   width: 88, height: 5.5, placeholder: '
          -Tiền sử' },                                                                                         
      146 -  { id: 'mach',    group: 'A', page: 2, top: 54.0, left: 80,  width: 10, height: 1.8, placeholder: '
          -' },                                                                                                
      147 -  { id: 'nhietdo', group: 'A', page: 2, top: 56.2, left: 80,  width: 10, height: 1.8, placeholder: '
          -' },                                                                                                
      148 -  { id: 'ha',      group: 'A', page: 2, top: 58.4, left: 80,  width: 12, height: 1.8, placeholder: '
          -' },                                                                                                
      149 -  { id: 'khamck',  group: 'B', page: 2, top: 66.0, left: 6,   width: 88, height: 5.5, placeholder: '
          -Khám chuyên khoa' },                                                                                
      158 +  // --- Page 2 : Ly do / QTBL / Tien su / Vital / Chuyen khoa ---                                  
      159 +  { id: 'lydo',     group: 'B', page: 2, top: 2.8,  left: 22,  width: 55, height: 2.0, placeholder: 
          +'L\u00fd do v\u00e0o vi\u1ec7n' },                                                                  
      160 +  { id: 'qtbl',     group: 'B', page: 2, top: 7.5,  left: 4,   width: 92, height: 14,  placeholder: 
          +'Qu\u00e1 tr\u00ecnh b\u1ec7nh l\u00fd' },                                                          
      161 +  { id: 'tiensu',   group: 'B', page: 2, top: 25.0, left: 4,   width: 92, height: 7,   placeholder: 
          +'Ti\u1ec1n s\u1eed b\u1ea3n th\u00e2n' },                                                           
      162 +  { id: 'tiensuGD', group: 'B', page: 2, top: 43.5, left: 4,   width: 92, height: 5,   placeholder: 
          +'Ti\u1ec1n s\u1eed gia \u0111\u00ecnh' },                                                           
      163 +  { id: 'mach',     group: 'A', page: 2, top: 53.5, left: 82,  width: 12, height: 1.8, placeholder: 
          +'' },                                                                                               
      164 +  { id: 'nhietdo',  group: 'A', page: 2, top: 55.5, left: 82,  width: 12, height: 1.8, placeholder: 
          +'' },                                                                                               
      165 +  { id: 'ha',       group: 'A', page: 2, top: 57.5, left: 82,  width: 12, height: 1.8, placeholder: 
          +'' },                                                                                               
      166 +  { id: 'nhiptho',  group: 'A', page: 2, top: 59.5, left: 82,  width: 12, height: 1.8, placeholder: 
          +'' },                                                                                               
      167 +  { id: 'cannang',  group: 'A', page: 2, top: 61.5, left: 82,  width: 12, height: 1.8, placeholder: 
          +'' },                                                                                               
      168 +  { id: 'khamck',   group: 'B', page: 2, top: 65.5, left: 4,   width: 92, height: 5,   placeholder: 
          +'Kh\u00e1m chuy\u00ean khoa', waiting: true },                                                      
      169  
      151 -  // --- Page 3 : Tóm tắt ---                                                                       
      152 -  { id: 'tomtat',  group: 'B', page: 3, top: 74.0, left: 4,   width: 92, height: 14,  placeholder: '
          -Tóm tắt bệnh án' },                                                                                 
      170 +  // --- Page 3 : Tom tat ---                                                                       
      171 +  { id: 'tomtat',   group: 'B', page: 3, top: 76.0, left: 4,   width: 92, height: 18,  placeholder: 
          +'T\u00f3m t\u1eaft b\u1ec7nh \u00e1n' },                                                            
      172  
      154 -  // --- Page 4 : Hướng điều trị ---                                                                
      155 -  { id: 'huongdt', group: 'B', page: 4, top: 16.0, left: 4,   width: 92, height: 7,   placeholder: '
          -Hướng dẫn điều trị' }                                                                               
      173 +  // --- Page 4 : Huong dieu tri ---                                                                
      174 +  { id: 'huongdt',  group: 'B', page: 4, top: 16.0, left: 4,   width: 92, height: 7,   placeholder: 
          +'H\u01b0\u1edbng d\u1eabn \u0111i\u1ec1u tr\u1ecb', waiting: true }                                 
      175  ];
      176  
      177  // ---------- DATA ----------
      178  const groupA = {
      160 -  hoTen: 'Nguyễn Văn A',                                                                            
      161 -  sinh: '12/05/1990',                                                                               
      162 -  gioi: 'Nam',                                                                                      
      163 -  nghe: 'Kỹ sư phần mềm',                                                                           
      164 -  diachi: '123 Lê Lợi, P. Bến Nghé, Q.1, TP.HCM',                                                   
      165 -  bhyt: 'GD4790123456789',                                                                          
      166 -  sdt: '0912 345 678',                                                                              
      167 -  mach: '82',                                                                                       
      168 -  nhietdo: '37.0',                                                                                  
      169 -  ha: '120/80'                                                                                      
      179 +  hoTen: 'NGUY\u1ec4N TH\u1eca H\u1ed2NG',                                                          
      180 +  sinh: '09/09/1977',                                                                               
      181 +  tuoi: '48',                                                                                       
      182 +  gioi: 'N\u1eef',                                                                                  
      183 +  nghe: 'C\u00f4ng nh\u00e2n',                                                                      
      184 +  dantoc: 'T\u00e0y',                                                                               
      185 +  diachi: 'X\u00e3 H\u00f3a Th\u01b0\u1ee3ng, \u0110\u1ed3ng H\u1ef7, Th\u00e1i Nguy\u00ean',       
      186 +  bhyt: 'C\u00f3 \u2013 \u0111\u1ebfn 31/12/2026',                                                  
      187 +  sdt: '019xxxxxxx',                                                                                
      188 +  mach: '78',                                                                                       
      189 +  nhietdo: '36.8',                                                                                  
      190 +  ha: '120/75',                                                                                     
      191 +  nhiptho: '18',                                                                                    
      192 +  cannang: '55'                                                                                     
      193  };
      194  const groupB = {
      172 -  lydo: 'Đau răng hàm dưới bên phải 3 ngày, sưng nhẹ vùng má P.',                                   
      173 -  qtbl: 'Khởi phát cách 3 ngày sau khi ăn đồ cứng. Đau âm ỉ, tăng về đêm, lan lên thái dương. Đã tự 
          -dùng Paracetamol 500mg x 2 viên/ngày, đỡ ít. Không sốt, không khó nuốt. Không chảy mủ, không tê bì m
          -ôi cằm.',                                                                                           
      174 -  tiensu: 'Bản thân: không dị ứng thuốc, không hút thuốc, uống bia ít. Gia đình: không có bệnh lý đặ
          -c biệt.',                                                                                           
      175 -  khamck: 'R46 sâu lớn mặt nhai, lộ tủy, đau khi gõ dọc (+). Niêm mạc quanh chóp nề đỏ nhẹ, không lỗ
          - rò. Há miệng hạn chế nhẹ. Hạch dưới hàm P ấn đau.',                                                
      176 -  tomtat: 'BN nam 35 tuổi, vào viện vì đau răng hàm dưới P 3 ngày. Khám: R46 sâu lớn, lộ tủy, gõ dọc
          - (+), niêm mạc quanh chóp nề nhẹ, hạch dưới hàm P đau. Chẩn đoán sơ bộ: viêm tủy cấp R46 / theo dõi 
          -áp xe quanh chóp giai đoạn sớm.',                                                                   
      177 -  huongdt: 'Nội nha R46 (lấy tủy toàn phần), kháng sinh Amoxicillin 500mg + Metronidazole 500mg x 7 
          -ngày, giảm đau Ibuprofen 400mg khi đau. Tái khám 3 ngày; nếu áp xe tiến triển → tiểu phẫu dẫn lưu.' 
      195 +  lydo: 'Nu\u1ed1t v\u01b0\u1edbng',                                                                
      196 +  qtbl: '\u0110au h\u1ecdng t\u00e1i ph\u00e1t nhi\u1ec1u n\u0103m, kho\u1ea3ng 5-6 \u0111\u1ee3t/n\
          +u0103m k\u00e8m s\u1ed1t. T\u1ef1 mua kh\u00e1ng sinh \u0111i\u1ec1u tr\u1ecb t\u1eebng \u0111\u1ee3
          +t, kh\u1ecfi r\u1ed3i t\u00e1i l\u1ea1i. \u0110\u1ee3t n\u00e0y nu\u1ed1t v\u01b0\u1edbng t\u0103ng 
          +r\u00f5 (ngh\u1eb9n khi \u0103n), ch\u01b0a d\u00f9ng thu\u1ed1c. Ng\u1ee7 ng\u00e1y to h\u00e0ng \u
          +0111\u00eam, gi\u1eadt m\u00ecnh t\u1ec9nh gi\u1ea5c k\u00e8m t\u1ee9c ng\u1ef1c, kh\u00f3 th\u1edf.
          + Gi\u1ecdng n\u00f3i ch\u01b0a thay \u0111\u1ed5i. Kh\u00e1m BV \u0110\u1ed3ng H\u1ef7: S\u00c2 tuy\
          +u1ebfn gi\u00e1p \u2192 nh\u00e2n th\u00f9y ph\u1ea3i (TIRADS 1), nh\u00e2n th\u00f9y tr\u00e1i (TIR
          +ADS 3) \u2192 chuy\u1ec3n BV TW Th\u00e1i Nguy\u00ean. H\u01a1i th\u1edf h\u00f4i dai d\u1eb3ng. Ho 
          +\u0111\u1edd m nh\u1ea7y tr\u1eafng v\u1ec1 \u0111\u00eam (nh\u1eb9). \u0110au nh\u00f3i lan l\u00ea
          +n tai trong \u0111\u1ee3t vi\u00eam h\u1ecdng c\u1ea5p. Tai m\u0169i kh\u00f4ng tri\u1ec7u ch\u1ee9n
          +g kh\u00e1c.',                                                                                      
      197 +  tiensu: 'Kh\u00f4ng ti\u1ec1n s\u1eed PT. Kh\u00f4ng T\u0110, THA. Ph\u00e1t tri\u1ec3n th\u1ec3 l
          +\u1ef1c b\u00ecnh th\u01b0\u1eddng. \u0110au th\u01b0\u1ee3ng v\u1ecb, \u1ee3 chua khi \u0103n cay ~
          +1 n\u0103m, ch\u01b0a kh\u00e1m ti\u00eau h\u00f3a. D\u1ecb \u1ee9ng: Kh\u00f4ng. Thu\u1ed1c l\u00e1
          +: Kh\u00f4ng. R\u01b0\u1ee3u bia: x\u00e3 giao 1-2 lon/l\u1ea7n, 1-2 l\u1ea7n/th\u00e1ng. Ma t\u00fa
          +y: Kh\u00f4ng.',                                                                                    
      198 +  tiensuGD: 'B\u1ed1 THA (\u0111ang \u0111i\u1ec1u tr\u1ecb). Ch\u1ecb g\u00e1i c\u1eaft amidan (~5-
          +6 n\u0103m tr\u01b0\u1edbc). M\u1eb9 kh\u1ecfe. Kh\u00f4ng b\u1ec7nh l\u00fd tuy\u1ebfn gi\u00e1p gi
          +a \u0111\u00ecnh.',                                                                                 
      199 +  khamck: '',                                                                                       
      200 +  tomtat: 'BN n\u1eef, 48 tu\u1ed5i, \u0111\u1ebfn vi\u1ec7n v\u00ec nu\u1ed1t v\u01b0\u1edbng. \u01
          +10au h\u1ecdng s\u1ed1t t\u00e1i ph\u00e1t ~5-6 \u0111\u1ee3t/n\u0103m, t\u1ef1 mua kh\u00e1ng sinh.
          + \u0110\u1ee3t n\u00e0y nu\u1ed1t v\u01b0\u1edbng t\u0103ng r\u00f5, ngh\u1eb9n khi \u0103n, ng\u1ee
          +7 ng\u00e1y to, gi\u1eadt m\u00ecnh kh\u00f3 th\u1edf khi ng\u1ee7. H\u01a1i th\u1edf h\u00f4i dai d
          +\u1eb3ng, ho \u0111\u1edd m nh\u1ea7y tr\u1eafng nh\u1eb9 v\u1ec1 \u0111\u00eam. \u0110au nh\u00f3i 
          +lan tai khi vi\u00eam h\u1ecdng c\u1ea5p. TS: \u0111au th\u01b0\u1ee3ng v\u1ecb \u1ee3 chua ~1 n\u01
          +03m. Gia \u0111\u00ecnh: b\u1ed1 THA, ch\u1ecb c\u1eaft amidan. Kh\u00e1m BV \u0110\u1ed3ng H\u1ef7:
          + S\u00c2 tuy\u1ebfn gi\u00e1p nh\u00e2n th\u00f9y ph\u1ea3i TIRADS 1, nh\u00e2n th\u00f9y tr\u00e1i 
          +TIRADS 3 \u2192 chuy\u1ec3n tuy\u1ebfn tr\u00ean.',                                                 
      201 +  huongdt: ''                                                                                       
      202  };
      203  
      204 +// Progressive qtbl snapshots (cumulative text at each stage)                                       
      205 +const qtblStages = [                                                                                
      206 +  // After Turn 2                                                                                   
      207 +  '\u0110au h\u1ecdng t\u00e1i ph\u00e1t nhi\u1ec1u n\u0103m, kho\u1ea3ng 5-6 \u0111\u1ee3t/n\u0103m
          + k\u00e8m s\u1ed1t. T\u1ef1 mua kh\u00e1ng sinh \u0111i\u1ec1u tr\u1ecb t\u1eebng \u0111\u1ee3t, kh\
          +u1ecfi r\u1ed3i t\u00e1i l\u1ea1i. \u0110\u1ee3t n\u00e0y nu\u1ed1t v\u01b0\u1edbng t\u0103ng r\u00f
          +5 (ngh\u1eb9n khi \u0103n), ch\u01b0a d\u00f9ng thu\u1ed1c.',                                       
      208 +  // After Turn 3                                                                                   
      209 +  '\u0110au h\u1ecdng t\u00e1i ph\u00e1t nhi\u1ec1u n\u0103m, kho\u1ea3ng 5-6 \u0111\u1ee3t/n\u0103m
          + k\u00e8m s\u1ed1t. T\u1ef1 mua kh\u00e1ng sinh \u0111i\u1ec1u tr\u1ecb t\u1eebng \u0111\u1ee3t, kh\
          +u1ecfi r\u1ed3i t\u00e1i l\u1ea1i. \u0110\u1ee3t n\u00e0y nu\u1ed1t v\u01b0\u1edbng t\u0103ng r\u00f
          +5 (ngh\u1eb9n khi \u0103n), ch\u01b0a d\u00f9ng thu\u1ed1c. Ng\u1ee7 ng\u00e1y to h\u00e0ng \u0111\u
          +00eam, gi\u1eadt m\u00ecnh t\u1ec9nh gi\u1ea5c k\u00e8m t\u1ee9c ng\u1ef1c, kh\u00f3 th\u1edf. Gi\u1
          +ecdng n\u00f3i ch\u01b0a thay \u0111\u1ed5i.',                                                      
      210 +  // After Turn 4                                                                                   
      211 +  '\u0110au h\u1ecdng t\u00e1i ph\u00e1t nhi\u1ec1u n\u0103m, kho\u1ea3ng 5-6 \u0111\u1ee3t/n\u0103m
          + k\u00e8m s\u1ed1t. T\u1ef1 mua kh\u00e1ng sinh \u0111i\u1ec1u tr\u1ecb t\u1eebng \u0111\u1ee3t, kh\
          +u1ecfi r\u1ed3i t\u00e1i l\u1ea1i. \u0110\u1ee3t n\u00e0y nu\u1ed1t v\u01b0\u1edbng t\u0103ng r\u00f
          +5 (ngh\u1eb9n khi \u0103n), ch\u01b0a d\u00f9ng thu\u1ed1c. Ng\u1ee7 ng\u00e1y to h\u00e0ng \u0111\u
          +00eam, gi\u1eadt m\u00ecnh t\u1ec9nh gi\u1ea5c k\u00e8m t\u1ee9c ng\u1ef1c, kh\u00f3 th\u1edf. Gi\u1
          +ecdng n\u00f3i ch\u01b0a thay \u0111\u1ed5i. Kh\u00e1m BV \u0110\u1ed3ng H\u1ef7: S\u00c2 tuy\u1ebfn
          + gi\u00e1p \u2192 nh\u00e2n th\u00f9y ph\u1ea3i (TIRADS 1), nh\u00e2n th\u00f9y tr\u00e1i (TIRADS 3)
          + \u2192 chuy\u1ec3n BV TW Th\u00e1i Nguy\u00ean.'                                                   
      212 +  // Final (after Turns 9-10) uses groupB.qtbl                                                      
      213 +];                                                                                                  
      214 +                                                                                                    
      215  // ---------- BUILD PDF PAGES ----------
      216  const scroll = document.getElementById('scroll');
      217  for (let p = 1; p <= 4; p++) {
      218    const page = document.createElement('div');
      219    page.className = 'pdf-page';
      220    page.dataset.page = p;
      186 -  page.innerHTML = `<span class="page-label">Trang ${p}</span><img src="images/page_${p}.png" alt="p
          -age ${p}" draggable="false">`;                                                                      
      221 +  page.innerHTML = '<span class="page-label">Trang ' + p + '</span><img src="images/page_' + p + '.p
          +ng" alt="page ' + p + '" draggable="false">';                                                       
      222    scroll.appendChild(page);
      223  }
      224  
      225  // ---------- PLACE FIELDS ----------
      226  const fieldEls = {};
      227  FIELDS.forEach(f => {
      193 -  const host = scroll.querySelector(`.pdf-page[data-page="${f.page}"]`);                            
      228 +  const host = scroll.querySelector('.pdf-page[data-page="' + f.page + '"]');                       
      229    const el = document.createElement('div');
      195 -  el.className = 'field' + (f.group === 'B' ? ' b pending' : '');                                   
      230 +  const isWaiting = !!f.waiting;                                                                    
      231 +  if (f.group === 'B') {                                                                            
      232 +    el.className = 'field b' + (isWaiting ? ' waiting' : ' pending');                               
      233 +  } else {                                                                                          
      234 +    el.className = 'field';                                                                         
      235 +  }                                                                                                 
      236    el.dataset.id = f.id;
      237    el.dataset.group = f.group;
      238    el.style.top = f.top + '%';
      239    el.style.left = f.left + '%';
      240    el.style.width = f.width + '%';
      241    if (f.height) el.style.minHeight = f.height + '%';
      202 -  if (f.group === 'B') {                                                                            
      203 -    el.innerHTML = `<span class="text-slot"></span><span class="review-btns">` +                    
      204 -      `<button class="rbtn ok" title="Duyệt" onclick="approve('${f.id}')">✓</button>` +             
      205 -      `<button class="rbtn edit" title="Sửa" onclick="editF('${f.id}')">✎</button>` +               
      206 -      `<button class="rbtn no" title="Từ chối" onclick="reject('${f.id}')">✗</button>` +            
      207 -      `</span>`;                                                                                    
      242 +  if (f.group === 'B' && !isWaiting) {                                                              
      243 +    el.innerHTML = '<span class="text-slot"></span><span class="review-btns">' +                    
      244 +      '<button class="rbtn ok" title="Duy\u1ec7t" onclick="approve(\'' + f.id + '\')">&#10003;</butt
          +on>' +                                                                                              
      245 +      '<button class="rbtn edit" title="S\u1eeda" onclick="editF(\'' + f.id + '\')">&#9998;</button>
          +' +                                                                                                 
      246 +      '<button class="rbtn no" title="T\u1eeb ch\u1ed1i" onclick="reject(\'' + f.id + '\')">&#10007;
          +</button>' +                                                                                        
      247 +      '</span>';                                                                                    
      248 +  } else if (f.group === 'B' && isWaiting) {                                                        
      249 +    el.innerHTML = '<span class="text-slot">[Ch\u1edd BS kh\u00e1m t\u1ea1i vi\u1ec7n]</span>';     
      250    } else {
      209 -    el.innerHTML = `<span class="text-slot"></span>`;                                               
      251 +    el.innerHTML = '<span class="text-slot"></span>';                                               
      252    }
      253    host.appendChild(el);
      254    fieldEls[f.id] = el;
     ...
      256  
      257  // ---------- TIMELINE ----------
      258  const timeline = [
      217 -  { t: 500,   type: 'chat', role: 'a', text: 'Xin chào anh, em là trợ lý Appoint Ready. Em đang đọc 
          -hồ sơ của anh...' },                                                                                
      218 -  // Group A - admin                                                                                
      259 +  // === Phase 0: AI reads HIS, fills Group A ===                                                   
      260 +  { t: 500,   type: 'chat', role: 'a', text: 'Ch\u00e0o ch\u1ecb H\u1ed3ng, em l\u00e0 tr\u1ee3 l\u0
          +0fd AI y t\u1ebf c\u1ee7a b\u1ec7nh vi\u1ec7n. Em \u0111ang \u0111\u1ecdc h\u1ed3 s\u01a1 c\u1ee7a c
          +h\u1ecb...' },                                                                                      
      261    { t: 1600,  type: 'scroll', page: 1 },
      262    { t: 1800,  type: 'fieldA', id: 'hoTen' },
      221 -  { t: 2200,  type: 'fieldA', id: 'sinh' },                                                         
      263 +  { t: 2100,  type: 'fieldA', id: 'sinh' },                                                         
      264 +  { t: 2300,  type: 'fieldA', id: 'tuoi' },                                                         
      265    { t: 2500,  type: 'fieldA', id: 'gioi' },
      223 -  { t: 2800,  type: 'fieldA', id: 'nghe' },                                                         
      266 +  { t: 2700,  type: 'fieldA', id: 'nghe' },                                                         
      267 +  { t: 2900,  type: 'fieldA', id: 'dantoc' },                                                       
      268    { t: 3200,  type: 'fieldA', id: 'diachi' },
      269    { t: 3600,  type: 'fieldA', id: 'bhyt' },
      270    { t: 3900,  type: 'fieldA', id: 'sdt' },
      227 -  { t: 4500,  type: 'chat', role: 'a', text: 'Em đã điền xong phần hành chính. Anh có thể cho biết l
          -ý do đến khám hôm nay không ạ?' },                                                                  
      228 -  { t: 6300,  type: 'chat', role: 'p', text: 'Tôi bị đau răng hàm dưới bên phải 3 ngày nay, sưng nhẹ
          -.' },                                                                                               
      229 -  // Group B - lý do                                                                                
      230 -  { t: 7200,  type: 'scroll', page: 2 },                                                            
      231 -  { t: 7500,  type: 'fieldB', id: 'lydo' },                                                         
      232 -  { t: 10200, type: 'chat', role: 'a', text: 'Cơn đau diễn biến thế nào? Anh đã uống thuốc gì chưa?'
          - },                                                                                                 
      233 -  { t: 11800, type: 'chat', role: 'p', text: 'Đau âm ỉ, tăng về đêm. Tôi uống Paracetamol đỡ chút, k
          -hông sốt.' },                                                                                       
      234 -  { t: 13000, type: 'fieldB', id: 'qtbl' },                                                         
      235 -  { t: 18500, type: 'chat', role: 'a', text: 'Anh có dị ứng thuốc gì không? Có hút thuốc, uống rượu 
          -bia không ạ?' },                                                                                    
      236 -  { t: 20000, type: 'chat', role: 'p', text: 'Không dị ứng gì. Thỉnh thoảng uống bia thôi, không hút
          - thuốc.' },                                                                                         
      237 -  { t: 21200, type: 'fieldB', id: 'tiensu' },                                                       
      238 -  // Vital signs                                                                                    
      239 -  { t: 24500, type: 'fieldA', id: 'mach' },                                                         
      240 -  { t: 24900, type: 'fieldA', id: 'nhietdo' },                                                      
      241 -  { t: 25300, type: 'fieldA', id: 'ha' },                                                           
      242 -  { t: 25800, type: 'chat', role: 'a', text: 'Em ghi nhận sinh hiệu ổn định. Em đang tổng hợp khám c
          -huyên khoa...' },                                                                                   
      243 -  { t: 27000, type: 'fieldB', id: 'khamck' },                                                       
      244 -  { t: 31500, type: 'scroll', page: 3 },                                                            
      245 -  { t: 32000, type: 'fieldB', id: 'tomtat' },                                                       
      246 -  { t: 38000, type: 'scroll', page: 4 },                                                            
      247 -  { t: 38500, type: 'fieldB', id: 'huongdt' },                                                      
      248 -  { t: 43500, type: 'triage' },                                                                     
      249 -  { t: 45000, type: 'banner', text: '⏸ Đang chờ bác sĩ duyệt · Bấm ✓ ✎ ✗ trên các ô vàng (hoặc phím 
          -A để duyệt hết)' }                                                                                  
      271 +                                                                                                    
      272 +  // === Turn 1: Ly do vao vien ===                                                                 
      273 +  { t: 4500,  type: 'chat', role: 'a', text: 'Em \u0111\u00e3 \u0111i\u1ec1n xong ph\u1ea7n h\u00e0n
          +h ch\u00ednh. Tr\u01b0\u1edbc khi ch\u1ecb \u0111\u1ebfn kh\u00e1m, em mu\u1ed1n h\u1ecfi ch\u1ecb m
          +\u1ed9t s\u1ed1 c\u00e2u \u0111\u1ec3 b\u00e1c s\u0129 n\u1eafm tr\u01b0\u1edbc t\u00ecnh h\u00ecnh.
          + Ch\u1ecb v\u00e0o vi\u1ec7n l\u1ea7n n\u00e0y v\u00ec l\u00fd do g\u00ec \u1ea1?' },               
      274 +  { t: 6500,  type: 'chat', role: 'p', text: 'T\u00f4i b\u1ecb nu\u1ed1t v\u01b0\u1edbng, c\u1ea3m g
          +i\u00e1c c\u00f3 c\u00e1i g\u00ec ch\u1eb7n \u1edf c\u1ed5 h\u1ecdng, kh\u00f3 ch\u1ecbu l\u1eafm.' 
          +},                                                                                                  
      275 +  { t: 7500,  type: 'scroll', page: 2 },                                                            
      276 +  { t: 7800,  type: 'fieldB', id: 'lydo' },                                                         
      277 +                                                                                                    
      278 +  // === Turn 2: Onset + history -> qtbl partial ===                                                
      279 +  { t: 9500,  type: 'chat', role: 'a', text: 'Nu\u1ed1t v\u01b0\u1edbng n\u00e0y ch\u1ecb b\u1eaft \
          +u0111\u1ea7u t\u1eeb khi n\u00e0o, v\u00e0 c\u00f3 t\u0103ng d\u1ea7n kh\u00f4ng \u1ea1?' },        
      280 +  { t: 11500, type: 'chat', role: 'p', text: 'L\u00e2u l\u1eafm r\u1ed3i, tr\u01b0\u1edbc hay b\u1ec
          +b \u0111au h\u1ecdng, c\u1ee9 v\u00e0i th\u00e1ng l\u1ea1i s\u1ed1t, mua kh\u00e1ng sinh u\u1ed1ng \
          +u0111\u1ee1. N\u0103m ngo\u00e1i 5-6 l\u1ea7n. \u0110\u1ee3t n\u00e0y nu\u1ed1t v\u01b0\u1edbng t\u0
          +103ng, c\u01a1m c\u0169ng ngh\u1eb9n.' },                                                           
      281 +  { t: 13000, type: 'fieldB', id: 'qtbl', text: qtblStages[0] },                                    
      282 +                                                                                                    
      283 +  // === Turn 3: Snoring -> update qtbl ===                                                         
      284 +  { t: 17500, type: 'chat', role: 'a', text: 'Ch\u1ecb c\u00f3 th\u1ea5y gi\u1ecdng n\u00f3i thay \u
          +0111\u1ed5i, ho\u1eb7c ng\u01b0\u1eddi nh\u00e0 ph\u1ea3n \u00e1nh ch\u1ecb ng\u1ee7 ng\u00e1y to kh
          +\u00f4ng \u1ea1?' },                                                                                
      285 +  { t: 19500, type: 'chat', role: 'p', text: 'Gi\u1ecdng b\u00ecnh th\u01b0\u1eddng, m\u00e0 ng\u00e
          +1y th\u00ec c\u00f3. Ch\u1ed3ng n\u00f3i t\u00f4i ng\u00e1y to l\u1eafm. Th\u1ec9nh tho\u1ea3ng gi\u
          +1eadt m\u00ecnh t\u1ec9nh d\u1eady, t\u1ee9c ng\u1ef1c kh\u00f3 th\u1edf.' },                       
      286 +  { t: 21500, type: 'fieldB', id: 'qtbl', text: qtblStages[1] },                                    
      287 +                                                                                                    
      288 +  // === Turn 4: Prior treatment BV Dong Hy -> update qtbl ===                                      
      289 +  { t: 25500, type: 'chat', role: 'a', text: 'Tr\u01b0\u1edbc khi \u0111\u1ebfn \u0111\u00e2y, ch\u1
          +ecb c\u00f3 \u0111i kh\u00e1m ho\u1eb7c \u0111i\u1ec1u tr\u1ecb \u1edf c\u01a1 s\u1edf y t\u1ebf n\u
          +00e0o kh\u00f4ng \u1ea1?' },                                                                        
      290 +  { t: 27500, type: 'chat', role: 'p', text: 'Tu\u1ea7n tr\u01b0\u1edbc xu\u1ed1ng BV \u0110\u1ed3ng
          + H\u1ef7 kh\u00e1m, si\u00eau \u00e2m th\u1ea5y c\u1ee5c g\u00ec \u1edf tuy\u1ebfn gi\u00e1p, r\u1ed
          +3i chuy\u1ec3n l\u00ean tuy\u1ebfn tr\u00ean.' },                                                   
      291 +  { t: 29500, type: 'fieldB', id: 'qtbl', text: qtblStages[2] },                                    
      292 +                                                                                                    
      293 +  // === Turns 5-6: Medical + allergy history -> tiensu ===                                         
      294 +  { t: 33500, type: 'chat', role: 'a', text: 'Ch\u1ecb tr\u01b0\u1edbc \u0111\u00e2y c\u00f3 m\u1eaf
          +c b\u1ec7nh g\u00ec kh\u00e1c kh\u00f4ng? Ti\u1ec3u \u0111\u01b0\u1eddng, huy\u1ebft \u00e1p, hay t\
          +u1eebng ph\u1ea3i m\u1ed5 x\u1ebb g\u00ec ch\u01b0a \u1ea1?' },                                     
      295 +  { t: 35500, type: 'chat', role: 'p', text: 'Kh\u00f4ng b\u1ec7nh g\u00ec, ch\u01b0a m\u1ed5. Hay b
          +\u1ecb \u0111au b\u1ee5ng tr\u00ean, \u1ee3 chua khi \u0103n cay, c\u1ea3 n\u0103m r\u1ed3i ch\u01b0
          +a kh\u00e1m.' },                                                                                    
      296 +  { t: 37000, type: 'chat', role: 'a', text: 'Ch\u1ecb c\u00f3 b\u1ecb d\u1ecb \u1ee9ng g\u00ec kh\u
          +00f4ng \u1ea1? Thu\u1ed1c hay th\u1ee9c \u0103n g\u00ec?' },                                        
      297 +  { t: 38500, type: 'chat', role: 'p', text: 'Kh\u00f4ng, t\u00f4i kh\u00f4ng b\u1ecb d\u1ecb \u1ee9
          +ng g\u00ec c\u1ea3.' },                                                                             
      298 +  { t: 39500, type: 'fieldB', id: 'tiensu' },                                                       
      299 +                                                                                                    
      300 +  // === Turn 7: Smoking / drinking ===                                                             
      301 +  { t: 42500, type: 'chat', role: 'a', text: 'Ch\u1ecb c\u00f3 h\u00fat thu\u1ed1c l\u00e1 kh\u00f4n
          +g? R\u01b0\u1ee3u bia th\u00ec sao \u1ea1?' },                                                      
      302 +  { t: 44500, type: 'chat', role: 'p', text: 'Thu\u1ed1c l\u00e1 kh\u00f4ng. R\u01b0\u1ee3u bia th\u
          +00ec li\u00ean hoan m\u1edbi u\u1ed1ng, 1-2 lon, th\u00e1ng 1-2 l\u1ea7n.' },                       
      303 +                                                                                                    
      304 +  // === Turn 8: Family history -> tiensuGD ===                                                     
      305 +  { t: 46500, type: 'chat', role: 'a', text: 'Trong gia \u0111\u00ecnh ch\u1ecb, c\u00f3 ai b\u1ecb 
          +b\u1ec7nh m\u00e3n t\u00ednh, ho\u1eb7c b\u1ec7nh v\u1ec1 h\u1ecdng, tuy\u1ebfn gi\u00e1p kh\u00f4ng
          + \u1ea1?' },                                                                                        
      306 +  { t: 48500, type: 'chat', role: 'p', text: 'B\u1ed1 b\u1ecb huy\u1ebft \u00e1p, u\u1ed1ng thu\u1ed
          +1c l\u00e2u r\u1ed3i. Ch\u1ecb g\u00e1i c\u1eaft amidan c\u00e1ch \u0111\u00e2y 5-6 n\u0103m.' },   
      307 +  { t: 50000, type: 'fieldB', id: 'tiensuGD' },                                                     
      308 +                                                                                                    
      309 +  // === Turns 9-10: Ear/nose/cough symptoms -> final qtbl update ===                               
      310 +  { t: 53000, type: 'chat', role: 'a', text: 'Ch\u1ecb c\u00f3 b\u1ecb ngh\u1eb9t m\u0169i, ch\u1ea3
          +y m\u0169i, \u00f9 tai, ho\u1eb7c \u0111au tai khi nu\u1ed1t kh\u00f4ng \u1ea1?' },                 
      311 +  { t: 55000, type: 'chat', role: 'p', text: 'M\u0169i b\u00ecnh th\u01b0\u1eddng. Tai kh\u00f4ng \u
          +00f9, m\u00e0 \u0111au h\u1ecdng n\u1eb7ng th\u00ec \u0111au nh\u00f3i l\u00ean tai.' },            
      312 +  { t: 56500, type: 'chat', role: 'a', text: 'Ch\u1ecb c\u00f3 hay b\u1ecb h\u00f4i mi\u1ec7ng kh\u0
          +0f4ng? Khi \u0111au h\u1ecdng c\u00f3 ho nhi\u1ec1u kh\u00f4ng \u1ea1?' },                          
      313 +  { t: 58500, type: 'chat', role: 'p', text: 'H\u00f4i mi\u1ec7ng th\u00ec c\u00f3, nh\u1ea5t l\u00e
          +0 s\u00e1ng d\u1eady. Ho th\u1ec9nh tho\u1ea3ng ban \u0111\u00eam, \u0111\u1edd m nh\u1ea7y tr\u1eaf
          +ng.' },                                                                                             
      314 +  { t: 60000, type: 'fieldB', id: 'qtbl' },                                                         
      315 +                                                                                                    
      316 +  // === Vital signs ===                                                                            
      317 +  { t: 62000, type: 'fieldA', id: 'mach' },                                                         
      318 +  { t: 62300, type: 'fieldA', id: 'nhietdo' },                                                      
      319 +  { t: 62600, type: 'fieldA', id: 'ha' },                                                           
      320 +  { t: 62900, type: 'fieldA', id: 'nhiptho' },                                                      
      321 +  { t: 63200, type: 'fieldA', id: 'cannang' },                                                      
      322 +  { t: 63700, type: 'chat', role: 'a', text: 'Em ghi nh\u1eadn sinh hi\u1ec7u \u1ed5n \u0111\u1ecbnh
          +. Ph\u1ea7n kh\u00e1m chuy\u00ean khoa s\u1ebd \u0111\u01b0\u1ee3c c\u1eadp nh\u1eadt khi b\u00e1c s
          +\u0129 kh\u00e1m tr\u1ef1c ti\u1ebfp t\u1ea1i vi\u1ec7n.' },                                        
      323 +                                                                                                    
      324 +  // === Turn 11: AI summary -> tomtat ===                                                          
      325 +  { t: 66000, type: 'chat', role: 'a', text: 'C\u1ea3m \u01a1n ch\u1ecb H\u1ed3ng \u0111\u00e3 chia 
          +s\u1ebb. Em \u0111\u00e3 ghi nh\u1eadn \u0111\u1ea7y \u0111\u1ee7 th\u00f4ng tin. B\u00e1c s\u0129 s
          +\u1ebd kh\u00e1m tr\u1ef1c ti\u1ebfp cho ch\u1ecb khi v\u00e0o vi\u1ec7n.' },                       
      326 +  { t: 68000, type: 'scroll', page: 3 },                                                            
      327 +  { t: 68500, type: 'fieldB', id: 'tomtat' },                                                       
      328 +                                                                                                    
      329 +  // === Triage ===                                                                                 
      330 +  { t: 76000, type: 'triage' },                                                                     
      331 +  { t: 77500, type: 'banner', text: '\u23f8 \u0110ang ch\u1edd b\u00e1c s\u0129 duy\u1ec7t \u00b7 B\
          +u1ea5m \u2713 \u270e \u2717 tr\u00ean c\u00e1c \u00f4 v\u00e0ng (ho\u1eb7c ph\u00edm A \u0111\u1ec3 
          +duy\u1ec7t h\u1ebft)' }                                                                             
      332  ];
      333  
      334  // ---------- ENGINE ----------
     ...
      345  function run(e) {
      346    if (e.type === 'chat') addBubble(e.role, e.text);
      347    else if (e.type === 'fieldA') fillA(e.id);
      266 -  else if (e.type === 'fieldB') typeB(e.id);                                                        
      348 +  else if (e.type === 'fieldB') typeB(e.id, e.text);                                                
      349    else if (e.type === 'scroll') scrollToPage(e.page);
      350    else if (e.type === 'triage') document.getElementById('triage').classList.add('show');
      351    else if (e.type === 'banner') showBanner(e.text);
      352  }
      353  
      354  function scrollToPage(p) {
      273 -  const page = scroll.querySelector(`.pdf-page[data-page="${p}"]`);                                 
      355 +  const page = scroll.querySelector('.pdf-page[data-page="' + p + '"]');                            
      356    if (page) page.scrollIntoView({ behavior: 'smooth', block: 'start' });
      275 -  document.getElementById('pageInfo').textContent = `Trang ${p}/4`;                                 
      357 +  document.getElementById('pageInfo').textContent = 'Trang ' + p + '/4';                            
      358  }
      359  
      360  function addBubble(role, text) {
     ...
      392    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      393  }
      394  
      313 -function typeB(id) {                                                                                
      395 +function typeB(id, targetText) {                                                                    
      396    const el = fieldEls[id];
      397    if (!el) return;
      398    const slot = el.querySelector('.text-slot');
      317 -  const full = groupB[id];                                                                          
      318 -  let i = 0;                                                                                        
      399 +  const currentText = slot.textContent || '';                                                       
      400 +  const full = targetText || groupB[id];                                                            
      401 +                                                                                                    
      402 +  // Reset review state on update                                                                   
      403 +  el.classList.remove('approved', 'rejected', 'edited');                                            
      404 +  el.classList.add('pending');                                                                      
      405 +                                                                                                    
      406 +  // Delta typing: only type new characters                                                         
      407 +  const startIdx = currentText.length;                                                              
      408 +  if (startIdx >= full.length) return;                                                              
      409 +                                                                                                    
      410 +  let i = startIdx;                                                                                 
      411    el.classList.add('filling');
      412    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      413    const iv = setInterval(() => {
     ...
      441    el.classList.add('edited', 'pending');
      442    slot.contentEditable = 'true';
      443    slot.focus();
      352 -  // place cursor at end                                                                            
      353 -  const r = document.createRange(); r.selectNodeContents(slot); r.collapse(false);                  
      354 -  const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);                        
      444 +  var r = document.createRange(); r.selectNodeContents(slot); r.collapse(false);                    
      445 +  var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);                          
      446    updateCounter();
      447  };
      448  function updateCounter() {
      358 -  const pending = document.querySelectorAll('.field.b.pending, .field.b.edited').length;            
      359 -  const counter = document.getElementById('counter');                                               
      360 -  const btn = document.getElementById('exportBtn');                                                 
      449 +  var pending = document.querySelectorAll('.field.b.pending, .field.b.edited').length;              
      450 +  var counter = document.getElementById('counter');                                                 
      451 +  var btn = document.getElementById('exportBtn');                                                   
      452    if (pending === 0) {
      362 -    counter.textContent = '✓ Đã duyệt hết';                                                         
      453 +    counter.textContent = '\u2713 \u0110\u00e3 duy\u1ec7t h\u1ebft';                                
      454      counter.classList.add('done');
      455      btn.disabled = false;
      456      btn.classList.add('ready');
      457    } else {
      367 -    counter.textContent = `Còn ${pending} mục cần duyệt`;                                           
      458 +    counter.textContent = 'C\u00f2n ' + pending + ' m\u1ee5c c\u1ea7n duy\u1ec7t';                  
      459      counter.classList.remove('done');
      460      btn.disabled = true;
      461      btn.classList.remove('ready');
      462    }
      463  }
      464  function showBanner(text) {
      374 -  const b = document.getElementById('banner');                                                      
      465 +  var b = document.getElementById('banner');                                                        
      466    b.textContent = text;
      467    b.classList.add('show');
      468    updateCounter();
      469  }
      470  
      471  // Export
      381 -document.getElementById('exportBtn').onclick = () => {                                              
      382 -  const toast = document.getElementById('toast');                                                   
      472 +document.getElementById('exportBtn').onclick = function() {                                         
      473 +  var toast = document.getElementById('toast');                                                     
      474    toast.classList.add('show');
      384 -  setTimeout(() => toast.classList.remove('show'), 3000);                                           
      475 +  setTimeout(function() { toast.classList.remove('show'); }, 3000);                                 
      476  };
      477  
      478 +// ---------- PLAYBACK CONTROLS ----------                                                          
      479 +function togglePause() {                                                                            
      480 +  if (playing) {                                                                                    
      481 +    pauseStart = performance.now();                                                                 
      482 +    playing = false;                                                                                
      483 +    document.getElementById('btnPause').textContent = '\u25b6';                                     
      484 +    document.getElementById('btnPause').classList.add('active');                                    
      485 +  } else {                                                                                          
      486 +    pauseOffset += performance.now() - pauseStart;                                                  
      487 +    playing = true;                                                                                 
      488 +    document.getElementById('btnPause').textContent = '\u23f8';                                     
      489 +    document.getElementById('btnPause').classList.remove('active');                                 
      490 +    requestAnimationFrame(tick);                                                                    
      491 +  }                                                                                                 
      492 +}                                                                                                   
      493 +document.getElementById('btnPause').onclick = togglePause;                                          
      494 +document.getElementById('btnReplay').onclick = function() { location.reload(); };                   
      495 +                                                                                                    
      496  // ---------- EDIT MODE (drag to calibrate) ----------
      388 -let editOn = new URLSearchParams(location.search).has('edit');                                      
      497 +var editOn = new URLSearchParams(location.search).has('edit');                                      
      498  function applyEditMode() { document.body.classList.toggle('edit-mode', editOn); }
      499  applyEditMode();
      500  
      392 -let drag = null;                                                                                    
      393 -document.addEventListener('mousedown', ev => {                                                      
      501 +var drag = null;                                                                                    
      502 +document.addEventListener('mousedown', function(ev) {                                               
      503    if (!editOn) return;
      395 -  const f = ev.target.closest('.field');                                                            
      504 +  var f = ev.target.closest('.field');                                                              
      505    if (!f) return;
      506    ev.preventDefault();
      398 -  const host = f.parentElement;                                                                     
      399 -  const hostR = host.getBoundingClientRect();                                                       
      400 -  drag = { el: f, host, hostR, dx: ev.clientX - f.getBoundingClientRect().left, dy: ev.clientY - f.g
          -etBoundingClientRect().top };                                                                       
      507 +  var host = f.parentElement;                                                                       
      508 +  var hostR = host.getBoundingClientRect();                                                         
      509 +  drag = { el: f, host: host, hostR: hostR, dx: ev.clientX - f.getBoundingClientRect().left, dy: ev.
          +clientY - f.getBoundingClientRect().top };                                                          
      510  });
      402 -document.addEventListener('mousemove', ev => {                                                      
      511 +document.addEventListener('mousemove', function(ev) {                                               
      512    if (!drag) return;
      404 -  const { el, hostR, dx, dy } = drag;                                                               
      405 -  const leftPx = ev.clientX - hostR.left - dx;                                                      
      406 -  const topPx = ev.clientY - hostR.top - dy;                                                        
      513 +  var el = drag.el, hostR = drag.hostR, dx = drag.dx, dy = drag.dy;                                 
      514 +  var leftPx = ev.clientX - hostR.left - dx;                                                        
      515 +  var topPx = ev.clientY - hostR.top - dy;                                                          
      516    el.style.left = (leftPx / hostR.width * 100).toFixed(2) + '%';
      517    el.style.top = (topPx / hostR.height * 100).toFixed(2) + '%';
      518  });
      410 -document.addEventListener('mouseup', () => { drag = null; });                                       
      519 +document.addEventListener('mouseup', function() { drag = null; });                                  
      520  
      521  function dumpCoords() {
      413 -  const out = FIELDS.map(f => {                                                                     
      414 -    const el = fieldEls[f.id];                                                                      
      522 +  var out = FIELDS.map(function(f) {                                                                
      523 +    var el = fieldEls[f.id];                                                                        
      524      return {
      525        id: f.id, group: f.group, page: f.page,
      526        top: +parseFloat(el.style.top).toFixed(2),
     ...
      530    });
      531    console.log('// Paste into FIELDS array:');
      532    console.log(JSON.stringify(out, null, 2));
      424 -  navigator.clipboard?.writeText(JSON.stringify(out, null, 2));                                     
      533 +  if (navigator.clipboard) navigator.clipboard.writeText(JSON.stringify(out, null, 2));             
      534    alert('Coords dumped to console + clipboard');
      535  }
      536  
      537  // ---------- KEYS ----------
      429 -document.addEventListener('keydown', e => {                                                         
      538 +document.addEventListener('keydown', function(e) {                                                  
      539    if (e.target.isContentEditable) return;
      431 -  if (e.code === 'Space') {                                                                         
      432 -    e.preventDefault();                                                                             
      433 -    if (playing) { pauseStart = performance.now(); playing = false; }                               
      434 -    else { pauseOffset += performance.now() - pauseStart; playing = true; requestAnimationFrame(tick
          -); }                                                                                                
      435 -  }                                                                                                 
      540 +  if (e.code === 'Space') { e.preventDefault(); togglePause(); }                                    
      541    if (e.code === 'KeyR') location.reload();
      437 -  if (e.code === 'KeyA') document.querySelectorAll('.field.b.pending, .field.b.edited').forEach(f =>
          - approve(f.dataset.id));                                                                            
      542 +  if (e.code === 'KeyA') document.querySelectorAll('.field.b.pending, .field.b.edited').forEach(func
          +tion(f) { approve(f.dataset.id); });                                                                
      543    if (e.code === 'KeyE') { editOn = !editOn; applyEditMode(); }
      544    if (e.code === 'KeyS' && editOn) { e.preventDefault(); dumpCoords(); }
      545  });
      546  
      547  // Track which page is visible on scroll (update pageInfo)
      443 -const io = new IntersectionObserver(entries => {                                                    
      444 -  entries.forEach(en => {                                                                           
      548 +var io = new IntersectionObserver(function(entries) {                                               
      549 +  entries.forEach(function(en) {                                                                    
      550      if (en.isIntersecting) {
      446 -      document.getElementById('pageInfo').textContent = `Trang ${en.target.dataset.page}/4`;        
      551 +      document.getElementById('pageInfo').textContent = 'Trang ' + en.target.dataset.page + '/4';   
      552      }
      553    });
      554  }, { threshold: 0.5 });
      450 -document.querySelectorAll('.pdf-page').forEach(p => io.observe(p));                                 
      555 +document.querySelectorAll('.pdf-page').forEach(function(p) { io.observe(p); });                     
      556  
      557  requestAnimationFrame(tick);
      558  </script>

⏺ Let me verify the file and fix any issues with the Vietnamese text encoding. I used Unicode escapes which may have
  spacing issues.                                                                         

  Read 1 file (ctrl+o to expand)                                                                                      
                                                                                          
⏺ I see a bug - "Ho \u0111\u1edd m nh\u1ea7y" has a stray space (should be "đờm" not "đờ m"). Let me fix this and also
   rewrite the Vietnamese strings as readable UTF-8 for maintainability.                                              
                                                                                                                      
  Read 1 file (ctrl+o to expand)                                                                                      
                                                                                                                      
⏺ Good, the structure is solid. Let me fix the "đờ m" → "đờm" typo in three places.                                   
                                                                                                                      
⏺ Update(demo.html)                                                                                                   
  ⎿  Added 1 line, removed 1 line                                                                                     
      193  };                                                                                                         
      194  const groupB = {                                                                                           
      195    lydo: 'Nu\u1ed1t v\u01b0\u1edbng',                                                                       
      196 -  qtbl: '\u0110au h\u1ecdng t\u00e1i ph\u00e1t nhi\u1ec1u n\u0103m, kho\u1ea3ng 5-6 \u0111\u1ee3t/n\       
          -u0103m k\u00e8m s\u1ed1t. T\u1ef1 mua kh\u00e1ng sinh \u0111i\u1ec1u tr\u1ecb t\u1eebng \u0111\u1ee3     
          -t, kh\u1ecfi r\u1ed3i t\u00e1i l\u1ea1i. \u0110\u1ee3t n\u00e0y nu\u1ed1t v\u01b0\u1edbng t\u0103ng        
          -r\u00f5 (ngh\u1eb9n khi \u0103n), ch\u01b0a d\u00f9ng thu\u1ed1c. Ng\u1ee7 ng\u00e1y to h\u00e0ng \u     
          -0111\u00eam, gi\u1eadt m\u00ecnh t\u1ec9nh gi\u1ea5c k\u00e8m t\u1ee9c ng\u1ef1c, kh\u00f3 th\u1edf.
          - Gi\u1ecdng n\u00f3i ch\u01b0a thay \u0111\u1ed5i. Kh\u00e1m BV \u0110\u1ed3ng H\u1ef7: S\u00c2 tuy\
          -u1ebfn gi\u00e1p \u2192 nh\u00e2n th\u00f9y ph\u1ea3i (TIRADS 1), nh\u00e2n th\u00f9y tr\u00e1i (TIR
          -ADS 3) \u2192 chuy\u1ec3n BV TW Th\u00e1i Nguy\u00ean. H\u01a1i th\u1edf h\u00f4i dai d\u1eb3ng. Ho 
          -\u0111\u1edd m nh\u1ea7y tr\u1eafng v\u1ec1 \u0111\u00eam (nh\u1eb9). \u0110au nh\u00f3i lan l\u00ea
          -n tai trong \u0111\u1ee3t vi\u00eam h\u1ecdng c\u1ea5p. Tai m\u0169i kh\u00f4ng tri\u1ec7u ch\u1ee9n
          -g kh\u00e1c.',                                                                                      
      196 +  qtbl: '\u0110au h\u1ecdng t\u00e1i ph\u00e1t nhi\u1ec1u n\u0103m, kho\u1ea3ng 5-6 \u0111\u1ee3t/n\
          +u0103m k\u00e8m s\u1ed1t. T\u1ef1 mua kh\u00e1ng sinh \u0111i\u1ec1u tr\u1ecb t\u1eebng \u0111\u1ee3
          +t, kh\u1ecfi r\u1ed3i t\u00e1i l\u1ea1i. \u0110\u1ee3t n\u00e0y nu\u1ed1t v\u01b0\u1edbng t\u0103ng 
          +r\u00f5 (ngh\u1eb9n khi \u0103n), ch\u01b0a d\u00f9ng thu\u1ed1c. Ng\u1ee7 ng\u00e1y to h\u00e0ng \u
          +0111\u00eam, gi\u1eadt m\u00ecnh t\u1ec9nh gi\u1ea5c k\u00e8m t\u1ee9c ng\u1ef1c, kh\u00f3 th\u1edf.
          + Gi\u1ecdng n\u00f3i ch\u01b0a thay \u0111\u1ed5i. Kh\u00e1m BV \u0110\u1ed3ng H\u1ef7: S\u00c2 tuy\
          +u1ebfn gi\u00e1p \u2192 nh\u00e2n th\u00f9y ph\u1ea3i (TIRADS 1), nh\u00e2n th\u00f9y tr\u00e1i (TIR
          +ADS 3) \u2192 chuy\u1ec3n BV TW Th\u00e1i Nguy\u00ean. H\u01a1i th\u1edf h\u00f4i dai d\u1eb3ng. Ho 
          +\u0111\u1eddm nh\u1ea7y tr\u1eafng v\u1ec1 \u0111\u00eam (nh\u1eb9). \u0110au nh\u00f3i lan l\u00ean
          + tai trong \u0111\u1ee3t vi\u00eam h\u1ecdng c\u1ea5p. Tai m\u0169i kh\u00f4ng tri\u1ec7u ch\u1ee9ng
          + kh\u00e1c.',                                                                                       
      197    tiensu: 'Kh\u00f4ng ti\u1ec1n s\u1eed PT. Kh\u00f4ng T\u0110, THA. Ph\u00e1t tri\u1ec3n th\u1ec3 l
           \u1ef1c b\u00ecnh th\u01b0\u1eddng. \u0110au th\u01b0\u1ee3ng v\u1ecb, \u1ee3 chua khi \u0103n cay ~
           1 n\u0103m, ch\u01b0a kh\u00e1m ti\u00eau h\u00f3a. D\u1ecb \u1ee9ng: Kh\u00f4ng. Thu\u1ed1c l\u00e1
           : Kh\u00f4ng. R\u01b0\u1ee3u bia: x\u00e3 giao 1-2 lon/l\u1ea7n, 1-2 l\u1ea7n/th\u00e1ng. Ma t\u00fa
           y: Kh\u00f4ng.',
      198    tiensuGD: 'B\u1ed1 THA (\u0111ang \u0111i\u1ec1u tr\u1ecb). Ch\u1ecb g\u00e1i c\u1eaft amidan (~5-
           6 n\u0103m tr\u01b0\u1edbc). M\u1eb9 kh\u1ecfe. Kh\u00f4ng b\u1ec7nh l\u00fd tuy\u1ebfn gi\u00e1p gi
           a \u0111\u00ecnh.',
      199    khamck: '',

⏺ Update(demo.html)                                             
  ⎿  Added 1 line, removed 1 line                                                         
      197    tiensu: 'Kh\u00f4ng ti\u1ec1n s\u1eed PT. Kh\u00f4ng T\u0110, THA. Ph\u00e1t tri\u1ec3n th\u1ec3 l
           \u1ef1c b\u00ecnh th\u01b0\u1eddng. \u0110au th\u01b0\u1ee3ng v\u1ecb, \u1ee3 chua khi \u0103n cay ~       
           1 n\u0103m, ch\u01b0a kh\u00e1m ti\u00eau h\u00f3a. D\u1ecb \u1ee9ng: Kh\u00f4ng. Thu\u1ed1c l\u00e1
           : Kh\u00f4ng. R\u01b0\u1ee3u bia: x\u00e3 giao 1-2 lon/l\u1ea7n, 1-2 l\u1ea7n/th\u00e1ng. Ma t\u00fa       
           y: Kh\u00f4ng.',                                                                                         
      198    tiensuGD: 'B\u1ed1 THA (\u0111ang \u0111i\u1ec1u tr\u1ecb). Ch\u1ecb g\u00e1i c\u1eaft amidan (~5-       
           6 n\u0103m tr\u01b0\u1edbc). M\u1eb9 kh\u1ecfe. Kh\u00f4ng b\u1ec7nh l\u00fd tuy\u1ebfn gi\u00e1p gi     
           a \u0111\u00ecnh.',
      199    khamck: '',
      200 -  tomtat: 'BN n\u1eef, 48 tu\u1ed5i, \u0111\u1ebfn vi\u1ec7n v\u00ec nu\u1ed1t v\u01b0\u1edbng. \u01
          -10au h\u1ecdng s\u1ed1t t\u00e1i ph\u00e1t ~5-6 \u0111\u1ee3t/n\u0103m, t\u1ef1 mua kh\u00e1ng sinh.
          - \u0110\u1ee3t n\u00e0y nu\u1ed1t v\u01b0\u1edbng t\u0103ng r\u00f5, ngh\u1eb9n khi \u0103n, ng\u1ee
          -7 ng\u00e1y to, gi\u1eadt m\u00ecnh kh\u00f3 th\u1edf khi ng\u1ee7. H\u01a1i th\u1edf h\u00f4i dai d
          -\u1eb3ng, ho \u0111\u1edd m nh\u1ea7y tr\u1eafng nh\u1eb9 v\u1ec1 \u0111\u00eam. \u0110au nh\u00f3i 
          -lan tai khi vi\u00eam h\u1ecdng c\u1ea5p. TS: \u0111au th\u01b0\u1ee3ng v\u1ecb \u1ee3 chua ~1 n\u01
          -03m. Gia \u0111\u00ecnh: b\u1ed1 THA, ch\u1ecb c\u1eaft amidan. Kh\u00e1m BV \u0110\u1ed3ng H\u1ef7:
          - S\u00c2 tuy\u1ebfn gi\u00e1p nh\u00e2n th\u00f9y ph\u1ea3i TIRADS 1, nh\u00e2n th\u00f9y tr\u00e1i 
          -TIRADS 3 \u2192 chuy\u1ec3n tuy\u1ebfn tr\u00ean.',                                                 
      200 +  tomtat: 'BN n\u1eef, 48 tu\u1ed5i, \u0111\u1ebfn vi\u1ec7n v\u00ec nu\u1ed1t v\u01b0\u1edbng. \u01
          +10au h\u1ecdng s\u1ed1t t\u00e1i ph\u00e1t ~5-6 \u0111\u1ee3t/n\u0103m, t\u1ef1 mua kh\u00e1ng sinh.
          + \u0110\u1ee3t n\u00e0y nu\u1ed1t v\u01b0\u1edbng t\u0103ng r\u00f5, ngh\u1eb9n khi \u0103n, ng\u1ee
          +7 ng\u00e1y to, gi\u1eadt m\u00ecnh kh\u00f3 th\u1edf khi ng\u1ee7. H\u01a1i th\u1edf h\u00f4i dai d
          +\u1eb3ng, ho \u0111\u1eddm nh\u1ea7y tr\u1eafng nh\u1eb9 v\u1ec1 \u0111\u00eam. \u0110au nh\u00f3i l
          +an tai khi vi\u00eam h\u1ecdng c\u1ea5p. TS: \u0111au th\u01b0\u1ee3ng v\u1ecb \u1ee3 chua ~1 n\u010
          +3m. Gia \u0111\u00ecnh: b\u1ed1 THA, ch\u1ecb c\u1eaft amidan. Kh\u00e1m BV \u0110\u1ed3ng H\u1ef7: 
          +S\u00c2 tuy\u1ebfn gi\u00e1p nh\u00e2n th\u00f9y ph\u1ea3i TIRADS 1, nh\u00e2n th\u00f9y tr\u00e1i T
          +IRADS 3 \u2192 chuy\u1ec3n tuy\u1ebfn tr\u00ean.',                                                  
      201    huongdt: ''
      202  };
      203  

⏺ Update(demo.html)                                             
  ⎿  Added 1 line, removed 1 line                                                         
      310    { t: 53000, type: 'chat', role: 'a', text: 'Ch\u1ecb c\u00f3 b\u1ecb ngh\u1eb9t m\u0169i, ch\u1ea3
           y m\u0169i, \u00f9 tai, ho\u1eb7c \u0111au tai khi nu\u1ed1t kh\u00f4ng \u1ea1?' },                        
      311    { t: 55000, type: 'chat', role: 'p', text: 'M\u0169i b\u00ecnh th\u01b0\u1eddng. Tai kh\u00f4ng \u
           00f9, m\u00e0 \u0111au h\u1ecdng n\u1eb7ng th\u00ec \u0111au nh\u00f3i l\u00ean tai.' },                   
      312    { t: 56500, type: 'chat', role: 'a', text: 'Ch\u1ecb c\u00f3 hay b\u1ecb h\u00f4i mi\u1ec7ng kh\u0     
           0f4ng? Khi \u0111au h\u1ecdng c\u00f3 ho nhi\u1ec1u kh\u00f4ng \u1ea1?' },                                 
      313 -  { t: 58500, type: 'chat', role: 'p', text: 'H\u00f4i mi\u1ec7ng th\u00ec c\u00f3, nh\u1ea5t l\u00e     
          -0 s\u00e1ng d\u1eady. Ho th\u1ec9nh tho\u1ea3ng ban \u0111\u00eam, \u0111\u1edd m nh\u1ea7y tr\u1eaf
          -ng.' },                                                                                             
      313 +  { t: 58500, type: 'chat', role: 'p', text: 'H\u00f4i mi\u1ec7ng th\u00ec c\u00f3, nh\u1ea5t l\u00e
          +0 s\u00e1ng d\u1eady. Ho th\u1ec9nh tho\u1ea3ng ban \u0111\u00eam, \u0111\u1eddm nh\u1ea7y tr\u1eafn
          +g.' },                                                                                              
      314    { t: 60000, type: 'fieldB', id: 'qtbl' },