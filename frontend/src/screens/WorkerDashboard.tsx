import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, XCircle, Play, DollarSign, Vote as VoteIcon, 
  Power, ShieldCheck, HeartHandshake, Award, Clock, MapPin, 
  AlertCircle, ChevronRight 
} from 'lucide-react';
import { Booking, Proposal, Worker } from '../types';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { PayoutBreakdownBar } from '../components/PayoutBreakdownBar';

export const WorkerDashboard: React.FC = () => {
  const { user, workerProfile, refreshProfile, socket } = useAuth();
  const [activeTab, setActiveTab] = useState<'jobs' | 'earnings' | 'governance'>('jobs');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedVotes, setSelectedVotes] = useState<Record<string, string>>({});
  const [isUpdatingAvail, setIsUpdatingAvail] = useState(false);
  const [votingMsg, setVotingMsg] = useState<{ id: string; text: string; error?: boolean } | null>(null);

  const fetchWorkerData = async () => {
    try {
      const myBookings = await api.bookings.listMine();
      setBookings(myBookings);

      if (workerProfile?.cooperative_id) {
        const coopProps = await api.governance.getProposals(workerProfile.cooperative_id);
        setProposals(coopProps);
      }
    } catch (err) {
      console.error('Failed to load worker data', err);
    }
  };

  useEffect(() => {
    fetchWorkerData();
  }, [workerProfile]);

  // Socket updates for live job broadcasts
  useEffect(() => {
    if (!socket || !workerProfile) return;

    socket.on('booking:new', (newBooking: Booking) => {
      setBookings(prev => [newBooking, ...prev.filter(b => b.id !== newBooking.id)]);
    });

    socket.on('booking:status_changed', (data: { id: string; status: any; updated: Booking }) => {
      setBookings(prev => prev.map(b => b.id === data.id ? { ...b, ...data.updated } : b));
    });

    return () => {
      socket.off('booking:new');
      socket.off('booking:status_changed');
    };
  }, [socket, workerProfile]);

  const handleToggleAvailability = async () => {
    setIsUpdatingAvail(true);
    try {
      await api.workers.updateAvailability(!workerProfile?.availability_status);
      await refreshProfile();
    } catch (err: any) {
      alert(err.message || 'Failed to update availability');
    } finally {
      setIsUpdatingAvail(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      await api.bookings.updateStatus(bookingId, newStatus);
      await fetchWorkerData();
    } catch (err: any) {
      alert(err.message || 'Failed to update booking status');
    }
  };

  const handleCastVote = async (proposalId: string) => {
    const choice = selectedVotes[proposalId];
    if (!choice) {
      setVotingMsg({ id: proposalId, text: 'Please select an option before voting.', error: true });
      return;
    }

    try {
      const res = await api.governance.castVote(proposalId, choice);
      setVotingMsg({ id: proposalId, text: res.message });
      await fetchWorkerData();
    } catch (err: any) {
      setVotingMsg({ id: proposalId, text: err.message || 'Failed to cast vote', error: true });
    }
  };

  // Calculations for Personal Earnings View
  const completedJobs = bookings.filter(b => b.status === 'COMPLETED');
  const totalGmv = completedJobs.reduce((sum, b) => sum + b.amount, 0);
  const totalWorkerEarnings = Math.round(totalGmv * 0.80 * 100) / 100;
  const totalCoopFundContributed = Math.round(totalGmv * 0.15 * 100) / 100;

  // Split bookings by categories
  const incomingRequests = bookings.filter(b => b.status === 'REQUESTED');
  const activeJobs = bookings.filter(b => ['ACCEPTED', 'IN_PROGRESS'].includes(b.status));

  const isOnline = Boolean(workerProfile?.availability_status);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Worker Header Card */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] bg-white/20 backdrop-blur font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              Cooperative Member Worker
            </span>
            <span className="text-xs text-amber-100">{workerProfile?.cooperative?.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">{user?.name}</h1>
          <p className="text-xs text-amber-100 mt-1 flex items-center gap-2">
            <span>Rating: <strong>{workerProfile?.rating_avg}★</strong></span>
            <span>•</span>
            <span>Skills: {workerProfile?.skills.join(', ')}</span>
            <span>•</span>
            <span className="bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded font-bold">
              {workerProfile?.verification_status}
            </span>
          </p>
        </div>

        {/* Availability Toggle */}
        <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-2xl flex items-center gap-4">
          <div>
            <p className="text-xs font-semibold text-amber-100">Duty Status</p>
            <p className="text-sm font-extrabold flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'}`}></span>
              {isOnline ? 'Available (Online)' : 'Paused (Offline)'}
            </p>
          </div>
          <button
            onClick={handleToggleAvailability}
            disabled={isUpdatingAvail}
            className={`p-3 rounded-xl transition shadow-sm flex items-center gap-2 text-xs font-bold ${
              isOnline
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-slate-800 hover:bg-slate-900 text-slate-200'
            }`}
            title="Toggle Work Availability"
          >
            <Power className="w-4 h-4" />
            <span>{isOnline ? 'Go Offline' : 'Go Online'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 max-w-md">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'jobs'
              ? 'bg-white text-orange-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Job Requests</span>
          {incomingRequests.length > 0 && (
            <span className="bg-orange-600 text-white text-[10px] px-1.5 py-0.2 rounded-full">
              {incomingRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('earnings')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'earnings'
              ? 'bg-white text-orange-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          80% Earnings
        </button>
        <button
          onClick={() => setActiveTab('governance')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'governance'
              ? 'bg-white text-orange-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <VoteIcon className="w-3.5 h-3.5" />
          <span>Governance (Vote)</span>
        </button>
      </div>

      {/* TAB 1: INCOMING REQUESTS & ACTIVE JOBS */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          {/* Incoming Job Requests */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                Incoming Service Requests ({incomingRequests.length})
              </h2>
              <span className="text-xs text-slate-500 font-medium">Real-time socket alerts</span>
            </div>

            {incomingRequests.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center text-xs text-slate-500">
                No new pending requests right now. Keep your duty status Online to receive incoming jobs.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {incomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl p-5 border-2 border-orange-200 shadow-sm space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                          {req.category?.name}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900 mt-1">
                          Customer: {req.customer?.name}
                        </h3>
                        <p className="text-xs text-slate-500">{req.customer?.phone}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-semibold">Your Share (80%)</span>
                        <p className="text-lg font-black text-emerald-600">
                          ₹{Math.round(req.amount * 0.8)}
                        </p>
                        <span className="text-[10px] text-slate-400">Total: ₹{req.amount}</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{req.address}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Scheduled: {new Date(req.scheduled_time).toLocaleString()}</span>
                      </p>
                      {req.instructions && (
                        <p className="text-slate-500 italic mt-1">"{req.instructions}"</p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleUpdateBookingStatus(req.id, 'CANCELLED')}
                        className="flex-1 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                      <button
                        onClick={() => handleUpdateBookingStatus(req.id, 'ACCEPTED')}
                        className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept Job</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active & In Progress Jobs */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              Active & In-Progress Jobs ({activeJobs.length})
            </h2>

            {activeJobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center text-xs text-slate-500">
                No active jobs underway.
              </div>
            ) : (
              <div className="space-y-3">
                {activeJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">
                          {job.category?.name} for {job.customer?.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                          {job.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{job.address}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400">Worker Payout</span>
                        <p className="text-base font-black text-emerald-600">
                          ₹{Math.round(job.amount * 0.8)}
                        </p>
                      </div>

                      {job.status === 'ACCEPTED' && (
                        <button
                          onClick={() => handleUpdateBookingStatus(job.id, 'IN_PROGRESS')}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Start Job</span>
                        </button>
                      )}

                      {job.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => handleUpdateBookingStatus(job.id, 'COMPLETED')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Complete & Receive 80%</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: EARNINGS & WELFARE FUND DASHBOARD */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                Direct Earnings (80% Take-Home)
              </span>
              <p className="text-3xl font-black text-emerald-700 mt-1">₹{totalWorkerEarnings}</p>
              <p className="text-[11px] text-slate-500 mt-1">Directly credited to your account</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                Cooperative Welfare Reserve (15%)
              </span>
              <p className="text-3xl font-black text-amber-700 mt-1">₹{totalCoopFundContributed}</p>
              <p className="text-[11px] text-slate-500 mt-1">Collective health insurance & subsidies</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Completed Jobs
              </span>
              <p className="text-3xl font-black text-slate-900 mt-1">{completedJobs.length}</p>
              <p className="text-[11px] text-slate-500 mt-1">Total bookings fulfilled</p>
            </div>
          </div>

          {/* Transparent Ledger Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Per-Job Payout Ledger</h3>
                <p className="text-xs text-slate-500">Full transparency on 80/15/5 revenue split per job</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Service & Customer</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Total Amount</th>
                    <th className="py-2.5 px-3 text-emerald-600">You Receive (80%)</th>
                    <th className="py-2.5 px-3 text-amber-600">Coop Fund (15%)</th>
                    <th className="py-2.5 px-3 text-slate-500">Platform (5%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {completedJobs.map((job) => {
                    const workerAmt = Math.round(job.amount * 0.8 * 100) / 100;
                    const coopAmt = Math.round(job.amount * 0.15 * 100) / 100;
                    const platAmt = Math.round(job.amount * 0.05 * 100) / 100;

                    return (
                      <tr key={job.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3">
                          <p className="font-bold text-slate-900">{job.category?.name}</p>
                          <p className="text-[10px] text-slate-500">{job.customer?.name}</p>
                        </td>
                        <td className="py-3 px-3 text-slate-500">
                          {new Date(job.scheduled_time).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">
                          ₹{job.amount}
                        </td>
                        <td className="py-3 px-3 font-extrabold text-emerald-700">
                          ₹{workerAmt}
                        </td>
                        <td className="py-3 px-3 font-semibold text-amber-700">
                          ₹{coopAmt}
                        </td>
                        <td className="py-3 px-3 text-slate-500">
                          ₹{platAmt}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DEMOCRATIC GOVERNANCE & VOTING BOOTH */}
      {activeTab === 'governance' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-2 mb-2 text-indigo-300">
              <VoteIcon className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Democratic Cooperative Voting</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              One Member, One Vote Governance
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Unlike corporate platforms where algorithms dictate your rates, here in {workerProfile?.cooperative?.name}, every member votes equally on base rates, cooperative fund allocation, and member benefits.
            </p>
          </div>

          {/* Proposals List */}
          <div className="space-y-6">
            {proposals.map((prop) => {
              const hasVoted = prop.votes?.some(v => v.worker_id === workerProfile?.id);
              const workerVote = prop.votes?.find(v => v.worker_id === workerProfile?.id);
              const isClosed = prop.status === 'CLOSED' || new Date(prop.deadline).getTime() < Date.now();
              const totalVotes = prop.votes?.length || 0;

              return (
                <div
                  key={prop.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isClosed ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}`}>
                          {isClosed ? 'Closed' : 'Open Ballot'}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          Deadline: {new Date(prop.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                        {prop.title}
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 font-semibold">Ballots Cast</span>
                      <p className="text-sm font-black text-indigo-700">{totalVotes} Member Votes</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {prop.description}
                  </p>

                  {votingMsg && votingMsg.id === prop.id && (
                    <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${votingMsg.error ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{votingMsg.text}</span>
                    </div>
                  )}

                  {/* Voting Ballot / Results */}
                  <div className="space-y-2.5 pt-2">
                    {prop.options.map((option) => {
                      const voteCount = prop.votes?.filter(v => v.choice === option).length || 0;
                      const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                      const isSelected = selectedVotes[prop.id] === option;
                      const isMyVote = workerVote?.choice === option;

                      return (
                        <div
                          key={option}
                          onClick={() => {
                            if (!hasVoted && !isClosed) {
                              setSelectedVotes(prev => ({ ...prev, [prop.id]: option }));
                            }
                          }}
                          className={`p-3.5 rounded-2xl border transition relative overflow-hidden ${
                            isMyVote
                              ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-400/20'
                              : isSelected
                              ? 'border-orange-500 bg-orange-50/50'
                              : 'border-slate-200 hover:border-slate-300'
                          } ${!hasVoted && !isClosed ? 'cursor-pointer' : ''}`}
                        >
                          {/* Progress fill bar */}
                          {(hasVoted || isClosed) && (
                            <div
                              className="absolute top-0 bottom-0 left-0 bg-slate-100 -z-10 transition-all duration-700"
                              style={{ width: `${percentage}%` }}
                            />
                          )}

                          <div className="flex justify-between items-center z-10 relative">
                            <div className="flex items-center gap-2.5">
                              {!hasVoted && !isClosed ? (
                                <input
                                  type="radio"
                                  name={`prop_${prop.id}`}
                                  checked={isSelected}
                                  onChange={() => setSelectedVotes(prev => ({ ...prev, [prop.id]: option }))}
                                  className="w-4 h-4 text-orange-600 accent-orange-600"
                                />
                              ) : isMyVote ? (
                                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                                  Your Vote
                                </span>
                              ) : null}
                              <span className="text-xs font-bold text-slate-800">{option}</span>
                            </div>

                            {(hasVoted || isClosed) && (
                              <span className="text-xs font-extrabold text-slate-700">
                                {percentage}% ({voteCount} votes)
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Cast Vote Action Button */}
                  {!hasVoted && !isClosed && (
                    <div className="pt-2 text-right">
                      <button
                        onClick={() => handleCastVote(prop.id)}
                        className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                      >
                        Submit Democratic Vote (1 Member 1 Vote)
                      </button>
                    </div>
                  )}

                  {hasVoted && (
                    <p className="text-center text-[11px] text-emerald-700 font-bold bg-emerald-50 py-1.5 rounded-xl border border-emerald-200">
                      ✓ Your democratic vote has been officially registered.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
