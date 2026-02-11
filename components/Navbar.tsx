import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Leaf } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'হোম', href: '#hero' },
    { name: 'আমার সম্পর্কে', href: '#about' },
    { name: 'সার্ভিস', href: '#services' },
    { name: 'বইসমূহ', href: '#ebooks' },
    { name: 'রিভিউ', href: '#testimonials' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.location.hash = '#'}>
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="font-bold text-xl text-gray-800 tracking-tight">
              Holistic<span className="text-green-600">Nutrition</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#services"
              className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
            >
              অ্যাপয়েন্টমেন্ট নিন
            </a>
            <Link
              to="/admin"
              className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl"
            >
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-green-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-gray-600 hover:text-green-600 hover:bg-green-50 px-3 py-2 rounded-md text-base font-medium"
              >
                {link.name}
              </a>
            ))}
            <a
               href="#services"
               onClick={() => setIsOpen(false)}
               className="block w-full text-center bg-green-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-green-700 mt-4"
            >
              অ্যাপয়েন্টমেন্ট নিন
            </a>
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-slate-900 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-slate-800 mt-2"
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
