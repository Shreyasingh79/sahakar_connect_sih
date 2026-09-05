import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { requestOtp, verifyOtp, getMe } from '../controllers/authController';
import { getCategories } from '../controllers/categoryController';
import { searchWorkers, getWorkerById, updateAvailability } from '../controllers/workerController';
import {
  createBooking,
  getBookingById,
  getMyBookings,
  updateBookingStatus,
  payBooking,
  rateBooking,
  cancelBooking
} from '../controllers/bookingController';
import {
  getCooperatives,
  getCooperativeById,
  createCooperative,
  updateCooperativeStatus,
  addMemberToCooperative,
  updateCategoryRates
} from '../controllers/cooperativeController';
import {
  createProposal,
  getCooperativeProposals,
  castVote,
  getProposalResults,
  closeProposal
} from '../controllers/governanceController';
import {
  getAnalyticsOverview,
  getDemandByCategory,
  getDemandByDistrict,
  getFlaggedCooperatives
} from '../controllers/adminController';

const router = Router();

// Auth Endpoints
router.post('/auth/otp/request', requestOtp);
router.post('/auth/otp/verify', verifyOtp);
router.get('/auth/me', authenticate, getMe);

// Categories
router.get('/categories', getCategories);

// Workers
router.get('/workers/search', searchWorkers);
router.get('/workers/:id', getWorkerById);
router.patch('/workers/availability', authenticate, updateAvailability);

// Bookings
router.post('/bookings', authenticate, createBooking);
router.get('/bookings/mine', authenticate, getMyBookings);
router.get('/bookings/:id', authenticate, getBookingById);
router.patch('/bookings/:id/status', authenticate, updateBookingStatus);
router.post('/bookings/:id/pay', authenticate, payBooking);
router.post('/bookings/:id/rate', authenticate, rateBooking);
router.post('/bookings/:id/cancel', authenticate, cancelBooking);

// Cooperatives
router.post('/cooperatives', authenticate, requireRole('GOV_ADMIN', 'COOP_ADMIN'), createCooperative);
router.get('/cooperatives', getCooperatives);
router.get('/cooperatives/:id', getCooperativeById);
router.patch('/cooperatives/:id/status', authenticate, requireRole('GOV_ADMIN'), updateCooperativeStatus);
router.post('/cooperatives/:id/members', authenticate, requireRole('COOP_ADMIN', 'GOV_ADMIN'), addMemberToCooperative);
router.patch('/cooperatives/:id/rates', authenticate, requireRole('COOP_ADMIN'), updateCategoryRates);

// Governance
router.post('/cooperatives/:id/proposals', authenticate, requireRole('COOP_ADMIN'), createProposal);
router.get('/cooperatives/:id/proposals', getCooperativeProposals);
router.post('/proposals/:id/vote', authenticate, requireRole('WORKER'), castVote);
router.get('/proposals/:id/results', getProposalResults);
router.patch('/proposals/:id/close', authenticate, requireRole('COOP_ADMIN'), closeProposal);

// Admin Analytics
router.get('/admin/analytics/overview', getAnalyticsOverview);
router.get('/admin/analytics/demand-by-category', getDemandByCategory);
router.get('/admin/analytics/demand-by-district', getDemandByDistrict);
router.get('/admin/analytics/flagged-cooperatives', getFlaggedCooperatives);

export default router;
