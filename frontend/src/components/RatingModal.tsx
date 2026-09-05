import React, { useState } from 'react';
import { X, Star, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../api/client';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  workerName?: string;
  onRatingSubmitted: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  workerName = 'Worker',
  onRatingSubmitted
}) => {
  const [score, setScore] = useState<number>(5);
  const [hoverScore, setHoverScore] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await api.bookings.rate(bookingId, score, comment);
      onRatingSubmitted();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
          <Star className="w-6 h-6 fill-amber-500" />
        </div>

        <h3 className="text-xl font-bold text-slate-900">Rate Service Experience</h3>
        <p className="text-xs text-slate-500 mt-1">
          How was your service with <strong className="text-slate-800">{workerName}</strong>? Your rating directly supports their cooperative standing.
        </p>

        {error && (
          <div className="my-3 p-2.5 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-left">
          {/* Star selector */}
          <div className="flex justify-center items-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setScore(star)}
                onMouseEnter={() => setHoverScore(star)}
                onMouseLeave={() => setHoverScore(0)}
                className="p-1 transition transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    (hoverScore || score) >= star
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-center text-xs font-semibold text-slate-600">
            {score === 5 && '🌟 Exceptional Service!'}
            {score === 4 && '👍 Great Job!'}
            {score === 3 && '👌 Satisfactory'}
            {score === 2 && '👎 Needs Improvement'}
            {score === 1 && '⚠️ Poor Experience'}
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Feedback & Review (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="e.g. Prompt arrival, polite demeanor, and thoroughly solved the issue!"
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-md transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
