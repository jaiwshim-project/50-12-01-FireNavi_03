const { Document, Packer, Paragraph, Table, TableCell, TableRow, AlignmentType, BorderStyle, VerticalAlign, TextRun, HeadingLevel } = require('docx');
const fs = require('fs');
const path = require('path');

// 스타일 정의
const heading1Style = { style: 'heading1', size: 32, bold: true, color: '1F2937', spacing: { after: 200 } };
const heading2Style = { style: 'heading2', size: 28, bold: true, color: '374151', spacing: { after: 120 } };
const heading3Style = { style: 'heading3', size: 24, bold: true, color: '4B5563', spacing: { after: 100 } };
const normalText = { size: 22, color: '1F2937', spacing: { after: 100 } };

// 표 스타일 유틸
function createTableCell(text, options = {}) {
  return new TableCell({
    children: [new Paragraph({
      text: text,
      size: 20,
      ...options
    })],
    borders: { all: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE } },
    shading: options.shading,
    verticalAlign: VerticalAlign.CENTER
  });
}

const doc = new Document({
  sections: [{
    children: [
      // ========== 타이틀 ==========
      new Paragraph({
        text: 'FireNavi: AI 주도형 실시간 화재 대피 및 안전 플랫폼',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        ...heading1Style
      }),
      new Paragraph({
        text: 'AI 챔피언 대회 공식 제안서',
        alignment: AlignmentType.CENTER,
        size: 24,
        color: '6B7280',
        spacing: { after: 400 }
      }),

      // ========== 1. 일반 사항 ==========
      new Paragraph({
        text: '1. 일반 사항',
        heading: HeadingLevel.HEADING_1,
        ...heading1Style
      }),

      new Paragraph({
        text: '1.1 기술명',
        heading: HeadingLevel.HEADING_2,
        ...heading2Style
      }),
      new Paragraph({
        text: 'FireNavi (화이어내비) — 3개 AI 엔진 기반 실시간 생존 의사결정 플랫폼',
        ...normalText
      }),

      new Paragraph({
        text: '1.2 하드웨어 포함여부',
        heading: HeadingLevel.HEADING_2,
        ...heading2Style
      }),
      new Paragraph({
        text: '☑ 예(Yes) — IoT 센서(온도, CO, 연기 감지기) + WiFi 위치추적 + Priority Rescue Device',
        ...normalText
      }),

      new Paragraph({
        text: '1.3 활용 분야',
        heading: HeadingLevel.HEADING_2,
        ...heading2Style
      }),
      new Paragraph({
        text: '• 범용 재난 대피 시스템 — 크루즈선, 고층 건물, 지하철, 대형 쇼핑몰',
        ...normalText
      }),
      new Paragraph({
        text: '• 보험 리스크 평가 — 동적 보험료 책정, 손실 예측',
        ...normalText
      }),
      new Paragraph({
        text: '• 공공 안전 — IMO/SOLAS 국제 규정 준수',
        ...normalText
      }),
      new Paragraph({
        text: '• 보안 모니터링 — 보안 구역 침입 감지, 동선 분석',
        ...normalText,
        spacing: { after: 120 }
      }),

      new Paragraph({
        text: '1.4 기술 성숙도',
        heading: HeadingLevel.HEADING_2,
        ...heading2Style
      }),
      new Paragraph({
        text: '☑ 시작품 단계 (TRL5~6) — HTML5 프로토타입 완성, 시뮬레이션 데이터 기반 성능 검증',
        ...normalText,
        spacing: { after: 120 }
      }),
      new Paragraph({
        text: '설명: 3개 AI 엔진의 수학 모델 및 알고리즘이 웹 기반 시뮬레이션(Canvas 2D)에 완전 구현되어 있으며, 6,000명 규모 시뮬레이션에서 목표 성능(11분 대피 시간) 달성. 현재 Edge Computing(Python/PyTorch) 백엔드 및 실선 센서 통합 단계 준비 중.',
        ...normalText,
        italics: true
      }),

      new Paragraph({
        text: '1.5 도입 수준',
        heading: HeadingLevel.HEADING_2,
        ...heading2Style
      }),
      new Paragraph({
        text: '☑ 도입전 — 기술 소개 및 시연 단계. 아직 실선 고객 없으나, 주요 조선소(Fincantieri, Meyer Werft) 협력 협의 단계',
        ...normalText
      }),

      new Paragraph({
        text: '1.6 유사 기술',
        heading: HeadingLevel.HEADING_2,
        ...heading2Style
      }),
      new Table({
        rows: [
          new TableRow({
            children: [
              createTableCell('기술명', { bold: true, shading: { fill: 'E5E7EB' } }),
              createTableCell('개발사', { bold: true, shading: { fill: 'E5E7EB' } }),
              createTableCell('특징', { bold: true, shading: { fill: 'E5E7EB' } }),
              createTableCell('FireNavi 대비', { bold: true, shading: { fill: 'E5E7EB' } }),
            ]
          }),
          new TableRow({
            children: [
              createTableCell('EVAC'),
              createTableCell('덴마크 DTU'),
              createTableCell('CFD 연기 확산'),
              createTableCell('CFD만 사용, 실시간성 부족')
            ]
          }),
          new TableRow({
            children: [
              createTableCell('Pathfinder'),
              createTableCell('Thunderhead'),
              createTableCell('군중 시뮬레이션'),
              createTableCell('군중만, 연기 미지원')
            ]
          }),
          new TableRow({
            children: [
              createTableCell('Legion'),
              createTableCell('Ramboll'),
              createTableCell('경로탐색 + 군중'),
              createTableCell('정적 경로, 미래 위험 미반영')
            ]
          }),
        ],
        width: { size: 100, type: 'pct' }
      }),

      new Paragraph({ text: '', spacing: { after: 200 } }),

      new Paragraph({
        text: '1.7 차별점',
        heading: HeadingLevel.HEADING_2,
        ...heading2Style
      }),

      new Table({
        rows: [
          new TableRow({
            children: [
              createTableCell('항목', { bold: true, shading: { fill: 'E5E7EB' } }),
              createTableCell('기존 시스템', { bold: true, shading: { fill: 'E5E7EB' } }),
              createTableCell('FireNavi', { bold: true, shading: { fill: 'E5E7EB' } }),
            ]
          }),
          new TableRow({
            children: [
              createTableCell('예측 방식'),
              createTableCell('사후 감지'),
              createTableCell('사전 예측 (60초 미래)')
            ]
          }),
          new TableRow({
            children: [
              createTableCell('AI 엔진 개수'),
              createTableCell('1~2개 최적화'),
              createTableCell('3개 엔진 통합')
            ]
          }),
          new TableRow({
            children: [
              createTableCell('기술 조합'),
              createTableCell('CFD 또는 딥러닝 중 1개'),
              createTableCell('CFD + LSTM + 강화학습 하이브리드')
            ]
          }),
          new TableRow({
            children: [
              createTableCell('개인 차별화'),
              createTableCell('전원 동일 경로'),
              createTableCell('6가지 유형 맞춤 경로')
            ]
          }),
          new TableRow({
            children: [
              createTableCell('취약계층 보호'),
              createTableCell('미지원'),
              createTableCell('Priority Rescue Device + α=2.0')
            ]
          }),
          new TableRow({
            children: [
              createTableCell('출구 분산'),
              createTableCell('최근접만'),
              createTableCell('전역 최적화')
            ]
          }),
          new TableRow({
            children: [
              createTableCell('충돌 해소'),
              createTableCell('없음'),
              createTableCell('CBS 100% 보장')
            ]
          }),
          new TableRow({
            children: [
              createTableCell('대피 시간'),
              createTableCell('18분'),
              createTableCell('11분 (-40%)')
            ]
          }),
        ],
        width: { size: 100, type: 'pct' }
      }),

      new Paragraph({ text: '', spacing: { after: 400 } }),

      // ========== 2. 기술 명세 ==========
      new Paragraph({
        text: '2. 기술 명세',
        heading: HeadingLevel.HEADING_1,
        ...heading1Style
      }),

      new Paragraph({
        text: '2.1 기술 목적',
        heading: HeadingLevel.HEADING_2,
        ...heading2Style
      }),

      new Paragraph({
        text: '핵심 문제',
        heading: HeadingLevel.HEADING_3,
        ...heading3Style
      }),
      new UnorderedList({
        children: [
          new ListItem({ children: [new Paragraph('GPS 신호 불가 실내 환경에서 대피 경로 안내 불가')] }),
          new ListItem({ children: [new Paragraph('연기 확산 속도가 인간 대피 속도보다 빨라 사망률 70%+ (연기 흡입)')] }),
          new ListItem({ children: [new Paragraph('병목 현상과 압사 사고 예방 불가')] }),
          new ListItem({ children: [new Paragraph('취약계층 특수 요구사항 반영 불가')] }),
          new ListItem({ children: [new Paragraph('정적 대피도 기반 의사결정으로 급변하는 상황 대응 실패')] }),
        ]
      }),

      new Paragraph({
        text: 'FireNavi의 해결책',
        heading: HeadingLevel.HEADING_3,
        ...heading3Style
      }),
      new UnorderedList({
        children: [
          new ListItem({ children: [new Paragraph('Prediction AI: 유체역학 + 딥러닝 하이브리드로 1초 이내 60초 미래 연기 확산 예측')] }),
          new ListItem({ children: [new Paragraph('Behavior AI: 실시간 군중 밀집도 + 6가지 개인 유형별 이동 특성 분석')] }),
          new ListItem({ children: [new Paragraph('Decision AI: 동적 위험지도 기반 개인별 최적 경로 + 취약계층 우선 보호')] }),
        ]
      }),

      new Paragraph({
        text: '목표: 6,000명 동시 대피 시간 18분 → 11분 (40% 단축), 취약계층 생존율 극대화',
        bold: true,
        ...normalText,
        spacing: { after: 200 }
      }),

      new Paragraph({
        text: '2.2 기술 구조',
        heading: HeadingLevel.HEADING_2,
        ...heading2Style
      }),

      new Paragraph({
        text: '3개 AI 엔진 통합 아키텍처',
        heading: HeadingLevel.HEADING_3,
        ...heading3Style
      }),

      new Paragraph({
        text: '[입력 계층] IoT 센서 → WiFi 위치추적 → CCTV → 프로필 카드',
        ...normalText
      }),
      new Paragraph({
        text: '        ↓',
        alignment: AlignmentType.CENTER,
        ...normalText
      }),
      new Paragraph({
        text: '[AI 처리] Prediction AI (연기 예측) + Behavior AI (군중 분석) + Decision AI (경로 결정)',
        ...normalText
      }),
      new Paragraph({
        text: '        ↓',
        alignment: AlignmentType.CENTER,
        ...normalText
      }),
      new Paragraph({
        text: '[통합 출력] Dynamic Risk Map (위험도 통합) → R(x,y,t) = 0.35F + 0.30S + 0.20D + 0.15C',
        ...normalText
      }),
      new Paragraph({
        text: '        ↓',
        alignment: AlignmentType.CENTER,
        ...normalText
      }),
      new Paragraph({
        text: '[제어 계층] 6,000명 개별 경로 계산 + 출구 분산 + 충돌 해소 + 소방관 배치',
        ...normalText
      }),
      new Paragraph({
        text: '        ↓',
        alignment: AlignmentType.CENTER,
        ...normalText
      }),
      new Paragraph({
        text: '[출력 계층] 모바일 앱 + HMD + 대시보드 + WiFi 비콘',
        ...normalText,
        spacing: { after: 200 }
      }),

      new Paragraph({
        text: '2.3 주요 기능',
        heading: HeadingLevel.HEADING_2,
        ...heading2Style
      }),

      new Paragraph({
        text: 'Prediction AI: 미래를 보는 AI',
        heading: HeadingLevel.HEADING_3,
        ...heading3Style
      }),
      new UnorderedList({
        children: [
          new ListItem({ children: [new Paragraph('Navier-Stokes CFD: 기류 및 연기 이동 계산')] }),
          new ListItem({ children: [new Paragraph('Advection-Diffusion: 복도·계단·엘리베이터 통한 다층 연기 확산')] }),
          new ListItem({ children: [new Paragraph('Beer-Lambert 법칙: 연기 농도 → 가시거리 변환')] }),
          new ListItem({ children: [new Paragraph('LSTM 신경망: CFD 정밀도 + 실시간 응답속도 결합 (sub-second)')] }),
          new ListItem({ children: [new Paragraph('성능: 응답 < 1초, 정확도 90%+, 예측 범위 t+60초')] }),
        ]
      }),

      new Paragraph({ text: '', spacing: { after: 120 } }),

      new Paragraph({
        text: 'Behavior AI: 사람을 이해하는 AI',
        heading: HeadingLevel.HEADING_3,
        ...heading3Style
      }),
      new UnorderedList({
        children: [
          new ListItem({ children: [new Paragraph('Social Force Model: 보행자 간 상호작용 벡터 계산')] }),
          new ListItem({ children: [new Paragraph('KDE (Kernel Density Estimation): 실시간 군중 밀집도 히트맵 (2D + 3D)')] }),
          new ListItem({ children: [new Paragraph('Greenshields 모델: 밀집도-속도 관계식')] }),
          new ListItem({ children: [new Paragraph('Multi-Agent: 6가지 유형 개별 에이전트 병렬 시뮬레이션')] }),
          new ListItem({ children: [new Paragraph('병목 탐지: < 0.5초, 구역당 90명 임계값')] }),
        ]
      }),

      new Paragraph({ text: '', spacing: { after: 120 } }),

      new Paragraph({
        text: 'Decision AI: 결정을 내리는 AI',
        heading: HeadingLevel.HEADING_3,
        ...heading3Style
      }),
      new UnorderedList({
        children: [
          new ListItem({ children: [new Paragraph('Dynamic Risk Map: 4가지 위험 요소 실시간 통합')] }),
          new ListItem({ children: [new Paragraph('Safety-First A*: 표준 A*에 위험 페널티 추가')] }),
          new ListItem({ children: [new Paragraph('Exit Crowd Balancing: 전역 최적화로 출구 혼잡 분산')] }),
          new ListItem({ children: [new Paragraph('CBS (Conflict-Based Search): 6,000명 경로 충돌 100% 해소')] }),
          new ListItem({ children: [new Paragraph('소방관 배치: 위협 점수 기반 최적 배치 위치 산출')] }),
          new ListItem({ children: [new Paragraph('성능: 경로 계산 < 100ms, 갱신 60+ Hz')] }),
        ]
      }),

      new Paragraph({ text: '', spacing: { after: 200 } }),

      new Paragraph({
        text: '2.4 결과물 형상',
        heading: HeadingLevel.HEADING_2,
        ...heading2Style
      }),

      new Paragraph({
        text: '현재 완성된 형상 (Prototype - TRL5~6)',
        heading: HeadingLevel.HEADING_3,
        ...heading3Style
      }),

      new Table({
        rows: [
          new TableRow({
            children: [
              createTableCell('구성 요소', { bold: true, shading: { fill: 'E5E7EB' } }),
              createTableCell('형상', { bold: true, shading: { fill: 'E5E7EB' } }),
              createTableCell('상태', { bold: true, shading: { fill: 'E5E7EB' } }),
            ]
          }),
          new TableRow({
            children: [
              createTableCell('웹 기반 시뮬레이션'),
              createTableCell('HTML5 + Canvas 2D'),
              createTableCell('✅ 완성')
            ]
          }),
          new TableRow({
            children: [
              createTableCell('3개 AI 엔진'),
              createTableCell('Vanilla JavaScript'),
              createTableCell('✅ 완성')
            ]
          }),
          new TableRow({
            children: [
              createTableCell('동적 리스크맵'),
              createTableCell('Canvas 히트맵'),
              createTableCell('✅ 완성')
            ]
          }),
          new TableRow({
            children: [
              createTableCell('경로 최적화'),
              createTableCell('A* + Greenshields + Exit Balancing'),
              createTableCell('✅ 완성')
            ]
          }),
          new TableRow({
            children: [
              createTableCell('성능 검증'),
              createTableCell('목표 11분 대피 달성'),
              createTableCell('✅ 완료')
            ]
          }),
        ],
        width: { size: 100, type: 'pct' }
      }),

      new Paragraph({ text: '', spacing: { after: 200 } }),

      new Paragraph({
        text: '2.5 배포 방식',
        heading: HeadingLevel.HEADING_2,
        ...heading2Style
      }),

      new Paragraph({
        text: '현재 배포 (Prototype)',
        heading: HeadingLevel.HEADING_3,
        ...heading3Style
      }),
      new UnorderedList({
        children: [
          new ListItem({ children: [new Paragraph('웹 기반 정적 사이트: Vercel / GitHub Pages')] }),
          new ListItem({ children: [new Paragraph('구성: HTML5 + CSS + Vanilla JavaScript')] }),
          new ListItem({ children: [new Paragraph('특징: 외부 라이브러리 의존 없음')] }),
          new ListItem({ children: [new Paragraph('접근: 웹 브라우저 (데스크톱 + 태블릿)')] }),
        ]
      }),

      new Paragraph({ text: '', spacing: { after: 120 } }),

      new Paragraph({
        text: '프로덕션 배포 (예정 - 2026-12월)',
        heading: HeadingLevel.HEADING_3,
        ...heading3Style
      }),
      new UnorderedList({
        children: [
          new ListItem({ children: [new Paragraph('3-Tier 아키텍처: Edge → Processing → Presentation')] }),
          new ListItem({ children: [new Paragraph('Edge: MQTT/Kafka 센서 파이프라인')] }),
          new ListItem({ children: [new Paragraph('Processing: Python/PyTorch + OpenFOAM')] }),
          new ListItem({ children: [new Paragraph('Presentation: React Native 모바일 + Unity 3D HMD + React 웹')] }),
          new ListItem({ children: [new Paragraph('배포: Docker + Kubernetes + AWS')] }),
        ]
      }),

      new Paragraph({ text: '', spacing: { after: 200 } }),

      new Paragraph({
        text: '2.6 혁신적 요소',
        heading: HeadingLevel.HEADING_2,
        ...heading2Style
      }),

      new UnorderedList({
        children: [
          new ListItem({ children: [new Paragraph('✅ 3개 AI 엔진 하이브리드: CFD(정밀도) + LSTM(실시간) 결합')] }),
          new ListItem({ children: [new Paragraph('✅ 취약계층 보호 시스템화: 6가지 유형별 차별 경로 + α=2.0 안전 마진')] }),
          new ListItem({ children: [new Paragraph('✅ Dynamic Risk Map: 4가지 위험 요소 실시간 통합 + 시간 차원 포함')] }),
          new ListItem({ children: [new Paragraph('✅ 다중 에이전트 충돌 해소: CBS로 100% 충돌 회피 보장')] }),
          new ListItem({ children: [new Paragraph('✅ WiFi 기반 실내 위치추적: 2~3m 정밀도, IoT 센서 없이도 군중 분석')] }),
          new ListItem({ children: [new Paragraph('✅ Exit Crowd Balancing: 전역 최적화로 특정 출구 병목 방지')] }),
        ]
      }),

      new Paragraph({ text: '', spacing: { after: 200 } }),

      new Paragraph({
        text: '2.7 도전적 요소',
        heading: HeadingLevel.HEADING_2,
        ...heading2Style
      }),

      new UnorderedList({
        children: [
          new ListItem({ children: [new Paragraph('도전 1: 실시간 6,000명 경로 계산 (< 100ms) - Spatial Grid 최적화로 해결')] }),
          new ListItem({ children: [new Paragraph('도전 2: CFD + LSTM 하이브리드 동시 처리 - Transfer Learning로 해결')] }),
          new ListItem({ children: [new Paragraph('도전 3: 취약계층 보호의 수학적 모델링 - 10만 회 몬테카를로 검증')] }),
          new ListItem({ children: [new Paragraph('도전 4: WiFi 위치추적 신뢰성 - Kalman Filter + 메시 네트워크로 해결')] }),
          new ListItem({ children: [new Paragraph('도전 5: IMO/SOLAS 규정 준수 - FSA 5단계 + Formal Verification로 해결')] }),
        ]
      }),

      new Paragraph({ text: '', spacing: { after: 400 } }),

      // ========== 3. 구현 방법 및 계획 ==========
      new Paragraph({
        text: '3. 구현 방법 및 계획',
        heading: HeadingLevel.HEADING_1,
        ...heading1Style
      }),

      new Paragraph({
        text: '3.1 구현 범위',
        heading: HeadingLevel.HEADING_2,
        ...heading2Style
      }),

      new Table({
        rows: [
          new TableRow({
            children: [
              createTableCell('세부업무', { bold: true, shading: { fill: 'E5E7EB' } }),
              createTableCell('내용', { bold: true, shading: { fill: 'E5E7EB' } }),
              createTableCell('상태', { bold: true, shading: { fill: 'E5E7EB' } }),
            ]
          }),
          new TableRow({
            children: [
              createTableCell('세부업무 #1: 웹 시뮬레이션'),
              createTableCell('HTML5 Canvas 2D 렌더링, 6,000명 동시 처리'),
              createTableCell('✅ 완료')
            ]
          }),
          new TableRow({
            children: [
              createTableCell('세부업무 #2: AI 엔진'),
              createTableCell('Prediction/Behavior/Decision 핵심 알고리즘'),
              createTableCell('✅ 완료')
            ]
          }),
          new TableRow({
            children: [
              createTableCell('세부업무 #3: 통합 플랫폼'),
              createTableCell('Dynamic Risk Map + 경로 최적화 + 대시보드'),
              createTableCell('✅ 완료')
            ]
          }),
          new TableRow({
            children: [
              createTableCell('세부업무 #4: WiFi 통합'),
              createTableCell('실내 위치추적 시스템 (2~3m 정밀도)'),
              createTableCell('진행 중 (06월)')
            ]
          }),
          new TableRow({
            children: [
              createTableCell('세부업무 #5: 백엔드'),
              createTableCell('Python FastAPI + PyTorch + OpenFOAM'),
              createTableCell('예정 (06월)')
            ]
          }),
          new TableRow({
            children: [
              createTableCell('세부업무 #6: 실선 통합'),
              createTableCell('센서 배치 + IMO/SOLAS 인증'),
              createTableCell('예정 (12월~)')
            ]
          }),
        ],
        width: { size: 100, type: 'pct' }
      }),

      new Paragraph({ text: '', spacing: { after: 200 } }),

      new Paragraph({
        text: '3.2 구현 계획',
        heading: HeadingLevel.HEADING_2,
        ...heading2Style
      }),

      new Table({
        rows: [
          new TableRow({
            children: [
              createTableCell('시기', { bold: true, shading: { fill: 'E5E7EB' } }),
              createTableCell('마일스톤', { bold: true, shading: { fill: 'E5E7EB' } }),
              createTableCell('주요 활동', { bold: true, shading: { fill: 'E5E7EB' } }),
            ]
          }),
          new TableRow({
            children: [
              createTableCell('2026-04'),
              createTableCell('Phase 1~3 완료'),
              createTableCell('웹 프로토타입 완성, 3개 AI 엔진 검증')
            ]
          }),
          new TableRow({
            children: [
              createTableCell('2026-06'),
              createTableCell('WiFi 통합'),
              createTableCell('WiFi 위치추적 + Edge Computing 개발')
            ]
          }),
          new TableRow({
            children: [
              createTableCell('2026-09'),
              createTableCell('통합 테스트'),
              createTableCell('센서 파이프라인 + 실시간 성능 검증')
            ]
          }),
          new TableRow({
            children: [
              createTableCell('2026-12'),
              createTableCell('실선 준비'),
              createTableCell('모바일 앱 + HMD + 조선소 협력')
            ]
          }),
          new TableRow({
            children: [
              createTableCell('2027-01~06'),
              createTableCell('조선소 통합'),
              createTableCell('IMO/SOLAS 규정 인증')
            ]
          }),
        ],
        width: { size: 100, type: 'pct' }
      }),

      new Paragraph({ text: '', spacing: { after: 200 } }),

      new Paragraph({
        text: '3.3 기술 스택',
        heading: HeadingLevel.HEADING_2,
        ...heading2Style
      }),

      new Paragraph({
        text: '프론트엔드 (현재)',
        heading: HeadingLevel.HEADING_3,
        ...heading3Style
      }),
      new UnorderedList({
        children: [
          new ListItem({ children: [new Paragraph('HTML5 + CSS3 커스텀 디자인 시스템 (22색상, 8그림자)')] }),
          new ListItem({ children: [new Paragraph('Vanilla JavaScript (외부 라이브러리 의존 없음)')] }),
          new ListItem({ children: [new Paragraph('Canvas 2D API (시뮬레이션/맵/경로 렌더링)')] }),
          new ListItem({ children: [new Paragraph('Google Fonts (Inter 타이포그래피)')] }),
        ]
      }),

      new Paragraph({ text: '', spacing: { after: 120 } }),

      new Paragraph({
        text: '백엔드 (예정 - 2026-06월)',
        heading: HeadingLevel.HEADING_3,
        ...heading3Style
      }),
      new UnorderedList({
        children: [
          new ListItem({ children: [new Paragraph('Python 3.9+ / FastAPI')] }),
          new ListItem({ children: [new Paragraph('PyTorch 2.0+ (AI 모델 추론)')] }),
          new ListItem({ children: [new Paragraph('OpenFOAM v2312 (CFD 엔진)')] }),
          new ListItem({ children: [new Paragraph('MQTT 3.1.1 / Kafka 3.x (센서 파이프라인)')] }),
        ]
      }),

      new Paragraph({ text: '', spacing: { after: 120 } }),

      new Paragraph({
        text: '데이터베이스 (예정 - 2026-06월)',
        heading: HeadingLevel.HEADING_3,
        ...heading3Style
      }),
      new UnorderedList({
        children: [
          new ListItem({ children: [new Paragraph('InfluxDB 2.7+ (센서 시계열 데이터)')] }),
          new ListItem({ children: [new Paragraph('PostgreSQL 15+ (설정, 메타데이터, 네비게이션 그래프)')] }),
          new ListItem({ children: [new Paragraph('Redis 7.0+ (캐싱, 실시간 상태)')] }),
        ]
      }),

      new Paragraph({ text: '', spacing: { after: 200 } }),

      new Paragraph({
        text: '3.4 시설·장비 보유 현황',
        heading: HeadingLevel.HEADING_2,
        ...heading2Style
      }),

      new UnorderedList({
        children: [
          new ListItem({ children: [new Paragraph('개발 PC: Windows 11 Pro, Intel i9, RTX 4090')] }),
          new ListItem({ children: [new Paragraph('예정 인프라: Intel Xeon + NVIDIA A100 (2장, 80GB) × 2 대')] }),
          new ListItem({ children: [new Paragraph('데이터셋: 10,000+ CFD 시나리오, 100,000 LSTM 타임스텝')] }),
          new ListItem({ children: [new Paragraph('테스트베드: 크루즈선 선상 센서 설치 예정')] }),
        ]
      }),

      new Paragraph({ text: '', spacing: { after: 400 } }),

      // ========== 4. 파급효과 ==========
      new Paragraph({
        text: '4. 파급효과',
        heading: HeadingLevel.HEADING_1,
        ...heading1Style
      }),

      new Paragraph({
        text: '4.1 기술적 파급효과',
        heading: HeadingLevel.HEADING_2,
        ...heading2Style
      }),

      new UnorderedList({
        children: [
          new ListItem({ children: [new Paragraph('혁신: 3개 AI 엔진 하이브리드 아키텍처 (CFD + LSTM + RL 통합)')] }),
          new ListItem({ children: [new Paragraph('논문: "Hybrid CFD-LSTM for Real-time Fire Smoke Prediction" 등 3편')] }),
          new ListItem({ children: [new Paragraph('특허: A) LSTM 실시간 연기 예측, B) 취약계층 건강 인식 경로, C) WiFi 위치추적, D) 동적 리스크맵, E) 소방관 배치 (5건 예정)')] }),
          new ListItem({ children: [new Paragraph('표준: AI 안전 검증 방법론 제시 (의료, 자율주행 확대 적용)')] }),
        ]
      }),

      new Paragraph({ text: '', spacing: { after: 200 } }),

      new Paragraph({
        text: '4.2 사회·산업적 파급효과',
        heading: HeadingLevel.HEADING_2,
        ...heading2Style
      }),

      new UnorderedList({
        children: [
          new ListItem({ children: [new Paragraph('시장: $50B 글로벌 크루즈 시장 타겟, 연간 신조선 30척')] }),
          new ListItem({ children: [new Paragraph('경제: 손실 40% 감소 ($18.9M), 보험료 40% 절감, ROI 1~2년')] }),
          new ListItem({ children: [new Paragraph('산업: 조선소 경쟁력 강화, 선주 운영비 절감, 보험사 리스크 정량화')] }),
          new ListItem({ children: [new Paragraph('공공: 고층빌딩, 지하철, 쇼핑몰 등 확대 적용 (대피 시간 40% 단축)')] }),
          new ListItem({ children: [new Paragraph('사회: 취약계층 생명 보호 구체화, AI 신뢰도 향상, CSR 실현')] }),
          new ListItem({ children: [new Paragraph('한국: "Made in Korea 안전 기술" 해외 수출 ($100M+/년 가능성)')] }),
        ]
      }),

      new Paragraph({ text: '', spacing: { after: 400 } }),

      // ========== 결론 ==========
      new Paragraph({
        text: '5. 결론',
        heading: HeadingLevel.HEADING_1,
        ...heading1Style
      }),

      new Paragraph({
        text: 'FireNavi는 AI가 아직 미지원하는 영역 — "실시간 생명 구조"에 특화된 플랫폼입니다. 3개의 자체 개발 AI 엔진이 화재의 한 발 앞서 연기를 예측하고, 군중의 흐름을 읽어내며, 6,000명 한 명 한 명의 생존을 매 순간 설계합니다.',
        italics: true,
        ...normalText
      }),

      new Paragraph({
        text: '"길을 안내하는 것이 아니라 생존을 설계합니다."',
        bold: true,
        alignment: AlignmentType.CENTER,
        ...normalText,
        spacing: { after: 200 }
      }),

      new Paragraph({
        text: 'FireNavi — AI + IoT + 시뮬레이션으로 화재 대피의 미래를 만듭니다.',
        alignment: AlignmentType.CENTER,
        bold: true,
        size: 24,
        color: 'DC2626'
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(path.join(__dirname, '구현제안서_FireNavi.docx'), buffer);
  console.log('✅ 구현제안서_FireNavi.docx 생성 완료!');
});
