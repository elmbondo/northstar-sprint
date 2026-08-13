import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function Returns({ onNavigate }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 sm:py-28 text-center space-y-8">
      <div className="mx-auto w-16 h-16 bg-brand-creamDark flex items-center justify-center text-brand-espresso border border-brand-taupe/15">
        <RefreshCw className="w-6 h-6 stroke-[1.25]" />
      </div>

      <div className="space-y-4">
        <h1 className="font-serif text-4xl sm:text-5xl text-brand-espresso font-medium">
          Returns & Refunds
        </h1>
        <p className="font-sans text-sm text-brand-espresso/60 max-w-md mx-auto leading-relaxed font-light">
          Return and refund self-service is coming soon. Soon you will be able to initiate returns and generate shipping labels directly from this portal.
        </p>
      </div>

      <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => onNavigate('contact')}
          className="w-full sm:w-auto px-8 py-4 bg-brand-espresso text-brand-cream hover:bg-brand-chocolate transition-premium text-xs uppercase tracking-widest font-semibold"
        >
          Contact Support
        </button>
        <button
          onClick={() => onNavigate('home')}
          className="w-full sm:w-auto px-8 py-4 border border-brand-espresso/20 text-brand-espresso hover:bg-brand-cream/40 transition-premium text-xs uppercase tracking-widest font-semibold"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
