import type { Metadata } from "next";
import "./globals.css";
import { DraftProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Pavitra Sharma — Freelance Web Developer in Kota, Rajasthan",
  description:
    "Practical websites that bring real customers to your business. Clear pricing, reliable timelines, and direct support on WhatsApp from Kota, Rajasthan.",
  openGraph: {
    title: "Pavitra Sharma — Freelance Web Developer in Kota, Rajasthan",
    description:
      "Practical websites that bring real customers to your business. Clear pricing, reliable timelines, and direct support on WhatsApp from Kota, Rajasthan.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Pavitra Sharma — Freelance Web Developer in Kota, Rajasthan",
    description:
      "Practical websites that bring real customers to your business. Clear pricing, reliable timelines, and direct support on WhatsApp from Kota, Rajasthan.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=gambetta@400,500,600,700,401,501,601,701&f[]=switzer@400,500,600,700,401,501,601,701&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400;1,6..72,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-chalk text-ink antialiased min-h-screen">
        <DraftProvider>{children}</DraftProvider>
      </body>
    </html>
  );
}
