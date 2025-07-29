import { NextResponse } from "next/server";
import redis from "redis";

export async function GET() {
  try {
    // Get Redis configuration from environment variables
    const REDIS_HOST = process.env.REDIS_HOST || "localhost";
    const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379", 10);
    const REDIS_DB = parseInt(process.env.REDIS_DB || "0", 10);
    const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;
    
    // Create a Redis client
    const client = redis.createClient({
      socket: {
        host: REDIS_HOST,
        port: REDIS_PORT,
      },
      password: REDIS_PASSWORD,
      database: REDIS_DB,
    });
    
    // Connect to Redis
    await client.connect();
    
    // Ping Redis to check connection
    const pingResult = await client.ping();
    
    // Disconnect from Redis
    await client.disconnect();
    
    // Return success response
    return NextResponse.json({
      status: "connected",
      message: "Redis connection successful",
      timestamp: new Date().toISOString(),
      details: {
        host: REDIS_HOST,
        port: REDIS_PORT,
        database: REDIS_DB,
        ping: pingResult,
      }
    }, { status: 200 });
  } catch (error: unknown) {
    console.error("Redis health check failed:", error);
    
    // Return error response
    return NextResponse.json({
      status: "disconnected",
      message: "Redis connection failed",
      error: (error as Error).message,
      timestamp: new Date().toISOString(),
    }, { status: 503 });
  }
} 