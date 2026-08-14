import React, { useMemo, useState } from 'react';
import { RefreshCw, CheckCircle2, Package, Clock3, BadgeHelp, ChevronDown, ShieldCheck, Sparkles } from 'lucide-react';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';

const QUESTIONS = [
  {
    id: 'how-to-return',
    question: 'How do I return an item?',
    icon: Package,
  },
  {
    id: 'eligibility',
    question: 'Is my item eligible for return?',
    icon: BadgeHelp,
  },
  {
    id: 'refund-timing',
    question: 'When will I receive my refund?',
    icon: Clock3,
  },
];

function AnswerPanel({ selectedQuestion, answer }) {
  if (!selectedQuestion || !answer) return null;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-brand-taupe/15 p-8 sm:p-10 space-y-7">
      <div className="flex items-start gap-4 pb-6 border-b border-brand-taupe/15">
        <div className="w-11 h-11 shrink-0 bg-brand-creamDark flex items-center justify-center text-brand-espresso border border-brand-taupe/15">
          <CheckCircle2 className="w-5 h-5 stroke-[1.4]" />
        </div>
        <div className="space-y-1">
          <span className="block text-[10px] uppercase tracking-widest text-brand-espresso/50 font-bold">
            Selected Question
          </span>
          <h2 className="font-serif text-2xl text-brand-espresso font-medium">
            {selectedQuestion.question}
          </h2>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-brand-espresso/50 font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Answer</span>
        </div>
        <p className="font-sans text-sm sm:text-base text-brand-espresso/75 leading-relaxed">
          {answer}
        </p>
      </div>

      <div className="rounded-sm border border-brand-taupe/15 bg-brand-creamDark/50 p-4 text-xs text-brand-espresso/60 leading-relaxed flex gap-3">
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
        This is a self-service policy response. If your case needs review, you can contact support for help.
      </div>
    </div>
  );
}

export default function Returns({ onNavigate }) {
  const [selectedId, setSelectedId] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedQuestion = useMemo(
    () => QUESTIONS.find((item) => item.id === selectedId) || null,
    [selectedId]
  );

  const handleSelect = async (questionId) => {
    if (!questionId) {
      setSelectedId('');
      setAnswer('');
      setError('');
      return;
    }

    setSelectedId(questionId);
    setLoading(true);
    setError('');
    setAnswer('');

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
    const endpoint = `${apiBaseUrl}/api/returns`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questionId }),
      });

      const raw = await response.text();
      const data = raw ? JSON.parse(raw) : null;

      if (!response.ok || !data.success) {
        setError(data?.message || 'We could not retrieve that returns policy response.');
        return;
      }

      setAnswer(data.answer);
    } catch (err) {
      console.error('API connection failure:', err);
      setError('A network error occurred. Please verify your connection or try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="mx-auto w-16 h-16 bg-brand-creamDark flex items-center justify-center text-brand-espresso border border-brand-taupe/15">
          <RefreshCw className="w-6 h-6 stroke-[1.25]" />
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl text-brand-espresso font-medium">
          Returns & Refunds
        </h1>
        <p className="font-sans text-brand-espresso/60 text-sm sm:text-base leading-relaxed font-light">
          Choose a common returns or refund question below to see the policy response instantly.
        </p>
      </div>

      <div className="space-y-8">
        <div className="w-full max-w-2xl mx-auto bg-white border border-brand-taupe/15 p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl text-brand-espresso font-medium">Select a question</h2>
            <p className="font-sans text-xs text-brand-espresso/60 leading-relaxed">
              Use the dropdown to choose a supported Returns/Refunds topic and load the stored response.
            </p>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="returnsQuestion"
              className="block text-[10px] uppercase tracking-widest text-brand-espresso/50 font-bold"
            >
              Returns question
            </label>
            <div className="relative">
              <select
                id="returnsQuestion"
                value={selectedId}
                onChange={(e) => handleSelect(e.target.value)}
                className="input-premium appearance-none pr-12 bg-white"
              >
                <option value="">Choose a question</option>
                {QUESTIONS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.question}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-espresso/35" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {QUESTIONS.map((item) => {
              const Icon = item.icon;
              const isActive = selectedId === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-start gap-3 text-left border p-4 transition-premium ${
                    isActive
                      ? 'border-brand-espresso bg-brand-creamDark'
                      : 'border-brand-taupe/15 bg-brand-cream/30 hover:border-brand-taupe/40 hover:bg-brand-cream/50'
                  }`}
                >
                  <span className="w-8 h-8 shrink-0 flex items-center justify-center border border-brand-taupe/15 bg-white text-brand-espresso">
                    <Icon className="w-4 h-4 stroke-[1.5]" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-sans text-[10px] uppercase tracking-widest text-brand-espresso/45 font-semibold mb-1">
                      Quick pick
                    </span>
                    <span className="block font-sans text-sm text-brand-espresso font-medium leading-snug">
                      {item.question}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {loading && <LoadingState />}

        {!loading && error && (
          <div className="space-y-8">
            <ErrorState message={error} onRetry={selectedId ? () => handleSelect(selectedId) : undefined} />
          </div>
        )}

        {!loading && !error && answer && (
          <AnswerPanel selectedQuestion={selectedQuestion} answer={answer} />
        )}

        {!loading && !error && !answer && (
          <div className="w-full max-w-2xl mx-auto border border-dashed border-brand-taupe/25 bg-brand-cream/40 p-8 text-center">
            <p className="font-sans text-sm text-brand-espresso/60 leading-relaxed">
              Pick a question above to see the return or refund response.
            </p>
          </div>
        )}

        <div className="text-center pt-4">
          <button
            onClick={() => onNavigate('contact')}
            className="text-xs uppercase tracking-widest font-semibold text-brand-espresso/60 hover:text-brand-espresso transition-colors duration-200 border-b border-brand-espresso/20 pb-0.5"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
