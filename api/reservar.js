// Vercel serverless function — POST /api/reservar
// Guarda en Supabase + notifica via Make.com (WhatsApp + email)

const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/1dp239il1a303f1urlm877fw1q8ob8b4';
const SUPABASE_URL = 'https://nbcmyfzjylydhvngtalc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iY215ZnpqeWx5ZGh2bmd0YWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExOTI1ODYsImV4cCI6MjA5Njc2ODU4Nn0.iqOrYszYHPfbyjcUs2dVGz_EGRL7LffTWbWErATVSJo';

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

    // 2. Notificar al restaurante via Make.com (email + WhatsApp Twilio)
    await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, date, time, guests, comments })
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error en /api/reservar:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
