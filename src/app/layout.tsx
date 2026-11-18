import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { DraftProvider } from "@/lib/store";
const sans = Inter({ subsets:["latin"], variable:"--font-sans" });
const display = Space_Grotesk({ subsets:["latin"], variable:"--font-display" });
export const metadata: Metadata = {
  title:"Create Your Idea of a Website with My Skills | Pavitra Sharma",
  description:"Freelance website development: portfolios, e-commerce, business sites and custom web apps. Choose your website, customize it and I'll build it.",
  openGraph:{ title:"Create Your Idea of a Website with My Skills", description:"You imagine it. You choose it. I'll build it.", type:"website" } };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${sans.variable} ${display.variable}`}><body><DraftProvider>{children}</DraftProvider></body></html>;
}
