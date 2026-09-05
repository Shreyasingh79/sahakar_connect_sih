import { PrismaClient } from '@prisma/client';
import { 
  seedUsers, seedCooperatives, seedCategories, seedWorkers, 
  seedBookings, seedPayouts, seedRatings, seedProposals, seedVotes 
} from '../src/data/seedData';

const prisma = new PrismaClient();

async function main() {
  console.log('[Prisma Seed] Starting PostgreSQL database population for SahakarConnect...');

  // 1. Seed Users
  for (const user of seedUsers) {
    await prisma.user.upsert({
      where: { phone: user.phone },
      update: {},
      create: {
        id: user.id,
        role: user.role,
        name: user.name,
        phone: user.phone,
        lang_pref: user.lang_pref,
        created_at: new Date(user.created_at)
      }
    });
  }
  console.log(`[Prisma Seed] Seeded ${seedUsers.length} Users`);

  // 2. Seed Cooperatives
  for (const coop of seedCooperatives) {
    await prisma.cooperative.upsert({
      where: { registration_no: coop.registration_no },
      update: {},
      create: {
        id: coop.id,
        name: coop.name,
        registration_no: coop.registration_no,
        district: coop.district,
        state: coop.state,
        admin_user_id: coop.admin_user_id,
        fund_balance: coop.fund_balance,
        status: coop.status,
        created_at: new Date(coop.created_at)
      }
    });
  }
  console.log(`[Prisma Seed] Seeded ${seedCooperatives.length} Cooperatives`);

  // 3. Seed Service Categories
  for (const cat of seedCategories) {
    await prisma.serviceCategory.upsert({
      where: { id: cat.id },
      update: {},
      create: {
        id: cat.id,
        name: cat.name,
        description: cat.description,
        base_rate: cat.base_rate,
        cooperative_id: cat.cooperative_id
      }
    });
  }
  console.log(`[Prisma Seed] Seeded ${seedCategories.length} Service Categories`);

  // 4. Seed Workers
  for (const worker of seedWorkers) {
    await prisma.worker.upsert({
      where: { user_id: worker.user_id },
      update: {},
      create: {
        id: worker.id,
        user_id: worker.user_id,
        cooperative_id: worker.cooperative_id,
        skills: worker.skills,
        verification_status: worker.verification_status,
        rating_avg: worker.rating_avg,
        availability_status: worker.availability_status,
        lat: worker.lat,
        lng: worker.lng
      }
    });
  }
  console.log(`[Prisma Seed] Seeded ${seedWorkers.length} Workers`);

  // 5. Seed Bookings
  for (const booking of seedBookings) {
    await prisma.booking.upsert({
      where: { id: booking.id },
      update: {},
      create: {
        id: booking.id,
        customer_id: booking.customer_id,
        worker_id: booking.worker_id,
        category_id: booking.category_id,
        status: booking.status,
        scheduled_time: new Date(booking.scheduled_time),
        address: booking.address,
        instructions: booking.instructions,
        amount: booking.amount,
        created_at: new Date(booking.created_at)
      }
    });
  }
  console.log(`[Prisma Seed] Seeded ${seedBookings.length} Bookings`);

  // 6. Seed Payouts
  for (const payout of seedPayouts) {
    await prisma.payout.upsert({
      where: { booking_id: payout.booking_id },
      update: {},
      create: {
        id: payout.id,
        booking_id: payout.booking_id,
        worker_share: payout.worker_share,
        cooperative_share: payout.cooperative_share,
        platform_fee: payout.platform_fee,
        status: payout.status,
        created_at: new Date(payout.created_at)
      }
    });
  }
  console.log(`[Prisma Seed] Seeded ${seedPayouts.length} Payouts (80/15/5 revenue split)`);

  // 7. Seed Ratings
  for (const rating of seedRatings) {
    await prisma.rating.upsert({
      where: { booking_id: rating.booking_id },
      update: {},
      create: {
        id: rating.id,
        booking_id: rating.booking_id,
        score: rating.score,
        comment: rating.comment,
        created_at: new Date(rating.created_at)
      }
    });
  }
  console.log(`[Prisma Seed] Seeded ${seedRatings.length} Ratings`);

  // 8. Seed Proposals
  for (const prop of seedProposals) {
    await prisma.proposal.upsert({
      where: { id: prop.id },
      update: {},
      create: {
        id: prop.id,
        cooperative_id: prop.cooperative_id,
        title: prop.title,
        description: prop.description,
        options: prop.options,
        deadline: new Date(prop.deadline),
        status: prop.status,
        created_at: new Date(prop.created_at)
      }
    });
  }
  console.log(`[Prisma Seed] Seeded ${seedProposals.length} Governance Proposals`);

  // 9. Seed Votes
  for (const vote of seedVotes) {
    await prisma.vote.upsert({
      where: {
        proposal_id_worker_id: {
          proposal_id: vote.proposal_id,
          worker_id: vote.worker_id
        }
      },
      update: {},
      create: {
        id: vote.id,
        proposal_id: vote.proposal_id,
        worker_id: vote.worker_id,
        choice: vote.choice,
        created_at: new Date(vote.created_at)
      }
    });
  }
  console.log(`[Prisma Seed] Seeded ${seedVotes.length} Democratic Votes`);

  console.log('[Prisma Seed] Database population complete for SIH 2026 demo!');
}

main()
  .catch((e) => {
    console.error('[Prisma Seed Error]', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
