import React, { useState } from 'react';
import { Download, Mail } from 'lucide-react';

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
    <section className="py-16 bg-green-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-green-800/60 rounded-3xl p-8 md:p-12 border border-green-700 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Mail className="h-12 w-12 text-green-300" />
            <h2 className="text-3xl font-bold">আমাকে ইমেইল করুন</h2>
            <p className="text-green-100 text-lg text-center max-w-2xl">
              লাইফস্টাইল বা ডায়েট সম্পর্কিত অনুরোধ, প্রশ্ন বা হেল্পের জন্য আপনার ইমেইলটি দিন।
              আমি ব্যক্তিগতভাবে উত্তর দেব এবং পরবর্তী ধাপগুলো আদান-প্রদান করব। এই ফর্ম কোনো ফ্রি পিডিএফ ডাউনলোড নয়।
            </p>
            <p className="text-xs text-green-200">পাঠানোর পর probalofficial007@gmail.com এ একটি ইমেইল উইন্ডো খুলবে।</p>
          </div>

          {status === 'success' ? (
            <div className="bg-green-600 text-white p-4 rounded-lg mt-6 animate-fade-in">
              <p className="font-bold">ধন্যবাদ! আপনার মেইল তালিকাভুক্ত হয়েছে, দ্রুত আপনার সাথে যোগাযোগ করব।</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mt-6">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-lg leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-400"
                  placeholder="আপনার ইমেইল অ্যাড্রেস"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 border border-transparent text-base font-medium rounded-lg text-green-900 bg-green-300 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-900 focus:ring-white transition-colors"
              >
                পাঠান
              </button>
            </form>
          )}
          <p className="text-green-400 text-xs mt-4 text-center">
            আমরা স্প্যামিং পছন্দ করি না। আপনার ইমেইল ১০০% নিরাপদ, কোন পিডিএফ সংযুক্ত নেই।
          </p>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnet;
