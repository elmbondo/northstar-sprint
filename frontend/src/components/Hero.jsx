import React from 'react';

export default function Hero({ onNavigate }) {
  return (
    <section className="relative overflow-hidden bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-block rounded-full border border-brand-espresso/15 bg-brand-espresso/5 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-brand-espresso/75">
              Your order, in focus
            </div>
            <h1 className="font-serif text-4xl md:text-6xl text-brand-espresso leading-none">
              Support that feels effortless.
            </h1>
            <p className="max-w-xl text-base text-brand-espresso/70 leading-relaxed">
              Track shipments, review policy updates, and connect with support in minutes from a single, easy-to-use experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => onNavigate('order-status')}
                className="bg-brand-espresso px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-brand-cream hover:bg-brand-chocolate transition-colors"
              >
                Track Your Order
              </button>
              <button
                type="button"
                onClick={() => onNavigate('returns')}
                className="border border-brand-espresso/20 px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-brand-espresso hover:bg-brand-espresso/5 transition-colors"
              >
                Start a Return
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-brand-taupe/20 bg-white p-6 shadow-[0_20px_50px_rgba(25,18,11,0.08)]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-espresso/60">Shipment Snapshot</span>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-800">
                  On Track
                </span>
              </div>
              <div className="space-y-2">
                <div className="font-serif text-3xl text-brand-espresso">NS1001</div>
                <div className="text-sm text-brand-espresso/65">Estimated delivery: Oct 18, 2026</div>
              </div>
              <div className="h-2 rounded-full bg-brand-espresso/10">
                <div className="h-2 w-3/4 rounded-full bg-brand-espresso" />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-xs uppercase tracking-[0.18em] text-brand-espresso/55">
                <div>
                  <div className="text-lg font-semibold text-brand-espresso">3</div>
                  <div>Days</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-brand-espresso">4</div>
                  <div>Stops</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-brand-espresso">2</div>
                  <div>Alerts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
