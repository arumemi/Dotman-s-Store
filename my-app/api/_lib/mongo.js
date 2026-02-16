import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_USERNAME = process.env.MONGODB_USERNAME || '';
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || '';
const MONGODB_CLUSTER_HOST = process.env.MONGODB_CLUSTER_HOST || '';
const MONGODB_OPTIONS = process.env.MONGODB_OPTIONS || 'retryWrites=true&w=majority&appName=Cluster0';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'click_call_db';
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION || 'products';

let mongoClient = null;
let collectionPromise = null;

const getMongoUri = () => {
  if (MONGODB_URI) return MONGODB_URI;

  if (MONGODB_USERNAME && MONGODB_PASSWORD && MONGODB_CLUSTER_HOST) {
    const encodedUser = encodeURIComponent(MONGODB_USERNAME);
    const encodedPassword = encodeURIComponent(MONGODB_PASSWORD);
    return `mongodb+srv://${encodedUser}:${encodedPassword}@${MONGODB_CLUSTER_HOST}/${MONGODB_DB_NAME}?${MONGODB_OPTIONS}`;
  }

  return '';
};

export const normalizeProduct = (product) => {
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

export const getCollection = async () => {
  if (collectionPromise) return collectionPromise;

  collectionPromise = (async () => {
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
  })();

  return collectionPromise;
};

export const sendJson = (res, status, payload) => {
  res.status(status).json(payload);
};
