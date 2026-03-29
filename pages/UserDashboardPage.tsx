import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Ebook, EbookOrder, ServiceOrder } from '../types';
import { Link } from 'react-router-dom';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { fetchOrders, fetchRemoteEbooks, fetchServiceOrders } from '../services/firebaseService';

const statusPillClass = (status?: string) => {
  if (status === 'approved' || status === 'paid' || status === 'completed') {
    return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  }
  if (status === 'rejected') {
    return 'text-rose-700 bg-rose-50 border-rose-200';
  }
  return 'text-amber-700 bg-amber-50 border-amber-200';
};

const extractDriveFileId = (value: string): string | null => {
  const byPath = value.match(/\/file\/d\/([^/]+)/);
  if (byPath?.[1]) return byPath[1];
  const byQuery = value.match(/[?&]id=([^&]+)/);
  if (byQuery?.[1]) return byQuery[1];
  return null;
};

const toDirectDownloadLink = (url: string): string => {
  const trimmed = url.trim();
  if (!trimmed.includes('drive.google.com')) return trimmed;
  const fileId = extractDriveFileId(trimmed);
  if (!fileId) return trimmed;
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

const resolvePdfLikeLink = (book: Ebook): string | undefined => {
  const candidates = [book.downloadLink, book.driveLink, book.coverImage]
    .map((item) => (item ?? '').trim())
    .filter(Boolean);

  for (const raw of candidates) {
    if (raw.includes('drive.google.com')) {
      const fileId = extractDriveFileId(raw);
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/view`;
      }
      return raw;
    }
    if (raw.toLowerCase().endsWith('.pdf')) {
      return raw;
    }
  }

  return candidates[0];
};

const UserDashboardPage: React.FC = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'service' | 'ebook'>('service');
  const [ebookOrders, setEbookOrders] = useState<EbookOrder[]>([]);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const [allEbookOrders, allServiceOrders, allEbooks] = await Promise.all([
        fetchOrders().catch(() => []),
        fetchServiceOrders().catch(() => []),
        fetchRemoteEbooks().catch(() => []),
      ]);

      setEbookOrders(
        allEbookOrders.filter((order) => order.userEmail?.toLowerCase() === user.email?.toLowerCase())
      );
      setServiceOrders(
        allServiceOrders.filter(
          (order) =>
            order.userEmail?.toLowerCase() === user.email?.toLowerCase() || order.userId === user.uid
        )
      );
      setEbooks(allEbooks);
    } finally {
      setLoading(false);
    }
  }, [user?.email, user?.uid]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const ebookLinkMap = useMemo(() => {
    const map: Record<string, string> = {};
    ebooks.forEach((book) => {
      const link = resolvePdfLikeLink(book);
      if (link) map[book.id] = link;
    });
    return map;
  }, [ebooks]);

  const handleCopyOrderId = async (orderId: string) => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopiedOrderId(orderId);
      window.setTimeout(() => setCopiedOrderId((prev) => (prev === orderId ? null : prev)), 1500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">আমার অর্ডার</h1>
          <p className="text-sm text-slate-500 mt-1">ইবুক ও সার্ভিস অর্ডারের স্ট্যাটাস দেখুন।</p>
        </header>

        {!user ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 text-center">
            <p className="text-sm text-slate-600">অর্ডার দেখার জন্য Google লগইন করুন।</p>
            <button
              onClick={login}
              className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Google লগইন
            </button>
          </section>
        ) : (
          <>
            <section className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setActiveTab('service')}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      activeTab === 'service'
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    সার্ভিস অর্ডার
                  </button>
                  <button
                    onClick={() => setActiveTab('ebook')}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      activeTab === 'ebook'
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    ইবুক অর্ডার
                  </button>
                </div>
                <button
                  onClick={loadDashboardData}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  রিফ্রেশ
                </button>
              </div>

              <h2 className="text-lg font-semibold text-slate-900">
                {activeTab === 'service' ? 'আমার সার্ভিস অর্ডার' : 'আমার ইবুক অর্ডার'}
              </h2>

              {loading ? (
                <p className="text-sm text-slate-500">লোড হচ্ছে...</p>
              ) : activeTab === 'service' ? (
                serviceOrders.length ? (
                  serviceOrders.map((order) => {
                    const isApproved = order.status === 'approved';
                    return (
                      <article key={order.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-900">{order.serviceTitle}</p>
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wider ${statusPillClass(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="grid gap-1.5 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <p><span className="font-semibold text-slate-800">Order ID:</span> {order.id}</p>
                            <button
                              type="button"
                              onClick={() => handleCopyOrderId(order.id)}
                              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white p-1 text-slate-600 hover:bg-slate-100"
                              aria-label="Copy Order ID"
                            >
                              {copiedOrderId === order.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                          <p><span className="font-semibold text-slate-800">সময়:</span> {new Date(order.createdAt).toLocaleString('en-BD')}</p>
                          <p><span className="font-semibold text-slate-800">অ্যামাউন্ট:</span> {order.servicePrice}</p>
                          <p><span className="font-semibold text-slate-800">পেমেন্ট:</span> {order.paymentMethod.toUpperCase()}</p>
                          <p><span className="font-semibold text-slate-800">পেমেন্ট নম্বর:</span> {order.paymentNumber || '-'}</p>
                          <p><span className="font-semibold text-slate-800">TRX ID:</span> {order.transactionId || '-'}</p>
                          <p><span className="font-semibold text-slate-800">অ্যাকাউন্ট:</span> {order.userEmail || '-'}</p>
                        </div>
                        {isApproved ? (
                          <Link
                            to={`/orders/intake/${order.id}`}
                            className="inline-flex rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                          >
                            তথ্য ফর্ম পূরণ করুন
                          </Link>
                        ) : (
                          <p className="text-xs text-slate-500">অর্ডার রেকর্ড হয়েছে</p>
                        )}
                      </article>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-500">এখনও কোনো সার্ভিস অর্ডার নেই।</p>
                )
              ) : ebookOrders.length ? (
                ebookOrders.map((order) => {
                  const isApproved =
                    order.status === 'approved' || order.status === 'paid' || order.status === 'completed';
                  const link = ebookLinkMap[order.ebookId];
                  const downloadLink = link ? toDirectDownloadLink(link) : '';
                  return (
                    <article key={order.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">{order.ebookTitle}</p>
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wider ${statusPillClass(order.status)}`}>
                          {order.status ?? 'pending'}
                        </span>
                      </div>
                      <div className="grid gap-1.5 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <p><span className="font-semibold text-slate-800">Order ID:</span> {order.id}</p>
                          <button
                            type="button"
                            onClick={() => handleCopyOrderId(order.id)}
                            className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white p-1 text-slate-600 hover:bg-slate-100"
                            aria-label="Copy Order ID"
                          >
                            {copiedOrderId === order.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                        <p><span className="font-semibold text-slate-800">সময়:</span> {new Date(order.createdAt).toLocaleString('en-BD')}</p>
                        <p><span className="font-semibold text-slate-800">অ্যামাউন্ট:</span> ৳{order.price}</p>
                        <p><span className="font-semibold text-slate-800">পেমেন্ট:</span> {order.paymentMethod || '-'}</p>
                        <p><span className="font-semibold text-slate-800">পেমেন্ট নম্বর:</span> {order.paymentNumber || '-'}</p>
                        <p><span className="font-semibold text-slate-800">TRX ID:</span> {order.transactionId || '-'}</p>
                        <p><span className="font-semibold text-slate-800">অ্যাকাউন্ট:</span> {order.userEmail || '-'}</p>
                      </div>
                      <div>
                        {isApproved && link ? (
                          <div className="flex flex-wrap gap-2">
                            <a
                              href={link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                            >
                              View PDF
                            </a>
                            <a
                              href={downloadLink}
                              target="_blank"
                              rel="noreferrer"
                              download
                              className="inline-flex rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                            >
                              Download PDF
                            </a>
                          </div>
                        ) : isApproved && !link ? (
                          <div className="space-y-1">
                            <p className="text-xs text-amber-600">Approved হয়েছে, কিন্তু PDF link এখনো সেট করা হয়নি।</p>
                            <button
                              onClick={loadDashboardData}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                              আবার রিফ্রেশ করুন
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500">রিভিউ চলছে, approve হলে PDF access আসবে।</p>
                        )}
                      </div>
                    </article>
                  );
                })
              ) : (
                <p className="text-sm text-slate-500">এখনও কোনো ইবুক অর্ডার নেই।</p>
              )}
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default UserDashboardPage;
