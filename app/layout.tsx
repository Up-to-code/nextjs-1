import type { Metadata } from "next";
import "./globals.css";
import { Cairo } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from './providers';

// Optimized Arabic font configuration
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: '--font-cairo',
  display: 'swap',
  preload: true,
  weight: ['300', '400', '500', '600', '700', '800'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: "أثاث بلس - منصة الشركاء",
    template: "%s | أثاث بلس"
  },
  description: "منصة متكاملة لبيع الأثاث بأفضل الأسعار والجودة العالية. انضم إلى شركائنا ووسع أعمالك في تجارة الأثاث.",
  keywords: [
    "أثاث",
    "منصة شركاء",
    "أثاث بلس",
    "أثاث منزلي",
    "ديكور",
    "أثاث مكتبي",
    "أثاث غرف نوم",
    "أثاث معيشة",
    "شركاء أثاث",
    "بيع أثاث",
    "تجارة الأثاث"
  ],
  authors: [{ name: "أثاث بلس", url: "https://example.com" }],
  creator: "أثاث بلس",
  publisher: "أثاث بلس",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL('https://example.com'), // Replace with your actual URL
  alternates: {
    canonical: '/',
    languages: {
      'ar': '/',
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://example.com",
    title: "أثاث بلس - منصة الشركاء",
    description: "منصة متكاملة لبيع الأثاث بأفضل الأسعار والجودة العالية",
    siteName: "أثاث بلس",
    images: [
      {
        url: '/og-image.png', // Add your OG image
        width: 1200,
        height: 630,
        alt: 'أثاث بلس - منصة الشركاء',
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "أثاث بلس - منصة الشركاء",
    description: "منصة متكاملة لبيع الأثاث",
    images: ['/twitter-image.png'], // Add your Twitter image
    creator: "@furnitureplus",
  },
  verification: {
    // google: 'your-google-verification-code', // Add when available
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  category: "furniture",
  other: {
    'ar:country': 'SA',
    'ar:city': 'الرياض',
    'ar:currency': 'SAR',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Mobile Meta */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="أثاث بلس" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Charset */}
        <meta charSet="utf-8" />

        {/* Additional SEO for Arabic */}
        <meta name="geo.region" content="SA" />
        <meta name="geo.placename" content="Riyadh, Saudi Arabia" />
        <meta name="geo.position" content="24.7136;46.6753" />
        <meta name="ICBM" content="24.7136, 46.6753" />
      </head>
      <body className={`font-sans antialiased bg-background text-foreground min-h-screen`}>
        <Providers>{children}</Providers>
        <Toaster
          position="top-center"
          richColors
          closeButton
          duration={4000}
          expand={true}
        />
      </body>
    </html>
  );
}