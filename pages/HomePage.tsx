import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import ChildGrowthChecker from '../components/ChildGrowthChecker';
import Services from '../components/Services';
import EbookStore from '../components/EbookStore';
import LeadMagnet from '../components/LeadMagnet';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const HomePage: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <main>
      <Hero />
      <About />
      <ChildGrowthChecker />
      <Services />
      <EbookStore />
      <Testimonials />
      <LeadMagnet />
    </main>
    <Footer />
  </div>
);

export default HomePage;
