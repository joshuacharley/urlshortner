import mongoose, { Connection, ConnectOptions } from "mongoose";
import { MongoClient } from "mongodb";

// Configuration
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/urlShortener";
const DB_MAX_POOL_SIZE = process.env.DB_MAX_POOL_SIZE
  ? parseInt(process.env.DB_MAX_POOL_SIZE, 10)
  : 10;

if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI environment variable is not defined in .env.local"
  );
}

if (isNaN(DB_MAX_POOL_SIZE) || DB_MAX_POOL_SIZE <= 0) {
  throw new Error("DB_MAX_POOL_SIZE must be a positive integer");
}

// Types
interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

// Global cache
let cached: MongooseCache = (global as any).mongoose as MongooseCache;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

// Logger function
const log = (message: string, level: "info" | "error" = "info") => {
  const timestamp = new Date().toISOString();
  console[level](`[${timestamp}] [MongoDB] ${message}`);
};

// Connection function
async function connectToDatabase(): Promise<Connection> {
  if (cached.conn) {
    log("Using existing database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    log("Creating a new database connection");

    const opts: ConnectOptions = {
      maxPoolSize: DB_MAX_POOL_SIZE,
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        log("Database connected successfully");
        return mongooseInstance.connection;
      })
      .catch((error: Error) => {
        log(`Database connection failed: ${error.message}`, "error");
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    log("Connection established and cached");
    return cached.conn;
  } catch (error) {
    if (error instanceof Error) {
      log(
        `Error occurred while connecting to the database: ${error.message}`,
        "error"
      );
    } else {
      log(`Unknown error occurred while connecting to the database`, "error");
    }
    cached.promise = null; // Reset promise to allow for a retry
    throw error;
  }
}

// MongoClient for NextAuth
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export { clientPromise };
export default connectToDatabase;
