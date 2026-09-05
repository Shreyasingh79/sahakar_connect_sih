import React, { useState, useEffect } from 'react';
import { 
  Shield, Building2, TrendingUp, AlertTriangle, CheckCircle, 
  XCircle, DollarSign, Users, PieChart as PieIcon, BarChart3, RefreshCw
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, CartesianGrid, Legend 
} from 'recharts';
import { 
  AdminAnalyticsOverview, CategoryDemandData, DistrictDemandData, 
  FlaggedCooperative, Cooperative 
} from '../types';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const GovAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState<AdminAnalyticsOverview | null>(null);
  const [categoryDemand, setCategoryDemand] = useState<CategoryDemandData[]>([]);
  const [districtDemand, setDistrictDemand] = useState<DistrictDemandData[]>([]);
  const [flaggedCoops, setFlaggedCoops] = useState<FlaggedCooperative[]>([]);
  const [cooperatives, setCooperatives] = useState<Cooperative[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [ov, cats, dists, flags, coopsList] = await Promise.all([
        api.admin.getOverview(),
        api.admin.getDemandByCategory(),
        api.admin.getDemandByDistrict(),
        api.admin.getFlaggedCooperatives(),
        api.cooperatives.list()
      ]);
      setOverview(ov);
      setCategoryDemand(cats);
      setDistrictDemand(dists);
      setFlaggedCoops(flags);
      setCooperatives(coopsList);
    } catch (err) {
      console.error('Failed to fetch Gov Admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateStatus = async (coopId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await api.cooperatives.updateStatus(coopId, status);
      setActionMsg(`Cooperative ${status === 'APPROVED' ? 'Approved' : 'Rejected'} successfully.`);
      await fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update cooperative status');
    }
  };

  const CATEGORY_COLORS = ['#ea580c', '#0284c7', '#059669', '#7c3aed', '#db2777', '#d97706'];

  if (loading || !overview) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 mt-2">Loading Ministry Analytics & National Oversight Portal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Ministry Portal Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-800/40">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Ministry of Cooperation • Government of India</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              National Cooperative Gig Services Portal
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Logged in as: <strong>{user?.name}</strong> • Real-time platform oversight & economic impact monitoring
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-900/50 hover:bg-purple-900 text-purple-200 border border-purple-700 text-xs font-bold transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Analytics</span>
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 bg-purple-50 border border-purple-200 text-purple-900 rounded-2xl flex items-center justify-between text-xs">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg(null)} className="font-bold text-purple-700">Dismiss</button>
        </div>
      )}

      {/* Macro Impact KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total GMV */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Total Platform GMV
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            ₹{overview.total_gmv.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {overview.completed_bookings} of {overview.total_bookings} bookings completed
          </p>
        </div>

        {/* Worker Earnings Distributed (80%) */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
            Worker Payouts (80% Direct)
          </span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
            ₹{overview.total_worker_payouts.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Distributed to {overview.total_workers} skilled workers
          </p>
        </div>

        {/* Cooperative Welfare Reserves (15%) */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">
            Coop Welfare Reserves (15%)
          </span>
          <p className="text-2xl sm:text-3xl font-black text-amber-700 mt-1">
            ₹{overview.total_cooperative_funds.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Worker-controlled health & insurance funds
          </p>
        </div>

        {/* Platform Maintenance Fee (5%) */}
        <div className="bg-white rounded-2xl p-5 border border-orange-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600">
            Platform Maintenance Fee (5%)
          </span>
          <p className="text-2xl sm:text-3xl font-black text-orange-700 mt-1">
            ₹{overview.total_platform_fees.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {overview.approved_cooperatives} registered cooperatives
          </p>
        </div>
      </div>

      {/* Analytics Charts Section (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demand by Service Category Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-orange-600" />
                Demand by Service Category (Bookings)
              </h3>
              <p className="text-[11px] text-slate-500">Total household service requests across categories</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryDemand} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category_name" textAnchor="end" interval={0} tick={{ fontSize: 10 }} angle={-25} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    name === 'total_bookings' ? `${value} bookings` : `₹${value}`,
                    name === 'total_bookings' ? 'Bookings' : 'GMV'
                  ]}
                  contentStyle={{ borderRadius: '12px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="total_bookings" radius={[6, 6, 0, 0]}>
                  {categoryDemand.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demand by District Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Regional Distribution by District (GMV ₹)
              </h3>
              <p className="text-[11px] text-slate-500">Economic activity across cooperative jurisdictions</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtDemand} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="district" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any) => [`₹${val.toLocaleString('en-IN')}`, 'Total GMV']}
                  contentStyle={{ borderRadius: '12px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="gmv" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cooperative Directory & Registration Approvals */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Cooperative Directory & Approval Registry</h3>
            <p className="text-xs text-slate-500">State and District level cooperative societies registered on SahakarConnect</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Cooperative Name</th>
                <th className="py-2.5 px-3">Reg. Number</th>
                <th className="py-2.5 px-3">District & State</th>
                <th className="py-2.5 px-3">Members</th>
                <th className="py-2.5 px-3">Welfare Fund</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Government Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cooperatives.map((coop) => (
                <tr key={coop.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {coop.name}
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                    {coop.registration_no}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {coop.district}, {coop.state}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700">
                    {coop.member_count ?? 5} workers
                  </td>
                  <td className="py-3 px-3 font-extrabold text-emerald-700">
                    ₹{Number(coop.fund_balance).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      coop.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {coop.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {coop.status === 'PENDING' ? (
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleUpdateStatus(coop.id, 'APPROVED')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(coop.id, 'REJECTED')}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">Verified Official</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Flagged Cooperatives Monitoring */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Quality & Dispute Monitoring Watchlist</h3>
            <p className="text-xs text-slate-500">Automated threshold flags for low average member ratings (&lt;3.8★) or high dispute rates (&gt;10%)</p>
          </div>
        </div>

        <div className="space-y-3">
          {flaggedCoops.map((c) => (
            <div
              key={c.cooperative_id}
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                c.is_flagged ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                  <span className="text-xs text-slate-500">({c.district})</span>
                  {c.is_flagged ? (
                    <span className="bg-amber-200 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      FLAGGED FOR REVIEW
                    </span>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      HEALTHY COMPLIANCE
                    </span>
                  )}
                </div>

                <div className="flex gap-4 text-xs text-slate-600 mt-1">
                  <span>Avg Member Rating: <strong>{c.average_rating}★</strong></span>
                  <span>Dispute Rate: <strong>{c.dispute_rate}%</strong> ({c.dispute_count} disputes)</span>
                  <span>Active Members: <strong>{c.member_count}</strong></span>
                </div>

                {c.is_flagged && c.flag_reasons.length > 0 && (
                  <p className="text-[11px] text-amber-800 font-semibold mt-1">
                    Reasons: {c.flag_reasons.join('; ')}
                  </p>
                )}
              </div>

              <div>
                <button
                  onClick={() => alert(`Inspection audit requested for ${c.name}. Notification dispatched to District Registrar.`)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition"
                >
                  Initiate Quality Audit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
