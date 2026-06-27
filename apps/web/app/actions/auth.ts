'use server';

import { cookies } from 'next/headers';
import { prisma } from '@repo/database';
import { hashPassword, verifyPassword, encryptSession, decryptSession } from '../../lib/auth/auth-utils';
import { revalidatePath } from 'next/cache';

const COOKIE_NAME = 'growthmate_session';

export interface AuthResponse {
  success: boolean;
  error?: string;
}

/**
 * Sign up a new user, create a Profile, and automatically log them in
 */
export async function signUpUser(email: string, password: string, name: string): Promise<AuthResponse> {
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: 'Email already registered.' };
    }

    const passwordHash = await hashPassword(password);

    // Create User, Profile, and initial Stats in a transaction
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          name,
        },
      });

      const profile = await tx.profile.create({
        data: {
          id: user.id,
          name,
          avatar: null,
          level: 1,
          xp: 0,
          gold: 100,
          engagement: 50,
          energy: 70,
          statPoints: 0,
        },
      });

      await tx.stats.create({
        data: {
          profileId: profile.id,
          productivity: 10,
          creativity: 10,
          knowledge: 10,
          experience: 10,
          intelligence: 10,
          resilience: 10,
        },
      });
    });

    // Automatically log in
    return loginUser(email, password);
  } catch (error: any) {
    return { success: false, error: error.message || 'Signup failed.' };
  }
}

/**
 * Log in an existing user and set the session cookie
 */
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Invalid email or password.' };
    }

    // Encrypt user ID into session token
    const token = encryptSession({ userId: user.id, email: user.email });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Login failed.' };
  }
}

/**
 * Log out user by clearing the session cookie
 */
export async function logoutUser(): Promise<AuthResponse> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
  revalidatePath('/login');
  return { success: true };
}

/**
 * Retrieve current user session & profile
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = decryptSession(token);
    if (!payload || !payload.userId) return null;

    const profile = await prisma.profile.findUnique({
      where: { id: payload.userId },
      include: { stats: true },
    });

    if (!profile) return null;

    return {
      id: profile.id,
      name: profile.name,
      email: payload.email,
      avatar: profile.avatar,
      level: profile.level,
      xp: profile.xp,
      gold: profile.gold,
      engagement: profile.engagement,
      energy: profile.energy,
      statPoints: profile.statPoints,
      stats: profile.stats,
    };
  } catch (err) {
    return null;
  }
}
