import { 
  User, Cooperative, Worker, ServiceCategory, Booking, Proposal, 
  MatchScoreDetails, AdminAnalyticsOverview, CategoryDemandData, 
  DistrictDemandData, FlaggedCooperative 
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${(import.meta.env.VITE_API_URL as string).replace(/\/$/, '')}/api` 
  : '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('sahakar_token');
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('sahakar_token', token);
  } else {
    localStorage.removeItem('sahakar_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'An error occurred during API request');
  }

  return data as T;
}

export const api = {
  auth: {
    requestOtp: (phone: string) => 
      request<{ message: string; otp: string; phone: string }>('/auth/otp/request', {
        method: 'POST',
        body: JSON.stringify({ phone })
      }),
    verifyOtp: (payload: { phone: string; otp: string; role?: string; name?: string; cooperative_id?: string; skills?: string[] }) =>
      request<{ token: string; user: User; workerProfile?: Worker; cooperative?: Cooperative }>('/auth/otp/verify', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    getMe: () =>
      request<{ user: User; workerProfile?: Worker; cooperative?: Cooperative }>('/auth/me')
  },

  categories: {
    list: (cooperative_id?: string) =>
      request<ServiceCategory[]>(`/categories${cooperative_id ? `?cooperative_id=${cooperative_id}` : ''}`)
  },

  workers: {
    search: (params?: { category?: string; lat?: number; lng?: number; radius?: number; city?: string }) => {
      const query = new URLSearchParams();
      if (params?.category) query.append('category', params.category);
      if (params?.lat !== undefined) query.append('lat', String(params.lat));
      if (params?.lng !== undefined) query.append('lng', String(params.lng));
      if (params?.radius !== undefined) query.append('radius', String(params.radius));
      if (params?.city) query.append('city', params.city);
      return request<{ count: number; workers: MatchScoreDetails[]; formula: string }>(`/workers/search?${query.toString()}`);
    },
    getById: (id: string) =>
      request<Worker & { completed_bookings_count: number; ratings: any[] }>(`/workers/${id}`),
    updateAvailability: (availability_status?: boolean) =>
      request<{ message: string; worker: Worker }>('/workers/availability', {
        method: 'PATCH',
        body: JSON.stringify({ availability_status })
      })
  },

  bookings: {
    create: (data: { worker_id: string; category_id: string; scheduled_time?: string; address: string; instructions?: string; amount?: number }) =>
      request<{ message: string; booking: Booking; payout_breakdown_preview: any }>('/bookings', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    listMine: () =>
      request<Booking[]>('/bookings/mine'),
    getById: (id: string) =>
      request<Booking>(`/bookings/${id}`),
    updateStatus: (id: string, status: Booking['status']) =>
      request<{ message: string; booking: Booking; payout?: any }>(`/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),
    pay: (id: string) =>
      request<{ message: string; payout: any; booking: Booking }>(`/bookings/${id}/pay`, {
        method: 'POST'
      }),
    rate: (id: string, score: number, comment?: string) =>
      request<{ message: string; rating: any; worker_new_avg: number }>(`/bookings/${id}/rate`, {
        method: 'POST',
        body: JSON.stringify({ score, comment })
      }),
    cancel: (id: string) =>
      request<{ message: string; booking: Booking }>(`/bookings/${id}/cancel`, {
        method: 'POST'
      })
  },

  cooperatives: {
    list: (params?: { status?: string; district?: string }) => {
      const query = new URLSearchParams();
      if (params?.status) query.append('status', params.status);
      if (params?.district) query.append('district', params.district);
      return request<Cooperative[]>(`/cooperatives?${query.toString()}`);
    },
    getById: (id: string) =>
      request<Cooperative & { adminUser?: User; workers: Worker[]; categories: ServiceCategory[]; proposals: Proposal[]; bookings: Booking[] }>(`/cooperatives/${id}`),
    create: (data: { name: string; registration_no: string; district: string; state: string; admin_user_id?: string }) =>
      request<{ message: string; cooperative: Cooperative }>('/cooperatives', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    updateStatus: (id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') =>
      request<{ message: string; cooperative: Cooperative }>(`/cooperatives/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),
    addMember: (id: string, data: { name: string; phone: string; skills?: string[]; verification_status?: string }) =>
      request<{ message: string; worker: Worker }>(`/cooperatives/${id}/members`, {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    updateRates: (id: string, category_id: string, base_rate: number) =>
      request<{ message: string; category: ServiceCategory }>(`/cooperatives/${id}/rates`, {
        method: 'PATCH',
        body: JSON.stringify({ category_id, base_rate })
      })
  },

  governance: {
    createProposal: (cooperativeId: string, data: { title: string; description: string; options: string[]; deadline?: string }) =>
      request<{ message: string; proposal: Proposal }>(`/cooperatives/${cooperativeId}/proposals`, {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    getProposals: (cooperativeId: string) =>
      request<Proposal[]>(`/cooperatives/${cooperativeId}/proposals`),
    castVote: (proposalId: string, choice: string) =>
      request<{ message: string; vote: any }>(`/proposals/${proposalId}/vote`, {
        method: 'POST',
        body: JSON.stringify({ choice })
      }),
    getResults: (proposalId: string) =>
      request<{ proposal: Proposal; total_votes: number; tally: Record<string, { count: number; percentage: number }>; leading_choice: string; is_closed: boolean }>(`/proposals/${proposalId}/results`),
    closeProposal: (proposalId: string) =>
      request<{ message: string; proposal: Proposal }>(`/proposals/${proposalId}/close`, {
        method: 'PATCH'
      })
  },

  admin: {
    getOverview: () =>
      request<AdminAnalyticsOverview>('/admin/analytics/overview'),
    getDemandByCategory: () =>
      request<CategoryDemandData[]>('/admin/analytics/demand-by-category'),
    getDemandByDistrict: () =>
      request<DistrictDemandData[]>('/admin/analytics/demand-by-district'),
    getFlaggedCooperatives: () =>
      request<FlaggedCooperative[]>('/admin/analytics/flagged-cooperatives')
  }
};
