import React from 'react';
import Navbar from '../components/Navbar';
import Testimonials from '../components/Testimonials';
import FeedbackForm from '../components/FeedbackForm';
import Footer from '../components/Footer';

const ReviewsLandingPage: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <main>
      <FeedbackForm />
      <Testimonials />
    </main>
    <Footer />
  </div>
);

export default ReviewsLandingPage;
