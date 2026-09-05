import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Worker, Cooperative, Role } from '../types';
import { api, setAuthToken, getAuthToken } from '../api/client';
import { io, Socket } from 'socket.io-client';

interface AuthContextType {
  user: User | null;
  workerProfile: Worker | null;
  cooperative: Cooperative | null;
  isLoading: boolean;
  socket: Socket | null;
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: Role) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Preset phone numbers for instant 1-click role demos
export const DEMO_USERS: Record<Role, { name: string; phone: string; description: string }> = {
  CUSTOMER: {
    name: 'Aarav Mehta',
    phone: '9876500001',
    description: 'Household customer booking cleaning, plumbing, etc.'
  },
  WORKER: {
    name: 'Ramesh Patil (Plumber)',
    phone: '9822099001',
    description: 'Pune Coop member, accepts jobs, views 80% earnings, votes'
  },
  COOP_ADMIN: {
    name: 'Sunita Deshmukh',
    phone: '9822011111',
    description: 'Pune Shramik Seva Admin, sets rates, manages proposals & fund'
  },
  GOV_ADMIN: {
    name: 'Dr. Rajeshwar Sharma',
    phone: '9999900001',
    description: 'Ministry of Cooperation IAS Officer, oversees all coops & macro charts'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [workerProfile, setWorkerProfile] = useState<Worker | null>(null);
  const [cooperative, setCooperative] = useState<Cooperative | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Initialize socket connection
  useEffect(() => {
    const socketUrl = (import.meta.env.VITE_API_URL as string) || window.location.origin;
    const s = io(socketUrl, {
      transports: ['websocket', 'polling']
    });
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  // Fetch authenticated profile on load
  const refreshProfile = async () => {
    const token = getAuthToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await api.auth.getMe();
      setUser(res.user);
      setWorkerProfile(res.workerProfile || null);
      setCooperative(res.cooperative || null);

      if (socket && res.workerProfile) {
        socket.emit('join:room', `worker_${res.workerProfile.id}`);
      }
    } catch {
      setAuthToken(null);
      setUser(null);
      setWorkerProfile(null);
      setCooperative(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const login = async (phone: string, otp: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.verifyOtp({ phone, otp });
      setAuthToken(res.token);
      setUser(res.user);
      setWorkerProfile(res.workerProfile || null);
      setCooperative(res.cooperative || null);

      if (socket && res.workerProfile) {
        socket.emit('join:room', `worker_${res.workerProfile.id}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setWorkerProfile(null);
    setCooperative(null);
  };

  const switchRole = async (role: Role) => {
    const demo = DEMO_USERS[role];
    await login(demo.phone, '123456');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workerProfile,
        cooperative,
        isLoading,
        socket,
        login,
        logout,
        switchRole,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
