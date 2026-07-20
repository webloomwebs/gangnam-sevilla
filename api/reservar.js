// Vercel serverless function — POST /api/reservar
// Guarda en Supabase + notifica: email al cliente via Resend + WhatsApp al restaurante via Meta Cloud API

const SUPABASE_URL = 'https://nbcmyfzjylydhvngtalc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iY215ZnpqeWx5ZGh2bmd0YWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExOTI1ODYsImV4cCI6MjA5Njc2ODU4Nn0.iqOrYszYHPfbyjcUs2dVGz_EGRL7LffTWbWErATVSJo';

async function sendConfirmationEmail({ name, email, date, time, guests, comments }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[Email] Falta RESEND_API_KEY');
    return;
  }

  const comentariosLinea = comments && comments.trim() ? `\n\nNos comentas: ${comments}` : '';

  const text = `Hola ${name},

Tu reserva en Gangnam Sevilla está confirmada para el ${date} a las ${time} (${guests} personas).${comentariosLinea}

Si necesitas cambiar algo, contesta a este correo y te ayudamos.

Un saludo,
Gangnam Sevilla`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 15px; color: #1a1a1a; line-height: 1.6;">
      <p>Hola ${name},</p>
      <p>Tu reserva en Gangnam Sevilla está confirmada para el <strong>${date} a las ${time}</strong> (${guests} personas).${comments && comments.trim() ? `<br>Nos comentas: ${comments}` : ''}</p>
      <p>Si necesitas cambiar algo, contesta a este correo y te ayudamos.</p>
      <p>Un saludo,<br>Gangnam Sevilla</p>
    </div>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Gangnam Sevilla <reservas@gangnam.es>',
      reply_to: 'oriolarang@gmail.com',
      to: [email],
      text,
      subject: `Reserva confirmada — ${date} a las ${time}`,
      html,
    }),
  });

  const data = await response.json();
  if (data.error || !response.ok) {
    console.error('[Email] Error enviando confirmación a', email, data.error || data);
  }
}

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

    // 2. Email de confirmación al cliente via Resend (antes: Make.com)
    await sendConfirmationEmail({ name, email, date, time, guests, comments });

    // 3. Aviso de WhatsApp al restaurante via Meta Cloud API
    await notifyRestaurantWhatsApp({ name, date, time, guests, phone, comments });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error en /api/reservar:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
