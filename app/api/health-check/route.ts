import {NextResponse} from 'next/server';
import { connectDB } from "@/lib/connectDB";

/**
 * API Route: /api/connection
 * 
 * Purpose: Test endpoint to verify MongoDB connection.
 * 
 * This route simply connects to the database and returns a success message.
 * Useful for debugging connection issues without involving other logic.
 * 
 * Usage: Send a GET request to /api/connection to check if the database connection is working.
 * Note: Ensure that MONGO_URI is set in your environment variables before testing.
 * Example Response: { "success": true }
 * Error Handling: If the connection fails, an error will be thrown and should be visible in the server logs.
 * 
 **/ 

export async function GET() {
  console.log("Received request to /api/health-check. Testing database connection...");
  await connectDB();
  return NextResponse.json({ success: true });

}

