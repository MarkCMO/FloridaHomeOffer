// Shared renderer for /commercial/* CRE pages.
// Branded as OneCashOffer Capital Group (sub-brand of OneCashOffer).
import { CITY_INDEX } from './cities-data.js';
import { STATES } from './states-data.js';
import { ASSET_CLASSES, pickCommercialContent } from './commercial-content.js';
import { renderPage, htmlResponse, notFoundResponse, titleCase } from './template.js';

const STATE_NAMES = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',
  FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',
  LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',
  MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',
  ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',
  SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',
  WI:'Wisconsin',WY:'Wyoming',DC:'District of Columbia',PR:'Puerto Rico',VI:'U.S. Virgin Islands'
};

export async function renderCommercialCity(context, assetClassSlug = null) {
  const { params } = context;
  const stateParam = String(params.state || '').toUpperCase().slice(0, 2);
  const citySlug = String(params.city || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
  const assetSlug = assetClassSlug || String(params.asset || '').toLowerCase();

  const rec = CITY_INDEX[stateParam + ':' + citySlug];
  if (!rec) return notFoundResponse();

  const city = titleCase(rec.c);
  const county = titleCase(rec.co);
  const stateName = STATE_NAMES[stateParam] || rec.n;
  const stateInfo = STATES[stateParam] || null;

  let assetClass = null;
  if (assetSlug) {
    assetClass = ASSET_CLASSES[assetSlug];
    if (!assetClass) return notFoundResponse();
  }

  const path = assetClass
    ? `/commercial/${stateParam.toLowerCase()}/${citySlug}/${assetSlug}`
    : `/commercial/${stateParam.toLowerCase()}/${citySlug}`;

  const titleSuffix = assetClass
    ? `${assetClass.label} Acquisition in ${city}, ${stateParam}`
    : `Commercial Real Estate Acquisition in ${city}, ${stateParam}`;
  const title = `Sell Your ${titleSuffix} for Cash | OneCashOffer Capital Group`;

  const description = assetClass
    ? `OneCashOffer Capital Group acquires ${assetClass.label.toLowerCase()} in ${city}, ${stateParam} for cash. ${assetClass.minDeal}-$100M+ deal size. 30-60 day all-cash close, no financing contingency, all closing costs absorbed.`
    : `OneCashOffer Capital Group acquires commercial real estate in ${city}, ${stateParam} - multifamily, office, retail, industrial, hospitality, and more. $5M-$100M+ deal size. 30-60 day all-cash close.`;

  const assetLabel = assetClass ? assetClass.label : 'commercial real estate';
  const assetHook = assetClass ? assetClass.hook : 'Sell your commercial property for cash. 30-60 day all-cash close.';

  // CRE-specific intro that establishes institutional positioning
  const intro = assetClass ? `
    <p>OneCashOffer Capital Group is the dedicated commercial real estate acquisitions arm of OneCashOffer, focused on direct principal acquisitions of <strong>${assetClass.label.toLowerCase()}</strong> in <strong>${city}, ${stateParam}</strong> and across the broader ${county} County and ${stateName} markets. We acquire ${assetClass.description} from sophisticated sellers - REITs, private syndicators, family offices, banks (REO desks), special servicers, and institutional principal owners.</p>
    <p>Typical deal size for our ${assetClass.label.toLowerCase()} acquisitions ranges from <strong>${assetClass.minDeal} to $100M+</strong>. We close all-cash with no financing contingency, no lender appraisal risk, no insurance disqualification, and no due diligence retrades. Our investment committee meets weekly and we can issue a written letter of intent within 48-72 hours of receiving a property package.</p>
    <p>Most institutional sellers choose OneCashOffer Capital Group for one of three reasons: <strong>certainty of close</strong> (we have a 98%+ close rate on signed PSAs), <strong>speed</strong> (30-60 day timelines versus 90-180 for financed buyers), or <strong>discretion</strong> (we acquire off-market without OM circulation, broker e-blasts, or CoStar listings). For sellers facing loan maturity walls, partnership dissolution, tax-deferred exchange deadlines, or any other time-sensitive situation, ${assetHook}</p>
  ` : `
    <p>OneCashOffer Capital Group is the dedicated commercial real estate acquisitions arm of OneCashOffer, focused on direct principal acquisitions of commercial real estate in <strong>${city}, ${stateParam}</strong> and across the broader ${county} County and ${stateName} markets. We acquire multifamily, office, retail, industrial, hospitality, self-storage, medical office, mixed-use, senior living, student housing, data center, and land assets from sophisticated sellers nationwide.</p>
    <p>Typical deal size for our acquisitions ranges from <strong>$5M to $100M+</strong>. We close all-cash with no financing contingency, no lender appraisal risk, no insurance disqualification, and no due diligence retrades. Our investment committee meets weekly and we can issue a written letter of intent within 48-72 hours of receiving a property package.</p>
    <p>Most institutional sellers choose OneCashOffer Capital Group for one of three reasons: <strong>certainty of close</strong> (we have a 98%+ close rate on signed PSAs), <strong>speed</strong> (30-60 day timelines versus 90-180 for financed buyers), or <strong>discretion</strong> (we acquire off-market without OM circulation, broker e-blasts, or CoStar listings). For sellers facing loan maturity walls, partnership dissolution, tax-deferred exchange deadlines, or any other time-sensitive CRE situation, we deliver fast certain capital.</p>
  `;

  // === DEEP CRE CONTENT BLOCKS ===
  const locInfo = {
    label: city,
    city,
    stateName,
    state: stateParam,
    county,
    assetLabel,
    typicalCap: assetClass ? assetClass.typicalCap : '5.5% - 8.0% (varies by asset class)',
    short: assetClass ? assetClass.short : 'commercial',
    assetClassShort: assetClass ? assetClass.short : 'commercial',
    assetDrivers: assetClass ? assetClass.drivers : 'asset performance, location fundamentals, and submarket dynamics',
    assetRisks: assetClass ? assetClass.risks : 'CRE market cycle, interest rate sensitivity, tenant credit, and capex needs',
    assetValueAdd: assetClass ? assetClass.valueAdd : 'lease-up, capex execution, repositioning, and operations improvement'
  };

  const sections = pickCommercialContent(locInfo, 9);

  // Add state-specific authority section to give every CRE page genuinely different content per state
  if (stateInfo) {
    sections.unshift({
      h2: `${stateName} Commercial Real Estate Legal Framework`,
      html: `<p>${stateInfo.laws}</p>
        <p>For commercial real estate transactions in ${stateName}, OneCashOffer Capital Group works with licensed ${stateName} commercial real estate counsel for every closing. We coordinate with the state's title insurance underwriters, environmental consultants, and surveying professionals to ensure full compliance with ${stateName} commercial real estate statutes, ${county} County recording requirements, and any city-specific zoning regulations.</p>`
    });
    sections.push({
      h2: `${stateName} Commercial Market Context for ${city}`,
      html: `<p>${stateInfo.desc}</p>
        <p>The ${city} ${assetClass ? assetClass.label.toLowerCase() : 'commercial real estate'} market reflects broader ${stateName} fundamentals while having its own sub-market dynamics. Statewide median residential home price is ${stateInfo.medianHomePrice}, which signals broader housing-cost trends affecting workforce and tenant demographics. Commercial cap rates and market dynamics vary substantially from the residential market.</p>`
    });
    sections.push({
      h2: `${stateName} Commercial Real Estate Challenges We Address`,
      html: `<p>${stateInfo.challenges}</p>
        <p>For ${city} commercial property owners facing any of these state-specific factors, OneCashOffer Capital Group acquires assets with full awareness of the regional risk profile. We are not a national buyer running national assumptions - we adjust our cap-rate and capex assumptions to reflect actual ${stateName} operating conditions.</p>`
    });
  }

  // Authoritative resources for CRE
  sections.push({
    h2: 'Authoritative Resources for Commercial Real Estate Sellers',
    html: `<ul style="list-style:disc;padding-left:20px;color:var(--text-muted);margin:16px 0;">
      <li><a href="https://www.irs.gov/businesses/small-businesses-self-employed/like-kind-exchanges-real-estate-tax-tips" rel="nofollow noopener" target="_blank">IRS Like-Kind Exchanges (Section 1031)</a></li>
      <li><a href="https://www.sec.gov/edgar.shtml" rel="nofollow noopener" target="_blank">SEC EDGAR - REIT and CRE Owner Filings</a></li>
      <li><a href="https://www.uli.org/" rel="nofollow noopener" target="_blank">Urban Land Institute - CRE Research and Trends</a></li>
      <li><a href="https://www.naiop.org/" rel="nofollow noopener" target="_blank">NAIOP - Commercial Real Estate Development Association</a></li>
      <li><a href="https://www.naa.org/" rel="nofollow noopener" target="_blank">National Apartment Association</a></li>
      <li><a href="https://www.icsc.com/" rel="nofollow noopener" target="_blank">ICSC - Retail Industry</a></li>
      <li><a href="https://www.boma.org/" rel="nofollow noopener" target="_blank">BOMA International - Office Building Owners and Managers</a></li>
      <li><a href="https://www.environmentlaw.com/news/" rel="nofollow noopener" target="_blank">EPA Environmental Compliance for CRE</a></li>
      <li><a href="https://www.fdic.gov/" rel="nofollow noopener" target="_blank">FDIC - Bank REO Disposition</a></li>
    </ul>
    <p style="font-size:0.9rem;color:var(--text-muted);">OneCashOffer Capital Group is a principal CRE buyer. We are not a real estate broker, fiduciary, or investment advisor. Sellers are encouraged to retain their own CRE counsel, CPA, and broker (if desired) for any transaction.</p>`
  });

  // Related links
  const otherAssets = assetClass
    ? Object.keys(ASSET_CLASSES).filter(k => k !== assetSlug).slice(0, 6)
    : Object.keys(ASSET_CLASSES).slice(0, 8);

  const relatedLinks = [
    ...otherAssets.map(k => ({
      href: `/commercial/${stateParam.toLowerCase()}/${citySlug}/${k}`,
      label: `${ASSET_CLASSES[k].label} in ${city}`
    })),
    { href: `/sell/${stateParam.toLowerCase()}/${citySlug}`, label: `Residential in ${city}` },
    { href: `/distressed/${stateParam.toLowerCase()}/${citySlug}`, label: `Distressed Property in ${city}` },
    { href: `/states/sell-property-${stateName.toLowerCase().replace(/\s+/g, '-')}`, label: `Sell in ${stateName}` },
    { href: '/commercial', label: 'CRE Acquisition Overview' },
    { href: '/cash-offer', label: 'Get Your Cash Offer' }
  ];

  // Market snapshot for CRE
  const marketSnapshot = assetClass ? [
    ['Asset Class', assetClass.label],
    ['Typical Deal Size', `${assetClass.minDeal} - $100M+`],
    ['Typical Cap Rate Range', assetClass.typicalCap],
    ['Typical Asset Scale', assetClass.units],
    ['City', city],
    ['State', stateName],
    ['County', county + ' County'],
    ['Time from LOI to Closing', '30-60 days'],
    ['Letter of Intent Response', '48-72 hours'],
    ['All-Cash, No Financing Contingency', 'Yes']
  ] : [
    ['Asset Classes', 'Multifamily, Office, Retail, Industrial, Hospitality, MOB, Self-Storage, Mixed-Use, Senior, Student, Data Center, Land'],
    ['Deal Size Range', '$5M - $100M+'],
    ['City', city],
    ['State', stateName],
    ['County', county + ' County'],
    ['Time from LOI to Closing', '30-60 days'],
    ['Letter of Intent Response', '48-72 hours'],
    ['All-Cash, No Financing Contingency', 'Yes']
  ];

  const crumbs = assetClass
    ? [
        { name: 'Commercial', path: '/commercial' },
        { name: stateName, path: '/commercial' },
        { name: city, path: `/commercial/${stateParam.toLowerCase()}/${citySlug}` },
        { name: assetClass.label, path }
      ]
    : [
        { name: 'Commercial', path: '/commercial' },
        { name: stateName, path: '/commercial' },
        { name: city, path }
      ];

  const html = renderPage({
    page: assetClass ? `commercial-${assetSlug}` : 'commercial-city',
    slug: stateParam.toLowerCase() + '-' + citySlug + (assetClass ? '-' + assetSlug : ''),
    path,
    title,
    description,
    h1Lead: assetClass ? `Sell ${assetClass.label}` : 'Sell Commercial Real Estate',
    h1Gold: `${city}, ${stateParam}`,
    subtitle: assetClass
      ? `${assetClass.minDeal} - $100M+ ${assetClass.label} Acquisitions - OneCashOffer Capital Group`
      : `$5M - $100M+ CRE Acquisitions - OneCashOffer Capital Group`,
    heroSub: assetClass
      ? `${assetHook} OneCashOffer Capital Group acquires ${assetClass.label.toLowerCase()} in ${city}, ${stateName}. 30-60 day all-cash close, no financing contingency, all closing costs absorbed by buyer.`
      : `Sell your commercial real estate in ${city}, ${stateName} for cash. Multifamily, office, retail, industrial, hospitality, and more. $5M-$100M+ deals. 30-60 day all-cash close.`,
    crumbs,
    intro,
    sections,
    marketSnapshot,
    faq: [
      { q: `What deal size does OneCashOffer Capital Group acquire in ${city}?`, a: `We acquire ${assetClass ? assetClass.label.toLowerCase() : 'commercial real estate'} in ${city} ranging from ${assetClass ? assetClass.minDeal : '$5M'} to $100M+ per asset, with portfolio acquisitions up to $250M+ in aggregate value.` },
      { q: `How fast can you close a CRE acquisition in ${city}, ${stateParam}?`, a: `We typically close in 30-60 days from signed purchase and sale agreement. We can move faster (20-30 days) for special situations like loan-maturity walls or other time-sensitive sellers, depending on title and environmental due diligence complexity.` },
      { q: `Do you have a financing contingency?`, a: `No. We close all-cash from committed equity capital. Zero financing contingency, zero appraisal contingency, zero insurance disqualification.` },
      { q: `Will you sign an NDA before reviewing a ${city} property?`, a: `Yes. We sign mutual NDAs as a matter of course. Confidentiality is built into our entire process - no public marketing, no broker e-blasts, no CoStar listings, no MLS.` },
      { q: `Do you pay broker commissions?`, a: `If a seller is represented by a broker on their side, the seller pays their broker per their listing or representation agreement. OneCashOffer Capital Group is a principal buyer with no buy-side brokerage. We are happy to work with seller's brokers.` },
      { q: `What is your typical cap rate offer for ${city} ${assetClass ? assetClass.label.toLowerCase() : 'CRE'}?`, a: `Cap rates depend on asset class, condition, lease structure, and submarket. For typical ${assetClass ? assetClass.label.toLowerCase() : 'CRE'} in ${city}, current cap rates are ${assetClass ? assetClass.typicalCap : '5.5% - 8.0%'}. Distressed or value-add assets transact at higher cap rates reflecting required work.` },
      { q: `Can you accommodate seller 1031 exchange timelines?`, a: `Yes. We routinely structure closings to accommodate seller-side 1031 exchanges, including identification window flexibility and Qualified Intermediary coordination.` }
    ],
    relatedLinks,
    schemaCity: city,
    schemaCounty: county,
    schemaState: stateParam
  });

  return htmlResponse(html);
}
