const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const data = JSON.parse(event.body || '{}');

    // Validate required fields
    if (!data.name || !data.phone || !data.email) {
      return {
        statusCode: 400,
        headers: CORS,
        body: JSON.stringify({ error: 'Name, phone, and email are required' })
      };
    }

    // Sanitize
    const lead = {
      name: String(data.name).trim().slice(0, 200),
      phone: String(data.phone).replace(/[^\d()\-\s+]/g, '').trim().slice(0, 20),
      email: String(data.email).toLowerCase().trim().slice(0, 200),
      address: data.address ? String(data.address).trim().slice(0, 500) : null,
      city: data.city ? String(data.city).trim().slice(0, 100) : null,
      state: 'FL',
      property_condition: data.property_condition ? String(data.property_condition).trim() : null,
      timeframe: data.timeframe ? String(data.timeframe).trim() : null,
      message: data.message ? String(data.message).trim().slice(0, 2000) : null,
      type: data.type === 'contact' ? 'contact' : 'lead',
      source_page: data.source_page ? String(data.source_page).trim().slice(0, 200) : null,
      utm_source: data.utm_source ? String(data.utm_source).trim().slice(0, 100) : null,
      utm_medium: data.utm_medium ? String(data.utm_medium).trim().slice(0, 100) : null,
      utm_campaign: data.utm_campaign ? String(data.utm_campaign).trim().slice(0, 200) : null,
      landing_page: data.landing_page ? String(data.landing_page).trim().slice(0, 500) : null,
      referrer: data.referrer ? String(data.referrer).trim().slice(0, 500) : null,
      status: 'new'
    };

    // Write to Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    const { error: dbError } = await supabase
      .from('leads')
      .insert([lead]);

    if (dbError) {
      console.error('Supabase insert error:', dbError);
    }

    // Send confirmation email to lead
    const resend = new Resend(process.env.RESEND_API_KEY);
    const siteUrl = process.env.SITE_URL || 'https://floridahomeoffer.com';

    try {
      await resend.emails.send({
        from: 'FloridaHomeOffer <noreply@' + new URL(siteUrl).hostname + '>',
        to: lead.email,
        subject: 'We Received Your Property Info - Cash Offer Coming',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0B1120;color:#E0E4EC;padding:40px;border-radius:8px;">
            <div style="text-align:center;margin-bottom:24px;">
              <h1 style="color:#C8A84E;font-size:28px;margin:0;">FloridaHomeOffer</h1>
            </div>
            <h2 style="color:#fff;font-size:22px;">Hi ${lead.name},</h2>
            <p>Thank you for reaching out. We received your property information and our team is already reviewing it.</p>
            <p><strong style="color:#C8A84E;">What happens next:</strong></p>
            <ol style="padding-left:20px;">
              <li>Our team analyzes your property and local market data</li>
              <li>We prepare a fair, written cash offer</li>
              <li>You will hear from us within 24 hours</li>
            </ol>
            <p>Your offer will be 100% no-obligation. No pressure, no commitment - just a fair number backed by real market data.</p>
            <p style="margin-top:24px;">Need to talk sooner? Call us at <a href="tel:+13215550199" style="color:#C8A84E;">(321) 555-0199</a></p>
            <hr style="border:none;border-top:1px solid #1A2340;margin:24px 0;">
            <p style="font-size:12px;color:#6B7280;">FloridaHomeOffer - WETYR Corp<br>This email was sent because you submitted a property inquiry on our website.</p>
          </div>
        `
      });
    } catch (emailErr) {
      console.error('Lead confirmation email error:', emailErr);
    }

    // Send internal alert
    const alertEmail = process.env.LEAD_ALERT_EMAIL;
    if (alertEmail) {
      try {
        await resend.emails.send({
          from: 'FloridaHomeOffer Leads <noreply@' + new URL(siteUrl).hostname + '>',
          to: alertEmail,
          subject: `New ${lead.type === 'contact' ? 'Contact' : 'Lead'}: ${lead.name} - ${lead.city || 'No city'}`,
          html: `
            <div style="font-family:monospace;padding:20px;">
              <h2>New ${lead.type === 'contact' ? 'Contact Submission' : 'Property Lead'}</h2>
              <table style="border-collapse:collapse;width:100%;">
                <tr><td style="padding:6px;font-weight:bold;border-bottom:1px solid #ddd;">Name</td><td style="padding:6px;border-bottom:1px solid #ddd;">${lead.name}</td></tr>
                <tr><td style="padding:6px;font-weight:bold;border-bottom:1px solid #ddd;">Phone</td><td style="padding:6px;border-bottom:1px solid #ddd;"><a href="tel:${lead.phone}">${lead.phone}</a></td></tr>
                <tr><td style="padding:6px;font-weight:bold;border-bottom:1px solid #ddd;">Email</td><td style="padding:6px;border-bottom:1px solid #ddd;"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
                <tr><td style="padding:6px;font-weight:bold;border-bottom:1px solid #ddd;">Address</td><td style="padding:6px;border-bottom:1px solid #ddd;">${lead.address || '-'}</td></tr>
                <tr><td style="padding:6px;font-weight:bold;border-bottom:1px solid #ddd;">City</td><td style="padding:6px;border-bottom:1px solid #ddd;">${lead.city || '-'}</td></tr>
                <tr><td style="padding:6px;font-weight:bold;border-bottom:1px solid #ddd;">Condition</td><td style="padding:6px;border-bottom:1px solid #ddd;">${lead.property_condition || '-'}</td></tr>
                <tr><td style="padding:6px;font-weight:bold;border-bottom:1px solid #ddd;">Timeframe</td><td style="padding:6px;border-bottom:1px solid #ddd;">${lead.timeframe || '-'}</td></tr>
                <tr><td style="padding:6px;font-weight:bold;border-bottom:1px solid #ddd;">Message</td><td style="padding:6px;border-bottom:1px solid #ddd;">${lead.message || '-'}</td></tr>
                <tr><td style="padding:6px;font-weight:bold;border-bottom:1px solid #ddd;">Source Page</td><td style="padding:6px;border-bottom:1px solid #ddd;">${lead.source_page || '-'}</td></tr>
                <tr><td style="padding:6px;font-weight:bold;border-bottom:1px solid #ddd;">UTM Source</td><td style="padding:6px;border-bottom:1px solid #ddd;">${lead.utm_source || '-'}</td></tr>
                <tr><td style="padding:6px;font-weight:bold;border-bottom:1px solid #ddd;">Landing Page</td><td style="padding:6px;border-bottom:1px solid #ddd;">${lead.landing_page || '-'}</td></tr>
                <tr><td style="padding:6px;font-weight:bold;">Submitted</td><td style="padding:6px;">${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} EST</td></tr>
              </table>
            </div>
          `
        });
      } catch (alertErr) {
        console.error('Alert email error:', alertErr);
      }
    }

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    console.error('Lead capture error:', err);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};
