import React from 'react';

export default function Footer({ onNavigate }) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e, route) => {
    e.preventDefault();
    onNavigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-espresso text-brand-cream/80 border-t border-white/5 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-white/5">
          
          {/* Brand/Logo Column */}
          <div className="md:col-span-5 space-y-4">
            <span className="block font-serif text-xl tracking-widest text-brand-cream uppercase">
              Northstar Retail Co.
            </span>
            <p className="text-xs text-brand-cream/50 max-w-sm leading-relaxed font-light">
              Crafting premium retail experiences. Our dedicated support deflection portal provides immediate assistance for your order transactions.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-brand-cream font-semibold">
              Support Directory
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/" onClick={(e) => handleLinkClick(e, 'home')} className="hover:text-brand-taupe transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/order-status" onClick={(e) => handleLinkClick(e, 'order-status')} className="hover:text-brand-taupe transition-colors">
                  Order Status
                </a>
              </li>
              <li>
                <a href="/returns" onClick={(e) => handleLinkClick(e, 'returns')} className="hover:text-brand-taupe transition-colors">
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a href="/contact" onClick={(e) => handleLinkClick(e, 'contact')} className="hover:text-brand-taupe transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Account Links Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-brand-cream font-semibold">
              Customer Account
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/sign-in" onClick={(e) => handleLinkClick(e, 'sign-in')} className="hover:text-brand-taupe transition-colors">
                  Sign In
                </a>
              </li>
              <li>
                <a href="/sign-up" onClick={(e) => handleLinkClick(e, 'sign-up')} className="hover:text-brand-taupe transition-colors">
                  Sign Up
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-brand-cream/40">
          <div>
            &copy; {currentYear} Northstar Retail Co. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy Policy is under review.') }} className="hover:text-brand-taupe transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Terms of Service is under review.') }} className="hover:text-brand-taupe transition-colors">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
