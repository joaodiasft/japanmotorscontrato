export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { prisma } = await import('../../server/db.js');
    const { getDefaultSystemSettings } = await import('../../server/seed-data.js');
    const { toSystemSettings } = await import('../../server/mappers.js');

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
        address: merged.address as any,
        phone: merged.phone,
        email: merged.email,
        contractTemplates: merged.contractTemplates as any,
      },
      update: {
        contractTemplates: merged.contractTemplates as any,
      },
    });

    return res.status(200).json(toSystemSettings(row));
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}

