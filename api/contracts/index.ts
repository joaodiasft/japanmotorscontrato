import { prisma } from '../../server/db';
import { toContract } from '../../server/mappers';
import { jsonResponse, readJsonBody } from '../utils';
import type { Contract } from '../../src/types';

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const rows = await prisma.contract.findMany({ orderBy: { createdAt: 'desc' } });
      return jsonResponse(res, 200, rows.map(toContract));
    }

    if (req.method === 'POST') {
      const body = readJsonBody(req) as Partial<Contract> & { id?: string };
      const id =
        body.id ||
        `CTR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

      const createdAt = body.createdAt ? new Date(body.createdAt as any) : new Date();

      const row = await prisma.contract.upsert({
        where: { id },
        create: {
          id,
          type: body.type || 'sale',
          clientId: body.clientId || '',
          vehicleId: body.vehicleId || '',
          clientName: body.clientName || '',
          vehicleName: body.vehicleName || '',
          date: body.date || new Date().toISOString(),
          totalValue: body.totalValue ?? 0,
          downPayment: body.downPayment ?? 0,
          balance: body.balance ?? 0,
          paymentMethod: body.paymentMethod || '',
          warrantyDays: body.warrantyDays ?? 90,
          clauses: (body.clauses || []) as any,
          templateId: body.templateId ?? null,
          status: body.status || 'active',
          createdAt,
        },
        update: {
          type: body.type || 'sale',
          clientId: body.clientId || '',
          vehicleId: body.vehicleId || '',
          clientName: body.clientName || '',
          vehicleName: body.vehicleName || '',
          date: body.date || new Date().toISOString(),
          totalValue: body.totalValue ?? 0,
          downPayment: body.downPayment ?? 0,
          balance: body.balance ?? 0,
          paymentMethod: body.paymentMethod || '',
          warrantyDays: body.warrantyDays ?? 90,
          clauses: (body.clauses || []) as any,
          templateId: body.templateId ?? null,
          status: body.status || 'active',
        },
      });

      return jsonResponse(res, 200, toContract(row));
    }

    return jsonResponse(res, 405, { error: 'Method not allowed' });
  } catch (e) {
    return jsonResponse(res, 500, { error: String(e) });
  }
}

