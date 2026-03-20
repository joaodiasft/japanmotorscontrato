import { prisma } from '../../server/db';
import { toSystemSettings } from '../../server/mappers';
import { getDefaultSystemSettings } from '../../server/seed-data';
import { jsonResponse, readJsonBody } from '../utils';

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const row = await prisma.systemSettings.findUnique({ where: { id: 1 } });
      if (!row) {
        const defaults = getDefaultSystemSettings();
        const created = await prisma.systemSettings.create({
          data: {
            id: 1,
            companyName: defaults.companyName,
            cnpj: defaults.cnpj,
            address: defaults.address,
            phone: defaults.phone,
            email: defaults.email,
            contractTemplates: defaults.contractTemplates as any,
          },
        });
        return jsonResponse(res, 200, toSystemSettings(created));
      }
      return jsonResponse(res, 200, toSystemSettings(row));
    }

    if (req.method === 'PUT') {
      const body = readJsonBody(req);
      const updated = await prisma.systemSettings.upsert({
        where: { id: 1 },
        create: {
          id: 1,
          companyName: body.companyName,
          cnpj: body.cnpj,
          address: body.address,
          phone: body.phone,
          email: body.email,
          contractTemplates: body.contractTemplates as any,
        },
        update: {
          companyName: body.companyName,
          cnpj: body.cnpj,
          address: body.address,
          phone: body.phone,
          email: body.email,
          contractTemplates: body.contractTemplates as any,
        },
      });
      return jsonResponse(res, 200, toSystemSettings(updated));
    }

    return jsonResponse(res, 405, { error: 'Method not allowed' });
  } catch (e) {
    return jsonResponse(res, 500, { error: String(e) });
  }
}

