import { prisma } from '../../server/db';
import { toVehicle } from '../../server/mappers';
import { jsonResponse } from '../utils';
import { readJsonBody } from '../utils';
import type { Vehicle } from '../../src/types';

export default async function handler(req: any, res: any) {
  try {
    const id = req.query?.id;
    if (!id) return jsonResponse(res, 400, { error: 'Missing id' });

    if (req.method === 'GET') {
      const row = await prisma.vehicle.findUnique({ where: { id: String(id) } });
      if (!row) return jsonResponse(res, 404, { error: 'Not found' });
      return jsonResponse(res, 200, toVehicle(row));
    }

    if (req.method === 'DELETE') {
      await prisma.vehicle.delete({ where: { id: String(id) } });
      return jsonResponse(res, 204, {});
    }

    // Optional: allow PUT to align with some clients (not used by our UI)
    if (req.method === 'PUT') {
      const body = readJsonBody(req) as Partial<Vehicle>;
      const updated = await prisma.vehicle.upsert({
        where: { id: String(id) },
        create: {
          id: String(id),
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
          createdAt: body.createdAt ? new Date(body.createdAt as any) : new Date(),
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
      return jsonResponse(res, 200, toVehicle(updated));
    }

    return jsonResponse(res, 405, { error: 'Method not allowed' });
  } catch (e) {
    return jsonResponse(res, 500, { error: String(e) });
  }
}

