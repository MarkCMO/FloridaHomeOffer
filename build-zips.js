#!/usr/bin/env node
// Build the US ZIP master dataset from raw CSVs.
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

const zipsACsv = fs.readFileSync(path.join(ROOT, 'data', '_zips_a.csv'), 'utf-8');
const zipsBCsv = fs.readFileSync(path.join(ROOT, 'data', '_zips_b.csv'), 'utf-8');

// Build lat/lng lookup from B
const latLng = {};
zipsBCsv.split(/\r?\n/).slice(1).forEach(line => {
  const parts = line.split(',');
  if (parts.length !== 3) return;
  const zip = parts[0].trim();
  const lat = parseFloat(parts[1]);
  const lng = parseFloat(parts[2]);
  if (zip && !isNaN(lat) && !isNaN(lng)) latLng[zip] = [lat, lng];
});

// Parse + enrich main dataset
const zips = [];
zipsACsv.split(/\r?\n/).slice(1).forEach(line => {
  const m = line.match(/^([^,]+),([^,]+),([^,]+),([^,]+),([^,]+),(.+)$/);
  if (!m) return;
  const [, state_fips, state, state_abbr, zipcode, county, city] = m;
  const ll = latLng[zipcode.trim()] || [null, null];
  zips.push({
    zip: zipcode.trim(),
    city: city.trim(),
    state: state_abbr.trim(),
    state_name: state.trim(),
    county: county.trim(),
    lat: ll[0],
    lng: ll[1]
  });
});

// Write canonical JSON dataset
fs.writeFileSync(path.join(ROOT, 'data', 'us-zips-all.json'), JSON.stringify(zips), 'utf-8');

// Stats
const byState = {};
zips.forEach(z => { byState[z.state] = (byState[z.state] || 0) + 1; });
const sortedStates = Object.entries(byState).sort((a, b) => b[1] - a[1]);

console.log('Total ZIP records:', zips.length);
console.log('Total unique states/territories:', Object.keys(byState).length);
console.log('File size:', Math.round(fs.statSync(path.join(ROOT, 'data', 'us-zips-all.json')).size / 1024), 'KB');
console.log('Top 5 states:', sortedStates.slice(0, 5));
console.log('Sample:', JSON.stringify(zips[0]));
console.log('FL sample:', JSON.stringify(zips.find(z => z.state === 'FL')));
console.log('CA sample:', JSON.stringify(zips.find(z => z.state === 'CA')));

// Build derived index: ZIP -> {city, state, county} for the dynamic function
// (smaller, faster lookup)
const idx = {};
zips.forEach(z => {
  idx[z.zip] = [z.city, z.state, z.county, z.lat, z.lng];
});
fs.writeFileSync(path.join(ROOT, 'data', 'us-zips-index.json'), JSON.stringify(idx), 'utf-8');
console.log('Index size:', Math.round(fs.statSync(path.join(ROOT, 'data', 'us-zips-index.json')).size / 1024), 'KB');

// Build US cities index (deduplicated by state + city)
const cityMap = {};
zips.forEach(z => {
  const key = (z.state + ':' + z.city.toLowerCase().replace(/[^a-z0-9]+/g, '-')).trim();
  if (!cityMap[key]) {
    cityMap[key] = {
      slug: z.city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      city: z.city,
      state: z.state,
      state_name: z.state_name,
      county: z.county,
      zips: []
    };
  }
  cityMap[key].zips.push(z.zip);
});
const cities = Object.values(cityMap);
fs.writeFileSync(path.join(ROOT, 'data', 'us-cities-all.json'), JSON.stringify(cities), 'utf-8');
console.log('Total US city entries (state:city unique):', cities.length);
console.log('Cities file size:', Math.round(fs.statSync(path.join(ROOT, 'data', 'us-cities-all.json')).size / 1024), 'KB');

// Cleanup raw CSVs (if they still exist)
try { fs.unlinkSync(path.join(ROOT, 'data', '_zips_a.csv')); } catch {}
try { fs.unlinkSync(path.join(ROOT, 'data', '_zips_b.csv')); } catch {}

// Emit JS modules for Cloudflare Pages Functions to import directly
const libDir = path.join(ROOT, 'functions', '_lib');
fs.mkdirSync(libDir, { recursive: true });

fs.writeFileSync(
  path.join(libDir, 'zips-data.js'),
  'export const ZIPS = ' + JSON.stringify(idx) + ';\n',
  'utf-8'
);
fs.writeFileSync(
  path.join(libDir, 'cities-data.js'),
  // Slim per-city object for function bundle - we only need slug, city, state, county, top zips
  'export const CITIES = ' + JSON.stringify(
    cities.map(c => ({ s: c.slug, c: c.city, st: c.state, n: c.state_name, co: c.county, z: c.zips.slice(0, 5) }))
  ) + ';\n' +
  // Also export lookup index by state:slug
  'export const CITY_INDEX = (function() { const idx = {}; for (const c of CITIES) { idx[c.st + ":" + c.s] = c; } return idx; })();\n',
  'utf-8'
);

console.log('Wrote functions/_lib/zips-data.js (' + Math.round(fs.statSync(path.join(libDir, 'zips-data.js')).size / 1024) + ' KB)');
console.log('Wrote functions/_lib/cities-data.js (' + Math.round(fs.statSync(path.join(libDir, 'cities-data.js')).size / 1024) + ' KB)');
console.log('Done.');
