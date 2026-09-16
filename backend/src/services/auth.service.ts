import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import type { UserModel } from '../generated/prisma/models.js';
import { AppError } from '../middlewares/error-handler.js';
import type { LoginInput, RegisterInput } from '../schemas/auth.schema.js';
import { signToken } from '../utils/jwt.js';

const SALT_ROUNDS = 10;

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserModel['role'];
  createdAt: Date;
}

export function toPublicUser(user: UserModel): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function buildSession(user: UserModel) {
  return {
    user: toPublicUser(user),
    token: signToken({ sub: user.id, email: user.email, role: user.role }),
  };
}

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });

  if (existing) {
    throw new AppError(409, 'Email already registered');
  }

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      passwordHash: await bcrypt.hash(input.password, SALT_ROUNDS),
    },
  });

  return buildSession(user);
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
    throw new AppError(401, 'Invalid email or password');
  }

  return buildSession(user);
}

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return toPublicUser(user);
}
