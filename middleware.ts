// import { NextRequest, NextResponse } from "next/server";

// export function middleware(req: NextRequest) {
//   const token = req.cookies.get("token")?.value;
//   const role = req.cookies.get("role")?.value;
//   const url = req.nextUrl.pathname;

//   console.log("Token:", token);
//   console.log("Role:", role);
//   console.log("URL:", url);

//   if (!token) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   // Halaman yang hanya boleh diakses oleh Admin
//   const adminOnlyPaths = ["/dashboard", "/addArtikel"];
//   // Halaman yang hanya boleh diakses oleh User
//   const userOnlyPaths = ["/artikel", "/detailArtikel"];

//   // Cek jika user mengakses halaman Admin
//   if (adminOnlyPaths.some((path) => url.startsWith(path))) {
//     if (role !== "Admin") {
//       return NextResponse.redirect(new URL("/", req.url));
//     }
//   }

//   // Cek jika user mengakses halaman User
//   if (userOnlyPaths.some((path) => url.startsWith(path))) {
//     if (role !== "User") {
//       return NextResponse.redirect(new URL("/", req.url));
//     }
//   }
//   console.log("Middleware aktif di:", url);

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/dashboard",
//     "/dashboard/:path*",
//     "/addArtikel",
//     "/addArtikel/:path*",
//     "/artikel",
//     "/artikel/:path*",
//     "/detailArtikel",
//     "/detailArtikel/:path*",
//   ],
// };

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("token")?.value;
//   const role = request.cookies.get("role")?.value;

//   const pathname = request.nextUrl.pathname;

//   if (!token) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   // Cegah User mengakses halaman Admin
//   if (pathname.startsWith("/dashboard") && role !== "Admin") {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   // Cegah Admin mengakses halaman khusus User (misal /artikel)
//   if (pathname.startsWith("/artikel") && role !== "User") {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/artikel/:path*"],
// };
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const pathname = request.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/dashboard") && role !== "Admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/artikel") && role !== "User") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/profile",
    "/addArtikel",
    "/edit/:path*",
    "/artikel",
    "/category",
  ],
};
