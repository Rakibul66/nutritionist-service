import React, { useState } from 'react';
import { Mail } from 'lucide-react';

const LeadMagnet: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const mailto = `mailto:probalofficial007@gmail.com?subject=${encodeURIComponent(
      'Nutrition Consultation Request'
    )}&body=${encodeURIComponent(`Email: ${email}\n\nI would like to discuss...`)}`;
    window.location.href = mailto;
    setStatus('success');
    setEmail('');
  };

  return (
    <section className="py-14 bg-gradient-to-b from-emerald-900 to-emerald-800 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-700/80 bg-white/10 p-6 shadow-2xl backdrop-blur-sm md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div className="space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-200/15">
                <Mail className="h-6 w-6 text-emerald-100" />
              </div>
              <h2 className="text-3xl font-bold leading-tight">আমাকে ইমেইল করুন</h2>
              <p className="text-emerald-100 text-base leading-relaxed">
                লাইফস্টাইল বা ডায়েট সম্পর্কিত অনুরোধ, প্রশ্ন বা হেল্পের জন্য আপনার ইমেইল দিন। আমি ব্যক্তিগতভাবে রিপ্লাই করে
                পরবর্তী ধাপ শেয়ার করব।
              </p>
              <p className="text-xs text-emerald-200">
                সাবমিট করলে `probalofficial007@gmail.com`-এ মেইল উইন্ডো ওপেন হবে।
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 sm:p-5 text-slate-900 shadow-xl">
              {status === 'success' ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 animate-fade-in">
                  <p className="font-bold text-emerald-700">ধন্যবাদ! আপনার মেইল তালিকাভুক্ত হয়েছে, দ্রুত যোগাযোগ করব।</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">ইমেইল অ্যাড্রেস</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="আপনার ইমেইল অ্যাড্রেস"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 text-base font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                  >
                    পাঠান
                  </button>
                </form>
              )}
              <p className="text-[11px] text-slate-500 mt-3">আমরা স্প্যামিং করি না। আপনার তথ্য নিরাপদ।</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnet;
