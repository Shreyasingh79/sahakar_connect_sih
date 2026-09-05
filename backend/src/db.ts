import { 
  User, Cooperative, Worker, ServiceCategory, Booking, Payout, Rating, Proposal, Vote 
} from './types';
import { 
  seedUsers, seedCooperatives, seedCategories, seedWorkers, 
  seedBookings, seedPayouts, seedRatings, seedProposals, seedVotes 
} from './data/seedData';
import { PrismaClient } from '@prisma/client';

class DataStore {
  public users: User[] = JSON.parse(JSON.stringify(seedUsers));
  public cooperatives: Cooperative[] = JSON.parse(JSON.stringify(seedCooperatives));
  public categories: ServiceCategory[] = JSON.parse(JSON.stringify(seedCategories));
  public workers: Worker[] = JSON.parse(JSON.stringify(seedWorkers));
  public bookings: Booking[] = JSON.parse(JSON.stringify(seedBookings));
  public payouts: Payout[] = JSON.parse(JSON.stringify(seedPayouts));
  public ratings: Rating[] = JSON.parse(JSON.stringify(seedRatings));
  public proposals: Proposal[] = JSON.parse(JSON.stringify(seedProposals));
  public votes: Vote[] = JSON.parse(JSON.stringify(seedVotes));

  private prisma: PrismaClient | null = null;
  public isPrismaActive = false;

  constructor() {
    try {
      this.prisma = new PrismaClient();
    } catch {
      this.prisma = null;
    }
  }

  public async init() {
    if (this.prisma) {
      try {
        await this.prisma.$connect();
        this.isPrismaActive = true;
        console.log('[Database] Connected to PostgreSQL via Prisma');
      } catch {
        this.isPrismaActive = false;
        console.log('[Database] PostgreSQL not reachable, using resilient in-memory local data store preloaded with SIH 2026 seed data');
      }
    }
  }

  // User queries
  public findUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  public findUserByPhone(phone: string): User | undefined {
    const clean = phone.replace(/[\s+-]/g, '').slice(-10);
    return this.users.find(u => u.phone.replace(/[\s+-]/g, '').slice(-10) === clean);
  }

  public createUser(user: User): User {
    this.users.push(user);
    return user;
  }

  // Cooperative queries
  public getCooperatives(): Cooperative[] {
    return this.cooperatives;
  }

  public findCooperativeById(id: string): Cooperative | undefined {
    return this.cooperatives.find(c => c.id === id);
  }

  public updateCooperative(id: string, updates: Partial<Cooperative>): Cooperative | undefined {
    const coop = this.findCooperativeById(id);
    if (!coop) return undefined;
    Object.assign(coop, updates);
    return coop;
  }

  public addCooperative(coop: Cooperative): Cooperative {
    this.cooperatives.push(coop);
    return coop;
  }

  public addCoopFund(coopId: string, amount: number) {
    const coop = this.findCooperativeById(coopId);
    if (coop) {
      coop.fund_balance = Math.round((coop.fund_balance + amount) * 100) / 100;
    }
  }

  // Worker queries
  public getWorkers(): Worker[] {
    return this.workers.map(w => {
      const user = this.findUserById(w.user_id);
      const coop = this.findCooperativeById(w.cooperative_id);
      return { ...w, user, cooperative: coop };
    });
  }

  public findWorkerById(id: string): Worker | undefined {
    const w = this.workers.find(item => item.id === id);
    if (!w) return undefined;
    const user = this.findUserById(w.user_id);
    const coop = this.findCooperativeById(w.cooperative_id);
    return { ...w, user, cooperative: coop };
  }

  public findWorkerByUserId(userId: string): Worker | undefined {
    const w = this.workers.find(item => item.user_id === userId);
    if (!w) return undefined;
    const user = this.findUserById(w.user_id);
    const coop = this.findCooperativeById(w.cooperative_id);
    return { ...w, user, cooperative: coop };
  }

  public updateWorker(id: string, updates: Partial<Worker>): Worker | undefined {
    const w = this.workers.find(item => item.id === id);
    if (!w) return undefined;
    Object.assign(w, updates);
    return this.findWorkerById(id);
  }

  public addWorker(worker: Worker): Worker {
    this.workers.push(worker);
    return this.findWorkerById(worker.id)!;
  }

  // Service Categories
  public getCategories(): ServiceCategory[] {
    return this.categories;
  }

