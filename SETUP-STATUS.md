# FloridaHomeOffer - Setup & Operations Status

## LIVE PRODUCTION URLS
- **Site:** https://florida-home-offer.netlify.app
- **Admin Dashboard:** https://florida-home-offer.netlify.app/admin
- **GitHub:** https://github.com/MarkCMO/FloridaHomeOffer

## ADMIN TOKEN (KEEP PRIVATE)
```
45b7da2cace3b5aa8005274112366863484b117748b31dd9
```
Use this to log into /admin to view leads.

## SYSTEM STATUS (verified working)

### Customer-facing
- [x] All 364 pages load (HTTP 200 verified on cities, counties, states, guides, situations, case studies, blog, calculator, market report)
- [x] Lead capture form on every page works
- [x] Lead form posts to /api/lead-capture and shows success
- [x] Lead saves to Supabase `leads` table
- [x] Sitemap (360 URLs) accessible at /sitemap.xml
- [x] Robots.txt accessible at /robots.txt
- [x] llms.txt accessible at /llms.txt
- [x] Google Search Console verification meta tag in place

### Internal/Admin
- [x] /admin page loads
- [x] Admin token auth works (401 without, 200 with)
- [x] Admin can view all leads with stats
- [x] Admin can filter by status
- [x] Internal alert email fires when lead submitted (sent to LEAD_ALERT_EMAIL)

## ONE-TIME MANUAL STEPS REMAINING

### 1. Add UPDATE policy to Supabase (30 seconds)
Open https://supabase.com/dashboard/project/vewfhspypnbpbfzhupin/sql > New Query > paste:
```sql
CREATE POLICY "Allow updates" ON leads FOR UPDATE USING (true);
```
Without this, the admin dashboard "change status" dropdown silently fails. Lead capture and viewing work fine without it.

### 2. (Optional) Verify a domain in Resend for visitor confirmation emails
Currently the visitor confirmation email uses `onboarding@resend.dev` which only works in Resend test mode (delivers only to your Resend account email). To send confirmation emails to actual visitors:
- Go to https://resend.com/domains
- Verify a domain (e.g. floridahomeoffer.com when you buy it)
- Update Netlify env var `RESEND_FROM` to use that domain (e.g. `FloridaHomeOffer <noreply@floridahomeoffer.com>`)

The internal alert email to LEAD_ALERT_EMAIL works fine right now because that email is your own.

## DEPLOY COMMAND
```bash
cd "C:/Users/13219/Desktop/FloridaHomeOffer"
node build-cities.js
git add -A && git commit -m "your message" && git push
netlify deploy --prod --dir=. --site 203ce21f-373a-42aa-960d-c89d277708d1
```

## ENV VARS (already set on Netlify)
- SUPABASE_URL
- SUPABASE_SERVICE_KEY (currently anon key - works for the policies in place)
- RESEND_API_KEY
- LEAD_ALERT_EMAIL = marklouisgabriellijr@gmail.com
- SITE_URL = https://florida-home-offer.netlify.app
- ADMIN_TOKEN = 45b7da2cace3b5aa8005274112366863484b117748b31dd9
- RESEND_FROM = FloridaHomeOffer <onboarding@resend.dev>
- RESEND_FROM_INTERNAL = FloridaHomeOffer Leads <onboarding@resend.dev>

## SEO CHECKLIST
- [x] Canonical URLs sitewide (all 364 pages)
- [x] Sitemap with 360 URLs
- [x] Robots.txt allowing all bots + LLM bots
- [x] llms.txt for AI crawlers
- [x] Schema markup (JSON-LD) via schema.js
- [x] Open Graph + Twitter Card tags via main.js
- [x] Geo meta tags via main.js
- [x] Google Search Console verification tag
- [ ] Submit sitemap in GSC (manual - go to search.google.com/search-console)
- [ ] Submit sitemap in Bing Webmaster Tools (manual)
- [ ] Buy custom domain (improves rankings)
- [ ] Get Google Business Profile (improves local SEO)

## PAGE COUNT (366 total)
- 12 core pages
- 2 tools (calculator, estimator)
- 1 market report
- 123 city pages
- 68 county pages
- 41 neighborhood pages
- 51 state pages
- 13 guide pages
- 16 situation pages
- 9 case studies
- 25 blog pages
- 1 admin page
- + 4 templates (excluded from sitemap)
