import { z } from "zod";

/**
 * Password complexity validation
 * Requirements: min 12 chars, upper, lower, number, special character
 */
export const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    "Password must contain at least one special character"
  );

/**
 * Hash a password using Bun's built-in password hashing
 */
export async function hashPassword(password: string): Promise<string> {
  return await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 10,
  });
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await Bun.password.verify(password, hash);
}

/**
 * Simple in-memory rate limiter for registration attempts
 * In production, use Redis or a proper rate limiting service
 */
class RateLimiter {
  private attempts: Map<string, { count: number; resetAt: number }> = new Map();

  check(identifier: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record || now > record.resetAt) {
      this.attempts.set(identifier, {
        count: 1,
        resetAt: now + windowMs,
      });
      return true;
    }

    if (record.count >= maxAttempts) {
      return false;
    }

    record.count++;
    return true;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.attempts.entries()) {
      if (now > record.resetAt) {
        this.attempts.delete(key);
      }
    }
  }
}

export const registrationRateLimiter = new RateLimiter();

// Cleanup old entries every 5 minutes
setInterval(() => {
  registrationRateLimiter.cleanup();
}, 5 * 60 * 1000);

/**
 * Log admin action for audit trail
 */
export interface AdminActionLog {
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  details?: any;
  timestamp: Date;
}

export function logAdminAction(log: AdminActionLog): void {
  // For now, just console.log. In production, store in database or logging service
  console.log("[ADMIN ACTION]", JSON.stringify(log, null, 2));
}

/**
 * Send email notification (placeholder)
 * In production, integrate with email service like SendGrid, AWS SES, etc.
 */
export interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  type:
    | "admin_registration"
    | "admin_approved"
    | "admin_rejected"
    | "content_approved";
}

export function sendEmailNotification(notification: EmailNotification): void {
  console.log("[EMAIL NOTIFICATION]", {
    to: notification.to,
    subject: notification.subject,
    type: notification.type,
    timestamp: new Date().toISOString(),
  });
  console.log("Email body:", notification.body);
}
