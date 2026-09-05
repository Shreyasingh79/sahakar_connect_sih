import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Star, Sparkles, Filter, CheckCircle2, 
  Clock, Calendar, AlertCircle, Eye, Info, XCircle
} from 'lucide-react';
import { Worker, ServiceCategory, Booking, MatchScoreDetails } from '../types';
import { api } from '../api/client';
import { BookingModal } from '../components/BookingModal';
import { RatingModal } from '../components/RatingModal';
import { SmartMatchModal } from '../components/SmartMatchModal';
import { PayoutBreakdownBar } from '../components/PayoutBreakdownBar';
import { useAuth } from '../context/AuthContext';

interface CustomerDashboardProps {
  categories: ServiceCategory[];
  initialCategory?: string;
  defaultView?: 'services' | 'my-bookings';
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  categories,
  initialCategory,
  defaultView = 'services'
}) => {
  const { user, socket } = useAuth();
  const [activeTab, setActiveTab] = useState<'browse' | 'bookings'>(
    defaultView === 'my-bookings' ? 'bookings' : 'browse'
  );

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || '');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);

  // Data state
  const [workers, setWorkers] = useState<MatchScoreDetails[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);

  // Modals
  const [selectedWorkerForBooking, setSelectedWorkerForBooking] = useState<Worker | null>(null);
  const [selectedBookingForRating, setSelectedBookingForRating] = useState<Booking | null>(null);
  const [inspectingMatch, setInspectingMatch] = useState<MatchScoreDetails | null>(null);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const res = await api.workers.search({
        category: selectedCategory || undefined,
        city: selectedCity || undefined
      });
      let list = res.workers;
      if (minRating > 0) {
        list = list.filter(w => w.worker.rating_avg >= minRating);
      }
      setWorkers(list);
    } catch (err) {
      console.error('Failed to fetch workers', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    if (!user) return;
    try {
      const list = await api.bookings.listMine();
      setBookings(list);
    } catch (err) {
      console.error('Failed to fetch bookings', err);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, [selectedCategory, selectedCity, minRating]);

  useEffect(() => {
    fetchBookings();
  }, [user]);

  // Real-time booking updates via Socket.io
  useEffect(() => {
    if (!socket) return;

    socket.on('booking:updated', (updated: Booking) => {
      setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
    });

    socket.on('booking:status_changed', (data: { id: string; status: any; updated: Booking }) => {
      setBookings(prev => prev.map(b => b.id === data.id ? { ...b, ...data.updated } : b));
    });

    return () => {
      socket.off('booking:updated');
      socket.off('booking:status_changed');
    };
  }, [socket]);

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.bookings.cancel(bookingId);
      await fetchBookings();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel booking');
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'REQUESTED':
        return { text: 'Requested', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'ACCEPTED':
        return { text: 'Accepted', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'IN_PROGRESS':
        return { text: 'In Progress', bg: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'COMPLETED':
        return { text: 'Completed', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'CANCELLED':
        return { text: 'Cancelled', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
      default:
        return { text: status, bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">
              Customer Services & Bookings
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
              100% Cooperative Owned
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse verified cooperative professionals with smart AI matching & transparent 80/15/5 revenue split.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === 'browse'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Find Workers
          </button>
          <button
            onClick={() => {
              setActiveTab('bookings');
              fetchBookings();
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'bookings'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>My Bookings</span>
            {bookings.length > 0 && (
              <span className="bg-orange-600 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {bookings.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {bookingSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{bookingSuccessMsg}</span>
          </div>
          <button
            onClick={() => setBookingSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* VIEW 1: BROWSE & SEARCH WORKERS */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
            {/* Category Select */}
            <div className="flex-1 min-w-[180px]">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} (Base ₹{c.base_rate})
                  </option>
                ))}
              </select>
            </div>

            {/* City / District Select */}
            <div className="flex-1 min-w-[160px]">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Region / District
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                <option value="">All Regions (Pan-India)</option>
                <option value="Pune">Pune (Maharashtra)</option>
                <option value="Delhi">South Delhi (Delhi NCR)</option>
                <option value="Bengaluru">Bengaluru Urban (Karnataka)</option>
              </select>
            </div>

            {/* Min Rating Filter */}
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Minimum Rating
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                <option value={0}>Any Rating</option>
                <option value={4.5}>4.5★ & Above</option>
                <option value={4.8}>4.8★ & Above (Top Rated)</option>
              </select>
            </div>

            {/* AI Ranking Badge & Tooltip Button */}
            <div className="flex items-end pt-2 sm:pt-0">
              <button
                onClick={() => setInspectingMatch(workers[0] || null)}
                className="flex items-center gap-1.5 px-3 py-2 bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 rounded-xl text-xs font-bold transition shadow-xs"
                title="Click to view transparent weighted AI matching formula"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>AI Smart Match Formula</span>
                <Info className="w-3 h-3 text-orange-600" />
              </button>
            </div>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-500 mt-2">Ranking workers via AI matching algorithm...</p>
            </div>
          ) : workers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <p className="text-sm font-bold text-slate-700">No workers match your filter criteria.</p>
              <p className="text-xs text-slate-500 mt-1">Try resetting the category or region filters.</p>
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedCity('');
                  setMinRating(0);
                }}
                className="mt-4 px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {workers.map((item, idx) => {
                const { worker, total_score, distance_km } = item;
                const isTopMatch = idx === 0;

                return (
                  <div
                    key={worker.id}
                    className={`bg-white rounded-3xl p-6 border transition shadow-xs hover:shadow-xl flex flex-col justify-between relative ${
                      isTopMatch ? 'border-orange-400 ring-2 ring-orange-400/20' : 'border-slate-200'
                    }`}
                  >
                    {/* Top match badge */}
                    {isTopMatch && (
                      <div className="absolute -top-3 right-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Top AI Match
                      </div>
                    )}

                    <div>
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-extrabold text-base text-slate-900">
                              {worker.user?.name}
                            </h3>
                            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Verified Worker"></span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            {worker.cooperative?.name}
                          </p>
                        </div>

                        {/* Match score badge with inspect button */}
                        <button
                          onClick={() => setInspectingMatch(item)}
                          className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-1 rounded-xl text-xs font-black transition"
                          title="Click to view AI score breakdown"
                        >
                          <span>{total_score}%</span>
                          <span className="text-[10px] text-emerald-600">Match</span>
                        </button>
                      </div>

                      {/* Worker Key Metrics */}
                      <div className="flex items-center gap-3 text-xs text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="font-extrabold text-slate-900">{worker.rating_avg}</span>
                          <span className="text-[10px] text-slate-400">/ 5.0</span>
                        </div>
                        <span className="text-slate-300">|</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-500" />
                          <span>{distance_km} km away</span>
                        </div>
                        <span className="text-slate-300">|</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${worker.availability_status ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                          {worker.availability_status ? 'Online' : 'Offline'}
                        </span>
                      </div>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {worker.skills.map((skill) => (
                          <span
                            key={skill}
                            className="bg-orange-50 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-orange-100"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer & Book Button */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Cooperative Split</span>
                        <p className="text-xs font-bold text-emerald-700">80% Worker • 15% Fund</p>
                      </div>
                      <button
                        onClick={() => setSelectedWorkerForBooking(worker)}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs transition transform hover:scale-105"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: MY BOOKINGS LIFECYCLE TRACKER */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Your Active & Past Bookings</h2>
              <p className="text-xs text-slate-500">Live booking status updates synced via WebSockets</p>
            </div>
            <button
              onClick={fetchBookings}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition"
            >
              Refresh
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">You have no active bookings yet.</p>
              <p className="text-xs text-slate-500 mt-1">Select a service and book a certified cooperative worker.</p>
              <button
                onClick={() => setActiveTab('browse')}
                className="mt-4 px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl"
              >
                Browse Services
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const statusBadge = getStatusBadge(booking.status);
                const canCancel = booking.status === 'REQUESTED';
                const canRate = booking.status === 'COMPLETED' && !booking.rating;

                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-base text-slate-900">
                            {booking.category?.name || 'Home Service'}
                          </span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusBadge.bg}`}>
                            {statusBadge.text}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Worker: <strong className="text-slate-800">{booking.worker?.user?.name || 'Assigned Worker'}</strong> • {booking.worker?.cooperative?.name}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-slate-500 font-semibold">Total Amount</p>
                        <p className="text-lg font-black text-slate-900">₹{booking.amount}</p>
                      </div>
                    </div>

                    {/* Lifecycle Visual Timeline */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-1.5">
                        <span className={['REQUESTED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].includes(booking.status) ? 'text-orange-600' : ''}>
                          1. Requested
                        </span>
                        <span className={['ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].includes(booking.status) ? 'text-orange-600' : ''}>
                          2. Accepted
                        </span>
                        <span className={['IN_PROGRESS', 'COMPLETED'].includes(booking.status) ? 'text-orange-600' : ''}>
                          3. In Progress
                        </span>
                        <span className={booking.status === 'COMPLETED' ? 'text-emerald-600 font-black' : ''}>
                          4. Completed & Paid
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-emerald-500 h-full transition-all duration-500"
                          style={{
                            width:
                              booking.status === 'REQUESTED'
                                ? '25%'
                                : booking.status === 'ACCEPTED'
                                ? '50%'
                                : booking.status === 'IN_PROGRESS'
                                ? '75%'
                                : booking.status === 'COMPLETED'
                                ? '100%'
                                : '0%'
                          }}
                        />
                      </div>
                    </div>

                    {/* Booking metadata */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{booking.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Scheduled: {new Date(booking.scheduled_time).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Transparent Revenue Split Widget */}
                    <PayoutBreakdownBar amount={booking.amount} showDetails={false} />

                    {/* Actions & Rating status */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        {booking.rating ? (
                          <div className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>Rated {booking.rating.score}★: "{booking.rating.comment || 'Great service'}"</span>
                          </div>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-2">
                        {canCancel && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Cancel Booking</span>
                          </button>
                        )}
                        {canRate && (
                          <button
                            onClick={() => setSelectedBookingForRating(booking)}
                            className="px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-400 hover:bg-amber-500 rounded-xl shadow-xs transition flex items-center gap-1"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-900" />
                            <span>Rate Worker</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <BookingModal
        isOpen={Boolean(selectedWorkerForBooking)}
        onClose={() => setSelectedWorkerForBooking(null)}
        worker={selectedWorkerForBooking}
        categories={categories}
        onBookingSuccess={(bookingId) => {
          setBookingSuccessMsg(`Booking created successfully (ID: ${bookingId}). Worker notified!`);
          fetchBookings();
          setActiveTab('bookings');
        }}
      />

      <RatingModal
        isOpen={Boolean(selectedBookingForRating)}
        onClose={() => setSelectedBookingForRating(null)}
        bookingId={selectedBookingForRating?.id || ''}
        workerName={selectedBookingForRating?.worker?.user?.name}
        onRatingSubmitted={() => {
          fetchBookings();
          fetchWorkers();
        }}
      />

      <SmartMatchModal
        isOpen={Boolean(inspectingMatch)}
        onClose={() => setInspectingMatch(null)}
        details={inspectingMatch}
      />
    </div>
  );
};
