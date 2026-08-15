import React from 'react';

export default function Navbar({ currentPage, onNavigate, user, onSignOut }) {
  const items = [
    { key: 'home', label: 'Home' },
    { key: 'order-status', label: 'Order Status' },
    { key: 'returns', label: 'Returns' },
    { key: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-brand-taupe/20 bg-brand-cream/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-espresso text-brand-cream font-serif text-lg">
              N
            </div>
            <div>
              <div className="font-serif text-xl tracking-tight text-brand-espresso">Northstar</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-brand-espresso/60">Customer Care</div>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {items.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => onNavigate(item.key)}
                className={`text-xs uppercase tracking-[0.2em] transition-colors ${
                  currentPage === item.key ? 'text-brand-espresso font-semibold' : 'text-brand-espresso/65 hover:text-brand-espresso'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-brand-espresso font-medium hidden sm:inline">
                  Hi, {user.name}
                </span>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="border border-brand-espresso/15 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-brand-espresso hover:bg-brand-espresso hover:text-brand-cream transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('sign-in')}
                className="border border-brand-espresso/15 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-brand-espresso hover:bg-brand-espresso hover:text-brand-cream transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
