import React from 'react';

export default function LoadingState() {
  return (
    <div className="w-full max-w-xl mx-auto rounded-[2rem] border border-brand-taupe/20 bg-white p-8 shadow-[0_20px_50px_rgba(25,18,11,0.04)]">
      <div className="flex items-center justify-center gap-3 text-brand-espresso">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-espresso/20 border-t-brand-espresso" />
        <span className="text-xs uppercase tracking-[0.25em]">Checking order status</span>
      </div>
    </div>
  );
}
