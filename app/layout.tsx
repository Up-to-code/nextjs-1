import type { Metadata } from "next";
import "./global.css";
import { Cairo } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import {
  ClerkProvider,

} from '@clerk/nextjs'
const font = Cairo({
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "أثاث بلس - منصة الشركاء",
  description: "منصة متكاملة لبيع الأثاث",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>

      <html lang="ar" dir="rtl">
        <body className={font.className}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
