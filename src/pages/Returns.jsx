import React, { useMemo, useState } from 'react';
import { RefreshCw, ArrowRight, CheckCircle2, Package, Clock3, BadgeHelp } from 'lucide-react';
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
    <div className="w-full max-w-2xl mx-auto bg-white border border-brand-taupe/15 p-8 sm:p-10 space-y-6">
      <div className="flex items-start gap-4 pb-6 border-b border-brand-taupe/15">
        <div className="w-10 h-10 shrink-0 bg-brand-creamDark flex items-center justify-center text-brand-espresso border border-brand-taupe/15">
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

      <div className="space-y-4">
        <span className="block text-[10px] uppercase tracking-widest text-brand-espresso/50 font-bold">
          Answer
        </span>
        <p className="font-sans text-sm sm:text-base text-brand-espresso/70 leading-relaxed">
          {answer}
        </p>
      </div>

      <div className="rounded-sm border border-brand-taupe/15 bg-brand-creamDark/50 p-4 text-xs text-brand-espresso/60 leading-relaxed">
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

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'We could not retrieve that returns policy response.');
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
              These are the supported Returns/Refunds topics for this self-service experience.
            </p>
          </div>

          <div className="grid gap-3">
            {QUESTIONS.map((item) => {
              const Icon = item.icon;
              const isActive = selectedId === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center justify-between gap-4 text-left border px-4 py-4 transition-premium ${
                    isActive
                      ? 'border-brand-espresso bg-brand-creamDark'
                      : 'border-brand-taupe/15 bg-white hover:border-brand-taupe/40 hover:bg-brand-cream/40'
                  }`}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 shrink-0 flex items-center justify-center border border-brand-taupe/15 bg-white text-brand-espresso">
                      <Icon className="w-4 h-4 stroke-[1.5]" />
                    </span>
                    <span className="font-sans text-sm sm:text-base text-brand-espresso font-medium">
                      {item.question}
                    </span>
                  </span>
                  <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'translate-x-0.5' : 'text-brand-espresso/35'}`} />
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
