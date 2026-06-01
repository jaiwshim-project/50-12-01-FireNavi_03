/* ============================================
   FireNavi - 화이어내비 Main JavaScript
   ============================================ */

// ============ MOBILE NAV ============
function initMobileNav() {
  const toggle = document.querySelector('.nav-mobile-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !links.contains(e.target)) {
        links.classList.remove('open');
      }
    });
  }
}

// ============ TABS ============
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    const buttons = tabGroup.querySelectorAll('.tab-btn');
    const parent = tabGroup.parentElement;
    const contents = parent.querySelectorAll('.tab-content');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        buttons.forEach(b => b.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const targetEl = parent.querySelector(`#${target}`);
        if (targetEl) targetEl.classList.add('active');
      });
    });
  });
}

// ============ ACCORDION ============
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const wasOpen = item.classList.contains('open');
      // Close all in same group
      const group = item.parentElement;
      group.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

// ============ SCROLL ANIMATIONS ============
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.card, .content-section, .stat-card').forEach(el => {
    observer.observe(el);
  });
}

// ============ COUNTER ANIMATION ============
function animateCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
        const duration = 1500;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = (target * eased).toFixed(decimals);
          el.textContent = prefix + current + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
}

// ============ ACTIVE NAV HIGHLIGHT ============
function highlightActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
}

// ============ TOOLTIP ============
function initTooltips() {
  document.querySelectorAll('[data-tooltip]').forEach(el => {
    el.style.position = 'relative';
    el.style.cursor = 'help';

    el.addEventListener('mouseenter', () => {
      const tip = document.createElement('div');
      tip.className = 'tooltip-popup';
      tip.textContent = el.dataset.tooltip;
      tip.style.cssText = `
        position: absolute; bottom: calc(100% + 8px); left: 50%;
        transform: translateX(-50%); padding: 6px 12px;
        background: #2D3748; color: #E2E8F0; font-size: 0.75rem;
        border-radius: 6px; white-space: nowrap; z-index: 999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `;
      el.appendChild(tip);
    });

    el.addEventListener('mouseleave', () => {
      const tip = el.querySelector('.tooltip-popup');
      if (tip) tip.remove();
    });
  });
}

// ============ SMOOTH SCROLL ============
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initTabs();
  initAccordions();
  initScrollAnimations();
  animateCounters();
  highlightActiveNav();
  initTooltips();
  initSmoothScroll();
});
