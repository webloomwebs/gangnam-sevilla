import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PoliticaCookies() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef8f5] via-[#fff5f0] to-[#fef8f5]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-[#ff9a8b] hover:text-[#ffc1b3] transition-all duration-300">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm tracking-wider">VOLVER</span>
          </Link>
          <span className="text-[#ff9a8b] text-xl font-light tracking-[0.3em]">GANGNAM</span>
          <div className="w-24" />
        </div>
      </header>

      <div className="pt-28 pb-20 px-6 max-w-3xl mx-auto">
        <p className="text-[#ff9a8b] text-xs tracking-[0.3em] mb-3">LEGAL</p>
        <h1 className="text-4xl font-extralight tracking-wide text-[#1a1a1a] mb-8">Política de cookies</h1>
        <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#ff9a8b] to-transparent mb-12" />

        <div className="space-y-10 text-[#2d2d2d]/70 leading-relaxed">
          <Section title="¿Qué son las cookies?">
            <p>Las cookies son pequeños archivos de texto que se almacenan en el dispositivo del usuario cuando visita un sitio web. Este sitio web utiliza cookies para mejorar la experiencia del usuario y garantizar el correcto funcionamiento de la página.</p>
          </Section>

          <Section title="Tipos de cookies utilizadas">
            <div className="space-y-4">
              <div>
                <p className="font-medium text-[#1a1a1a]">Cookies técnicas</p>
                <p>Necesarias para el funcionamiento básico del sitio web. No requieren consentimiento del usuario.</p>
              </div>
              <div>
                <p className="font-medium text-[#1a1a1a]">Cookies de análisis</p>
                <p>Permiten analizar el comportamiento de los usuarios para mejorar el servicio. Requieren consentimiento previo.</p>
              </div>
              <div>
                <p className="font-medium text-[#1a1a1a]">Cookies de terceros</p>
                <p>En caso de utilizar servicios externos como Google Maps o herramientas de análisis, dichos servicios pueden instalar sus propias cookies sujetas a sus propias políticas de privacidad.</p>
              </div>
            </div>
          </Section>

          <Section title="Gestión de cookies">
            <p>El usuario puede aceptar, rechazar o configurar las cookies desde el banner mostrado al acceder al sitio web por primera vez. Asimismo, puede configurar su navegador para bloquear o eliminar las cookies instaladas.</p>
          </Section>

          <Section title="Base legal">
            <p>El tratamiento de datos derivado del uso de cookies se basa en el consentimiento del usuario, de conformidad con el artículo 22.2 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información (LSSI-CE) y el RGPD.</p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-lg font-medium text-[#1a1a1a] tracking-wide mb-3 pb-2 border-b border-[#ffc1b3]/30">{title}</h2>
      <div className="space-y-1">{children}</div>
    </div>
  );
}