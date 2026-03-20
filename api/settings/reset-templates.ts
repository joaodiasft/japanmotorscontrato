import { prisma } from '../../server/db';
import { toSystemSettings } from '../../server/mappers';
import { getDefaultSystemSettings } from '../../server/seed-data';
import { jsonResponse } from '../utils';

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') return jsonResponse(res, 405, { error: 'Method not allowed' });

    const current = await prisma.systemSettings.findUnique({ where: { id: 1 } });
    const defaults = getDefaultSystemSettings();

    const merged = {
      companyName: current?.companyName ?? defaults.companyName,
      cnpj: current?.cnpj ?? defaults.cnpj,
      address: current?.address ?? defaults.address,
      phone: current?.phone ?? defaults.phone,
      email: current?.email ?? defaults.email,
      contractTemplates: defaults.contractTemplates,
    };

    const row = await prisma.systemSettings.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        companyName: merged.companyName,
        cnpj: merged.cnpj,
        address: merged.address,
        phone: merged.phone,
        email: merged.email,
        contractTemplates: merged.contractTemplates as any,
      },
      update: {
        contractTemplates: merged.contractTemplates as any,
      },
    });

    return jsonResponse(res, 200, toSystemSettings(row));
  } catch (e) {
    return jsonResponse(res, 500, { error: String(e) });
  }
}

