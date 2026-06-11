import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PoliticaPrivacidad() {
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
        <h1 className="text-4xl font-extralight tracking-wide text-[#1a1a1a] mb-8">Política de privacidad</h1>
        <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#ff9a8b] to-transparent mb-12" />

        <div className="space-y-10 text-[#2d2d2d]/70 leading-relaxed">
          <Section title="Responsable del tratamiento">
            <p><strong className="text-[#1a1a1a]">Nombre:</strong> Yuxiang Zou</p>
            <p><strong className="text-[#1a1a1a]">NIF:</strong> Y1041243R</p>
            <p><strong className="text-[#1a1a1a]">Dirección:</strong> Calle San Felipe 11, 41003 Sevilla, España</p>
            <p><strong className="text-[#1a1a1a]">Teléfono:</strong> +34 645 80 57 58</p>
          </Section>

          <Section title="Finalidad del tratamiento">
            <p>Los datos personales que el usuario facilite a través de formularios de contacto o reservas se utilizarán únicamente para gestionar consultas, reservas o comunicaciones relacionadas con el restaurante.</p>
          </Section>

          <Section title="Base legal">
            <p>El consentimiento del usuario al enviar sus datos mediante los formularios de la web, de conformidad con el Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018, de 5 de diciembre (LOPDGDD).</p>
          </Section>

          <Section title="Conservación de los datos">
            <p>Los datos se conservarán únicamente durante el tiempo necesario para atender la solicitud del usuario o mientras exista una relación comercial. Transcurrido dicho plazo, los datos serán suprimidos.</p>
          </Section>

          <Section title="Derechos del usuario">
            <p>El usuario puede ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad de sus datos enviando una solicitud por escrito al responsable del tratamiento a la dirección indicada o al correo electrónico de contacto.</p>
          </Section>

          <Section title="Seguridad de los datos">
            <p>Se adoptan las medidas técnicas y organizativas necesarias para proteger los datos personales contra el acceso no autorizado, pérdida accidental, destrucción o alteración.</p>
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