# AGENTS.md

## 1. 프로젝트 개요

FireNavi(화이어내비)는 AI 기반 크루즈선 화재 대피 내비게이션 시스템이다. 선박 내 화재 발생 시 승객과 승무원에게 최적 대피 경로를 실시간으로 안내하는 것이 목적이다.

- 순수 정적 웹 애플리케이션 (백엔드 없음, 데이터베이스 없음)
- 기술 스택: HTML5 + Custom CSS + Vanilla JS + Canvas 2D API
- 외부 JS 라이브러리 없음 (Google Fonts Inter만 사용)
- 전체 코드량: 약 14,188줄

## 2. 작업 시작 규칙

- 작업 전 반드시 `index.html`과 관련 페이지를 읽어 현재 상태를 파악한다.
- `css/style.css`의 CSS 변수 22개를 숙지한 후 스타일 작업에 착수한다.
- `pages/simulation.html`은 3,581줄 단일 파일이므로, 수정 시 변경 범위를 최소화한다.
- 새로운 외부 라이브러리를 도입하지 않는다. 기존 Vanilla JS 방식을 유지한다.
- Supabase, API 호출, 백엔드 연동을 추가하지 않는다.

## 3. 빌드와 테스트

- 빌드 도구 없음. 정적 HTML 파일을 직접 브라우저에서 연다.
- 별도의 테스트 프레임워크 없음.
- 변경 후 검증은 브라우저에서 직접 확인하거나, puppeteer-core를 활용한 스크린샷으로 수행한다.
- Canvas 2D 기반 시뮬레이션은 `pages/simulation.html`을 브라우저에서 열어 동작을 확인한다.

## 4. 코드 작성 규칙

- HTML 파일 내에 `<style>`과 `<script>`를 인라인으로 포함하는 패턴을 따른다 (pages/ 하위 파일들 참고).
- 공통 스타일은 `css/style.css`에 작성하고, 페이지 고유 스타일은 해당 HTML 파일 내 `<style>` 태그에 작성한다.
- CSS 변수(`--primary`, `--bg-dark` 등)를 사용하여 디자인 시스템 일관성을 유지한다.
- JavaScript는 Vanilla JS만 사용한다. jQuery, React, Vue 등 외부 프레임워크를 도입하지 않는다.
- Canvas 2D API를 사용한 렌더링 코드에서는 `requestAnimationFrame` 패턴을 따른다.
- 한글 주석을 사용한다.
- 새 페이지 추가 시 `index.html` 대시보드에서의 내비게이션 링크를 함께 갱신한다.

## 5. 핵심 파일 구조

```
index.html                              # 대시보드 (메인 진입점)
css/style.css                           # 디자인 시스템 (1,377줄, CSS 변수 22개)
js/main.js                              # 공통 UI 인터랙션 (163줄)
pages/
  a-technical-formulation.html          # Module A: 수학적 모델링
  b-industrial-architecture.html        # Module B: 시스템 아키텍처
  c-shipyard-proposal.html              # Module C: 조선소 제안 전략
  d-insurance-risk-model.html           # Module D: 보험 리스크 모델
  simulation.html                       # 화재 대피 시뮬레이터 (3,581줄, Canvas 2D)
  risk-map.html                         # 동적 리스크 히트맵
  route-optimizer.html                  # 멀티에이전트 경로 탐색
```

## 6. 수정 주의 구간

- **`pages/simulation.html`**: 3,581줄 단일 파일. Canvas 렌더링 루프, 에이전트 이동 로직, 화재 확산 알고리즘이 긴밀하게 결합되어 있다. 부분 수정 시 전체 시뮬레이션 동작을 반드시 검증한다.
- **`css/style.css`의 CSS 변수 선언부**: 22개 변수를 변경하면 전체 페이지에 영향이 파급된다. 변수 값 변경 전 사용처를 확인한다.
- **`pages/route-optimizer.html`**: 경로 탐색 알고리즘(A* 등)이 포함되어 있으므로, 알고리즘 로직 변경 시 성능과 정확성을 모두 확인한다.
- **`pages/risk-map.html`**: 히트맵 렌더링과 데이터 매핑 로직이 포함되어 있다. 색상 스케일이나 데이터 바인딩 변경 시 시각적 결과를 확인한다.

## 7. 보고 형식

작업 완료 후 다음 형식으로 보고한다:

```
## 작업 요약
- 변경 사항: (무엇을 했는지)
- 수정 파일: (절대 경로 목록)
- 영향 범위: (어떤 페이지/기능에 영향이 있는지)

## 확인 방법
- (브라우저에서 어떤 페이지를 열어 무엇을 확인해야 하는지)
```
