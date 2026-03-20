import { prisma } from '../../server/db';
import { jsonResponse } from '../utils';

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'DELETE') return jsonResponse(res, 405, { error: 'Method not allowed' });
    const id = req.query?.id;
    if (!id) return jsonResponse(res, 400, { error: 'Missing id' });

    await prisma.user.delete({ where: { id: String(id) } });
    return jsonResponse(res, 204, {});
  } catch (e) {
    return jsonResponse(res, 500, { error: String(e) });
  }
}

