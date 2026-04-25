#!/usr/bin/env node
/**
 * Build script: Generates city pages from template + data
 * and creates the sitemap.xml
 * Run: node build-cities.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const CITIES_DIR = path.join(ROOT, 'cities');
const DATA_FILE = path.join(ROOT, 'data', 'florida-cities.json');
const TEMPLATE_FILE = path.join(ROOT, 'city-template.html');
const SITEMAP_FILE = path.join(ROOT, 'sitemap.xml');
const SITE_URL = process.env.SITE_URL || 'https://florida-home-offer.netlify.app';

// Ensure cities directory exists
if (!fs.existsSync(CITIES_DIR)) {
  fs.mkdirSync(CITIES_DIR, { recursive: true });
}

// Load data and template
const cities = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
const template = fs.readFileSync(TEMPLATE_FILE, 'utf-8');

// Build a lookup map for nearby links
const cityMap = {};
cities.forEach(c => { cityMap[c.slug] = c; });

let generated = 0;

cities.forEach(city => {
  // Build nearby links HTML
  const nearbyLinks = (city.nearby || [])
    .filter(slug => cityMap[slug])
    .map(slug => {
      const n = cityMap[slug];
      return `<a href="/cities/sell-house-fast-${n.slug}.html" class="city-link">${n.name} <span class="city-link__arrow">&#8594;</span></a>`;
    })
    .join('\n        ');

  // Calculate total days
  const avgDays = parseInt(city.avg_days) || 40;
  const totalDays = avgDays + 37; // avg + 37 days for closing

  // Replace all tokens
  let html = template
    .replace(/\{\{CITY_NAME\}\}/g, city.name)
    .replace(/\{\{SLUG\}\}/g, city.slug)
    .replace(/\{\{COUNTY\}\}/g, city.county)
    .replace(/\{\{POPULATION\}\}/g, parseInt(city.population).toLocaleString())
    .replace(/\{\{MEDIAN_HOME_PRICE\}\}/g, city.median_home_price)
    .replace(/\{\{AVG_DAYS\}\}/g, String(avgDays))
    .replace(/\{\{TOTAL_DAYS\}\}/g, String(totalDays))
    .replace(/\{\{DESC\}\}/g, city.desc)
    .replace(/\{\{CHALLENGES\}\}/g, city.challenges)
    .replace(/\{\{NEARBY_LINKS\}\}/g, nearbyLinks);

  const filename = `sell-house-fast-${city.slug}.html`;
  fs.writeFileSync(path.join(CITIES_DIR, filename), html, 'utf-8');
  generated++;
});

// Generate city index page
const cityIndexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sell Your House Fast in Any Florida City - Cash Offers | FloridaHomeOffer</title>
  <meta name="description" content="We buy properties for cash in all 67 Florida counties. Find your city and get a free cash offer in 24 hours for any property type.">
  <link rel="canonical" href="${SITE_URL}/cities/">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body data-page="cities" data-schema-type="home">
  <div id="site-header"></div>
  <section class="hero hero--compact glow-top">
    <div class="hero__content">
      <p class="subtitle">All 67 Florida Counties</p>
      <h1>Sell Your Property in <span class="gold">Any Florida City</span></h1>
      <p class="hero__sub">We buy properties for cash across all of Florida. Select your city below for local market information and a free cash offer.</p>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="city-grid">
        ${cities.map(c => `<a href="/cities/sell-house-fast-${c.slug}.html" class="city-link">${c.name} <span class="city-link__arrow">&#8594;</span></a>`).join('\n        ')}
      </div>
    </div>
  </section>
  <section class="section section--dark">
    <div class="container" style="max-width:700px">
      <div id="cities-lead-form"></div>
    </div>
  </section>
  <div id="site-footer"></div>
  <script src="/assets/js/main.js"></script>
  <script src="/assets/js/lead-form.js"></script>
  <script src="/assets/js/schema.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      injectLeadForm('cities-lead-form', { heading: 'Get Your Cash Offer', subtext: 'Select your city above or submit your details here for a personalized offer.' });
    });
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(CITIES_DIR, 'index.html'), cityIndexHTML, 'utf-8');

// --- COUNTY PAGE GENERATION ---
const COUNTIES_DIR = path.join(ROOT, 'counties');
const COUNTY_DATA_FILE = path.join(ROOT, 'data', 'florida-counties.json');
const COUNTY_TEMPLATE_FILE = path.join(ROOT, 'county-template.html');

let countyGenerated = 0;
if (fs.existsSync(COUNTY_DATA_FILE) && fs.existsSync(COUNTY_TEMPLATE_FILE)) {
  if (!fs.existsSync(COUNTIES_DIR)) {
    fs.mkdirSync(COUNTIES_DIR, { recursive: true });
  }
  const counties = JSON.parse(fs.readFileSync(COUNTY_DATA_FILE, 'utf-8'));
  const countyTemplate = fs.readFileSync(COUNTY_TEMPLATE_FILE, 'utf-8');

  counties.forEach(county => {
    const cityLinks = (county.cities || [])
      .filter(slug => cityMap[slug])
      .map(slug => {
        const c = cityMap[slug];
        return `<a href="/cities/sell-house-fast-${c.slug}.html" class="city-link">${c.name} <span class="city-link__arrow">&#8594;</span></a>`;
      })
      .join('\n        ');

    let html = countyTemplate
      .replace(/\{\{COUNTY_NAME\}\}/g, county.name)
      .replace(/\{\{SLUG\}\}/g, county.slug)
      .replace(/\{\{POPULATION\}\}/g, parseInt(county.population || '0').toLocaleString())
      .replace(/\{\{MEDIAN_HOME_PRICE\}\}/g, county.median_home_price || 'varies')
      .replace(/\{\{COUNTY_SEAT\}\}/g, county.county_seat || '')
      .replace(/\{\{DESC\}\}/g, county.desc || '')
      .replace(/\{\{CHALLENGES\}\}/g, county.challenges || '')
      .replace(/\{\{CITY_LINKS\}\}/g, cityLinks);

    fs.writeFileSync(path.join(COUNTIES_DIR, `sell-property-${county.slug}.html`), html, 'utf-8');
    countyGenerated++;
  });

  // County index page
  const countyIndexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sell Property in Any Florida County - All 67 Counties | FloridaHomeOffer</title>
  <meta name="description" content="We buy properties for cash in all 67 Florida counties. Find your county for local market info and a free cash offer.">
  <link rel="canonical" href="${SITE_URL}/counties/">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body data-page="counties" data-schema-type="home">
  <div id="site-header"></div>
  <section class="hero hero--compact glow-top">
    <div class="hero__content">
      <p class="subtitle">All 67 Florida Counties</p>
      <h1>Sell Your Property in <span class="gold">Any Florida County</span></h1>
      <p class="hero__sub">We buy properties for cash across every county in Florida. Select your county below.</p>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="city-grid">
        ${counties.map(c => `<a href="/counties/sell-property-${c.slug}.html" class="city-link">${c.name} <span class="city-link__arrow">&#8594;</span></a>`).join('\n        ')}
      </div>
    </div>
  </section>
  <section class="section section--dark">
    <div class="container" style="max-width:700px">
      <div id="counties-lead-form"></div>
    </div>
  </section>
  <div id="site-footer"></div>
  <script src="/assets/js/main.js"></script>
  <script src="/assets/js/lead-form.js"></script>
  <script src="/assets/js/schema.js"></script>
  <script>document.addEventListener('DOMContentLoaded', function() { injectLeadForm('counties-lead-form', { heading: 'Get Your Cash Offer', subtext: 'Select your county or submit details here.' }); });</script>
</body>
</html>`;
  fs.writeFileSync(path.join(COUNTIES_DIR, 'index.html'), countyIndexHTML, 'utf-8');
  console.log(`Built ${countyGenerated} county pages + 1 index page`);
} else {
  console.log('County data or template not found, skipping county generation');
}

// --- NEIGHBORHOOD PAGE GENERATION ---
const NEIGHBORHOODS_DIR = path.join(ROOT, 'neighborhoods');
const NEIGHBORHOOD_DATA_FILE = path.join(ROOT, 'data', 'florida-neighborhoods.json');
const NEIGHBORHOOD_TEMPLATE_FILE = path.join(ROOT, 'neighborhood-template.html');

let neighborhoodGenerated = 0;
if (fs.existsSync(NEIGHBORHOOD_DATA_FILE) && fs.existsSync(NEIGHBORHOOD_TEMPLATE_FILE)) {
  if (!fs.existsSync(NEIGHBORHOODS_DIR)) {
    fs.mkdirSync(NEIGHBORHOODS_DIR, { recursive: true });
  }
  const neighborhoods = JSON.parse(fs.readFileSync(NEIGHBORHOOD_DATA_FILE, 'utf-8'));
  const neighborhoodTemplate = fs.readFileSync(NEIGHBORHOOD_TEMPLATE_FILE, 'utf-8');

  neighborhoods.forEach(n => {
    const nearbyLinks = (n.nearby_neighborhoods || [])
      .map(slug => {
        const nb = neighborhoods.find(x => x.slug === slug);
        if (!nb) return '';
        return `<a href="/neighborhoods/${nb.slug}.html" class="city-link">${nb.name} <span class="city-link__arrow">&#8594;</span></a>`;
      })
      .filter(Boolean)
      .join('\n        ');

    let html = neighborhoodTemplate
      .replace(/\{\{NEIGHBORHOOD_NAME\}\}/g, n.name)
      .replace(/\{\{SLUG\}\}/g, n.slug)
      .replace(/\{\{CITY\}\}/g, n.city)
      .replace(/\{\{COUNTY\}\}/g, n.county)
      .replace(/\{\{ZIP\}\}/g, n.zip || '')
      .replace(/\{\{MEDIAN_HOME_PRICE\}\}/g, n.median_home_price || 'varies')
      .replace(/\{\{DESC\}\}/g, n.desc || '')
      .replace(/\{\{NEARBY_LINKS\}\}/g, nearbyLinks);

    fs.writeFileSync(path.join(NEIGHBORHOODS_DIR, `${n.slug}.html`), html, 'utf-8');
    neighborhoodGenerated++;
  });

  // Neighborhood index
  const nIndexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sell Property by Neighborhood - Hyper-Local Cash Offers | FloridaHomeOffer</title>
  <meta name="description" content="Get a cash offer for your property by neighborhood. We serve every neighborhood across Florida's major metros.">
  <link rel="canonical" href="${SITE_URL}/neighborhoods/">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body data-page="neighborhoods" data-schema-type="home">
  <div id="site-header"></div>
  <section class="hero hero--compact glow-top">
    <div class="hero__content">
      <p class="subtitle">Hyper-Local Coverage</p>
      <h1>Sell Property in <span class="gold">Any Florida Neighborhood</span></h1>
      <p class="hero__sub">We know every neighborhood. Find yours below for a localized cash offer.</p>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="city-grid">
        ${neighborhoods.map(n => `<a href="/neighborhoods/${n.slug}.html" class="city-link">${n.name}, ${n.city} <span class="city-link__arrow">&#8594;</span></a>`).join('\n        ')}
      </div>
    </div>
  </section>
  <section class="section section--dark">
    <div class="container" style="max-width:700px"><div id="nb-lead-form"></div></div>
  </section>
  <div id="site-footer"></div>
  <script src="/assets/js/main.js"></script>
  <script src="/assets/js/lead-form.js"></script>
  <script src="/assets/js/schema.js"></script>
  <script>document.addEventListener('DOMContentLoaded', function() { injectLeadForm('nb-lead-form', { heading: 'Get Your Neighborhood Cash Offer', subtext: 'Tell us your neighborhood and get a personalized offer.' }); });</script>
</body>
</html>`;
  fs.writeFileSync(path.join(NEIGHBORHOODS_DIR, 'index.html'), nIndexHTML, 'utf-8');
  console.log(`Built ${neighborhoodGenerated} neighborhood pages + 1 index page`);
} else {
  console.log('Neighborhood data or template not found, skipping');
}

// --- STATE PAGE GENERATION ---
const STATES_DIR = path.join(ROOT, 'states');
const STATE_DATA_FILE = path.join(ROOT, 'data', 'us-states.json');
const STATE_TEMPLATE_FILE = path.join(ROOT, 'state-template.html');

let stateGenerated = 0;
if (fs.existsSync(STATE_DATA_FILE) && fs.existsSync(STATE_TEMPLATE_FILE)) {
  if (!fs.existsSync(STATES_DIR)) {
    fs.mkdirSync(STATES_DIR, { recursive: true });
  }
  const states = JSON.parse(fs.readFileSync(STATE_DATA_FILE, 'utf-8'));
  const stateTemplate = fs.readFileSync(STATE_TEMPLATE_FILE, 'utf-8');

  states.forEach(state => {
    const citiesLinks = (state.major_cities || [])
      .map(city => `<li>${city}</li>`)
      .join('');

    let html = stateTemplate
      .replace(/\{\{STATE_NAME\}\}/g, state.name)
      .replace(/\{\{SLUG\}\}/g, state.slug)
      .replace(/\{\{ABBREVIATION\}\}/g, state.abbreviation || '')
      .replace(/\{\{CAPITAL\}\}/g, state.capital || '')
      .replace(/\{\{POPULATION\}\}/g, parseInt(state.population || '0').toLocaleString())
      .replace(/\{\{MEDIAN_HOME_PRICE\}\}/g, state.median_home_price || 'varies')
      .replace(/\{\{AVG_DAYS\}\}/g, state.avg_days || '45')
      .replace(/\{\{DESC\}\}/g, state.desc || '')
      .replace(/\{\{CHALLENGES\}\}/g, state.challenges || '')
      .replace(/\{\{LAWS\}\}/g, state.laws || '')
      .replace(/\{\{MAJOR_CITIES_LINKS\}\}/g, citiesLinks);

    fs.writeFileSync(path.join(STATES_DIR, `sell-property-${state.slug}.html`), html, 'utf-8');
    stateGenerated++;
  });

  // State index
  const stateIndexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sell Property in Any US State - Nationwide Cash Offers | FloridaHomeOffer</title>
  <meta name="description" content="We buy properties for cash in all 50 US states. Find your state for local market info and a free cash offer in 24 hours.">
  <link rel="canonical" href="${SITE_URL}/states/">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body data-page="states" data-schema-type="home">
  <div id="site-header"></div>
  <section class="hero hero--compact glow-top">
    <div class="hero__content">
      <p class="subtitle">Nationwide Coverage</p>
      <h1>Sell Your Property in <span class="gold">Any US State</span></h1>
      <p class="hero__sub">We buy properties for cash across all 50 states. Select your state for local market information and a free cash offer.</p>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="city-grid">
        ${states.map(s => `<a href="/states/sell-property-${s.slug}.html" class="city-link">${s.name} <span class="city-link__arrow">&#8594;</span></a>`).join('\n        ')}
      </div>
    </div>
  </section>
  <section class="section section--dark">
    <div class="container" style="max-width:700px"><div id="states-lead-form"></div></div>
  </section>
  <div id="site-footer"></div>
  <script src="/assets/js/main.js"></script>
  <script src="/assets/js/lead-form.js"></script>
  <script src="/assets/js/schema.js"></script>
  <script>document.addEventListener('DOMContentLoaded', function() { injectLeadForm('states-lead-form', { heading: 'Get Your Cash Offer', subtext: 'Select your state or submit details for a personalized offer.' }); });</script>
</body>
</html>`;
  fs.writeFileSync(path.join(STATES_DIR, 'index.html'), stateIndexHTML, 'utf-8');
  console.log(`Built ${stateGenerated} state pages + 1 index page`);
} else {
  console.log('State data or template not found, skipping');
}

// --- SITEMAP GENERATION (all pages) ---
const today = new Date().toISOString().split('T')[0];

const corePages = [
  { url: '/', priority: '1.0', freq: 'weekly' },
  { url: '/how-it-works.html', priority: '0.8', freq: 'monthly' },
  { url: '/cash-offer.html', priority: '0.9', freq: 'monthly' },
  { url: '/compare-options.html', priority: '0.8', freq: 'monthly' },
  { url: '/categories.html', priority: '0.8', freq: 'monthly' },
  { url: '/faq.html', priority: '0.9', freq: 'weekly' },
  { url: '/about.html', priority: '0.7', freq: 'monthly' },
  { url: '/contact.html', priority: '0.7', freq: 'monthly' },
  { url: '/how-we-price.html', priority: '0.8', freq: 'monthly' },
  { url: '/cash-buyers-comparison.html', priority: '0.8', freq: 'monthly' },
  { url: '/cities/', priority: '0.8', freq: 'weekly' },
  { url: '/counties/', priority: '0.8', freq: 'weekly' },
  { url: '/guides/', priority: '0.8', freq: 'weekly' },
  { url: '/blog/', priority: '0.8', freq: 'weekly' },
  { url: '/situations/', priority: '0.7', freq: 'monthly' },
  { url: '/states/', priority: '0.8', freq: 'monthly' },
  { url: '/case-studies/', priority: '0.7', freq: 'monthly' },
  { url: '/closing-cost-calculator.html', priority: '0.8', freq: 'monthly' },
  { url: '/home-value-estimator.html', priority: '0.8', freq: 'monthly' },
  { url: '/florida-market-report.html', priority: '0.9', freq: 'quarterly' },
];

const guidePages = [
  'sell-house-without-realtor', 'sell-house-as-is-florida', 'how-to-sell-house-fast',
  'fsbo-vs-cash-buyer', 'what-is-a-cash-offer', 'closing-costs-florida',
  'how-long-to-sell-house-florida', 'sell-house-during-divorce', 'sell-inherited-house-florida',
  'sell-house-avoid-foreclosure', 'sell-house-probate-florida', 'sell-rental-property-florida',
].map(slug => ({ url: `/guides/${slug}.html`, priority: '0.8', freq: 'monthly' }));

const cityPages = cities.map(c => ({
  url: `/cities/sell-house-fast-${c.slug}.html`, priority: '0.7', freq: 'monthly'
}));

// County pages (scan directory)
let countyPages = [];
if (fs.existsSync(COUNTIES_DIR)) {
  countyPages = fs.readdirSync(COUNTIES_DIR)
    .filter(f => f.endsWith('.html') && f !== 'index.html')
    .map(f => ({ url: `/counties/${f}`, priority: '0.7', freq: 'monthly' }));
}

// Situation pages (scan directory)
const SITUATIONS_DIR = path.join(ROOT, 'situations');
let situationPages = [];
if (fs.existsSync(SITUATIONS_DIR)) {
  situationPages = fs.readdirSync(SITUATIONS_DIR)
    .filter(f => f.endsWith('.html'))
    .map(f => ({ url: `/situations/${f}`, priority: '0.7', freq: 'monthly' }));
}

// Blog pages (scan directory)
const BLOG_DIR = path.join(ROOT, 'blog');
let blogPages = [];
if (fs.existsSync(BLOG_DIR)) {
  blogPages = fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.html') && f !== 'index.html')
    .map(f => ({ url: `/blog/${f}`, priority: '0.6', freq: 'weekly' }));
}

// Neighborhood pages (scan directory)
const NEIGHBORHOODS_SCAN_DIR = path.join(ROOT, 'neighborhoods');
let neighborhoodPages = [];
if (fs.existsSync(NEIGHBORHOODS_SCAN_DIR)) {
  neighborhoodPages = fs.readdirSync(NEIGHBORHOODS_SCAN_DIR)
    .filter(f => f.endsWith('.html') && f !== 'index.html')
    .map(f => ({ url: `/neighborhoods/${f}`, priority: '0.6', freq: 'monthly' }));
  if (neighborhoodPages.length) {
    corePages.push({ url: '/neighborhoods/', priority: '0.7', freq: 'weekly' });
  }
}

// State pages (scan directory)
const STATES_SCAN_DIR = path.join(ROOT, 'states');
let statePages = [];
if (fs.existsSync(STATES_SCAN_DIR)) {
  statePages = fs.readdirSync(STATES_SCAN_DIR)
    .filter(f => f.endsWith('.html') && f !== 'index.html')
    .map(f => ({ url: `/states/${f}`, priority: '0.7', freq: 'monthly' }));
}

// Case study pages (scan directory)
const CASES_DIR = path.join(ROOT, 'case-studies');
let casePages = [];
if (fs.existsSync(CASES_DIR)) {
  casePages = fs.readdirSync(CASES_DIR)
    .filter(f => f.endsWith('.html') && f !== 'index.html')
    .map(f => ({ url: `/case-studies/${f}`, priority: '0.6', freq: 'monthly' }));
}

const allPages = [...corePages, ...guidePages, ...cityPages, ...countyPages, ...situationPages, ...blogPages, ...neighborhoodPages, ...statePages, ...casePages];

const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${SITE_URL}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(SITEMAP_FILE, sitemapXML, 'utf-8');

console.log(`Built ${generated} city pages + 1 index page`);
console.log(`Generated sitemap.xml with ${allPages.length} URLs`);
console.log('Done!');
