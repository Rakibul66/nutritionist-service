import React, { useEffect, useState } from 'react';
import { Feedback, FeedbackStatus } from '../../types';
import { fetchFeedbackEntries, removeFeedback, updateFeedbackStatus } from '../../services/firebaseService';

type ActionDialogState = {
  open: boolean;
  message: string;
};

const statusClassMap: Record<FeedbackStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
};

const statusLabelMap: Record<FeedbackStatus, string> = {
  pending: 'পেন্ডিং',
  approved: 'এপ্রুভড',
  rejected: 'রিজেক্টেড',
};

const FeedbackPage: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [dialogState, setDialogState] = useState<ActionDialogState>({
    open: false,
    message: '',
  });

  const loadFeedback = async () => {
    try {
      const data = await fetchFeedbackEntries();
      setFeedbackList(data);
    } catch (error) {
      console.error(error);
      setFeedbackList([]);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const handleStatusUpdate = async (feedbackId: string, status: FeedbackStatus) => {
    try {
      await updateFeedbackStatus(feedbackId, status);
      setFeedbackList((prev) =>
        prev.map((item) => (item.id === feedbackId ? { ...item, status } : item))
      );

      const dialogMessage =
        status === 'approved'
          ? 'ফিডব্যাকটি সফলভাবে এপ্রুভ করা হয়েছে।'
          : status === 'rejected'
            ? 'ফিডব্যাকটি রিজেক্ট করা হয়েছে।'
            : 'ফিডব্যাকটি পেন্ডিং করা হয়েছে।';

      setDialogState({ open: true, message: dialogMessage });
      setStatusMessage(dialogMessage);
    } catch (error) {
      console.error(error);
      setStatusMessage('স্ট্যাটাস আপডেট করা যায়নি।');
      setDialogState({ open: true, message: 'দুঃখিত, স্ট্যাটাস আপডেট করা যায়নি।' });
    }
  };

  const handleDelete = async (feedbackId: string) => {
    try {
      await removeFeedback(feedbackId);
      setFeedbackList((prev) => prev.filter((item) => item.id !== feedbackId));
      setStatusMessage('ফিডব্যাকটি ডিলিট করা হয়েছে।');
      setDialogState({ open: true, message: 'ফিডব্যাকটি সফলভাবে ডিলিট করা হয়েছে।' });
    } catch (error) {
      console.error(error);
      setStatusMessage('ফিডব্যাক ডিলিট করা যায়নি।');
      setDialogState({ open: true, message: 'দুঃখিত, ফিডব্যাক ডিলিট করা যায়নি।' });
    }
  };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.35em] text-emerald-500">Feedback</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">ফিডব্যাক মডারেশন</h1>
        <p className="mt-1 text-sm text-slate-500">
          টেস্টিমোনিয়াল সেকশনে দেখানোর জন্য এখানে ফিডব্যাক এপ্রুভ বা রিজেক্ট করুন।
        </p>
      </header>

      <div className="rounded-3xl bg-white border border-slate-200 shadow-lg p-6 space-y-4">
        {feedbackList.length ? (
          feedbackList.map((feedback) => (
            <div key={feedback.id} className="rounded-2xl border border-slate-100 p-4 bg-slate-50 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{feedback.name}</p>
                  <p className="text-xs text-slate-500">{feedback.role}</p>
                  <p className="text-[11px] text-slate-400">{new Date(feedback.submittedAt).toLocaleString()}</p>
                </div>
                {feedback.status !== 'approved' && (
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] uppercase tracking-widest ${statusClassMap[feedback.status]}`}
                  >
                    {statusLabelMap[feedback.status]}
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-700">{feedback.content}</p>

              <div className="flex flex-wrap items-center gap-2">
                {feedback.status !== 'approved' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(feedback.id, 'approved')}
                      className="rounded-full border border-emerald-300 px-3 py-1 text-[11px] uppercase tracking-widest text-emerald-700"
                    >
                      এপ্রুভ
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(feedback.id, 'rejected')}
                      className="rounded-full border border-rose-300 px-3 py-1 text-[11px] uppercase tracking-widest text-rose-700"
                    >
                      রিজেক্ট
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(feedback.id, 'pending')}
                      className="rounded-full border border-slate-300 px-3 py-1 text-[11px] uppercase tracking-widest text-slate-700"
                    >
                      পেন্ডিং
                    </button>
                  </>
                )}

                <button
                  onClick={() => handleDelete(feedback.id)}
                  className="rounded-full border border-rose-300 px-3 py-1 text-[11px] uppercase tracking-widest text-rose-700"
                >
                  ডিলিট
                </button>

                {(feedback.status === 'approved' || feedback.status === 'rejected') && (
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] uppercase tracking-widest ${statusClassMap[feedback.status]}`}
                  >
                    {statusLabelMap[feedback.status]}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">এখনও কোনো ফিডব্যাক জমা হয়নি।</p>
        )}
      </div>

      {statusMessage && <p className="text-sm text-slate-600">{statusMessage}</p>}

      {dialogState.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setDialogState({ open: false, message: '' })}
            className="absolute inset-0 bg-slate-950/50"
            aria-label="Close"
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <p className="text-sm text-slate-800">{dialogState.message}</p>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setDialogState({ open: false, message: '' })}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                ঠিক আছে
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
