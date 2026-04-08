export function jsonResponse(res: any, status: number, body: any) {
  res.status(status).json(body);
}

export function readJsonBody(req: any) {
  if (req?.body && typeof req.body === 'object') return req.body;
  if (typeof req?.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return {};
}

