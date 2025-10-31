import mongoose from 'mongoose';

const MONGODB_URI = process.env.DATABASE_URL;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the DATABASE_URL environment variable inside .env.local'
  );
}

// Initialize cached variable with the correct type
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB using a cached connection to prevent multiple connections in development.
 */
async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Store the promise of the connection
    cached.promise = mongoose.connect(MONGODB_URI!, opts);
  }

  try {
    // Wait for the connection promise to resolve
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    // Reset the promise if connection fails
    cached.promise = null;
    throw e;
  }
}

export default dbConnect;
