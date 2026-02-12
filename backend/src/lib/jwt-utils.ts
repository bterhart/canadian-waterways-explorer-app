import jwt from "jsonwebtoken";
import { env } from "../env";

/**
 * JWT Token Payload Interface
 */
export interface TokenPayload {
  userId: string;
  email: string;
  role: "admin" | "super_admin" | "moderator" | "teacher";
  type: "admin" | "teacher";
  status: string;
  permissions?: object;
}

/**
 * Token blacklist for logout functionality
 * In production, use Redis or a persistent cache
 */
class TokenBlacklist {
  private blacklist: Set<string> = new Set();

  add(token: string): void {
    this.blacklist.add(token);
  }

  has(token: string): boolean {
    return this.blacklist.has(token);
  }

  // Clean up expired tokens periodically
  cleanup(): void {
    // In production, implement TTL-based cleanup
    // For now, this is a placeholder
  }
}

export const tokenBlacklist = new TokenBlacklist();

// Cleanup every 15 minutes
setInterval(() => {
  tokenBlacklist.cleanup();
}, 15 * 60 * 1000);

/**
 * Generate an access token (15 minutes expiry)
 */
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
}

/**
 * Generate a refresh token (7 days expiry)
 */
export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

/**
 * Verify an access token
 */
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    if (tokenBlacklist.has(token)) {
      return null;
    }

    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
}

/**
 * Verify a refresh token
 */
export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    if (tokenBlacklist.has(token)) {
      return null;
    }

    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
}

/**
 * Extract user info from token payload
 */
export function getUserFromToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.decode(token) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
}

/**
 * Get token expiry time in seconds
 */
export function getTokenExpiry(token: string): number | null {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) {
      return null;
    }

    return decoded.exp;
  } catch (error) {
    return null;
  }
}

/**
 * Check if token will expire soon (within 5 minutes)
 */
export function willExpireSoon(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const fiveMinutes = 5 * 60;

    return (decoded.exp - currentTime) < fiveMinutes;
  } catch (error) {
    return true;
  }
}
