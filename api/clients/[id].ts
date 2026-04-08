export default async function handler(req: any, res: any) {
  try {
    const id = String(req.query?.id ?? '');
    if (!id) return res.status(400).json({ error: 'Missing id' });

    const { prisma } = await import('../../server/db.js');
    const { toClient } = await import('../../server/mappers.js');

    if (req.method === 'GET') {
      const row = await prisma.client.findUnique({ where: { id } });
      if (!row) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(toClient(row));
    }

    if (req.method === 'DELETE') {
      await prisma.client.delete({ where: { id } });
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}

