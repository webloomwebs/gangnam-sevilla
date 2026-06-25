// Vercel serverless function — POST /api/reservar
// Guarda en Supabase + notifica: email al cliente via Make.com + WhatsApp al restaurante via Meta Cloud API

const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/1dp239il1a303f1urlm877fw1q8ob8b4';
const SUPABASE_URL = 'https://nbcmyfzjylydhvngtalc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iY215ZnpqeWx5ZGh2bmd0YWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExOTI1ODYsImV4cCI6MjA5Njc2ODU4Nn0.iqOrYszYHPfbyjcUs2dVGz_EGRL7LffTWbWErATVSJo';

async function notifyRestaurantWhatsApp({ name, date, time, guests, phone, comments }) {
  const token = process.env.WA_API_TOKEN;
  const phoneNumberId = process.env.WA_PHONE_NUMBER_ID;
  const recipients = (process.env.WA_RESTAURANT_NUMBERS || '')
    .split(',')
    .map((n) => n.trim())
    .filter(Boolean);

  if (!token || !phoneNumberId || recipients.length === 0) {
    console.error('[WA] Faltan WA_API_TOKEN, WA_PHONE_NUMBER_ID o WA_RESTAURANT_NUMBERS');
    return;
  }

  const components = [{
    type: 'body',
    parameters: [
      { type: 'text', text: name },
      { type: 'text', text: date },
      { type: 'text', text: time },
      { type: 'text', text: String(guests) },
      { type: 'text', text: phone },
      { type: 'text', text: comments && comments.trim() ? comments : 'Sin comentarios' },
    ],
  }];

  await Promise.all(recipients.map(async (to) => {
    const response = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to.replace(/\D/g, ''),
        type: 'template',
        template: {
          name: 'aviso_nueva_reserva_gangnam',
          language: { code: 'es' },
          components,
        },
      }),
    });

    const data = await response.json();
    if (data.error) {
      console.error('[WA] Error enviando a', to, data.error);
    }
  }));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, date, time, guests, comments } = req.body;

  if (!name || !email || !phone || !date || !time || !guests) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    // 1. Guardar reserva en Supabase
    await fetch(`${SUPABASE_URL}/rest/v1/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ name, email, phone, date, time, guests, comments, status: 'confirmed' })
    });

    // 2. Email de confirmación al cliente via Make.com
    await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, date, time, guests, comments })
    });

    // 3. Aviso de WhatsApp al restaurante via Meta Cloud API (sustituye al Twilio de Make.com)
    await notifyRestaurantWhatsApp({ name, date, time, guests, phone, comments });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error en /api/reservar:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
