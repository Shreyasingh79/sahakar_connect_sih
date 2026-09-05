import { Request, Response } from 'express';
import { db } from '../db';
import { rankWorkers } from '../services/smartMatcher';
import { AuthRequest } from '../middleware/auth';

export async function searchWorkers(req: Request, res: Response): Promise<void> {
  const { category, lat, lng, radius, city } = req.query;

  let workers = db.getWorkers().filter(w => w.verification_status === 'VERIFIED');

  // Filter by city/district if provided
  if (city) {
    const cityStr = String(city).toLowerCase();
    workers = workers.filter(w => 
      w.cooperative && (
        w.cooperative.district.toLowerCase().includes(cityStr) ||
        w.cooperative.name.toLowerCase().includes(cityStr)
      )
    );
  }

  const userLat = lat ? parseFloat(String(lat)) : undefined;
  const userLng = lng ? parseFloat(String(lng)) : undefined;
  const radiusKm = radius ? parseFloat(String(radius)) : 50;
  const targetCategory = category ? String(category) : undefined;

  const ranked = rankWorkers(workers, targetCategory, userLat, userLng, radiusKm);

  res.json({
    count: ranked.length,
    workers: ranked,
    formula: 'match_score = (0.4 * proximity_score) + (0.3 * rating_score) + (0.2 * availability_score) + (0.1 * exact_skill_match)'
  });
}

export async function getWorkerById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const worker = db.findWorkerById(id);

  if (!worker) {
    res.status(404).json({ error: 'Worker not found' });
    return;
  }

  // Fetch worker's reviews & completed bookings
  const workerBookings = db.getBookingsByWorker(worker.id);
  const completedCount = workerBookings.filter(b => b.status === 'COMPLETED').length;
  const bookingIds = workerBookings.map(b => b.id);
  const ratings = db.getRatings().filter(r => bookingIds.includes(r.booking_id));

  res.json({
    ...worker,
    completed_bookings_count: completedCount,
    ratings
  });
}

export async function updateAvailability(req: AuthRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const worker = db.findWorkerByUserId(req.user.id);
  if (!worker) {
    res.status(404).json({ error: 'Worker profile not found for this user' });
    return;
  }

  const { availability_status } = req.body;
  const newStatus = typeof availability_status === 'boolean' ? availability_status : !worker.availability_status;

  const updated = db.updateWorker(worker.id, { availability_status: newStatus });
  res.json({
    message: `Worker is now ${newStatus ? 'Available for work (Online)' : 'Offline'}`,
    worker: updated
  });
}
