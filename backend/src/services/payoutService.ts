import { db } from '../db';
import { Payout } from '../types';

export interface PayoutBreakdown {
  amount: number;
  worker_share: number;        // 80%
  cooperative_share: number;   // 15%
  platform_fee: number;        // 5%
}

export function computePayoutSplit(amount: number): PayoutBreakdown {
  const worker_share = Math.round(amount * 0.80 * 100) / 100;
  const cooperative_share = Math.round(amount * 0.15 * 100) / 100;
  const platform_fee = Math.round((amount - worker_share - cooperative_share) * 100) / 100;

  return {
    amount,
    worker_share,
    cooperative_share,
    platform_fee
  };
}

export function processBookingPayout(bookingId: string): { success: boolean; payout?: Payout; error?: string } {
  const booking = db.findBookingById(bookingId);
  if (!booking) {
    return { success: false, error: 'Booking not found' };
  }

  const existingPayout = db.getPayouts().find(p => p.booking_id === bookingId);
  if (existingPayout && existingPayout.status === 'RELEASED') {
    return { success: true, payout: existingPayout };
  }

  const split = computePayoutSplit(booking.amount);

  const payout: Payout = {
    id: existingPayout ? existingPayout.id : `payout-${Date.now()}`,
    booking_id: bookingId,
    worker_share: split.worker_share,
    cooperative_share: split.cooperative_share,
    platform_fee: split.platform_fee,
    status: 'RELEASED',
    created_at: new Date().toISOString()
  };

  db.addPayout(payout);

  // Increment cooperative fund balance by the 15% cooperative share
  if (booking.worker && booking.worker.cooperative_id) {
    db.addCoopFund(booking.worker.cooperative_id, split.cooperative_share);
  }

  return { success: true, payout };
}
