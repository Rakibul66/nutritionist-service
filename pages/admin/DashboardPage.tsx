import React, { useEffect, useMemo, useState } from 'react';
import { fetchOrders, fetchRecentReviews, fetchRemoteEbooks } from '../../services/firebaseService';

const performanceSummary = [
  { label: 'Time to first byte', value: '3.412s', tone: 'bg-rose-50 text-rose-600' },
  { label: 'First contentful paint', value: '2.811s', tone: 'bg-amber-50 text-amber-600' },
  { label: 'Speed index', value: '5.825s', tone: 'bg-rose-50 text-rose-600' },
  { label: 'Page weight', value: '3.783KB', tone: 'bg-emerald-50 text-emerald-600' },
];

const traceScores = [
  { label: 'Is it quick?', value: '54 pts', color: 'bg-slate-100 text-slate-900' },
  { label: 'Is it usable?', value: '16 pts', color: 'bg-orange-50 text-orange-600' },
  { label: 'Is it resilient?', value: '93 pts', color: 'bg-emerald-50 text-emerald-600' },
];

const usageSegments = [
  { label: 'First contentful paint', values: ['47%', '31%', '21%'] },
  { label: 'Largest contentful paint', values: ['61%', '26%', '13%'] },
  { label: 'Cumulative layout shift', values: ['92%', '6%', '2%'] },
  { label: 'Time to first byte', values: ['18%', '50%', '31%'] },
];

const improvementTips = [
  { label: 'Optimize images', impact: 'High impact' },
  { label: 'Minimize HTTP requests', impact: 'Medium impact' },
  { label: 'Enable browser caching', impact: 'Medium impact' },
  { label: 'Implement lazy loading', impact: 'Low impact' },
];

const DashboardPage: React.FC = () => {
  const [orders, setOrders] = useState<number>(0);
  const [reviews, setReviews] = useState(0);
  const [ebooks, setEbooks] = useState(0);

  useEffect(() => {
    fetchOrders().then((data) => setOrders(data.length)).catch(() => setOrders(0));
    fetchRecentReviews().then((data) => setReviews(data.length)).catch(() => setReviews(0));
    fetchRemoteEbooks().then((data) => setEbooks(data.length));
  }, []);

  const homeCount = useMemo(() => orders + reviews + ebooks, [orders, reviews, ebooks]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white/80 p-6 shadow-lg border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">Performance results</p>
            <h1 className="text-2xl font-semibold text-slate-900">Page performance summary</h1>
          </div>
          <span className="text-xs text-slate-500">Updated just now</span>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceSummary.map((item) => (
            <div key={item.label} className={`rounded-2xl border border-slate-100 p-4 ${item.tone}`}>
              <p className="text-[11px] font-semibold uppercase text-slate-500">{item.label}</p>
              <p className="text-xl font-bold text-slate-900 mt-2">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-white/70 p-6 shadow-lg border border-slate-200 grid gap-6 lg:grid-cols-3">
        {traceScores.map((score) => (
          <div key={score.label} className="rounded-2xl border border-slate-100 p-4 bg-white">
            <p className="text-xs uppercase tracking-widest text-slate-400">{score.label}</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{score.value}</p>
            <div className="mt-3 h-2 rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: '65%' }} />
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-3xl bg-white/80 p-6 shadow-lg border border-slate-200 grid gap-6 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Real world usage</p>
          <h2 className="text-xl font-semibold text-slate-900">User distribution</h2>
          <div className="mt-4 space-y-3">
            {usageSegments.map((segment) => (
              <div key={segment.label} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <p>{segment.label}</p>
                  <p>High</p>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] uppercase tracking-widest">
                  {segment.values.map((value) => (
                    <span key={value} className="rounded-full bg-white px-2 py-1 text-slate-600 border border-slate-200 text-center">
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Improvement tips</p>
          <h2 className="text-xl font-semibold text-slate-900">Optimize before release</h2>
          <div className="mt-4 space-y-3">
            {improvementTips.map((tip) => (
              <div key={tip.label} className="flex items-center justify-between rounded-2xl bg-white/80 border border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">{tip.label}</p>
                <span className="text-xs uppercase tracking-widest text-slate-500">{tip.impact}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {[
          { label: 'Home dashboard activity', value: homeCount },
          { label: 'Orders tracked', value: orders },
          { label: 'Reviews received', value: reviews },
          { label: 'Ebooks live', value: ebooks },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl bg-white/90 p-4 border border-slate-100 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{item.value}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default DashboardPage;
