import React, { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import { Testimonial } from '../types';
import { fetchApprovedTestimonials } from '../services/firebaseService';

const getInitial = (name: string) => {
  const trimmed = name.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : 'U';
};

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchApprovedTestimonials().then(setTestimonials).catch(() => setTestimonials([]));
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [testimonials.length]);

  useEffect(() => {
    if (!testimonials.length) return;
    if (activeIndex > testimonials.length - 1) {
      setActiveIndex(0);
    }
  }, [activeIndex, testimonials.length]);

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section id="testimonials" className="py-12 bg-[#EEF1F1]">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-3xl leading-8 font-extrabold tracking-tight text-[#1F2937] sm:text-4xl">
            ক্লায়েন্টরা কি বলছেন?
          </p>
          <p className="mt-2 text-sm text-slate-500 max-w-3xl mx-auto">
            আমাদের সেবা নিয়ে ক্লায়েন্টদের বাস্তব মতামত দেখুন।
          </p>
        </div>

        {testimonials.length ? (
          <div className="mx-auto w-full max-w-5xl rounded-3xl border border-[#DDE3E3] bg-[#E8EDED] p-5 shadow-sm sm:p-6">
            <article key={activeTestimonial.id} className="transition-all duration-300">
              <div className="flex items-start justify-between gap-3">
                <Quote className="h-9 w-9 text-[#B7CFD0]" />
                {testimonials.length > 1 && (
                  <div className="flex items-center gap-1.5">
                    {testimonials.map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        aria-label={`Review ${index + 1}`}
                        className={`h-2.5 rounded-full transition-all ${
                          activeIndex === index ? 'w-6 bg-emerald-600' : 'w-2.5 bg-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center gap-1 text-base leading-none text-[#F4BE12]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={`${activeTestimonial.id}-star-${index}`}>★</span>
                ))}
              </div>

              <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">"{activeTestimonial.content}"</p>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-base font-bold text-white">
                  {getInitial(activeTestimonial.name)}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">{activeTestimonial.name}</h4>
                  <p className="text-sm text-slate-500">{activeTestimonial.role}</p>
                </div>
              </div>
            </article>
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-slate-200 p-6 text-center text-sm text-slate-500">
            এখনো কোনো approved feedback নেই।
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
