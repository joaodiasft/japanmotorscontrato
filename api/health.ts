import { jsonResponse } from './utils';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return jsonResponse(res, 405, { error: 'Method not allowed' });
  return jsonResponse(res, 200, { ok: true });
}

