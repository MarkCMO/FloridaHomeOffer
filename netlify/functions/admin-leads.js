const { createClient } = require('@supabase/supabase-js');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  // Simple token-based auth for the admin page
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'ADMIN_TOKEN not configured' })
    };
  }

  const providedToken = event.headers['x-admin-token'] || event.headers['X-Admin-Token'] ||
    (event.queryStringParameters && event.queryStringParameters.token);

  if (providedToken !== adminToken) {
    return {
      statusCode: 401,
      headers: CORS,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    if (event.httpMethod === 'POST') {
      // Update lead status
      const body = JSON.parse(event.body || '{}');
      if (!body.id || !body.status) {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'id and status required' }) };
      }
      const { error } = await supabase
        .from('leads')
        .update({ status: body.status, updated_at: new Date().toISOString() })
        .eq('id', body.id);
      if (error) {
        return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: error.message }) };
      }
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ success: true }) };
    }

    // GET - list leads
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);

    if (error) {
      return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: error.message }) };
    }

    // Stats
    const stats = {
      total: data.length,
      new: data.filter(l => l.status === 'new').length,
      contacted: data.filter(l => l.status === 'contacted').length,
      qualified: data.filter(l => l.status === 'qualified').length,
      closed: data.filter(l => l.status === 'closed').length,
      last_24h: data.filter(l => new Date(l.created_at) > new Date(Date.now() - 24*60*60*1000)).length,
      last_7d: data.filter(l => new Date(l.created_at) > new Date(Date.now() - 7*24*60*60*1000)).length,
    };

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ leads: data, stats })
    };

  } catch (err) {
    console.error('Admin leads error:', err);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'Server error: ' + err.message })
    };
  }
};
