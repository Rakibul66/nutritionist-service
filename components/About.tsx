import React from 'react';
import { Award, GraduationCap, Heart } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-16">
          <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">আমার সম্পর্কে</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            কেন আমাকে বেছে নেবেন?
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Authority Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative rounded-lg overflow-hidden shadow-lg">
               <img 
                 src="https://picsum.photos/800/600?random=60" 
                 alt="Working in lab or clinic" 
                 className="w-full h-auto object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                 <p className="text-white font-medium italic">"সুস্থতা একটি গন্তব্য নয়, এটি একটি যাত্রাপথ।"</p>
               </div>
            </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2 space-y-6">
            <p className="text-lg text-gray-600">
              আসসালামু আলাইকুম, আমি একজন <strong className="text-gray-900">কোয়ালিফাইড নিউট্রিশনিস্ট</strong> এবং <strong className="text-gray-900">পলিটেকনিক ইন্সট্রাক্টর</strong>। আমি ঢাকা বিশ্ববিদ্যালয়ের ইনস্টিটিউট অফ নিউট্রিশন অ্যান্ড ফুড সায়েন্স (INFS) থেকে গ্রাজুয়েশন সম্পন্ন করেছি।
            </p>
            <p className="text-lg text-gray-600">
              গত ৫ বছর ধরে আমি কাজ করছি <span className="text-green-600 font-semibold">PCOS, হাইপোথাইরয়েডিজম, এবং মেটাবলিক সিনড্রোম</span> নিয়ে। আমার ফিলোসফি হলো—শরীরের নিজস্ব হিলিং পাওয়ারকে জাগ্রত করা।
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <GraduationCap className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">B.Sc & M.Sc</h4>
                  <p className="text-sm text-gray-500">Institute of Nutrition and Food Science, DU</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Award className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">Certified</h4>
                  <p className="text-sm text-gray-500">Integrative Nutrition Health Coach</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;