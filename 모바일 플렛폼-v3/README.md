# FireNavi v3.0 — Mobile (Smartphone-First) 폴더

> **v3.0 Pivot Edition** | **2026-05-26** | **심재우**
> 이 폴더는 FireNavi v3.0 — 스마트폰 우선 SaaS 모델 — 의 모든 자료를 담고 있습니다.
> 기존 v2.0 자료(상위 폴더)는 그대로 보존되어 있으며, 청중에 따라 함께 사용합니다.

---

## 📂 폴더 구조 (평탄형)

```
Mobile/
├── README.md                                            ← (본 파일)
├── FireNavi_AI_Champion_Master_Proposal.md  ★★★          ← AI 챔피언 통합 마스터 기획서 (50p)
├── firenavi-v3-master.html                  ★★★          ← v3.0 통합본 HTML 시각화
├── firenavi-v3-slides.html                  ★★           ← 발표 슬라이드 20장 (← → 키로 진행)
├── smartphone-poc.html                      ★★           ← 작동 PoC 데모 (격자+30유형+속도조절+발화점선택)
├── smartphone_first_architecture.md                     ← v3.0 마스터 아키텍처 (5단계 파이프라인)
├── 구현제안서_v3_스마트폰우선.md                          ← 풀버전 제안서
├── 구현제안서_v3_5페이지요약.md                          ← 5페이지 요약본
├── PIVOT_v2_to_v3.md                                    ← v2→v3 피벗·청중별 가이드
├── Patents_v3_README.md                                 ← 신규 특허 4건 인덱스
├── Patent_A_Acoustic_Auto_Trigger.md                    ← 특허 A — 음향 자동 트리거
├── Patent_B_Crowdsourced_Fire_Map.md                    ← 특허 B — 크라우드소싱 화재맵
├── Patent_C_Conversational_Micro_Survey.md              ← 특허 C — 마이크로 설문
├── Patent_D_Infrastructure_Free_Indoor_Positioning.md   ← 특허 D — 인프라프리 측위
├── build_pdf.js                                         ← PDF 일괄 변환 빌드 스크립트
└── pdf/                                     ★★           ← 14개 PDF 일괄 생성본
    ├── FireNavi_AI_Champion_Master_Proposal.pdf  (3.2 MB)
    ├── firenavi-v3-master.pdf                    (1.7 MB)
    ├── firenavi-v3-slides.pdf                    (200 KB · 가로형)
    ├── smartphone-poc.pdf                        (1.1 MB)
    ├── smartphone_first_architecture.pdf         (980 KB)
    ├── 구현제안서_v3_스마트폰우선.pdf              (1.2 MB)
    ├── 구현제안서_v3_5페이지요약.pdf              (837 KB)
    ├── PIVOT_v2_to_v3.pdf                        (346 KB)
    ├── Patent_A~D 4건                            (각 200~250 KB)
    ├── Patents_v3_README.pdf                     (160 KB)
    └── README.pdf                                (520 KB)
```

## 🌐 독립 사이트 (site/) — 화이트 프리미엄 테마

| 페이지 | 파일 | 분량 | 분대 |
|--------|------|------|------|
| **홈** | `site/index.html` | 24KB | 분대장 |
| **기술** (5단계 + 13수학모델) | `site/technology.html` | 44KB | 알파 |
| **30유형 보호** | `site/disability.html` | 72KB | 델타 |
| **특허 9건** | `site/patents.html` | 40KB | 브라보 |
| **v2→v3 차별성** | `site/comparison.html` | 36KB | 찰리 |
| **시장·팀·로드맵** | `site/business.html` | 44KB | 에코 |
| 디자인 시스템 | `site/css/theme.css` | 20KB | 공통 |
| 공통 nav/footer | `site/js/common.js` | 8KB | 공통 |

