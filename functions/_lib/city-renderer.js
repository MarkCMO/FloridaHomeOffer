// Shared renderer for /sell, /distressed, /premium city pages.
import { CITY_INDEX } from './cities-data.js';
import { STATES } from './states-data.js';
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

function lookupCity(stateParam, citySlugParam) {
  const state = String(stateParam || '').toUpperCase().slice(0, 2);
  const slug = String(citySlugParam || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
  const key = state + ':' + slug;
  return { rec: CITY_INDEX[key], state, slug };
}

function presetContent(variant, city, state, county, stateName) {
  const cityPretty = city;
  if (variant === 'distressed') {
    return {
      subtitle: `Distressed & Damaged Properties - ${county} County, ${stateName}`,
      h1Lead: `Sell a Distressed`,
      h1Gold: `${cityPretty} Property for Cash`,
      heroSub: `Fire damage, water damage, mold, foundation issues, hoarder houses, code violations, condemned, abandoned - we buy distressed ${cityPretty} properties in any condition. Free 24-hour cash offer.`,
      intro: `
        <p>Got a distressed property in <strong>${cityPretty}, ${state}</strong>? OneCashOffer specializes in run-down, damaged, and problem properties that traditional buyers refuse. We buy as-is with cash, close in 7-14 days, and you walk away clean. No repairs, no cleanup, no fees, no inspections that kill the deal.</p>
        <p>If your ${cityPretty} property has fire damage, water intrusion, mold, structural issues, foundation problems, hurricane damage, hoarder conditions, code violations, tax liens, or anything else that makes traditional sellers run away - we are the buyer for you.</p>
      `,
      sections: [
        { h2: `What Counts as Distressed Property in ${cityPretty}?`, html: `<ul style="list-style:disc;padding-left:20px;color:var(--text-muted);margin:16px 0;">
          <li>Fire-damaged homes (partial or total loss)</li>
          <li>Water damage, flood damage, plumbing leaks, sewage backup</li>
          <li>Mold, mildew, asbestos, lead paint hazards</li>
          <li>Hurricane and storm damage (roof, structural, broken windows)</li>
          <li>Foundation issues, sinkholes, settling, cracks</li>
          <li>Hoarder houses (we handle full cleanout after closing)</li>
          <li>Code violations, condemned properties, unpermitted work</li>
          <li>Outdated/unsafe electrical, plumbing, HVAC, roof</li>
          <li>Termite damage, pest infestations</li>
          <li>Properties with tax liens, judgments, HOA liens</li>
          <li>Squatter / problem-tenant situations</li>
          <li>Inherited/probate properties needing major work</li>
        </ul>` },
        { h2: `How Much Will I Get for a Distressed Property in ${cityPretty}?`, html: `<p>Offers on distressed properties are based on the After-Repair Value (ARV) of comparable ${cityPretty} sales, minus the cost we will spend on repairs, minus a modest profit margin. While the offer is below retail market value, you avoid the 8-10% in agent commissions and closing costs of a traditional sale, the cost of repairs (often $20K-$100K+ for distressed properties), and months of carrying costs.</p>
          <p>The net difference is usually a fraction of what most people assume. And cash means you actually close - distressed properties often kill MLS deals during inspection.</p>` },
        { h2: `Why Do Traditional Buyers Avoid Distressed ${cityPretty} Properties?`, html: `<p>Three reasons: <strong>(1) Financing</strong> - banks refuse mortgages on properties with active fire/water/mold damage, foundation issues, or below-code conditions. <strong>(2) Insurance</strong> - homeowner's insurance won't cover damaged properties at closing. <strong>(3) Risk</strong> - retail buyers want move-in ready. They get scared off by inspection findings.</p>
          <p>Cash investors like OneCashOffer specialize in these properties because we have the capital to renovate, the contractor network to execute fast, and the experience to price the deal correctly upfront.</p>` }
      ],
      faq: [
        { q: `Will OneCashOffer buy a fire-damaged house in ${cityPretty}?`, a: `Yes. We regularly buy fire-damaged properties in ${cityPretty} and across ${stateName}. Partial damage, total loss, or anything in between - we make a fair cash offer based on the lot value plus rebuildable structure.` },
        { q: `Can I sell a hoarder house in ${cityPretty} without cleaning?`, a: `Absolutely. Leave everything inside - furniture, belongings, trash. We handle the entire cleanout after closing. Many sellers tell us this is the best part of working with us. No embarrassment, no manual labor, no dumpsters.` },
        { q: `What if my ${cityPretty} property has code violations?`, a: `Code violations are not a problem. We work with ${county} County code enforcement directly to resolve violations at closing. Often the title company holds escrow for violation cures so you walk away clean.` },
        { q: `Can you close on a property with mold or asbestos in ${cityPretty}?`, a: `Yes. We assess remediation costs and factor them into our offer. You are not required to disclose to a retail buyer or pay for testing/remediation before we close.` },
        { q: `My ${cityPretty} house has water damage and mold - is it even sellable?`, a: `Yes, to us. Standard retail buyers walk away from mold. Cash investors with remediation experience like OneCashOffer make these our specialty. Submit your address for an offer.` }
      ]
    };
  }
  if (variant === 'premium') {
    return {
      subtitle: `Premium & Luxury Property - ${county} County, ${stateName}`,
      h1Lead: `Sell Your Premium`,
      h1Gold: `${cityPretty} Home for Cash`,
      heroSub: `Selling a premium home in ${cityPretty}? Skip the agent commissions, lengthy listing process, and price negotiations. Get a fast cash offer for your high-end property with zero fees and a 7-14 day close.`,
      intro: `
        <p>If you own a higher-end, move-in-ready property in <strong>${cityPretty}, ${state}</strong> and want to sell without the typical 60-90 day listing process, OneCashOffer makes competitive cash offers on premium properties. Our offers on well-maintained ${cityPretty} homes are typically 85-95% of full market value, with closings in 7-14 days, zero seller fees, and no commission cuts.</p>
        <p>Premium sellers in ${county} County choose us when they value <strong>speed</strong>, <strong>certainty</strong>, and <strong>privacy</strong> over chasing the top dollar through public listings. No showings, no open houses, no negotiations falling through during inspection.</p>
      `,
      sections: [
        { h2: `Why Sell a Premium ${cityPretty} Home for Cash?`, html: `<ul style="list-style:disc;padding-left:20px;color:var(--text-muted);margin:16px 0;">
          <li><strong>Privacy</strong> - no MLS listing, no public showings, no Zillow scraping your photos</li>
          <li><strong>Speed</strong> - close in 7-14 days, not 60-90</li>
          <li><strong>Certainty</strong> - cash deal, no financing contingency that fails 15% of the time</li>
          <li><strong>No commissions</strong> - save 5-6% in agent fees ($25K+ on a $500K home)</li>
          <li><strong>No prep work</strong> - no staging, no professional photos, no repairs to pass inspection</li>
          <li><strong>Flexible closing</strong> - move on your timeline, including rent-back if you need extra time</li>
        </ul>` },
        { h2: `What Premium ${cityPretty} Properties Do You Buy?`, html: `<p>Move-in-ready single-family homes, luxury condos, waterfront properties, gated-community homes, country-club homes, equestrian properties, custom builds, and high-end townhouses. If your ${cityPretty} property is in good or excellent condition with modern updates, we want to make an offer.</p>` },
        { h2: `How Much Below Market Will Your Cash Offer Be?`, html: `<p>For premium ${cityPretty} properties in good condition, our offers are typically <strong>85-95% of full market value</strong>. The difference is the certainty premium - we close fast and guaranteed. When you subtract 5-6% in agent commissions, 1-3% in closing costs, the cost of months of carrying expenses, and the time value of money, the net difference vs a traditional sale is small - often within 5%.</p>
          <p>For sellers who need to move on their timeline, value privacy, or want to avoid the hassle of the MLS process, that small spread is worth it.</p>` }
      ],
      faq: [
        { q: `What price range does OneCashOffer buy in ${cityPretty}?`, a: `We buy properties at every price point in ${cityPretty}, from starter homes to multi-million-dollar estates. Premium properties typically receive offers at 85-95% of full market value due to better condition and faster underwriting.` },
        { q: `Do you buy luxury homes in ${cityPretty}?`, a: `Yes. We have purchased premium ${cityPretty} properties including waterfront homes, gated-community estates, and luxury condos. Submit your address for an offer - there is no upper limit on what we'll consider.` },
        { q: `Can I keep the sale private?`, a: `Yes. Cash sales to OneCashOffer do not go on the MLS. The transaction is recorded with ${county} County like any closing but there is no public listing, no showings, no marketing of your property. Many premium sellers value this privacy.` },
        { q: `How is the cash offer determined for a high-end ${cityPretty} property?`, a: `We analyze comparable sales in your ${cityPretty} neighborhood, market trends in ${county} County, your property condition, and any unique features (waterfront, view, lot size, custom build quality). You receive a transparent breakdown showing exactly how we arrived at the offer.` },
        { q: `What if I want to negotiate the offer?`, a: `Absolutely. The initial offer is a starting point. If you have specifics we may have missed (recent upgrades, comparable sales, unique features), we will reconsider. Many of our highest-price deals involved negotiation.` }
      ]
    };
  }
  // default: 'sell' variant
  return {
    subtitle: `${county} County, ${stateName}`,
    h1Lead: `Sell Your House Fast in`,
    h1Gold: `${cityPretty}, ${state}`,
    heroSub: `Get a free cash offer for your ${cityPretty} property in 24 hours. Any condition, any situation. Close in 7-14 days. Zero fees, zero commissions, zero repairs needed.`,
    intro: `
      <p>OneCashOffer buys properties throughout <strong>${cityPretty}, ${state}</strong> and the surrounding ${county} County area. Whether you are selling a single-family home, condo, multi-family, vacant land, or commercial property, we make free no-obligation written cash offers within 24 hours and close in 7-14 days.</p>
      <p>The traditional listing process in ${cityPretty} takes 60-90 days from listing to closing and costs 8-10% of the sale price in agent commissions, closing costs, and repairs. A cash sale eliminates all of that.</p>
    `,
    sections: [
      { h2: `How Does Selling for Cash in ${cityPretty} Work?`, html: `<ol style="list-style:decimal;padding-left:20px;color:var(--text-muted);margin:16px 0;">
        <li>Submit your ${cityPretty} property details (address, condition, timeline) on our form or call us.</li>
        <li>Receive a free written cash offer within 24 hours. No obligation, no fees.</li>
        <li>Accept, reject, or counter. There is zero pressure.</li>
        <li>If accepted, we open escrow with a licensed ${stateName} title company.</li>
        <li>Title search runs 3-5 business days.</li>
        <li>Close at the title company. Funds wired to your bank account.</li>
      </ol>` },
      { h2: `What Properties Do You Buy in ${cityPretty}?`, html: `<p>Every type. We make offers on single-family homes, condos and townhouses, multi-family (duplex through 100+ unit buildings), commercial property, vacant land, mobile and manufactured homes, industrial property, farms and ranches, mixed-use buildings, and any other property type that has a clear title.</p>
        <p>Condition does not matter. Move-in ready, distressed, damaged, vacant, occupied, with tenants, in probate, in foreclosure, with code violations, with liens - we buy them all.</p>` },
      { h2: `How Long Does It Take to Sell a House in ${cityPretty}?`, html: `<p>With OneCashOffer: 7-14 days from offer acceptance to cash in your bank. With a traditional ${cityPretty} listing: average 60-90 days, sometimes much longer.</p>
        <p>Factors that can extend a cash close to 3-6 weeks: title issues (liens, undisclosed encumbrances), probate situations, multiple owners with conflicting goals. Even with complications, cash typically beats a traditional listing by months.</p>` },
      { h2: `What Are Closing Costs for a ${cityPretty} Seller?`, html: `<p>Zero. OneCashOffer pays all closing costs in ${stateName}: documentary stamp tax, title insurance, recording fees, transfer taxes. The cash offer amount is your net proceeds, less any existing mortgage or liens that are paid off at closing through the title company.</p>
        <p>Compare to a traditional ${cityPretty} sale where you pay 5-6% in agent commissions + 1-3% in seller closing costs = 8-10% of sale price out of your pocket.</p>` }
    ],
    faq: [
      { q: `How fast can I sell my house in ${cityPretty}, ${state}?`, a: `7 to 14 days from when you accept our offer. We can close as soon as the title company completes the title search (typically 3-5 business days for a clean title).` },
      { q: `Do you buy houses in any condition in ${cityPretty}?`, a: `Yes. Any condition. We buy hurricane-damaged, fire-damaged, mold, foundation issues, hoarder houses, code violations, vacant properties, condemned - everything. No repairs required.` },
      { q: `What does it cost to sell my ${cityPretty} house to OneCashOffer?`, a: `Zero. No application fee, no consultation fee, no commission, no closing costs. We pay all standard ${stateName} closing costs. The offer amount is your net proceeds.` },
      { q: `Do I need a real estate agent to sell in ${cityPretty}?`, a: `No. ${stateName} law does not require an agent for a property sale. Direct cash sales close through a licensed title company. You save the 5-6% commission.` },
      { q: `Can I sell my ${cityPretty} house with tenants in place?`, a: `Yes. We buy rental properties with tenants in place. No need to evict. We honor the existing lease and take over landlord responsibilities at closing.` }
    ]
  };
}

export async function renderCity(context, variant) {
  const { params } = context;
  const { rec, state, slug } = lookupCity(params.state, params.city);
  if (!rec) return notFoundResponse();

  const city = titleCase(rec.c);
  const county = titleCase(rec.co);
  const stateName = STATE_NAMES[state] || rec.n;
  const stateInfo = STATES[state] || null;

  const variantPath = { sell: 'sell', distressed: 'distressed', premium: 'premium' }[variant] || 'sell';
  const path = `/${variantPath}/${state.toLowerCase()}/${slug}`;

  const titlePrefix = variant === 'distressed'
    ? `Sell a Distressed Property in ${city}, ${state}`
    : variant === 'premium'
      ? `Sell Premium / Luxury Property in ${city}, ${state}`
      : `Sell Your House Fast in ${city}, ${state}`;
  const title = `${titlePrefix} | OneCashOffer`;

  const description = variant === 'distressed'
    ? `Run-down, damaged, or distressed property in ${city}, ${state}? OneCashOffer buys as-is for cash. Fire, water, mold, foundation, hoarder, code violations - free 24-hour offer.`
    : variant === 'premium'
      ? `Sell a premium ${city}, ${state} home for cash. Skip the agent commissions, listing process, and waiting. Fast, private, 7-14 day close. Free 24-hour offer.`
      : `Sell your ${city}, ${state} property fast for cash. Any condition, any situation. Free 24-hour offer. Close in 7-14 days. Zero fees.`;

  const content = presetContent(variant, city, state, county, stateName);

  // === STATE-SPECIFIC AUTHORITY CONTENT ===
  // Injects per-state real estate law + market data + closing process info
  // so every page has unique state-specific content that Google rewards.
  if (stateInfo) {
    content.sections.push({
      h2: `${stateName} Real Estate Laws & Closing Process for ${city} Sellers`,
      html: `<p>${stateInfo.laws}</p>
        <p>When you sell your ${city} property through OneCashOffer, we handle all ${stateName}-specific paperwork and work with licensed local closing agents who know the state's rules inside and out. Whether ${stateName} requires an attorney at closing or operates under title-company escrow, your transaction stays compliant from start to finish.</p>`
    });
    content.sections.push({
      h2: `Common Challenges Selling Real Estate in ${stateName}`,
      html: `<p>${stateInfo.challenges}</p>
        <p>These ${stateName} factors are exactly why cash buyers like OneCashOffer outperform traditional sales for sellers facing them. We assess risk, factor real local conditions into our offer, and close fast.</p>`
    });
    content.sections.push({
      h2: `${stateName} Housing Market Context for ${city}`,
      html: `<p>${stateInfo.desc}</p>
        <p>${stateName} statewide median home price: <strong>${stateInfo.medianHomePrice}</strong>. Statewide average days on market: <strong>${stateInfo.avgDays} days</strong>. These are useful benchmarks, but real offers depend on your specific ${city} micro-market in ${county} County.</p>`
    });
    content.sections.push({
      h2: 'How OneCashOffer Determines Your Cash Offer',
      html: `<p>Every cash offer we extend in ${city} is built from four data inputs: (1) <strong>comparable sales</strong> within a 1-mile radius of your property over the last 6 months, weighted by similarity to your home; (2) <strong>property condition assessment</strong> based on the details you provide and a brief walkthrough; (3) <strong>${stateName} closing costs</strong> (which we absorb so your offer is your net); and (4) a modest <strong>investment margin</strong> that accounts for repairs and carrying time before resale.</p>
        <p>We disclose the comparable sales we use. If you have better local intel - recent neighbor sales, completed renovations, ${county} County market shifts - we are open to adjusting. Many of our deals involve back-and-forth on data, and we frequently increase offers when sellers bring strong evidence.</p>`
    });
  }

  // Authoritative-sources section: links visitors to real .gov + industry references.
  // This signals E-E-A-T to Google: we cite trusted sources.
  content.sections.push({
    h2: 'Authoritative Resources for ' + stateName + ' Home Sellers',
    html: `<ul style="list-style:disc;padding-left:20px;color:var(--text-muted);margin:16px 0;">
      <li><a href="https://www.consumer.ftc.gov/topics/buying-renting-or-selling-real-estate" rel="nofollow noopener" target="_blank">Federal Trade Commission - Selling Real Estate</a></li>
      <li><a href="https://www.hud.gov/" rel="nofollow noopener" target="_blank">U.S. Department of Housing and Urban Development (HUD)</a></li>
      <li><a href="https://www.nar.realtor/" rel="nofollow noopener" target="_blank">National Association of REALTORS&reg;</a></li>
      <li><a href="https://www.consumerfinance.gov/owning-a-home/" rel="nofollow noopener" target="_blank">CFPB - Owning a Home</a></li>
      <li><a href="https://www.irs.gov/taxtopics/tc701" rel="nofollow noopener" target="_blank">IRS Topic 701 - Sale of Your Home (Capital Gains)</a></li>
    </ul>
    <p style="font-size:0.9rem;color:var(--text-muted);">We recommend consulting a licensed ${stateName} real estate attorney or CPA for any specific legal or tax questions about your property sale. OneCashOffer makes principal cash purchases - we are not your real estate agent or fiduciary.</p>`
  });

  // Related links
  const zips = (rec.z || []).slice(0, 5);
  const stateSlug = stateName.toLowerCase().replace(/\s+/g, '-');
  const relatedLinks = [
    { href: `/sell/${state.toLowerCase()}/${slug}`, label: `Sell House in ${city}, ${state}` },
    { href: `/distressed/${state.toLowerCase()}/${slug}`, label: `Distressed Property in ${city}` },
    { href: `/premium/${state.toLowerCase()}/${slug}`, label: `Premium Property in ${city}` },
    ...zips.map(z => ({ href: `/zip/${z}`, label: `ZIP ${z} (${city})` })),
    { href: `/states/sell-property-${stateSlug}`, label: `Sell in ${stateName}` },
    { href: '/cash-offer', label: 'Get Your Cash Offer Now' }
  ];

  const html = renderPage({
    page: variant,
    slug: state.toLowerCase() + '-' + slug,
    path,
    title,
    description,
    h1Lead: content.h1Lead,
    h1Gold: content.h1Gold,
    subtitle: content.subtitle,
    heroSub: content.heroSub,
    crumbs: [
      { name: stateName, path: `/states/sell-property-${stateSlug}` },
      { name: city, path }
    ],
    intro: content.intro,
    sections: content.sections,
    marketSnapshot: stateInfo ? [
      ['City', city],
      ['State', stateName],
      ['County', county + ' County'],
      [`${stateName} Median Home Price`, stateInfo.medianHomePrice],
      [`${stateName} Avg Days on Market (Traditional)`, stateInfo.avgDays + ' days'],
      ['Cash Sale Close Time', '7-14 days'],
      ['Average Offer Response', '24 hours'],
      ['ZIPs in this city', zips.length > 0 ? zips.join(', ') + (rec.z.length > 5 ? ' and more' : '') : 'See ZIP pages']
    ] : [
      ['City', city],
      ['State', stateName],
      ['County', county + ' County'],
      ['Cash Sale Close Time', '7-14 days'],
      ['Average Offer Response', '24 hours'],
      ['ZIPs in this city', zips.length > 0 ? zips.join(', ') + (rec.z.length > 5 ? ' and more' : '') : 'See ZIP pages']
    ],
    faq: content.faq,
    relatedLinks,
    schemaCity: city,
    schemaCounty: county,
    schemaState: state
  });

  return htmlResponse(html);
}
