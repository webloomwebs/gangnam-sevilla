import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, MapPin, Phone, Clock, Instagram, CalendarDays, Square, CheckSquare } from "lucide-react";
import CookieBanner from "@/components/CookieBanner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isBefore, startOfDay } from "date-fns";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const dishes = [
  {
    name: "Pollo frito combo",
    price: "28,95 €",
    image: "/images/877d6c34d_image.png",
    isHero: true,
    colSpan: "col-span-2 lg:col-span-2",
    rowSpan: "row-span-2 lg:row-span-2",
    objectPosition: "center"
  },
  {
    name: "Bibimbap de ternera",
    price: "14,95 €",
    image: "/images/26fb9cc70_image.png",
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
    objectPosition: "center"
  },
  {
    name: "Pollo frito agridulce",
    price: "13,50 €",
    image: "/images/cdf53e5f8_image.png",
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
    objectPosition: "center"
  },
  {
    name: "Jajangmyeon",
    price: "13,95 €",
    image: "/images/7d799791c_image.png",
    colSpan: "col-span-1",
    rowSpan: "row-span-1 lg:row-span-2",
    objectPosition: "center"
  },
  {
    name: "Bibim naengmyeon",
    price: "14,95 €",
    image: "/images/406a65e87_image.png",
    colSpan: "col-span-1",
    rowSpan: "row-span-1 lg:row-span-2",
    objectPosition: "center"
  },
  {
    name: "Topokki",
    price: "13,95 €",
    image: "/images/ae7ccb238_image.png",
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
    objectPosition: "center top"
  },
  {
    name: "Ramyeon vegetal",
    price: "10,95 €",
    image: "/images/0da6ed2d8_image.png",
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
    objectPosition: "center"
  }
];

function DishCard({ dish, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 80);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={`
        relative overflow-hidden cursor-pointer group rounded-2xl shadow-lg hover:shadow-2xl bg-white border border-[#ffc1b3]/10
        ${dish.colSpan} ${dish.rowSpan}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        transition-all duration-350 ease-out hover:-translate-y-2
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(!isHovered)}
      tabIndex={0}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full min-h-[280px]">
        <img
          src={dish.image}
          alt={`Foto de ${dish.name}`}
          className={`
            w-full h-full object-cover transition-transform duration-400 ease-out
            ${isHovered ? 'scale-110' : 'scale-100'}
          `}
          style={{ objectPosition: dish.objectPosition }}
        />

        <div
          className={`
            absolute inset-0 bg-gradient-to-br from-[#ff9a8b]/95 via-[#ffc1b3]/95 to-[#d4a5ff]/90
            flex flex-col items-center justify-center
            transition-all duration-350 ease-out backdrop-blur-[2px]
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
          style={{
            transform: isHovered ? 'translateY(0)' : 'translateY(10px)'
          }}
        >
          <h3 className="text-white text-sm md:text-base lg:text-xl font-light tracking-[0.15em] uppercase mb-1 text-center px-3 leading-tight">
            {dish.name}
          </h3>
          <p className="text-white text-base md:text-xl lg:text-2xl font-extralight tracking-wider">
            {dish.price}
          </p>
        </div>
      </div>
    </div>
  );
}

function DishGallery() {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 lg:gap-6"
      style={{
        gridAutoRows: '180px',
        gridAutoFlow: 'dense'
      }}
    >
      {dishes.map((dish, index) => (
        <DishCard key={dish.name} dish={dish} index={index} />
      ))}
    </div>
  );
}

