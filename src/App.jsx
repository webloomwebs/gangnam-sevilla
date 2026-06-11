import { Toaster } from "@/components/ui/toaster"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';
import SobreNosotros from './pages/SobreNosotros';
import Contacto from './pages/Contacto';
import AvisoLegal from './pages/AvisoLegal';
import PoliticaPrivacidad from './pages/PoliticaPrivacidad';
import PoliticaCookies from './pages/PoliticaCookies';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Menu" element={<Menu />} />
        <Route path="/SobreNosotros" element={<SobreNosotros />} />
        <Route path="/Contacto" element={<Contacto />} />
        <Route path="/AvisoLegal" element={<AvisoLegal />} />
        <Route path="/PoliticaPrivacidad" element={<PoliticaPrivacidad />} />
        <Route path="/PoliticaCookies" element={<PoliticaCookies />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App
