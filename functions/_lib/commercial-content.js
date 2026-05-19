// Deep content blocks for OneCashOffer Capital Group (commercial / CRE) pages.
// Designed for institutional-grade sellers: REITs, syndicators, family offices,
// principal owners, bank REO desks. Target page length: 3,500-5,000 words.

export const ASSET_CLASSES = {
  'multifamily': {
    label: 'Multifamily / Apartment Complex',
    short: 'multifamily',
    minDeal: '$5M',
    typicalCap: '5.0% - 6.5%',
    units: '20-500+ units',
    description: 'apartment buildings, multifamily portfolios, and rental complexes including garden-style, mid-rise, and high-rise assets',
    hook: 'Sell your multifamily property or apartment portfolio for cash. We close in 30-60 days, all-cash, no financing contingency.',
    drivers: 'rental demand, average rent growth, occupancy stability, capex backlog, and submarket cap-rate trends',
    risks: 'rent control, tenant protection laws, deferred maintenance, declining occupancy, and rising operating expenses (insurance, taxes, utilities)',
    valueAdd: 'unit renovation programs, rent-to-market repositioning, expense rationalization, and amenity upgrades'
  },
  'office': {
    label: 'Office Building',
    short: 'office',
    minDeal: '$5M',
    typicalCap: '6.5% - 9.0%',
    units: '20,000+ sqft',
    description: 'office buildings including Class A, B, and C product across CBD, suburban, and medical office submarkets',
    hook: 'Sell your office building for cash. We acquire Class A, B, C office product, occupied or vacant, in 30-60 days.',
    drivers: 'tenant credit quality, lease term and WALT (weighted average lease term), submarket vacancy, and remote-work absorption trends',
    risks: 'post-2020 office demand uncertainty, large tenant rollover, refinancing maturity walls, and elevated TI/LC requirements',
    valueAdd: 'lease-up of vacant suites, building amenity additions, energy efficiency retrofits, repositioning to medical/lab/educational'
  },
  'retail': {
    label: 'Retail / Shopping Center',
    short: 'retail',
    minDeal: '$5M',
    typicalCap: '6.0% - 8.5%',
    units: '10,000+ sqft',
    description: 'retail properties including strip centers, neighborhood centers, community centers, power centers, single-tenant net-lease (STNL), and mixed-use retail',
    hook: 'Sell your shopping center, strip center, or retail property for cash. We acquire occupied or vacant retail, including big-box vacancies and post-bankruptcy spaces.',
    drivers: 'anchor tenant quality, co-tenancy clauses, retail-to-population ratio, demographic trade area, and e-commerce-resistant tenant mix',
    risks: 'anchor closures, retail bankruptcies (rolling waves of department store, drugstore, and fitness closures), e-commerce displacement, and ground-lease expirations',
    valueAdd: 'tenant repositioning, big-box subdivision, outparcel development, pad sale-leaseback, and conversion to medical/last-mile distribution'
  },
  'industrial': {
    label: 'Industrial / Warehouse',
    short: 'industrial',
    minDeal: '$10M',
    typicalCap: '5.0% - 6.5%',
    units: '50,000+ sqft',
    description: 'industrial property including distribution centers, last-mile logistics, light manufacturing, flex space, cold storage, truck terminals, and outdoor storage (IOS)',
    hook: 'Sell your industrial property, distribution center, or warehouse portfolio for cash. We close 30-60 days, no financing contingency.',
    drivers: 'e-commerce penetration, last-mile delivery demand, supply-chain reshoring, clear height and dock counts, and proximity to population centers',
    risks: 'concentration risk if single-tenant, environmental contamination from prior industrial use, and tight insurance markets for older industrial',
    valueAdd: 'modernization for last-mile use, additional dock doors, expanded power, conversion to cold storage, and outdoor storage yard expansion'
  },
  'hospitality': {
    label: 'Hotel / Hospitality',
    short: 'hospitality',
    minDeal: '$5M',
    typicalCap: '7.5% - 11.0%',
    units: '50+ keys',
    description: 'hospitality property including limited-service hotels, full-service hotels, extended-stay, boutique, resort, and select-service brands',
    hook: 'Sell your hotel or hospitality portfolio for cash. We acquire flagged and independent hotels, branded and non-branded, occupied or repositioning.',
    drivers: 'RevPAR (revenue per available room), ADR (average daily rate), occupancy, brand and franchise standards, PIP requirements, and submarket demand drivers (corporate, leisure, group)',
    risks: 'brand PIP (property improvement plan) compliance, flag deflagging risk, deferred maintenance, hurricane/wildfire damage cycles, and labor cost inflation',
    valueAdd: 'PIP completion, re-flagging to higher brand, F&B repositioning, conversion to multifamily or extended-stay'
  },
  'self-storage': {
    label: 'Self-Storage Facility',
    short: 'self-storage',
    minDeal: '$3M',
    typicalCap: '5.5% - 7.0%',
    units: '50,000+ NRSF',
    description: 'self-storage facilities including climate-controlled, drive-up, multi-story, RV/boat storage, and portable storage',
    hook: 'Sell your self-storage facility or portfolio for cash. We acquire stabilized and lease-up properties across all markets.',
    drivers: 'population density, household income, rental-rate trends, online customer acquisition cost, and unit mix (climate-controlled premium)',
    risks: 'overbuilding in growth markets compressing rents, technology disruption (online platforms compressing margins), and conversion-from-retail competition',
    valueAdd: 'online platform adoption, climate-controlled unit conversion, expansion to vacant land, and rent-rate optimization'
  },
  'healthcare': {
    label: 'Medical Office / Healthcare',
    short: 'medical-office',
    minDeal: '$5M',
    typicalCap: '6.0% - 7.5%',
    units: '15,000+ sqft',
    description: 'healthcare real estate including medical office buildings (MOB), ambulatory surgery centers (ASC), urgent care, dental and veterinary offices, and on-campus medical office',
    hook: 'Sell your medical office building or healthcare portfolio for cash. We acquire on-campus and off-campus MOB, single-tenant and multi-tenant.',
    drivers: 'health system credit, tenant mix and specialty diversification, on-campus location premium, CON (Certificate of Need) regulations, and population aging trends',
    risks: 'health system consolidation reducing tenant pool, hospital affiliation changes, large tenant rollover, and specialized TI/LC requirements',
    valueAdd: 'lease-up to higher-credit health system, specialty tenant mix optimization, conversion of office to medical, and parking field expansion'
  },
  'mixed-use': {
    label: 'Mixed-Use Property',
    short: 'mixed-use',
    minDeal: '$5M',
    typicalCap: '5.5% - 7.5%',
    units: '20,000+ sqft',
    description: 'mixed-use real estate combining residential, retail, office, hospitality, and/or other uses in a single building or master-planned project',
    hook: 'Sell your mixed-use property, downtown building, or transit-oriented development for cash.',
    drivers: 'use diversification reducing risk, downtown revitalization trends, transit access, parking ratios, and tenant mix synergies',
    risks: 'complexity of operating multiple uses, condominium-association governance challenges, multiple insurance policies, and zoning use-restrictions',
    valueAdd: 'use repositioning between residential/retail/office, common-area amenity upgrades, and conversion to condominium for retail bays'
  },
  'senior-living': {
    label: 'Senior Living / Assisted Living',
    short: 'senior-living',
    minDeal: '$10M',
    typicalCap: '6.5% - 9.0%',
    units: '40-200+ beds',
    description: 'senior housing including independent living, assisted living, memory care, skilled nursing facilities (SNF), and continuing care retirement communities (CCRC)',
    hook: 'Sell your senior living facility or skilled nursing portfolio for cash. We acquire stabilized and turnaround properties.',
    drivers: 'aging US population (75+ cohort doubling 2020-2040), Medicare/Medicaid reimbursement rates, occupancy stability, and operator quality',
    risks: 'CMS reimbursement changes, staffing labor cost inflation, occupancy recovery from post-2020 lows, and complex CCRC obligations',
    valueAdd: 'operator transition to higher-quality manager, occupancy improvement, payor mix shift to private-pay, and CapEx-funded modernization'
  },
  'student-housing': {
    label: 'Student Housing',
    short: 'student-housing',
    minDeal: '$5M',
    typicalCap: '5.0% - 7.0%',
    units: '50-1000+ beds',
    description: 'purpose-built student housing (PBSH) and student-oriented multifamily properties serving university markets',
    hook: 'Sell your student housing property or portfolio for cash. We acquire on-campus and off-campus PBSH near major universities.',
    drivers: 'enrollment trends at served universities, distance-to-campus premiums, bed-pricing trends, and amenity competitiveness',
    risks: 'enrollment declines at smaller universities, online education growth, on-campus housing competition, and seasonality',
    valueAdd: 'rent-rate optimization, amenity upgrades (gym, study spaces, security), bed-mix changes, and university partnership development'
  },
  'data-center': {
    label: 'Data Center / Tech Infrastructure',
    short: 'data-center',
    minDeal: '$25M',
    typicalCap: '4.5% - 6.0%',
    units: '20,000+ sqft',
    description: 'data centers including hyperscale, colocation, edge, and crypto-mining facilities',
    hook: 'Sell your data center, colocation facility, or technology infrastructure property for cash.',
    drivers: 'AI compute demand, power availability (especially in growth metros), fiber connectivity, customer credit quality, and lease-term length',
    risks: 'power constraints in growth markets, customer concentration risk, technology obsolescence of older facilities, and competition from hyperscaler-owned product',
    valueAdd: 'power expansion to higher density, cooling system upgrades, fiber connectivity additions, and lease-up of unleased space'
  },
  'land-development': {
    label: 'Land for Development',
    short: 'land',
    minDeal: '$2M',
    typicalCap: 'N/A (development)',
    units: 'varies',
    description: 'developable land including residential subdivisions, commercial parcels, industrial sites, master-planned communities, infill parcels, and entitled land',
    hook: 'Sell developable land or entitled parcels for cash. We acquire commercial, residential, and industrial land for our own development pipeline.',
    drivers: 'entitlement status, zoning capacity, infrastructure proximity, environmental conditions, and growth-corridor location',
    risks: 'entitlement complexity, environmental contamination, holding cost of unentitled land, and infrastructure cost burdens',
    valueAdd: 'entitlement progression, rezoning to higher-density use, environmental remediation, and infrastructure delivery'
  }
};

