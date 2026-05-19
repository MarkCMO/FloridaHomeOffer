// /sell/{state}/{city}/{property-type} - property-type-specific city pages.
// Adds 29,189 cities × 8 property types = 233,512 hyper-targeted URLs.
import { CITY_INDEX } from '../../../_lib/cities-data.js';
import { renderPage, htmlResponse, notFoundResponse, titleCase } from '../../../_lib/template.js';

const STATE_NAMES = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',
  FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',
  LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',
  MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',
  ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',
  SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',
  WI:'Wisconsin',WY:'Wyoming',DC:'District of Columbia',PR:'Puerto Rico',VI:'U.S. Virgin Islands'
};

const PROPERTY_TYPES = {
  'single-family': {
    label: 'Single-Family Home',
    description: 'single-family residential homes including starter homes, family homes, and luxury estates',
    hook: 'Sell your single-family house fast for cash. Any condition.',
    sectionHeader: 'Why Sell Your Single-Family Home for Cash?',
    sectionBody: 'Single-family homes are our most common purchase. Whether your home is move-in ready or needs work, we make competitive cash offers and close in 7-14 days. No agents, no commissions, no repairs.'
  },
  'condo': {
    label: 'Condo / Townhouse',
    description: 'condominiums and townhouses including non-warrantable buildings, those with HOA litigation, and units with special assessments',
    hook: 'Sell your condo or townhouse for cash, even with HOA issues.',
    sectionHeader: 'Selling a Condo or Townhouse for Cash',
    sectionBody: 'Condos can be hard to sell traditionally because of HOA restrictions, special assessments, pending litigation, or non-warrantable status. Cash buyers bypass all of that - no mortgage lender requiring association certification.'
  },
  'multi-family': {
    label: 'Multi-Family / Apartments',
    description: 'duplexes, triplexes, fourplexes, and apartment buildings - occupied or vacant',
    hook: 'Sell a duplex, apartment building, or multi-family rental for cash.',
    sectionHeader: 'Selling Multi-Family Property for Cash',
    sectionBody: 'We buy multi-family with tenants in place - no eviction required. Whether your building has 2 units or 200, we make cash offers based on rent rolls, occupancy, condition, and local market. Tired landlords are one of our most common seller types.'
  },
  'vacant-land': {
    label: 'Vacant Land',
    description: 'residential lots, commercial parcels, agricultural acreage, waterfront land, and undeveloped tracts',
    hook: 'Sell vacant land for cash - residential, commercial, or acreage.',
    sectionHeader: 'Selling Vacant Land for Cash',
    sectionBody: 'Land is one of the hardest property types to sell traditionally - most agents do not specialize in land, and lenders rarely finance raw land. Cash is often the only practical exit. We buy lots, acreage, agricultural, waterfront, and even landlocked parcels.'
  },
  'commercial': {
    label: 'Commercial Property',
    description: 'office buildings, retail storefronts, strip malls, medical/dental offices, restaurants, and mixed-use properties',
    hook: 'Sell commercial property fast for cash - office, retail, restaurant.',
    sectionHeader: 'Selling Commercial Real Estate for Cash',
    sectionBody: 'Commercial property typically sits for months because the buyer pool is smaller and financing is slower. We make cash offers on occupied or vacant commercial buildings - office, retail, medical, restaurant, mixed-use - and close in 7-14 days.'
  },
  'mobile-home': {
    label: 'Mobile / Manufactured Home',
    description: 'mobile homes and manufactured housing - in parks or on private land, with or without acreage',
    hook: 'Sell a mobile home or manufactured house for cash.',
    sectionHeader: 'Selling a Mobile or Manufactured Home',
    sectionBody: 'Mobile homes are extremely hard to sell traditionally because financing options are limited. We buy mobile and manufactured homes with or without the land. Single-wide, double-wide, in parks or on private property.'
  },
  'industrial': {
    label: 'Industrial / Warehouse',
    description: 'warehouses, distribution centers, manufacturing facilities, flex space, and industrial properties',
    hook: 'Sell industrial property or warehouse for cash.',
    sectionHeader: 'Selling Industrial Property for Cash',
    sectionBody: 'Industrial properties have small buyer pools and slow financing. SBA loans take 60-120 days minimum. We make cash offers on warehouses, distribution centers, flex space, and industrial facilities. Environmental concerns? We can still buy.'
  },
  'farm-ranch': {
    label: 'Farm / Ranch / Agricultural',
    description: 'working farms, ranches, equestrian facilities, crop land, timber land, and agricultural acreage',
    hook: 'Sell a farm, ranch, or agricultural property for cash.',
    sectionHeader: 'Selling Farm or Ranch Property for Cash',
    sectionBody: 'Agricultural property can take 12-24 months on the traditional market. Cash compresses that to weeks. We buy working farms, cattle ranches, equestrian facilities, crop land, timber land, and any other agricultural property.'
  }
};

