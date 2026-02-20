import React, { useEffect, useState } from 'react';
import { CheckCircle, X, Copy, Check } from 'lucide-react';
import { Service } from '../types';
import { fetchRemoteServices, placeServiceOrder } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';
import { firebaseAuth } from '../services/firebaseClient';
import { useNavigate } from 'react-router-dom';

const serviceImages: Record<string, string> = {
  '1': 'https://raw.githubusercontent.com/Rakibul66/Recent-Project-Apk/refs/heads/main/a.webp',
  '2': 'https://raw.githubusercontent.com/Rakibul66/Recent-Project-Apk/refs/heads/main/b.webp',
  '3': 'https://raw.githubusercontent.com/Rakibul66/Recent-Project-Apk/refs/heads/main/1770827153538.webp',
};

const Services: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [copied, setCopied] = useState(false);
  const [paymentNumber, setPaymentNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [recentSubmittedOrderId, setRecentSubmittedOrderId] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const paymentDetails = {
    bkash: { number: '01724253648', label: 'bKash' },
    nagad: { number: '01827664306', label: 'Nagad' },
  };

  useEffect(() => {
    const loadServices = async () => {
      const data = await fetchRemoteServices();
      setServices(data);
    };
    loadServices();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitOrder = async () => {
    if (!selectedService) return;

    const currentUser = user ?? firebaseAuth?.currentUser ?? null;
    if (!currentUser) {
      navigate('/login?next=/services');
      return;
    }

    if (!paymentNumber.trim() || !transactionId.trim()) {
      alert('পেমেন্ট নম্বর এবং ট্রানজেকশন আইডি দিতে হবে।');
      return;
    }

    setIsSubmittingOrder(true);

    try {
      const createdOrder = await placeServiceOrder({
        serviceId: selectedService.id,
        serviceTitle: selectedService.title,
        servicePrice: selectedService.price,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Guest',
        userEmail: currentUser.email || 'guest@local',
        paymentMethod,
        paymentNumber: paymentNumber.trim(),
        transactionId: transactionId.trim(),
      });

      setRecentSubmittedOrderId(createdOrder.id);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error(error);
      alert('অর্ডার সাবমিট করতে সমস্যা হয়েছে, আবার চেষ্টা করুন।');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleGoAfterConfirm = async () => {
    if (user) {
      navigate('/orders');
      return;
    }
    navigate('/login?next=/orders');
  };
  const openBookingModal = (service: Service) => {
    setSelectedService(service);
    setPaymentMethod('bkash');
    setPaymentNumber('');
    setTransactionId('');
    setCopied(false);
  };

  return (
    <section id="services" className="py-20 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">পার্সোনালাইজড কনসালটেন্সি প্যাকেজ</h2>
          <p className="mt-3 text-base text-slate-500">আপনার শারীরিক লক্ষ্যের জন্য সঠিক সায়েন্টিফিক ডায়েট প্ল্যান বেছে নিন।</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative overflow-hidden">
                <img
                  src={
                    service.image ||
                    serviceImages[service.id] ||
                    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80'
                  }
                  alt={service.title}
                  loading="lazy"
                  className="h-44 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-48"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 px-5 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{service.title}</h3>
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed">{service.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{service.price}</p>
                    <span className="text-[11px] uppercase tracking-widest text-slate-400 block">প্রতি মাসে</span>
                  </div>
                </div>
                <ul className="space-y-2 text-xs font-medium text-slate-600">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="mt-1 h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-5 pb-5">
                <button
                  onClick={() => {
                    if (!user) {
                      navigate('/login?next=/services');
                      return;
                    }
                    openBookingModal(service);
                  }}
                  className="w-full rounded-full border border-slate-200 bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-200 active:translate-y-px"
                >
                  বুকিং দিন
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedService(null)} />
          <div className="relative bg-white w-full max-w-2xl max-h-[calc(100vh-2rem)] rounded-3xl shadow-2xl overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-900">পেমেন্ট এবং বুকিং</h3>
                <p className="text-xs text-slate-400">Approved অর্ডারে ফর্ম আনলক হবে, Completed হলে নতুন অর্ডার লাগবে।</p>
              </div>
              <button onClick={() => setSelectedService(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">প্যাকেজ</p>
                  <p className="text-sm font-bold text-slate-800">{selectedService.title}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">মোট মূল্য</p>
                  <p className="text-lg font-black text-emerald-600">{selectedService.price}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                <p>
                  অর্ডারকারী: <span className="font-semibold text-slate-800">{user?.displayName || 'Guest'}</span>
                </p>
                <p>
                  Google Account: <span className="font-semibold text-slate-800">{user?.email || 'Not signed in'}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setPaymentMethod('bkash');
                    setCopied(false);
                  }}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all font-bold text-sm ${
                    paymentMethod === 'bkash'
                      ? 'border-[#D12053] text-[#D12053] bg-[#D12053]/5'
                      : 'border-slate-100 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${paymentMethod === 'bkash' ? 'bg-[#D12053]' : 'bg-slate-200'}`} /> bKash
                </button>
                <button
                  onClick={() => {
                    setPaymentMethod('nagad');
                    setCopied(false);
                  }}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all font-bold text-sm ${
                    paymentMethod === 'nagad'
                      ? 'border-[#F7941D] text-[#F7941D] bg-[#F7941D]/5'
                      : 'border-slate-100 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${paymentMethod === 'nagad' ? 'bg-[#F7941D]' : 'bg-slate-200'}`} /> Nagad
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Payment Number (Send Money)</span>
                    <h4 className="text-2xl font-mono font-bold tracking-wider mt-1">{paymentDetails[paymentMethod].number}</h4>
                  </div>
                  <button onClick={() => handleCopy(paymentDetails[paymentMethod].number)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all">
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed italic">
                  * আপনার {paymentDetails[paymentMethod].label} অ্যাপ থেকে <b>SEND MONEY</b> করুন (Agent/Cash Out নয়)।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">আপনার পেমেন্ট নম্বর</label>
                  <input
                    type="text"
                    value={paymentNumber}
                    onChange={(event) => setPaymentNumber(event.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Transaction ID (TRX)</label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(event) => setTransactionId(event.target.value)}
                    placeholder="TXN ID"
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSubmitOrder}
                  disabled={isSubmittingOrder}
                  className="w-full p-3.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-all disabled:opacity-70"
                >
                  {isSubmittingOrder ? 'অর্ডার সাবমিট হচ্ছে...' : 'পেমেন্ট সাবমিট করুন'}
                </button>
              </div>
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
              আপনার সার্ভিস অর্ডার রিসিভ হয়েছে। স্ট্যাটাস ট্র্যাক করতে অর্ডার পেজ দেখুন।
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
                  onClick={handleGoAfterConfirm}
                  className="flex-1 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  {user ? 'অর্ডার পেজে যান' : 'লগইন / সাইনআপ'}
                </button>
              </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Services;
