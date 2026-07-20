// Vercel serverless function — POST /api/valorar
// Guarda la valoracion del cliente (estrellas + comentario) ligada a su reserva.

const SUPABASE_URL = 'https://nbcmyfzjylydhvngtalc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iY215ZnpqeWx5ZGh2bmd0YWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExOTI1ODYsImV4cCI6MjA5Njc2ODU4Nn0.iqOrYszYHPfbyjcUs2dVGz_EGRL7LffTWbWErATVSJo';

async function fetchReservation(id) {
  const resResv = await fetch(
    `${SUPABASE_URL}/rest/v1/reservations?id=eq.${id}&select=name,date,time,email,phone`,
    {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }
  );
  const rows = await resResv.json();
  return rows[0] || null;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Falta id' });
    }
    const reservation = await fetchReservation(id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    return res.status(200).json({ name: reservation.name, date: reservation.date, time: reservation.time });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { reservation_id, rating, comment } = req.body;
  const ratingNum = Number(rating);

  if (!reservation_id || !ratingNum || ratingNum < 1 || ratingNum > 5) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  try {
    const reservation = await fetchReservation(reservation_id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    const { name, date, email, phone } = reservation;

    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        reservation_id,
        name,
        date,
        email,
        phone,
        rating: ratingNum,
        comment: comment && comment.trim() ? comment.trim() : null,
      }),
    });

    if (!insertRes.ok) {
      if (insertRes.status === 409) {
        return res.status(409).json({ error: 'Ya has valorado esta reserva' });
      }
      const errBody = await insertRes.text();
      console.error('Error en /api/valorar:', errBody);
      return res.status(500).json({ error: 'Error guardando la valoración' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error en /api/valorar:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
