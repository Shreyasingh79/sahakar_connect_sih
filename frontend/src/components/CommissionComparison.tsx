import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Award, ShieldCheck, HeartHandshake } from 'lucide-react';

export const CommissionComparison: React.FC = () => {
  const { t } = useTranslation();
  const [orderValue, setOrderValue] = useState<number>(1000);

  // Corporate aggregator (e.g. Urban Company, Uber): 25% platform cut, 0% welfare fund, 75% worker take-home
  const corpCommission = Math.round(orderValue * 0.25);
  const corpWorkerShare = orderValue - corpCommission;

  // SahakarConnect Cooperative Model: 5% platform fee, 15% cooperative welfare fund, 80% direct to worker
  const sahakarWorker = Math.round(orderValue * 0.80);
  const sahakarCoopFund = Math.round(orderValue * 0.15);
  const sahakarPlatformFee = Math.round(orderValue * 0.05);

  const extraWorkerEarnings = sahakarWorker - corpWorkerShare;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-700">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 mb-3">
          <HeartHandshake className="w-3.5 h-3.5" />
          The Sahakar Difference | Ministry of Cooperation Model
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          {t('comparison.title')}
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          {t('comparison.subtitle')}
        </p>

        {/* Interactive Order Value Slider */}
        <div className="mt-8 bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{t('comparison.orderValue')}</span>
            <span className="text-2xl font-black text-orange-400">₹{orderValue.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range"
            min="300"
            max="5000"
            step="100"
            value={orderValue}
            onChange={(e) => setOrderValue(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>₹300 (Basic Fix)</span>
            <span>₹2,500 (Deep Clean)</span>
            <span>₹5,000 (Major Repairs)</span>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Corporate Aggregator Card */}
        <div className="bg-slate-800/60 rounded-2xl p-6 border border-red-500/20 relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-200 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              Corporate Aggregators
            </h3>
            <span className="text-xs text-red-400 font-semibold bg-red-950/60 px-2 py-0.5 rounded border border-red-900">
              25% Platform Cut
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-5">
            Zero worker ownership, no voting rights, aggressive algorithmic de-platforming.
          </p>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-300">Worker Payout:</span>
                <span className="text-slate-200 font-bold">₹{corpWorkerShare} (75%)</span>
              </div>
              <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-red-400">Aggregator Commission:</span>
                <span className="text-red-400 font-bold">₹{corpCommission} (25%)</span>
              </div>
              <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700 text-xs text-slate-400 flex justify-between">
              <span>Cooperative Welfare Fund:</span>
              <span className="text-red-400 font-semibold">₹0 (None)</span>
            </div>
          </div>
        </div>

        {/* SahakarConnect Model Card */}
        <div className="bg-gradient-to-b from-orange-950/40 via-slate-800 to-slate-900 rounded-2xl p-6 border-2 border-orange-500/50 relative shadow-lg">
          <div className="absolute -top-3 right-6 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow">
            Worker Cooperative Model
          </div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              SahakarConnect
            </h3>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Only 5% Platform Fee
            </span>
          </div>
          <p className="text-xs text-slate-300 mb-5">
            Democratic one-member-one-vote governance, health insurance & emergency welfare reserve.
          </p>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-emerald-300 font-semibold">Direct to Worker (80%):</span>
                <span className="text-emerald-400 font-bold">₹{sahakarWorker} (+₹{extraWorkerEarnings} more!)</span>
              </div>
              <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-amber-300">Worker Cooperative Welfare Fund (15%):</span>
                <span className="text-amber-400 font-bold">₹{sahakarCoopFund}</span>
              </div>
              <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-400">Platform Maintenance Fee (5%):</span>
                <span className="text-slate-300 font-bold">₹{sahakarPlatformFee}</span>
              </div>
              <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Callout */}
      <div className="mt-8 bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-4 max-w-3xl mx-auto flex items-center gap-4 text-left">
        <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-emerald-300">Empowering Grassroots Prosperity</h4>
          <p className="text-xs text-slate-300 mt-0.5">
            On this single booking alone, the worker earns <strong className="text-emerald-400">₹{extraWorkerEarnings} more</strong> directly, while <strong className="text-amber-400">₹{sahakarCoopFund}</strong> is locked into their collective cooperative welfare fund for group accident insurance, tool subsidies, and maternity support.
          </p>
        </div>
      </div>
    </div>
  );
};
