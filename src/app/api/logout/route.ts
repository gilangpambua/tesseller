// // import { NextResponse } from "next/server";

// // export async function POST() {
// //   const response = NextResponse.json({ message: "Logged out" });
// //   response.cookies.delete("token");
// //   response.cookies.delete("role");
// //   return response;
// // }
// // src/app/api/logout/route.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export async function POST(req: NextRequest) {
//   const response = NextResponse.json({ message: "Logged out" });

//   response.cookies.set("token", "", {
//     path: "/",
//     maxAge: 0,
//   });

//   response.cookies.set("role", "", {
//     path: "/",
//     maxAge: 0,
//   });

//   return response;
// }
