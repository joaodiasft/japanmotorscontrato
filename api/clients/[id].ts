import { prisma } from '../../server/db';
import { toClient } from '../../server/mappers';
import { jsonResponse, readJsonBody } from '../utils';
import type { Client } from '../../src/types';

export default async function handler(req: any, res: any) {
  try {
    const id = req.query?.id;
    if (!id) return jsonResponse(res, 400, { error: 'Missing id' });

    if (req.method === 'GET') {
      const row = await prisma.client.findUnique({ where: { id: String(id) } });
      if (!row) return jsonResponse(res, 404, { error: 'Not found' });
      return jsonResponse(res, 200, toClient(row));
    }

    if (req.method === 'DELETE') {
      await prisma.client.delete({ where: { id: String(id) } });
      return jsonResponse(res, 204, {});
    }

    if (req.method === 'PUT') {
      const body = readJsonBody(req) as Partial<Client>;
      const updated = await prisma.client.upsert({
        where: { id: String(id) },
        create: {
          id: String(id),
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
          createdAt: body.createdAt ? new Date(body.createdAt as any) : new Date(),
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
      return jsonResponse(res, 200, toClient(updated));
    }

    return jsonResponse(res, 405, { error: 'Method not allowed' });
  } catch (e) {
    return jsonResponse(res, 500, { error: String(e) });
  }
}

