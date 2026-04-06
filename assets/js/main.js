/* ============================================
   FloridaHomeOffer - Main JS
   Nav, footer, scroll effects, FAQ toggle
   ============================================ */

(function() {
  'use strict';

  const BRAND = 'Florida<span>HomeOffer</span>';
  const PHONE = '(321) 555-0199';
  const PHONE_HREF = 'tel:+13215550199';
  const YEAR = new Date().getFullYear();

  // --- Shared Nav HTML ---
  function buildNav() {
    const page = document.body.dataset.page || '';
    const stripped = document.body.dataset.navStripped === 'true';
    const links = [
      { href: '/', label: 'Home', id: 'home' },
      { href: '/how-it-works.html', label: 'How It Works', id: 'how-it-works' },
      { href: '/compare-options.html', label: 'Compare Options', id: 'compare' },
      { href: '/categories.html', label: 'Property Types', id: 'categories' },
      { href: '/faq.html', label: 'FAQ', id: 'faq' },
      { href: '/about.html', label: 'About', id: 'about' },
      { href: '/contact.html', label: 'Contact', id: 'contact' },
    ];

    const linkHTML = links.map(l =>
      `<a href="${l.href}" class="${page === l.id ? 'active' : ''}">${l.label}</a>`
    ).join('');

    return `
    <nav class="nav${stripped ? ' nav--stripped' : ''}" id="main-nav">
      <div class="nav__inner">
        <a href="/" class="nav__logo">${BRAND}</a>
        <div class="nav__links" id="nav-links">
          ${linkHTML}
          <a href="${PHONE_HREF}" class="nav__phone">${PHONE}</a>
          <a href="/cash-offer.html" class="nav__cta">Get Cash Offer</a>
        </div>
        <button class="nav__hamburger" id="nav-toggle" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>`;
  }

  // --- Shared Footer HTML ---
  function buildFooter() {
    return `
    <div class="cta-bar">
      <div class="container">
        <h2>Ready to Sell Your Florida Home?</h2>
        <p>Get a fair, no-obligation cash offer in 24 hours. No agents, no fees, no repairs.</p>
        <a href="/cash-offer.html" class="btn btn--white btn--large">Get My Cash Offer</a>
      </div>
    </div>
    <footer class="footer">
      <div class="container">
        <div class="footer__grid">
          <div>
            <div class="footer__brand">${BRAND}</div>
            <p class="footer__desc">Florida's trusted home selling resource. We help homeowners sell fast for cash - residential, commercial, land, and more. Serving all 67 counties.</p>
          </div>
          <div>
            <h4>Property Types</h4>
            <ul>
              <li><a href="/categories.html#residential">Residential</a></li>
              <li><a href="/categories.html#commercial">Commercial</a></li>
              <li><a href="/categories.html#land">Vacant Land</a></li>
              <li><a href="/categories.html#multi-family">Multi-Family</a></li>
              <li><a href="/categories.html#mobile-homes">Mobile Homes</a></li>
              <li><a href="/categories.html#condos">Condos</a></li>
            </ul>
          </div>
          <div>
            <h4>Top Cities</h4>
            <ul>
              <li><a href="/cities/sell-house-fast-miami.html">Miami</a></li>
              <li><a href="/cities/sell-house-fast-orlando.html">Orlando</a></li>
              <li><a href="/cities/sell-house-fast-tampa.html">Tampa</a></li>
              <li><a href="/cities/sell-house-fast-jacksonville.html">Jacksonville</a></li>
              <li><a href="/cities/sell-house-fast-fort-lauderdale.html">Fort Lauderdale</a></li>
              <li><a href="/cities/sell-house-fast-cape-canaveral.html">Cape Canaveral</a></li>
            </ul>
          </div>
          <div>
            <h4>Resources</h4>
            <ul>
              <li><a href="/guides/">Seller Guides</a></li>
              <li><a href="/situations/">Selling Situations</a></li>
              <li><a href="/case-studies/">Success Stories</a></li>
              <li><a href="/blog/">Blog</a></li>
              <li><a href="/states/">All 50 States</a></li>
              <li><a href="/closing-cost-calculator.html">Closing Cost Calculator</a></li>
              <li><a href="/florida-market-report.html">FL Market Report</a></li>
              <li><a href="/faq.html">FAQ</a></li>
            </ul>
          </div>
        </div>
        <div class="footer__bottom">
          <p class="footer__copy">&copy; ${YEAR} FloridaHomeOffer. All rights reserved. WETYR Corp.</p>
          <div class="footer__legal">
            <a href="/faq.html">FAQ</a>
            <a href="/contact.html">Contact</a>
          </div>
        </div>
      </div>
    </footer>`;
  }

  // --- Inject Header/Footer ---
  function injectLayout() {
    var header = document.getElementById('site-header');
    var footer = document.getElementById('site-footer');
    if (header) header.innerHTML = buildNav();
    if (footer) footer.innerHTML = buildFooter();
  }

  // --- Mobile Nav Toggle ---
  function initMobileNav() {
    document.addEventListener('click', function(e) {
      var toggle = e.target.closest('#nav-toggle');
      if (toggle) {
        var nav = document.getElementById('main-nav');
        if (nav) nav.classList.toggle('nav--open');
        return;
      }
      // Close on link click
      if (e.target.closest('.nav__links a')) {
        var nav2 = document.getElementById('main-nav');
        if (nav2) nav2.classList.remove('nav--open');
      }
    });
  }

  // --- Scroll Nav Effect ---
  function initScrollNav() {
    var nav = document.getElementById('main-nav');
    if (!nav) return;
    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          nav.classList.toggle('nav--scrolled', window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // --- Scroll Reveal ---
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function(el) { observer.observe(el); });
  }

  // --- Stat Counter Animation ---
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function(el) { observer.observe(el); });
  }

  function animateCounter(el) {
    var target = parseInt(el.dataset.count, 10);
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    var duration = 1500;
    var start = 0;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // --- FAQ Accordion ---
  function initFAQ() {
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('.faq-item__q');
      if (!btn) return;
      var item = btn.closest('.faq-item');
      if (!item) return;
      // Close siblings
      var parent = item.parentElement;
      if (parent) {
        parent.querySelectorAll('.faq-item.open').forEach(function(open) {
          if (open !== item) open.classList.remove('open');
        });
      }
      item.classList.toggle('open');
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  function initSmoothScroll() {
    document.addEventListener('click', function(e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // --- Inject Head Meta (OG, Twitter, Geo, Favicon) ---
  function injectHeadMeta() {
    var head = document.head;
    var title = document.title.split('|')[0].trim();
    var desc = '';
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) desc = metaDesc.getAttribute('content') || '';
    var url = window.location.href;
    var siteName = 'FloridaHomeOffer';
    var ogImage = 'https://florida-home-offer.netlify.app/og-image.png';

    function addMeta(property, content) {
      if (!content || document.querySelector('meta[property="' + property + '"]')) return;
      var m = document.createElement('meta');
      m.setAttribute('property', property);
      m.setAttribute('content', content);
      head.appendChild(m);
    }
    function addMetaName(name, content) {
      if (!content || document.querySelector('meta[name="' + name + '"]')) return;
      var m = document.createElement('meta');
      m.setAttribute('name', name);
      m.setAttribute('content', content);
      head.appendChild(m);
    }

    // Open Graph
    addMeta('og:title', title);
    addMeta('og:description', desc);
    addMeta('og:url', url);
    addMeta('og:type', 'website');
    addMeta('og:site_name', siteName);
    addMeta('og:image', ogImage);
    addMeta('og:image:width', '1200');
    addMeta('og:image:height', '630');

    // Twitter Card
    addMetaName('twitter:card', 'summary_large_image');
    addMetaName('twitter:title', title);
    addMetaName('twitter:description', desc);
    addMetaName('twitter:image', ogImage);

    // Geo tags (all pages)
    addMetaName('geo.region', 'US-FL');
    addMetaName('geo.placename', 'Florida');

    // City-specific geo
    var city = document.body.dataset.city;
    if (city) {
      addMetaName('geo.placename', city + ', Florida');
    }

    // Favicon
    if (!document.querySelector('link[rel="icon"]')) {
      var fav = document.createElement('link');
      fav.rel = 'icon';
      fav.type = 'image/svg+xml';
      fav.href = '/favicon.svg';
      head.appendChild(fav);
    }

    // Manifest
    if (!document.querySelector('link[rel="manifest"]')) {
      var man = document.createElement('link');
      man.rel = 'manifest';
      man.href = '/manifest.json';
      head.appendChild(man);
    }
  }

  // --- Inject Analytics (GA4 + Clarity) ---
  function injectAnalytics() {
    // GA4 - replace G-XXXXXXXXXX with real ID when available
    var GA_ID = 'G-PLACEHOLDER';
    if (GA_ID !== 'G-PLACEHOLDER') {
      var gs = document.createElement('script');
      gs.async = true;
      gs.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
      document.head.appendChild(gs);
      var gi = document.createElement('script');
      gi.textContent = 'window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","' + GA_ID + '");';
      document.head.appendChild(gi);
    }

    // Microsoft Clarity - replace CLARITY_ID when available
    var CLARITY_ID = 'PLACEHOLDER';
    if (CLARITY_ID !== 'PLACEHOLDER') {
      var cs = document.createElement('script');
      cs.textContent = '(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","' + CLARITY_ID + '");';
      document.head.appendChild(cs);
    }
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', function() {
    injectHeadMeta();
    injectAnalytics();
    injectLayout();
    initMobileNav();
    initScrollNav();
    initReveal();
    initCounters();
    initFAQ();
    initSmoothScroll();
  });
})();
