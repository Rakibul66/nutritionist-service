import React, { useEffect, useMemo, useState } from 'react';
import { fetchFeedbackEntries, fetchOrders, fetchRecentReviews, fetchRemoteEbooks } from '../../services/firebaseService';
import { EbookOrder, EbookReview, Feedback } from '../../types';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(amount);

const DashboardPage: React.FC = () => {
  const [orders, setOrders] = useState<EbookOrder[]>([]);
  const [reviews, setReviews] = useState<EbookReview[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [ebooks, setEbooks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const [ordersData, reviewsData, ebooksData, feedbackData] = await Promise.all([
          fetchOrders().catch(() => []),
          fetchRecentReviews().catch(() => []),
          fetchRemoteEbooks().catch(() => []),
          fetchFeedbackEntries().catch(() => []),
        ]);

        setOrders(ordersData);
        setReviews(reviewsData);
        setEbooks(ebooksData.length);
        setFeedback(feedbackData);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const metrics = useMemo(() => {
    const paidOrders = orders.filter(
      (order) => order.status === 'paid' || order.status === 'completed' || order.status === 'approved'
    );
    const pendingOrders = orders.filter((order) => order.status === 'pending');
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.price, 0);
    const avgRating = reviews.length
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;
    const latestOrderDate = orders.length
      ? new Date(
          Math.max(...orders.map((order) => new Date(order.createdAt).getTime()))
        ).toLocaleString()
      : 'এখনও কোনো অর্ডার নেই';

    return {
      totalOrders: orders.length,
      paidOrders: paidOrders.length,
      pendingOrders: pendingOrders.length,
      totalRevenue,
      totalReviews: reviews.length,
      avgRating,
      totalEbooks: ebooks,
      totalFeedback: feedback.length,
      latestOrderDate,
    };
  }, [orders, reviews, ebooks, feedback]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'মোট অর্ডার', value: metrics.totalOrders },
          { label: 'পেইড/কমপ্লিট অর্ডার', value: metrics.paidOrders },
          { label: 'পেন্ডিং অর্ডার', value: metrics.pendingOrders },
          { label: 'মোট রেভিনিউ', value: formatCurrency(metrics.totalRevenue) },
          { label: 'মোট রিভিউ', value: metrics.totalReviews },
          { label: 'গড় রেটিং', value: metrics.totalReviews ? `${metrics.avgRating.toFixed(1)} / 5` : '0 / 5' },
          { label: 'লাইভ ইবুক', value: metrics.totalEbooks },
          { label: 'মোট ফিডব্যাক', value: metrics.totalFeedback },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{item.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{item.value}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default DashboardPage;
