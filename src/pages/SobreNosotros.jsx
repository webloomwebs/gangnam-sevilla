import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function SobreNosotros() {
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
            <p className="text-[#ff9a8b] text-sm tracking-[0.3em] mb-4">NUESTRA HISTORIA</p>
            <h1 className="text-[#1a1a1a] text-3xl md:text-5xl font-extralight tracking-wide mb-6">
              Sobre Gangnam Sevilla
            </h1>
            <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#ff9a8b] to-transparent mx-auto" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="prose prose-lg max-w-none text-[#2d2d2d]/80 space-y-6 leading-relaxed"
          >
            <p>
              Gangnam Sevilla es un restaurante de cocina coreana auténtica ubicado en el corazón del casco antiguo de Sevilla, en la calle San Felipe 11. Nuestro nombre rinde homenaje al icónico barrio de Gangnam en Seúl, símbolo de modernidad, energía y sofisticación — valores que trasladamos a cada plato que servimos.
            </p>
            <p>
              Nuestro restaurante nació con una misión clara: acercar la gastronomía coreana a los sevillanos y a todos los visitantes que recorren esta ciudad. La cocina coreana es una de las más ricas y variadas del mundo, con sabores profundos, texturas únicas y una tradición culinaria milenaria que merece ser conocida y disfrutada.
            </p>
            <p>
              En Gangnam encontrarás una carta cuidadosamente seleccionada con los platos más representativos de Corea: desde el crujiente y adictivo pollo frito coreano hasta el reconfortante bibimbap de ternera, pasando por el ramen vegetal, el jajangmyeon con su intensa salsa negra, el tteokbokki con su punto picante y muchas más especialidades que cambian según la temporada.
            </p>
            <p>
              Trabajamos con ingredientes frescos y de calidad, respetando las recetas tradicionales pero adaptándolas al paladar local. Cada plato está elaborado con dedicación y cariño, para que cada visita a Gangnam sea una experiencia memorable.
            </p>
            <p>
              Nuestro espacio es íntimo y acogedor, con capacidad para 49 personas, pensado para disfrutar de una comida tranquila en buena compañía. Abrimos de lunes a domingo (excepto miércoles) tanto en el servicio de comidas como de cenas, y ofrecemos la posibilidad de reservar mesa directamente desde nuestra web para garantizarte la mejor experiencia.
            </p>
            <p>
              Si eres amante de la cultura asiática, un explorador gastronómico o simplemente tienes curiosidad por descubrir nuevos sabores, Gangnam Sevilla es tu lugar. Te esperamos en el centro de Sevilla para compartir contigo lo mejor de la cocina coreana.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-14"
          >
            <Link
              to="/#reserva"
              onClick={() => setTimeout(() => document.getElementById('reserva')?.scrollIntoView({ behavior: 'smooth' }), 100)}
            >
              <button className="bg-gradient-to-r from-[#ff9a8b] via-[#ffc1b3] to-[#d4a5ff] text-white rounded-xl px-10 py-4 text-sm tracking-[0.2em] transition-all duration-350 font-medium hover:shadow-2xl hover:scale-105">
                RESERVAR MESA
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}