import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import { PostHogProvider } from '@/components/providers/PostHogProvider'
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MonyLink — Transferts Europe ↔ Afrique",
  description: "Envoie, reçois et convertis de l'argent instantanément entre l'Europe et l'Afrique. Multi-devises, Mobile Money intégré, 2× moins cher.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="fr" className={plusJakarta.variable} data-scroll-behavior="smooth">
        <body className="min-h-dvh">
          <PostHogProvider>
            {children}
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
