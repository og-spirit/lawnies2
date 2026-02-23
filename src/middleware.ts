import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Lightweight NextAuth instance for middleware only (JWT verification, no DB calls)
// This avoids importing pg/bcrypt into the Edge Runtime.
const { auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [Credentials({})],
});

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  if (pathname.startsWith("/admin") && !isLoginPage && !req.auth) {
    return Response.redirect(new URL("/admin/login", req.url));
  }

  if (isLoginPage && req.auth) {
    return Response.redirect(new URL("/admin/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
