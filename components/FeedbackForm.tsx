import React, { useState } from 'react';
import { submitFeedback } from '../services/firebaseService';

type FormState = {
  name: string;
  role: string;
  content: string;
  image: string;
};

const initialFormState: FormState = {
  name: '',
  role: '',
  content: '',
  image: '',
};

const FeedbackForm: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.role.trim() || !form.content.trim()) {
      setStatusMessage('নাম, পরিচয় এবং মতামত লিখুন।');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      await submitFeedback({
        name: form.name.trim(),
        role: form.role.trim(),
        content: form.content.trim(),
        image: form.image.trim() || 'https://picsum.photos/100/100?random=99',
      });
      setForm(initialFormState);
      setStatusMessage('ধন্যবাদ। আপনার ফিডব্যাক জমা হয়েছে, অ্যাডমিন অনুমোদনের পর এটি প্রকাশ হবে।');
    } catch (error) {
      console.error(error);
      setStatusMessage('ফিডব্যাক জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="feedback" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8 shadow-sm">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">Feedback</p>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">আপনার অভিজ্ঞতা শেয়ার করুন</h2>
            <p className="text-sm text-slate-600 mt-2">
              আপনার মতামত অ্যাডমিন যাচাই করার পর সাফল্যের গল্প সেকশনে দেখানো হবে।
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="আপনার নাম"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800"
                required
              />
              <input
                type="text"
                placeholder="আপনার পরিচয় (যেমন: PCOS পেশেন্ট)"
                value={form.role}
                onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800"
                required
              />
            </div>

            <textarea
              rows={4}
              placeholder="আপনার অভিজ্ঞতা লিখুন"
              value={form.content}
              onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800"
              required
            />

            <input
              type="url"
              placeholder="প্রোফাইল ছবি URL (optional)"
              value={form.image}
              onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white disabled:opacity-70"
            >
              {isSubmitting ? 'Submitting...' : 'ফিডব্যাক জমা দিন'}
            </button>
          </form>

          {statusMessage && <p className="mt-4 text-sm text-slate-600">{statusMessage}</p>}
        </div>
      </div>
    </section>
  );
};

export default FeedbackForm;
