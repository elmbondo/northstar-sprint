import React from 'react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="border-t border-brand-taupe/20 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-serif text-2xl text-brand-espresso">Northstar Retail Co.</div>
            <p className="mt-2 text-sm text-brand-espresso/60">Support, shipping, and returns made simple.</p>
          </div>

          <div className="flex flex-wrap gap-6 text-[10px] uppercase tracking-[0.2em] text-brand-espresso/70">
            <button type="button" onClick={() => onNavigate('home')} className="hover:text-brand-espresso">Home</button>
            <button type="button" onClick={() => onNavigate('order-status')} className="hover:text-brand-espresso">Track Order</button>
            <button type="button" onClick={() => onNavigate('returns')} className="hover:text-brand-espresso">Returns</button>
            <button type="button" onClick={() => onNavigate('contact')} className="hover:text-brand-espresso">Contact</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
