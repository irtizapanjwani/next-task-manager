import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages even without token
        if (req.nextUrl.pathname.startsWith('/auth/')) {
          return true
        }
        // Require token for protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ["/api/tasks/:path*"] // Only protect API routes, not pages
}