🎨 **테마**: 화이트 프리미엄 — Bordeaux(#B91C1C) × Royal Navy(#0F1E3D) × Champagne Gold(#C9A961) on Warm Cream
🚪 **진입**: `site/index.html` 더블클릭 → 모든 페이지 네비게이션 작동
📱 **반응형**: 모바일 햄버거 메뉴, 카드 자동 1열 전환

## 🎯 빠른 진입점

| 청중 | 시작 파일 |
|------|----------|
| AI 챔피언 심사위원 | `firenavi-v3-master.html` (시각화) → `firenavi-v3-slides.html` (발표) |
| 즉시 시연 | `smartphone-poc.html` (브라우저에서 더블클릭) |
| 정독·인쇄 | `pdf/FireNavi_AI_Champion_Master_Proposal.pdf` (통합 50페이지) |
| 5분 요약 | `pdf/구현제안서_v3_5페이지요약.pdf` |
| 특허 검토 | `pdf/Patent_A~D` |

---

## 🎯 핵심 변경 요약 (v2.0 → v3.0)

| 항목 | v2.0 Hardware Model | v3.0 Smartphone-First |
|------|---------------------|-----------------------|
| 설치비 | $1.1~1.7M/척 | **$50K** (-95%) |
| 드라이독 | 14~30일 | **0일** |
| 신규 하드웨어 | IoT 500개 + 디바이스 6,000개 + Edge | **0개** (Edge 1대만) |
| 데이터 포인트 | 500 | **28,000+** (×56) |
| 시장 진입 | 5~10년 | **6~12개월** |
| TAM | $18B | **$208B** (×11.5) |
| 특허 | 5건 | **9건** (알고리즘 5 + 시스템 4) |

---

## 🚀 5단계 파이프라인

```
[Stage 1] 음향 자동 트리거 (SOLAS 화재경보음 → 4,000대 폰 동시 활성화)
              ↓
[Stage 2] 인프라프리 분산 측위 (기존 WiFi + IMU → 1~3m)
              ↓
[Stage 3] 대화형 마이크로 설문 (3문항 × 3초)
              ↓
[Stage 4] 패시브 폰 센서 (마이크/IMU/조도/기압 자동)
              ↓
[Stage 5] 베이지안 화재맵 + 적응 경로 (5초 갱신)
```

---

## 📖 자료 사용 가이드 (청중별)

| 청중 | 추천 자료 |
|------|----------|
| AI 챔피언 심사위원 | `구현제안서_v3_5페이지요약.md` + `smartphone-poc.html` 시연 |
| 크루즈 선사·조선소 | 상위 폴더 `total_firenavi.md` (학술) + `구현제안서_v3_스마트폰우선.md` (즉시 도입) |
| 종합병원·호텔·빌딩 | `구현제안서_v3_5페이지요약.md` + `smartphone-poc.html` |
| 보험사 | 상위 폴더 `pages/d-insurance-risk-model.html` + 본 폴더 4장 |
| 투자자 | `구현제안서_v3_5페이지요약.md` + `PIVOT_v2_to_v3.md` |

---

## 💡 PoC 데모 실행 방법

1. `smartphone-poc.html` 을 브라우저에서 엽니다 (더블클릭).
2. **"🎙️ 마이크 권한 + 음량 감지 테스트"** 클릭 → 실제 마이크로 음향 감지 작동 시연
3. **"🚨 화재 발생 시뮬레이션 시작"** 클릭 → 5단계 파이프라인 시각화
4. 화면 우측에 실시간 통계, 우하단에 마이크로 설문 알림 표시
5. 4채널 베이지안 화재맵 + 개인별 경로 + 출구 자동 분산 확인

---

## 🔗 상위 폴더 (v2.0) 자산 연계

본 폴더의 v3.0 자료는 상위 폴더의 v2.0 자료와 함께 사용합니다.

| v2.0 자산 (상위 폴더) | v3.0에서의 역할 |
|---------------------|---------------|
| `total_firenavi.md` | 학술·알고리즘 깊이 |
| `pages/simulation.html` | v3.0 Stage 5 시연용 |
| `pages/risk-map.html` | 동적 위험맵 시각화 |
| `pages/route-optimizer.html` | 개인 경로 비교 |
| `pages/d-insurance-risk-model.html` | 보험 리스크 (그대로 유효) |
| 기존 알고리즘 특허 5건 | v3.0 시스템 특허 4건과 합쳐 9건 |

자세한 청중별 사용 매뉴얼 → `PIVOT_v2_to_v3.md`

---

**"이미 들고 있는 폰이, 가장 강력한 안전망이 됩니다."**

**FireNavi v3.0** — Smartphone-First · AI-Driven · Crowdsourced Survival 🚀
