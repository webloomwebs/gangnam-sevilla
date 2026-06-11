import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

const TIME_SLOTS_LUNCH = ["13:15", "13:45", "14:15", "14:45", "15:15", "15:45"];
const TIME_SLOTS_DINNER = ["20:15", "20:45", "21:15", "21:45", "22:15", "22:45"];

export default function ManualReservationForm({ defaultDate, defaultTime, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: defaultDate || "",
    time: defaultTime || "",
    guests: "",
    comments: "",
    status: "confirmed",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.Reservation.create(form);
    setSaving(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-medium text-[#1a1a1a] mb-5 tracking-wide">Nueva reserva manual</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-wider text-gray-500 mb-1">NOMBRE *</label>
              <Input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nombre completo" />
            </div>
            <div>
              <label className="block text-xs tracking-wider text-gray-500 mb-1">TELÉFONO *</label>
              <Input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+34 600 000 000" />
            </div>
          </div>
          <div>
            <label className="block text-xs tracking-wider text-gray-500 mb-1">EMAIL</label>
            <Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="cliente@email.com" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs tracking-wider text-gray-500 mb-1">FECHA *</label>
              <Input required type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs tracking-wider text-gray-500 mb-1">HORA *</label>
              <Select value={form.time} onValueChange={v => setForm({...form, time: v})}>
                <SelectTrigger><SelectValue placeholder="Hora" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__l__" disabled className="text-xs text-gray-400">— Comida —</SelectItem>
                  {TIME_SLOTS_LUNCH.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  <SelectItem value="__d__" disabled className="text-xs text-gray-400">— Cena —</SelectItem>
                  {TIME_SLOTS_DINNER.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs tracking-wider text-gray-500 mb-1">PERSONAS *</label>
              <Select value={form.guests} onValueChange={v => setForm({...form, guests: v})}>
                <SelectTrigger><SelectValue placeholder="Nº" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  {[2,3,4,5,6,7,8].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                  <SelectItem value="9+">9+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-wider text-gray-500 mb-1">ESTADO</label>
              <Select value={form.status} onValueChange={v => setForm({...form, status: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="confirmed">Confirmada</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs tracking-wider text-gray-500 mb-1">COMENTARIOS</label>
              <Input value={form.comments} onChange={e => setForm({...form, comments: e.target.value})} placeholder="Notas..." />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
            <Button type="submit" disabled={saving || !form.name || !form.phone || !form.time || !form.guests || !form.date}
              className="flex-1 bg-[#ff9a8b] hover:bg-[#ff8a7b] text-white">
              {saving ? "Guardando..." : "Guardar reserva"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}