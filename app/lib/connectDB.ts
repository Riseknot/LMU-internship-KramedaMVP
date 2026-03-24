/**
 * connectDB.ts
 *
 * ✅ Singleton MongoDB Connection for Nextjs
 *
 * Purpose:
 * - Connects to MongoDB once and caches the connection.
 * - Any API route or server component can call `await connectDB()`.
 * - Reusing the connection avoids creating a new one on every request.
 * - Essential for serverless environments (Vercel, Netlify) to prevent connection limits.
 *
 * Usage:
 *   import { connectDB } from "@/lib/connectDB";
 *   await connectDB();
 *
 * Notes:
 * - `process.env.MONGO_URI` must be set.
 * - Logs a message only on the first successful connection.
 */
import mongoose, { Connection, Mongoose } from "mongoose";

// Typ für den Cache
type MongooseCache = {
  conn: Connection | null;
  promise: Promise<Mongoose> | null;
};

// globalThis erweitern
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

// Initialisierung
if (!global._mongooseCache) {
  global._mongooseCache = { conn: null, promise: null };
}

const cached = global._mongooseCache; 

export async function connectDB(): Promise<Connection> {
  if (cached.conn){
      console.log("🏳️‍🌈✅ Connected to MongoDB via cache");
      return cached.conn;

  } 
  if (!cached.promise) {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI not defined");

    cached.promise = mongoose.connect(uri).then((m) => {
      console.log("🏳️‍🌈✅ Connected to MongoDB");
      return m;
    });
  }

//   console.log(`------------------------------------------------------------------------------------------ 
//                         🟥🟧🟨🟩🟦🟪      🟪🟦🟩🟨🟧🟥
//                       🟧🟨🟩🟦🟪🟥🟧  🟧🟥🟪🟦🟩🟨🟧🟥
//                       🟧🟨🟩 |--------------------| 🟩🟨🟧
//                       🟨🟩🟦 | Connect to MongoDB | 🟦🟩🟨
//                       🟩🟦🟪 |     SUCCESSFUL     | 🟪🟦🟩
//                       🟩🟦🟪 |--------------------| 🟪🟦🟩
//                         🟦🟪🟥🟧🟨🟩🟦🟪🟥🟧🟨🟩🟦🟪🟥🟧
//                           🟪🟥🟧🟨🟩🟦🟪🟥🟧🟨🟩🟦🟪🟥
//                              🟥🟧🟨🟩🟦🟪🟥🟧🟨🟩🟦🟪
//                               🟧🟨🟩🟦🟪🟥🟧🟨🟩🟦🟪
//                                🟧🟨🟩🟦🟪🟥🟧🟨🟩🟦
//                                 🟨🟩🟦🟪🟥🟧🟨🟩🟦
//                                   🟦🟪🟥🟧🟨🟩🟦
//                                    🟪🟥🟧🟨🟩🟦
//                                      🟧🟨🟩🟦
//                                       🟨🟩🟦
//                                         🟩🟦
//                                          🟦
// ------------------------------------------------------------------------------------------`);

  cached.conn = (await cached.promise).connection;
  return cached.conn;
}