import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import AvailabilityView from "@/components/reservas/AvailabilityView";
import ReviewsView from "@/components/reservas/ReviewsView";

const SUPABASE_URL = 'https://nbcmyfzjylydhvngtalc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iY215ZnpqeWx5ZGh2bmd0YWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExOTI1ODYsImV4cCI6MjA5Njc2ODU4Nn0.iqOrYszYHPfbyjcUs2dVGz_EGRL7LffTWbWErATVSJo';

async function fetchReservations() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/reservations?order=created_at.desc&limit=500`,
    {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    }
  );
  if (!res.ok) throw new Error('Error cargando reservas');
  return res.json();
}

async function fetchReviews() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/reviews?order=created_at.desc&limit=500`,
    {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    }
  );
  if (!res.ok) throw new Error('Error cargando valoraciones');
  return res.json();
}

async function deleteReservation(id) {
  await fetch(`${SUPABASE_URL}/rest/v1/reservations?id=eq.${id}`, {
    method: 'DELETE',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
}

export default function Reservas() {
  const [tab, setTab] = useState('reservas'); // 'reservas' | 'valoraciones'
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  const loadReservations = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchReservations();
      setReservations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadReviews = useCallback(async () => {
    setIsLoadingReviews(true);
    try {
      const data = await fetchReviews();
      setReviews(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingReviews(false);
    }
  }, []);

  useEffect(() => {
    loadReservations();
    loadReviews();
  }, [loadReservations, loadReviews]);

  const handleDelete = async (id) => {
    await deleteReservation(id);
    setReservations(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef8f5] via-[#fff5f0] to-[#fef8f5] p-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl font-extralight tracking-[0.2em] text-[#1a1a1a] mb-1">RESERVAS</h1>
          <p className="text-[#ff9a8b] text-sm tracking-widest">GANGNAM SEVILLA</p>
        </motion.div>

        <div className="flex gap-6 mb-8 border-b border-[#eee]">
          <button
            onClick={() => setTab('reservas')}
            className={`pb-3 text-sm tracking-wide ${tab === 'reservas' ? 'text-[#1a1a1a] border-b-2 border-[#ff9a8b]' : 'text-[#2d2d2d]/40'}`}
          >
            Reservas
          </button>
          <button
            onClick={() => setTab('valoraciones')}
            className={`pb-3 text-sm tracking-wide ${tab === 'valoraciones' ? 'text-[#1a1a1a] border-b-2 border-[#ff9a8b]' : 'text-[#2d2d2d]/40'}`}
          >
            Valoraciones
          </button>
        </div>

        {tab === 'reservas' ? (
          isLoading ? (
            <p className="text-center text-[#2d2d2d]/50 py-12">Cargando...</p>
          ) : (
            <>
              <p className="text-sm text-[#2d2d2d]/50 mb-4">
                Capacidad: 49 personas por franja horaria. Comida solo Lun/Vie/Sáb/Dom, cena todos los días.
              </p>
              <AvailabilityView
                reservations={reservations}
                onRefresh={loadReservations}
                onDelete={handleDelete}
              />
            </>
          )
        ) : (
          <ReviewsView reviews={reviews} isLoading={isLoadingReviews} />
        )}
      </div>
    </div>
  );
}
