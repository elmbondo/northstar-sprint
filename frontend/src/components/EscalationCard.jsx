import React from 'react';

export default function EscalationCard({ onEscalate }) {
  return (
    <div className="w-full max-w-3xl mx-auto rounded-[2rem] border border-brand-taupe/20 bg-brand-cream p-8 text-center shadow-[0_20px_50px_rgba(25,18,11,0.04)]">
      <p className="text-[10px] uppercase tracking-[0.25em] text-brand-espresso/60">Need extra help?</p>
      <h3 className="mt-3 font-serif text-2xl text-brand-espresso">Connect with customer care</h3>
      <p className="mt-3 text-sm text-brand-espresso/65">
        If your order still needs review, our support team can help with tracking, refunds, or delivery issues.
      </p>
      <button
        type="button"
        onClick={onEscalate}
        className="mt-6 bg-brand-espresso px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-brand-cream hover:bg-brand-chocolate transition-colors"
      >
        Escalate Request
      </button>
    </div>
  );
}
