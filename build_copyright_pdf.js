const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const puppeteer = require('puppeteer-core');

const BASE = 'C:/01 클로드코드/50-12 화이어 내비';

const sections = [
  { title: '제1부: 저작권 등록 신청 자료', file: 'copyright/저작권_등록_기술저작물.md' },
  { title: '제2부: 통합 특허 기술서', file: 'Patent_통합_FireNavi.md' },
  { title: '제3부: 개별 기술서 ① 삼중 엔진 동기 아키텍처', file: 'Patent_01_삼중엔진_동기아키텍처.md' },
  { title: '제3부: 개별 기술서 ② 이원 경로 시스템', file: 'Patent_02_이원경로_시스템.md' },
  { title: '제3부: 개별 기술서 ③ 취약계층 안전 마진', file: 'Patent_03_취약계층_안전마진.md' },
  { title: '제3부: 개별 기술서 ④ 동적 출구 재배정', file: 'Patent_04_동적출구_재배정.md' },
  { title: '제3부: 개별 기술서 ⑤ 이중 경로 예측 보정', file: 'Patent_05_이중경로_예측보정.md' },
  { title: '제4부: AI 엔진 기술서 ① Prediction AI', file: 'AI_Engine_01_Prediction.md' },
  { title: '제4부: AI 엔진 기술서 ② Behavior AI', file: 'AI_Engine_02_Behavior.md' },
  { title: '제4부: AI 엔진 기술서 ③ Decision AI', file: 'AI_Engine_03_Decision.md' },
  { title: '제5부: 플랫폼 종합 자료', file: 'copyright/total - 화이어내비.md' },
  { title: '제6부: 영상 시나리오 (AI 챔피언 대회)', file: 'copyright/영상시나리오-화이어내비.md' },
];

// Convert images to base64
const infographic = fs.readFileSync(path.join(BASE, 'copyright/FireNavi_인포그래픽.png'));
const infographicB64 = infographic.toString('base64');
const archImg = fs.readFileSync(path.join(BASE, 'copyright/FireNavi_AI아키텍처.jpg'));
const archB64 = archImg.toString('base64');
const logoImg = fs.readFileSync(path.join(BASE, 'copyright/FireNavi_로고.png'));
const logoB64 = logoImg.toString('base64');
const simImg = fs.readFileSync(path.join(BASE, 'copyright/FireNavi_시뮬레이션_화면.png'));
const simB64 = simImg.toString('base64');
const svg1 = fs.readFileSync(path.join(BASE, 'copyright/도면1_시스템구성도.svg'), 'utf8');
const svg2 = fs.readFileSync(path.join(BASE, 'copyright/도면2_처리흐름도.svg'), 'utf8');
const svg3 = fs.readFileSync(path.join(BASE, 'copyright/도면3_데이터흐름도.svg'), 'utf8');
const svg4 = fs.readFileSync(path.join(BASE, 'copyright/아키텍처_구조도.svg'), 'utf8');

let htmlSections = '';

// Table of contents
htmlSections += '<div class="toc"><h1>목 차</h1><ul>';
sections.forEach((s, i) => {
  htmlSections += `<li><a href="#section-${i}">${s.title}</a></li>`;
});
htmlSections += '<li><a href="#section-visual">제7부: 시각 저작물 및 기술 도면</a></li>';
htmlSections += '</ul></div>';

// Render each MD section
sections.forEach((s, i) => {
  const md = fs.readFileSync(path.join(BASE, s.file), 'utf8');
  const html = marked(md);
  htmlSections += `<div class="section" id="section-${i}">`;
  htmlSections += `<div class="section-header">${s.title}</div>`;
  htmlSections += html;
  htmlSections += '</div>';
});

