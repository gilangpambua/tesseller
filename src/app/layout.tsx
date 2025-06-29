import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivoSans = Archivo({
  variable: "--font-archivo-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tes Articles",
  description: "Tes Articles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${archivoSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
