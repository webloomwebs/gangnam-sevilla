import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AvisoLegal() {
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
        <h1 className="text-4xl font-extralight tracking-wide text-[#1a1a1a] mb-8">Aviso legal</h1>
        <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#ff9a8b] to-transparent mb-12" />

        <div className="space-y-10 text-[#2d2d2d]/70 leading-relaxed">
          <Section title="Titular del sitio web">
            <p><strong className="text-[#1a1a1a]">Nombre:</strong> Yuxiang Zou</p>
            <p><strong className="text-[#1a1a1a]">NIF:</strong> Y1041243R</p>
            <p><strong className="text-[#1a1a1a]">Domicilio:</strong> Calle San Felipe 11, 41003 Sevilla, España</p>
            <p><strong className="text-[#1a1a1a]">Teléfono:</strong> +34 645 80 57 58</p>
            <p><strong className="text-[#1a1a1a]">Correo electrónico:</strong> gangnam.sevilla@gmail.com</p>
          </Section>

          <Section title="Objeto">
            <p>El presente sitio web tiene como finalidad ofrecer información sobre el restaurante Gangnam, su carta, servicios y permitir el contacto o reservas por parte de los usuarios.</p>
          </Section>

          <Section title="Condiciones de uso">
            <p>El acceso y uso de este sitio web atribuye la condición de usuario e implica la aceptación de las condiciones aquí descritas.</p>
          </Section>

          <Section title="Propiedad intelectual">
            <p>Todos los contenidos del sitio web (textos, imágenes, diseño, logotipos y estructura) son propiedad del titular o cuentan con licencia de uso. Queda prohibida su reproducción sin autorización expresa.</p>
          </Section>

          <Section title="Responsabilidad">
            <p>El titular no se responsabiliza del uso indebido de los contenidos de la web por parte de los usuarios.</p>
          </Section>

          <Section title="Legislación aplicable">
            <p>Este sitio web se rige por la legislación española, siendo competentes para la resolución de cualquier controversia los juzgados y tribunales españoles.</p>
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