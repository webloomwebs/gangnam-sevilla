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

C. San Felipe, 11, Casco Antiguo, 41003, Sevilla
Tel: +34 645 80 57 58

Si necesitas cambiar algo, contesta a este correo o llámanos.

Un saludo,
Gangnam Sevilla
https://gangnam.es`;

  const html = `
    <div style="max-width: 480px; margin: 0 auto; padding: 48px 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; text-align: center; color: #1a1a1a;">
      <h1 style="font-size: 34px; font-weight: 300; letter-spacing: 9px; color: #FF9A8B; margin: 0 0 6px;">GANGNAM</h1>
      <p style="font-size: 11px; letter-spacing: 2px; color: #999; text-transform: uppercase; margin: 0 0 44px;">Reserva confirmada</p>
      <p style="font-size: 15px; color: #444; margin: 0 0 20px;">Hola ${name}, te esperamos el</p>
      <p style="font-size: 24px; font-weight: 600; margin: 0 0 4px;">${date}</p>
      <p style="font-size: 15px; color: #777; margin: 0 0 36px;">a las ${time} &middot; ${guests} personas</p>
      ${comments && comments.trim() ? `<p style="font-size: 14px; color: #777; margin: 0 0 36px;">${comments}</p>` : ''}
      <p style="font-size: 13px; color: #aaa; margin: 0 0 32px;">Si necesitas cambiar algo, responde a este correo o llámanos al <a href="tel:+34645805758" style="color: #777;">+34 645 80 57 58</a>.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 0 0 24px;">
      <p style="font-size: 12px; color: #aaa; line-height: 1.6; margin: 0;">
        Gangnam Sevilla · C. San Felipe, 11, Casco Antiguo, 41003, Sevilla<br>
        <a href="https://gangnam.es" style="color: #aaa;">gangnam.es</a> &middot;
        <a href="https://gangnam.es/PoliticaPrivacidad" style="color: #aaa;">Privacidad</a> &middot;
        <a href="https://gangnam.es/AvisoLegal" style="color: #aaa;">Aviso legal</a>
      </p>
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
      reply_to: 'gangnam.sevilla@gmail.com',
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
