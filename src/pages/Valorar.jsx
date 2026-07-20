import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Star } from "lucide-react";

export default function Valorar() {
  const [searchParams] = useSearchParams();
  const reservationId = searchParams.get('id');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done | error | already

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/valorar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservation_id: reservationId, rating, comment }),
      });
      if (res.status === 409) {
        setStatus('already');
        return;
      }
      if (!res.ok) throw new Error('Error al enviar');
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  if (!reservationId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <p className="text-[#2d2d2d]/50 text-sm">Enlace no válido.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-sm w-full text-center py-16">
        <h1 className="text-3xl font-extralight tracking-[0.3em] text-[#ff9a8b] mb-14">GANGNAM</h1>

        {status === 'done' ? (
          <p className="text-[#1a1a1a] text-lg font-light">¡Gracias por tu valoración!</p>
        ) : status === 'already' ? (
          <p className="text-[#1a1a1a] text-lg font-light">Ya nos habías dejado tu valoración, ¡gracias!</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="text-[#444] text-base mb-8">¿Qué tal tu experiencia?</p>

            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1"
                  aria-label={`${n} estrellas`}
                >
                  <Star
                    size={32}
                    strokeWidth={1.5}
                    className={(hoverRating || rating) >= n ? "fill-[#ff9a8b] text-[#ff9a8b]" : "text-[#e5d9d6]"}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Cuéntanos más (opcional)"
              rows={3}
              className="w-full border border-[#eee] rounded-xl p-3 text-sm text-[#1a1a1a] placeholder:text-[#bbb] focus:outline-none focus:border-[#ff9a8b] mb-8 resize-none"
            />

            <button
              type="submit"
              disabled={!rating || status === 'sending'}
              className="bg-[#ff9a8b] text-white text-sm tracking-wide rounded-full px-8 py-3 disabled:opacity-40 transition-opacity"
            >
              {status === 'sending' ? 'Enviando...' : 'Enviar valoración'}
            </button>

            {status === 'error' && (
              <p className="text-red-400 text-xs mt-4">Algo ha fallado, inténtalo de nuevo.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
