import React, { useEffect, useState } from 'react';
import { Ebook, EbookOrder, ServiceIntakeForm, ServiceOrder, ServiceOrderStatus } from '../../types';
import {
  deleteEbookOrder,
  deleteServiceOrder,
  fetchServiceIntakeFormByOrderId,
  fetchOrders,
  fetchRemoteEbooks,
  fetchServiceOrders,
  updateEbookOrderStatus,
  updateServiceOrderStatus,
} from '../../services/firebaseService';
import { useAuth } from '../../contexts/AuthContext';

type OrderTab = 'service' | 'ebook';

const statusPillClass = (status?: string) => {
  if (status === 'approved' || status === 'paid' || status === 'completed') {
    return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  }
  if (status === 'rejected') {
    return 'text-rose-700 bg-rose-50 border-rose-200';
  }
  return 'text-amber-700 bg-amber-50 border-amber-200';
};

const humanizeExtendedKey = (key: string) =>
  key
    .replace(/^female_/, 'মহিলা: ')
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const InfoRows: React.FC<{ rows: Array<{ label: string; value: string | null | undefined }> }> = ({ rows }) => {
  const visible = rows.filter((row) => row.value && row.value.trim());
  if (!visible.length) {
    return <p className="text-xs text-slate-500">কোনো তথ্য নেই।</p>;
  }
  return (
    <div className="grid gap-1">
      {visible.map((row) => (
        <p key={row.label} className="text-xs text-slate-600">
          <span className="font-semibold text-slate-800">{row.label}:</span> {row.value}
        </p>
      ))}
    </div>
  );
};

