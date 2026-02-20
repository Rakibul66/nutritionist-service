import React from 'react';
import Navbar from '../components/Navbar';
import Services from '../components/Services';
import Footer from '../components/Footer';

const ServicesLandingPage: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <main>
      <Services />
    </main>
    <Footer />
  </div>
);

export default ServicesLandingPage;
