import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PostHogProvider } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E5 Elevator | M365 E5 Business Case Generator",
  description:
    "Generate board-ready business cases for upgrading from Microsoft 365 E3 to E5. AI-powered risk analysis, breach case studies, TCO comparison, and ROI projections with source citations.",
  keywords: [
    "Microsoft 365 E5",
    "E3 to E5 upgrade",
    "business case generator",
    "M365 E5 ROI",
    "security business case",
    "board presentation",
  ],
  openGraph: {
    title: "E5 Elevator | M365 E5 Business Case Generator",
    description:
      "Generate board-ready business cases for upgrading from Microsoft 365 E3 to E5.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
