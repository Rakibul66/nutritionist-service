import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { Feedback } from '../types';
import { fetchFeedbackEntries, removeFeedback, updateFeedback } from '../services/firebaseService';
import { PencilLine, Save, Trash2, X } from 'lucide-react';

const statusPillClass = (status?: string) => {
  if (status === 'approved' || status === 'paid' || status === 'completed') {
    return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  }
  if (status === 'rejected') {
    return 'text-rose-700 bg-rose-50 border-rose-200';
  }
  return 'text-amber-700 bg-amber-50 border-amber-200';
};

const UserFeedbackPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [myFeedback, setMyFeedback] = useState<Feedback[]>([]);
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null);
  const [editingFeedback, setEditingFeedback] = useState({
    name: '',
    role: '',
    content: '',
    image: '',
  });
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user?.email) return;
      setLoading(true);
      try {
        const allFeedback = await fetchFeedbackEntries().catch(() => []);
        const normalizedEmail = user.email?.toLowerCase();
        const normalizedName = user.displayName?.trim().toLowerCase();
        setMyFeedback(
          allFeedback.filter(
            (feedback) =>
              feedback.userEmail?.toLowerCase() === normalizedEmail ||
              feedback.userId === user.uid ||
              (!feedback.userEmail &&
                !feedback.userId &&
                Boolean(normalizedName) &&
                feedback.name?.trim().toLowerCase() === normalizedName)
          )
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.email, user?.uid]);

  const startFeedbackEdit = (entry: Feedback) => {
    setEditingFeedbackId(entry.id);
    setEditingFeedback({
      name: entry.name,
      role: entry.role,
      content: entry.content,
      image: entry.image,
    });
  };

  const cancelFeedbackEdit = () => {
    setEditingFeedbackId(null);
    setEditingFeedback({ name: '', role: '', content: '', image: '' });
  };

  const saveFeedbackEdit = async (feedbackId: string) => {
    if (!editingFeedback.name.trim() || !editingFeedback.role.trim() || !editingFeedback.content.trim()) {
      return;
    }
    setActionLoadingId(feedbackId);
    try {
      const updated = await updateFeedback(feedbackId, {
        name: editingFeedback.name.trim(),
        role: editingFeedback.role.trim(),
        content: editingFeedback.content.trim(),
        image: editingFeedback.image.trim() || 'https://picsum.photos/100/100?random=99',
      });
      if (updated) {
        setMyFeedback((prev) => prev.map((item) => (item.id === feedbackId ? updated : item)));
      }
      cancelFeedbackEdit();
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleFeedbackDelete = async (feedbackId: string) => {
    setActionLoadingId(feedbackId);
    try {
      await removeFeedback(feedbackId);
      setMyFeedback((prev) => prev.filter((item) => item.id !== feedbackId));
      if (editingFeedbackId === feedbackId) {
        cancelFeedbackEdit();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">আমার ফিডব্যাক</h1>
          <p className="text-sm text-slate-500">আপনার অ্যাকাউন্ট থেকে জমা দেয়া ফিডব্যাক এখানে edit/delete করতে পারবেন।</p>

          {loading ? (
            <p className="text-sm text-slate-500">লোড হচ্ছে...</p>
          ) : myFeedback.length ? (
            myFeedback.map((entry) => {
              const isEditing = editingFeedbackId === entry.id;
              return (
                <article key={entry.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wider ${statusPillClass(entry.status)}`}>
                      {entry.status}
                    </span>
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveFeedbackEdit(entry.id)}
                            disabled={actionLoadingId === entry.id}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
                          >
                            <Save className="h-3.5 w-3.5" /> Save
                          </button>
                          <button
                            onClick={cancelFeedbackEdit}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                          >
                            <X className="h-3.5 w-3.5" /> Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startFeedbackEdit(entry)}
                          className="inline-flex items-center gap-1 rounded-lg border border-blue-300 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                        >
                          <PencilLine className="h-3.5 w-3.5" /> Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleFeedbackDelete(entry.id)}
                        disabled={actionLoadingId === entry.id}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-300 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="grid gap-3">
                      <input
                        type="text"
                        value={editingFeedback.name}
                        onChange={(event) => setEditingFeedback((prev) => ({ ...prev, name: event.target.value }))}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                        placeholder="নাম"
                      />
                      <input
                        type="text"
                        value={editingFeedback.role}
                        onChange={(event) => setEditingFeedback((prev) => ({ ...prev, role: event.target.value }))}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                        placeholder="পরিচয়"
                      />
                      <textarea
                        rows={3}
                        value={editingFeedback.content}
                        onChange={(event) => setEditingFeedback((prev) => ({ ...prev, content: event.target.value }))}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                        placeholder="মতামত"
                      />
                      <input
                        type="url"
                        value={editingFeedback.image}
                        onChange={(event) => setEditingFeedback((prev) => ({ ...prev, image: event.target.value }))}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                        placeholder="ছবি URL (optional)"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-sm text-slate-700">
                      <p><span className="font-semibold text-slate-900">নাম:</span> {entry.name}</p>
                      <p><span className="font-semibold text-slate-900">পরিচয়:</span> {entry.role}</p>
                      <p className="leading-relaxed"><span className="font-semibold text-slate-900">মতামত:</span> {entry.content}</p>
                      <p className="text-xs text-slate-500">
                        জমা: {new Date(entry.submittedAt).toLocaleString('en-BD')}
                        {entry.updatedAt ? ` · আপডেট: ${new Date(entry.updatedAt).toLocaleString('en-BD')}` : ''}
                      </p>
                    </div>
                  )}
                </article>
              );
            })
          ) : (
            <p className="text-sm text-slate-500">আপনার account থেকে এখনো কোনো ফিডব্যাক পাওয়া যায়নি।</p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default UserFeedbackPage;
