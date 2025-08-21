import { RequestHandler } from 'express';
import prisma from '../db/prisma';
import { CustomError } from '../utility/CustomError';
import { z } from 'zod';

/**
 * setPresence
 * Persists user presence (ONLINE/OFFLINE) and updates lastSeen when OFFLINE.
 */
const presenceSchema = z.object({
  status: z.enum(['ONLINE', 'OFFLINE']),
});

export const setPresence: RequestHandler = async (req, res) => {
  const user = req.user;
  if (!user?.uid) {
    throw new CustomError(401, 'Unauthorized');
  }

  const parsed = presenceSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new CustomError(400, 'Invalid presence payload', { errors: parsed.error.errors });
  }

  const { status } = parsed.data;

  const updated = await prisma.user.update({
    where: { id: user.uid },
    data: {
      status: status as any,
      lastSeen: status === 'OFFLINE' ? new Date() : undefined,
    },
    select: { id: true, status: true, lastSeen: true },
  });

  res.status(200).json({
    status: 'success',
    message: 'Presence updated',
    data: { user: updated },
  });
};


