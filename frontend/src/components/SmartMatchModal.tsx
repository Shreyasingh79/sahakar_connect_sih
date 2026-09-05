import React from 'react';
import { Sparkles, X, MapPin, Star, CheckCircle, Award } from 'lucide-react';
import { MatchScoreDetails } from '../types';

interface SmartMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  details?: MatchScoreDetails | null;
}

export const SmartMatchModal: React.FC<SmartMatchModalProps> = ({ isOpen, onClose, details }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-orange-600 mb-2">
          <div className="p-2 bg-orange-100 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">AI Smart Matching Algorithm</h3>
            <p className="text-xs text-slate-500">SIH 2026 Problem Statement 26089 Requirement</p>
          </div>
        </div>

        <div className="mt-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
          <p className="font-semibold text-slate-700 mb-1">Transparent Ranking Formula:</p>
          <code className="block bg-slate-900 text-emerald-400 p-2.5 rounded-lg font-mono text-[11px] leading-relaxed">
            Match Score = (0.4 × Proximity) + (0.3 × Rating) + (0.2 × Availability) + (0.1 × Skill Match)
          </code>
        </div>

        {details && (
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700">Worker Candidate:</span>
              <span className="text-sm font-extrabold text-orange-600">{details.worker.user?.name}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  <span>Proximity (40% Weight)</span>
                </div>
                <p className="text-sm font-bold text-slate-900">{details.proximity_score}%</p>
                <p className="text-[10px] text-slate-500">Distance: {details.distance_km} km away</p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Rating (30% Weight)</span>
                </div>
                <p className="text-sm font-bold text-slate-900">{details.rating_score}%</p>
                <p className="text-[10px] text-slate-500">{details.worker.rating_avg} / 5.0 Stars</p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Availability (20% Weight)</span>
                </div>
                <p className="text-sm font-bold text-slate-900">{details.availability_score}%</p>
                <p className="text-[10px] text-slate-500">{details.worker.availability_status ? 'Ready Online' : 'Offline'}</p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Award className="w-3.5 h-3.5 text-purple-500" />
                  <span>Skill Match (10% Weight)</span>
                </div>
                <p className="text-sm font-bold text-slate-900">{details.skill_match_score}%</p>
                <p className="text-[10px] text-slate-500">Tags: {details.worker.skills.join(', ')}</p>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900">Total Computed Match Score:</span>
              <span className="text-xl font-black text-emerald-700">{details.total_score}/100</span>
            </div>
          </div>
        )}

        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
