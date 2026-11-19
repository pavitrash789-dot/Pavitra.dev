import type { Metadata } from "next";
import "./globals.css";
import { DraftProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Create Your Idea of a Website with My Skills | Pavitra Sharma",
  description:
    "Freelance website development: portfolios, e-commerce, business sites and custom web apps. Choose your website, customize it and I'll build it.",
  openGraph: {
    title: "Create Your Idea of a Website with My Skills",
    description: "You imagine it. You choose it. I'll build it.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <DraftProvider>{children}</DraftProvider>
      </body>
    </html>
  );
}
