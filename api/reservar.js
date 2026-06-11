// Vercel serverless function — POST /api/reservar
// Guarda en Supabase + notifica via Make.com (WhatsApp + email)

const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/1dp239il1a303f1urlm877fw1q8ob8b4';
const SUPABASE_URL = 'https://mgenujgupjssevfqipfi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nZW51amd1cGpzc2V2ZnFpcGZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMDM4MTksImV4cCI6MjA5NDg3OTgxOX0.R9fGvRKIUW7DHDGh4hsDawBMYzjgbU2DuAG81pnWID8';

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
    await fetch(`${SUPABASE_URL}/rest/v1/gangnam_reservations`, {
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