const OrdersPage: React.FC = () => {
  const { user, adminAuthenticated } = useAuth();
  const [orders, setOrders] = useState<EbookOrder[]>([]);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [serviceIntakeByOrderId, setServiceIntakeByOrderId] = useState<Record<string, ServiceIntakeForm | null>>({});
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<OrderTab>('service');

  const loadData = async () => {
    const [ebookOrders, serviceList, ebooksList] = await Promise.all([
      fetchOrders().catch(() => []),
      fetchServiceOrders().catch(() => []),
      fetchRemoteEbooks().catch(() => []),
    ]);
    setOrders(ebookOrders);
    setServiceOrders(serviceList);
    setEbooks(ebooksList);

    if (adminAuthenticated && serviceList.length) {
      const intakeEntries = await Promise.all(
        serviceList.map(async (order) => {
          const intake = await fetchServiceIntakeFormByOrderId(order.id).catch(() => null);
          return [order.id, intake] as const;
        })
      );
      setServiceIntakeByOrderId(Object.fromEntries(intakeEntries));
    } else {
      setServiceIntakeByOrderId({});
    }
  };

  useEffect(() => {
    loadData();
  }, [adminAuthenticated]);

  const visibleEbookOrders = adminAuthenticated
    ? orders
    : orders.filter((order) => order.userEmail?.toLowerCase() === user?.email?.toLowerCase());
  const visibleServiceOrders = adminAuthenticated
    ? serviceOrders
    : serviceOrders.filter(
        (order) =>
          order.userEmail?.toLowerCase() === user?.email?.toLowerCase() || order.userId === user?.uid
      );
  const ebookLinkMap: Record<string, string> = {};
  ebooks.forEach((book) => {
    const link = book.downloadLink ?? book.driveLink;
    if (link) {
      ebookLinkMap[book.id] = link;
    }
  });

  const handleServiceOrderStatus = async (orderId: string, status: ServiceOrderStatus) => {
    try {
      await updateServiceOrderStatus(orderId, status);
      setServiceOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)));
      setStatusMessage(`সার্ভিস অর্ডার ${status} করা হয়েছে।`);
    } catch (error) {
      console.error(error);
      setStatusMessage('স্ট্যাটাস আপডেট করা যায়নি।');
    }
  };

  const handleEbookOrderStatus = async (orderId: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      await updateEbookOrderStatus(orderId, status);
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)));
      setStatusMessage(`ইবুক অর্ডার ${status} করা হয়েছে।`);
    } catch (error) {
      console.error(error);
      setStatusMessage('ইবুক অর্ডারের স্ট্যাটাস আপডেট করা যায়নি।');
    }
  };

  const handleServiceOrderDelete = async (orderId: string) => {
    try {
      await deleteServiceOrder(orderId);
      setServiceOrders((prev) => prev.filter((order) => order.id !== orderId));
      setStatusMessage('সার্ভিস অর্ডার ডিলিট করা হয়েছে।');
    } catch (error) {
      console.error(error);
      setStatusMessage('সার্ভিস অর্ডার ডিলিট করা যায়নি।');
    }
  };

  const handleEbookOrderDelete = async (orderId: string) => {
    try {
      await deleteEbookOrder(orderId);
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      setStatusMessage('ইবুক অর্ডার ডিলিট করা হয়েছে।');
    } catch (error) {
      console.error(error);
      setStatusMessage('ইবুক অর্ডার ডিলিট করা যায়নি।');
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-emerald-500">Orders</p>
        <h1 className="text-2xl font-semibold text-slate-900">অর্ডার ম্যানেজমেন্ট</h1>
        <p className="text-sm text-slate-500 mt-1">ইবুক ও সার্ভিস অর্ডার ট্র্যাক করুন।</p>
      </header>

      {statusMessage && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {statusMessage}
        </div>
      )}

      <section className="rounded-3xl bg-white border border-slate-200 shadow-lg p-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('service')}
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${
              activeTab === 'service'
                ? 'border-emerald-600 bg-emerald-600 text-white'
                : 'border-slate-300 bg-white text-slate-700'
            }`}
          >
            সার্ভিস অর্ডার
          </button>
          <button
            onClick={() => setActiveTab('ebook')}
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${
              activeTab === 'ebook'
                ? 'border-emerald-600 bg-emerald-600 text-white'
                : 'border-slate-300 bg-white text-slate-700'
            }`}
          >
            ইবুক অর্ডার
          </button>
        </div>

        {activeTab === 'service' ? (
          visibleServiceOrders.length ? (
            visibleServiceOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex flex-col gap-3"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{order.serviceTitle}</p>
                    <p className="text-xs text-slate-500">অর্ডার আইডি: {order.id}</p>
                    <p className="text-xs text-slate-500">ইউজার: {order.userName} ({order.userEmail})</p>
                    <p className="text-xs text-slate-500">সময়: {new Date(order.createdAt).toLocaleString('en-BD')}</p>
                    <p className="text-xs text-slate-500">পেমেন্ট: {order.paymentMethod.toUpperCase()}</p>
                    <p className="text-xs text-slate-500">পেমেন্ট নম্বর: {order.paymentNumber}</p>
                    <p className="text-xs text-slate-500">TRX ID: {order.transactionId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">{order.servicePrice}</p>
                    <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] uppercase tracking-widest ${statusPillClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {adminAuthenticated && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleServiceOrderStatus(order.id, 'approved')}
                        className="rounded-full border border-emerald-300 px-3 py-1 text-[11px] uppercase tracking-widest text-emerald-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleServiceOrderStatus(order.id, 'rejected')}
                        className="rounded-full border border-rose-300 px-3 py-1 text-[11px] uppercase tracking-widest text-rose-700"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleServiceOrderStatus(order.id, 'pending')}
                        className="rounded-full border border-slate-300 px-3 py-1 text-[11px] uppercase tracking-widest text-slate-700"
                      >
                        Pending
                      </button>
                      <button
                        onClick={() => handleServiceOrderStatus(order.id, 'completed')}
                        className="rounded-full border border-blue-300 px-3 py-1 text-[11px] uppercase tracking-widest text-blue-700"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleServiceOrderDelete(order.id)}
                        className="rounded-full border border-rose-300 px-3 py-1 text-[11px] uppercase tracking-widest text-rose-700"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setExpandedOrderId((prev) => (prev === order.id ? null : order.id))}
                        className="rounded-full border border-indigo-300 px-3 py-1 text-[11px] uppercase tracking-widest text-indigo-700"
                      >
                        {expandedOrderId === order.id ? 'Hide Form' : 'View Form'}
                      </button>
                    </div>

                    {expandedOrderId === order.id && (
                      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 space-y-4">
                        {(() => {
                          const intake = serviceIntakeByOrderId[order.id];
                          if (!intake) {
                            return <p className="text-xs text-slate-500">এই অর্ডারের intake form এখনো সাবমিট হয়নি।</p>;
                          }
                          const data = intake.data;
                          const extendedEntries = Object.entries(data.extendedAnswers ?? {}).filter(
                            ([, value]) => Boolean(value?.trim())
                          );
                          return (
                            <>
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-slate-900">ফর্ম উত্তর (Section Wise)</p>
                                <span className="text-[11px] text-slate-500">
                                  {intake.submitted ? 'Submitted' : 'Draft'} • {new Date(intake.updatedAt).toLocaleString('en-BD')}
                                </span>
                              </div>

                              <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
                                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Basic</p>
                                  <InfoRows
                                    rows={[
                                      { label: 'পূর্ণ নাম', value: data.fullName },
                                      { label: 'বয়স', value: data.age },
                                      { label: 'লিঙ্গ', value: data.gender },
                                      { label: 'উচ্চতা', value: data.height },
                                      { label: 'ওজন', value: data.weight },
                                      { label: 'কোমরের মাপ', value: data.waist },
                                      { label: 'Blood Group', value: data.bloodGroup },
                                      { label: 'মূল লক্ষ্য', value: data.goal },
                                    ]}
                                  />
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
                                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Lifestyle</p>
                                  <InfoRows
                                    rows={[
                                      { label: 'দৈনিক কাজ', value: data.dailyWorkType },
                                      { label: 'শরীরচর্চা', value: data.exerciseFrequency },
                                      { label: 'ব্যায়াম বিস্তারিত', value: data.exerciseDetails },
                                      { label: 'খাদ্যাভ্যাস', value: data.foodPattern },
                                      { label: 'খাবার ফ্রিকোয়েন্সি', value: data.mealFrequency },
                                      { label: 'ফুড ডায়েরি', value: data.foodDiary3Days },
                                      { label: 'পানি', value: data.waterIntake },
                                      { label: 'জাঙ্ক ফুড', value: data.junkFoodFrequency },
                                      { label: 'কার্ব craving', value: data.carbsCraving },
                                      { label: 'ডিনার-ব্রেকফাস্ট গ্যাপ', value: data.fastingGapHours },
                                      { label: 'ঘুম', value: data.sleepHours },
                                    ]}
                                  />
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
                                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Medical</p>
                                  <InfoRows
                                    rows={[
                                      { label: 'স্বাস্থ্য সমস্যা', value: data.healthProblems },
                                      { label: 'ওষুধ/সাপ্লিমেন্ট', value: data.currentMedications },
                                      { label: 'রক্ত পরীক্ষা', value: data.recentBloodTest },
                                      { label: 'Fasting Glucose/HbA1c', value: data.fastingGlucoseHbA1c },
                                      { label: 'পারিবারিক ইতিহাস', value: data.familyHistory },
                                      { label: 'হজম সমস্যা', value: data.digestiveIssues },
                                      { label: 'অ্যালার্জি', value: data.allergyInfo },
                                      { label: 'Intolerance', value: data.intoleranceInfo },
                                    ]}
                                  />
                                  {data.medicalReportUrls?.length ? (
                                    <div className="pt-1">
                                      <p className="text-[11px] font-semibold text-slate-700 mb-1">Medical Reports</p>
                                      <div className="flex flex-wrap gap-2">
                                        {data.medicalReportUrls.map((url, index) => (
                                          <a
                                            key={`${url}-${index}`}
                                            href={url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100"
                                          >
                                            Report {index + 1}
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  ) : null}
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
                                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Extra Q&A</p>
                                  {extendedEntries.length ? (
                                    <div className="grid gap-1">
                                      {extendedEntries.map(([key, value]) => (
                                        <p key={key} className="text-xs text-slate-600">
                                          <span className="font-semibold text-slate-800">{humanizeExtendedKey(key)}:</span> {value}
                                        </p>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-xs text-slate-500">অতিরিক্ত প্রশ্নমালার উত্তর পাওয়া যায়নি।</p>
                                  )}
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">এখনও কোনো সার্ভিস অর্ডার আসেনি।</p>
          )
        ) : visibleEbookOrders.length ? (
          visibleEbookOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            >
              {(() => {
                const approved =
                  order.status === 'approved' || order.status === 'paid' || order.status === 'completed';
                const link = ebookLinkMap[order.ebookId];
                return (
                  <>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{order.ebookTitle}</p>
                      <p className="text-xs text-slate-500">{order.userEmail}</p>
                      <p className="text-xs text-slate-400">পেমেন্ট: {order.paymentMethod}</p>
                      <p className="text-xs text-slate-400">পেমেন্ট নম্বর: {order.paymentNumber || '-'}</p>
                      <p className="text-xs text-slate-400">TRX ID: {order.transactionId || '-'}</p>
                      {!adminAuthenticated && approved && link ? (
                        <div className="mt-2 flex gap-2">
                          <a
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                          >
                            View PDF
                          </a>
                          <a
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                          >
                            Download
                          </a>
                        </div>
                      ) : null}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">৳{order.price}</p>
                      <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] uppercase tracking-widest ${statusPillClass(order.status)}`}>
                        {order.status ?? 'pending'}
                      </span>
                    </div>
                  </>
                );
              })()}
              {adminAuthenticated && (
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <button
                    onClick={() => handleEbookOrderStatus(order.id, 'approved')}
                    className="rounded-full border border-emerald-300 px-3 py-1 text-[11px] uppercase tracking-widest text-emerald-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleEbookOrderStatus(order.id, 'rejected')}
                    className="rounded-full border border-rose-300 px-3 py-1 text-[11px] uppercase tracking-widest text-rose-700"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleEbookOrderStatus(order.id, 'pending')}
                    className="rounded-full border border-slate-300 px-3 py-1 text-[11px] uppercase tracking-widest text-slate-700"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleEbookOrderDelete(order.id)}
                    className="rounded-full border border-rose-300 px-3 py-1 text-[11px] uppercase tracking-widest text-rose-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No ebook orders have been placed yet.</p>
        )}
      </section>
    </div>
  );
};

export default OrdersPage;
