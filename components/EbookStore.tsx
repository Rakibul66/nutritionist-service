import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BookCategory, Ebook } from '../types';
import { fetchRemoteEbooks, placeOrder } from '../services/firebaseService';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const categoryOptions: Array<'All' | BookCategory> = ['All', ...Object.values(BookCategory)];
const categoryLabels: Record<'All' | BookCategory, string> = {
  All: 'সব বই',
  [BookCategory.CHILD]: 'শিশু পুষ্টি',
  [BookCategory.BEAUTY]: 'বিউটি ও ওয়েলনেস',
  [BookCategory.THERAPEUTIC]: 'থেরাপিউটিক গাইড',
};

const EbookStore: React.FC = () => {
  const { user, login } = useAuth();
  const [books, setBooks] = useState<Ebook[]>([]);
  const [activeCategory, setActiveCategory] = useState<'All' | BookCategory>('All');
  const [loading, setLoading] = useState(true);
  const [orderModal, setOrderModal] = useState<Ebook | null>(null);
  const [orderPhone, setOrderPhone] = useState('');
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      const data = await fetchRemoteEbooks();
      setBooks(data);
      setLoading(false);
    };
    loadBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    return activeCategory === 'All'
      ? books
      : books.filter((book) => book.category === activeCategory);
  }, [activeCategory, books]);

  const scrollSlider = (direction: 'left' | 'right') => {
    const container = sliderRef.current;
    if (!container) return;
    const offset = container.clientWidth * 0.65;
    container.scrollBy({ left: direction === 'left' ? -offset : offset, behavior: 'smooth' });
  };

  const handleOrder = (book: Ebook) => {
    if (!user) {
      login();
      return;
    }
    setOrderModal(book);
    setOrderStatus(null);
  };

  const confirmOrder = async () => {
    if (!orderModal) return;
    setIsOrdering(true);
    try {
      await placeOrder({
        book: orderModal,
        user,
        phone: orderPhone,
        paymentMethod: 'Google Pay',
      });
      setOrderStatus(`${orderModal.title} জন্য অর্ডার নেওয়া হয়েছে`);
      setOrderPhone('');
      setOrderModal(null);
    } catch (error) {
      console.error(error);
      setOrderStatus('পেমেন্ট প্রক্রিয়ায় সমস্যা হয়েছে।');
    } finally {
      setIsOrdering(false);
    }
  };

  const getTierLabel = (book: Ebook) => {
    if (book.price === 0) return 'ফ্রি';
    if (book.price > 500) return 'প্রিমিয়াম';
    return 'পেইড';
  };

  return (
    <section id="ebooks" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <p className="text-base font-semibold text-emerald-600 tracking-[0.3em] uppercase">ইবুক স্টোর</p>
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">নলেজ হাব: সুস্থতার গাইডলাইন</h2>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">শ্রেণী</p>
            <p className="text-lg font-semibold text-slate-900">{categoryLabels[activeCategory]}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollSlider('left')}
              aria-label="ইবুক পেছনে"
              className="h-10 w-10 rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scrollSlider('right')}
              aria-label="ইবুক সামনে"
              className="h-10 w-10 rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-sm font-medium text-slate-600">
          {categoryOptions.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 transition ${
                activeCategory === category
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
          </div>
        ) : (
          <div
            ref={sliderRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 scroll-smooth px-2 min-h-[220px]"
          >
            {filteredBooks.length === 0 ? (
              <div className="flex w-full justify-center items-center text-sm text-slate-400">
                কোনো ইবুক পাওয়া যায়নি, পরে আবার দেখুন বা ক্যাটাগরি চেক করুন।
              </div>
            ) : (
              filteredBooks.map((book) => {
                const isFree = book.price === 0;
                const isDrive = Boolean(book.driveLink);
                const tier = getTierLabel(book);
                return (
                  <article
                    key={book.id}
                    className="group min-w-[260px] max-w-sm snap-start overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">
                      <img
                        src={encodeURI(book.coverImage)}
                        alt={book.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-slate-500 shadow">
                        {tier}
                      </div>
                      <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-900 shadow">
                        {categoryLabels[book.category]}
                      </div>
                      {isDrive && (
                        <div className="absolute bottom-3 right-3 rounded-full bg-emerald-600 text-white px-3 py-1 text-[10px] font-semibold uppercase tracking-widest">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-3 px-5 py-5">
                      <h3 className="text-lg font-semibold text-slate-900 leading-tight">{book.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{book.description}</p>
                      <div className="flex items-center justify-between gap-4 pt-2">
                        <span className="text-lg font-bold text-slate-900">
                          {isFree ? 'ফ্রি' : `৳${book.price}`}
                        </span>
                        {isFree ? (
                          <a
                            href={book.driveLink ?? '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-emerald-600 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition"
                          >
                            <ArrowUpRight className="h-4 w-4" />
                            ডাউনলোড করুন
                          </a>
                        ) : (
                          <button
                            onClick={() => handleOrder(book)}
                            className="rounded-full px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition"
                          >
                            কিনুন
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        )}

        {orderStatus && (
          <div className="text-center text-sm text-emerald-600">{orderStatus}</div>
        )}

        {orderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-slate-900/70" onClick={() => setOrderModal(null)} />
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4">
              <h4 className="text-lg font-bold text-slate-900">Order: {orderModal.title}</h4>
              <p className="text-sm text-slate-500">
                ইমেইল: {user?.email} · ৳{orderModal.price}
              </p>
              <div>
                <label className="text-xs uppercase tracking-widest text-slate-500">ফোন নম্বর</label>
                <input
                  value={orderPhone}
                  onChange={(event) => setOrderPhone(event.target.value)}
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>পেমেন্ট: Google Auth ইমেইল অনুযায়ী</span>
                <span>অর্ডার যাচাই সেকেন্ডে</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setOrderModal(null)}
                  className="flex-1 rounded-xl border border-slate-200 py-2 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmOrder}
                  disabled={isOrdering}
                  className="flex-1 rounded-xl bg-emerald-600 text-white py-2 text-sm font-semibold disabled:opacity-50"
                >
                  {isOrdering ? 'Processing…' : 'Confirm order'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EbookStore;
