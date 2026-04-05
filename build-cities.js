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
const SITE_URL = 'https://floridahomeoffer.com';

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

const allPages = [...corePages, ...guidePages, ...cityPages, ...countyPages, ...situationPages, ...blogPages];

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
