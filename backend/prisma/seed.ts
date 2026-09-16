import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { Role } from '../src/generated/prisma/enums.js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const services = [
  { name: 'Haircut', description: 'Classic scissor and clipper haircut', durationMinutes: 30, price: 45 },
  { name: 'Beard trim', description: 'Beard shaping with hot towel', durationMinutes: 20, price: 30 },
  { name: 'Haircut + beard', description: 'Full grooming combo', durationMinutes: 50, price: 70 },
  { name: 'Kids haircut', description: 'Haircut for children up to 10 years old', durationMinutes: 25, price: 35 },
];

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@barbershop.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'admin123';

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: Role.ADMIN },
    create: {
      name: 'Barbershop Admin',
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: Role.ADMIN,
    },
  });

  for (const service of services) {
    await prisma.service.upsert({
      where: { name: service.name },
      update: service,
      create: service,
    });
  }

  console.log(`Seeded admin ${admin.email} and ${services.length} services.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
