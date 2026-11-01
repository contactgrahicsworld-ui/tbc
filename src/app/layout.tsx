import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/tbc/header";
import { Footer } from "@/components/tbc/footer";
import { PWARegister } from "@/components/tbc/pwa-register";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TBC — Tailik Business Committee | Business Networking & Growth",
  description: "Tailik Business Committee brings business professionals and entrepreneurs together to build trusted relationships, exchange opportunities and grow together.",
  keywords: ["business networking", "referrals", "TBC", "Tailik Business Committee", "Raipur", "Chhattisgarh", "business growth", "professional networking"],
  authors: [{ name: "TBC — Tailik Business Committee" }],
  icons: {
    icon: "/tbc-logo.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "TBC",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "TBC — Tailik Business Committee | Business Networking & Growth",
    description: "Tailik Business Committee brings business professionals and entrepreneurs together to build trusted relationships, exchange opportunities and grow together.",
    url: "https://tbcnetwork.in",
    siteName: "TBC — Tailik Business Committee",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "TBC — Tailik Business Committee | Business Networking & Growth",
    description: "Tailik Business Committee brings business professionals and entrepreneurs together to build trusted relationships, exchange opportunities and grow together.",
  },
};

export const viewport: Viewport = {
  themeColor: "#C41E3A",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
        <PWARegister />
      </body>
    </html>
  );
}
