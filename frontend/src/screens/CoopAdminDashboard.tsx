import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, DollarSign, Vote as VoteIcon, Plus, 
  CheckCircle, Sliders, Shield, AlertCircle, TrendingUp, X, Check
} from 'lucide-react';
import { Cooperative, Worker, ServiceCategory, Proposal, Booking } from '../types';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const CoopAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [coopDetails, setCoopDetails] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'members' | 'rates' | 'fund' | 'governance'>('members');
  const [loading, setLoading] = useState(true);

  // Proposal creation modal
  const [showCreatePropModal, setShowCreatePropModal] = useState(false);
  const [propTitle, setPropTitle] = useState('');
  const [propDesc, setPropDesc] = useState('');
  const [propOptions, setPropOptions] = useState<string[]>(['Yes, Approve', 'No, Reject']);
  const [newOptionText, setNewOptionText] = useState('');

  // Add Member modal
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberSkills, setMemberSkills] = useState('Plumbing, Electrical');

  // Rate updates
  const [editingRates, setEditingRates] = useState<Record<string, number>>({});
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fetchCoopData = async () => {
    setLoading(true);
    try {
      const coops = await api.cooperatives.list();
      // Find coop where admin_user_id matches current user, or default to first
      const myCoop = coops.find(c => c.admin_user_id === user?.id) || coops[0];
      if (myCoop) {
        const full = await api.cooperatives.getById(myCoop.id);
        setCoopDetails(full);
        const ratesMap: Record<string, number> = {};
        full.categories?.forEach(c => {
          ratesMap[c.id] = Number(c.base_rate);
        });
        setEditingRates(ratesMap);
      }
    } catch (err) {
      console.error('Failed to load cooperative admin details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoopData();
  }, [user]);

  const handleSaveRate = async (categoryId: string) => {
    if (!coopDetails) return;
    const rate = editingRates[categoryId];
    try {
      await api.cooperatives.updateRates(coopDetails.id, categoryId, rate);
      setStatusMsg(`Base rate updated successfully to ₹${rate}`);
      await fetchCoopData();
    } catch (err: any) {
      alert(err.message || 'Failed to update rate');
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coopDetails || !memberName || !memberPhone) return;

    try {
      const skillsArray = memberSkills.split(',').map(s => s.trim()).filter(Boolean);
      await api.cooperatives.addMember(coopDetails.id, {
        name: memberName,
        phone: memberPhone,
        skills: skillsArray,
        verification_status: 'VERIFIED'
      });
      setShowAddMemberModal(false);
      setMemberName('');
      setMemberPhone('');
      setStatusMsg('New worker successfully added to cooperative roster!');
      await fetchCoopData();
    } catch (err: any) {
      alert(err.message || 'Failed to add member');
    }
  };

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coopDetails || !propTitle || !propDesc || propOptions.length < 2) return;

    try {
      await api.governance.createProposal(coopDetails.id, {
        title: propTitle,
        description: propDesc,
        options: propOptions
      });
      setShowCreatePropModal(false);
      setPropTitle('');
      setPropDesc('');
      setPropOptions(['Yes, Approve', 'No, Reject']);
      setStatusMsg('Democratic proposal created and opened for worker voting!');
      await fetchCoopData();
    } catch (err: any) {
      alert(err.message || 'Failed to create proposal');
    }
  };

  const handleCloseProposal = async (propId: string) => {
    if (!confirm('Close this proposal and lock final results?')) return;
    try {
      await api.governance.closeProposal(propId);
      setStatusMsg('Proposal has been closed. Final democratic votes recorded.');
      await fetchCoopData();
    } catch (err: any) {
      alert(err.message || 'Failed to close proposal');
    }
  };

  if (loading || !coopDetails) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 mt-2">Loading cooperative management console...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Cooperative Identity Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] bg-white/20 backdrop-blur font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Registered Worker Cooperative
              </span>
              <span className="text-xs text-emerald-200">
                Reg: {coopDetails.registration_no} • {coopDetails.district}, {coopDetails.state}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">{coopDetails.name}</h1>
            <p className="text-xs text-emerald-100 mt-1">
              Admin: <strong>{user?.name}</strong> • Status: <span className="bg-emerald-400 text-emerald-950 font-bold px-2 py-0.5 rounded text-[11px]">{coopDetails.status}</span>
            </p>
          </div>

          {/* Accumulated Fund Balance Card */}
          <div className="bg-white/10 backdrop-blur border border-white/20 p-5 rounded-2xl text-right">
            <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">
              Accumulated Welfare Fund (15%)
            </span>
            <p className="text-3xl font-black text-emerald-300 mt-0.5">
              ₹{Number(coopDetails.fund_balance).toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-emerald-200 mt-1">
              Collective wealth for worker healthcare, tools & training
            </p>
          </div>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{statusMsg}</span>
          </div>
          <button onClick={() => setStatusMsg(null)} className="font-bold text-emerald-700">Dismiss</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 max-w-xl">
        <button
          onClick={() => setActiveTab('members')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'members' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Members ({coopDetails.workers?.length || 0})</span>
        </button>
        <button
          onClick={() => setActiveTab('rates')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'rates' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Category Rates</span>
        </button>
        <button
          onClick={() => setActiveTab('fund')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'fund' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Welfare Fund</span>
        </button>
        <button
          onClick={() => setActiveTab('governance')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'governance' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <VoteIcon className="w-3.5 h-3.5" />
          <span>Proposals ({coopDetails.proposals?.length || 0})</span>
        </button>
      </div>

      {/* TAB 1: WORKER MEMBERS ROSTER */}
      {activeTab === 'members' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Cooperative Member Roster</h2>
              <p className="text-xs text-slate-500">Manage member onboarding, skills, and verification status</p>
            </div>
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Worker Member</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Member Name</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">Skills</th>
                  <th className="py-2.5 px-3">Rating</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Duty Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coopDetails.workers?.map((w: Worker) => (
                  <tr key={w.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {w.user?.name}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {w.user?.phone}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {w.skills.map((s) => (
                          <span key={s} className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-bold text-amber-600">
                      {w.rating_avg}★
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                        {w.verification_status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${w.availability_status ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'}`}>
                        {w.availability_status ? 'Online' : 'Offline'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BASE RATES EDITOR */}
      {activeTab === 'rates' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Cooperative Service Rates</h2>
            <p className="text-xs text-slate-500">
              Cooperative admins can set minimum base rates for services fulfilled by cooperative members.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {coopDetails.categories?.map((cat: ServiceCategory) => (
              <div key={cat.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm text-slate-900">{cat.name}</h3>
                  <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">Standard</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{cat.description}</p>

                <div className="pt-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Base Rate (₹ INR)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={editingRates[cat.id] ?? cat.base_rate}
                      onChange={(e) => setEditingRates(prev => ({ ...prev, [cat.id]: Number(e.target.value) }))}
                      className="w-full text-xs font-bold bg-white border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <button
                      onClick={() => handleSaveRate(cat.id)}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: COOPERATIVE WELFARE FUND LEDGER */}
      {activeTab === 'fund' && (
        <div className="space-y-6">
          <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200">
            <div className="flex items-center gap-2 text-amber-800 mb-2">
              <TrendingUp className="w-5 h-5" />
              <h3 className="text-base font-extrabold">Cooperative Welfare Reserve Fund Overview</h3>
            </div>
            <p className="text-xs text-amber-900 max-w-3xl leading-relaxed">
              Every completed booking automatically deposits <strong>15% of the total order value</strong> into this cooperative reserve. Unlike private aggregator commissions that go to corporate shareholders, this fund is collectively owned by {coopDetails.name} members for:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs font-semibold text-amber-900">
              <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                🛡️ Group Health & Accidental Insurance (₹3 Lakh cover)
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                🔧 Tool & Equipment Subsidies (Zero-interest loans)
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                📚 Upskilling & Certification Workshops
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-sm mb-3">Recent 15% Contributions from Completed Bookings</h3>
            <div className="space-y-2">
              {coopDetails.bookings?.filter((b: Booking) => b.status === 'COMPLETED').slice(0, 8).map((b: Booking) => (
                <div key={b.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{b.category?.name}</span>
                    <span className="text-slate-400 mx-2">•</span>
                    <span className="text-slate-500">Fulfilled by {b.worker?.user?.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-700 font-extrabold">+₹{Math.round(b.amount * 0.15)}</span>
                    <span className="text-[10px] text-slate-400 ml-2">(15% of ₹{b.amount})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GOVERNANCE STUDIO */}
      {activeTab === 'governance' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Cooperative Governance Studio</h2>
              <p className="text-xs text-slate-500">Publish democratic proposals for worker member voting</p>
            </div>
            <button
              onClick={() => setShowCreatePropModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Proposal</span>
            </button>
          </div>

          <div className="space-y-4">
            {coopDetails.proposals?.map((p: Proposal) => {
              const isClosed = p.status === 'CLOSED' || new Date(p.deadline).getTime() < Date.now();
              const totalVotes = p.votes?.length || 0;

              return (
                <div key={p.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex justify-between items-start gap-4 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isClosed ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-800'}`}>
                          {isClosed ? 'CLOSED' : 'OPEN FOR VOTING'}
                        </span>
                        <span className="text-xs text-slate-500">Deadline: {new Date(p.deadline).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-extrabold text-base text-slate-900 mt-1">{p.title}</h3>
                    </div>

                    {!isClosed && (
                      <button
                        onClick={() => handleCloseProposal(p.id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition"
                      >
                        Close & Finalize Results
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-600">{p.description}</p>

                  {/* Results bars */}
                  <div className="space-y-2 pt-2">
                    {p.options.map((opt) => {
                      const count = p.votes?.filter(v => v.choice === opt).length || 0;
                      const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

                      return (
                        <div key={opt} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span>{opt}</span>
                            <span>{pct}% ({count} votes)</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CREATE PROPOSAL MODAL */}
      {showCreatePropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowCreatePropModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-black text-slate-900 mb-1">Publish Governance Proposal</h3>
            <p className="text-xs text-slate-500 mb-4">Every active worker member of {coopDetails.name} will receive 1 vote.</p>

            <form onSubmit={handleCreateProposal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Proposal Title</label>
                <input
                  type="text"
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                  placeholder="e.g. Should we increase AC servicing base rate by 12%?"
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description & Justification</label>
                <textarea
                  value={propDesc}
                  onChange={(e) => setPropDesc(e.target.value)}
                  rows={3}
                  placeholder="Explain why this decision is being proposed to members..."
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Voting Options</label>
                <div className="space-y-1.5 mb-2">
                  {propOptions.map((opt, i) => (
                    <div key={i} className="flex justify-between items-center text-xs bg-slate-100 p-2 rounded-lg">
                      <span>{opt}</span>
                      {propOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => setPropOptions(propOptions.filter((_, idx) => idx !== i))}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newOptionText}
                    onChange={(e) => setNewOptionText(e.target.value)}
                    placeholder="Add another voting choice"
                    className="flex-1 text-xs bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newOptionText.trim()) {
                        setPropOptions([...propOptions, newOptionText.trim()]);
                        setNewOptionText('');
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreatePropModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
                >
                  Publish Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD MEMBER MODAL */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowAddMemberModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-black text-slate-900 mb-1">Add Cooperative Worker</h3>
            <p className="text-xs text-slate-500 mb-4">Register new skilled household worker to this cooperative.</p>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Worker Full Name</label>
                <input
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="e.g. Suresh Shinde"
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (+91)</label>
                <input
                  type="tel"
                  value={memberPhone}
                  onChange={(e) => setMemberPhone(e.target.value)}
                  placeholder="e.g. 9822099999"
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={memberSkills}
                  onChange={(e) => setMemberSkills(e.target.value)}
                  placeholder="Plumbing, Appliance Repair"
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  required
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
                >
                  Register Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
