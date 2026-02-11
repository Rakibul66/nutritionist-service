import React, { useEffect, useState } from 'react';
import { BookCategory, Ebook, EbookPublishPayload } from '../../types';
import { fetchRemoteEbooks, publishEbook } from '../../services/firebaseService';

const emptyPayload: EbookPublishPayload = {
  title: '',
  description: '',
  category: BookCategory.CHILD,
  price: 0,
  coverImage: '',
};

const EbooksPage: React.FC = () => {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [formState, setFormState] = useState<EbookPublishPayload>(emptyPayload);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchRemoteEbooks().then(setEbooks);
  }, []);

  const handleFormChange = (key: keyof EbookPublishPayload, value: string | number) => {
    setFormState((prev) => ({
      ...prev,
      [key]: key === 'price' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formState.title || !formState.price) {
      setStatusMessage('Title এবং Price দিতে হবে.');
      return;
    }
    setIsSaving(true);
    setStatusMessage(null);
    try {
      if (editingId) {
        setEbooks((prev) =>
          prev.map((book) => (book.id === editingId ? { ...book, ...formState } : book))
        );
        setStatusMessage('ইবুক তথ্য আপডেট হয়েছে।');
      } else {
        await publishEbook(formState);
        setEbooks((prev) => [
          { id: crypto.randomUUID(), ...formState },
          ...prev,
        ]);
        setStatusMessage('ইবুক Firebase-এ যোগ হয়েছে।');
      }
      setFormState(emptyPayload);
      setEditingId(null);
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
    });
  };

  const deleteBook = (bookId: string) => {
    setEbooks((prev) => prev.filter((book) => book.id !== bookId));
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-emerald-500">Ebooks</p>
        <h1 className="text-2xl font-semibold text-slate-900">Catalog operations</h1>
        <p className="text-sm text-slate-500 mt-1">Add, edit, or delete ebook entries.</p>
      </header>

      <div className="grid gap-6 xl:grid-cols-2">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg space-y-4"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            {editingId ? 'Edit ebook' : 'Add new ebook'}
          </h2>
          <input
            type="text"
            placeholder="Title"
            value={formState.title}
            onChange={(event) => handleFormChange('title', event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            required
          />
          <select
            value={formState.category}
            onChange={(event) => handleFormChange('category', event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          >
            {Object.values(BookCategory).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={0}
            placeholder="Price (BDT)"
            value={formState.price}
            onChange={(event) => handleFormChange('price', event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            required
          />
          <input
            type="url"
            placeholder="Cover image URL"
            value={formState.coverImage}
            onChange={(event) => handleFormChange('coverImage', event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          />
          <textarea
            rows={3}
            placeholder="Description"
            value={formState.description}
            onChange={(event) => handleFormChange('description', event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          />
          <button
            type="submit"
            className="w-full rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
          >
            {isSaving ? 'Saving…' : editingId ? 'Update ebook' : 'Add ebook'}
          </button>
          {statusMessage && <p className="text-xs text-slate-500">{statusMessage}</p>}
        </form>

        <div className="space-y-3">
          {ebooks.map((book) => (
            <div
              key={book.id}
              className="flex flex-col gap-2 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{book.title}</p>
                  <p className="text-[11px] uppercase tracking-widest text-slate-400">{book.category}</p>
                </div>
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest">
                  <button
                    onClick={() => startEdit(book)}
                    className="text-slate-500 hover:text-slate-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBook(book.id)}
                    className="text-rose-600 hover:text-rose-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-600">৳{book.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EbooksPage;
