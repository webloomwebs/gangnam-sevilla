import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

const COOKIE_TYPES = [
  { key: "technical", label: "Cookies técnicas", desc: "Necesarias para el funcionamiento del sitio. No se pueden desactivar.", locked: true },
  { key: "analytics", label: "Cookies de análisis", desc: "Nos ayudan a mejorar el sitio analizando cómo lo utilizan los usuarios.", locked: false },
  { key: "thirdparty", label: "Cookies de terceros", desc: "Servicios externos como mapas o analíticas de rendimiento.", locked: false },
];

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, thirdparty: false });

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const savePrefs = (selectedPrefs) => {
    localStorage.setItem("cookie_consent", JSON.stringify({ technical: true, ...selectedPrefs }));
    setVisible(false);
  };

  const acceptAll = () => savePrefs({ analytics: true, thirdparty: true });
  const rejectAll = () => savePrefs({ analytics: false, thirdparty: false });
  const saveCustom = () => savePrefs(prefs);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-3 md:p-6">
      <div
        className="max-w-4xl mx-auto rounded-2xl shadow-2xl p-4 md:p-6"
        style={{ background: "#1a1a1a", border: "1px solid #333" }}
      >
        {!showConfig ? (
          <div className="flex flex-col gap-3">
            <p className="text-xs md:text-sm leading-relaxed" style={{ color: "rgba(245,240,232,0.85)" }}>
              Utilizamos cookies para mejorar tu experiencia. Puedes aceptarlas, rechazarlas o{" "}
              <button onClick={() => setShowConfig(true)} className="text-[#ff9a8b] hover:underline">
                configurarlas
              </button>
              . Más info en nuestra{" "}
              <Link to="/PoliticaCookies" className="text-[#ff9a8b] hover:underline">
                Política de cookies
              </Link>
              .
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={rejectAll}
                className="px-3 py-1.5 text-xs rounded-lg transition-all duration-300"
                style={{ color: "rgba(245,240,232,0.55)", border: "1px solid #444" }}
              >
                Rechazar
              </button>
              <button
                onClick={() => setShowConfig(true)}
                className="px-3 py-1.5 text-xs rounded-lg transition-all duration-300"
                style={{ color: "rgba(245,240,232,0.55)", border: "1px solid #444" }}
              >
                Configurar
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-1.5 text-xs text-white rounded-lg hover:shadow-lg transition-all duration-300"
                style={{ background: "linear-gradient(to right, #ff9a8b, #ffc1b3)" }}
              >
                Aceptar todas
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-5">
              <p className="font-medium tracking-wide" style={{ color: "#f5f0e8" }}>Configurar cookies</p>
              <button onClick={() => setShowConfig(false)} style={{ color: "rgba(245,240,232,0.4)" }}
                className="hover:opacity-80 transition-opacity">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4 mb-6">
              {COOKIE_TYPES.map(c => (
                <div key={c.key} className="flex items-start justify-between gap-4 pb-4"
                  style={{ borderBottom: "1px solid #2d2d2d" }}>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: "rgba(245,240,232,0.9)" }}>{c.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(245,240,232,0.4)" }}>{c.desc}</p>
                  </div>
                  {c.locked ? (
                    <span className="text-xs mt-1 shrink-0" style={{ color: "#ff9a8b" }}>Siempre activas</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPrefs(p => ({ ...p, [c.key]: !p[c.key] }))}
                      className="shrink-0 mt-0.5 w-10 h-6 rounded-full transition-all duration-300 relative"
                      style={{
                        background: prefs[c.key]
                          ? "linear-gradient(to right, #ff9a8b, #ffc1b3)"
                          : "#333",
                      }}
                    >
                      <span
                        className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow"
                        style={{ left: prefs[c.key] ? "22px" : "4px" }}
                      />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={rejectAll}
                className="px-4 py-2 text-sm rounded-lg transition-all"
                style={{ color: "rgba(245,240,232,0.55)", border: "1px solid #444" }}>
                Solo esenciales
              </button>
              <button onClick={saveCustom}
                className="px-4 py-2 text-sm rounded-lg transition-all"
                style={{ color: "rgba(245,240,232,0.55)", border: "1px solid #444" }}>
                Guardar preferencias
              </button>
              <button onClick={acceptAll}
                className="px-5 py-2 text-sm text-white rounded-lg hover:shadow-lg transition-all"
                style={{ background: "linear-gradient(to right, #ff9a8b, #ffc1b3)" }}>
                Aceptar todas
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}