import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mundial 2026",
  description: "Quiniela - La apuesta de los cabrones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-dvh app-bg">{children}</body>
    </html>
  );
}

