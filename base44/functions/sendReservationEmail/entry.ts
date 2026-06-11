import { Resend } from 'npm:resend@4.0.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

Deno.serve(async (req) => {
  try {
    const { reservation, status } = await req.json();
    const emailTo = reservation?.email;

    if (!emailTo || !emailTo.includes("@")) {
      return Response.json({ error: 'No email address found' }, { status: 400 });
    }

    if (status === "confirmed") {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: emailTo,
        subject: "✅ Reserva confirmada – Gangnam Sevilla",
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; color: #1a1a1a;">
            <h2 style="color: #ff9a8b;">Gangnam Sevilla</h2>
            <p>Hola <strong>${reservation.name}</strong>,</p>
            <p>Nos complace confirmar su reserva.</p>
            <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
              <tr><td style="padding: 6px 0; color: #888;">📅 Fecha</td><td>${reservation.date}</td></tr>
              <tr><td style="padding: 6px 0; color: #888;">🕐 Hora</td><td>${reservation.time}</td></tr>
              <tr><td style="padding: 6px 0; color: #888;">👥 Personas</td><td>${reservation.guests}</td></tr>
              ${reservation.comments ? `<tr><td style="padding: 6px 0; color: #888;">💬 Comentarios</td><td>${reservation.comments}</td></tr>` : ""}
            </table>
            <p style="color: #555;">📍 C. San Felipe, 11, Casco Antiguo, 41003 Sevilla</p>
            <p style="color: #555;">Para modificar o cancelar: <strong>+34 645 80 57 58</strong></p>
            <p>¡Le esperamos!</p>
            <p style="color: #ff9a8b; font-style: italic;">El equipo de Gangnam Sevilla</p>
          </div>
        `
      });
    } else if (status === "cancelled") {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: emailTo,
        subject: "❌ Reserva no disponible – Gangnam Sevilla",
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; color: #1a1a1a;">
            <h2 style="color: #ff9a8b;">Gangnam Sevilla</h2>
            <p>Hola <strong>${reservation.name}</strong>,</p>
            <p>Lamentamos informarle que no hay disponibilidad para su reserva.</p>
            <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
              <tr><td style="padding: 6px 0; color: #888;">📅 Fecha</td><td>${reservation.date}</td></tr>
              <tr><td style="padding: 6px 0; color: #888;">🕐 Hora</td><td>${reservation.time}</td></tr>
              <tr><td style="padding: 6px 0; color: #888;">👥 Personas</td><td>${reservation.guests}</td></tr>
            </table>
            <p style="color: #555;">Contáctenos para buscar una alternativa: <strong>+34 645 80 57 58</strong></p>
            <p>Disculpe las molestias.</p>
            <p style="color: #ff9a8b; font-style: italic;">El equipo de Gangnam Sevilla</p>
          </div>
        `
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});