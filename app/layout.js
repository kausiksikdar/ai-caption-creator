import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Caption Generator",
  description: "Generate AI-powered captions effortlessly!",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
        <Navbar />
      <html lang="en">
        <body className="bg-gray-100 text-gray-900">{children}</body>
      </html>
    </ClerkProvider>
  );
}
