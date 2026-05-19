// Shared HTML template for dynamic geo pages on Cloudflare Pages Functions.
// Produces a full SEO-optimized page identical in look to the static pages.

const SITE = 'https://onecashoffer.com';
const BRAND = 'OneCashOffer';
const PHONE = '(321) 555-0199';
const PHONE_HREF = 'tel:+13215550199';

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
}

function escapeAttr(s) { return escapeHtml(s); }

// Title-case a city/county name. The source CSV has inconsistent caps ("Los angeles", "Beverly hills").
export function titleCase(s) {
  if (!s) return '';
  return String(s).toLowerCase().replace(/\b([a-z])(\w*)/g, (_, a, b) => a.toUpperCase() + b)
    // Common preposition fixes
    .replace(/\b(Of|And|The|In|On|At|For|To|Or|De|La|El|Las|Los|Del|Da|St)\b/g, m => m.toLowerCase())
    // Re-capitalize first word always
    .replace(/^./, c => c.toUpperCase())
    // Common abbreviations
    .replace(/\bMc([a-z])/g, (_, c) => 'Mc' + c.toUpperCase())
    .replace(/\bUsa\b/g, 'USA')
    .replace(/\bDc\b/g, 'DC')
    .replace(/\bNyc\b/g, 'NYC')
    // St. prefix
    .replace(/\bSt\b\.?/g, 'St.');
}

/**
 * Build a full HTML page.
 * opts = {
 *   page: 'zip'|'sell'|'distressed'|'premium',
 *   slug: string,                  (URL slug for body[data-page])
 *   path: string,                  (canonical URL path, must start with /)
 *   title: string,                 (full <title>)
 *   description: string,           (meta description)
 *   h1Lead: string,                (H1 text before the gold span)
 *   h1Gold: string,                (H1 text inside gold span)
 *   subtitle: string,              (small subtitle above H1)
 *   heroSub: string,               (paragraph below H1)
 *   crumbs: [{name,path}],         (breadcrumb trail; "Home" prepended automatically)
 *   intro: string                  (HTML for "intro" section content)
 *   sections: [{h2, html}]         (H2 sections)
 *   marketSnapshot: [[label, value]],
 *   faq: [{q, a}],
 *   relatedLinks: [{href, label, sub}],
 *   schemaCity?: string,           (for LocalBusiness)
 *   schemaCounty?: string,
 *   schemaState?: string,
 *   schemaZip?: string,
 *   schemaLat?: number,
 *   schemaLng?: number,
 * }
 */