export function creBlockUnderwritingDeepDive(loc) {
  return {
    h2: `How OneCashOffer Capital Group Underwrites ${loc.assetLabel} in ${loc.label}`,
    html: `<p>Our underwriting methodology for ${loc.assetLabel} in ${loc.label} mirrors what an institutional acquisition committee would run, condensed into a 48-hour evaluation that gets you a binding letter of intent fast.</p>

      <p><strong>Step 1: Property and Sponsor Information Intake.</strong> We need a basic property package: rent roll (T-12 with notes on month-to-month vs. lease terms), trailing-twelve-month (T-12) operating statement, last calendar year operating statement, current property tax assessment, insurance binder summary, and any deferred maintenance lists. For occupied multifamily and retail we also request a tenant ledger or aged-receivables report.</p>

      <p><strong>Step 2: Stabilized NOI Calculation.</strong> We normalize your trailing-twelve-month statement to a forward-looking stabilized net operating income (NOI). We adjust revenue for market rents (where contract rents are below market), occupancy normalization (typically 92-96% economic occupancy), and bad-debt assumption (1-3% of gross income). We adjust expenses for property tax reassessment at our purchase price, market-rate insurance, professional management at 3-5% of revenue, replacement reserves, and any owner-paid utilities not currently in the T-12.</p>

      <p><strong>Step 3: Cap Rate Application.</strong> Based on ${loc.assetLabel} comparable transactions in ${loc.label} and the broader ${loc.stateName} submarket over the prior 18 months, we apply a market-appropriate cap rate. For typical ${loc.assetLabel} assets the current cap rate range is <strong>${loc.typicalCap}</strong>. Our offer assumes the cap rate applied to stabilized NOI - not in-place NOI - which often allows us to pay above what a less-sophisticated buyer would for a value-add asset.</p>

      <p><strong>Step 4: Capital Expenditure Reserve.</strong> We project required capex over our holding period including roof, HVAC, parking, common areas, life-safety systems, and any building-code compliance gaps. We reduce our offer by the present value of required capex to maintain the asset.</p>

      <p><strong>Step 5: Closing Cost and Carry Adjustment.</strong> We absorb transfer taxes, recording fees, ${loc.stateName} closing costs, our own legal and due diligence, our own environmental Phase I (and Phase II if needed), and any survey costs. These come out of our investment basis, not your proceeds.</p>

      <p><strong>Step 6: Offer Letter.</strong> Within 48 hours of intake we deliver a written non-binding letter of intent (LOI) showing: offered purchase price, deal terms (assumption vs. all-cash, escrow timelines, due diligence period), our identification of the seller and buyer entities, an inspection scope, and proposed closing timeline.</p>

      <p><strong>Step 7: Negotiation, Purchase and Sale Agreement.</strong> Most sellers negotiate. We are open to it - bring your own broker's opinion of value, recent transaction comps, or sponsor-specific data on the asset's performance. Once aligned on price and terms, we move to a binding purchase and sale agreement (PSA) drafted by our ${loc.stateName} commercial real estate attorney.</p>

      <p><strong>Step 8: Due Diligence (15-30 days).</strong> We conduct property inspection (engineering Property Condition Assessment), Phase I Environmental Site Assessment, title and survey review, rent roll certification, estoppel certificates from material tenants, financial diligence on the T-12 and YTD performance, and review of any service contracts being assumed.</p>

      <p><strong>Step 9: Closing (30-60 days from PSA).</strong> Funded with all-cash from our own capital, no lender contingency. We pre-fund escrow 24-48 hours in advance. Title transfers, tenant security deposits and prepaid rents are credited to us via escrow, and net proceeds wire to you the same business day.</p>`
  };
}

