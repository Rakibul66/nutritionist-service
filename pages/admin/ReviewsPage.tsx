import React, { useEffect, useState } from 'react';
import { EbookReview } from '../../types';
import { fetchRecentReviews } from '../../services/firebaseService';

const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<EbookReview[]>([]);

  useEffect(() => {
    fetchRecentReviews().then(setReviews).catch(() => setReviews([]));
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-emerald-500">Reviews</p>
        <h1 className="text-2xl font-semibold text-slate-900">User feedback</h1>
        <p className="text-sm text-slate-500 mt-1">Approve reviews before publishing if needed.</p>
      </header>
      <div className="rounded-3xl bg-white border border-slate-200 shadow-lg p-6 space-y-4">
        {reviews.length ? (
          reviews.map((review) => (
            <div key={review.id} className="rounded-2xl border border-slate-100 p-4 bg-slate-50">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">{review.bookTitle}</p>
                <span className="text-[11px] uppercase tracking-widest text-slate-400">{review.rating}★</span>
              </div>
              <p className="text-xs text-slate-500">{review.userEmail}</p>
              <p className="mt-2 text-sm text-slate-700">{review.message}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No reviews submitted yet.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
