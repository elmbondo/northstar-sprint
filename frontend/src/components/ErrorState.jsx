import React from 'react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="w-full max-w-xl mx-auto rounded-[2rem] border border-red-200 bg-red-50 p-8 text-center shadow-[0_20px_50px_rgba(25,18,11,0.04)]">
      <p className="font-serif text-2xl text-red-900">We couldn't complete that lookup</p>
      <p className="mt-4 text-sm leading-relaxed text-red-800">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 border border-red-300 bg-white px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-red-900 hover:bg-red-100"
      >
        Try Again
      </button>
    </div>
  );
}
