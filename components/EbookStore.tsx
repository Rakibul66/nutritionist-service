import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BookCategory, Ebook, EbookOrder } from '../types';
import { fetchEbookOrderById, fetchRemoteEbooks, placeOrder } from '../services/firebaseService';
import { ArrowUpRight, Lock, Copy, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const categoryOptions: Array<'All' | BookCategory> = ['All', ...Object.values(BookCategory)];
const categoryLabels: Record<'All' | BookCategory, string> = {
  All: 'সব বই',
  [BookCategory.CHILD]: 'শিশু পুষ্টি',
  [BookCategory.BEAUTY]: 'বিউটি ও ওয়েলনেস',
  [BookCategory.THERAPEUTIC]: 'থেরাপিউটিক গাইড',
};

const EBOOK_ORDER_ACCESS_KEY = 'ebook-order-access-v1';
const FALLBACK_COVER_IMAGE =
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80';

const extractDriveFileId = (value: string): string | null => {
  const fileMatch = value.match(/\/file\/d\/([^/]+)/);
  if (fileMatch?.[1]) return fileMatch[1];
  const openMatch = value.match(/[?&]id=([^&]+)/);
  if (openMatch?.[1]) return openMatch[1];
  return null;
};

const resolveCoverImageUrl = (rawUrl?: string): string => {
  const safe = (rawUrl ?? '').trim();
  if (!safe) return FALLBACK_COVER_IMAGE;
  if (safe.includes('drive.google.com')) {
    const fileId = extractDriveFileId(safe);
    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }
  return encodeURI(safe);
};

const normalizeOrderStatus = (status?: string): 'pending' | 'approved' | 'rejected' | 'unknown' => {
  if (status === 'approved' || status === 'paid' || status === 'completed') return 'approved';
  if (status === 'rejected') return 'rejected';
  if (status === 'pending') return 'pending';
  return 'unknown';
};

const EbookStore: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [books, setBooks] = useState<Ebook[]>([]);
  const [activeCategory, setActiveCategory] = useState<'All' | BookCategory>('All');
  const [loading, setLoading] = useState(true);
  const [orderModal, setOrderModal] = useState<Ebook | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [paymentNumber, setPaymentNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [copied, setCopied] = useState(false);
  const [orderByEbookId, setOrderByEbookId] = useState<Record<string, EbookOrder>>({});
  const [recentSubmittedOrderId, setRecentSubmittedOrderId] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [sliderStepCount, setSliderStepCount] = useState(1);
  const [activeStep, setActiveStep] = useState(0);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const paymentDetails = {
    bkash: { number: '01724253648', label: 'bKash' },
    nagad: { number: '01827664306', label: 'Nagad' },
  };

  const readOrderAccessMap = (): Record<string, string> => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = window.localStorage.getItem(EBOOK_ORDER_ACCESS_KEY);
      if (!raw) return {};
      return JSON.parse(raw) as Record<string, string>;
    } catch {
      return {};
    }
  };

  const persistOrderAccess = (ebookId: string, orderId: string) => {
    if (typeof window === 'undefined') return;
    const map = readOrderAccessMap();
    map[ebookId] = orderId;
    window.localStorage.setItem(EBOOK_ORDER_ACCESS_KEY, JSON.stringify(map));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      const data = await fetchRemoteEbooks();
      setBooks(data);
      setLoading(false);
    };
    loadBooks();
  }, []);

  useEffect(() => {
    const hydrateOrderAccess = async () => {
      const accessMap = readOrderAccessMap();
      const entries = Object.entries(accessMap);
      if (!entries.length) {
        setOrderByEbookId({});
        return;
      }

      const pairs = await Promise.all(
        entries.map(async ([ebookId, orderId]) => {
          const order = await fetchEbookOrderById(orderId).catch(() => null);
          return [ebookId, order] as const;
        })
      );

      const nextMap: Record<string, EbookOrder> = {};
      pairs.forEach(([ebookId, order]) => {
        if (order) {
          nextMap[ebookId] = order;
        }
      });
      setOrderByEbookId(nextMap);
    };

    hydrateOrderAccess();
  }, [books.length]);

  const filteredBooks = useMemo(() => {
    return activeCategory === 'All'
      ? books
      : books.filter((book) => book.category === activeCategory);
  }, [activeCategory, books]);

  const myEbookOrders = useMemo(() => {
    return Object.entries(orderByEbookId)
      .map(([ebookId, order]) => {
        const book = books.find((item) => item.id === ebookId);
        if (!book) return null;
        const pdfUrl = book.downloadLink ?? book.driveLink;
        return {
          book,
          order,
          pdfUrl,
          isApproved:
            order.status === 'approved' || order.status === 'paid' || order.status === 'completed',
        };
      })
      .filter(Boolean) as Array<{ book: Ebook; order: EbookOrder; pdfUrl?: string; isApproved: boolean }>;
  }, [books, orderByEbookId]);

  useEffect(() => {
    const container = sliderRef.current;
    if (!container) return;

    const updateIndicators = () => {
      const maxScrollLeft = Math.max(0, container.scrollWidth - container.clientWidth);
      const step = Math.max(220, Math.floor(container.clientWidth * 0.82));
      const count = maxScrollLeft > 0 ? Math.floor(maxScrollLeft / step) + 1 : 1;
      const current = maxScrollLeft > 0 ? Math.round(container.scrollLeft / step) : 0;
      setSliderStepCount(count);
      setActiveStep(Math.max(0, Math.min(current, count - 1)));
    };

    updateIndicators();
    container.addEventListener('scroll', updateIndicators, { passive: true });
    window.addEventListener('resize', updateIndicators);

    return () => {
      container.removeEventListener('scroll', updateIndicators);
      window.removeEventListener('resize', updateIndicators);
    };
  }, [filteredBooks.length, loading]);

  useEffect(() => {
    const container = sliderRef.current;
    if (!container || loading || filteredBooks.length < 2) return;
    if (container.scrollWidth <= container.clientWidth + 4) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const step = Math.max(220, Math.floor(container.clientWidth * 0.82));

    const timer = window.setInterval(() => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (maxScrollLeft <= 0) return;
      const next = container.scrollLeft + step;
      if (next >= maxScrollLeft - 4) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
        return;
      }
      container.scrollTo({ left: next, behavior: 'smooth' });
    }, 2800);

    return () => window.clearInterval(timer);
  }, [filteredBooks, loading]);

  const handleOrder = (book: Ebook) => {
    if (!user) {
      navigate('/login?next=/ebooks');
      return;
    }
    setOrderModal(book);
    setPaymentMethod('bkash');
    setPaymentNumber('');
    setTransactionId('');
    setCopied(false);
    setOrderStatus(null);
  };

  const confirmOrder = async () => {
    if (!orderModal) return;
    if (!paymentNumber.trim() || !transactionId.trim()) {
      setOrderStatus('পেমেন্ট নম্বর এবং TRX ID দিতে হবে।');
      return;
    }
    setIsOrdering(true);
    try {
      const createdOrder = await placeOrder({
        book: orderModal,
        user,
        phone: paymentNumber.trim(),
        paymentMethod,
        paymentNumber: paymentNumber.trim(),
        transactionId: transactionId.trim(),
      });
      persistOrderAccess(orderModal.id, createdOrder.id);
      setOrderByEbookId((prev) => ({
        ...prev,
        [orderModal.id]: createdOrder,
      }));
      setOrderStatus(`${orderModal.title} অর্ডার সাবমিট হয়েছে। এপ্রুভ হলে Download/Read আনলক হবে।`);
      setRecentSubmittedOrderId(createdOrder.id);
      setShowSuccessDialog(true);
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

  const handleGoUserDashboard = () => {
    if (user) {
      navigate('/orders');
      return;
    }
    navigate('/login?next=/orders');
  };

  const modalBookLink = orderModal ? orderModal.downloadLink ?? orderModal.driveLink : '';
  const modalOrderState = orderModal ? orderByEbookId[orderModal.id] : null;
  const isModalOrderApproved =
    modalOrderState?.status === 'approved' || modalOrderState?.status === 'paid' || modalOrderState?.status === 'completed';

  return (
    <section id="ebooks" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">নলেজ হাব: সুস্থতার গাইডলাইন</h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-500 sm:text-base">
            আপনার দৈনন্দিন জীবনধারা, পুষ্টি ও সুস্থতার জন্য রিসার্চ-ভিত্তিক ইবুক গাইড।
          </p>
          <div className="mt-3 flex justify-center">
            <svg viewBox="0 0 240 28" className="h-5 w-52 text-emerald-500/70" fill="none" aria-hidden="true">
              <path
                d="M4 14C36 2 66 26 98 14C130 2 160 26 192 14C207 8 221 8 236 14"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="mt-1 flex items-center justify-center gap-2" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-slate-600">
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
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
          </div>
        ) : (
          <div
            ref={sliderRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scroll-smooth px-1 min-h-[180px]"
          >
            {filteredBooks.length === 0 ? (
              <div className="flex w-full justify-center items-center text-sm text-slate-400">
                কোনো ইবুক পাওয়া যায়নি, পরে আবার দেখুন বা ক্যাটাগরি চেক করুন।
              </div>
            ) : (
              filteredBooks.map((book) => {
                const isFree = book.price === 0;
                const downloadUrl = book.downloadLink ?? book.driveLink;
                const hasDownload = Boolean(downloadUrl);
                const tier = getTierLabel(book);
                const accessOrder = orderByEbookId[book.id];
                const orderState = normalizeOrderStatus(accessOrder?.status);
                const isOrderApproved = orderState === 'approved';
                return (
                  <article
                    key={book.id}
                    className="group min-w-[280px] max-w-[320px] snap-start overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:min-w-[300px]"
                  >
                    <div className="relative h-56 overflow-hidden bg-gray-100 sm:h-60">
                      <img
                        src={resolveCoverImageUrl(book.coverImage)}
                        alt={book.title}
                        loading="lazy"
                        onError={(event) => {
                          const current = event.currentTarget;
                          const original = (book.coverImage ?? '').trim();
                          const fileId = extractDriveFileId(original);

                          if (fileId && current.src.includes('uc?export=view')) {
                            current.src = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
                            return;
                          }

                          if (fileId && current.src.includes('thumbnail?id=')) {
                            current.src = `https://drive.google.com/uc?export=download&id=${fileId}`;
                            return;
                          }

                          current.src = FALLBACK_COVER_IMAGE;
                        }}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 shadow">
                        {tier}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 px-4 py-4">
                      <h3 className="text-lg font-semibold text-slate-900 leading-snug">{book.title}</h3>
                      <ul className="space-y-1 text-xs text-slate-500">
                        <li className="truncate">ক্যাটাগরি: {categoryLabels[book.category]}</li>
                        <li className="truncate">{book.description}</li>
                      </ul>
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <span className="text-base font-bold text-slate-900">
                          {isFree ? 'ফ্রি' : `৳${book.price}`}
                        </span>
                        {isFree ? (
                          hasDownload ? (
                            <a
                              href={downloadUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-emerald-600 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition"
                            >
                              <ArrowUpRight className="h-3.5 w-3.5" />
                              ডাউনলোড
                            </a>
                          ) : (
                            <span className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 border border-slate-200 bg-slate-50">
                              Link pending
                            </span>
                          )
                        ) : (
                          isOrderApproved && hasDownload ? (
                            <a
                              href={downloadUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-emerald-600 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition"
                            >
                              <ArrowUpRight className="h-3.5 w-3.5" />
                              Read / Download
                            </a>
                          ) : orderState === 'pending' ? (
                            <button
                              onClick={handleGoUserDashboard}
                              className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition"
                            >
                              অর্ডার ট্র্যাক করুন
                            </button>
                          ) : orderState === 'rejected' ? (
                            <button
                              onClick={() => handleOrder(book)}
                              className="rounded-full px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition"
                            >
                              পুনরায় অর্ডার
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOrder(book)}
                              className="rounded-full px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition"
                            >
                              কিনুন
                            </button>
                          )
                        )}
                      </div>
                      {!isFree && accessOrder && (
                        <p
                          className={`text-[10px] font-semibold ${
                            orderState === 'approved'
                              ? 'text-emerald-700'
                              : orderState === 'rejected'
                                ? 'text-rose-700'
                                : 'text-amber-700'
                          }`}
                        >
                          {orderState === 'approved'
                            ? 'অর্ডার অনুমোদিত: ইবুক আনলক'
                            : orderState === 'rejected'
                              ? 'অর্ডার বাতিল হয়েছে'
                              : 'অর্ডার পেন্ডিং: অ্যাডমিন রিভিউ চলছে'}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })
            )}
          </div>
        )}
        {sliderStepCount > 1 && (
          <div className="mt-2 flex items-center justify-center gap-2">
            {Array.from({ length: sliderStepCount }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  const container = sliderRef.current;
                  if (!container) return;
                  const step = Math.max(220, Math.floor(container.clientWidth * 0.82));
                  container.scrollTo({ left: step * index, behavior: 'smooth' });
                }}
                aria-label={`ইবুক স্লাইড ${index + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  activeStep === index ? 'w-7 bg-emerald-600' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        )}

        {orderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-slate-900/70" onClick={() => setOrderModal(null)} />
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-5">
              <h4 className="text-lg font-bold text-slate-900">অর্ডার: {orderModal.title}</h4>
              <p className="text-sm text-slate-500">ইমেইল: {user?.email} · ৳{orderModal.price}</p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setPaymentMethod('bkash');
                    setCopied(false);
                  }}
                  className={`rounded-xl border-2 p-3 text-sm font-semibold transition ${
                    paymentMethod === 'bkash' ? 'border-[#D12053] text-[#D12053] bg-[#D12053]/5' : 'border-slate-200 text-slate-500'
                  }`}
                >
                  bKash
                </button>
                <button
                  onClick={() => {
                    setPaymentMethod('nagad');
                    setCopied(false);
                  }}
                  className={`rounded-xl border-2 p-3 text-sm font-semibold transition ${
                    paymentMethod === 'nagad' ? 'border-[#F7941D] text-[#F7941D] bg-[#F7941D]/5' : 'border-slate-200 text-slate-500'
                  }`}
                >
                  Nagad
                </button>
              </div>

              <div className="rounded-2xl bg-slate-900 p-4 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] text-slate-300 uppercase tracking-widest">Payment Number (Send Money)</p>
                    <p className="text-xl font-bold mt-1">{paymentDetails[paymentMethod].number}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(paymentDetails[paymentMethod].number)}
                    className="rounded-lg bg-white/10 p-2 hover:bg-white/20"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-slate-300">SEND MONEY করুন (Cash Out নয়)</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs uppercase tracking-widest text-slate-500">পেমেন্ট নম্বর</label>
                  <input
                    value={paymentNumber}
                    onChange={(event) => setPaymentNumber(event.target.value)}
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-slate-500">TRX ID</label>
                  <input
                    value={transactionId}
                    onChange={(event) => setTransactionId(event.target.value)}
                    type="text"
                    placeholder="TXN ID"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {isModalOrderApproved && modalBookLink ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                  <p className="text-xs font-semibold text-emerald-700 mb-2">Order approved. এখন PDF access ready.</p>
                  <div className="flex gap-2">
                    <a
                      href={modalBookLink}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      View PDF
                    </a>
                    <a
                      href={modalBookLink}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ) : null}

              <div className="flex gap-3">
                <button
                  onClick={() => setOrderModal(null)}
                  className="flex-1 rounded-xl border border-slate-200 py-2 text-sm font-semibold"
                >
                  বাতিল
                </button>
                <button
                  onClick={confirmOrder}
                  disabled={isOrdering}
                  className="flex-1 rounded-xl bg-emerald-600 text-white py-2 text-sm font-semibold disabled:opacity-50"
                >
                  {isOrdering ? 'সাবমিট হচ্ছে...' : 'অর্ডার সাবমিট'}
                </button>
              </div>
            </div>
          </div>
        )}

        {showSuccessDialog && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/55" onClick={() => setShowSuccessDialog(false)} />
            <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
              <h3 className="text-xl font-bold text-slate-900">অর্ডার কনফার্মড</h3>
              <p className="text-sm text-slate-600">
                আপনার ইবুক অর্ডার রিসিভ হয়েছে। স্ট্যাটাস ট্র্যাক করতে অর্ডার পেজ দেখুন।
              </p>
              {recentSubmittedOrderId && (
                <p className="text-xs text-slate-500">
                  Order ID: <span className="font-semibold text-slate-700">{recentSubmittedOrderId}</span>
                </p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSuccessDialog(false)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  পরে দেখব
                </button>
                <button
                  onClick={handleGoUserDashboard}
                  className="flex-1 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  {user ? 'অর্ডার পেজে যান' : 'Login / Signup'}
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
