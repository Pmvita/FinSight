import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const ui = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FinSight — Personal finance clarity",
  description:
    "Forest-ledger personal finance dashboard for balances, spending breakdowns, and cashflow.",
  icons: {
    icon: "/finsight-mark.jpg",
    apple: "/finsight-mark.jpg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${ui.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