export function creBlockCapStackAndFunding(loc) {
  return {
    h2: `All-Cash vs. Levered Acquisition: Why OneCashOffer Closes Without Lenders`,
    html: `<p>The single biggest reason institutional sellers in ${loc.label} choose OneCashOffer Capital Group is that we close without lender involvement. We fund 100% of the purchase price from our own equity at closing - no acquisition loan, no bridge loan, no preferred equity, no syndication LP capital that has to come in. This is structurally different from how most CRE buyers operate, and it changes the deal certainty calculus dramatically.</p>

      <p><strong>The Lender Contingency Problem.</strong> A typical CRE buyer using a 65% LTV acquisition loan needs the lender to: (1) appraise the property at or above the agreed purchase price, (2) approve the rent roll and current operating performance, (3) approve the borrower's sponsor experience and net worth, (4) approve the property's physical condition (engineering report), (5) approve the property's environmental status (Phase I, sometimes Phase II), (6) approve the title condition, (7) approve the borrower's loan documents and personal guarantees. Each of these is a potential deal-killer.</p>

      <p><strong>The Appraisal Gap.</strong> When ${loc.assetLabel} cap rates compress (rising prices), lender appraisals lag market by 60-180 days. Lender-appraised value comes in low. Buyer either brings more equity or kills the deal. This kills 12-18% of all CRE acquisitions in the current cycle. OneCashOffer all-cash deals have zero appraisal contingency - we set our value, you accept or reject, period.</p>

      <p><strong>The Insurance Disqualification.</strong> ${loc.stateName} insurance markets have tightened severely for ${loc.short || loc.assetClassShort || 'commercial'} property. Some carriers refuse new policies in coastal areas, high-wildfire areas, and properties with aging building systems. Lenders require insurance to fund. Cash buyers do not need insurance to close.</p>

      <p><strong>The Environmental Problem.</strong> Older industrial, retail, and even multifamily properties in ${loc.label} can have Phase I findings that require Phase II testing, which can find contamination that disqualifies financing. Cash buyers can buy properties with known environmental conditions and handle remediation as part of our value-add plan.</p>

      <p><strong>The Loan Document Friction.</strong> CMBS, agency (Fannie/Freddie), bank, and life-company loans each have unique documentation requirements. Title curative issues, easement complications, ground leases, and unusual tenancy arrangements can stall financed closings by weeks. We do not have loan documents.</p>

      <p><strong>The Sponsor Approval Problem.</strong> Lenders increasingly scrutinize sponsor net worth, liquidity, experience, and track record. Funds that have had any issues with prior loans face elevated scrutiny. Family offices and 1031-exchange buyers who have not borrowed before face full underwriting. None of this applies to OneCashOffer transactions.</p>

      <p><strong>Why We Operate This Way.</strong> Our capital is committed equity from our principal partners plus accredited-investor co-investment vehicles. We treat all-cash closing as a competitive advantage we can productize. Sellers tell us repeatedly that our certainty-to-close is worth a measurable cap-rate concession - we have closed ${loc.label} deals where the seller chose us over a higher financed-buyer offer specifically because the financed buyer was higher-risk to actually close.</p>`
  };
}