  public findCategoryById(id: string): ServiceCategory | undefined {
    return this.categories.find(c => c.id === id);
  }

  public updateCategoryRate(id: string, newRate: number): ServiceCategory | undefined {
    const cat = this.findCategoryById(id);
    if (cat) cat.base_rate = newRate;
    return cat;
  }

  // Bookings
  public getBookings(): Booking[] {
    return this.bookings.map(b => this.enrichBooking(b));
  }

  public findBookingById(id: string): Booking | undefined {
    const b = this.bookings.find(item => item.id === id);
    return b ? this.enrichBooking(b) : undefined;
  }

  public getBookingsByCustomer(customerId: string): Booking[] {
    return this.bookings
      .filter(b => b.customer_id === customerId)
      .map(b => this.enrichBooking(b))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getBookingsByWorker(workerId: string): Booking[] {
    return this.bookings
      .filter(b => b.worker_id === workerId)
      .map(b => this.enrichBooking(b))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public addBooking(booking: Booking): Booking {
    this.bookings.push(booking);
    return this.enrichBooking(booking);
  }

  public updateBookingStatus(id: string, status: Booking['status']): Booking | undefined {
    const b = this.bookings.find(item => item.id === id);
    if (!b) return undefined;
    b.status = status;
    return this.enrichBooking(b);
  }

  private enrichBooking(b: Booking): Booking {
    const customer = this.findUserById(b.customer_id);
    const worker = this.findWorkerById(b.worker_id);
    const category = this.findCategoryById(b.category_id);
    const payout = this.payouts.find(p => p.booking_id === b.id) || null;
    const rating = this.ratings.find(r => r.booking_id === b.id) || null;
    return { ...b, customer, worker, category, payout, rating };
  }

  // Payouts
  public addPayout(payout: Payout): Payout {
    const existingIdx = this.payouts.findIndex(p => p.booking_id === payout.booking_id);
    if (existingIdx >= 0) {
      this.payouts[existingIdx] = payout;
    } else {
      this.payouts.push(payout);
    }
    return payout;
  }

  public getPayouts(): Payout[] {
    return this.payouts;
  }

  // Ratings
  public addRating(rating: Rating): Rating {
    this.ratings.push(rating);
    // Recalculate worker's average rating
    const booking = this.bookings.find(b => b.id === rating.booking_id);
    if (booking) {
      const workerBookings = this.bookings.filter(b => b.worker_id === booking.worker_id).map(b => b.id);
      const workerRatings = this.ratings.filter(r => workerBookings.includes(r.booking_id));
      if (workerRatings.length > 0) {
        const sum = workerRatings.reduce((acc, r) => acc + r.score, 0);
        const avg = Math.round((sum / workerRatings.length) * 100) / 100;
        this.updateWorker(booking.worker_id, { rating_avg: avg });
      }
    }
    return rating;
  }

  public getRatings(): Rating[] {
    return this.ratings;
  }

  // Proposals & Governance
  public getProposals(cooperativeId?: string): Proposal[] {
    const list = cooperativeId 
      ? this.proposals.filter(p => p.cooperative_id === cooperativeId) 
      : this.proposals;
    
    return list.map(p => ({
      ...p,
      votes: this.votes.filter(v => v.proposal_id === p.id)
    }));
  }

  public findProposalById(id: string): Proposal | undefined {
    const p = this.proposals.find(item => item.id === id);
    if (!p) return undefined;
    return {
      ...p,
      votes: this.votes.filter(v => v.proposal_id === p.id)
    };
  }

  public addProposal(proposal: Proposal): Proposal {
    this.proposals.push(proposal);
    return proposal;
  }

  public updateProposal(id: string, updates: Partial<Proposal>): Proposal | undefined {
    const p = this.proposals.find(item => item.id === id);
    if (!p) return undefined;
    Object.assign(p, updates);
    return this.findProposalById(id);
  }

  public addVote(vote: Vote): { success: boolean; error?: string } {
    // Check if worker already voted on this proposal
    const existing = this.votes.find(v => v.proposal_id === vote.proposal_id && v.worker_id === vote.worker_id);
    if (existing) {
      return { success: false, error: 'Democratic rule: One-member-one-vote! You have already cast your vote on this proposal.' };
    }
    this.votes.push(vote);
    return { success: true };
  }

  public getVotesForProposal(proposalId: string): Vote[] {
    return this.votes.filter(v => v.proposal_id === proposalId);
  }
}

export const db = new DataStore();
