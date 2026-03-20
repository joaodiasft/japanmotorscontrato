import { prisma } from '../../server/db';
import { toUser } from '../../server/mappers';
import { jsonResponse, readJsonBody } from '../utils';
import type { User } from '../../src/types';

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const rows = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });
      return jsonResponse(res, 200, rows.map(toUser));
    }

    if (req.method === 'POST') {
      const body = readJsonBody(req) as User;
      const id = body.id || `u_${Math.random().toString(36).slice(2, 11)}`;
      const createdAt = body.createdAt ? new Date(body.createdAt as any) : new Date();

      const row = await prisma.user.upsert({
        where: { id },
        create: {
          id,
          name: body.name,
          email: body.email,
          role: body.role,
          avatar: body.avatar ?? null,
          createdAt,
        },
        update: {
          name: body.name,
          email: body.email,
          role: body.role,
          avatar: body.avatar ?? null,
        },
      });

      return jsonResponse(res, 200, toUser(row));
    }

    return jsonResponse(res, 405, { error: 'Method not allowed' });
  } catch (e) {
    return jsonResponse(res, 500, { error: String(e) });
  }
}

