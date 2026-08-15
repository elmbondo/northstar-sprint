import React from 'react';

export default function SupportCard({ icon: Icon, title, description, ctaText, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-[2rem] border border-brand-taupe/20 bg-white p-8 text-left shadow-[0_16px_40px_rgba(25,18,11,0.04)] transition-transform hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(25,18,11,0.08)]"
    >
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-brand-espresso text-brand-cream">
        <Icon className="h-5 w-5" />
      </div>
      <div className="space-y-3">
        <h3 className="font-serif text-2xl text-brand-espresso">{title}</h3>
        <p className="text-sm leading-relaxed text-brand-espresso/65">{description}</p>
      </div>
      <div className="mt-8 inline-flex items-center text-[10px] uppercase tracking-[0.25em] text-brand-espresso font-semibold">
        {ctaText}
      </div>
    </button>
  );
}