export function creBlock1031AndTaxStrategy(loc) {
  return {
    h2: `1031 Exchange and Tax Strategy for ${loc.label} CRE Sellers`,
    html: `<p>Selling a ${loc.assetLabel} property in ${loc.label} for cash typically triggers substantial federal capital gains tax, state tax (if applicable), and depreciation recapture. Understanding the tax implications and strategies available before signing a purchase and sale agreement is critical. OneCashOffer Capital Group structures transactions to accommodate seller tax strategy when needed.</p>

      <p><strong>Federal Capital Gains.</strong> Long-term capital gains on CRE held more than 12 months are taxed at 0%, 15%, or 20% depending on income bracket. The 3.8% Net Investment Income Tax may also apply for higher-income sellers. For most institutional CRE sellers, the all-in federal capital gains rate is 23.8%.</p>

      <p><strong>Depreciation Recapture (the Big One).</strong> If you have owned the ${loc.label} property for years and taken accelerated depreciation (especially cost-segregation studies that segregated bonus-depreciable components), you owe depreciation recapture tax at a maximum 25% federal rate on the depreciation taken. On a ${loc.assetLabel} property held 10-15 years with cost segregation, depreciation recapture often exceeds capital gains in magnitude. This is the cash drain sellers most often underestimate.</p>

      <p><strong>${loc.stateName} State Tax Treatment.</strong> ${loc.stateName} treats CRE capital gains and depreciation recapture under state-specific rules. States with no income tax (Florida, Texas, Nevada, Washington, Tennessee, Wyoming, South Dakota, New Hampshire, Alaska) impose no state-level burden. California, New York, New Jersey, Hawaii, and Oregon impose substantial state CRE capital gains taxes (often 8-13% on top of federal).</p>

      <p><strong>IRC Section 1031 Like-Kind Exchange.</strong> The most powerful tool for CRE sellers is the 1031 exchange. You defer 100% of capital gains and depreciation recapture by reinvesting net proceeds into "like-kind" replacement CRE within 180 days (with a 45-day identification window). Replacement property must be equal or greater in value, equal or greater in equity, and equal or greater in debt (or all-cash). OneCashOffer Capital Group structures transactions to accommodate seller 1031 exchanges - our flexible closing windows align with seller-side Qualified Intermediary timelines.</p>

      <p><strong>Opportunity Zone Investments.</strong> For sellers willing to redeploy capital into Qualified Opportunity Zones, the 1031 exchange alternative is the Opportunity Zone tax deferral. You can defer capital gains until 2026 (current law) and potentially eliminate gains on the new OZ investment if held 10+ years. The 1031 exchange is generally more flexible for like-kind CRE; OZ investments are better for sellers wanting to exit the CRE asset class entirely.</p>

      <p><strong>Installment Sale (Section 453).</strong> For some ${loc.label} CRE sales, a seller-financed installment sale allows the seller to spread capital gains tax over multiple tax years. This can reduce overall tax burden by avoiding the highest bracket in a single year. OneCashOffer occasionally offers installment-sale structures for the right asset and counterparty.</p>

      <p><strong>Drop-and-Swap Partnership Transactions.</strong> Multi-member LLC and partnership sellers can pre-distribute property to individual members before sale, allowing each member to do their own 1031 exchange. This requires planning in advance (typically 12 months) with tax counsel.</p>

      <p><strong>Charitable Remainder Trust (CRT).</strong> For sellers with significant capital gains who want to support charity while reducing tax burden, a CRT allows you to deed the property to the trust, sell tax-free inside the trust, and receive lifetime income while benefiting charity at death.</p>

      <p>OneCashOffer Capital Group is not a tax advisor. Every CRE seller in ${loc.label} should consult a qualified CPA and tax attorney before executing a purchase and sale agreement to structure the transaction optimally. We work flexibly with seller-side tax counsel to ensure our timeline supports your tax strategy.</p>`
  };
}

