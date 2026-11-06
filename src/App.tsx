import { useState } from 'react';
import { useI18n } from './i18n/I18nProvider';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Journey } from './components/Journey';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Services } from './components/Services';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Gate, shouldShowGate } from './components/Gate';
import { AdminUI } from './admin/AdminUI';
import { Chatbot } from './components/Chatbot';

export default function App() {
  const { t } = useI18n();
  const [gateOpen, setGateOpen] = useState(shouldShowGate);
  return (
    <>
      <a className="skip" href="#main">
        {t.a11y.skip}
      </a>
      <Nav />
      {gateOpen ? <Gate onDone={() => setGateOpen(false)} /> : null}
      <main id="main">
        <Hero />
        <About />
        <Journey />
        <Skills />
        <Projects />
        <Services />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
      <AdminUI />
    </>
  );
}
