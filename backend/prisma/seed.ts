import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { Role } from '../src/generated/prisma/enums.js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const services = [
  {
    name: 'Corte',
    description: 'Corte clássico na tesoura e máquina',
    durationMinutes: 30,
    price: 45,
  },
  { name: 'Barba', description: 'Barba modelada com toalha quente', durationMinutes: 20, price: 30 },
  { name: 'Corte + Barba', description: 'Combo completo', durationMinutes: 50, price: 70 },
  {
    name: 'Corte infantil',
    description: 'Corte para crianças de até 10 anos',
    durationMinutes: 25,
    price: 35,
  },
];

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@barbershop.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'admin123';

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: Role.ADMIN },
    create: {
      name: 'Administração Fade',
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
