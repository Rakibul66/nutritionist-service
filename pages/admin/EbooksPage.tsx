import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, X, BookText } from 'lucide-react';
import { BookCategory, Ebook, EbookPublishPayload } from '../../types';
import { fetchRemoteEbooks, publishEbook, uploadEbookPdf } from '../../services/firebaseService';

const emptyPayload: EbookPublishPayload = {
  title: '',
  description: '',
  category: BookCategory.CHILD,
  price: 0,
  coverImage: '',
  driveLink: '',
  downloadLink: '',
};

const categoryLabels: Record<BookCategory, string> = {
  [BookCategory.CHILD]: 'শিশু পুষ্টি',
  [BookCategory.BEAUTY]: 'বিউটি ও ওয়েলনেস',
  [BookCategory.THERAPEUTIC]: 'থেরাপিউটিক গাইড',
};

const EbooksPage: React.FC = () => {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [formState, setFormState] = useState<EbookPublishPayload>(emptyPayload);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const loadEbooks = async () => {
    const data = await fetchRemoteEbooks();
    setEbooks(data);
  };

  useEffect(() => {
    loadEbooks();
  }, []);

  const ebookCountText = useMemo(() => {
    if (!ebooks.length) {
      return 'কোনো ইবুক এখনও যোগ করা হয়নি';
    }
    return `${ebooks.length}টি ইবুক পাওয়া গেছে`;
  }, [ebooks.length]);

  const handleFormChange = (key: keyof EbookPublishPayload, value: string | number) => {
    setFormState((prev) => ({
      ...prev,
      [key]: key === 'price' ? Number(value) : value,
    }));
  };

  const resetForm = () => {
    setFormState(emptyPayload);
    setEditingId(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setStatusMessage(null);
    setIsDialogOpen(true);
  };

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setStatusMessage('শুধু PDF ফাইল আপলোড করুন।');
      return;
    }

    setIsUploadingPdf(true);
    setStatusMessage(null);

    try {
      const url = await uploadEbookPdf(file);
      setFormState((prev) => ({
        ...prev,
        downloadLink: url,
      }));
      setStatusMessage('PDF আপলোড হয়েছে। Download link auto-filled করা হয়েছে।');
    } catch (error) {
      console.error(error);
      setStatusMessage('PDF upload failed. আবার চেষ্টা করুন।');
    } finally {
      setIsUploadingPdf(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formState.title || !formState.price) {
      setStatusMessage('ইবুক নাম এবং চার্জ দিতে হবে।');
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);
    try {
      if (editingId) {
        setEbooks((prev) => prev.map((book) => (book.id === editingId ? { ...book, ...formState } : book)));
        setStatusMessage('ইবুক তথ্য আপডেট হয়েছে।');
      } else {
        await publishEbook(formState);
        await loadEbooks();
        setStatusMessage('ইবুক Firebase-এ যোগ হয়েছে।');
      }

      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      setStatusMessage('কিছু ভুল হয়েছে, আবার চেষ্টা করুন।');
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (book: Ebook) => {
    setEditingId(book.id);
    setFormState({
      title: book.title,
      description: book.description,
      category: book.category,
      price: book.price,
      coverImage: book.coverImage,
      driveLink: book.driveLink ?? '',
      downloadLink: book.downloadLink ?? '',
    });
    setStatusMessage(null);
    setIsDialogOpen(true);
  };

  const deleteBook = (bookId: string) => {
    setEbooks((prev) => prev.filter((book) => book.id !== bookId));
    setStatusMessage('ইবুক লিস্ট থেকে রিমুভ করা হয়েছে।');
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-500">Ebooks</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">ইবুক ম্যানেজমেন্ট</h1>
          <p className="mt-1 text-sm text-slate-500">{ebookCountText}</p>
        </div>
        <button
          onClick={openCreateDialog}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          ইবুক যোগ করুন
        </button>
      </header>

      {statusMessage && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {statusMessage}
        </div>
      )}

      <section className="grid gap-3">
        {ebooks.map((book) => (
          <article
            key={book.id}
            className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-2">
              <p className="text-base font-semibold text-slate-900">{book.title}</p>
              <p className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                {categoryLabels[book.category]}
              </p>
              <p className="line-clamp-2 text-sm text-slate-500">{book.description}</p>
              <p className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">৳ {book.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => startEdit(book)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Pencil className="h-3.5 w-3.5" />
                এডিট
              </button>
              <button
                onClick={() => deleteBook(book.id)}
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
                  {editingId ? 'ইবুক আপডেট করুন' : 'নতুন ইবুক যোগ করুন'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">ইবুকের তথ্য দিয়ে ক্যাটালগ আপডেট করুন।</p>
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
                  <label className="text-sm font-medium text-slate-700">ইবুক নাম</label>
                  <input
                    type="text"
                    placeholder="যেমন: PCOS ডায়েট প্ল্যান"
                    value={formState.title}
                    onChange={(event) => handleFormChange('title', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">ক্যাটাগরি</label>
                  <select
                    value={formState.category}
                    onChange={(event) => handleFormChange('category', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    {Object.values(BookCategory).map((category) => (
                      <option key={category} value={category}>
                        {categoryLabels[category]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">ইবুক চার্জ (৳)</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="যেমন: 500"
                    value={formState.price || ''}
                    onChange={(event) => handleFormChange('price', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    required
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700">কভার ইমেজ URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/cover.jpg"
                    value={formState.coverImage}
                    onChange={(event) => handleFormChange('coverImage', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Google Drive Link (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/..."
                    value={formState.driveLink ?? ''}
                    onChange={(event) => handleFormChange('driveLink', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Download Link / PDF URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formState.downloadLink ?? ''}
                    onChange={(event) => handleFormChange('downloadLink', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700">অথবা PDF আপলোড করুন</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-emerald-50 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-emerald-700"
                  />
                  {isUploadingPdf && <p className="text-xs text-slate-500">PDF আপলোড হচ্ছে...</p>}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700">বিবরণ</label>
                  <textarea
                    rows={4}
                    placeholder="ইবুক সম্পর্কে সংক্ষিপ্ত বিবরণ লিখুন"
                    value={formState.description}
                    onChange={(event) => handleFormChange('description', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                <p className="inline-flex items-center gap-2">
                  <BookText className="h-4 w-4 text-emerald-600" />
                  PDF আপলোড করলে Download Link ফিল্ড অটো ফিল হবে।
                </p>
              </div>

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
                  {isSaving ? 'সেভ হচ্ছে...' : editingId ? 'আপডেট ইবুক' : 'ইবুক যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EbooksPage;
