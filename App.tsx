import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import EbookStore from './components/EbookStore';
import LeadMagnet from './components/LeadMagnet';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import AIChat from './components/AIChat';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <EbookStore />
        <LeadMagnet />
        <Testimonials />
      </main>
      <Footer />
      <AIChat />
    </div>
  );
}

export default App;