import React from 'react';

export default function AnnouncementBar() {
  return (
    <div className="bg-brand-espresso text-brand-cream py-2.5 px-4 text-center text-xs tracking-wider flex items-center justify-center gap-2 border-b border-white/5">
      <span role="img" aria-label="megaphone" className="text-sm">📢</span>
      <span className="font-light">Pick Season is here! Some items are in high demand. Get stock alerts so you never miss out.</span>
      <a 
        href="#stock-alerts" 
        onClick={(e) => {
          e.preventDefault();
          alert('Stock alert notification settings will be available in a future update.');
        }} 
        className="underline font-normal hover:text-brand-taupe transition-colors duration-200 inline-flex items-center gap-0.5"
      >
        Learn More <span className="text-[10px]">→</span>
      </a>
    </div>
  );
}
