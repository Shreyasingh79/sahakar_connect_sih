import { Request, Response } from 'express';
import { db } from '../db';

export async function getCategories(req: Request, res: Response): Promise<void> {
  const { cooperative_id } = req.query;
  let categories = db.getCategories();

  if (cooperative_id) {
    // If cooperative custom rates exist, they take precedence
    categories = categories.filter(c => c.cooperative_id === cooperative_id || c.cooperative_id === null);
  }

  res.json(categories);
}
