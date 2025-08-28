import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { FontSizeProvider } from "@/contexts/FontSizeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Uyghurly - Learn Uyghur Language",
  description: "Learn the Uyghur language through interactive lessons",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark:bg-gray-900">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        <FontSizeProvider>
          <ThemeProvider>
            <AuthProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
            </AuthProvider>
          </ThemeProvider>
        </FontSizeProvider>
      </body>
    </html>
  );
}
