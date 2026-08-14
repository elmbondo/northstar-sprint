import React from 'react';
import { Compass } from 'lucide-react';

export default function SignIn({ onNavigate }) {
  return (
    <div className="max-w-md mx-auto px-4 py-24 sm:py-32">
      <div className="bg-white border border-brand-taupe/15 p-8 sm:p-10 text-center space-y-8">
        
        <div className="flex justify-center text-brand-espresso">
          <Compass className="w-12 h-12 stroke-[1.25]" />
        </div>

        <div className="space-y-3">
          <h1 className="font-serif text-3xl text-brand-espresso font-medium">
            Sign In
          </h1>
          <p className="font-sans text-xs text-brand-espresso/60 leading-relaxed font-light">
            Authentication will be enabled in a future release.
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <button
            onClick={() => onNavigate('home')}
            className="w-full py-3.5 bg-brand-espresso text-brand-cream hover:bg-brand-chocolate transition-premium text-xs uppercase tracking-widest font-semibold"
          >
            Return Home
          </button>
        </div>

      </div>
    </div>
  );
}
