import { getCollection, normalizeProduct, sendJson } from './_lib/mongo.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  try {
    const collection = await getCollection();

    if (req.method === 'GET') {
      const products = await collection
        .find({})
        .project({ _id: 0 })
        .sort({ id: 1 })
        .toArray();

      return sendJson(res, 200, products.map(normalizeProduct).filter(Boolean));
    }

    if (req.method === 'PUT') {
      const payload = Array.isArray(req.body) ? req.body : null;

      if (!payload) {
        return sendJson(res, 400, {
          ok: false,
          message: 'Body must be an array of products.',
        });
      }

      const normalizedProducts = payload.map(normalizeProduct).filter(Boolean);

      await collection.deleteMany({});
      if (normalizedProducts.length > 0) {
        await collection.insertMany(normalizedProducts, { ordered: false });
      }

      return sendJson(res, 200, {
        ok: true,
        count: normalizedProducts.length,
        message: 'Products synced successfully',
      });
    }

    return sendJson(res, 405, { ok: false, message: 'Method Not Allowed' });
  } catch (error) {
    return sendJson(res, 500, {
      ok: false,
      message: error?.message || 'Products API error',
    });
  }
}
