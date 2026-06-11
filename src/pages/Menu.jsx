import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Menu() {
  const menuImages = [
    "/images/d2dbca106_1.png",
    "/images/20b5f03df_2.png",
    "/images/20b23bbfb_3.png",
    "/images/aaa68b95c_4.png",
    "/images/42312b8c2_WhatsAppImage2026-02-17at153135.jpg",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef8f5] via-[#fff5f0] to-[#fef8f5]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={createPageUrl("Home")}>
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
            <span className="text-[#ff9a8b] text-2xl md:text-3xl font-light tracking-[0.3em]">CARTA</span>
          </motion.div>

          <div className="w-24"></div>
        </div>
      </header>

      {/* Menu Content */}
      <div className="pt-24 pb-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <p className="text-[#ff9a8b] text-sm tracking-[0.3em] mb-4">NUESTRO MENÚ COMPLETO</p>
            <h1 className="text-[#1a1a1a] text-3xl md:text-5xl font-extralight tracking-wide">Carta Gangnam Sevilla</h1>
            <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#ff9a8b] to-transparent mx-auto mt-6" />
          </motion.div>

          {/* Menu Images */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {menuImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#ffc1b3]/20"
              >
                <img
                  src={image}
                  alt={`Página ${index + 1} del menú`}
                  className="w-full h-auto"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}