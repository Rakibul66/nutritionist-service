import React, { useEffect, useState } from 'react';
import { EbookOrder } from '../../types';
import { fetchOrders } from '../../services/firebaseService';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<EbookOrder[]>([]);

  useEffect(() => {
    fetchOrders().then(setOrders).catch(() => setOrders([]));
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-emerald-500">Orders</p>
        <h1 className="text-2xl font-semibold text-slate-900">User ebook orders</h1>
        <p className="text-sm text-slate-500 mt-1">Track each order and payment status.</p>
      </header>
      <div className="rounded-3xl bg-white border border-slate-200 shadow-lg p-6 space-y-4">
        {orders.length ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">{order.ebookTitle}</p>
                <p className="text-xs text-slate-500">{order.userEmail}</p>
                <p className="text-xs text-slate-400">{order.paymentMethod}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-slate-900">৳{order.price}</p>
                <p className="text-[11px] uppercase tracking-widest text-emerald-600">{order.status}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No orders have been placed yet.</p>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
