import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { db } from '../db';
import { Booking, BookingStatus } from '../types';
import { processBookingPayout, computePayoutSplit } from '../services/payoutService';

// Reference to Socket.io instance
let ioInstance: any = null;
export function setSocketIO(io: any) {
  ioInstance = io;
}

export async function createBooking(req: AuthRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { worker_id, category_id, scheduled_time, address, instructions, amount } = req.body;

  if (!worker_id || !category_id || !address) {
    res.status(400).json({ error: 'worker_id, category_id, and address are required' });
    return;
  }

  const worker = db.findWorkerById(worker_id);
  if (!worker) {
    res.status(404).json({ error: 'Worker not found' });
    return;
  }

  const category = db.findCategoryById(category_id);
  if (!category) {
    res.status(404).json({ error: 'Service category not found' });
    return;
  }

  const bookingAmount = Number(amount) || Number(category.base_rate) || 500;
  const split = computePayoutSplit(bookingAmount);

  const newBooking: Booking = {
    id: `booking-${Date.now()}`,
    customer_id: req.user.id,
    worker_id,
    category_id,
    status: 'REQUESTED',
    scheduled_time: scheduled_time || new Date(Date.now() + 86400000).toISOString(),
    address,
    instructions: instructions || null,
    amount: bookingAmount,
    created_at: new Date().toISOString()
  };

  const created = db.addBooking(newBooking);

  // Emit real-time notification to worker
  if (ioInstance) {
    ioInstance.to(`worker_${worker_id}`).emit('booking:new', created);
    ioInstance.emit('booking:created', created);
  }

  res.status(201).json({
    message: 'Booking created successfully',
    booking: created,
    payout_breakdown_preview: {
      amount: bookingAmount,
      worker_share: split.worker_share,
      cooperative_share: split.cooperative_share,
      platform_fee: split.platform_fee,
      explanation: '80% direct to worker, 15% cooperative welfare & insurance fund, 5% platform maintenance fee'
    }
  });
}

export async function getBookingById(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const booking = db.findBookingById(id);

  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  const split = computePayoutSplit(booking.amount);

  res.json({
    ...booking,
    payout_breakdown: {
      amount: booking.amount,
      worker_share: split.worker_share,
      cooperative_share: split.cooperative_share,
      platform_fee: split.platform_fee,
      explanation: '80% to worker, 15% to cooperative fund, 5% platform fee'
    }
  });
}

export async function getMyBookings(req: AuthRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const user = req.user;
  let bookings: Booking[] = [];

  if (user.role === 'WORKER') {
    const worker = db.findWorkerByUserId(user.id);
    if (worker) {
      bookings = db.getBookingsByWorker(worker.id);
    }
  } else if (user.role === 'COOP_ADMIN') {
    // Coop admin can see bookings for all workers in their cooperative
    const coop = db.getCooperatives().find(c => c.admin_user_id === user.id);
    if (coop) {
      const coopWorkerIds = db.getWorkers().filter(w => w.cooperative_id === coop.id).map(w => w.id);
      bookings = db.getBookings().filter(b => coopWorkerIds.includes(b.worker_id));
    }
  } else if (user.role === 'GOV_ADMIN') {
    bookings = db.getBookings();
  } else {
    // Customer
    bookings = db.getBookingsByCustomer(user.id);
  }

  res.json(bookings);
}

export async function updateBookingStatus(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses: BookingStatus[] = ['REQUESTED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED'];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    return;
  }

  const booking = db.findBookingById(id);
  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  const updated = db.updateBookingStatus(id, status);

  // If status is completed, automatically calculate and trigger payout split
  let payoutResult = null;
  if (status === 'COMPLETED') {
    payoutResult = processBookingPayout(id);
  }

  if (ioInstance) {
    ioInstance.to(`booking_${id}`).emit('booking:status_changed', { id, status, updated });
    ioInstance.emit('booking:updated', updated);
  }

  res.json({
    message: `Booking status updated to ${status}`,
    booking: updated,
    payout: payoutResult?.payout
  });
}

export async function payBooking(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const payoutResult = processBookingPayout(id);

  if (!payoutResult.success) {
    res.status(400).json({ error: payoutResult.error });
    return;
  }

  db.updateBookingStatus(id, 'COMPLETED');
  const updatedBooking = db.findBookingById(id);

  if (ioInstance) {
    ioInstance.to(`booking_${id}`).emit('booking:status_changed', { id, status: 'COMPLETED', updated: updatedBooking });
  }

  res.json({
    message: 'Payment processed and 80/15/5 revenue split deposited to worker & cooperative fund',
    payout: payoutResult.payout,
    booking: updatedBooking
  });
}

export async function rateBooking(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const { score, comment } = req.body;

  if (!score || score < 1 || score > 5) {
    res.status(400).json({ error: 'Score must be an integer between 1 and 5' });
    return;
  }

  const booking = db.findBookingById(id);
  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  if (booking.status !== 'COMPLETED') {
    res.status(400).json({ error: 'Cannot rate a booking that has not been completed' });
    return;
  }

  const rating = db.addRating({
    id: `rating-${Date.now()}`,
    booking_id: id,
    score: Math.round(score),
    comment: comment || null,
    created_at: new Date().toISOString()
  });

  const updatedBooking = db.findBookingById(id);
  res.json({
    message: 'Thank you! Your rating and review have been submitted.',
    rating,
    worker_new_avg: updatedBooking?.worker?.rating_avg
  });
}

export async function cancelBooking(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const booking = db.findBookingById(id);

  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  if (booking.status === 'COMPLETED' || booking.status === 'IN_PROGRESS') {
    res.status(400).json({ error: `Cannot cancel a booking that is ${booking.status}` });
    return;
  }

  const updated = db.updateBookingStatus(id, 'CANCELLED');
  if (ioInstance) {
    ioInstance.to(`booking_${id}`).emit('booking:status_changed', { id, status: 'CANCELLED', updated });
  }

  res.json({
    message: 'Booking cancelled successfully',
    booking: updated
  });
}
