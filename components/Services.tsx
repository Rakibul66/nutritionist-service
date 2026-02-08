import React, { useEffect, useState } from 'react';
import { CheckCircle, HeartPulse, Apple, Baby, Brain, Calendar, X, DollarSign, ExternalLink } from 'lucide-react';
import { Service } from '../types';
import { fetchServices } from '../services/dataService';

const iconMap: Record<string, React.ReactNode> = {
  HeartPulse: <HeartPulse className="h-8 w-8 text-white" />,
  Apple: <Apple className="h-8 w-8 text-white" />,
  Baby: <Baby className="h-8 w-8 text-white" />,
  Brain: <Brain className="h-8 w-8 text-white" />,
};

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      const data = await fetchServices();
      setServices(data);
    };
    loadServices();
  }, []);

  return (
    <section id="services" className="py-20 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">সার্ভিসসমূহ</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            পার্সোনালাইজড কনসালটেন্সি প্যাকেজ
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            আপনার শারীরিক অবস্থা এবং লক্ষ্যের উপর ভিত্তি করে সায়েন্টিফিক ডায়েট প্ল্যান।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
              <div className="p-8 flex-1">
                <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-600/30">
                  {iconMap[service.iconName]}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <div className="text-3xl font-bold text-green-600 mb-6">{service.price}<span className="text-base font-normal text-gray-400">/মাস</span></div>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-gray-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <button 
                  onClick={() => setSelectedService(service)}
                  className="w-full flex items-center justify-center bg-gray-900 text-white px-4 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  বুকিং দিন
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
             <p className="text-gray-500 text-sm">
                * কনসালটেন্সি ভিডিও কল বা অডিও কলের মাধ্যমে প্রদান করা হয়। পেমেন্টের পর শিডিউল কনফার্ম করা হবে।
             </p>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              aria-hidden="true"
              onClick={() => setSelectedService(null)}
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full animate-scale-up">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
                <button 
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-xl leading-6 font-bold text-gray-900 text-center mb-6" id="modal-title">
                    বুকিং কনফার্মেশন
                  </h3>
                  
                  {/* Service Info */}
                  <div className="bg-green-50 p-4 rounded-xl text-center mb-6 border border-green-100">
                    <p className="text-green-800 font-medium">{selectedService.title}</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{selectedService.price}</p>
                  </div>

                  <div className="space-y-5">
                    {/* Payment Instruction */}
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                      <div className="flex items-start">
                        <DollarSign className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="ml-3">
                          <p className="text-sm font-bold text-yellow-800 mb-1">
                            পেমেন্ট ইনস্ট্রাকশন
                          </p>
                          <p className="text-sm text-yellow-700">
                            বুকিং নিশ্চিত করতে নিচের নাম্বারে সেন্ড মানি করুন:
                          </p>
                          <p className="mt-2 text-lg font-bold text-gray-800 tracking-wider">
                            01700-000000
                          </p>
                          <p className="text-xs text-gray-500">(বিকাশ/নগদ Personal)</p>
                        </div>
                      </div>
                    </div>

                    {/* Google Form Action */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-3">
                        পেমেন্ট সম্পন্ন হলে নিচের বাটনে ক্লিক করে ফর্মটি পূরণ করুন।
                      </p>
                      <a 
                        href="https://docs.google.com/forms" // Replace with actual Google Form URL
                        target="_blank"
                        rel="noreferrer"
                        className="w-full inline-flex justify-center items-center rounded-xl border border-transparent shadow-sm px-4 py-3 bg-green-600 text-base font-bold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      >
                        গুগল ফর্ম পূরণ করুন <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </div>
                    
                    {/* Delivery Promise */}
                    <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 text-center border border-blue-100">
                      <p>
                        📢 <span className="font-bold">গুরুত্বপূর্ণ:</span> ফর্ম সাবমিট করার <span className="font-extrabold underline decoration-blue-300">৪৮ ঘন্টার</span> মধ্যে আপনার WhatsApp নাম্বারে বিস্তারিত ডায়েট চার্ট পাঠানো হবে।
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Services;