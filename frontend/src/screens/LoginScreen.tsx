import React, { useState } from 'react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { api } from '../api/client';
import { 
  Phone, KeyRound, Sparkles, CheckCircle, 
  AlertCircle, Users, UserCheck, Building2, Shield 
} from 'lucide-react';
import { Role } from '../types';

interface LoginScreenProps {
  onSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
  const { login, switchRole } = useAuth();
  const [phone, setPhone] = useState<string>('9876500001');
  const [otp, setOtp] = useState<string>('123456');
  const [step, setStep] = useState<'phone' | 'otp'>('otp');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>('Mock OTP 123456 pre-filled for SIH Hackathon testing.');
  const [error, setError] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError('Please enter a 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.auth.requestOtp(phone);
      setOtp(res.otp);
      setMessage(`Mock OTP sent: ${res.otp} (Logged to console)`);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await login(phone, otp);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: Role) => {
    setLoading(true);
    setError(null);
    try {
      await switchRole(role);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 px-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center mx-auto mb-3 shadow-md text-2xl font-bold">
            🤝
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Login to SahakarConnect
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Cooperative gig platform powered by Ministry of Cooperation
          </p>
        </div>

        {/* SIH Hackathon Demo Quick Login Presets */}
        <div className="mb-6 p-3.5 bg-orange-50 rounded-2xl border border-orange-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-900 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>1-Click Test Login for SIH Evaluators:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('CUSTOMER')}
              disabled={loading}
              className="p-2 text-left bg-white hover:bg-orange-100/50 rounded-xl border border-orange-200 text-xs transition flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-900">Customer</p>
                <p className="text-[10px] text-slate-500">Aarav (Book)</p>
              </div>
            </button>

            <button
              onClick={() => handleQuickLogin('WORKER')}
              disabled={loading}
              className="p-2 text-left bg-white hover:bg-orange-100/50 rounded-xl border border-orange-200 text-xs transition flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-900">Worker</p>
                <p className="text-[10px] text-slate-500">Ramesh (Plumber)</p>
              </div>
            </button>

            <button
              onClick={() => handleQuickLogin('COOP_ADMIN')}
              disabled={loading}
              className="p-2 text-left bg-white hover:bg-orange-100/50 rounded-xl border border-orange-200 text-xs transition flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-900">Coop Admin</p>
                <p className="text-[10px] text-slate-500">Pune Sahakari</p>
              </div>
            </button>

            <button
              onClick={() => handleQuickLogin('GOV_ADMIN')}
              disabled={loading}
              className="p-2 text-left bg-white hover:bg-orange-100/50 rounded-xl border border-orange-200 text-xs transition flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-purple-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-900">Gov Admin</p>
                <p className="text-[10px] text-slate-500">Ministry Portal</p>
              </div>
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-800 text-xs rounded-xl border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Standard Phone / OTP Form */}
        <form onSubmit={step === 'phone' ? handleRequestOtp : handleVerifyOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              Mobile Number (+91)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876500001"
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              required
            />
          </div>

          {step === 'otp' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                  6-Digit OTP Code
                </label>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-[11px] font-semibold text-orange-600 hover:underline"
                >
                  Change Number
                </button>
              </div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="w-full text-center tracking-widest text-lg font-bold bg-slate-50 border border-slate-300 rounded-xl py-2.5 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                required
              />
              <p className="text-[10px] text-slate-500 mt-1 text-center">
                For dev demo: mock OTP is <strong>123456</strong>
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 rounded-xl shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Verifying...' : step === 'phone' ? 'Get OTP Code' : 'Verify & Enter Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};
