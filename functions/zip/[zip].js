// Cloudflare Pages Function: /zip/{zip}
// Renders a hyper-local cash-offer landing page for any US ZIP code.
import { ZIPS } from '../_lib/zips-data.js';
import { STATES } from '../_lib/states-data.js';
import { renderPage, htmlResponse, notFoundResponse, titleCase } from '../_lib/template.js';
import { pickDeepContent } from '../_lib/deep-content.js';

const STATE_NAMES = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',
  FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',
  LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',
  MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',
  ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',
  SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',
  WI:'Wisconsin',WY:'Wyoming',DC:'District of Columbia',PR:'Puerto Rico',VI:'U.S. Virgin Islands'
};

export async function onRequest(context) {
  const { params } = context;
  const zip = String(params.zip || '').replace(/[^0-9]/g, '').padStart(5, '0');
  if (zip.length !== 5) return notFoundResponse();

  const rec = ZIPS[zip];
  if (!rec) return notFoundResponse();

  const [rawCity, state, rawCounty, lat, lng] = rec;
  const city = titleCase(rawCity);
  const county = titleCase(rawCounty);
  const stateName = STATE_NAMES[state] || state;
  const stateInfo = STATES[state] || null;
  const path = '/zip/' + zip;
  const title = `Sell Your House Fast in ${zip} - Cash Offer in 24 Hours | OneCashOffer`;
  const description = `We buy houses in ${city}, ${state} (ZIP ${zip}) for cash. Any condition, any situation. Free 24-hour offer. Close in 7 days. ${county} County.`;

  const intro = `
    <p>If you own property in <strong>ZIP code ${zip}</strong> (${city}, ${state}) and want to sell fast for cash, OneCashOffer makes a free, no-obligation written offer within 24 hours. We buy in any condition - move-in ready, distressed, fire-damaged, mold, foundation issues, hurricane damage, hoarder houses, code violations - anywhere in ${county} County, ${stateName}.</p>
    <p>The traditional listing process in ZIP ${zip} takes 60-90 days and costs 8-10% in agent commissions and closing fees. A cash sale closes in 7-14 days with zero fees and zero repairs.</p>
  `;

  const sections = [
    {
      h2: `What Properties Do You Buy in ZIP ${zip}?`,
      html: `<p>We purchase every property type in the ${zip} area:</p>
        <ul style="list-style:disc;padding-left:20px;color:var(--text-muted);margin:16px 0;">
          <li>Single-family homes in any condition</li>
          <li>Condominiums and townhouses</li>
          <li>Multi-family properties (duplex, triplex, quadplex, apartment buildings)</li>
          <li>Vacant land and building lots</li>
          <li>Commercial property (office, retail, mixed-use)</li>
          <li>Mobile and manufactured homes</li>
          <li>Inherited properties, probate properties, fire-damaged, distressed</li>
        </ul>`
    },
    {
      h2: `How Fast Can You Close on a ${zip} Property?`,
      html: `<p>Standard closing for a clean-title ${city} property in ZIP ${zip} is <strong>7 to 14 business days</strong> from offer acceptance. If your property has complications (liens, probate, multiple owners, title defects), expect 3 to 6 weeks. We work with licensed title companies in ${stateName} that handle every closing.</p>
        <p>You choose the closing date. We can also accommodate rent-back if you need extra time to move.</p>`
    },
    {
      h2: `What Does Selling for Cash Cost a ${city} Homeowner?`,
      html: `<p>Zero out-of-pocket cost. OneCashOffer pays all closing costs in ${stateName} (documentary stamps, title insurance, recording fees, transfer taxes). The cash offer amount is your net proceeds, minus any existing mortgage or liens that get paid off through the title company at closing.</p>
        <p>Traditional ${city} sellers typically pay 5-6% in agent commissions plus 1-3% in closing costs - 8-10% of sale price. On a $${(Math.round((((zip.charCodeAt(0)+zip.charCodeAt(1)+zip.charCodeAt(2))*1500))/1000)*1000).toLocaleString()} home that is $${Math.round((((zip.charCodeAt(0)+zip.charCodeAt(1)+zip.charCodeAt(2))*1500)*0.085)).toLocaleString()} in fees you avoid.</p>`
    },
    {
      h2: `Why Sell to a Cash Buyer Instead of Listing in ${city}?`,
      html: `<p>Five reasons ${city} homeowners in ZIP ${zip} choose cash:</p>
        <ol style="list-style:decimal;padding-left:20px;color:var(--text-muted);margin:16px 0;">
          <li><strong>Speed:</strong> Close in 7-14 days vs 60-90 days on the MLS.</li>
          <li><strong>Certainty:</strong> Cash deals close 97% of the time. Financed deals fail 15% of the time when buyer financing falls through.</li>
          <li><strong>No repairs:</strong> We buy as-is. No inspection negotiations, no repair credits.</li>
          <li><strong>No showings:</strong> No open houses, no strangers walking through your home.</li>
          <li><strong>Zero fees:</strong> Agent commissions, closing costs, title fees - we cover them all.</li>
        </ol>`
    }
  ];

  // === STATE-SPECIFIC AUTHORITY SECTIONS ===
  if (stateInfo) {
    sections.push({
      h2: `${stateName} Real Estate Laws & Closing Process for ZIP ${zip}`,
      html: `<p>${stateInfo.laws}</p>
        <p>OneCashOffer handles every ZIP ${zip} closing through a licensed ${stateName} title company or attorney (depending on the state's requirement), so you stay compliant with all local statutes. We absorb every cost the seller would normally pay - documentary stamps, recording fees, title insurance, transfer taxes.</p>`
    });
    sections.push({
      h2: `Selling Challenges Specific to ${stateName} Property Owners`,
      html: `<p>${stateInfo.challenges}</p>
        <p>For ${city}, ${state} sellers facing any of these challenges, a cash sale through OneCashOffer eliminates the friction. We have purchased property across every county in ${stateName} and built our offer model to factor local-market realities into pricing - not just national averages.</p>`
    });
    sections.push({
      h2: `${stateName} Housing Market Snapshot Around ZIP ${zip}`,
      html: `<p>${stateInfo.desc}</p>
        <p>Statewide median home price: <strong>${stateInfo.medianHomePrice}</strong>. Statewide average days on market for traditional listings: <strong>${stateInfo.avgDays} days</strong>. Your ZIP ${zip} (${city}, ${county} County) micro-market may differ - we pull comparable sales from the immediate area when preparing your offer.</p>`
    });
  }

  // === DEEP-CONTENT BLOCKS (push every page past 2,500 words) ===
  const locInfo = { label: `${zip} (${city})`, city, stateName, state, county, zip };
  const deepBlocks = pickDeepContent(locInfo, 'zip', 9);
  for (const b of deepBlocks) sections.push(b);

  // Authoritative sources for E-E-A-T
  sections.push({
    h2: `Authoritative Resources for ${stateName} Home Sellers`,
    html: `<ul style="list-style:disc;padding-left:20px;color:var(--text-muted);margin:16px 0;">
      <li><a href="https://www.consumer.ftc.gov/topics/buying-renting-or-selling-real-estate" rel="nofollow noopener" target="_blank">Federal Trade Commission - Selling Real Estate</a></li>
      <li><a href="https://www.hud.gov/" rel="nofollow noopener" target="_blank">U.S. Department of Housing and Urban Development</a></li>
      <li><a href="https://www.nar.realtor/" rel="nofollow noopener" target="_blank">National Association of REALTORS&reg;</a></li>
      <li><a href="https://www.consumerfinance.gov/owning-a-home/" rel="nofollow noopener" target="_blank">CFPB - Owning a Home</a></li>
      <li><a href="https://www.irs.gov/taxtopics/tc701" rel="nofollow noopener" target="_blank">IRS Topic 701 - Sale of Your Home</a></li>
    </ul>
    <p style="font-size:0.9rem;color:var(--text-muted);">For ${stateName}-specific legal questions about your ZIP ${zip} property sale, consult a licensed ${stateName} real estate attorney or your state's real estate commission. OneCashOffer makes principal cash purchases - we are not your real estate broker.</p>`
  });

  const faq = [
    { q: `Do you buy houses in ZIP code ${zip}?`, a: `Yes. OneCashOffer buys properties in ${zip} (${city}, ${state}) and all surrounding ${county} County areas. Submit your address for a free written cash offer in 24 hours.` },
    { q: `Will you buy a distressed property in ${city}?`, a: `Yes. We specialize in distressed, run-down, and damaged properties. Fire, water, mold, hoarder conditions, foundation issues, code violations - we buy them as-is. No repairs needed.` },
    { q: `How much will you pay for my ${zip} property?`, a: `Offers are based on comparable sales in ${zip}, current market conditions in ${county} County, property condition, and property type. We provide a transparent breakdown with every offer. Submit your details for a personalized cash number.` },
    { q: `Are there any fees to use OneCashOffer?`, a: `No. Zero fees. Free written offer in 24 hours, no obligation. We pay all closing costs in ${stateName}. The offer amount is your net proceeds.` },
    { q: `Do I need to clean or repair my ${city} house before closing?`, a: `No. Leave it exactly as it is. We handle all cleanup, repairs, and renovation after closing. Many sellers leave furniture, appliances, and personal items behind - we deal with everything.` }
  ];

  const stateSlug = (STATE_NAMES[state] || state).toLowerCase().replace(/\s+/g, '-');
  const citySlug = city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const relatedLinks = [
    { href: `/sell/${state.toLowerCase()}/${citySlug}`, label: `Sell House in ${city}, ${state}` },
    { href: `/distressed/${state.toLowerCase()}/${citySlug}`, label: `Distressed ${city} Property?` },
    { href: `/premium/${state.toLowerCase()}/${citySlug}`, label: `Premium ${city} Property?` },
    { href: `/states/sell-property-${stateSlug}`, label: `Sell in ${stateName}` },
    { href: '/cash-offer', label: 'Get Your Cash Offer Now' }
  ];

  const html = renderPage({
    page: 'zip',
    slug: zip,
    path,
    title,
    description,
    h1Lead: 'Sell Your Property Fast in',
    h1Gold: `${zip} (${city}, ${state})`,
    subtitle: `${county} County, ${stateName}`,
    heroSub: `Get a free cash offer for your ${city} property in 24 hours. We buy any property type, any condition, anywhere in ZIP ${zip}.`,
    crumbs: [
      { name: 'ZIP Codes', path: '/zip/' },
      { name: zip, path }
    ],
    intro,
    sections,
    marketSnapshot: [
      ['ZIP Code', zip],
      ['City', city],
      ['County', county + ' County'],
      ['State', stateName],
      ['Cash Sale Close Time', '7-14 days'],
      ['Average Offer Response', '24 hours']
    ],
    faq,
    relatedLinks,
    schemaCity: city,
    schemaCounty: county,
    schemaState: state,
    schemaZip: zip,
    schemaLat: lat,
    schemaLng: lng
  });

  return htmlResponse(html);
}
