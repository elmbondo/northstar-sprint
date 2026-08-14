import React, { useState } from 'react';
import { Compass, Loader2 } from 'lucide-react';

export default function SignUp({ onNavigate, onAuthSuccess }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      
      const contentType = response.headers.get('content-type');
      let data = {};
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }
      
      if (!response.ok) {
        throw new Error(data.message || `Server error (${response.status})`);
      }

      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        if (onAuthSuccess) {
          onAuthSuccess({ name: formData.name, email: formData.email });
        } else {
          onNavigate('home');
        }
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-24 sm:py-32">
      <div className="bg-white border border-brand-taupe/15 p-8 sm:p-10 space-y-8">
        
        <div className="flex justify-center text-brand-espresso">
          <Compass className="w-12 h-12 stroke-[1.25]" />
        </div>

        <div className="text-center space-y-3">
          <h1 className="font-serif text-3xl text-brand-espresso font-medium">
            Create Account
          </h1>
          <p className="font-sans text-xs text-brand-espresso/60 leading-relaxed font-light">
            Join Northstar for a seamless support experience.
          </p>
        </div>

        {error && <div className="p-3 bg-red-50/50 text-red-600 text-xs rounded border border-red-100">{error}</div>}
        {success && <div className="p-3 bg-green-50/50 text-green-700 text-xs rounded border border-green-100">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold tracking-wider text-brand-espresso uppercase">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-brand-cream border border-brand-taupe/30 focus:border-brand-espresso focus:ring-1 focus:ring-brand-espresso text-brand-espresso text-sm outline-none transition-colors"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold tracking-wider text-brand-espresso uppercase">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-brand-cream border border-brand-taupe/30 focus:border-brand-espresso focus:ring-1 focus:ring-brand-espresso text-brand-espresso text-sm outline-none transition-colors"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold tracking-wider text-brand-espresso uppercase">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-brand-cream border border-brand-taupe/30 focus:border-brand-espresso focus:ring-1 focus:ring-brand-espresso text-brand-espresso text-sm outline-none transition-colors"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 flex items-center justify-center bg-brand-espresso text-brand-cream hover:bg-brand-chocolate transition-premium text-xs uppercase tracking-widest font-semibold disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="text-center pt-2">
          <button 
            onClick={() => onNavigate('sign-in')} 
            className="text-xs text-brand-espresso/70 hover:text-brand-espresso transition-colors font-medium"
          >
            Already have an account? Sign In
          </button>
        </div>

      </div>
    </div>
  );
}
