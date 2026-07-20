// Vercel serverless function — GET/POST /api/crons/review-request
// Disparado por GitHub Actions cada hora. Manda el email de valoración 3h despues de la hora de la reserva.

const SUPABASE_URL = 'https://nbcmyfzjylydhvngtalc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iY215ZnpqeWx5ZGh2bmd0YWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExOTI1ODYsImV4cCI6MjA5Njc2ODU4Nn0.iqOrYszYHPfbyjcUs2dVGz_EGRL7LffTWbWErATVSJo';
const REVIEW_DELAY_HOURS = 3;

async function sendReviewRequestEmail({ id, name, email }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[ReviewCron] Falta RESEND_API_KEY');
    return false;
  }

  const link = `https://gangnam.es/Valorar?id=${id}`;

  const text = `Hola ${name},

¿Qué tal tu experiencia en Gangnam Sevilla? Nos encantaría saber qué te ha parecido.

Déjanos tu valoración aquí: ${link}

Gracias por venir.
Gangnam Sevilla`;

  const html = `
    <div style="max-width: 420px; margin: 0 auto; padding: 56px 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; text-align: center; color: #1a1a1a;">
      <h1 style="font-size: 32px; font-weight: 300; letter-spacing: 8px; color: #FF9A8B; margin: 0 0 40px;">GANGNAM</h1>
      <p style="font-size: 16px; color: #444; margin: 0 0 8px;">Hola ${name},</p>
      <p style="font-size: 15px; color: #666; margin: 0 0 36px;">¿Qué tal tu experiencia? Nos encantaría saber qué te ha parecido.</p>
      <a href="${link}" style="display: inline-block; font-size: 24px; letter-spacing: 6px; color: #FF9A8B; text-decoration: none; margin: 0 0 40px;">&#9733; &#9733; &#9733; &#9733; &#9733;</a>
      <p style="margin: 0;">
        <a href="${link}" style="display: inline-block; font-size: 13px; color: #ffffff; background-color: #FF9A8B; text-decoration: none; padding: 12px 28px; border-radius: 24px;">Dejar mi valoración</a>
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
      subject: '¿Qué tal en Gangnam Sevilla?',
      html,
    }),
  });

  const data = await response.json();
  if (data.error || !response.ok) {
    console.error('[ReviewCron] Error enviando a', email, data.error || data);
    return false;
  }
  return true;
}

export default async function handler(req, res) {
  if (req.headers['x-cron-secret'] !== process.env.REVIEW_CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const now = new Date();
  const since = new Date(now.getTime() - 26 * 60 * 60 * 1000); // ventana de 26h hacia atras, margen de sobra
  const sinceDate = since.toISOString().slice(0, 10);

  const res1 = await fetch(
    `${SUPABASE_URL}/rest/v1/reservations?status=eq.confirmed&review_request_sent_at=is.null&date=gte.${sinceDate}&select=id,name,email,date,time`,
    {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }
  );

  if (!res1.ok) {
    console.error('[ReviewCron] Error consultando reservas');
    return res.status(500).json({ error: 'Error consultando reservas' });
  }

  const candidates = await res1.json();
  let sent = 0;

  for (const r of candidates) {
    const reservationDateTime = new Date(`${r.date}T${r.time}:00`);
    const sendAt = new Date(reservationDateTime.getTime() + REVIEW_DELAY_HOURS * 60 * 60 * 1000);
    if (now < sendAt) continue;

    const ok = await sendReviewRequestEmail(r);
    if (ok) {
      await fetch(`${SUPABASE_URL}/rest/v1/reservations?id=eq.${r.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ review_request_sent_at: now.toISOString() }),
      });
      sent += 1;
    }
  }

  return res.status(200).json({ checked: candidates.length, sent });
}
