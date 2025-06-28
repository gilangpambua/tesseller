// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   const { username, password } = await req.json();

//   const res = await fetch("https://test-fe.mysellerpintar.com/api/auth/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ username, password }),
//   });

//   if (!res.ok) {
//     return NextResponse.json({ message: "Login gagal" }, { status: 401 });
//   }

//   const data = await res.json();
//   const token = data.token;
//   const role = data.role;
//   console.log(data);
//   console.log(token);
//   console.log(role);

//   // Pastikan cookies diset dengan benar
//   const response = NextResponse.json({
//     message: "Login sukses",
//     role,
//     token,
//     success: true,
//   });

//   response.cookies.set("token", token, {
//     httpOnly: process.env.NODE_ENV === "production",
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//     path: "/",
//     maxAge: 60 * 60, // 1 jam
//   });

//   response.cookies.set("role", role, {
//     httpOnly: process.env.NODE_ENV === "production",
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//     path: "/",
//     maxAge: 60 * 60, // 1 jam
//   });

//   return response;
// }
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const res = await fetch("https://test-fe.mysellerpintar.com/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    return NextResponse.json({ message: "Login gagal" }, { status: 401 });
  }

  const data = await res.json();
  const token = data.token;
  const role = data.role;

  const response = NextResponse.json({
    message: "Login sukses",
    role,
    token,
    success: true,
  });

  response.cookies.set("token", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60,
  });

  response.cookies.set("role", role, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60,
  });

  return response;
}
