import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function OrderSearch({ onSearch, initialValue = '' }) {
  const [orderNumber, setOrderNumber] = useState(initialValue);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmed = orderNumber.trim();

    if (!trimmed) {
      setError('Please enter your order number.');
      return;
    }

    // Pattern check: NS followed by 4 digits
    const pattern = /^NS\d{4}$/i;
    if (!pattern.test(trimmed)) {
      setError('Invalid format. Order number should start with NS followed by 4 digits (e.g., NS1001).');
      return;
    }

    onSearch(trimmed.toUpperCase());
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white border border-brand-taupe/15 p-8 sm:p-10 space-y-6">
      <div className="space-y-2">
        <h2 className="font-serif text-2xl text-brand-espresso font-medium">Track Your Order</h2>
        <p className="font-sans text-xs text-brand-espresso/60 leading-relaxed">
          Enter your order identifier below. You can find this code in your purchase confirmation email.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <label 
            htmlFor="orderNumberInput" 
            className="block font-sans text-[10px] uppercase tracking-widest text-brand-espresso/60 font-semibold"
          >
            Order Number
          </label>
          <div className="relative">
            <input
              id="orderNumberInput"
              type="text"
              className={`input-premium pr-12 ${error ? 'border-red-950/20 focus:border-red-950/40 focus:ring-red-950/20' : ''}`}
              placeholder="NS1001"
              value={orderNumber}
              onChange={(e) => {
                setOrderNumber(e.target.value);
                if (error) setError('');
              }}
              aria-invalid={!!error}
              aria-describedby={error ? "order-number-error" : undefined}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-espresso/35 pointer-events-none">
              <Search className="w-5 h-5 stroke-[1.25]" />
            </div>
          </div>
          {error && (
            <p 
              id="order-number-error" 
              className="text-[11px] text-red-900 font-sans tracking-wide mt-1"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-brand-espresso text-brand-cream hover:bg-brand-chocolate transition-premium text-xs uppercase tracking-widest font-semibold"
        >
          Check Order Status
        </button>
      </form>
    </div>
  );
}
