import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f97316",
};

export const metadata: Metadata = {
  title: {
    default: "CouponWala - Discover Amazing Deals & Discount Coupons",
    template: "%s | CouponWala",
  },
  description:
    "Find and purchase discount offers for your favorite services. Save up to 70% on streaming, music, shopping, and more with verified coupon codes.",
  keywords: [
    "coupons",
    "discount deals",
    "offer codes",
    "save money",
    "streaming subscriptions",
    "Amazon deals",
    "Netflix discounts",
    "coupon codes India",
    "best deals",
    "online shopping discounts",
  ],
  authors: [{ name: "CouponWala" }],
  creator: "CouponWala",
  publisher: "CouponWala",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://couponwala.com",
    siteName: "CouponWala",
    title: "CouponWala - Discover Amazing Deals & Discount Coupons",
    description:
      "Find and purchase discount offers for your favorite services. Save up to 70% on streaming, music, shopping, and more.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CouponWala - Save Money on Your Favorite Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@couponwala",
    creator: "@couponwala",
    title: "CouponWala - Discover Amazing Deals & Discount Coupons",
    description:
      "Find and purchase discount offers for your favorite services. Save up to 70%!",
    images: ["/og-image.jpg"],
  },
  facebook: {
    appId: "123456789",
  },
  alternates: {
    canonical: "https://couponwala.com",
  },
  category: "Shopping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f97316" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
