import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative bg-green-50 pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="order-2 md:order-1 text-center md:text-left">
            <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-green-700 text-sm font-semibold mb-4">
              ✨ ইন্টিগ্রেটিভ নিউট্রিশন এপ্রোচ
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              মেডিসিন ছাড়াই <span className="text-green-600">মেটাবলিক হেলথ</span> পুনরুদ্ধার করুন
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              মডার্ন সায়েন্স ও ট্র্যাডিশনাল নলেজের সমন্বয়ে সুস্থ থাকার গাইডলাইন। আমি কেবল ক্যালোরি কাউন্ট করি না, হরমোনাল ব্যালেন্স নিয়ে কাজ করি।
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="#services"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-green-600 hover:bg-green-700 transition-all shadow-lg hover:shadow-green-500/30"
              >
                কনসালটেন্সি বুক করুন
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="#ebooks"
                className="inline-flex items-center justify-center px-8 py-3 border border-green-600 text-base font-medium rounded-full text-green-700 bg-transparent hover:bg-green-50 transition-all"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                ইবুক কিনুন
              </a>
            </div>
          </div>

          {/* Image Content */}
          <div className="order-1 md:order-2 flex justify-center relative">
            <div className="relative w-80 h-80 md:w-96 md:h-96">
               {/* Abstract decorative blobs */}
               <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-yellow-200 rounded-full blur-2xl opacity-60"></div>
               <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-32 h-32 bg-green-200 rounded-full blur-2xl opacity-60"></div>
               
               <img
                 src="https://raw.githubusercontent.com/Rakibul66/nutritionist-service/refs/heads/main/1770625746041.png"
                 alt="Nutritionist Profile"
                 className="w-full h-full object-cover rounded-3xl shadow-2xl relative z-10 border-4 border-white"
               />
               
               {/* Floating Card */}
               <div className="absolute -bottom-6 -left-6 md:-left-12 bg-white p-4 rounded-xl shadow-xl z-20 flex items-center gap-3 animate-bounce" style={{animationDuration: '3s'}}>
                  <div className="bg-green-100 p-2 rounded-full">
                    <span className="text-2xl">🥗</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">1000+ ক্লায়েন্ট</p>
                    <p className="text-xs text-gray-500">সাফল্যের সাথে সুস্থ হয়েছেন</p>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
