import { prisma } from '../../server/db';
import { toClient } from '../../server/mappers';
import { jsonResponse, readJsonBody } from '../utils';
import type { Client } from '../../src/types';

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const rows = await prisma.client.findMany({ orderBy: { createdAt: 'desc' } });
      return jsonResponse(res, 200, rows.map(toClient));
    }

    if (req.method === 'POST') {
      const body = readJsonBody(req) as Partial<Client> & { id?: string };
      const id =
        body.id || `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
      const createdAt = body.createdAt ? new Date(body.createdAt as any) : new Date();

      const row = await prisma.client.upsert({
        where: { id },
        create: {
          id,
          name: body.name || '',
          status: body.status || 'active',
          birthDate: body.birthDate || '',
          gender: body.gender ?? null,
          cpf: body.cpf || '',
          rg: body.rg || '',
          email: body.email || '',
          phone: body.phone || '',
          whatsapp: body.whatsapp || '',
          address: (body.address || {}) as any,
          totalSpent: body.totalSpent ?? null,
          lastPurchase: body.lastPurchase ?? null,
          assignedVehicles: (body.assignedVehicles ?? null) as any,
          notes: body.notes ?? null,
          createdAt,
        },
        update: {
          name: body.name || '',
          status: body.status || 'active',
          birthDate: body.birthDate || '',
          gender: body.gender ?? null,
          cpf: body.cpf || '',
          rg: body.rg || '',
          email: body.email || '',
          phone: body.phone || '',
          whatsapp: body.whatsapp || '',
          address: (body.address || {}) as any,
          totalSpent: body.totalSpent ?? null,
          lastPurchase: body.lastPurchase ?? null,
          assignedVehicles: (body.assignedVehicles ?? null) as any,
          notes: body.notes ?? null,
        },
      });

      return jsonResponse(res, 200, toClient(row));
    }

    return jsonResponse(res, 405, { error: 'Method not allowed' });
  } catch (e) {
    return jsonResponse(res, 500, { error: String(e) });
  }
}

