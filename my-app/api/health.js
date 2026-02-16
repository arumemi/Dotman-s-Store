import { getCollection, sendJson } from './_lib/mongo.js';

export default async function handler(_req, res) {
  if (_req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  if (_req.method !== 'GET') {
    return sendJson(res, 405, { ok: false, message: 'Method Not Allowed' });
  }

  try {
    await getCollection();
    return sendJson(res, 200, {
      ok: true,
      message: 'MongoDB API is healthy',
    });
  } catch (error) {
    return sendJson(res, 500, {
      ok: false,
      message: error?.message || 'MongoDB connection failed',
    });
  }
}
