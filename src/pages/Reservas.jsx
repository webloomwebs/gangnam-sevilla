import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";

import AvailabilityView from "@/components/reservas/AvailabilityView";

export default function Reservas() {
  const queryClient = useQueryClient();

  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ["reservations"],
    queryFn: () => base44.entities.Reservation.list("-created_date", 500),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Reservation.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reservations"] }),
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef8f5] via-[#fff5f0] to-[#fef8f5] p-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl font-extralight tracking-[0.2em] text-[#1a1a1a] mb-1">RESERVAS</h1>
          <p className="text-[#ff9a8b] text-sm tracking-widest">GANGNAM SEVILLA</p>
        </motion.div>

        {isLoading ? (
          <p className="text-center text-[#2d2d2d]/50 py-12">Cargando...</p>
        ) : (
          <>
            <p className="text-sm text-[#2d2d2d]/50 mb-4">Capacidad: 49 personas por franja horaria. Mesa ocupa 1h. Los miércoles están cerrados.</p>
            <AvailabilityView
              reservations={reservations}
              onRefresh={() => queryClient.invalidateQueries({ queryKey: ["reservations"] })}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          </>
        )}
      </div>
    </div>
  );
}