import React, { useState } from 'react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  Building2, UserCheck, Shield, Users, 
  Globe, LogOut, ChevronDown, Sparkles
} from 'lucide-react';
import { Role } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, logout, switchRole, socket } = useAuth();
  const { t, i18n } = useTranslation();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const toggleLanguage = () => {
    const next = i18n.language === 'HI' ? 'EN' : 'HI';
    i18n.changeLanguage(next);
    localStorage.setItem('sahakar_lang', next);
  };

  const getRoleBadge = (role?: Role) => {
    switch (role) {
      case 'GOV_ADMIN':
        return { label: 'Gov Admin', color: 'bg-purple-100 text-purple-800 border-purple-300', icon: Shield };
      case 'COOP_ADMIN':
        return { label: 'Coop Admin', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: Building2 };
      case 'WORKER':
        return { label: 'Worker Member', color: 'bg-amber-100 text-amber-800 border-amber-300', icon: UserCheck };
      default:
        return { label: 'Customer', color: 'bg-blue-100 text-blue-800 border-blue-300', icon: Users };
    }
  };

  const currentRoleBadge = getRoleBadge(user?.role);
  const CurrentIcon = currentRoleBadge.icon;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      {/* Top Ministry Ribbon */}
      <div className="bg-gradient-to-r from-orange-600 via-white to-emerald-700 h-1 w-full" />
      <div className="bg-slate-900 text-slate-300 text-xs py-1 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-slate-200">{t('ministryTitle')}</span>
          <span className="text-slate-500">|</span>
          <span className="text-orange-400 font-semibold">{t('sihBadge')}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400">Live Socket Sync:</span>
          <span className={`inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded ${socket?.connected ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${socket?.connected ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
            {socket?.connected ? 'Active' : 'Connecting'}
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-emerald-600 flex items-center justify-center text-white shadow-md font-bold text-xl">
              🤝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Sahakar<span className="text-orange-600">Connect</span>
                </span>
                <span className="text-[10px] bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  Cooperative
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">100% Worker Ownership | 80/15/5 Model</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentTab === 'home' ? 'bg-slate-100 text-orange-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('nav.home')}
            </button>

            {(!user || user.role === 'CUSTOMER') && (
              <>
                <button
                  onClick={() => setCurrentTab('services')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    currentTab === 'services' ? 'bg-slate-100 text-orange-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t('nav.bookService')}
                </button>
                {user && (
                  <button
                    onClick={() => setCurrentTab('my-bookings')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      currentTab === 'my-bookings' ? 'bg-slate-100 text-orange-600' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t('nav.myBookings')}
                  </button>
                )}
              </>
            )}

            {user?.role === 'WORKER' && (
              <button
                onClick={() => setCurrentTab('worker')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentTab === 'worker' ? 'bg-amber-100 text-amber-900 font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('nav.workerDashboard')}
              </button>
            )}

            {user?.role === 'COOP_ADMIN' && (
              <button
                onClick={() => setCurrentTab('coop-admin')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentTab === 'coop-admin' ? 'bg-emerald-100 text-emerald-900 font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('nav.coopAdmin')}
              </button>
            )}

            {user?.role === 'GOV_ADMIN' && (
              <button
                onClick={() => setCurrentTab('gov-portal')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentTab === 'gov-portal' ? 'bg-purple-100 text-purple-900 font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('nav.govPortal')}
              </button>
            )}
          </nav>

          {/* Right Controls: Quick Role Switcher, Language Toggle, Auth */}
          <div className="flex items-center gap-2">
            {/* Quick Demo Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-800 transition shadow-sm"
                title="Instant switch between roles for SIH demo"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span className="hidden sm:inline">Demo Switch:</span>
                <span className="font-bold">{user ? user.role : 'Guest'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">SIH 2026 Judge Demo Switcher</p>
                    <p className="text-xs text-slate-500">1-click switch between all 4 system personas:</p>
                  </div>
                  {(['CUSTOMER', 'WORKER', 'COOP_ADMIN', 'GOV_ADMIN'] as Role[]).map((r) => {
                    const info = DEMO_USERS[r];
                    const isCurrent = user?.role === r;
                    return (
                      <button
                        key={r}
                        onClick={async () => {
                          await switchRole(r);
                          setShowRoleMenu(false);
                          if (r === 'CUSTOMER') setCurrentTab('services');
                          else if (r === 'WORKER') setCurrentTab('worker');
                          else if (r === 'COOP_ADMIN') setCurrentTab('coop-admin');
                          else if (r === 'GOV_ADMIN') setCurrentTab('gov-portal');
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-start gap-2 hover:bg-slate-50 transition ${
                          isCurrent ? 'bg-orange-50/70 border-l-4 border-orange-500 font-semibold' : ''
                        }`}
                      >
                        <div className="mt-0.5">
                          {r === 'CUSTOMER' && <Users className="w-4 h-4 text-blue-600" />}
                          {r === 'WORKER' && <UserCheck className="w-4 h-4 text-amber-600" />}
                          {r === 'COOP_ADMIN' && <Building2 className="w-4 h-4 text-emerald-600" />}
                          {r === 'GOV_ADMIN' && <Shield className="w-4 h-4 text-purple-600" />}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{info.name}</p>
                          <p className="text-[10px] text-slate-500">{info.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              title="Switch Language / भाषा बदलें"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{i18n.language === 'HI' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* User Profile / Logout or Login */}
            {user ? (
              <div className="flex items-center gap-2 ml-1">
                <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${currentRoleBadge.color}`}>
                  <CurrentIcon className="w-3 h-3" />
                  <span>{user.name.split(' ')[0]}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentTab('login')}
                className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition"
              >
                {t('nav.login')}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
