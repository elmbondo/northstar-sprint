import React from 'react';

export default function LoadingState() {
  return (
    <div className="w-full max-w-xl mx-auto bg-white border border-brand-taupe/15 p-8 animate-pulse space-y-6">
      <div className="h-4 bg-brand-sand w-1/3 rounded-sm"></div>
      <div className="space-y-3">
        <div className="h-8 bg-brand-sand w-3/4 rounded-sm"></div>
        <div className="h-4 bg-brand-sand w-1/2 rounded-sm"></div>
      </div>
      <div className="border-t border-brand-sand pt-6 grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-3 bg-brand-sand w-1/2 rounded-sm"></div>
          <div className="h-5 bg-brand-sand w-5/6 rounded-sm"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-brand-sand w-1/2 rounded-sm"></div>
          <div className="h-5 bg-brand-sand w-5/6 rounded-sm"></div>
        </div>
      </div>
    </div>
  );
}
