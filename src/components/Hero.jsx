import React from 'react';

export default function Hero({ onNavigate }) {
  return (
    <section className="relative overflow-hidden bg-brand-cream border-b border-brand-taupe/10 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Text Content */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-brand-espresso leading-[1.08] tracking-tight">
              We&apos;re here <br className="hidden sm:inline" />
              to help.
            </h1>
            <p className="font-sans text-brand-espresso/70 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Get quick answers to your order and support questions without waiting for a support agent. Complete self-service tools designed for your convenience.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => onNavigate('order-status')}
                className="w-full sm:w-auto px-8 py-4 bg-brand-espresso text-brand-cream hover:bg-brand-chocolate transition-premium text-xs uppercase tracking-widest font-medium"
              >
                Track My Order
              </button>
              <button
                onClick={() => {
                  const element = document.getElementById('support-options');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto px-8 py-4 border border-brand-espresso/20 text-brand-espresso hover:bg-white/50 transition-premium text-xs uppercase tracking-widest font-medium"
              >
                Find Answers Now
              </button>
            </div>
          </div>

          {/* Hero Image Side */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-lg aspect-[4/3] sm:aspect-[16/11] bg-brand-beige overflow-hidden shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=1200"
                alt="Minimalist retail display with neutral earth tones"
                className="w-full h-full object-cover grayscale-[15%] contrast-[95%] hover:scale-105 transition-transform duration-700"
                loading="eager"
              />
              <div className="absolute inset-0 bg-brand-espresso/5 pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
