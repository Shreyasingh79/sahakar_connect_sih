import { Request, Response } from 'express';
import { db } from '../db';
import { AuthRequest } from '../middleware/auth';
import { Cooperative, Worker } from '../types';

export async function getCooperatives(req: Request, res: Response): Promise<void> {
  const { status, district } = req.query;
  let coops = db.getCooperatives();

  if (status) {
    coops = coops.filter(c => c.status === status);
  }
  if (district) {
    coops = coops.filter(c => c.district.toLowerCase().includes(String(district).toLowerCase()));
  }

  // Enrich with member count and completed booking stats
  const enriched = coops.map(c => {
    const workers = db.getWorkers().filter(w => w.cooperative_id === c.id);
    const workerIds = workers.map(w => w.id);
    const bookings = db.getBookings().filter(b => workerIds.includes(b.worker_id));
    const completed = bookings.filter(b => b.status === 'COMPLETED');
    const totalGmv = completed.reduce((acc, b) => acc + b.amount, 0);

    return {
      ...c,
      member_count: workers.length,
      verified_members_count: workers.filter(w => w.verification_status === 'VERIFIED').length,
      completed_bookings_count: completed.length,
      total_gmv: totalGmv
    };
  });

  res.json(enriched);
}

export async function getCooperativeById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const coop = db.findCooperativeById(id);

  if (!coop) {
    res.status(404).json({ error: 'Cooperative not found' });
    return;
  }

  const workers = db.getWorkers().filter(w => w.cooperative_id === coop.id);
  const categories = db.getCategories().filter(c => c.cooperative_id === coop.id || c.cooperative_id === null);
  const proposals = db.getProposals(coop.id);
  const workerIds = workers.map(w => w.id);
  const bookings = db.getBookings().filter(b => workerIds.includes(b.worker_id));

  res.json({
    ...coop,
    adminUser: db.findUserById(coop.admin_user_id),
    member_count: workers.length,
    workers,
    categories,
    proposals,
    bookings
  });
}

export async function createCooperative(req: AuthRequest, res: Response): Promise<void> {
  const { name, registration_no, district, state, admin_user_id } = req.body;

  if (!name || !registration_no || !district || !state) {
    res.status(400).json({ error: 'name, registration_no, district, and state are required' });
    return;
  }

  const newCoop: Cooperative = {
    id: `coop-${Date.now()}`,
    name,
    registration_no,
    district,
    state,
    admin_user_id: admin_user_id || req.user?.id || 'user-coop-admin-1',
    fund_balance: 0,
    status: req.user?.role === 'GOV_ADMIN' ? 'APPROVED' : 'PENDING',
    created_at: new Date().toISOString()
  };

  db.addCooperative(newCoop);
  res.status(201).json({
    message: 'Cooperative registered successfully',
    cooperative: newCoop
  });
}

export async function updateCooperativeStatus(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const { status } = req.body;

  if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
    res.status(400).json({ error: 'Invalid status. Must be APPROVED, REJECTED, or PENDING' });
    return;
  }

  const updated = db.updateCooperative(id, { status });
  if (!updated) {
    res.status(404).json({ error: 'Cooperative not found' });
    return;
  }

  res.json({
    message: `Cooperative status updated to ${status}`,
    cooperative: updated
  });
}

export async function addMemberToCooperative(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const { name, phone, skills, verification_status } = req.body;

  if (!name || !phone) {
    res.status(400).json({ error: 'Member name and phone number are required' });
    return;
  }

  const cleanPhone = phone.replace(/[\s+-]/g, '').slice(-10);
  let user = db.findUserByPhone(cleanPhone);

  if (!user) {
    user = db.createUser({
      id: `user-worker-${Date.now()}`,
      role: 'WORKER',
      name,
      phone: cleanPhone,
      lang_pref: 'EN',
      created_at: new Date().toISOString()
    });
  }

  const newWorker: Worker = {
    id: `worker-${Date.now()}`,
    user_id: user.id,
    cooperative_id: id,
    skills: skills || ['Cleaning'],
    verification_status: verification_status || 'VERIFIED',
    rating_avg: 5.0,
    availability_status: true,
    lat: 18.5204,
    lng: 73.8567
  };

  const created = db.addWorker(newWorker);

  res.status(201).json({
    message: 'Worker added to cooperative successfully',
    worker: created
  });
}

export async function updateCategoryRates(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const { category_id, base_rate } = req.body;

  if (!category_id || !base_rate) {
    res.status(400).json({ error: 'category_id and base_rate are required' });
    return;
  }

  const updated = db.updateCategoryRate(category_id, Number(base_rate));
  if (!updated) {
    res.status(404).json({ error: 'Service category not found' });
    return;
  }

  res.json({
    message: `Base rate updated for ${updated.name} to ₹${base_rate}`,
    category: updated
  });
}