export function creBlockDueDiligenceProcess(loc) {
  return {
    h2: `OneCashOffer Capital Group Due Diligence Process for ${loc.label} ${loc.assetLabel}`,
    html: `<p>Our due diligence process is comprehensive but predictable. Sellers know exactly what we will request, what we will inspect, and what could change our offer. We complete due diligence in 15-30 days for typical ${loc.assetLabel} transactions in ${loc.label}, faster than most institutional buyers.</p>

      <p><strong>Property Condition Assessment (PCA).</strong> A licensed third-party engineering firm performs a Property Condition Assessment of the ${loc.label} property. They inspect the roof, building envelope, structural components, HVAC, electrical, plumbing, life safety, vertical transportation (elevators), parking, paving, and ADA compliance. The PCA produces a 12-year capital expenditure projection that we use to refine our acquisition pricing. We pay for the PCA.</p>

      <p><strong>Phase I Environmental Site Assessment (ESA).</strong> A licensed environmental professional conducts a Phase I ESA under ASTM E1527-21 standards. The Phase I reviews historical land use, regulatory database searches (state and federal), site reconnaissance, and personnel interviews to identify any Recognized Environmental Conditions (RECs). If RECs are found, we may proceed to Phase II (sampling and testing). We pay for the Phase I.</p>

      <p><strong>Title Commitment Review.</strong> The title company issues a title commitment showing the proposed insured estate. We review it for unrecorded interests, easements, restrictive covenants, mineral and oil/gas rights, mechanic's liens, judgments, and any title curative work needed. Title insurance is paid by OneCashOffer.</p>

      <p><strong>Survey (ALTA/NSPS Land Title Survey).</strong> We obtain a current ALTA/NSPS Land Title Survey showing all improvements, easements, encroachments, setbacks, and access points. The survey resolves any boundary or encroachment questions before closing.</p>

      <p><strong>Rent Roll Certification and Tenant Estoppels.</strong> For income-producing ${loc.assetLabel}, we certify the rent roll by reviewing each lease against the rent roll line, tenant payment history, and current account status. We then obtain estoppel certificates from material tenants (typically tenants paying more than 5% of gross income, or all tenants for properties with fewer than 10) confirming lease terms, rent amounts, security deposits, defaults if any, and unfulfilled landlord obligations.</p>

      <p><strong>Financial Due Diligence.</strong> We review the trailing-twelve-month and trailing-twenty-four-month financial statements, current year-to-date performance, prior calendar year tax returns, property tax bills, insurance binders, utility records, and any vendor service contracts that will survive closing. Discrepancies between rent roll and bank deposits, or between reported income and tax-return income, are flagged.</p>

      <p><strong>Operational Due Diligence.</strong> We review the property's operating systems (property management software, accounting platform), key personnel and vendor relationships, marketing materials, and competitive set analysis. For multifamily, we tour several units. For retail and office, we tour vacant suites and review tenant improvement contractor records.</p>

      <p><strong>Insurance Due Diligence.</strong> We obtain insurance quotes for our post-closing coverage. ${loc.stateName} property in coastal, wildfire, or other catastrophe-prone areas can have surprising insurance pricing that affects our underwriting. This is built into our due diligence.</p>

      <p><strong>Code, Zoning, and Compliance Review.</strong> We confirm the ${loc.label} property complies with current zoning and verify any conditional uses, variances, or grandfather rights. We check building department records for open permits, code violations, or pending enforcement actions.</p>

      <p><strong>Real Estate Tax Review.</strong> We review historical ${loc.county} County property tax bills, any pending reassessment notices, and protest filings. Acquisition-triggered reassessment is factored into our forward NOI projections.</p>`
  };
}

export function creBlockAssetClassMarket(loc) {
  const drivers = loc.assetDrivers || 'asset performance, occupancy stability, and market fundamentals';
  const risks = loc.assetRisks || 'standard CRE market risks';
  const valueAdd = loc.assetValueAdd || 'standard value-add strategies';
  return {
    h2: `${loc.assetLabel} Market Dynamics in ${loc.label} and Broader ${loc.stateName}`,
    html: `<p>${loc.assetLabel} performance in ${loc.label} is driven by ${drivers}. Understanding the current cycle position of ${loc.assetLabel} in ${loc.stateName} helps us provide accurate cap-rate-based pricing.</p>

      <p><strong>Current Market Position.</strong> The broader ${loc.stateName} ${loc.short || loc.assetClassShort || 'commercial'} market has experienced significant volatility over the past 36 months. Cap rates expanded materially from the 2021 trough as interest rates rose, then began stabilizing as institutional capital reaccumulated. Transaction volume in ${loc.assetLabel} remains below 2019 baseline but is gradually recovering. We continue acquiring throughout the cycle - in fact, the current environment favors well-capitalized cash buyers like OneCashOffer over levered buyers competing for the same assets.</p>

      <p><strong>Submarket Fundamentals in ${loc.label}.</strong> ${loc.label} sits within a broader ${loc.county} County submarket that has its own supply-demand dynamics. We monitor submarket vacancy, asking rents, concession packages, recent transactions, planned development pipeline, and demographic shifts. Our cap-rate determination for your specific ${loc.assetLabel} property factors in the submarket position, not just national averages.</p>

      <p><strong>Cap Rate Range for ${loc.assetLabel} in ${loc.label}.</strong> Current market cap rates for stabilized ${loc.assetLabel} in ${loc.label} typically range from <strong>${loc.typicalCap}</strong>, depending on credit quality of tenants, weighted average lease term (WALT), physical condition, location quality, and trade area demographics. Value-add or repositioning opportunities transact at higher cap rates (lower valuations) reflecting the work required to stabilize the asset.</p>

      <p><strong>Comparable Transactions.</strong> We pull recent comparable ${loc.assetLabel} transactions from CoStar, Real Capital Analytics, and ${loc.county} County recorder records over the prior 24 months. We weight comparables by asset class similarity, deal size, market position, and time-since-sale. Each comparable's price-per-unit or price-per-foot is normalized to current conditions before being applied to your asset.</p>

      <p><strong>Key Risks We Underwrite.</strong> For ${loc.label} ${loc.assetLabel} we specifically underwrite ${risks}. Each of these factors moves our offer price up or down within the typical cap rate range.</p>

      <p><strong>Value-Add Potential.</strong> Where applicable, we identify value-add potential including ${valueAdd}. Properties with clear value-add paths sometimes receive higher offers because we can underwrite to a higher exit cap rate after the work is completed.</p>

      <p><strong>Capital Market Context.</strong> Despite headlines about CRE distress, well-located ${loc.assetLabel} in ${loc.stateName} continues to transact. Institutional capital remains active. The 10-year Treasury yield, the BBB corporate bond spread, and bank/CMBS lending appetite all factor into where cap rates settle. We track these signals weekly and adjust our pricing model in real time.</p>`
  };
}

