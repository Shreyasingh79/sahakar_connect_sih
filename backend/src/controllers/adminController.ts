import { Request, Response } from 'express';
import { db } from '../db';

export async function getAnalyticsOverview(req: Request, res: Response): Promise<void> {
  const bookings = db.getBookings();
  const completed = bookings.filter(b => b.status === 'COMPLETED');
  const totalGmv = completed.reduce((sum, b) => sum + b.amount, 0);

  const payouts = db.getPayouts();
  const totalWorkerPayouts = payouts.reduce((sum, p) => sum + p.worker_share, 0);
  const totalCoopFundAccumulated = payouts.reduce((sum, p) => sum + p.cooperative_share, 0);
  const totalPlatformFees = payouts.reduce((sum, p) => sum + p.platform_fee, 0);

  const coops = db.getCooperatives();
  const workers = db.getWorkers();

  res.json({
    total_bookings: bookings.length,
    completed_bookings: completed.length,
    active_bookings: bookings.filter(b => ['REQUESTED', 'ACCEPTED', 'IN_PROGRESS'].includes(b.status)).length,
    total_gmv: totalGmv,
    total_worker_payouts: totalWorkerPayouts,
    total_cooperative_funds: totalCoopFundAccumulated,
    total_platform_fees: totalPlatformFees,
    cooperative_count: coops.length,
    approved_cooperatives: coops.filter(c => c.status === 'APPROVED').length,
    total_workers: workers.length,
    verified_workers: workers.filter(w => w.verification_status === 'VERIFIED').length,
    welfare_split: {
      worker_percent: 80,
      coop_fund_percent: 15,
      platform_percent: 5
    }
  });
}

export async function getDemandByCategory(req: Request, res: Response): Promise<void> {
  const bookings = db.getBookings();
  const categories = db.getCategories();

  const data = categories.map(cat => {
    const catBookings = bookings.filter(b => b.category_id === cat.id);
    const completed = catBookings.filter(b => b.status === 'COMPLETED');
    const gmv = completed.reduce((sum, b) => sum + b.amount, 0);

    return {
      category_id: cat.id,
      category_name: cat.name,
      total_bookings: catBookings.length,
      completed_bookings: completed.length,
      gmv: gmv,
      base_rate: cat.base_rate
    };
  });

  res.json(data);
}

export async function getDemandByDistrict(req: Request, res: Response): Promise<void> {
  const bookings = db.getBookings();
  const coops = db.getCooperatives();

  const districtMap: Record<string, { bookings_count: number; gmv: number; cooperatives_count: number }> = {};

  for (const coop of coops) {
    if (!districtMap[coop.district]) {
      districtMap[coop.district] = { bookings_count: 0, gmv: 0, cooperatives_count: 0 };
    }
    districtMap[coop.district].cooperatives_count += 1;
  }

  for (const b of bookings) {
    if (b.worker && b.worker.cooperative) {
      const dist = b.worker.cooperative.district;
      if (!districtMap[dist]) {
        districtMap[dist] = { bookings_count: 0, gmv: 0, cooperatives_count: 1 };
      }
      districtMap[dist].bookings_count += 1;
      if (b.status === 'COMPLETED') {
        districtMap[dist].gmv += b.amount;
      }
    }
  }

  const data = Object.entries(districtMap).map(([district, stats]) => ({
    district,
    ...stats
  }));

  res.json(data);
}

export async function getFlaggedCooperatives(req: Request, res: Response): Promise<void> {
  const coops = db.getCooperatives();
  const workers = db.getWorkers();
  const bookings = db.getBookings();

  const flagged = coops.map(coop => {
    const coopWorkers = workers.filter(w => w.cooperative_id === coop.id);
    const workerIds = coopWorkers.map(w => w.id);
    const coopBookings = bookings.filter(b => workerIds.includes(b.worker_id));
    const disputes = coopBookings.filter(b => b.status === 'DISPUTED').length;
    const disputeRate = coopBookings.length > 0 ? (disputes / coopBookings.length) * 100 : 0;

    const avgRating = coopWorkers.length > 0
      ? coopWorkers.reduce((sum, w) => sum + Number(w.rating_avg), 0) / coopWorkers.length
      : 0;

    const isFlagged = avgRating < 3.0 || disputeRate > 10;
    const reasons: string[] = [];
    if (avgRating < 3.0 && coopWorkers.length > 0) reasons.push(`Average member rating below threshold (${avgRating.toFixed(1)}/5.0)`);
    if (disputeRate > 10) reasons.push(`High dispute rate (${disputeRate.toFixed(1)}%)`);

    return {
      cooperative_id: coop.id,
      name: coop.name,
      district: coop.district,
      member_count: coopWorkers.length,
      average_rating: Math.round(avgRating * 10) / 10,
      dispute_count: disputes,
      dispute_rate: Math.round(disputeRate * 10) / 10,
      is_flagged: isFlagged,
      flag_reasons: reasons
    };
  });

  res.json(flagged);
}
