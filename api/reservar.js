// Vercel serverless function — POST /api/reservar
// Envía email de confirmación via Resend + notifica al restaurante via Make.com webhook

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/1dp239il1a303f1urlm877fw1q8ob8b4';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, date, time, guests, comments } = req.body;

  if (!name || !email || !phone || !date || !time || !guests) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    // 1. Notificar al restaurante via Make.com (WhatsApp)
    await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, date, time, guests, comments })
    });

    // 2. Enviar email de confirmación al cliente via Resend
    if (RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'Gangnam Sevilla <reservas@gangnam.es>',
          to: [email],
          subject: '✅ Reserva recibida – Gangnam Sevilla',
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; color: #1a1a1a;">
              <h2 style="color: #ff9a8b; letter-spacing: 0.2em;">GANGNAM SEVILLA</h2>
              <p>Hola <strong>${name}</strong>,</p>
              <p>Hemos recibido su solicitud de reserva. Le confirmaremos la disponibilidad en breve.</p>
              <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
                <tr><td style="padding: 6px 0; color: #888;">📅 Fecha</td><td>${date}</td></tr>
                <tr><td style="padding: 6px 0; color: #888;">🕐 Hora</td><td>${time}</td></tr>
                <tr><td style="padding: 6px 0; color: #888;">👥 Personas</td><td>${guests}</td></tr>
                ${comments ? `<tr><td style="padding: 6px 0; color: #888;">💬 Comentarios</td><td>${comments}</td></tr>` : ''}
              </table>
              <p style="color: #555;">📍 C. San Felipe, 11, Casco Antiguo, 41003 Sevilla</p>
              <p style="color: #555;">Para modificar o cancelar: <strong>+34 645 80 57 58</strong></p>
              <p>¡Le esperamos!</p>
              <p style="color: #ff9a8b; font-style: italic;">El equipo de Gangnam Sevilla</p>
            </div>
          `
        })
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error en /api/reservar:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
