#!/usr/bin/env node
// Build a giant sitemap index + sub-sitemaps covering:
//   - all existing static pages (cities/, counties/, states/, neighborhoods/, guides/, blog/, etc.)
//   - all 33,103 US ZIPs (via /zip/{zip} dynamic pages)
//   - all 29,189 US cities, x3 variants (sell, distressed, premium)
// Total URLs generated: ~33,103 + (29,189 × 3) + ~390 static = ~120,756 URLs
// Sitemap spec limit: 50,000 URLs per sitemap; we split into chunks.

const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const SITE = 'https://onecashoffer.com';
const today = new Date().toISOString().split('T')[0];

// --- Load data ---
const zips = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'us-zips-all.json'), 'utf-8'));
const cities = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'us-cities-all.json'), 'utf-8'));

// --- Helper: write a sub-sitemap from an array of URL entries ---
function writeSitemap(filename, entries) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(e => `  <url><loc>${e.loc}</loc><lastmod>${e.lastmod || today}</lastmod><changefreq>${e.changefreq || 'monthly'}</changefreq><priority>${e.priority || '0.5'}</priority></url>`).join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(ROOT, filename), xml, 'utf-8');
}

// --- Chunked sitemap writer ---
function writeChunked(prefix, entries, chunkSize = 45000) {
  const files = [];
  for (let i = 0; i < entries.length; i += chunkSize) {
    const chunk = entries.slice(i, i + chunkSize);
    const filename = `${prefix}-${Math.floor(i / chunkSize) + 1}.xml`;
    writeSitemap(filename, chunk);
    files.push(filename);
  }
  return files;
}

// === CORE PAGES ===
const corePages = [
  '/', '/cash-offer', '/how-it-works', '/compare-options', '/categories', '/faq',
  '/about', '/contact', '/how-we-price', '/cash-buyers-comparison', '/privacy', '/terms',
  '/closing-cost-calculator', '/home-value-estimator', '/florida-market-report',
  '/cities/', '/counties/', '/guides/', '/blog/', '/situations/',
  '/states/', '/case-studies/', '/neighborhoods/', '/zip/', '/commercial'
].map(url => ({ loc: SITE + url, priority: url === '/' ? '1.0' : '0.8', changefreq: 'weekly' }));

// === GUIDE / SITUATION / BLOG / CASE STUDY existing static pages (scan filesystem) ===
function scanDir(dir, prefix, priority = '0.7') {
  if (!fs.existsSync(path.join(ROOT, dir))) return [];
  return fs.readdirSync(path.join(ROOT, dir))
    .filter(f => f.endsWith('.html') && f !== 'index.html')
    .map(f => ({
      loc: SITE + prefix + f.replace(/\.html$/, ''),
      priority,
      changefreq: 'monthly'
    }));
}
const guidePages = scanDir('guides', '/guides/', '0.8');
const situationPages = scanDir('situations', '/situations/', '0.7');
const blogPages = scanDir('blog', '/blog/', '0.6');
const casePages = scanDir('case-studies', '/case-studies/', '0.6');
const cityStaticPages = scanDir('cities', '/cities/', '0.7');
const countyStaticPages = scanDir('counties', '/counties/', '0.7');
const stateStaticPages = scanDir('states', '/states/', '0.7');
const neighborhoodStaticPages = scanDir('neighborhoods', '/neighborhoods/', '0.6');

const allStatic = [
  ...corePages,
  ...guidePages, ...situationPages, ...blogPages, ...casePages,
  ...cityStaticPages, ...countyStaticPages, ...stateStaticPages, ...neighborhoodStaticPages
];

// === DYNAMIC ZIP PAGES (33,103 URLs) ===
const zipUrls = zips.map(z => ({
  loc: SITE + '/zip/' + z.zip,
  priority: '0.5',
  changefreq: 'monthly'
}));

// === DYNAMIC CITY PAGES (3 variants × 29,189 = 87,567 URLs) ===
// Skip duplicates with existing FL city static pages
const flCityStaticSlugs = new Set(cityStaticPages.map(c => c.loc.replace(SITE + '/cities/', '').replace('sell-house-fast-', '')));

