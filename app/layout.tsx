import type { Metadata } from "next";
import { Baloo_2, Quicksand, Patrick_Hand } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-baloo",
  weight: ["400", "500", "600", "700"],
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: ["300", "400", "500", "600"],
});

const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  variable: "--font-patrick",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Happy Birthday Zia! 🎂",
  description: "A special birthday scrapbook celebration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${baloo.variable} ${quicksand.variable} ${patrickHand.variable}`}>
      <body>{children}</body>
    </html>
  );
}
