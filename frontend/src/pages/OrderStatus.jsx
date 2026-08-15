import React, { useState } from 'react';
import OrderSearch from '../components/OrderSearch.jsx';
import OrderResult from '../components/OrderResult.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import EscalationCard from '../components/EscalationCard.jsx';

export default function OrderStatus({ onNavigate }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const [searchedNum, setSearchedNum] = useState('');
  const [showEscalation, setShowEscalation] = useState(false);

  const handleSearch = async (orderNumber) => {
    setLoading(true);
    setError('');
    setOrder(null);
    setSearchedNum(orderNumber);
    setShowEscalation(false);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
    const endpoint = `${apiBaseUrl}/api/orders/${orderNumber}`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'We could not complete your lookup request.');
        setShowEscalation(true);
      } else {
        setOrder(data.order);
      }
    } catch (err) {
      console.error('API connection failure:', err);
      setError('A network error occurred. Please verify your connection or try again later.');
      setShowEscalation(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEscalate = async () => {
    // Log escalation requested to API
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
    try {
      await fetch(`${apiBaseUrl}/api/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: 'Escalation requested',
          orderNumber: searchedNum || null,
          metadata: { source: 'Order Status Page' }
        })
      });
    } catch (e) {
      console.error('Failed to log escalation event to API:', e);
    }
    
    onNavigate('contact');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="font-serif text-4xl sm:text-5xl text-brand-espresso font-medium">
          Order Lookup & Tracking
        </h1>
        <p className="font-sans text-brand-espresso/60 text-sm sm:text-base leading-relaxed font-light">
          Monitor your package details, status, and delivery schedule directly from our logistics database.
        </p>
      </div>

      <div className="space-y-8">
        {/* Search Input Card */}
        {!loading && !order && !error && (
          <OrderSearch onSearch={handleSearch} initialValue={searchedNum} />
        )}

        {/* Loading Spinner Shimmer */}
        {loading && <LoadingState />}

        {/* Error Block */}
        {!loading && error && (
          <div className="space-y-8">
            <ErrorState message={error} onRetry={() => handleSearch(searchedNum)} />
            {showEscalation && <EscalationCard onEscalate={handleEscalate} />}
          </div>
        )}

        {/* Successful details layout */}
        {!loading && order && (
          <div className="space-y-8">
            <OrderResult order={order} />
            <div className="text-center pt-4">
              <button
                onClick={() => {
                  setOrder(null);
                  setError('');
                  setSearchedNum('');
                  setShowEscalation(false);
                }}
                className="text-xs uppercase tracking-widest font-semibold text-brand-espresso/60 hover:text-brand-espresso transition-colors duration-200 border-b border-brand-espresso/20 pb-0.5"
              >
                Track Another Order
              </button>
            </div>
            {/* Display escalation option even for successful order if client still has questions */}
            <EscalationCard onEscalate={handleEscalate} />
          </div>
        )}
      </div>
    </div>
  );
}
