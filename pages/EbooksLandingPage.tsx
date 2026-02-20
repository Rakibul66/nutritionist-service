import React from 'react';
import Navbar from '../components/Navbar';
import EbookStore from '../components/EbookStore';
import Footer from '../components/Footer';

const EbooksLandingPage: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <main>
      <EbookStore />
    </main>
    <Footer />
  </div>
);

export default EbooksLandingPage;
