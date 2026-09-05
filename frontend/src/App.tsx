import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingScreen } from './screens/LandingScreen';
import { LoginScreen } from './screens/LoginScreen';
import { CustomerDashboard } from './screens/CustomerDashboard';
import { WorkerDashboard } from './screens/WorkerDashboard';
import { CoopAdminDashboard } from './screens/CoopAdminDashboard';
import { GovAdminDashboard } from './screens/GovAdminDashboard';
import { ServiceCategory } from './types';
import { api } from './api/client';
import { HeartHandshake, Shield, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');

  useEffect(() => {
    api.categories.list().then(setCategories).catch(console.error);
  }, []);

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategoryName(categoryName);
    setCurrentTab('services');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-1">
        {currentTab === 'home' && (
          <LandingScreen
            categories={categories}
            onSelectCategory={handleSelectCategory}
            onExplore={() => setCurrentTab('services')}
            onLogin={() => setCurrentTab('login')}
          />
        )}

        {currentTab === 'login' && (
          <LoginScreen
            onSuccess={() => {
              if (user?.role === 'WORKER') setCurrentTab('worker');
              else if (user?.role === 'COOP_ADMIN') setCurrentTab('coop-admin');
              else if (user?.role === 'GOV_ADMIN') setCurrentTab('gov-portal');
              else setCurrentTab('services');
            }}
          />
        )}

        {currentTab === 'services' && (
          <CustomerDashboard
            categories={categories}
            initialCategory={selectedCategoryName}
            defaultView="services"
          />
        )}

        {currentTab === 'my-bookings' && (
          <CustomerDashboard
            categories={categories}
            initialCategory={selectedCategoryName}
            defaultView="my-bookings"
          />
        )}

        {currentTab === 'worker' && <WorkerDashboard />}

        {currentTab === 'coop-admin' && <CoopAdminDashboard />}

        {currentTab === 'gov-portal' && <GovAdminDashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-xl shadow">
                🤝
              </div>
              <div>
                <span className="text-white font-extrabold text-base tracking-tight">
                  Sahakar<span className="text-orange-400">Connect</span>
                </span>
                <p className="text-slate-400 text-xs">
                  Cooperative Gig Services Platform for Household & Community Services
                </p>
              </div>
            </div>

            <div className="text-center md:text-right space-y-1">
              <p className="text-slate-200 font-semibold">
                Smart India Hackathon 2026 • Problem Statement 26089
              </p>
              <p className="text-slate-400">
                Sponsored by <strong>Ministry of Cooperation, Government of India</strong>
              </p>
              <p className="text-[11px] text-slate-500">
                80% Worker Share • 15% Cooperative Welfare Fund • 5% Platform Fee • Democratic One-Member-One-Vote
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500">
            Designed and built for national cooperative empowerment and inclusive digital economic development.
          </div>
        </div>
      </footer>
    </div>
  );
};
