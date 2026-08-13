import React, { useState } from 'react';
import { Menu, X, Search, Compass } from 'lucide-react';

export default function Navbar({ currentPage, onNavigate }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', value: 'home' },
    { label: 'Order Status', value: 'order-status' },
    { label: 'Returns & Refunds', value: 'returns' },
    { label: 'Help Center', value: 'help-center', action: () => alert('Help Center self-service pages are coming soon.') },
    { label: 'Contact Us', value: 'contact' },
  ];

  const handleNavClick = (value, action) => {
    setIsMobileMenuOpen(false);
    if (action) {
      action();
    } else {
      onNavigate(value);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-brand-taupe/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo and Brand Mark */}
          <button 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-3 group text-left focus:outline-none"
            aria-label="Northstar Support Home"
          >
            <div className="text-brand-espresso group-hover:text-brand-taupe transition-colors duration-200">
              {/* Compass Icon */}
              <Compass className="w-8 h-8 stroke-[1.25]" />
            </div>
            <div>
              <span className="block font-serif text-lg tracking-widest text-brand-espresso font-semibold uppercase leading-none">
                Northstar
              </span>
              <span className="block font-sans text-[10px] tracking-[0.25em] text-brand-taupe uppercase mt-1 leading-none">
                Support
              </span>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex space-x-8" aria-label="Main Navigation">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.value, item.action)}
                className={`font-sans text-xs uppercase tracking-widest py-2 transition-all duration-200 border-b-2 hover:text-brand-espresso hover:border-brand-espresso/40 ${
                  currentPage === item.value 
                    ? 'text-brand-espresso border-brand-espresso font-medium' 
                    : 'text-brand-espresso/60 border-transparent'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden lg:flex items-center space-x-6">
            <button 
              onClick={() => alert('Search functionality will be enabled in a future release.')}
              className="text-brand-espresso/60 hover:text-brand-espresso transition-colors p-1"
              aria-label="Search site help"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>
            
            <button 
              onClick={() => onNavigate('sign-in')}
              className="px-5 py-2 text-xs uppercase tracking-widest border border-brand-espresso/20 text-brand-espresso hover:bg-brand-cream transition-premium font-medium"
            >
              Sign In
            </button>
            
            <button 
              onClick={() => onNavigate('sign-up')}
              className="px-5 py-2 text-xs uppercase tracking-widest bg-brand-espresso text-brand-cream hover:bg-brand-chocolate transition-premium font-medium"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Buttons */}
          <div className="flex items-center space-x-4 lg:hidden">
            <button 
              onClick={() => alert('Search functionality will be enabled in a future release.')}
              className="text-brand-espresso/60 hover:text-brand-espresso p-1"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-brand-espresso p-1.5 focus:outline-none"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-brand-taupe/10 px-4 pt-4 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.value, item.action)}
                className={`text-left font-sans text-sm uppercase tracking-wider py-2 border-l-2 pl-3 ${
                  currentPage === item.value 
                    ? 'border-brand-espresso text-brand-espresso font-medium' 
                    : 'border-transparent text-brand-espresso/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="pt-4 border-t border-brand-taupe/10 flex flex-col gap-2">
            <button 
              onClick={() => handleNavClick('sign-in')}
              className="w-full text-center py-2.5 text-sm uppercase tracking-wider border border-brand-espresso/20 text-brand-espresso"
            >
              Sign In
            </button>
            <button 
              onClick={() => handleNavClick('sign-up')}
              className="w-full text-center py-2.5 text-sm uppercase tracking-wider bg-brand-espresso text-brand-cream"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
