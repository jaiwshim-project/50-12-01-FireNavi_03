/**
 * FireNavi v3.0 — PDF 일괄 변환 빌드 스크립트
 *
 * 변환 대상:
 *   - .md 파일들: marked로 HTML 렌더 → Puppeteer로 PDF
 *   - .html 파일들: 직접 Puppeteer로 PDF
 *
 * 출력: Mobile/pdf/*.pdf
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const HERE = __dirname;
const OUT = path.join(HERE, 'pdf');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const HTML_TARGETS = [
  'firenavi-v3-master.html',
  'firenavi-v3-slides.html',
  'smartphone-poc.html',
];

const MD_TARGETS = [
  'FireNavi_AI_Champion_Master_Proposal.md',
  'smartphone_first_architecture.md',
  '구현제안서_v3_스마트폰우선.md',
  '구현제안서_v3_5페이지요약.md',
  'PIVOT_v2_to_v3.md',
  'Patent_A_Acoustic_Auto_Trigger.md',
  'Patent_B_Crowdsourced_Fire_Map.md',
  'Patent_C_Conversational_Micro_Survey.md',
  'Patent_D_Infrastructure_Free_Indoor_Positioning.md',
  'Patents_v3_README.md',
  'README.md',
];

/* ---------- 간이 Markdown → HTML 렌더러 ---------- */
function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inlineMd(s) {
  // 코드
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  // 볼드/이탤릭
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // 링크
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return s;
}