export async function onRequest(context) {
  const { params } = context;
  const stateParam = String(params.state || '').toUpperCase().slice(0, 2);
  const citySlug = String(params.city || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
  const typeSlug = String(params.type || '').toLowerCase();

  const propertyType = PROPERTY_TYPES[typeSlug];
  if (!propertyType) return notFoundResponse();

  const rec = CITY_INDEX[stateParam + ':' + citySlug];
  if (!rec) return notFoundResponse();

  const city = titleCase(rec.c);
  const county = titleCase(rec.co);
  const stateName = STATE_NAMES[stateParam] || rec.n;

  const path = `/sell/${stateParam.toLowerCase()}/${citySlug}/${typeSlug}`;
  const title = `Sell ${propertyType.label} in ${city}, ${stateParam} for Cash | OneCashOffer`;
  const description = `Cash offer for ${propertyType.label.toLowerCase()} in ${city}, ${stateParam}. ${propertyType.hook} Free 24-hour offer. Close in 7-14 days. Zero fees.`;

  const intro = `
    <p>OneCashOffer buys ${propertyType.description} in <strong>${city}, ${stateParam}</strong> and across ${county} County. We make free written cash offers within 24 hours and close in 7-14 days. Any condition. Zero seller fees.</p>
    <p>The traditional listing process for ${propertyType.label.toLowerCase()} in ${city} can take 60-180 days, especially for non-standard property types. A cash sale to OneCashOffer bypasses all of that.</p>
  `;

  const sections = [
    {
      h2: propertyType.sectionHeader,
      html: `<p>${propertyType.sectionBody}</p>`
    },
    {
      h2: `How Fast Can You Buy My ${city} ${propertyType.label}?`,
      html: `<p>7 to 14 days from offer acceptance to cash in your bank for ${propertyType.label.toLowerCase()} in ${city}. Title search runs 3-5 business days through a licensed ${stateName} title company. If your property has complications (liens, probate, multiple owners), expect 3-6 weeks total.</p>`
    },
    {
      h2: `What Will You Pay for ${propertyType.label} in ${city}?`,
      html: `<p>Offers on ${propertyType.label.toLowerCase()} in ${city} are based on comparable sales in your ${county} County market, property condition, and the specific characteristics of your property type. We provide a transparent written breakdown with every offer.</p>
        <p>Cash offers on ${propertyType.label.toLowerCase()} typically range from 70-90% of full market value depending on condition. When you subtract the 8-10% in traditional sale costs (commissions + closing + repairs + carrying costs), the net difference is usually small - and you avoid 60-90 days of waiting and risk.</p>`
    },
    {
      h2: `Why Sell ${propertyType.label} to a Cash Buyer Instead of Listing?`,
      html: `<ul style="list-style:disc;padding-left:20px;color:var(--text-muted);margin:16px 0;">
        <li><strong>Speed:</strong> 7-14 days vs 60-180 days on the open market</li>
        <li><strong>Certainty:</strong> Cash deals close 95%+ of the time. Financed deals fail 15%.</li>
        <li><strong>Specialization:</strong> Most cash buyers refuse ${propertyType.label.toLowerCase()}. We specialize in it.</li>
        <li><strong>No agent commissions:</strong> Save 5-6% (often $20K-$100K+)</li>
        <li><strong>No repairs:</strong> Sell as-is, even with major issues</li>
        <li><strong>We pay closing costs:</strong> Zero out-of-pocket for the seller</li>
      </ul>`
    }
  ];

  const faq = [
    { q: `Do you buy ${propertyType.label.toLowerCase()} in ${city}, ${stateParam}?`, a: `Yes. OneCashOffer makes cash offers on ${propertyType.label.toLowerCase()} throughout ${city}, ${stateParam} and all of ${county} County.` },
    { q: `What condition does my ${propertyType.label.toLowerCase()} need to be in?`, a: `Any condition. Move-in ready, distressed, vacant, occupied, damaged - we buy it all. No repairs required.` },
    { q: `How much will I get for my ${city} ${propertyType.label.toLowerCase()}?`, a: `Offers are based on comparable ${propertyType.label.toLowerCase()} sales in your specific ${city} market plus property condition. Submit your address for a personalized cash number within 24 hours.` },
    { q: `Are there any fees to sell ${propertyType.label.toLowerCase()} to OneCashOffer?`, a: `Zero. No application fee, no commission, no closing costs. The offer amount is your net proceeds.` },
    { q: `How fast can closing happen on a ${city} ${propertyType.label.toLowerCase()}?`, a: `7 to 14 business days for clean-title properties. Up to 6 weeks if there are complications. You choose the closing date.` }
  ];

  // Related links to other property types in same city + zips
  const stateSlug = stateName.toLowerCase().replace(/\s+/g, '-');
  const otherTypes = Object.keys(PROPERTY_TYPES).filter(t => t !== typeSlug).slice(0, 5);
  const zips = (rec.z || []).slice(0, 3);
  const relatedLinks = [
    { href: `/sell/${stateParam.toLowerCase()}/${citySlug}`, label: `All Property Types in ${city}` },
    ...otherTypes.map(t => ({ href: `/sell/${stateParam.toLowerCase()}/${citySlug}/${t}`, label: `${PROPERTY_TYPES[t].label} in ${city}` })),
    { href: `/distressed/${stateParam.toLowerCase()}/${citySlug}`, label: `Distressed ${city} Property` },
    { href: `/premium/${stateParam.toLowerCase()}/${citySlug}`, label: `Premium ${city} Property` },
    ...zips.map(z => ({ href: `/zip/${z}`, label: `ZIP ${z} (${city})` })),
    { href: `/states/sell-property-${stateSlug}`, label: `Sell in ${stateName}` },
    { href: '/cash-offer', label: 'Get Your Cash Offer Now' }
  ];

  const html = renderPage({
    page: 'sell-type',
    slug: stateParam.toLowerCase() + '-' + citySlug + '-' + typeSlug,
    path,
    title,
    description,
    h1Lead: `Sell ${propertyType.label} in`,
    h1Gold: `${city}, ${stateParam}`,
    subtitle: `${propertyType.label} - ${county} County, ${stateName}`,
    heroSub: `${propertyType.hook} Free cash offer for ${propertyType.label.toLowerCase()} in ${city} within 24 hours. Close in 7-14 days, any condition.`,
    crumbs: [
      { name: stateName, path: `/states/sell-property-${stateSlug}` },
      { name: city, path: `/sell/${stateParam.toLowerCase()}/${citySlug}` },
      { name: propertyType.label, path }
    ],
    intro,
    sections,
    marketSnapshot: [
      ['Property Type', propertyType.label],
      ['City', city],
      ['State', stateName],
      ['County', county + ' County'],
      ['Cash Sale Close Time', '7-14 days'],
      ['Average Offer Response', '24 hours']
    ],
    faq,
    relatedLinks,
    schemaCity: city,
    schemaCounty: county,
    schemaState: stateParam
  });

  return htmlResponse(html);
}
