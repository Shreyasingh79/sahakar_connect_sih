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
  member_count?: number;
  verified_members_count?: number;
  completed_bookings_count?: number;
  total_gmv?: number;
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
  completed_bookings_count?: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  base_rate: number;
  cooperative_id: string | null;
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
  payout_breakdown?: {
    amount: number;
    worker_share: number;
    cooperative_share: number;
    platform_fee: number;
    explanation: string;
  };
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
  proximity_score: number;
  rating_score: number;
  availability_score: number;
  skill_match_score: number;
  breakdown_explanation: string;
}

export interface AdminAnalyticsOverview {
  total_bookings: number;
  completed_bookings: number;
  active_bookings: number;
  total_gmv: number;
  total_worker_payouts: number;
  total_cooperative_funds: number;
  total_platform_fees: number;
  cooperative_count: number;
  approved_cooperatives: number;
  total_workers: number;
  verified_workers: number;
  welfare_split: {
    worker_percent: number;
    coop_fund_percent: number;
    platform_percent: number;
  };
}

export interface CategoryDemandData {
  category_id: string;
  category_name: string;
  total_bookings: number;
  completed_bookings: number;
  gmv: number;
  base_rate: number;
}

export interface DistrictDemandData {
  district: string;
  bookings_count: number;
  gmv: number;
  cooperatives_count: number;
}

export interface FlaggedCooperative {
  cooperative_id: string;
  name: string;
  district: string;
  member_count: number;
  average_rating: number;
  dispute_count: number;
  dispute_rate: number;
  is_flagged: boolean;
  flag_reasons: string[];
}
