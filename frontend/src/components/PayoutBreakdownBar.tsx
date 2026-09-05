import React from 'react';
import { ShieldCheck, HeartHandshake, Server } from 'lucide-react';

interface PayoutBreakdownBarProps {
  amount: number;
  className?: string;
  showDetails?: boolean;
}

export const PayoutBreakdownBar: React.FC<PayoutBreakdownBarProps> = ({ 
  amount, 
  className = '',
  showDetails = true 
}) => {
  const workerShare = Math.round(amount * 0.80 * 100) / 100;
  const coopShare = Math.round(amount * 0.15 * 100) / 100;
  const platformFee = Math.round((amount - workerShare - coopShare) * 100) / 100;

  return (
    <div className={`bg-slate-50 border border-slate-200 rounded-xl p-4 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <HeartHandshake className="w-4 h-4 text-orange-600" />
          Transparent Payout Split (SIH 2026 Model)
        </span>
        <span className="text-xs font-extrabold text-slate-900">Total: ₹{amount}</span>
      </div>

      {/* Segmented Progress Bar */}
      <div className="h-3.5 w-full flex rounded-full overflow-hidden bg-slate-200 shadow-inner">
        <div 
          className="bg-emerald-500 h-full transition-all" 
          style={{ width: '80%' }}
          title="80% Direct to Worker"
        />
        <div 
          className="bg-amber-500 h-full transition-all" 
          style={{ width: '15%' }}
          title="15% Cooperative Welfare Fund"
        />
        <div 
          className="bg-orange-500 h-full transition-all" 
          style={{ width: '5%' }}
          title="5% Platform Maintenance Fee"
        />
      </div>

      {/* Legend & Amounts */}
      {showDetails && (
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200 text-center">
          <div className="bg-white p-2 rounded-lg border border-emerald-100 shadow-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mb-1"></span>
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Worker (80%)</p>
            <p className="text-sm font-extrabold text-emerald-700">₹{workerShare}</p>
          </div>

          <div className="bg-white p-2 rounded-lg border border-amber-100 shadow-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mb-1"></span>
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Coop Fund (15%)</p>
            <p className="text-sm font-extrabold text-amber-700">₹{coopShare}</p>
          </div>

          <div className="bg-white p-2 rounded-lg border border-orange-100 shadow-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mb-1"></span>
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Platform (5%)</p>
            <p className="text-sm font-extrabold text-orange-700">₹{platformFee}</p>
          </div>
        </div>
      )}
    </div>
  );
};
