import React from "react";
import { Star } from "lucide-react";

function StarRow({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={16}
          strokeWidth={1.5}
          className={rating >= n ? "fill-[#ff9a8b] text-[#ff9a8b]" : "text-[#e5d9d6]"}
        />
      ))}
    </div>
  );
}

export default function ReviewsView({ reviews, isLoading }) {
  if (isLoading) {
    return <p className="text-center text-[#2d2d2d]/50 py-12">Cargando...</p>;
  }

  if (!reviews.length) {
    return <p className="text-center text-[#2d2d2d]/50 py-12">Todavía no hay valoraciones.</p>;
  }

  const avg = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl font-light text-[#1a1a1a]">{avg}</span>
        <div>
          <StarRow rating={Math.round(avg)} />
          <p className="text-xs text-[#2d2d2d]/50 mt-1">{reviews.length} {reviews.length === 1 ? 'valoración' : 'valoraciones'}</p>
        </div>
      </div>

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-[#1a1a1a] text-sm">{r.name}</span>
              <span className="text-xs text-[#2d2d2d]/40">{r.date}</span>
            </div>
            <p className="text-xs text-[#2d2d2d]/40 mb-2">
              {[r.email, r.phone].filter(Boolean).join(' · ')}
            </p>
            <StarRow rating={r.rating} />
            {r.comment && (
              <p className="text-sm text-[#2d2d2d]/70 mt-2">{r.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
