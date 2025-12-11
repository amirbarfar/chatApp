import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "اپلیکیشن چت",
  description: "اپلیکیشن چت بلادرنگ برای گروه‌ها",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body dir="rtl" className="font-modam">
        {children}
      </body>
    </html>
  );
}
