import React from 'react';

export default function OrderResult({ order }) {
  const fields = [
    { label: 'Order Number', value: order.orderNumber },
    { label: 'Status', value: order.status },
    { label: 'Product', value: order.productName || order.product },
    { label: 'Order Date', value: order.orderDate },
    { label: 'Estimated Delivery', value: order.expectedDelivery || order.estimatedDelivery },
    { label: 'Last Updated', value: order.lastUpdated },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto rounded-[2rem] border border-brand-taupe/20 bg-white p-8 sm:p-10 shadow-[0_20px_50px_rgba(25,18,11,0.04)]">
      <div className="flex flex-col gap-4 border-b border-brand-taupe/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-brand-espresso/60">Tracking Result</p>
          <h2 className="mt-2 font-serif text-3xl text-brand-espresso">{order.orderNumber}</h2>
        </div>
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-semibold text-emerald-800">
          {order.status}
        </span>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label} className="rounded-2xl border border-brand-taupe/10 bg-brand-cream/50 p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-brand-espresso/55">{field.label}</p>
            <p className="mt-2 font-sans text-base text-brand-espresso">{field.value || '—'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
