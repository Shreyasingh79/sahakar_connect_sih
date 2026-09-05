import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, HeartHandshake, ArrowRight, Star, Sparkles, 
  CheckCircle2, Users, Building2, Vote, Wrench, Zap, Sparkle,
  GraduationCap, HeartPulse, Tv
} from 'lucide-react';
import { CommissionComparison } from '../components/CommissionComparison';
import { ServiceCategory } from '../types';

interface LandingScreenProps {
  categories: ServiceCategory[];
  onSelectCategory: (categoryName: string) => void;
  onExplore: () => void;
  onLogin: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  categories,
  onSelectCategory,
  onExplore,
  onLogin
}) => {
  const { t } = useTranslation();

  const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'cleaning':
        return <Sparkle className="w-6 h-6 text-emerald-600" />;
      case 'plumbing':
        return <Wrench className="w-6 h-6 text-blue-600" />;
      case 'electrical':
        return <Zap className="w-6 h-6 text-amber-600" />;
      case 'tutoring':
        return <GraduationCap className="w-6 h-6 text-indigo-600" />;
      case 'caregiving':
        return <HeartPulse className="w-6 h-6 text-rose-600" />;
      case 'appliance repair':
        return <Tv className="w-6 h-6 text-purple-600" />;
      default:
        return <Sparkles className="w-6 h-6 text-orange-600" />;
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.orange.100),white)] opacity-60" />
        
        <div className="max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200 shadow-xs mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-600 animate-ping"></span>
            <span>SIH 2026 Problem Statement 26089 • Ministry of Cooperation</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            {t('hero.title')}{' '}
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-600 bg-clip-text text-transparent">
              Through Worker Cooperatives
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={onExplore}
              className="px-6 py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-sm font-extrabold rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>{t('hero.exploreBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onLogin}
              className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold rounded-2xl border border-slate-300 shadow-xs transition hover:border-slate-400 flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-slate-500" />
              <span>{t('hero.loginBtn')}</span>
            </button>
          </div>

          {/* 4 Pillars Stats Cards */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
              <p className="text-3xl font-black text-emerald-600">80%</p>
              <p className="text-xs font-semibold text-slate-600 mt-1">{t('hero.statPayout')}</p>
              <p className="text-[10px] text-slate-400">Direct to worker wallet</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
              <p className="text-3xl font-black text-amber-600">15%</p>
              <p className="text-xs font-semibold text-slate-600 mt-1">Cooperative Fund</p>
              <p className="text-[10px] text-slate-400">Insurance & training</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
              <p className="text-3xl font-black text-orange-600">5%</p>
              <p className="text-xs font-semibold text-slate-600 mt-1">{t('hero.statFee')}</p>
              <p className="text-[10px] text-slate-400">Open source platform</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
              <p className="text-3xl font-black text-indigo-600">1-Member</p>
              <p className="text-xs font-semibold text-slate-600 mt-1">1-Vote Governance</p>
              <p className="text-[10px] text-slate-400">Democratic elections</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Commission Comparison */}
      <section className="max-w-6xl mx-auto px-4">
        <CommissionComparison />
      </section>

      {/* Service Categories Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Certified Household Services
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {t('categories.title')}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {t('categories.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-orange-300 transition cursor-pointer transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  {getCategoryIcon(cat.name)}
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {cat.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">{t('categories.startingFrom')}</span>
                  <p className="text-base font-extrabold text-slate-900">₹{cat.base_rate}</p>
                </div>
                <span className="text-xs font-bold text-orange-600 group-hover:translate-x-1 transition flex items-center gap-1">
                  Book <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Architecture Section */}
      <section className="bg-slate-100 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
              Cooperative Lifecycle
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              How SahakarConnect Operates
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 font-black text-sm flex items-center justify-center mb-3">1</span>
              <h4 className="font-bold text-slate-900 text-sm">Customer Requests</h4>
              <p className="text-xs text-slate-500 mt-1">Select category and location. Transparent price breakdown shown before paying.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 font-black text-sm flex items-center justify-center mb-3">2</span>
              <h4 className="font-bold text-slate-900 text-sm">Smart AI Match</h4>
              <p className="text-xs text-slate-500 mt-1">Weighted scoring ranks the nearest available cooperative worker member.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 font-black text-sm flex items-center justify-center mb-3">3</span>
              <h4 className="font-bold text-slate-900 text-sm">80/15/5 Payout</h4>
              <p className="text-xs text-slate-500 mt-1">80% to worker, 15% to coop fund for medical insurance, 5% platform fee.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 font-black text-sm flex items-center justify-center mb-3">4</span>
              <h4 className="font-bold text-slate-900 text-sm">Democratic Vote</h4>
              <p className="text-xs text-slate-500 mt-1">Workers vote one-member-one-vote on cooperative rates and welfare fund use.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
