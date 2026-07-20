import React, { useMemo, useState } from "react";
import { addDays, startOfToday, format } from "date-fns";
import { ChevronDown, ChevronUp, Users, Plus, Phone, Mail, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ManualReservationForm from "./ManualReservationForm";

// Horario de verano: comida solo lunes/viernes/sábado/domingo (13:00-17:00),
// cena todos los días de la semana (20:00-24:00, incluido miércoles)
const TIME_SLOTS_LUNCH = ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"];
const TIME_SLOTS_DINNER = ["20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"];
const LUNCH_DAYS = new Set([0, 1, 5, 6]); // Domingo, Lunes, Viernes, Sábado
const CAPACITY = 49;
const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTH_NAMES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

// Occupancy at slot S = guests from bookings at T where 0 <= S-T < 60 (still seated)
function getEffectiveOccupancy(slotStr, dayOccupancy) {
  const slotMin = timeToMinutes(slotStr);
  let total = 0;
  Object.entries(dayOccupancy).forEach(([bookedSlot, guests]) => {
    const diff = slotMin - timeToMinutes(bookedSlot);
    if (diff >= 0 && diff < 60) total += guests;
  });
  return total;
}

// Get reservations visible at slot S (booked T where 0 <= S-T < 60)
function getReservationsForSlot(slotStr, dayReservations) {
  const slotMin = timeToMinutes(slotStr);
  return dayReservations.filter(r => {
    const diff = slotMin - timeToMinutes(r.time);
    return diff >= 0 && diff < 60;
  });
}

export default function AvailabilityView({ reservations, onRefresh, onDelete }) {
  const [expandedDay, setExpandedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null); // { dateStr, slot }
  const [showForm, setShowForm] = useState(false);
  const [formDefaults, setFormDefaults] = useState({});
  const today = startOfToday();

  const days = useMemo(() => {
    const result = [];
    for (let i = 0; i < 30; i++) {
      result.push(addDays(today, i));
    }
    return result;
  }, []);

  const activeReservations = useMemo(() =>
    reservations.filter(r => r.status !== 'cancelled'), [reservations]);

  const occupancyByDate = useMemo(() => {
    const byDate = {};
    activeReservations.forEach(r => {
      if (!byDate[r.date]) byDate[r.date] = {};
      const guests = r.guests === '9+' ? 9 : parseInt(r.guests) || 1;
      byDate[r.date][r.time] = (byDate[r.date][r.time] || 0) + guests;
    });
    return byDate;
  }, [activeReservations]);

  const reservationsByDate = useMemo(() => {
    const byDate = {};
    activeReservations.forEach(r => {
      if (!byDate[r.date]) byDate[r.date] = [];
      byDate[r.date].push(r);
    });
    return byDate;
  }, [activeReservations]);

  const openForm = (dateStr, slot) => {
    setFormDefaults({ date: dateStr, time: slot });
    setShowForm(true);
  };

  const statusColor = (s) => ({
    confirmed: 'text-green-600',
    pending: 'text-yellow-600',
    cancelled: 'text-red-500',
  }[s] || 'text-gray-500');

  const statusLabel = (s) => ({ confirmed: 'Confirmada', pending: 'Pendiente', cancelled: 'Cancelada' }[s] || s);

  return (
    <div className="space-y-2">
      {days.map(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayOcc = occupancyByDate[dateStr] || {};
        const dayResv = reservationsByDate[dateStr] || [];
        const totalGuests = dayResv.reduce((a, r) => a + (r.guests === '9+' ? 9 : parseInt(r.guests) || 1), 0);
        const hasLunch = LUNCH_DAYS.has(date.getDay());
        const daySlots = hasLunch ? [...TIME_SLOTS_LUNCH, ...TIME_SLOTS_DINNER] : TIME_SLOTS_DINNER;
        const fullSlots = daySlots.filter(s => getEffectiveOccupancy(s, dayOcc) >= CAPACITY).length;
        const isDayFull = fullSlots === daySlots.length;
        const isExpanded = expandedDay === dateStr;

        return (
          <div key={dateStr} className={`bg-white rounded-xl border overflow-hidden transition-all ${
            isDayFull ? 'border-red-200' : dayResv.length > 0 ? 'border-[#ffc1b3]/40' : 'border-gray-100'
          }`}>
            {/* Day header */}
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedDay(isExpanded ? null : dateStr)}>
              <div className="flex items-center gap-3">
                <div className={`text-center min-w-[52px] rounded-lg p-2 ${
                  isDayFull ? 'bg-red-50' : dayResv.length > 0 ? 'bg-[#fff5f0]' : 'bg-gray-50'
                }`}>
                  <p className="text-xs text-gray-400">{DAY_NAMES[date.getDay()]}</p>
                  <p className={`text-xl font-medium ${isDayFull ? 'text-red-500' : 'text-[#1a1a1a]'}`}>{date.getDate()}</p>
                  <p className="text-xs text-gray-400">{MONTH_NAMES[date.getMonth()]}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1a1a1a]">
                    {dayResv.length === 0 ? 'Sin reservas' : `${dayResv.length} reserva${dayResv.length !== 1 ? 's' : ''}`}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Users className="w-3 h-3" />{totalGuests} personas
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isDayFull && <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full font-medium">Completo</span>}
                {!isDayFull && fullSlots > 0 && (
                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                    {fullSlots} turno{fullSlots !== 1 ? 's' : ''} lleno{fullSlots !== 1 ? 's' : ''}
                  </span>
                )}
                <button onClick={(e) => { e.stopPropagation(); openForm(dateStr, ''); }}
                  className="text-[#ff9a8b] hover:text-[#ff7a6b] p-1 rounded-lg hover:bg-[#fff5f0] transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </div>

            {/* Expanded: time slots */}
            {isExpanded && (
              <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                {/* Comida — solo lunes/viernes/sábado/domingo en horario de verano */}
                {hasLunch && (
                <>
                <p className="text-xs text-gray-400 tracking-wider mb-2">COMIDA</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                  {TIME_SLOTS_LUNCH.map(slot => {
                    const eff = getEffectiveOccupancy(slot, dayOcc);
                    const slotResv = getReservationsForSlot(slot, dayResv);
                    const pct = Math.min((eff / CAPACITY) * 100, 100);
                    const isFull = eff >= CAPACITY;
                    const isSelected = selectedSlot?.dateStr === dateStr && selectedSlot?.slot === slot;
                    return (
                      <button key={slot} onClick={() => setSelectedSlot(isSelected ? null : { dateStr, slot })}
                        className={`rounded-lg p-2 text-center text-xs border transition-all ${
                          isSelected ? 'ring-2 ring-[#ff9a8b] border-[#ff9a8b]' :
                          isFull ? 'bg-red-50 border-red-200' :
                          slotResv.length > 0 ? 'bg-[#fff5f0] border-[#ffc1b3]/30 hover:border-[#ff9a8b]' :
                          'bg-white border-gray-100 hover:border-gray-300'
                        }`}>
                        <p className="font-medium text-[#1a1a1a]">{slot}</p>
                        <p className={`text-xs mt-0.5 ${isFull ? 'text-red-500' : 'text-gray-400'}`}>{eff}/{CAPACITY}</p>
                        <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${isFull ? 'bg-red-400' : pct > 70 ? 'bg-yellow-400' : 'bg-[#ff9a8b]'}`}
                            style={{ width: `${pct}%` }} />
                        </div>
                      </button>
                    );
                  })}
                </div>
                </>
                )}
                {/* Cena — todos los días de la semana en horario de verano */}
                <p className="text-xs text-gray-400 tracking-wider mb-2">CENA</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {TIME_SLOTS_DINNER.map(slot => {
                    const eff = getEffectiveOccupancy(slot, dayOcc);
                    const slotResv = getReservationsForSlot(slot, dayResv);
                    const pct = Math.min((eff / CAPACITY) * 100, 100);
                    const isFull = eff >= CAPACITY;
                    const isSelected = selectedSlot?.dateStr === dateStr && selectedSlot?.slot === slot;
                    return (
                      <button key={slot} onClick={() => setSelectedSlot(isSelected ? null : { dateStr, slot })}
                        className={`rounded-lg p-2 text-center text-xs border transition-all ${
                          isSelected ? 'ring-2 ring-[#ff9a8b] border-[#ff9a8b]' :
                          isFull ? 'bg-red-50 border-red-200' :
                          slotResv.length > 0 ? 'bg-[#fff5f0] border-[#ffc1b3]/30 hover:border-[#ff9a8b]' :
                          'bg-white border-gray-100 hover:border-gray-300'
                        }`}>
                        <p className="font-medium text-[#1a1a1a]">{slot}</p>
                        <p className={`text-xs mt-0.5 ${isFull ? 'text-red-500' : 'text-gray-400'}`}>{eff}/{CAPACITY}</p>
                        <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${isFull ? 'bg-red-400' : pct > 70 ? 'bg-yellow-400' : 'bg-[#ff9a8b]'}`}
                            style={{ width: `${pct}%` }} />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Slot detail */}
                {selectedSlot?.dateStr === dateStr && (() => {
                  const slotResv = getReservationsForSlot(selectedSlot.slot, dayResv);
                  return (
                    <div className="mt-4 bg-white rounded-xl border border-[#ffc1b3]/30 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-[#1a1a1a]">
                          Reservas en turno {selectedSlot.slot}
                          <span className="ml-2 text-xs text-gray-400">(personas presentes en esa hora)</span>
                        </p>
                        <div className="flex gap-2">
                          <button onClick={() => openForm(dateStr, selectedSlot.slot)}
                            className="text-xs flex items-center gap-1 text-[#ff9a8b] hover:text-[#ff7a6b] font-medium">
                            <Plus className="w-3 h-3" /> Añadir
                          </button>
                          <button onClick={() => setSelectedSlot(null)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {slotResv.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-3">Sin reservas en este turno</p>
                      ) : (
                        <div className="space-y-2">
                          {slotResv.map(r => (
                            <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                              <div>
                                <p className="text-sm font-medium text-[#1a1a1a]">{r.name}</p>
                                <div className="flex gap-3 text-xs text-gray-400 mt-0.5">
                                  <span>🕐 {r.time}</span>
                                  <span className="flex items-center gap-1"><Users className="w-3 h-3"/>{r.guests} pers.</span>
                                  {r.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3"/>{r.phone}</span>}
                                  {r.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3"/>{r.email}</span>}
                                </div>
                                {r.comments && <p className="text-xs text-gray-400 mt-0.5 italic">"{r.comments}"</p>}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-medium ${statusColor(r.status)}`}>{statusLabel(r.status)}</span>
                                {onDelete && (
                                  <button onClick={() => onDelete(r.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        );
      })}

      {showForm && (
        <ManualReservationForm
          defaultDate={formDefaults.date}
          defaultTime={formDefaults.time}
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); onRefresh(); }}
        />
      )}
    </div>
  );
}