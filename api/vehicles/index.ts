import { prisma } from '../../server/db';
import { toVehicle } from '../../server/mappers';
import { jsonResponse, readJsonBody } from '../utils';
import type { Vehicle } from '../../src/types';

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const rows = await prisma.vehicle.findMany({ orderBy: { createdAt: 'desc' } });
      return jsonResponse(res, 200, rows.map(toVehicle));
    }

    if (req.method === 'POST') {
      const body = readJsonBody(req) as Partial<Vehicle> & { id?: string };
      const id =
        body.id || `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;

      const createdAt = body.createdAt ? new Date(body.createdAt as any) : new Date();
      const row = await prisma.vehicle.upsert({
        where: { id },
        create: {
          id,
          type: body.type || 'car',
          brand: body.brand || '',
          model: body.model || '',
          year: body.year ?? new Date().getFullYear(),
          color: body.color || '',
          plate: body.plate || '',
          vin: body.vin || '',
          renavam: body.renavam || '',
          mileage: body.mileage ?? 0,
          fuel: body.fuel || 'Flex',
          acquisitionPrice: body.acquisitionPrice ?? 0,
          salePrice: body.salePrice ?? null,
          status: body.status || 'available',
          images: (body.images || []) as any,
          inspectionNotes: body.inspectionNotes ?? null,
          createdAt,
        },
        update: {
          type: body.type || 'car',
          brand: body.brand || '',
          model: body.model || '',
          year: body.year ?? new Date().getFullYear(),
          color: body.color || '',
          plate: body.plate || '',
          vin: body.vin || '',
          renavam: body.renavam || '',
          mileage: body.mileage ?? 0,
          fuel: body.fuel || 'Flex',
          acquisitionPrice: body.acquisitionPrice ?? 0,
          salePrice: body.salePrice ?? null,
          status: body.status || 'available',
          images: (body.images || []) as any,
          inspectionNotes: body.inspectionNotes ?? null,
        },
      });
      return jsonResponse(res, 200, toVehicle(row));
    }

    return jsonResponse(res, 405, { error: 'Method not allowed' });
  } catch (e) {
    return jsonResponse(res, 500, { error: String(e) });
  }
}