export function renderPage(opts) {
  const {
    page, slug, path, title, description, h1Lead, h1Gold, subtitle, heroSub,
    crumbs = [], intro = '', sections = [], marketSnapshot = [], faq = [],
    relatedLinks = [], schemaCity = '', schemaCounty = '', schemaState = '',
    schemaZip = '', schemaLat = null, schemaLng = null
  } = opts;

  const canonical = SITE + path;
  const ogImage = SITE + '/og-image.png';

  // Breadcrumbs HTML
  const allCrumbs = [{ name: 'Home', path: '/' }, ...crumbs];
  const breadcrumbHtml = allCrumbs.map((c, i) =>
    i === allCrumbs.length - 1
      ? `<span>${escapeHtml(c.name)}</span>`
      : `<a href="${escapeAttr(c.path)}">${escapeHtml(c.name)}</a> <span>&#8250;</span>`
  ).join(' ');

  // Schema.org JSON-LD: Organization + BreadcrumbList + LocalBusiness + FAQPage
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'RealEstateAgent'],
        '@id': SITE + '/#organization',
        name: BRAND,
        url: SITE,
        telephone: '+13215550199',
        description: 'Nationwide cash home buyer. Free 24-hour cash offer. Any property, any condition, any state.',
        areaServed: { '@type': 'Country', name: 'United States' },
        sameAs: []
      },
      {
        '@type': 'WebSite',
        '@id': SITE + '/#website',
        url: SITE,
        name: BRAND,
        publisher: { '@id': SITE + '/#organization' }
      },
      {
        '@type': 'WebPage',
        '@id': canonical + '#webpage',
        url: canonical,
        name: title,
        description,
        isPartOf: { '@id': SITE + '/#website' },
        breadcrumb: { '@id': canonical + '#breadcrumb' }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': canonical + '#breadcrumb',
        itemListElement: allCrumbs.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.name,
          item: SITE + c.path
        }))
      }
    ]
  };

  // LocalBusiness schema if we have city info
  if (schemaCity || schemaZip) {
    const lb = {
      '@type': ['RealEstateAgent', 'LocalBusiness'],
      '@id': canonical + '#localbusiness',
      name: BRAND + ' - ' + (schemaCity ? schemaCity + ', ' + (schemaState || '') : 'ZIP ' + schemaZip),
      url: canonical,
      telephone: '+13215550199',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        addressLocality: schemaCity || undefined,
        addressRegion: schemaState || undefined,
        postalCode: schemaZip || undefined,
        addressCountry: 'US'
      },
      areaServed: schemaCity ? {
        '@type': 'City',
        name: schemaCity,
        containedInPlace: schemaCounty ? { '@type': 'AdministrativeArea', name: schemaCounty + ', ' + (schemaState || '') } : undefined
      } : undefined
    };
    if (schemaLat != null && schemaLng != null) {
      lb.geo = { '@type': 'GeoCoordinates', latitude: schemaLat, longitude: schemaLng };
    }
    schema['@graph'].push(lb);
  }

  // FAQPage schema
  if (faq && faq.length > 0) {
    schema['@graph'].push({
      '@type': 'FAQPage',
      '@id': canonical + '#faq',
      mainEntity: faq.map(q => ({
        '@type': 'Question',
        name: q.q,
        acceptedAnswer: { '@type': 'Answer', text: q.a }
      }))
    });
  }

  // Market snapshot table
  const marketHtml = marketSnapshot.length > 0
    ? `<table class="market-table"><thead><tr><th>Metric</th><th>Value</th></tr></thead><tbody>
        ${marketSnapshot.map(([k, v]) => `<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`).join('')}
      </tbody></table>`
    : '';

  // Sections (H2 + content)
  const sectionsHtml = sections.map(s =>
    `<h2 id="${escapeAttr((s.h2 || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))}">${escapeHtml(s.h2 || '')}</h2>${s.html || ''}`
  ).join('');

  // FAQ HTML
  const faqHtml = faq.length > 0
    ? `<section class="section section--dark">
        <div class="container--narrow">
          <h2 class="text-center mb-4">Frequently Asked Questions</h2>
          <div class="faq-list">
            ${faq.map(q => `<div class="faq-item">
              <button class="faq-item__q">${escapeHtml(q.q)}</button>
              <div class="faq-item__a"><p>${escapeHtml(q.a)}</p></div>
            </div>`).join('')}
          </div>
        </div>
      </section>`
    : '';

  // Related links
  const relatedHtml = relatedLinks.length > 0
    ? `<section class="section">
        <div class="container">
          <h2 class="text-center mb-4">Nearby & Related</h2>
          <div class="city-grid">
            ${relatedLinks.map(r =>
              `<a href="${escapeAttr(r.href)}" class="city-link">${escapeHtml(r.label)}${r.sub ? ` <span class="city-link__arrow">&#8594;</span>` : ' <span class="city-link__arrow">&#8594;</span>'}</a>`
            ).join('')}
          </div>
        </div>
      </section>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeAttr(description)}">
  <meta name="geo.region" content="US${schemaState ? '-' + schemaState : ''}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeAttr(title)}">
  <meta property="og:description" content="${escapeAttr(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:site_name" content="${BRAND}">
  <meta property="og:image" content="${ogImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeAttr(title)}">
  <meta name="twitter:description" content="${escapeAttr(description)}">
  <meta name="twitter:image" content="${ogImage}">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="manifest" href="/manifest.json">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/main.css">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body data-page="${escapeAttr(page + '-' + slug)}" data-schema-type="city" data-city="${escapeAttr(schemaCity)}" data-county="${escapeAttr(schemaCounty)}" data-state="${escapeAttr(schemaState)}">
  <div id="site-header"></div>

  <div class="container"><div class="breadcrumb">${breadcrumbHtml}</div></div>

  <section class="hero hero--compact glow-top">
    <div class="hero__content">
      <p class="subtitle">${escapeHtml(subtitle)}</p>
      <h1>${escapeHtml(h1Lead)} <span class="gold">${escapeHtml(h1Gold)}</span></h1>
      <p class="hero__sub">${escapeHtml(heroSub)}</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="two-col">
        <div>
          ${intro}
          ${marketHtml}
          ${sectionsHtml}
        </div>
        <div>
          <div id="page-lead-form" style="position:sticky;top:100px;"></div>
        </div>
      </div>
    </div>
  </section>

  ${faqHtml}
  ${relatedHtml}

  <div id="site-footer"></div>
  <script src="/assets/js/main.js"></script>
  <script src="/assets/js/lead-form.js"></script>
  <script src="/assets/js/schema.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      if (window.injectLeadForm) {
        injectLeadForm('page-lead-form', {
          heading: 'Get Your Cash Offer',
          subtext: 'Free, no-obligation cash offer for ${escapeAttr(schemaCity || ('ZIP ' + schemaZip))} in 24 hours.',
          compact: true
        });
      }
    });
  </script>
</body>
</html>`;
}

export function htmlResponse(html, opts = {}) {
  return new Response(html, {
    status: opts.status || 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      ...opts.headers
    }
  });
}

export function notFoundResponse() {
  return new Response(`<!DOCTYPE html><html><head><title>Not Found | ${BRAND}</title><meta name="robots" content="noindex"></head><body><h1>404 - Not Found</h1><p>That location is not in our database. <a href="/">Return home</a> or <a href="/cash-offer">get a cash offer</a>.</p></body></html>`, {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
