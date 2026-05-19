// Cloudflare Pages Function - Admin Leads Dashboard API
// GET  /api/admin-leads        - list leads + stats
// POST /api/admin-leads        - update lead status
import { createClient } from '@supabase/supabase-js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), { status, headers: CORS });
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (request.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: CORS });
  }

  const adminToken = env.ADMIN_TOKEN;
  if (!adminToken) {
    return jsonResponse(500, { error: 'ADMIN_TOKEN not configured' });
  }

  const providedToken = request.headers.get('x-admin-token') || url.searchParams.get('token');
  if (providedToken !== adminToken) {
    return jsonResponse(401, { error: 'Unauthorized' });
  }

  try {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

    if (request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch { return jsonResponse(400, { error: 'Invalid JSON' }); }
      if (!body.id || !body.status) {
        return jsonResponse(400, { error: 'id and status required' });
      }
      const { error } = await supabase
        .from('leads')
        .update({ status: body.status, updated_at: new Date().toISOString() })
        .eq('id', body.id);
      if (error) return jsonResponse(500, { error: error.message });
      return jsonResponse(200, { success: true });
    }

    // GET - list leads
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);

    if (error) return jsonResponse(500, { error: error.message });

    const now = Date.now();
    const stats = {
      total: data.length,
      new: data.filter(l => l.status === 'new').length,
      contacted: data.filter(l => l.status === 'contacted').length,
      qualified: data.filter(l => l.status === 'qualified').length,
      closed: data.filter(l => l.status === 'closed').length,
      last_24h: data.filter(l => new Date(l.created_at).getTime() > now - 24*60*60*1000).length,
      last_7d: data.filter(l => new Date(l.created_at).getTime() > now - 7*24*60*60*1000).length,
    };

    return jsonResponse(200, { leads: data, stats });
  } catch (err) {
    console.error('Admin leads error:', err);
    return jsonResponse(500, { error: 'Server error: ' + err.message });
  }
}
