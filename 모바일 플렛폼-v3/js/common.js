/* FireNavi v3.0 Site — Common Nav/Footer Injection */

const NAV_LINKS = [
  { href: 'index.html', label: '홈' },
  { href: 'technology.html', label: '기술' },
  { href: 'disability.html', label: '30유형 보호' },
  { href: 'patent-portfolio.html', label: '특허 10건' },
  { href: 'comparison.html', label: 'v2→v3 차별성' },
  { href: 'business.html', label: '시장·팀·로드맵' },
  { href: 'lab/index.html', label: '🧪 Lab' },
];

function getCurrentPage() {
  const p = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  return p || 'index.html';
}

function isInLab() {
  return window.location.pathname.toLowerCase().includes('/lab/');
}

function injectNav() {
  const current = getCurrentPage();
  const prefix = isInLab() ? '../' : '';
  const labMode = isInLab();
  const linksHtml = NAV_LINKS.map(l => {
    // Lab 안에서 클릭 시 lab/index.html 링크는 그대로(./index.html)이고 나머지는 ../로
    let href = l.href;
    if (labMode) {
      if (l.href === 'lab/index.html') href = 'index.html';
      else href = '../' + l.href;
    }
    const isActive = labMode && l.href === 'lab/index.html' && current === 'index.html'
      ? true : (!labMode && l.href === current);
    return `<a href="${href}" class="${isActive ? 'active' : ''}">${l.label}</a>`;
  }).join('');
  const nav = document.querySelector('.topnav-inner');
  if (!nav) return;
  const logoHref = labMode ? '../index.html' : 'index.html';
  const pocHref = labMode ? '../../smartphone-poc.html' : '../smartphone-poc.html';
  nav.innerHTML = `
    <a href="${logoHref}" class="logo">
      <span class="icon">🚒</span>
      <span>FireNavi</span>
      <span class="v">v3.0</span>
    </a>
    <div class="links">
      ${linksHtml}
      <a href="${pocHref}" class="cta-btn" target="_blank">▶ PoC 데모</a>
    </div>
    <div class="hamburger" id="hamburger" aria-label="메뉴">☰</div>
  `;
  const ham = document.getElementById('hamburger');
  if (ham) ham.addEventListener('click', () => {
    document.querySelector('.topnav').classList.toggle('mobile-open');
  });
}

function injectFooter() {
  const f = document.querySelector('footer.site-footer');
  if (!f) return;
  const labMode = isInLab();
  const p = labMode ? '../' : '';        // site root 기준 상위
  const pp = labMode ? '../../' : '../';  // Mobile root 기준 상위
  f.innerHTML = `
    <div class="container">
      <div class="footer-brand">
        <h3>🚒 FireNavi v3.0</h3>
        <p>이미 들고 있는 폰이 가장 강력한 안전 센서가 됩니다. AI가 4,000명의 인간 센서를 매 순간 융합하여, 가장 취약한 사람을 가장 먼저, 가장 안전하게 살립니다.</p>
        <p style="margin-top:14px;font-size:0.78rem;">© 2026 심재우 · AI 챔피언 2026 출품작</p>
      </div>
      <div class="footer-col">
        <h4>플랫폼</h4>
        <ul>
          <li><a href="${p}index.html">홈</a></li>
          <li><a href="${p}technology.html">기술 (5단계)</a></li>
          <li><a href="${p}disability.html">30유형 보호</a></li>
          <li><a href="${p}patent-portfolio.html">특허 10건</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>비즈니스</h4>
        <ul>
          <li><a href="${p}comparison.html">v2→v3 차별성</a></li>
          <li><a href="${p}business.html">시장·로드맵</a></li>
          <li><a href="${p}lab/index.html">🧪 Research Lab</a></li>
          <li><a href="${pp}firenavi-v3-slides.html">발표 슬라이드</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <ul>
          <li><a href="mailto:jaiwshim@gmail.com">jaiwshim@gmail.com</a></li>
          <li><a href="tel:01023975734">010-2397-5734</a></li>
          <li><a href="${pp}smartphone-poc.html" target="_blank">▶ PoC 데모</a></li>
          <li><a href="${pp}pdf/FireNavi_AI_Champion_Master_Proposal.pdf">PDF 기획서</a></li>
        </ul>
      </div>
    </div>
    <div class="copyright">
      FireNavi v3.0 — Smartphone-First · AI-Driven · Crowdsourced Survival<br>
      9 Patents · 13 Mathematical Models · 30 Disability Types · 4 Copyrights
    </div>
  `;
}

// Counter animation
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = '1';
        const target = parseFloat(entry.target.dataset.count);
        const suffix = entry.target.dataset.suffix || '';
        const prefix = entry.target.dataset.prefix || '';
        const decimals = parseInt(entry.target.dataset.decimals || '0');
        const dur = 1500;
        const start = performance.now();
        const tick = (now) => {
          const elapsed = now - start;
          const t = Math.min(1, elapsed / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          const val = target * eased;
          entry.target.textContent = prefix + val.toFixed(decimals) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    });
  }, { threshold: 0.3 });
  counters.forEach(c => observer.observe(c));
}

// Scroll fade-in
function initScrollAnimation() {
  const els = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  injectNav();
  injectFooter();
  animateCounters();
  initScrollAnimation();
});
