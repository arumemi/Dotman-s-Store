import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const app = express();

const PORT = Number(process.env.API_PORT || 4000);
const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_USERNAME = process.env.MONGODB_USERNAME || '';
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || '';
const MONGODB_CLUSTER_HOST = process.env.MONGODB_CLUSTER_HOST || '';
const MONGODB_OPTIONS = process.env.MONGODB_OPTIONS || 'retryWrites=true&w=majority&appName=Cluster0';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'click_call_db';
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION || 'products';

app.use(cors());
app.use(express.json({ limit: '20mb' }));

let mongoClient = null;

const getMongoUri = () => {
  if (MONGODB_URI) return MONGODB_URI;

  if (MONGODB_USERNAME && MONGODB_PASSWORD && MONGODB_CLUSTER_HOST) {
    const encodedUser = encodeURIComponent(MONGODB_USERNAME);
    const encodedPassword = encodeURIComponent(MONGODB_PASSWORD);
    return `mongodb+srv://${encodedUser}:${encodedPassword}@${MONGODB_CLUSTER_HOST}/${MONGODB_DB_NAME}?${MONGODB_OPTIONS}`;
  }

  return '';
};

const normalizeProduct = (product) => {
  if (!product || typeof product !== 'object') return null;

  const cloned = { ...product };
  delete cloned._id;

  if (!Array.isArray(cloned.images)) {
    cloned.images = cloned.image ? [cloned.image] : [];
  }

  if (!cloned.image && cloned.images.length > 0) {
    cloned.image = cloned.images[0];
  }

  return cloned;
};

const getCollection = async () => {
  const mongoUri = getMongoUri();

  if (!mongoUri) {
    throw new Error('MongoDB config missing. Set MONGODB_URI or Atlas credentials (MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_CLUSTER_HOST).');
  }

  if (!mongoClient) {
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
  }

  const db = mongoClient.db(MONGODB_DB_NAME);
  const collection = db.collection(MONGODB_COLLECTION);

  await collection.createIndex({ id: 1 }, { unique: true, sparse: true });

  return collection;
};

app.get('/api/health', async (_req, res) => {
  try {
    await getCollection();
    return res.status(200).json({
      ok: true,
      message: 'MongoDB API is healthy',
      db: MONGODB_DB_NAME,
      collection: MONGODB_COLLECTION,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error?.message || 'MongoDB connection failed',
    });
  }
});

app.get('/api/products', async (_req, res) => {
  try {
    const collection = await getCollection();
    const products = await collection
      .find({})
      .project({ _id: 0 })
      .sort({ id: 1 })
      .toArray();

    return res.status(200).json(products.map(normalizeProduct).filter(Boolean));
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error?.message || 'Failed to fetch products',
    });
  }
});

app.put('/api/products', async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        ok: false,
        message: 'Body must be an array of products.',
      });
    }

    const normalizedProducts = req.body.map(normalizeProduct).filter(Boolean);
    const collection = await getCollection();

    await collection.deleteMany({});

    if (normalizedProducts.length > 0) {
      await collection.insertMany(normalizedProducts, { ordered: false });
    }

    return res.status(200).json({
      ok: true,
      count: normalizedProducts.length,
      message: 'Products synced successfully',
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error?.message || 'Failed to sync products',
    });
  }
});

app.listen(PORT, () => {
  console.log(`MongoDB API server running on http://localhost:${PORT}`);
});
