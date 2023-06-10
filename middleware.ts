import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  async function middleware(req) {
    // Get the current url
    const pathname = req.nextUrl.pathname
    // Managing the route protection

    // See if the user is authenticated
    const isAuth = await getToken({ req })
    // If user is trying to navigate to the login page
    const isLoginPage = pathname.startsWith("/login")
    // Determine our sensitive route to protect
    const sensitiveRoutes = ["/dashboard"]
    // If a user is accessing a sensitive route
    const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
      pathname.startsWith(route)
    )

    if (isLoginPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }

      return NextResponse.next()
    }

    if (!isAuth && isAccessingSensitiveRoute) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  },
  {
    callbacks: {
      async authorized() {
        return true
      },
    },
  }
)

//Check on wich url this middleware should work on

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
}
