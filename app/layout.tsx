import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

export const dynamic = "force-dynamic";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cucerdos Mundial | Dashboard",
  description: "Cucerdos Mundial: fantasy del mundial entre amigos - países, duelos y tabla",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${outfit.variable} font-sans antialiased bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 pl-56">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
