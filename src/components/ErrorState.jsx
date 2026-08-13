import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="w-full max-w-xl mx-auto bg-white border border-red-900/10 p-8 text-center space-y-4">
      <div className="mx-auto w-12 h-12 bg-red-50 flex items-center justify-center text-red-800 rounded-full">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="font-serif text-lg text-brand-espresso font-medium">Lookup Error</h3>
      <p className="font-sans text-xs text-brand-espresso/60 max-w-md mx-auto leading-relaxed">
        {message || 'An unexpected error occurred while looking up the order details.'}
      </p>
      {onRetry && (
        <div className="pt-2">
          <button
            onClick={onRetry}
            className="px-6 py-2.5 text-[10px] uppercase tracking-widest font-semibold bg-brand-espresso text-brand-cream hover:bg-brand-chocolate transition-premium"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
