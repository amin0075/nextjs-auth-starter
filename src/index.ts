// Re-export types and utilities
export * from "./types";

// Export configuration functions that users can call
export { createAuth } from "./lib/auth-config";
export { createAuthMiddleware } from "./lib/middleware";

// Export commonly used utilities
export { db } from "./lib/db";