export function creBlockSpecialSituations(loc) {
  return {
    h2: `Special Situations We Acquire: Distressed, Off-Market, and Time-Sensitive ${loc.assetLabel} in ${loc.label}`,
    html: `<p>OneCashOffer Capital Group specializes in CRE situations where speed, certainty, and discretion matter more than chasing maximum gross price. Here are the seller situations where we deliver the most value.</p>

      <p><strong>Pre-Foreclosure and Distressed CRE.</strong> Borrowers facing loan maturity walls (especially CMBS borrowers with looming balloons), default notices, or near-term workout situations need fast, certain capital. We can underwrite, sign a binding purchase and sale agreement, and close in 30-45 days when a financed buyer would still be in lender pre-qualification. We have closed numerous ${loc.assetLabel} transactions where the seller was 60 days from loan maturity and a financed buyer had pulled out of escrow.</p>

      <p><strong>Bank REO and Special Servicer Asset Dispositions.</strong> Lenders holding REO ${loc.assetLabel} assets in ${loc.label} need to liquidate fast to clear their balance sheet. Special servicers managing CMBS workouts need to dispose of property to resolve borrower defaults. OneCashOffer Capital Group has established relationships with major REO desks and special servicers nationally. We close on bank and special-servicer dispositions on highly compressed timelines.</p>

      <p><strong>Off-Market Transactions.</strong> Many institutional sellers in ${loc.label} prefer to sell discreetly without going through CoStar, LoopNet, broker e-blast, or a formal marketing process. Reasons include: avoiding tenant disruption, preventing competitor knowledge of repositioning, family-office privacy preferences, partnership dissolution sensitivity, and lender or LP relationship considerations. OneCashOffer Capital Group routinely acquires off-market - we never disclose seller identity, never publicize transactions, and structure non-disclosure provisions into our LOIs.</p>

      <p><strong>Portfolio Acquisitions.</strong> Institutional sellers liquidating multi-asset portfolios in ${loc.stateName} (or nationally) need a buyer who can absorb 5, 10, 50 assets in a single transaction. We have completed portfolio acquisitions ranging from $50M to $250M+ in aggregate value. Portfolio deals get blended pricing - we may pay slightly below trended individual values in exchange for committing to the entire bundle, then disposing of any assets that do not fit our hold strategy after closing.</p>

      <p><strong>1031 Exchange Down-Leg Liquidity for Other Sellers.</strong> When another seller in ${loc.label} needs to identify replacement property within 45 days and close within 180 days, OneCashOffer Capital Group can provide reverse-1031 structures, accommodation closings, and rapid-close commitments to enable other sellers' 1031 exchanges.</p>

      <p><strong>Estate and Probate Dispositions.</strong> Decedent estates holding ${loc.assetLabel} in ${loc.label} face complex executor obligations and tax-clock pressure. We close quickly through ${loc.stateName} probate process when needed.</p>

      <p><strong>Partnership Buy-Outs and Dissolution.</strong> When multi-partner LLCs holding ${loc.label} CRE need to dissolve - whether amicably or contentiously - OneCashOffer Capital Group can structure transactions that work for all parties. We have closed buy-outs where one partner stayed in the deal and we replaced the exiting partner with equity.</p>

      <p><strong>Vacancy and Lease-Up Situations.</strong> When a ${loc.assetLabel} property has lost its anchor, major tenant, or significant occupancy, traditional buyers wait for stabilization before committing capital. OneCashOffer Capital Group underwrites the vacant-to-stabilized path and pays for the asset at a price that reflects the work required, not the empty current state.</p>

      <p><strong>Capital Expenditure-Burdened Properties.</strong> ${loc.assetLabel} with deferred capex (roof replacement, parking re-paving, system upgrades, code compliance) often cannot be sold to traditional buyers without expensive pre-sale work. We underwrite the capex as part of our acquisition and handle execution after closing.</p>

      <p><strong>Environmental Risk Properties.</strong> Properties with Phase I or Phase II environmental findings - common in older industrial sites, former gas stations, and properties adjacent to historic contamination - are difficult for financed buyers and often pulled from listing. OneCashOffer Capital Group acquires these with full environmental coverage in place.</p>`
  };
}

