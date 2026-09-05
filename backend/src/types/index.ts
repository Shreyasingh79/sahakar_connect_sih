export type Role = 'CUSTOMER' | 'WORKER' | 'COOP_ADMIN' | 'GOV_ADMIN';
export type LangPref = 'EN' | 'HI';
export type CoopStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type BookingStatus = 'REQUESTED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
export type PayoutStatus = 'PENDING' | 'RELEASED';
export type ProposalStatus = 'OPEN' | 'CLOSED';

export interface User {
  id: string;
  role: Role;
  name: string;
  phone: string;
  lang_pref: LangPref;
  created_at: string;
}

export interface Cooperative {
  id: string;
  name: string;
  registration_no: string;
  district: string;
  state: string;
  admin_user_id: string;
  fund_balance: number;
  status: CoopStatus;
  created_at: string;
}

export interface Worker {
  id: string;
  user_id: string;
  cooperative_id: string;
  skills: string[];
  verification_status: VerificationStatus;
  rating_avg: number;
  availability_status: boolean;
  lat: number | null;
  lng: number | null;
  user?: User;
  cooperative?: Cooperative;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  base_rate: number;
  cooperative_id: string | null;
}

export interface Booking {
  id: string;
  customer_id: string;
  worker_id: string;
  category_id: string;
  status: BookingStatus;
  scheduled_time: string;
  address: string;
  instructions: string | null;
  amount: number;
  created_at: string;
  customer?: User;
  worker?: Worker;
  category?: ServiceCategory;
  payout?: Payout | null;
  rating?: Rating | null;
}

export interface Payout {
  id: string;
  booking_id: string;
  worker_share: number;
  cooperative_share: number;
  platform_fee: number;
  status: PayoutStatus;
  created_at: string;
}

export interface Rating {
  id: string;
  booking_id: string;
  score: number;
  comment: string | null;
  created_at: string;
}

export interface Proposal {
  id: string;
  cooperative_id: string;
  title: string;
  description: string;
  options: string[];
  deadline: string;
  status: ProposalStatus;
  created_at: string;
  votes?: Vote[];
}

export interface Vote {
  id: string;
  proposal_id: string;
  worker_id: string;
  choice: string;
  created_at: string;
}

export interface MatchScoreDetails {
  worker: Worker;
  total_score: number;
  distance_km: number;
  proximity_score: number; // 40%
  rating_score: number;    // 30%
  availability_score: number; // 20%
  skill_match_score: number;  // 10%
  breakdown_explanation: string;
}
