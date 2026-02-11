import React, { useEffect, useState } from 'react';
import { Service } from '../../types';
import { fetchServices } from '../../services/dataService';

const initialServiceForm = {
  title: '',
  description: '',
  price: '',
  iconName: 'HeartPulse' as Service['iconName'],
  features: '',
};

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState(initialServiceForm);

  useEffect(() => {
    fetchServices().then(setServices);
  }, []);

  const addService = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title || !form.description) return;
    const newService: Service = {
      id: crypto.randomUUID(),
      title: form.title,
      description: form.description,
      iconName: form.iconName,
      price: form.price || '৳৩০০০',
      features: form.features
        .split(',')
        .map((feature) => feature.trim())
        .filter(Boolean),
    };
    setServices((prev) => [newService, ...prev]);
    setForm(initialServiceForm);
  };

  const deleteService = (serviceId: string) => {
    setServices((prev) => prev.filter((item) => item.id !== serviceId));
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-emerald-500">Services</p>
        <h1 className="text-2xl font-semibold text-slate-900">Service management</h1>
        <p className="text-sm text-slate-500 mt-1">Keep frontend sections in sync with your backend.</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={addService}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg space-y-4"
        >
          <input
            type="text"
            placeholder="Service title"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            required
          />
          <input
            type="text"
            placeholder="Price label"
            value={form.price}
            onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          />
          <select
            value={form.iconName}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, iconName: event.target.value as Service['iconName'] }))
            }
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          >
            {['HeartPulse', 'Apple', 'Baby', 'Brain'].map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
          <textarea
            rows={3}
            placeholder="Features (comma separated)"
            value={form.features}
            onChange={(event) => setForm((prev) => ({ ...prev, features: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          />
          <button className="w-full rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
            Add service
          </button>
        </form>
        <div className="space-y-3">
          {services.map((service) => (
            <div key={service.id} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div>
                <p className="font-semibold text-slate-900">{service.title}</p>
                <p className="text-xs text-slate-400">{service.description}</p>
                <p className="text-[12px] text-slate-500">{service.features.join(' · ')}</p>
              </div>
              <button
                onClick={() => deleteService(service.id)}
                className="rounded-full border border-rose-300 px-3 py-1 text-[11px] uppercase tracking-widest text-rose-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