export function creBlockLOIToClose(loc) {
  return {
    h2: `From LOI to Closing: ${loc.label} ${loc.assetLabel} Transaction Timeline`,
    html: `<p>From initial property submission to closing, OneCashOffer Capital Group runs a predictable transaction process for ${loc.label} ${loc.assetLabel} sellers. Here is the typical 60-90 day timeline broken into phases.</p>

      <p><strong>Days 1-3: Inquiry, Confidentiality, and Property Package.</strong> Seller submits initial information (asset class, location, basic financials). We sign a mutual NDA. Seller provides the property package: rent roll, T-12, prior calendar year operating statement, tax bills, insurance binder, current property tax assessment, deferred maintenance list, and any prior environmental or engineering reports.</p>

      <p><strong>Days 3-7: Initial Underwriting.</strong> Our acquisitions team builds a financial model using the seller-provided property package, augmented with market data from CoStar, ${loc.county} County recorder records, and ${loc.stateName} comparable transactions. We calculate stabilized NOI, apply market cap rate, deduct projected capex, and arrive at an initial offer range.</p>

      <p><strong>Days 7-10: LOI Issued.</strong> We deliver a written letter of intent (LOI) showing offer price, deal structure, deposit amount, due diligence period length, closing timeline, and any material conditions. The LOI is typically non-binding except for confidentiality and exclusivity provisions during negotiation.</p>

      <p><strong>Days 10-21: LOI Negotiation.</strong> Most LOIs go through 1-3 rounds of negotiation. Sellers push back on price, terms, due diligence length, and conditions. We are typically flexible on terms in exchange for clarity on price. We sometimes increase initial offers when seller provides additional data justifying the higher number.</p>

      <p><strong>Days 21-30: Purchase and Sale Agreement (PSA) Negotiation.</strong> Once LOI is mutually agreed, our ${loc.stateName} commercial real estate attorney drafts the PSA. The PSA is the binding contract - typically 25-50 pages depending on asset complexity. PSA negotiation focuses on representations and warranties, indemnities, due diligence rights and remedies, closing conditions, default provisions, and post-closing obligations.</p>

      <p><strong>Days 30-50: Due Diligence Execution.</strong> Once PSA is signed, the formal due diligence period begins. We conduct PCA, Phase I (and Phase II if triggered), title commitment review, ALTA/NSPS survey, rent roll certification, tenant estoppels, financial diligence, code/zoning review, and tax review. The DD period is typically 30-45 days for ${loc.assetLabel} in ${loc.label}.</p>

      <p><strong>Days 50-55: Due Diligence Approval.</strong> We deliver written notice of DD approval (or any objections needing seller cure before closing). If material issues are uncovered, we may renegotiate price or terms. If issues are unresolvable, we may terminate per PSA terms (which is rare - we have a strong track record of closing what we sign).</p>

      <p><strong>Days 55-60: Pre-Closing.</strong> Title company prepares closing documents. We confirm wire instructions with seller. We make final payoff verifications with any existing lenders. Seller assembles tenant security deposit transfer instructions, vendor service contract assignment/termination notices, utility transfer requests, and post-closing operational handoff materials.</p>

      <p><strong>Day 60: Closing.</strong> We wire purchase funds 24-48 hours in advance to the ${loc.stateName} title company escrow account. Seller signs closing documents. Title transfers via recorded deed. Existing loan (if any) is paid off through escrow. Net proceeds wire to seller. Property management transitions to our team (or our designated third-party manager).</p>

      <p><strong>Post-Closing.</strong> We provide seller with all signed and recorded documents. We notify tenants of new ownership via formal lease assignment letters. We assume vendor contracts that survive closing and provide termination notice for those we are not assuming. We complete any post-closing prorations and any escrow holdback releases.</p>`
  };
}

