export default async function handler(req: any, res: any) {
  try {
    const id = String(req.query?.id ?? '');
    if (!id) return res.status(400).json({ error: 'Missing id' });
    if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

    const { prisma } = await import('../../server/db.js');
    await prisma.user.delete({ where: { id } });
    return res.status(204).end();
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}

