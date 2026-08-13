import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function SupportCard({ icon: Icon, title, description, ctaText, onClick }) {
  return (
    <div className="bg-white border border-brand-taupe/15 p-8 sm:p-10 flex flex-col justify-between hover:shadow-md transition-all duration-300 group">
      <div>
        <div className="w-12 h-12 bg-brand-cream flex items-center justify-center text-brand-espresso mb-8 group-hover:bg-brand-beige transition-colors duration-300">
          <Icon className="w-6 h-6 stroke-[1.25]" />
        </div>
        <h3 className="font-serif text-2xl text-brand-espresso mb-3 font-medium">
          {title}
        </h3>
        <p className="font-sans text-brand-espresso/60 text-sm leading-relaxed mb-8">
          {description}
        </p>
      </div>
      <div>
        <button
          onClick={onClick}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-brand-espresso group-hover:text-brand-taupe transition-colors duration-200"
        >
          {ctaText} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-200" />
        </button>
      </div>
    </div>
  );
}
