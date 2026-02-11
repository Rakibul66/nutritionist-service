import React from 'react';
import { Award, GraduationCap, CheckCircle, Activity } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Text Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-green-600 font-bold tracking-widest uppercase text-sm">আমার সম্পর্কে</span>
              <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                নিউট্রিশন এবং <br /> 
                <span className="text-green-600">লাইফস্টাইল বিশেষজ্ঞ</span>
              </h2>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed">
              আমি ঢাকা বিশ্ববিদ্যালয়ের (INFS) একজন গ্রাজুয়েট। গত ৫ বছর ধরে <span className="font-semibold text-gray-800 underline decoration-green-400">PCOS এবং মেটাবলিক সিনড্রোম</span> সমাধানে কাজ করছি। আমার লক্ষ্য—সঠিক খাদ্যাভ্যাসের মাধ্যমে দীর্ঘমেয়াদী সুস্থতা।
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100 transition-hover hover:shadow-md">
                <GraduationCap className="h-6 w-6 text-green-600 mb-2" />
                <h4 className="font-bold text-gray-900">B.Sc & M.Sc</h4>
                <p className="text-xs text-gray-500 uppercase">INFS, DU</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100 transition-hover hover:shadow-md">
                <Award className="h-6 w-6 text-green-600 mb-2" />
                <h4 className="font-bold text-gray-900">৫+ বছর</h4>
                <p className="text-xs text-gray-500 uppercase">অভিজ্ঞতা</p>
              </div>
            </div>
          </div>

          {/* Right Side: Features/Points */}
          <div className="bg-green-50 p-8 rounded-[2rem] space-y-6">
            <h3 className="text-xl font-bold text-gray-900">কেন আমাকে বেছে নেবেন?</h3>
            <div className="space-y-4">
              {[
                'বিজ্ঞানসম্মত ডায়েট চার্ট',
                'কোনো পার্শ্বপ্রতিক্রিয়া নেই',
                'লাইফস্টাইল মডিফিকেশন',
                'পার্সোনালাইজড কেয়ার'
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-4">
               <p className="text-sm italic text-green-700">"সুস্থতা একটি গন্তব্য নয়, এটি একটি যাত্রাপথ।"</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;