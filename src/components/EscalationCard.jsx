import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function EscalationCard({ onEscalate }) {
  return (
    <div className="w-full max-w-xl mx-auto bg-brand-creamDark border border-brand-taupe/20 p-8 text-center space-y-6">
      <div className="mx-auto w-10 h-10 bg-white flex items-center justify-center text-brand-espresso border border-brand-taupe/15">
        <HelpCircle className="w-5 h-5 stroke-[1.25]" />
      </div>
      
      <div className="space-y-2">
        <h3 className="font-serif text-xl text-brand-espresso font-medium">Still need help?</h3>
        <p className="font-sans text-xs text-brand-espresso/60 max-w-xs mx-auto leading-relaxed">
          If you have questions about your delivery timeline or require order assistance, our support team is available.
        </p>
      </div>

      <div>
        <button
          onClick={onEscalate}
          className="px-8 py-3.5 bg-brand-espresso text-brand-cream hover:bg-brand-chocolate transition-premium text-xs uppercase tracking-widest font-semibold"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
}