// Visual assets section
htmlSections += `<div class="section" id="section-visual">`;
htmlSections += `<div class="section-header">제7부: 시각 저작물 및 기술 도면</div>`;
htmlSections += `<h2>7-1. FireNavi 브랜드 로고</h2>`;
htmlSections += `<div style="text-align:center;padding:40px;background:#f8f9fa;border-radius:12px;margin:20px 0;">`;
htmlSections += `<img src="data:image/png;base64,${logoB64}" style="max-width:400px;margin:0 auto;">`;
htmlSections += `</div>`;
htmlSections += `<p style="text-align:center;color:#666;font-size:9pt;margin-top:8px;">방패(Shield) + 불꽃(Fire) + 나침반(Navigation) + 위치핀(Location) + 격자(Grid) — 5요소 융합 독창적 로고 도안</p>`;
htmlSections += `<h2>7-2. 실시간 대피 시뮬레이션 실행 화면</h2>`;
htmlSections += `<img src="data:image/png;base64,${simB64}" style="width:100%;margin:20px 0;border:1px solid #ddd;border-radius:8px;">`;
htmlSections += `<p style="color:#666;font-size:9pt;margin-top:8px;">3대 AI 엔진 탭, 데크별 시각화, 실시간 대시보드(경과 시간, 위험 구역, 가시거리), 범례 시스템을 포함하는 프로그램 실행 화면</p>`;
htmlSections += `<h2>7-3. FireNavi 전체 개요 인포그래픽</h2>`;
htmlSections += `<img src="data:image/png;base64,${infographicB64}" style="width:100%;margin:20px 0;border:1px solid #ddd;border-radius:8px;">`;
htmlSections += `<h2>7-4. 3대 AI 엔진 아키텍처 다이어그램</h2>`;
htmlSections += `<img src="data:image/jpeg;base64,${archB64}" style="width:100%;margin:20px 0;border:1px solid #ddd;border-radius:8px;">`;
htmlSections += `<h2>7-5. 기술 도면 — 시스템 구성도</h2>`;
htmlSections += `<div style="background:#fff;padding:20px;border:1px solid #ddd;border-radius:8px;margin:20px 0;">${svg1}</div>`;
htmlSections += `<h2>7-6. 기술 도면 — 처리 흐름도</h2>`;
htmlSections += `<div style="background:#fff;padding:20px;border:1px solid #ddd;border-radius:8px;margin:20px 0;">${svg2}</div>`;
htmlSections += `<h2>7-7. 기술 도면 — 데이터 흐름도</h2>`;
htmlSections += `<div style="background:#fff;padding:20px;border:1px solid #ddd;border-radius:8px;margin:20px 0;">${svg3}</div>`;
htmlSections += `<h2>7-8. 기술 도면 — 아키텍처 전체 구조도</h2>`;
htmlSections += `<div style="background:#fff;padding:20px;border:1px solid #ddd;border-radius:8px;margin:20px 0;overflow:auto;">${svg4}</div>`;
htmlSections += `<h2>7-9. 기술 프레젠테이션 (PDF 15페이지)</h2>`;
htmlSections += `<p style="color:#666;font-style:italic;">※ 화이어내비_프레젠테이션.pdf (2.3MB, 15페이지)는 본 PDF 뒤에 별도 병합됩니다.</p>`;
htmlSections += '</div>';

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<style>
  @page { margin: 25mm 20mm 25mm 20mm; size: A4; }
  body { font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; font-size: 10.5pt; line-height: 1.8; color: #1a1a1a; }

  .cover { page-break-after: always; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 90vh; text-align: center; }
  .cover h1 { font-size: 22pt; font-weight: 800; margin-bottom: 16px; line-height: 1.4; }
  .cover h2 { font-size: 13pt; font-weight: 400; color: #555; margin-bottom: 40px; line-height: 1.6; }
  .cover .meta { font-size: 11pt; color: #333; line-height: 2.2; }
  .cover .meta b { display: inline-block; width: 100px; text-align: right; margin-right: 12px; }
  .cover .line { width: 60px; height: 3px; background: #E53E3E; margin: 30px auto; }
  .cover .copyright-notice { font-size: 9pt; color: #888; margin-top: 60px; line-height: 1.6; border-top: 1px solid #ddd; padding-top: 20px; }

  .toc { page-break-after: always; padding-top: 40px; }
  .toc h1 { font-size: 18pt; text-align: center; margin-bottom: 30px; }
  .toc ul { list-style: none; padding: 0; }
  .toc li { padding: 8px 0; border-bottom: 1px dotted #ccc; font-size: 11pt; }
  .toc a { text-decoration: none; color: #1a1a1a; }

  .section { page-break-before: always; }
  .section-header { font-size: 14pt; font-weight: 800; color: #fff; background: linear-gradient(135deg, #1E293B, #334155); padding: 16px 24px; border-radius: 8px; margin-bottom: 24px; }

  h1 { font-size: 16pt; font-weight: 800; border-bottom: 2px solid #E53E3E; padding-bottom: 8px; margin-top: 32px; }
  h2 { font-size: 13pt; font-weight: 700; color: #1E293B; margin-top: 28px; border-left: 4px solid #3B82F6; padding-left: 12px; }
  h3 { font-size: 11.5pt; font-weight: 700; color: #334155; margin-top: 20px; }
  h4 { font-size: 10.5pt; font-weight: 700; color: #475569; }

  table { border-collapse: collapse; width: 100%; margin: 12px 0; font-size: 9.5pt; }
  th { background: #F1F5F9; font-weight: 700; text-align: left; padding: 8px 10px; border: 1px solid #CBD5E1; }
  td { padding: 6px 10px; border: 1px solid #E2E8F0; vertical-align: top; }
  tr:nth-child(even) td { background: #F8FAFC; }

  code { background: #F1F5F9; padding: 2px 6px; border-radius: 3px; font-size: 9.5pt; font-family: 'Consolas', 'D2Coding', monospace; }
  pre { background: #0F172A; color: #E2E8F0; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 9pt; line-height: 1.6; }
  pre code { background: none; padding: 0; color: inherit; }

  blockquote { border-left: 4px solid #7C3AED; background: #F5F3FF; padding: 12px 16px; margin: 12px 0; border-radius: 0 8px 8px 0; }
  blockquote p { margin: 4px 0; }

  strong { color: #1E293B; }
  hr { border: none; border-top: 1px solid #E2E8F0; margin: 24px 0; }

  img { max-width: 100%; }

  ul, ol { padding-left: 24px; }
  li { margin-bottom: 4px; }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover">
  <img src="data:image/png;base64,${logoB64}" style="max-width:280px;margin-bottom:24px;">
  <div class="line"></div>
  <h1>FireNavi 삼중 AI 엔진<br>아키텍처 및 알고리즘 설계 기술서</h1>
  <h2>AI 기반 실시간 화재 대피 시스템의<br>예측·행동·결정 엔진 동기 연동, 이원 경로 생성,<br>취약계층 안전 마진, 동적 출구 배정,<br>이중 경로 예측 보정 기술</h2>
  <div class="line"></div>
  <div class="meta">
    <div><b>저작물 유형</b> 어문저작물 (기술 설계 문서) + 미술저작물 + 편집저작물</div>
    <div><b>저작자</b> 심재우 (Shim Jaewoo)</div>
    <div><b>이메일</b> jaiwshim@gmail.com</div>
    <div><b>창작 완성일</b> 2026년 4월 15일</div>
    <div><b>총 분량</b> 약 3,053줄 / A4 약 115페이지 + 시각 저작물 5건</div>
  </div>
  <div class="copyright-notice">
    Copyright &copy; 2026 심재우 (Shim Jaewoo). All Rights Reserved.<br>
    본 문서는 대한민국 저작권법에 의해 보호되는 저작물입니다.<br>
    저작권자의 사전 서면 동의 없이 복제, 배포, 전송, 번역, 2차적 저작물 작성 등에 이용할 수 없습니다.
  </div>
</div>

${htmlSections}

</body>
</html>`;

fs.writeFileSync(path.join(BASE, 'copyright/저작권_통합.html'), fullHtml, 'utf8');
console.log('HTML generated: copyright/저작권_통합.html');
console.log('HTML size:', (fullHtml.length / 1024).toFixed(0) + 'KB');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setContent(fullHtml, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.pdf({
    path: path.join(BASE, 'copyright/FireNavi_저작권등록_통합.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: '25mm', bottom: '25mm', left: '20mm', right: '20mm' },
    displayHeaderFooter: true,
    headerTemplate: '<div style="font-size:7pt;color:#999;width:100%;text-align:center;padding-top:5mm;">FireNavi 삼중 AI 엔진 아키텍처 및 알고리즘 설계 기술서 &mdash; 저작권 등록용</div>',
    footerTemplate: '<div style="font-size:7pt;color:#999;width:100%;text-align:center;padding-bottom:3mm;">Copyright &copy; 2026 심재우 &mdash; <span class="pageNumber"></span> / <span class="totalPages"></span></div>'
  });
  console.log('PDF generated successfully');

  // Get page count
  const metrics = await page.metrics();
  await browser.close();
})();
