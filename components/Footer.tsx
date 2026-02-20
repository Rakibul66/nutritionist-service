import React from 'react';
import { Facebook, Youtube, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white text-xl font-bold mb-4">Holistic Nutrition</h3>
            <p className="text-sm text-gray-400 max-w-sm">
              ন্যাচারাল হিলিং ও সায়েন্টিফিক নিউট্রিশনের মাধ্যমে সুস্থ থাকুন। আপনার এবং আপনার পরিবারের সুস্বাস্থ্যের বিশ্বস্ত সঙ্গী।
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">কুইক লিংক</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#services" className="hover:text-green-400">কনসালটেন্সি</a></li>
              <li><a href="#ebooks" className="hover:text-green-400">ইবুক স্টোর</a></li>
              <li><a href="#about" className="hover:text-green-400">আমার সম্পর্কে</a></li>
              <li><a href="#testimonials" className="hover:text-green-400">টেস্টিমোনিয়াল</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">যোগাযোগ</h4>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href="https://www.facebook.com/share/1Dw4WPemns/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-green-400"
              >
                <Facebook className="h-5 w-5" />
                Facebook
              </a>
              <a
                href="https://youtube.com/@probalkumarmondal?si=oDzoraMBDxMjGY8m"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-green-400"
              >
                <Youtube className="h-5 w-5" />
                YouTube
              </a>
              <a
                href="https://wa.me/01827664306"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-green-400"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Holistic Nutrition. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
