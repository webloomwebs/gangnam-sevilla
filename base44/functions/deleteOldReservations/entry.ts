import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);

        const today = new Date().toISOString().split('T')[0];

        const reservations = await base44.asServiceRole.entities.Reservation.filter({});

        const toDelete = reservations.filter(r => r.date && r.date < today);

        for (const r of toDelete) {
            await base44.asServiceRole.entities.Reservation.delete(r.id);
        }

        return Response.json({ deleted: toDelete.length });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});