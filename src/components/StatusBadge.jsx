import React from 'react';

const STATUS_THEMES = {
  'Processing': 'bg-brand-sand text-brand-espresso border-brand-taupe/30',
  'Shipped': 'bg-brand-beige text-brand-espresso border-brand-taupe/40',
  'In Transit': 'bg-brand-taupe/20 text-brand-espresso border-brand-taupe/50',
  'Delivered': 'bg-brand-espresso text-brand-cream border-transparent',
  'Delayed': 'bg-[#D2C4B4] text-brand-espresso border-brand-taupe/40',
};

export default function StatusBadge({ status }) {
  const normalizedStatus = status || 'Processing';
  const themeClass = STATUS_THEMES[normalizedStatus] || 'bg-brand-sand text-brand-espresso border-brand-taupe/20';

  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs uppercase tracking-wider font-semibold border ${themeClass}`}>
      {normalizedStatus}
    </span>
  );
}