export function creBlockCreditAndCovenants(loc) {
  return {
    h2: `Why Institutional ${loc.label} ${loc.assetLabel} Sellers Choose OneCashOffer Capital Group`,
    html: `<p>Sophisticated CRE sellers in ${loc.label} have many options. Brokers, listings, auctions, marketed processes, and direct calls from competing buyers all reach quality property owners. Why ${loc.assetLabel} sellers choose OneCashOffer Capital Group reduces to five factors.</p>

      <p><strong>Certainty of Close.</strong> The single most important criterion for institutional sellers is the certainty that the buyer will actually fund. In the current credit environment, financed buyers fail to close 12-18% of the time on signed PSAs. Each failed close costs the seller 4-6 weeks (re-marketing, re-negotiating), legal fees on the failed deal, and reputational signaling to other potential buyers. OneCashOffer Capital Group has a 98%+ close rate on signed PSAs in ${loc.label}. We sign deals we will close.</p>

      <p><strong>Speed.</strong> Our 30-60 day timeline from PSA to closing is 30-50% faster than typical institutional CRE transactions, where 90-120 day timelines are common with financed buyers. For sellers facing loan maturity, partnership dissolution, tax deadlines, or other time pressure, speed has measurable financial value.</p>

      <p><strong>Discretion.</strong> Many institutional sellers in ${loc.label} cannot afford public marketing. Tenant disruption, competitor intelligence, LP relationship implications, family-office privacy, and partnership sensitivities all argue for confidential transactions. OneCashOffer Capital Group never publicizes, never advertises completed transactions without seller consent, and structures NDAs into every LOI.</p>

      <p><strong>Flexibility on Property Condition.</strong> Most institutional CRE buyers acquire only stabilized assets. We acquire stabilized, value-add, distressed, and special situation assets in ${loc.label}. This means sellers do not need to spend 6-18 months stabilizing a property before sale. We pay a fair cap-rate-adjusted price for the current state.</p>

      <p><strong>Principal Buyer, No Brokerage.</strong> OneCashOffer Capital Group is a principal buyer using our own equity capital. We are not a brokerage, not a wholesaler, not a buyer's-agent representing a third party. There is no commission on our side of the transaction. Sellers retain whatever broker relationship they want on their side. This single distinction matters for partnership compliance, fiduciary documentation, and clean fee accounting.</p>

      <p><strong>References.</strong> We are happy to provide references from prior ${loc.assetLabel} sellers in ${loc.label} and other ${loc.stateName} markets. References include institutional sellers, family offices, brokers who represented sellers in our transactions, and title companies. Verify any of this before proceeding to PSA.</p>`
  };
}

export function creBlockComparisonToAlternatives(loc) {
  return {
    h2: `Cash Sale vs. Listed Marketing Process: Side-by-Side for ${loc.label} ${loc.assetLabel} Sellers`,
    html: `<p>The decision between selling to a direct cash buyer like OneCashOffer Capital Group and running a full marketed process through a CRE brokerage is a real strategic choice. Here is an honest side-by-side comparison for ${loc.label} ${loc.assetLabel} sellers.</p>

      <table class="market-table">
        <thead>
          <tr><th>Factor</th><th>OneCashOffer Cash Sale</th><th>Full Brokered Marketing Process</th></tr>
        </thead>
        <tbody>
          <tr><td>Timeline from Decision to Closing</td><td>30-60 days</td><td>120-240 days</td></tr>
          <tr><td>Brokerage Commission</td><td>$0 (no brokers)</td><td>1.5-3.0% of sale price</td></tr>
          <tr><td>Marketing Expense</td><td>$0</td><td>$25,000-$150,000 (OM, broker e-blasts, signage, listings)</td></tr>
          <tr><td>Number of Buyer Tours</td><td>1-3 (our team only)</td><td>10-50+ (broker, multiple buyers, their consultants)</td></tr>
          <tr><td>Risk of Failed Closing</td><td>2-5%</td><td>15-25% (financing falls through, retrade)</td></tr>
          <tr><td>Property Disruption</td><td>Minimal</td><td>Significant (tenant tours, environmental investigations, repeated inspections)</td></tr>
          <tr><td>Tenant Disruption</td><td>Low</td><td>Medium-High (tours, estoppels, lease audits)</td></tr>
          <tr><td>Confidentiality</td><td>High (NDA-based, no public marketing)</td><td>Low (OM circulation, CoStar listing, broker e-blasts)</td></tr>
          <tr><td>Price Discovery Above Cash Offer</td><td>Limited (one buyer)</td><td>Higher (multiple buyers competing)</td></tr>
          <tr><td>Closing Cost Coverage</td><td>OneCashOffer absorbs</td><td>Seller pays (1-2%)</td></tr>
          <tr><td>Best For</td><td>Speed, certainty, distressed, off-market, complex situations</td><td>Stabilized assets with broad buyer pool, no time pressure</td></tr>
        </tbody>
      </table>

      <p><strong>When the Marketed Process Wins.</strong> If your ${loc.label} ${loc.assetLabel} is stabilized, in excellent condition, and there is no time pressure, a competitive marketed process can extract maximum price - sometimes 5-10% higher than direct cash. The downside is 4-8 months of process, brokerage costs, disruption, and 15-25% probability of failed closing.</p>

      <p><strong>When OneCashOffer Wins.</strong> If your asset is distressed, off-market, time-sensitive, vacant or partially vacant, capex-burdened, environmental, or simply needs to close fast, we deliver materially better net economics after accounting for commissions, carry, and failed-close risk. We also handle complex situations brokers and other buyers refuse.</p>

      <p><strong>Hybrid Approach.</strong> Some sellers use OneCashOffer Capital Group as a price floor before launching a marketed process. We give a written cash offer, you use it as a baseline, then market with a broker. If the marketed process produces materially higher offers, you sell that way. If it does not (or fails), our offer remains available. We do not require exclusivity during LOI evaluation.</p>`
  };
}

// Aggregator that picks N CRE blocks for a given commercial page.
export function pickCommercialContent(loc, count = 8) {
  const order = [
    creBlockUnderwritingDeepDive,
    creBlockAssetClassMarket,
    creBlockCapStackAndFunding,
    creBlock1031AndTaxStrategy,
    creBlockDueDiligenceProcess,
    creBlockSpecialSituations,
    creBlockLOIToClose,
    creBlockCreditAndCovenants,
    creBlockComparisonToAlternatives
  ];
  const blocks = order.slice(0, count);
  return blocks.map(fn => fn(loc));
}