const TIME_SLOTS_LUNCH = ["13:15", "13:45", "14:15", "14:45", "15:15", "15:45"];
const TIME_SLOTS_DINNER = ["20:15", "20:45", "21:15", "21:45", "22:15", "22:45"];

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    comments: "",
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(false);

    try {
      const response = await fetch('/api/reservar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error al enviar');

      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", date: "", time: "", guests: "", comments: "" });
      setPrivacyAccepted(false);
      setTimeout(() => setSubmitted(false), 6000);
    } catch (error) {
      console.error('Error:', error);
      setSubmitError(true);
      setTimeout(() => setSubmitError(false), 5000);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef8f5] via-[#fff5f0] to-[#fef8f5]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <span className="text-[#ff9a8b] text-2xl md:text-3xl font-light tracking-[0.3em]">GANGNAM</span>
            <span className="hidden md:block text-[#f5f0e8]/60 text-xs tracking-widest">강남</span>
          </motion.div>

          <nav className="hidden md:flex items-center gap-10">
            {[
              { label: "Platos", id: "platos" },
              { label: "Contacto", id: "contacto" },
              { label: "Reserva", id: "reserva" },
            ].map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => scrollToSection(item.id)}
                className="text-[#f5f0e8]/80 hover:text-[#ff9a8b] text-sm tracking-widest uppercase transition-all duration-300 hover:translate-y-[-2px] relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-[#ff9a8b] after:to-[#d4a5ff] after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => scrollToSection("reserva")}
              className="text-[#ff9a8b] text-sm tracking-wider hover:text-[#ffc1b3] transition-all duration-300"
            >
              Reservar
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/dae159131_image.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/70 via-[#1a1a1a]/50 to-[#1a1a1a]/80" />
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-[#f5f0e8] text-5xl md:text-8xl font-extralight tracking-[0.2em] mb-4">
              GANGNAM
            </h1>
            <p className="text-[#f5f0e8]/70 text-lg md:text-xl font-light tracking-wider mb-2">
              강남 레스토랑
            </p>
            <div className="w-24 h-[2px] bg-gradient-to-r from-[#d4a5ff] via-[#ff9a8b] to-[#ffc1b3] mx-auto my-8 rounded-full" />
            <p className="text-[#f5f0e8]/60 text-sm md:text-base tracking-wide max-w-md mx-auto">
              Una experiencia gastronómica única en el corazón de Sevilla
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <button
              onClick={() => scrollToSection("platos")}
              className="text-[#ff9a8b] animate-bounce"
            >
              <ChevronDown className="w-8 h-8" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Platos */}
      <section id="platos" className="py-24 md:py-32 bg-gradient-to-b from-[#fff5f0] to-[#fef8f5]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[#ff9a8b] text-sm tracking-[0.3em] mb-4">NUESTRO MENÚ</p>
            <h2 className="text-[#1a1a1a] text-3xl md:text-5xl font-extralight tracking-wide">Platos más populares</h2>
            <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#ff9a8b] to-transparent mx-auto mt-8" />
          </motion.div>

          <DishGallery />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link to={createPageUrl("Menu")}>
              <Button
                className="bg-gradient-to-r from-[#ff9a8b] via-[#ffc1b3] to-[#d4a5ff] hover:shadow-2xl hover:scale-105 hover:-translate-y-1 text-white rounded-xl px-10 py-6 text-sm tracking-[0.2em] transition-all duration-350 font-medium"
              >
                VER TODOS LOS PLATOS
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="relative h-[50vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('/images/1f19e5efd_image.png')" }}
        >
          <div className="absolute inset-0 bg-[#1a1a1a]/60" />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-[#f5f0e8] text-2xl md:text-4xl font-extralight tracking-[0.2em] text-center px-6"
          >
            "La cocina es el arte de transformar<br />ingredientes en emociones"
          </motion.p>
        </div>
      </section>

      {/* Reservas */}
      <section id="reserva" className="py-24 md:py-32 bg-gradient-to-b from-[#fff5f0] via-[#ffe9f0] to-[#fff5f0]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[#ff9a8b] text-sm tracking-[0.3em] mb-4">RESERVE SU MESA</p>
            <h2 className="text-[#1a1a1a] text-3xl md:text-5xl font-extralight tracking-wide">Reservas</h2>
            <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#ff9a8b] to-transparent mx-auto mt-8 mb-8" />
            <p className="text-[#2d2d2d]/70 max-w-lg mx-auto">
              Para garantizar la mejor experiencia, le recomendamos realizar su reserva con antelación.
              También puede llamarnos directamente al <span className="text-[#ff9a8b] font-medium">+34 645 80 57 58</span>
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-sm p-5 sm:p-8 md:p-12 rounded-3xl shadow-xl border border-[#ffc1b3]/20"
          >
            {submitted && (
              <div className="mb-6 p-4 bg-gradient-to-r from-[#ff9a8b]/10 via-[#ffc1b3]/10 to-[#d4a5ff]/10 border-2 border-[#ff9a8b] rounded-2xl text-[#1a1a1a] text-center shadow-lg">
                ¡Gracias! Su solicitud de reserva ha sido enviada. Recibirá un email de confirmación en breve.
              </div>
            )}

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-2xl text-red-700 text-center">
                Ha ocurrido un error. Por favor, inténtelo de nuevo o llámenos al +34 645 80 57 58.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
              <div>
                <label className="block text-[#2d2d2d] text-sm tracking-wider mb-2">NOMBRE</label>
                <Input
                  className="border-[#2d2d2d]/20 focus:border-[#ff9a8b] focus:ring-2 focus:ring-[#ff9a8b]/20 rounded-lg h-12 transition-all duration-300"
                  placeholder="Su nombre completo"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[#2d2d2d] text-sm tracking-wider mb-2">TELÉFONO</label>
                <Input
                  type="tel"
                  className="border-[#2d2d2d]/20 focus:border-[#ff9a8b] focus:ring-2 focus:ring-[#ff9a8b]/20 rounded-lg h-12 transition-all duration-300"
                  placeholder="+34 600 000 000"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[#2d2d2d] text-sm tracking-wider mb-2">CORREO ELECTRÓNICO</label>
              <Input
                type="email"
                className="border-[#2d2d2d]/20 focus:border-[#ff9a8b] focus:ring-2 focus:ring-[#ff9a8b]/20 rounded-lg h-12 transition-all duration-300"
                placeholder="su@email.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6">
              <div>
                <label className="block text-[#2d2d2d] text-sm tracking-wider mb-2">FECHA</label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full border border-[#2d2d2d]/20 focus:border-[#ff9a8b] rounded-lg h-12 px-3 text-sm text-left transition-all duration-300 bg-transparent flex items-center gap-2"
                    >
                      <CalendarDays className="w-4 h-4 text-[#ff9a8b]" />
                      {formData.date ? formData.date : <span className="text-gray-400">Seleccione fecha</span>}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date ? new Date(formData.date + 'T12:00:00') : undefined}
                      onSelect={(date) => {
                        if (date) {
                          setFormData({ ...formData, date: format(date, 'yyyy-MM-dd'), time: "" });
                          setCalendarOpen(false);
                        }
                      }}
                      disabled={(date) =>
                        isBefore(startOfDay(date), startOfDay(new Date())) ||
                        date.getDay() === 3
                      }
                      modifiers={{ wednesday: (d) => d.getDay() === 3 }}
                      modifiersStyles={{
                        wednesday: { color: '#ccc', textDecoration: 'line-through' }
                      }}
                      fromDate={new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="block text-[#2d2d2d] text-sm tracking-wider mb-2">HORA</label>
                <Select
                  value={formData.time}
                  onValueChange={(value) => setFormData({ ...formData, time: value })}
                  disabled={!formData.date}
                >
                  <SelectTrigger className="border-[#2d2d2d]/20 focus:border-[#ff9a8b] focus:ring-2 focus:ring-[#ff9a8b]/20 rounded-lg h-12 transition-all duration-300">
                    <SelectValue placeholder={formData.date ? "Seleccione hora" : "Primero elige fecha"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__lunch__" disabled className="text-xs text-gray-400">— Comida —</SelectItem>
                    {TIME_SLOTS_LUNCH.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                    <SelectItem value="__dinner__" disabled className="text-xs text-gray-400">— Cena —</SelectItem>
                    {TIME_SLOTS_DINNER.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-[#2d2d2d] text-sm tracking-wider mb-2">PERSONAS</label>
                <Select
                  value={formData.guests}
                  onValueChange={(value) => setFormData({ ...formData, guests: value })}
                >
                  <SelectTrigger className="border-[#2d2d2d]/20 focus:border-[#ff9a8b] focus:ring-2 focus:ring-[#ff9a8b]/20 rounded-lg h-12 transition-all duration-300">
                    <SelectValue placeholder="Nº personas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 persona</SelectItem>
                    {[2,3,4,5,6,7,8].map(n => (
                      <SelectItem key={n} value={String(n)}>{n} personas</SelectItem>
                    ))}
                    <SelectItem value="9+">Más de 8</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-[#2d2d2d] text-sm tracking-wider mb-2">COMENTARIOS (OPCIONAL)</label>
              <Textarea
                className="border-[#2d2d2d]/20 focus:border-[#ff9a8b] focus:ring-2 focus:ring-[#ff9a8b]/20 rounded-lg resize-none transition-all duration-300"
                placeholder="Alergias, preferencias, ocasión especial..."
                rows={4}
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              />
            </div>

            <div className="mb-6 flex items-start gap-3">
              <button type="button" onClick={() => setPrivacyAccepted(!privacyAccepted)} className="mt-0.5 shrink-0 text-[#ff9a8b]">
                {privacyAccepted ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-gray-300" />}
              </button>
              <p className="text-sm text-[#2d2d2d]/60">
                He leído y acepto la{" "}
                <Link to="/PoliticaPrivacidad" className="text-[#ff9a8b] hover:underline">Política de privacidad</Link>
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !privacyAccepted || !formData.name || !formData.email || !formData.phone || !formData.date || !formData.time || !formData.guests}
              className="w-full bg-gradient-to-r from-[#ff9a8b] via-[#ffc1b3] to-[#d4a5ff] hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-0.5 text-white rounded-xl h-14 text-sm tracking-[0.2em] transition-all duration-350 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isSubmitting ? "ENVIANDO..." : "SOLICITAR RESERVA"}
            </Button>
          </motion.form>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="py-24 md:py-32 bg-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[#ff9a8b] text-sm tracking-[0.3em] mb-4">ENCUÉNTRANOS</p>
            <h2 className="text-[#f5f0e8] text-3xl md:text-5xl font-extralight tracking-wide">Contacto</h2>
            <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#ff9a8b] to-transparent mx-auto mt-8" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8">
            {[
              {
                icon: MapPin,
                title: "DIRECCIÓN",
                content: <>C. San Felipe, 11<br />Casco Antiguo, 41003<br />Sevilla, España</>
              },
              {
                icon: Phone,
                title: "TELÉFONO",
                content: <a href="tel:+34645805758" className="text-[#f5f0e8]/60 hover:text-[#ff9a8b] transition-all duration-300 text-lg">+34 645 80 57 58</a>,
                isLink: true
              },
              {
                icon: Clock,
                title: "HORARIO",
                content: <>lunes-domingos:<br />13:15-16:45<br />20:15-23:45<br />Miércoles cerrado</>
              }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 border-2 border-[#ff9a8b]/30 rounded-full flex items-center justify-center hover:border-[#ff9a8b] hover:shadow-xl hover:bg-[#ff9a8b]/5 hover:scale-110 transition-all duration-350">
                  <item.icon className="w-6 h-6 text-[#ff9a8b]" />
                </div>
                <h3 className="text-[#f5f0e8] text-lg tracking-wider mb-4">{item.title}</h3>
                {item.isLink ? (
                  <div className="text-[#f5f0e8]/60 hover:text-[#ff9a8b] transition-all duration-300">
                    {item.content}
                  </div>
                ) : (
                  <p className="text-[#f5f0e8]/60 leading-relaxed">{item.content}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CookieBanner />

      {/* Footer */}
      <footer className="bg-[#1a1a1a] py-16 border-t border-[#2d2d2d]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 items-center">
            <div className="text-center md:text-left">
              <p className="text-[#f5f0e8]/50 text-sm leading-relaxed">
                C. San Felipe, 11<br />
                Casco Antiguo, 41003<br />
                Sevilla, España
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-[#ff9a8b] text-2xl tracking-[0.3em] mb-2">GANGNAM</h3>
              <p className="text-[#f5f0e8]/40 text-sm tracking-widest mb-4">강남 레스토랑</p>
              <a
                href="https://www.instagram.com/r.c.gangnam?igsh=cG42MmJmN29tY2Jx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#ff9a8b]/30 hover:border-[#ff9a8b] hover:bg-[#ff9a8b]/10 transition-all duration-300"
              >
                <Instagram className="w-5 h-5 text-[#ff9a8b]" />
              </a>
            </div>
            <div className="text-center md:text-right">
              <a href="tel:+34645805758" className="text-[#f5f0e8]/50 hover:text-[#ff9a8b] transition-all duration-300 text-sm">
                +34 645 80 57 58
              </a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[#2d2d2d]/50 text-center space-y-3">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <p className="text-[#f5f0e8]/30 text-xs tracking-wider uppercase">Legal</p>
              <span className="text-[#2d2d2d]">·</span>
              <Link to="/SobreNosotros" className="text-[#f5f0e8]/30 hover:text-[#ff9a8b] text-xs tracking-wider transition-colors">Sobre nosotros</Link>
              <span className="text-[#2d2d2d]">·</span>
              <Link to="/Contacto" className="text-[#f5f0e8]/30 hover:text-[#ff9a8b] text-xs tracking-wider transition-colors">Contacto</Link>
              <span className="text-[#2d2d2d]">·</span>
              <Link to="/AvisoLegal" className="text-[#f5f0e8]/30 hover:text-[#ff9a8b] text-xs tracking-wider transition-colors">Aviso legal</Link>
              <span className="text-[#2d2d2d]">·</span>
              <Link to="/PoliticaPrivacidad" className="text-[#f5f0e8]/30 hover:text-[#ff9a8b] text-xs tracking-wider transition-colors">Política de privacidad</Link>
              <span className="text-[#2d2d2d]">·</span>
              <Link to="/PoliticaCookies" className="text-[#f5f0e8]/30 hover:text-[#ff9a8b] text-xs tracking-wider transition-colors">Política de cookies</Link>
            </div>
            <p className="text-[#f5f0e8]/20 text-xs tracking-wider">
              © 2026 Gangnam Restaurant. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
