export default async function handler(req: any, res: any) {
  try {
    const id = String(req.query?.id ?? '');
    if (!id) return res.status(400).json({ error: 'Missing id' });
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { prisma } = await import('../../server/db.js');
    const { toContract } = await import('../../server/mappers.js');
    const row = await prisma.contract.findUnique({ where: { id } });
    if (!row) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(toContract(row));
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}

