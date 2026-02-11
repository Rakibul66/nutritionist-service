import React, { useEffect, useState } from 'react';
import { CheckCircle, HeartPulse, Apple, Baby, Brain, Calendar, X, ExternalLink, Copy, Check, Smartphone } from 'lucide-react';
import { Service } from '../types';
import { fetchServices } from '../services/dataService';

const iconMap: Record<string, React.ReactNode> = {
  HeartPulse: <HeartPulse className="h-6 w-6" />,
  Apple: <Apple className="h-6 w-6" />,
  Baby: <Baby className="h-6 w-6" />,
  Brain: <Brain className="h-6 w-6" />,
};

const serviceImages: Record<string, string> = {
  '1': 'https://raw.githubusercontent.com/Rakibul66/Recent-Project-Apk/refs/heads/main/a.webp',
  '2': 'https://raw.githubusercontent.com/Rakibul66/Recent-Project-Apk/refs/heads/main/b.webp',
  '3': 'https://raw.githubusercontent.com/Rakibul66/Recent-Project-Apk/refs/heads/main/1770827153538.webp',
};

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [copied, setCopied] = useState(false);

  const paymentDetails = {
    bkash: { number: "01724253648", color: "bg-[#D12053]", label: "bKash" },
    nagad: { number: "01827664306", color: "bg-[#F7941D]", label: "Nagad" }
  };

  useEffect(() => {
    const loadServices = async () => {
      const data = await fetchServices();
      setServices(data);
    };
    loadServices();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const awarenessItems = [
    {
      title: 'ঝটপট শক্তি পুনরুদ্ধার',
      description: 'প্রতি খাবারে কার্বোহাইড্রেট, প্রোটিন ও ফাইবারের ভারসাম্য ধরে রাখলে দিনের মাঝখানে ক্লান্তি দূর হয়।'
    },
    {
      title: 'মাইক্রোনিউট্রিয়েন্টের গুরুত্ব',
      description: 'ভিটামিন ও খনিজের উৎসগুলোতে মনোযোগ দিলে রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি পায়।'
    },
    {
      title: 'পর্যাপ্ত জল পান',
      description: 'প্রতিদিন ৮-১০ গ্লাস জল শরীরের টক্সিন দূর করে, পুষ্টি শোষণের জন্য দরকার।'
    }
  ];

  return (
    <section id="services" className="py-20 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] p-8">
            <div className="space-y-4">
              <span className="text-xs font-semibold tracking-widest text-emerald-600 uppercase">Nutrition Awareness</span>
              <h2 className="text-3xl font-bold text-slate-900">আপনার শরীর জানতে চায় নিয়মিত সাশ্রয়ী পুষ্টি</h2>
              <p className="text-slate-500">প্রত্যেকটি সেবা প্যাকেজের ওপরে আমাদের মূল দৃষ্টিকোণ হল বাংলা ভাষায় সহজ, বাস্তবসম্মত পুষ্টি সচেতনতা ছড়িয়ে দেওয়া। শরীর ও মানসিক সুস্থতার জন্য প্রথমে জানতে হবে কী খাচ্ছি ও কেন খাচ্ছি। নিচের আইটেমগুলো সেই সচেতনতার শুরুর কিছু অনুকরণীয় চলন।</p>
              <div className="grid gap-3 md:grid-cols-3">
                {awarenessItems.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs font-semibold text-slate-700 shadow-sm">
                    <p className="text-slate-900 text-sm font-bold mb-1">{item.title}</p>
                    <p className="text-[11px] font-medium leading-tight text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80"
                alt="Balanced nutrition awareness"
                className="h-full w-full max-h-72 rounded-2xl object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase">Our Services</span>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">পার্সোনালাইজড কনসালটেন্সি প্যাকেজ</h2>
          <p className="mt-3 text-base text-slate-500">আপনার শারীরিক লক্ষ্যের জন্য সঠিক সায়েন্টিফিক ডায়েট প্ল্যান বেছে নিন।</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative overflow-hidden">
                <img
                  src={serviceImages[service.id]}
                  alt={service.title}
                  className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-4 px-6 py-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{service.title}</h3>
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed">{service.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{service.price}</p>
                    <span className="text-[11px] uppercase tracking-widest text-slate-400 block">প্রতি মাসে</span>
                  </div>
                </div>
                <ul className="space-y-2 text-xs font-medium text-slate-600">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="mt-1 h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 pb-7">
                <button
                  onClick={() => setSelectedService(service)}
                  className="w-full rounded-full border border-slate-200 bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-200 active:translate-y-px"
                >
                  বুকিং দিন
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedService(null)} />
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-900">পেমেন্ট এবং বুকিং</h3>
                <p className="text-xs text-slate-400">অনুগ্রহ করে নিচের তথ্যগুলো অনুসরণ করুন</p>
              </div>
              <button onClick={() => setSelectedService(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Package Summary */}
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">প্যাকেজ</p>
                  <p className="text-sm font-bold text-slate-800">{selectedService.title}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">মোট মূল্য</p>
                  <p className="text-lg font-black text-emerald-600">{selectedService.price}</p>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => { setPaymentMethod('bkash'); setCopied(false); }}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all font-bold text-sm ${paymentMethod === 'bkash' ? 'border-[#D12053] text-[#D12053] bg-[#D12053]/5' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                >
                  <div className={`w-2 h-2 rounded-full ${paymentMethod === 'bkash' ? 'bg-[#D12053]' : 'bg-slate-200'}`} /> bKash
                </button>
                <button 
                  onClick={() => { setPaymentMethod('nagad'); setCopied(false); }}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all font-bold text-sm ${paymentMethod === 'nagad' ? 'border-[#F7941D] text-[#F7941D] bg-[#F7941D]/5' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                >
                  <div className={`w-2 h-2 rounded-full ${paymentMethod === 'nagad' ? 'bg-[#F7941D]' : 'bg-slate-200'}`} /> Nagad
                </button>
              </div>

              {/* Account Card */}
              <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Account Number (Agent)</span>
                    <h4 className="text-2xl font-mono font-bold tracking-wider mt-1">
                      {paymentDetails[paymentMethod].number}
                    </h4>
                  </div>
                  <button 
                    onClick={() => handleCopy(paymentDetails[paymentMethod].number)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed italic">
                  * অনুগ্রহ করে আপনার {paymentDetails[paymentMethod].label} অ্যাপ থেকে <b>CASH OUT</b> করুন।
                </p>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">আপনার পেমেন্ট নম্বর</label>
                  <input type="text" placeholder="01XXXXXXXXX" className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Transaction ID (TRX)</label>
                  <input type="text" placeholder="TXN ID" className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href="https://docs.google.com/forms/d/16clfqrw28B23CkQz1gwbSWe7JhWLcaxDYU0b3S-9uG4/viewform?fbclid=IwZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQPNDM3NjI2MzE2OTczNzg4AAEeYmRkHxEyGeaaGAUYm4OcY1CeW8ft-h0S7xVxTpd8RhK-4DlQfLcr5CG3juY_aem_VcvVH2xM57jvC9-8wfzNRQ&edit_requested=true&pli=1"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                  গুগল ফর্ম পূরণ করুন <ExternalLink className="h-4 w-4" />
                </a>
                <button className="p-3.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition-all">
                  পেমেন্ট সাবমিট করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Services;
