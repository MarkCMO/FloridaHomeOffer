// /zip/ index page - explains the ZIP-level search and shows top US ZIPs
import { ZIPS } from '../_lib/zips-data.js';
import { renderPage, htmlResponse, titleCase } from '../_lib/template.js';

export async function onRequest() {
  // Pick 50 well-known ZIPs across major metros for the landing page
  const featured = [
    '10001','10019','11201','11211','11215','11217','11375',  // NY
    '90001','90024','90210','90291','94102','94110','94114',  // CA
    '60601','60614','60622','60657',                          // IL
    '77001','77019','77024','77056','75201','75204','78701',  // TX
    '33101','33139','33305','32801','32789','32792','33602','33606','34102','34108','33486','33301', // FL
    '20001','20007','20009',                                  // DC
    '02108','02116','02118','02134','02135',                  // MA
    '85001','85016','85251',                                  // AZ
    '98101','98109','98112',                                  // WA
    '30301','30308','30309'                                   // GA
  ];

  const zipCards = featured.filter(z => ZIPS[z]).map(z => {
    const [rawCity, state] = ZIPS[z];
    return `<a href="/zip/${z}" class="city-link">${z} - ${titleCase(rawCity)}, ${state} <span class="city-link__arrow">&#8594;</span></a>`;
  });

  const html = renderPage({
    page: 'zip',
    slug: 'index',
    path: '/zip/',
    title: 'Sell Your Property by ZIP Code - All US ZIPs | OneCashOffer',
    description: 'Get a free cash offer for your property at any US ZIP code. We buy in all 33,000+ US ZIP codes. 24-hour written offer, 7-14 day close, any condition.',
    h1Lead: 'Sell Property by',
    h1Gold: 'US ZIP Code',
    subtitle: '33,000+ Covered ZIPs Across All 50 States',
    heroSub: 'OneCashOffer makes cash offers in every US ZIP code. Enter your ZIP below or jump to a popular one. Any condition, any situation, 7-14 day close.',
    crumbs: [{ name: 'ZIP Codes', path: '/zip/' }],
    intro: `<p>Look up your ZIP code below to see local market info and get a free cash offer for your property. All 33,103 US ZIP codes are covered. Type your ZIP into the URL bar: <code>onecashoffer.com/zip/{your-zip}</code> for instant access.</p>
      <div style="margin:24px 0;">
        <input type="text" id="zip-search" inputmode="numeric" pattern="[0-9]{5}" maxlength="5" placeholder="Enter 5-digit ZIP" style="padding:12px 16px;border:1px solid var(--gold);border-radius:6px;background:var(--bg-card);color:white;font-size:18px;width:200px;margin-right:8px;">
        <button onclick="(function(){var z=document.getElementById('zip-search').value.replace(/[^0-9]/g,'').padStart(5,'0');if(z.length===5)location.href='/zip/'+z;})()" class="btn btn--primary">Go &#8594;</button>
      </div>`,
    sections: [
      { h2: 'Popular ZIP Code Pages', html: `<div class="city-grid">${zipCards.join('')}</div>` },
      { h2: 'How Cash Offers Work by ZIP', html: `<p>Every US ZIP code has its own micro-market: median home prices, days on market, buyer demand, local regulations. OneCashOffer prices each offer based on comparable sales <strong>within your specific ZIP</strong>, not just statewide or city-wide averages. That means a more accurate offer that reflects what your property is actually worth in your block, not your metro.</p>` }
    ],
    faq: [
      { q: 'Do you really buy houses in every US ZIP code?', a: 'Yes. OneCashOffer makes cash offers in all 33,103 US ZIP codes across all 50 states plus DC and territories. We have specialized teams for Florida and rapidly expanding nationally.' },
      { q: 'How is my ZIP-specific offer calculated?', a: 'We pull comparable sales within your ZIP from the last 6 months, adjust for your property condition and unique features, and present a transparent offer with the data we used.' },
      { q: 'Can I get an offer if my ZIP has very few comparable sales?', a: 'Yes. Rural ZIPs and low-volume markets are still covered - we expand the comparable search radius and lean on county-level data when ZIP data is thin.' }
    ],
    relatedLinks: [
      { href: '/cash-offer', label: 'Get a Cash Offer Now' },
      { href: '/states/', label: 'Browse by State' },
      { href: '/cities/', label: 'Florida City Pages' },
      { href: '/distressed/fl/miami', label: 'Distressed Property Pages' },
      { href: '/premium/fl/naples', label: 'Premium Property Pages' }
    ],
    schemaCity: '',
    schemaState: ''
  });

  return htmlResponse(html);
}
