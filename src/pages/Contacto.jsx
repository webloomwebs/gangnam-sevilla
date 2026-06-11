import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, Clock, Instagram } from "lucide-react";

export default function Contacto() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef8f5] via-[#fff5f0] to-[#fef8f5]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-[#ff9a8b] hover:text-[#ffc1b3] transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm tracking-wider">VOLVER</span>
            </motion.button>
          </Link>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <span className="text-[#ff9a8b] text-2xl md:text-3xl font-light tracking-[0.3em]">GANGNAM</span>
          </motion.div>
          <div className="w-24"></div>
        </div>
      </header>

      {/* Content */}
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <p className="text-[#ff9a8b] text-sm tracking-[0.3em] mb-4">ESTAMOS AQUÍ PARA AYUDARTE</p>
            <h1 className="text-[#1a1a1a] text-3xl md:text-5xl font-extralight tracking-wide mb-6">
              Contacto
            </h1>
            <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#ff9a8b] to-transparent mx-auto" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Dirección */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ffc1b3]/20 flex gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-[#ff9a8b]/30 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#ff9a8b]" />
              </div>
              <div>
                <h2 className="text-[#1a1a1a] font-medium tracking-wider mb-1 text-sm uppercase">Dirección</h2>
                <p className="text-[#2d2d2d]/70 text-sm leading-relaxed">
                  C. San Felipe, 11<br />
                  Casco Antiguo, 41003<br />
                  Sevilla, España
                </p>
                <a
                  href="https://maps.google.com/?q=Calle+San+Felipe+11+Sevilla"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#ff9a8b] text-xs mt-2 inline-block hover:underline"
                >
                  Ver en Google Maps →
                </a>
              </div>
            </div>

            {/* Teléfono */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ffc1b3]/20 flex gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-[#ff9a8b]/30 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-[#ff9a8b]" />
              </div>
              <div>
                <h2 className="text-[#1a1a1a] font-medium tracking-wider mb-1 text-sm uppercase">Teléfono</h2>
                <a
                  href="tel:+34645805758"
                  className="text-[#2d2d2d]/70 text-sm hover:text-[#ff9a8b] transition-colors"
                >
                  +34 645 80 57 58
                </a>
                <p className="text-[#2d2d2d]/40 text-xs mt-1">Reservas y consultas</p>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ffc1b3]/20 flex gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-[#ff9a8b]/30 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-[#ff9a8b]" />
              </div>
              <div>
                <h2 className="text-[#1a1a1a] font-medium tracking-wider mb-1 text-sm uppercase">Email</h2>
                <a
                  href="mailto:gangnam.sevilla@gmail.com"
                  className="text-[#2d2d2d]/70 text-sm hover:text-[#ff9a8b] transition-colors"
                >
                  gangnam.sevilla@gmail.com
                </a>
                <p className="text-[#2d2d2d]/40 text-xs mt-1">Te respondemos en 24h</p>
              </div>
            </div>

            {/* Horario */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ffc1b3]/20 flex gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-[#ff9a8b]/30 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#ff9a8b]" />
              </div>
              <div>
                <h2 className="text-[#1a1a1a] font-medium tracking-wider mb-1 text-sm uppercase">Horario</h2>
                <p className="text-[#2d2d2d]/70 text-sm leading-relaxed">
                  Lun–Mar, Jue–Dom<br />
                  13:15–16:45 · 20:15–23:45
                </p>
                <p className="text-[#ff9a8b] text-xs mt-1">Miércoles cerrado</p>
              </div>
            </div>
          </motion.div>

          {/* Instagram */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-[#ffc1b3]/20 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full border-2 border-[#ff9a8b]/30 flex items-center justify-center shrink-0">
              <Instagram className="w-5 h-5 text-[#ff9a8b]" />
            </div>
            <div>
              <h2 className="text-[#1a1a1a] font-medium tracking-wider mb-1 text-sm uppercase">Instagram</h2>
              <a
                href="https://www.instagram.com/r.c.gangnam"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2d2d2d]/70 text-sm hover:text-[#ff9a8b] transition-colors"
              >
                @r.c.gangnam
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link to="/">
              <button
                onClick={() => setTimeout(() => document.getElementById('reserva')?.scrollIntoView({ behavior: 'smooth' }), 100)}
                className="bg-gradient-to-r from-[#ff9a8b] via-[#ffc1b3] to-[#d4a5ff] text-white rounded-xl px-10 py-4 text-sm tracking-[0.2em] transition-all duration-350 font-medium hover:shadow-2xl hover:scale-105"
              >
                RESERVAR MESA
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}