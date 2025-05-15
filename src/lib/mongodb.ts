import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-dealership';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Global interface to deal with mongoose caching
interface GlobalWithMongoose extends Global {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

// Add mongoose to the NodeJS global type
declare const global: GlobalWithMongoose;

// Check if we have a connection to the database
const connectDB = async (): Promise<typeof mongoose> => {
  if (global.mongoose) {
    return global.mongoose.conn!;
  }

  global.mongoose = {
    conn: null,
    promise: null,
  };

  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  global.mongoose.conn = await global.mongoose.promise;
  return global.mongoose.conn;
};

export default connectDB; 