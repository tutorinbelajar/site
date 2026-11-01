import TrafficTracker from "@/components/TrafficTracker";
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Tutorin — Privat, Kelas, Ebook & Tryout",
  description: "Tutorin menyediakan empat kategori layanan: Privat, Kelas, Ebook, dan Tryout untuk membantu orangtua dan murid menemukan pendampingan belajar yang tepat.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body><TrafficTracker /><Header /><main>{children}</main><Footer /></body></html>;
}
