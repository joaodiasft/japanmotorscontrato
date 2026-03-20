import { prisma } from '../../server/db';
import { toContract } from '../../server/mappers';
import { jsonResponse } from '../utils';

export default async function handler(req: any, res: any) {
  try {
    const id = req.query?.id;
    if (!id) return jsonResponse(res, 400, { error: 'Missing id' });

    if (req.method !== 'GET') return jsonResponse(res, 405, { error: 'Method not allowed' });

    const row = await prisma.contract.findUnique({ where: { id: String(id) } });
    if (!row) return jsonResponse(res, 404, { error: 'Not found' });
    return jsonResponse(res, 200, toContract(row));
  } catch (e) {
    return jsonResponse(res, 500, { error: String(e) });
  }
}

