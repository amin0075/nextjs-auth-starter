// Type definitions for middleware

export function createAuthMiddleware() {
  return async function middleware(request: any) {
    // This is a template function that will be copied to the user's project
    throw new Error(
      "This function should not be called directly. It is meant to be copied to your project."
    );
  };
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
