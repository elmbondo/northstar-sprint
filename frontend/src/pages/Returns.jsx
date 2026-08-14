import React, { useState, useEffect } from 'react';
import { Package, RefreshCw, Loader2, ArrowRight } from 'lucide-react';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';

export default function Returns({ onNavigate, user }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [returns, setReturns] = useState(null);

  useEffect(() => {
    if (user) {
      // Automatically fetch returns for logged-in user
      fetchReturns(null);
    }
  }, [user]);

  const fetchReturns = async (emailToFetch) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(emailToFetch ? { email: emailToFetch } : {}),
      });

      const contentType = response.headers.get('content-type');
      let data = {};
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch returns data.');
      }

      setReturns(data.returns || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    fetchReturns(email);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="mx-auto w-16 h-16 bg-brand-creamDark flex items-center justify-center text-brand-espresso border border-brand-taupe/15">
          <RefreshCw className="w-6 h-6 stroke-[1.25]" />
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl text-brand-espresso font-medium">
          Returns & Refunds
        </h1>
        <p className="font-sans text-brand-espresso/60 text-sm sm:text-base leading-relaxed font-light">
          Track the status of your returned items and refunds.
        </p>
      </div>

      <div className="w-full max-w-2xl mx-auto space-y-8">
        {!user && !returns && !loading && (
          <form onSubmit={handleSubmit} className="bg-white border border-brand-taupe/15 p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="font-serif text-2xl text-brand-espresso font-medium">Find Your Returns</h2>
              <p className="font-sans text-sm text-brand-espresso/60">
                Enter the email address associated with your order to view return and refund status.
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-[10px] uppercase tracking-widest text-brand-espresso/50 font-bold">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eleanor@example.com"
                className="w-full bg-brand-cream/30 border border-brand-taupe/20 px-4 py-3 text-sm focus:outline-none focus:border-brand-taupe/50 focus:bg-white transition-premium"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-brand-espresso text-white py-3.5 text-xs tracking-widest uppercase font-semibold hover:bg-brand-espresso/90 transition-premium flex items-center justify-center gap-2"
            >
              View Returns <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {loading && <LoadingState />}

        {user && error && !loading && (
          <ErrorState message={error} onRetry={() => fetchReturns(null)} />
        )}

        {returns && !loading && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-brand-taupe/15 pb-4">
              <h2 className="font-serif text-2xl text-brand-espresso">Your Return History</h2>
              {!user && (
                <button 
                  onClick={() => { setReturns(null); setEmail(''); }}
                  className="text-xs tracking-widest uppercase text-brand-espresso/60 hover:text-brand-espresso border-b border-brand-espresso/20 pb-0.5"
                >
                  Change Email
                </button>
              )}
            </div>

            {returns.length === 0 ? (
              <div className="bg-white border border-brand-taupe/15 p-12 text-center space-y-4">
                <Package className="w-8 h-8 text-brand-espresso/30 mx-auto" />
                <p className="text-brand-espresso/60 text-sm">No returns found for this account.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {returns.map((item, idx) => (
                  <div key={idx} className="bg-white border border-brand-taupe/15 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="block text-[10px] uppercase tracking-widest text-brand-espresso/50 font-bold">
                        Order #{item.orderNumber}
                      </span>
                      <h3 className="font-serif text-lg text-brand-espresso">{item.productName}</h3>
                      <p className="text-xs text-brand-espresso/60">Requested on: {item.requestDate}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="inline-block px-3 py-1 bg-brand-creamDark border border-brand-taupe/15 text-[10px] uppercase tracking-widest font-semibold text-brand-espresso">
                        {item.status}
                      </span>
                      <p className="text-xs text-brand-espresso/60">Refund: {item.refundAmount}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="text-center pt-8">
          <button
            onClick={() => onNavigate('contact')}
            className="text-xs uppercase tracking-widest font-semibold text-brand-espresso/60 hover:text-brand-espresso transition-colors duration-200 border-b border-brand-espresso/20 pb-0.5"
          >
            Need help with a return?
          </button>
        </div>
      </div>
    </div>
  );
}
