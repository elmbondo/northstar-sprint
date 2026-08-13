import React from 'react';
import Hero from '../components/Hero.jsx';
import SupportCard from '../components/SupportCard.jsx';
import { PackageSearch, RefreshCw, Clock, ShieldCheck, Zap } from 'lucide-react';

export default function Home({ onNavigate }) {
  return (
    <div className="space-y-16 pb-24">
      {/* Premium Hero Section */}
      <Hero onNavigate={onNavigate} />

      {/* Primary Self-Service Portals Grid */}
      <div id="support-options" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <SupportCard
            icon={PackageSearch}
            title="Order Status"
            description="Track your package shipment in real time and get the latest estimated delivery date."
            ctaText="Check Your Order"
            onClick={() => onNavigate('order-status')}
          />

          <SupportCard
            icon={RefreshCw}
            title="Returns & Refunds"
            description="Find step-by-step return guidance and check the progress of your processing refund."
            ctaText="Start a Return"
            onClick={() => onNavigate('returns')}
          />

        </div>
      </div>

      {/* Trust & Policy Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="border-t border-brand-taupe/15 pt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <div className="flex gap-4">
            <div className="text-brand-espresso mt-0.5">
              <Clock className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-sans text-xs uppercase tracking-wider text-brand-espresso font-bold mb-1">
                24/7 Self-Service
              </h4>
              <p className="font-sans text-xs text-brand-espresso/60 leading-relaxed font-light">
                Check package tracking or review return options at any hour of the day.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-brand-espresso mt-0.5">
              <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-sans text-xs uppercase tracking-wider text-brand-espresso font-bold mb-1">
                Secure & Private
              </h4>
              <p className="font-sans text-xs text-brand-espresso/60 leading-relaxed font-light">
                Your order information and delivery data are protected with enterprise-level security.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-brand-espresso mt-0.5">
              <Zap className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-sans text-xs uppercase tracking-wider text-brand-espresso font-bold mb-1">
                Fast & Direct
              </h4>
              <p className="font-sans text-xs text-brand-espresso/60 leading-relaxed font-light">
                Instant database lookups eliminate wait times and put details at your fingertips.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
