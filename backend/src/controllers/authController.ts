import { Response } from 'express';
import { AuthRequest, generateToken } from '../middleware/auth';
import { db } from '../db';
import { User, Worker, Role } from '../types';

// In-memory OTP storage for validation
const otpCache: Record<string, string> = {};

export async function requestOtp(req: AuthRequest, res: Response): Promise<void> {
  const { phone } = req.body;
  if (!phone) {
    res.status(400).json({ error: 'Phone number is required' });
    return;
  }

  const cleanPhone = phone.replace(/[\s+-]/g, '').slice(-10);
  // Default mock OTP for development and SIH demo
  const mockOtp = '123456';
  otpCache[cleanPhone] = mockOtp;

  console.log(`[AUTH-OTP] Generated OTP for +91-${cleanPhone}: ${mockOtp}`);

  res.json({
    message: 'OTP sent successfully (Mock OTP enabled for SIH Hackathon Demo)',
    phone: cleanPhone,
    otp: mockOtp,
    note: 'In development mode, OTP is logged and returned in response for frictionless testing.'
  });
}

export async function verifyOtp(req: AuthRequest, res: Response): Promise<void> {
  const { phone, otp, role, name, cooperative_id, skills } = req.body;
  if (!phone || !otp) {
    res.status(400).json({ error: 'Both phone and OTP are required' });
    return;
  }

  const cleanPhone = phone.replace(/[\s+-]/g, '').slice(-10);
  const expectedOtp = otpCache[cleanPhone] || '123456';

  if (otp !== expectedOtp && otp !== '123456') {
    res.status(400).json({ error: 'Invalid OTP code. For demo purposes, please use 123456.' });
    return;
  }

  let user = db.findUserByPhone(cleanPhone);

  // If user does not exist, auto-create user with requested role
  if (!user) {
    const assignedRole: Role = (role as Role) || 'CUSTOMER';
    const newUserId = `user-${Date.now()}`;
    user = db.createUser({
      id: newUserId,
      role: assignedRole,
      name: name || (assignedRole === 'CUSTOMER' ? 'Demo Customer' : 'Cooperative Member'),
      phone: cleanPhone,
      lang_pref: 'EN',
      created_at: new Date().toISOString()
    });

    if (assignedRole === 'WORKER') {
      const targetCoopId = cooperative_id || db.getCooperatives()[0]?.id || 'coop-1';
      const newWorker: Worker = {
        id: `worker-${Date.now()}`,
        user_id: newUserId,
        cooperative_id: targetCoopId,
        skills: Array.isArray(skills) && skills.length > 0 ? skills : ['Cleaning', 'Plumbing'],
        verification_status: 'VERIFIED',
        rating_avg: 4.8,
        availability_status: true,
        lat: 18.5204,
        lng: 73.8567
      };
      db.addWorker(newWorker);
    }
  }

  const token = generateToken(user);
  let workerProfile = db.findWorkerByUserId(user.id);
  let cooperative = workerProfile?.cooperative;

  if (user.role === 'COOP_ADMIN') {
    cooperative = db.getCooperatives().find(c => c.admin_user_id === user!.id);
  }

  res.json({
    message: 'Login successful',
    token,
    user,
    workerProfile,
    cooperative
  });
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const user = req.user;
  const workerProfile = db.findWorkerByUserId(user.id);
  let cooperative = workerProfile?.cooperative;

  if (user.role === 'COOP_ADMIN') {
    cooperative = db.getCooperatives().find(c => c.admin_user_id === user.id);
  }

  res.json({
    user,
    workerProfile,
    cooperative
  });
}
