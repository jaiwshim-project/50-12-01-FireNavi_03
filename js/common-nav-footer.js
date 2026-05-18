/* FireNavi - Common Nav + Footer Injector
   모든 페이지에서 이 스크립트만 로드하면 nav/footer가 랜딩과 동일하게 적용됨 */
(function () {
  const path = window.location.pathname.replace(/\\/g, '/');
  const isSubpage = /\/pages\//.test(path);
  const pre = isSubpage ? '../' : '';
  const current = (path.split('/').pop() || 'index.html').toLowerCase();
  const act = (file) => current === file.toLowerCase() ? ' class="active"' : '';

  const navHTML = `
    <nav class="top-nav">
      <div class="nav-inner">
        <a href="${pre}index.html" class="nav-brand">
          <img src="${pre}firenavi-logo.svg" alt="FireNavi" class="nav-logo-img" style="height:36px;vertical-align:middle;margin-right:6px;">
          <span class="nav-tagline">AI 기반 실시간 생존 의사결정 플랫폼</span>
        </a>
        <ul class="nav-links">
          <li><a href="${pre}index.html"${act('index.html')}>Dashboard</a></li>
          <li><a href="${pre}pages/a-technical-formulation.html"${act('a-technical-formulation.html')}>A. 기술 수식화</a></li>
          <li><a href="${pre}pages/b-industrial-architecture.html"${act('b-industrial-architecture.html')}>B. 산업 아키텍처</a></li>
          <li><a href="${pre}pages/c-shipyard-proposal.html"${act('c-shipyard-proposal.html')}>C. 조선소 제안</a></li>
          <li><a href="${pre}pages/d-insurance-risk-model.html"${act('d-insurance-risk-model.html')}>D. 보험 리스크</a></li>
          <li><a href="${pre}pages/simulation.html"${act('simulation.html')}>시뮬레이션</a></li>
          <li><a href="${pre}pages/risk-map.html"${act('risk-map.html')}>위험지도</a></li>
          <li><a href="${pre}pages/route-optimizer.html"${act('route-optimizer.html')}>경로최적화</a></li>
          <li><a href="${pre}manual.html" style="color:#B91C1C;"${act('manual.html')}>매뉴얼</a></li>
          <li><a href="${pre}docs/diagrams/architecture.svg" style="color:#6D28D9;">구조도</a></li>
        </ul>
        <button class="nav-mobile-toggle" type="button" aria-label="Menu">&#9776;</button>
      </div>
    </nav>
  `;

  const footerHTML = `
    <footer class="footer-premium">
      <div class="footer-premium-inner">
        <div class="footer-grid">
          <div class="footer-col footer-col--brand">
            <div class="footer-logo"><img src="${pre}firenavi-logo.svg" alt="FireNavi" style="height:40px;vertical-align:middle;"></div>
            <p class="footer-tagline">AI 기반 실시간 생존 의사결정 플랫폼</p>
            <p class="footer-desc">화재보다 빠르게 판단하는 AI.<br>길을 안내하는 것이 아니라 생존을 설계합니다.</p>
            <div class="footer-badges">
              <span class="footer-badge">Safety</span>
              <span class="footer-badge">Security</span>
              <span class="footer-badge">Operation</span>
            </div>
          </div>
          <div class="footer-col">
            <h4 class="footer-col-title">Core Modules</h4>
            <ul class="footer-links">
              <li><a href="${pre}pages/a-technical-formulation.html">A. 기술 수식화</a></li>
              <li><a href="${pre}pages/b-industrial-architecture.html">B. 산업 아키텍처</a></li>
              <li><a href="${pre}pages/c-shipyard-proposal.html">C. 조선소 제안</a></li>
              <li><a href="${pre}pages/d-insurance-risk-model.html">D. 보험 리스크</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4 class="footer-col-title">Interactive</h4>
            <ul class="footer-links">
              <li><a href="${pre}pages/simulation.html">실시간 시뮬레이션</a></li>
              <li><a href="${pre}pages/risk-map.html">동적 위험지도</a></li>
              <li><a href="${pre}pages/route-optimizer.html">경로 최적화</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4 class="footer-col-title">Resources</h4>
            <ul class="footer-links">
              <li><a href="${pre}manual.html">매뉴얼 페이지</a></li>
              <li><a href="${pre}docs/diagrams/architecture.svg">아키텍처 구조도</a></li>
            </ul>
            <h4 class="footer-col-title" style="margin-top:20px;">Contact</h4>
            <ul class="footer-links">
              <li><a href="mailto:jaiwshim@gmail.com">jaiwshim@gmail.com</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-engines">
          <div class="footer-engine"><span class="footer-engine-dot" style="background:#B91C1C;"></span><span>Prediction Engine</span></div>
          <div class="footer-engine"><span class="footer-engine-dot" style="background:#1E40AF;"></span><span>Behavior Engine</span></div>
          <div class="footer-engine"><span class="footer-engine-dot" style="background:#6D28D9;"></span><span>Decision Engine</span></div>
          <div class="footer-engine"><span class="footer-engine-dot" style="background:#B76E79;"></span><span>Priority Rescue AI</span></div>
          <div class="footer-engine"><span class="footer-engine-dot" style="background:#C9A961;"></span><span>WiFi Positioning</span></div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 FireNavi. Patented Technology. All Rights Reserved.</p>
          <p>9 Mathematical Models &middot; 29 Equations &middot; 5 Patents &middot; 3 AI Engines</p>
        </div>
      </div>
    </footer>
  `;

  function inject() {
    const existingNav = document.querySelector('nav.top-nav');
    if (existingNav) {
      existingNav.outerHTML = navHTML;
    } else {
      const wrap = document.querySelector('.page-wrapper') || document.body;
      wrap.insertAdjacentHTML('afterbegin', navHTML);
    }
    const existingFooter = document.querySelector('footer.footer-premium');
    if (existingFooter) {
      existingFooter.outerHTML = footerHTML;
    } else {
      const wrap = document.querySelector('.page-wrapper') || document.body;
      wrap.insertAdjacentHTML('beforeend', footerHTML);
    }
    // 모바일 토글 재바인딩
    const toggle = document.querySelector('.nav-mobile-toggle');
    const links = document.querySelector('.nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => links.classList.toggle('open'));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
