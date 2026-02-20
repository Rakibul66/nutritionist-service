import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, X, CheckCircle2 } from 'lucide-react';
import { Service, ServicePublishPayload } from '../../types';
import {
  fetchRemoteServices,
  publishService,
  removeService,
  updateService,
} from '../../services/firebaseService';

type ServiceFormState = {
  title: string;
  description: string;
  charge: string;
  iconName: Service['iconName'];
  features: string[];
  image: string;
};

const quickChargeHints = ['1,500', '2,000', '2,500', '3,000', '5,000'];

const initialServiceForm: ServiceFormState = {
  title: '',
  description: '',
  charge: '3,000',
  iconName: 'HeartPulse',
  features: [],
  image: '',
};

const parseChargeDigits = (value: string): string => {
  const cleaned = value
    .replace(/৳/g, '')
    .replace(/(tk|bdt)/gi, '')
    .replace(/,/g, '')
    .trim();

  if (!cleaned) {
    return '';
  }

  const amount = Number.parseFloat(cleaned.replace(/[^0-9.]/g, ''));
  if (Number.isNaN(amount)) {
    return '';
  }

  return new Intl.NumberFormat('en-BD', {
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
};

const normalizePriceLabel = (charge: string): string => {
  const parsed = parseChargeDigits(charge);
  return `৳${parsed || '3,000'}`;
};

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState<ServiceFormState>(initialServiceForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [featureInput, setFeatureInput] = useState('');

  const loadServices = async () => {
    const data = await fetchRemoteServices();
    setServices(data);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const serviceCountText = useMemo(() => {
    if (!services.length) {
      return 'কোনো সার্ভিস এখনও যোগ করা হয়নি';
    }
    return `${services.length}টি সার্ভিস পাওয়া গেছে`;
  }, [services.length]);

  const buildPayload = (): ServicePublishPayload => ({
    title: form.title.trim(),
    description: form.description.trim(),
    iconName: form.iconName,
    price: normalizePriceLabel(form.charge),
    features: form.features,
    image: form.image.trim(),
  });

  const resetForm = () => {
    setForm(initialServiceForm);
    setEditingId(null);
    setFeatureInput('');
  };

  const openCreateDialog = () => {
    resetForm();
    setStatusMessage(null);
    setIsDialogOpen(true);
  };

  const startEdit = (service: Service) => {
    setEditingId(service.id);
    setForm({
      title: service.title,
      description: service.description,
      charge: parseChargeDigits(service.price) || '3,000',
      iconName: service.iconName,
      features: service.features,
      image: service.image ?? '',
    });
    setFeatureInput('');
    setStatusMessage(null);
    setIsDialogOpen(true);
  };

  const addFeature = () => {
    const value = featureInput.trim();
    if (!value) {
      return;
    }

    setForm((prev) => ({ ...prev, features: [...prev.features, value] }));
    setFeatureInput('');
  };

  const removeFeature = (removeIndex: number) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, index) => index !== removeIndex),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setStatusMessage('সার্ভিস নাম এবং সংক্ষিপ্ত বিবরণ অবশ্যই দিতে হবে।');
      return;
    }

    if (form.features.length === 0) {
      setStatusMessage('কমপক্ষে ১টি সুবিধা checklist-এ যোগ করুন।');
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);
    try {
      const payload = buildPayload();
      if (editingId) {
        await updateService(editingId, payload);
        setStatusMessage('সার্ভিস সফলভাবে আপডেট হয়েছে।');
      } else {
        await publishService(payload);
        setStatusMessage('নতুন সার্ভিস সফলভাবে যোগ হয়েছে।');
      }
      await loadServices();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      setStatusMessage('সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (serviceId: string) => {
    try {
      await removeService(serviceId);
      setServices((prev) => prev.filter((item) => item.id !== serviceId));
      if (editingId === serviceId) {
        resetForm();
      }
      setStatusMessage('সার্ভিসটি মুছে ফেলা হয়েছে।');
    } catch (error) {
      console.error(error);
      setStatusMessage('ডিলিট করতে সমস্যা হয়েছে।');
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-500">Services</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">সার্ভিস ম্যানেজমেন্ট</h1>
          <p className="mt-1 text-sm text-slate-500">{serviceCountText}</p>
        </div>
        <button
          onClick={openCreateDialog}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          সার্ভিস যোগ করুন
        </button>
      </header>

      {statusMessage && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {statusMessage}
        </div>
      )}

      <section className="grid gap-3">
        {services.map((service) => (
          <article
            key={service.id}
            className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-2">
              <p className="text-base font-semibold text-slate-900">{service.title}</p>
              <p className="text-sm text-slate-500">{service.description}</p>
              <ul className="space-y-1 text-xs text-slate-600">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm font-semibold text-emerald-700">{service.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => startEdit(service)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Pencil className="h-3.5 w-3.5" />
                এডিট
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                রিমুভ
              </button>
            </div>
          </article>
        ))}
      </section>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8">
          <button
            type="button"
            onClick={() => setIsDialogOpen(false)}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-[1px]"
            aria-label="Close"
          />
          <div className="relative w-full max-w-2xl max-h-[calc(100vh-1.5rem)] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:max-h-[calc(100vh-3rem)] sm:p-6 md:p-8">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingId ? 'সার্ভিস আপডেট করুন' : 'নতুন সার্ভিস যোগ করুন'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">সব ফিল্ড বাংলায় লিখে প্যাকেজ তথ্য দিন।</p>
              </div>
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pb-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700">সার্ভিস নাম</label>
                  <input
                    type="text"
                    placeholder="যেমন: ওজন কমানোর ডায়েট প্ল্যান"
                    value={form.title}
                    onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    required
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700">সংক্ষিপ্ত বিবরণ</label>
                  <input
                    type="text"
                    placeholder="যেমন: ৩০ দিনের পার্সোনাল ডায়েট ও লাইফস্টাইল গাইড"
                    value={form.description}
                    onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    required
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Service Charge</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="যেমন: 3000"
                      value={form.charge}
                      onChange={(event) => setForm((prev) => ({ ...prev, charge: event.target.value }))}
                      className="w-full rounded-xl border border-slate-200 py-3 pl-4 pr-10 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-emerald-700">
                      ৳
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickChargeHints.map((hint) => (
                      <button
                        key={hint}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, charge: hint }))}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        {hint} ৳
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">দ্রুত সিলেক্ট করতে উপরের charge hints-এ ট্যাপ করুন।</p>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700">সুবিধাসমূহ (Checklist)</label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      placeholder="যেমন: সাপ্তাহিক ফলো-আপ"
                      value={featureInput}
                      onChange={(event) => setFeatureInput(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    {form.features.length === 0 ? (
                      <li className="text-xs text-slate-500">এখনও কোনো সুবিধা যোগ করা হয়নি।</li>
                    ) : (
                      form.features.map((feature, index) => (
                        <li key={`${feature}-${index}`} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm text-slate-700">
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            {feature}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="rounded-md p-1 text-rose-500 transition hover:bg-rose-50"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700">ইমেজ URL (অপশনাল)</label>
                  <input
                    type="url"
                    placeholder="https://example.com/service-image.jpg"
                    value={form.image}
                    onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
              </div>

              {statusMessage && <p className="text-xs text-slate-500">{statusMessage}</p>}

              <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(false);
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  {isSaving ? 'সেভ হচ্ছে...' : editingId ? 'আপডেট সার্ভিস' : 'সার্ভিস যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