function renderMarkdown(md) {
  const lines = md.split(/\r?\n/);
  let out = [];
  let inCode = false, codeLang = '';
  let inList = null;  // 'ul' | 'ol' | null
  let inTable = false, tableHeader = false;

  function closeList() {
    if (inList) { out.push(`</${inList}>`); inList = null; }
  }
  function closeTable() {
    if (inTable) { out.push('</tbody></table>'); inTable = false; }
  }

  for (let raw of lines) {
    // 코드 블록
    if (/^```/.test(raw)) {
      if (inCode) { out.push('</code></pre>'); inCode = false; }
      else { closeList(); closeTable(); codeLang = raw.slice(3).trim();
        out.push(`<pre class="code"><code class="lang-${codeLang}">`); inCode = true; }
      continue;
    }
    if (inCode) { out.push(escapeHtml(raw)); continue; }

    // 빈줄
    if (/^\s*$/.test(raw)) { closeList(); closeTable(); out.push(''); continue; }

    // 표 (간이): | a | b | / |---|---|
    if (/^\|.*\|$/.test(raw.trim())) {
      const cells = raw.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
      if (/^[-:\s|]+$/.test(raw.replace(/\|/g, ''))) {
        // 구분선
        continue;
      }
      if (!inTable) {
        closeList();
        out.push('<table><thead><tr>' + cells.map(c => `<th>${inlineMd(escapeHtml(c))}</th>`).join('') + '</tr></thead><tbody>');
        inTable = true; tableHeader = true;
      } else {
        out.push('<tr>' + cells.map(c => `<td>${inlineMd(escapeHtml(c))}</td>`).join('') + '</tr>');
      }
      continue;
    } else if (inTable) closeTable();

    // 헤딩
    const h = raw.match(/^(#{1,6})\s+(.+)$/);
    if (h) {
      closeList();
      const level = h[1].length;
      out.push(`<h${level}>${inlineMd(escapeHtml(h[2]))}</h${level}>`);
      continue;
    }

    // 인용
    if (/^>\s/.test(raw)) {
      closeList();
      out.push(`<blockquote>${inlineMd(escapeHtml(raw.replace(/^>\s?/, '')))}</blockquote>`);
      continue;
    }

    // 수평선
    if (/^---+\s*$/.test(raw)) { closeList(); out.push('<hr/>'); continue; }

    // 리스트
    const ul = raw.match(/^[\-\*]\s+(.+)$/);
    const ol = raw.match(/^\d+\.\s+(.+)$/);
    if (ul) {
      if (inList !== 'ul') { closeList(); out.push('<ul>'); inList = 'ul'; }
      out.push(`<li>${inlineMd(escapeHtml(ul[1]))}</li>`);
      continue;
    }
    if (ol) {
      if (inList !== 'ol') { closeList(); out.push('<ol>'); inList = 'ol'; }
      out.push(`<li>${inlineMd(escapeHtml(ol[1]))}</li>`);
      continue;
    }
    closeList();

    // 일반 문단
    out.push(`<p>${inlineMd(escapeHtml(raw))}</p>`);
  }
  closeList(); closeTable();
  if (inCode) out.push('</code></pre>');
  return out.join('\n');
}

const MD_TEMPLATE = (title, body) => `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(title)}</title>
<style>
  @page { size: A4; margin: 18mm 14mm 18mm 14mm; }
  body {
    font-family: "Pretendard", "Malgun Gothic", "Apple SD Gothic Neo", -apple-system, sans-serif;
    color: #1F2937; line-height: 1.55; font-size: 10.5pt;
  }
  h1 { font-size: 22pt; color: #B91C1C; border-bottom: 3px solid #C9A961;
       padding-bottom: 6pt; margin-top: 20pt; page-break-after: avoid; }
  h2 { font-size: 16pt; color: #0F1E3D; margin-top: 18pt; border-left: 4px solid #38BDF8;
       padding-left: 8pt; page-break-after: avoid; }
  h3 { font-size: 13pt; color: #0F1E3D; margin-top: 14pt; page-break-after: avoid; }
  h4 { font-size: 11.5pt; color: #374151; margin-top: 10pt; page-break-after: avoid; }
  p { margin: 6pt 0; }
  ul, ol { margin: 6pt 0; padding-left: 22pt; }
  li { margin: 2pt 0; }
  blockquote {
    border-left: 3px solid #C9A961; background: #FFF7E6;
    padding: 8pt 12pt; margin: 8pt 0; font-style: italic; color: #4B5563;
  }
  table { width: 100%; border-collapse: collapse; margin: 8pt 0; font-size: 9.5pt; page-break-inside: avoid; }
  th { background: #0F1E3D; color: white; padding: 6pt; text-align: left; }
  td { border-bottom: 1px solid #E5E7EB; padding: 5pt 6pt; vertical-align: top; }
  tr:nth-child(even) td { background: #F9FAFB; }
  code { background: #F3F4F6; padding: 1pt 4pt; border-radius: 3pt;
    font-family: "Consolas", "Menlo", monospace; font-size: 9.5pt; color: #B91C1C; }
  pre.code {
    background: #1F2937; color: #E5E7EB; padding: 8pt 10pt; border-radius: 4pt;
    overflow-x: auto; font-size: 9pt; line-height: 1.45;
    page-break-inside: avoid;
  }
  pre.code code { background: none; color: inherit; padding: 0; }
  hr { border: 0; border-top: 1px dashed #9CA3AF; margin: 14pt 0; }
  a { color: #2563EB; }
  strong { color: #0F1E3D; }
  .cover {
    text-align: center; padding: 80pt 0 40pt;
    border-bottom: 4px double #C9A961; margin-bottom: 24pt;
    page-break-after: always;
  }
  .cover h1 { font-size: 32pt; border: none; padding: 0; }
  .cover .subtitle { font-size: 14pt; color: #4B5563; margin-top: 8pt; }
  .cover .meta { font-size: 10pt; color: #6B7280; margin-top: 28pt; }
</style>
</head>
<body>
<div class="cover">
  <h1>${escapeHtml(title)}</h1>
  <div class="subtitle">FireNavi v3.0 · Smartphone-First · Crowdsourced Survival</div>
  <div class="meta">© 2026 심재우 · jaiwshim@gmail.com · 010-2397-5734</div>
</div>
${body}
</body>
</html>`;

async function mdToPdf(browser, mdPath) {
  const md = fs.readFileSync(path.join(HERE, mdPath), 'utf8');
  // 첫 헤딩에서 제목 추출
  const titleMatch = md.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].replace(/[#*`>]/g, '').trim() : path.basename(mdPath, '.md');
  const html = renderMarkdown(md);
  const fullHtml = MD_TEMPLATE(title, html);
  const tmp = path.join(OUT, '__tmp_md__.html');
  fs.writeFileSync(tmp, fullHtml, 'utf8');
  const page = await browser.newPage();
  await page.goto('file:///' + tmp.replace(/\\/g, '/'), { waitUntil: 'networkidle0', timeout: 60000 });
  const out = path.join(OUT, path.basename(mdPath, '.md') + '.pdf');
  await page.pdf({
    path: out, format: 'A4', printBackground: true,
    margin: { top: '18mm', bottom: '18mm', left: '14mm', right: '14mm' },
  });
  await page.close();
  fs.unlinkSync(tmp);
  console.log(`✅ ${path.basename(mdPath)} → pdf/${path.basename(out)}`);
}

async function htmlToPdf(browser, htmlPath, opts = {}) {
  const page = await browser.newPage();
  const url = 'file:///' + path.join(HERE, htmlPath).replace(/\\/g, '/');
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.evaluate(() => new Promise(r => setTimeout(r, 600))); // 폰트·애니메이션 안정화
  const out = path.join(OUT, path.basename(htmlPath, '.html') + '.pdf');
  // 슬라이드는 가로 풀스크린, master는 컬러배경 보존, poc는 시연 캡처
  const isSlides = /slides/i.test(htmlPath);
  await page.pdf({
    path: out,
    format: 'A4',
    landscape: !!opts.landscape || isSlides,
    printBackground: true,
    preferCSSPageSize: false,
    margin: isSlides
      ? { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' }
      : { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
    width: isSlides ? '297mm' : undefined,
    height: isSlides ? '210mm' : undefined,
  });
  await page.close();
  console.log(`✅ ${htmlPath} → pdf/${path.basename(out)}`);
}

(async () => {
  console.log('🚀 FireNavi v3.0 PDF 일괄 변환 시작\n');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
  });
  try {
    // HTML 변환
    for (const h of HTML_TARGETS) {
      try { await htmlToPdf(browser, h); }
      catch (e) { console.error(`❌ ${h}: ${e.message}`); }
    }
    // Markdown 변환
    for (const m of MD_TARGETS) {
      try { await mdToPdf(browser, m); }
      catch (e) { console.error(`❌ ${m}: ${e.message}`); }
    }
  } finally {
    await browser.close();
  }
  console.log('\n🎉 PDF 변환 완료 — Mobile/pdf/');
  const files = fs.readdirSync(OUT).filter(f => f.endsWith('.pdf'));
  console.log(`📄 생성된 PDF: ${files.length}개`);
  files.forEach(f => {
    const stat = fs.statSync(path.join(OUT, f));
    console.log(`   - ${f} (${(stat.size/1024).toFixed(1)} KB)`);
  });
})();
