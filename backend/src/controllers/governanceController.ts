import { Request, Response } from 'express';
import { db } from '../db';
import { AuthRequest } from '../middleware/auth';
import { Proposal, Vote } from '../types';

export async function createProposal(req: AuthRequest, res: Response): Promise<void> {
  const { id: cooperative_id } = req.params;
  const { title, description, options, deadline } = req.body;

  if (!title || !description || !Array.isArray(options) || options.length < 2) {
    res.status(400).json({ error: 'Proposal requires title, description, and at least 2 voting options' });
    return;
  }

  const newProposal: Proposal = {
    id: `prop-${Date.now()}`,
    cooperative_id,
    title,
    description,
    options,
    deadline: deadline || new Date(Date.now() + 7 * 86400000).toISOString(),
    status: 'OPEN',
    created_at: new Date().toISOString()
  };

  const created = db.addProposal(newProposal);
  res.status(201).json({
    message: 'Democratic governance proposal published successfully',
    proposal: created
  });
}

export async function getCooperativeProposals(req: Request, res: Response): Promise<void> {
  const { id: cooperative_id } = req.params;
  const proposals = db.getProposals(cooperative_id);
  res.json(proposals);
}

export async function castVote(req: AuthRequest, res: Response): Promise<void> {
  const { id: proposal_id } = req.params;
  const { choice } = req.body;

  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const worker = db.findWorkerByUserId(req.user.id);
  if (!worker) {
    res.status(403).json({ error: 'Only registered cooperative worker members are eligible to vote' });
    return;
  }

  const proposal = db.findProposalById(proposal_id);
  if (!proposal) {
    res.status(404).json({ error: 'Proposal not found' });
    return;
  }

  if (proposal.status === 'CLOSED' || new Date(proposal.deadline).getTime() < Date.now()) {
    res.status(400).json({ error: 'Voting is closed for this proposal' });
    return;
  }

  if (worker.cooperative_id !== proposal.cooperative_id) {
    res.status(403).json({ error: 'You can only vote on proposals within your affiliated cooperative' });
    return;
  }

  if (!proposal.options.includes(choice)) {
    res.status(400).json({ error: `Invalid option chosen. Valid choices are: ${proposal.options.join(', ')}` });
    return;
  }

  const newVote: Vote = {
    id: `vote-${Date.now()}`,
    proposal_id,
    worker_id: worker.id,
    choice,
    created_at: new Date().toISOString()
  };

  const result = db.addVote(newVote);
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }

  res.json({
    message: 'Vote recorded successfully! One-member-one-vote applied.',
    vote: newVote
  });
}

export async function getProposalResults(req: Request, res: Response): Promise<void> {
  const { id: proposal_id } = req.params;
  const proposal = db.findProposalById(proposal_id);

  if (!proposal) {
    res.status(404).json({ error: 'Proposal not found' });
    return;
  }

  const votes = db.getVotesForProposal(proposal_id);
  const totalVotes = votes.length;

  const tally: Record<string, { count: number; percentage: number }> = {};
  for (const opt of proposal.options) {
    const count = votes.filter(v => v.choice === opt).length;
    const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
    tally[opt] = { count, percentage };
  }

  // Find leading choice
  let leadingOption = '';
  let maxCount = -1;
  for (const [opt, data] of Object.entries(tally)) {
    if (data.count > maxCount) {
      maxCount = data.count;
      leadingOption = opt;
    }
  }

  res.json({
    proposal,
    total_votes: totalVotes,
    tally,
    leading_choice: leadingOption,
    is_closed: proposal.status === 'CLOSED' || new Date(proposal.deadline).getTime() < Date.now()
  });
}

export async function closeProposal(req: AuthRequest, res: Response): Promise<void> {
  const { id: proposal_id } = req.params;
  const updated = db.updateProposal(proposal_id, { status: 'CLOSED' });

  if (!updated) {
    res.status(404).json({ error: 'Proposal not found' });
    return;
  }

  res.json({
    message: 'Proposal officially closed. Final results locked.',
    proposal: updated
  });
}
