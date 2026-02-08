import React, { useState } from 'react';
import { Download, Mail } from 'lucide-react';

const LeadMagnet: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Simulate API call
      setTimeout(() => {
        setStatus('success');
        setEmail('');
      }, 1000);
    }
  };

  return (
    <section className="py-16 bg-green-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-green-800/50 rounded-3xl p-8 md:p-12 border border-green-700 shadow-2xl backdrop-blur-sm">
          <Download className="h-12 w-12 text-green-300 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">ফ্রি ডাউনলোড করুন!</h2>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            "বাচ্চাদের টিফিনের ১০টি স্বাস্থ্যকর রেসিপি" - আমাদের এই এক্সক্লুসিভ পিডিএফ গাইডটি বিনামূল্যে পেতে আপনার ইমেইল দিন।
          </p>

          {status === 'success' ? (
            <div className="bg-green-600 text-white p-4 rounded-lg animate-fade-in">
              <p className="font-bold">ধন্যবাদ! আপনার ইমেইলে পিডিএফটি পাঠানো হয়েছে।</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
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
                ডাউনলোড
              </button>
            </form>
          )}
          <p className="text-green-400 text-xs mt-4">
            আমরা স্প্যামিং পছন্দ করি না। আপনার ইমেইল ১০০% নিরাপদ।
          </p>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnet;