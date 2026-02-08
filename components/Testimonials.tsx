import React, { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import { Testimonial } from '../types';
import { fetchTestimonials } from '../services/dataService';

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetchTestimonials().then(setTestimonials);
  }, []);

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">সাফল্যের গল্প</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            ক্লায়েন্টরা কি বলছেন?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div key={item.id} className="bg-white p-8 rounded-2xl shadow-sm relative hover:-translate-y-1 transition-transform duration-300">
              <Quote className="h-10 w-10 text-green-200 absolute top-6 left-6" />
              <div className="relative z-10">
                <p className="text-gray-600 mb-6 italic pt-6">"{item.content}"</p>
                <div className="flex items-center">
                  <img
                    className="h-12 w-12 rounded-full object-cover mr-4 ring-2 ring-green-100"
                    src={item.image}
                    alt={item.name}
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;