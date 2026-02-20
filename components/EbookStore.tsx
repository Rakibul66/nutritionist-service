import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BookCategory, Ebook, EbookOrder } from '../types';
import { fetchEbookOrderById, fetchRemoteEbooks, placeOrder } from '../services/firebaseService';
import { ChevronLeft, ChevronRight, ArrowUpRight, Lock, Copy, Check } from 'lucide-react';
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
  const [existingOrderId, setExistingOrderId] = useState('');
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [isCheckingOrder, setIsCheckingOrder] = useState(false);
  const [copied, setCopied] = useState(false);
  const [orderByEbookId, setOrderByEbookId] = useState<Record<string, EbookOrder>>({});
  const [recentSubmittedOrderId, setRecentSubmittedOrderId] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
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

  const scrollSlider = (direction: 'left' | 'right') => {
    const container = sliderRef.current;
    if (!container) return;
    const offset = container.clientWidth * 0.65;
    container.scrollBy({ left: direction === 'left' ? -offset : offset, behavior: 'smooth' });
  };

  useEffect(() => {
    const container = sliderRef.current;
    if (!container || loading || filteredBooks.length < 2) return;
    if (container.scrollWidth <= container.clientWidth + 4) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let direction: 1 | -1 = 1;
    const step = Math.max(180, Math.floor(container.clientWidth * 0.5));

    const timer = window.setInterval(() => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (maxScrollLeft <= 0) return;

      if (direction === 1 && container.scrollLeft >= maxScrollLeft - 4) {
        direction = -1;
      } else if (direction === -1 && container.scrollLeft <= 4) {
        direction = 1;
      }

      container.scrollBy({ left: direction * step, behavior: 'smooth' });
    }, 2500);

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
    setExistingOrderId('');
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

  const handleUnlockByOrderId = async () => {
    if (!orderModal || !existingOrderId.trim()) {
      setOrderStatus('অর্ডার আইডি লিখুন।');
      return;
    }
    setIsCheckingOrder(true);
    try {
      const order = await fetchEbookOrderById(existingOrderId.trim());
      if (!order) {
        setOrderStatus('এই অর্ডার আইডি পাওয়া যায়নি।');
        return;
      }
      if (order.ebookId !== orderModal.id) {
        setOrderStatus('এই অর্ডার আইডি এই ইবুকের জন্য না।');
        return;
      }
      persistOrderAccess(orderModal.id, order.id);
      setOrderByEbookId((prev) => ({ ...prev, [orderModal.id]: order }));
      if (order.status === 'approved' || order.status === 'paid' || order.status === 'completed') {
        setOrderStatus('অর্ডার approved. Download/Read আনলক হয়েছে।');
      } else if (order.status === 'rejected') {
        setOrderStatus('অর্ডার rejected হয়েছে।');
      } else {
        setOrderStatus('অর্ডার pending আছে। approve হলে unlock হবে।');
      }
    } catch (error) {
      console.error(error);
      setOrderStatus('অর্ডার আইডি যাচাই করা যায়নি।');
    } finally {
      setIsCheckingOrder(false);
    }
  };

  const getTierLabel = (book: Ebook) => {
    if (book.price === 0) return 'ফ্রি';
    if (book.price > 500) return 'প্রিমিয়াম';
    return 'পেইড';
  };

  const handleGoUserDashboard = () => {
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
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
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
          <div className="ml-auto flex items-center gap-2">
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
                const isOrderApproved =
                  accessOrder?.status === 'approved' || accessOrder?.status === 'paid' || accessOrder?.status === 'completed';
                return (
                  <article
                    key={book.id}
                    className="group min-w-[210px] max-w-[220px] snap-start overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative h-64 overflow-hidden bg-gray-100">
                      <img
                        src={encodeURI(book.coverImage)}
                        alt={book.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 shadow">
                        {tier}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 px-3 py-3">
                      <h3 className="text-base font-semibold text-slate-900 leading-snug">{book.title}</h3>
                      <ul className="space-y-1 text-[11px] text-slate-500">
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
                        <p className="text-[10px] font-semibold text-slate-500">অর্ডার রেকর্ড হয়েছে</p>
                      )}
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

        {myEbookOrders.length > 0 && (
          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5 space-y-3">
            <h3 className="text-base font-bold text-slate-900">আমার ইবুক অর্ডার</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {myEbookOrders.map(({ book, order, pdfUrl, isApproved }) => (
                <article key={order.id} className="rounded-2xl border border-slate-200 bg-white p-3 space-y-2">
                  <p className="text-sm font-semibold text-slate-900">{book.title}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {isApproved && pdfUrl ? (
                      <>
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                        >
                          View PDF
                        </a>
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                        >
                          Download
                        </a>
                      </>
                    ) : (
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
                        রিভিউ চলছে
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
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

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                <p className="text-xs text-slate-600">আগের Order ID থাকলে status check করুন</p>
                <div className="flex gap-2">
                  <input
                    value={existingOrderId}
                    onChange={(event) => setExistingOrderId(event.target.value)}
                    type="text"
                    placeholder="Order ID"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"
                  />
                  <button
                    onClick={handleUnlockByOrderId}
                    disabled={isCheckingOrder}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700"
                  >
                    {isCheckingOrder ? 'চেক...' : 'চেক'}
                  </button>
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
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <Lock className="h-3.5 w-3.5" />
                Admin approve করার পরেই Download/Read অপশন আনলক হবে।
              </p>
            </div>
          </div>
        )}

        {showSuccessDialog && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/55" onClick={() => setShowSuccessDialog(false)} />
            <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
              <h3 className="text-xl font-bold text-slate-900">অর্ডার কনফার্মড</h3>
              <p className="text-sm text-slate-600">
                আপনার ইবুক অর্ডার রিসিভ হয়েছে। স্ট্যাটাস ট্র্যাক করতে লগইন করে অর্ডার পেজ দেখুন।
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
                  Login / Signup
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
