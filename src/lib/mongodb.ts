import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mizhuo:Gf3pcTkgWPpROHE1@mizhuolimited.eywpszi.mongodb.net/mizhuo';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// Define a type for the mongoose cache
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Use a safer way to handle global variables
let globalWithMongoose = global as typeof globalThis & {
  mongoose?: MongooseCache;
};

// Initialize the cache
const cached: MongooseCache = globalWithMongoose.mongoose || { conn: null, promise: null };

// Set the global mongoose cache if it doesn't exist
if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = cached;
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then(mongoose => {
        console.log('Connected to MongoDB');
        return mongoose;
      })
      .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB; 