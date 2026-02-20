import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import HealthCalculators from '../components/HealthCalculators';
import ChildGrowthChecker from '../components/ChildGrowthChecker';
import Footer from '../components/Footer';

const ToolsPage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsLoaded(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <HealthCalculators />
        </div>
        <div className={`transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <ChildGrowthChecker />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ToolsPage;
