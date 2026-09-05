import React, { useState } from 'react';
import { X, Calendar, MapPin, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Worker, ServiceCategory } from '../types';
import { PayoutBreakdownBar } from './PayoutBreakdownBar';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker?: Worker | null;
  categories: ServiceCategory[];
  onBookingSuccess: (bookingId: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  worker,
  categories,
  onBookingSuccess
}) => {
  const { user } = useAuth();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0]?.id || 'cat-cleaning');
  const [address, setAddress] = useState<string>('Flat 204, Ganga Satellite, Wanowrie, Pune');
  const [instructions, setInstructions] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !worker) return null;

  const currentCategory = categories.find(c => c.id === selectedCategoryId) || categories[0];
  const amount = Number(currentCategory?.base_rate) || 500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in as a Customer to confirm this booking.');
      return;
    }
    if (!address) {
      setError('Please provide a valid service address.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await api.bookings.create({
        worker_id: worker.id,
        category_id: selectedCategoryId,
        scheduled_time: new Date(scheduledTime).toISOString(),
        address,
        instructions,
        amount
      });
      onBookingSuccess(res.booking.id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-full">
              Cooperative Booking
            </span>
            <span className="text-xs text-slate-500 font-medium">Affiliated: {worker.cooperative?.name}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Book with {worker.user?.name}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified skilled worker • Rated {worker.rating_avg}★ • 80% directly paid to worker
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Service Category</label>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Base Rate: ₹{c.base_rate})
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Service Date & Time
            </label>
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              Service Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full house address with landmark"
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              required
            />
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Instructions / Issues (Optional)
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={2}
              placeholder="e.g. Bring spare pipe sealant or call before arriving"
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Real-time Transparent Price Breakdown BEFORE Confirming */}
          <div className="pt-2">
            <p className="text-xs font-bold text-slate-700 mb-1.5">
              Transparent Price Breakdown (Know Where Every Rupee Goes)
            </p>
            <PayoutBreakdownBar amount={amount} />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 rounded-xl shadow-md transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Confirming...' : `Confirm Booking • ₹${amount}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