const sellUrls = cities.map(c => ({
  loc: `${SITE}/sell/${c.state.toLowerCase()}/${c.slug}`,
  priority: '0.6',
  changefreq: 'monthly'
}));
const distressedUrls = cities.map(c => ({
  loc: `${SITE}/distressed/${c.state.toLowerCase()}/${c.slug}`,
  priority: '0.5',
  changefreq: 'monthly'
}));
const premiumUrls = cities.map(c => ({
  loc: `${SITE}/premium/${c.state.toLowerCase()}/${c.slug}`,
  priority: '0.5',
  changefreq: 'monthly'
}));

// === PROPERTY-TYPE COMBINATIONS (29,189 cities × 8 types = 233,512 URLs) ===
const PROPERTY_TYPE_SLUGS = ['single-family','condo','multi-family','vacant-land','commercial','mobile-home','industrial','farm-ranch'];
const typeUrls = [];
for (const c of cities) {
  for (const t of PROPERTY_TYPE_SLUGS) {
    typeUrls.push({
      loc: `${SITE}/sell/${c.state.toLowerCase()}/${c.slug}/${t}`,
      priority: '0.4',
      changefreq: 'monthly'
    });
  }
}

// === COMMERCIAL CITY PAGES (29,189 URLs) ===
const commercialCityUrls = cities.map(c => ({
  loc: `${SITE}/commercial/${c.state.toLowerCase()}/${c.slug}`,
  priority: '0.6',
  changefreq: 'monthly'
}));

// === COMMERCIAL ASSET-CLASS COMBINATIONS (29,189 cities × 12 asset classes = 350,268 URLs) ===
const ASSET_CLASS_SLUGS = [
  'multifamily','office','retail','industrial','hospitality','self-storage',
  'healthcare','mixed-use','senior-living','student-housing','data-center','land-development'
];
const commercialAssetUrls = [];
for (const c of cities) {
  for (const a of ASSET_CLASS_SLUGS) {
    commercialAssetUrls.push({
      loc: `${SITE}/commercial/${c.state.toLowerCase()}/${c.slug}/${a}`,
      priority: '0.5',
      changefreq: 'monthly'
    });
  }
}

// === WRITE SUB-SITEMAPS ===
console.log('Writing sub-sitemaps...');
const staticFiles = writeChunked('sitemap-static', allStatic);
console.log(`  static: ${allStatic.length} URLs in ${staticFiles.length} file(s)`);

const zipFiles = writeChunked('sitemap-zip', zipUrls);
console.log(`  zip: ${zipUrls.length} URLs in ${zipFiles.length} file(s)`);

const sellFiles = writeChunked('sitemap-sell', sellUrls);
console.log(`  sell: ${sellUrls.length} URLs in ${sellFiles.length} file(s)`);

const distressedFiles = writeChunked('sitemap-distressed', distressedUrls);
console.log(`  distressed: ${distressedUrls.length} URLs in ${distressedFiles.length} file(s)`);

const premiumFiles = writeChunked('sitemap-premium', premiumUrls);
console.log(`  premium: ${premiumUrls.length} URLs in ${premiumFiles.length} file(s)`);

const typeFiles = writeChunked('sitemap-type', typeUrls);
console.log(`  property-types: ${typeUrls.length} URLs in ${typeFiles.length} file(s)`);

const commercialCityFiles = writeChunked('sitemap-commercial-city', commercialCityUrls);
console.log(`  commercial-city: ${commercialCityUrls.length} URLs in ${commercialCityFiles.length} file(s)`);

const commercialAssetFiles = writeChunked('sitemap-commercial-asset', commercialAssetUrls);
console.log(`  commercial-asset: ${commercialAssetUrls.length} URLs in ${commercialAssetFiles.length} file(s)`);

// === WRITE SITEMAP INDEX ===
const allFiles = [...staticFiles, ...zipFiles, ...sellFiles, ...distressedFiles, ...premiumFiles, ...typeFiles, ...commercialCityFiles, ...commercialAssetFiles];
const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allFiles.map(f => `  <sitemap><loc>${SITE}/${f}</loc><lastmod>${today}</lastmod></sitemap>`).join('\n')}
</sitemapindex>`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), indexXml, 'utf-8');
console.log(`\nWrote sitemap.xml (index) -> ${allFiles.length} sub-sitemaps`);
const total = allStatic.length + zipUrls.length + sellUrls.length + distressedUrls.length + premiumUrls.length + typeUrls.length + commercialCityUrls.length + commercialAssetUrls.length;
console.log(`TOTAL URLs across all sitemaps: ${total.toLocaleString()}`);
console.log('Done.');
