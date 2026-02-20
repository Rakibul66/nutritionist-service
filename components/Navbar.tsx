import React, { useEffect, useRef, useState } from 'react';
import { Menu, X, Leaf } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setAvatarFailed(false);
  }, [user?.photoURL]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!profileMenuRef.current) return;
      if (!profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const navLinks = [
    { name: 'হোম', href: '/#hero' },
    { name: 'ক্যালকুলেটর', href: '/tools' },
    { name: 'সার্ভিস', href: '/services' },
    { name: 'বইসমূহ', href: '/ebooks' },
    { name: 'রিভিউ', href: '/reviews' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => (window.location.href = '/')}>
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
            {user ? (
              <div className="flex items-center gap-2">
                <a
                  href="/orders"
                  className="rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-100"
                >
                  অর্ডার
                </a>
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setProfileMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-2.5 py-1"
                  >
                    {user.photoURL && !avatarFailed ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="h-7 w-7 rounded-full object-cover"
                        onError={() => setAvatarFailed(true)}
                      />
                    ) : null}
                    <span className="text-xs font-semibold text-gray-700 max-w-[100px] truncate">
                      {user.displayName || user.email}
                    </span>
                  </button>
                  {profileMenuOpen ? (
                    <div className="absolute right-0 top-11 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                      <a
                        href="/orders"
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                      >
                        অর্ডার
                      </a>
                      <button
                        onClick={async () => {
                          await logout();
                          setProfileMenuOpen(false);
                        }}
                        className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-700 hover:bg-rose-50"
                      >
                        লগআউট
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <a
                href="/login"
                className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
              >
                লগইন করুন
              </a>
            )}
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
            {user ? (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-green-50 border border-green-100">
                  {user.photoURL && !avatarFailed ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                      onError={() => setAvatarFailed(true)}
                    />
                  ) : null}
                  <span className="text-sm font-medium text-gray-700 truncate">{user.displayName || user.email}</span>
                </div>
                <a
                  href="/orders"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center rounded-md border border-green-200 bg-green-50 px-3 py-2 text-base font-medium text-green-700 hover:bg-green-100"
                >
                  অর্ডার
                </a>
                <button
                  onClick={async () => {
                    await logout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-center bg-green-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-green-700"
                >
                  লগআউট
                </button>
              </div>
            ) : (
              <a
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-green-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-green-700 mt-4"
              >
                লগইন করুন
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
