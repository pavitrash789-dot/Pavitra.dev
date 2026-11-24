import Hero from "@/components/Hero";
import QuoteBuilder from "@/components/QuoteBuilder";
import { Nav, Services, Portfolio, How, About, Contact, WhatsAppFloat } from "@/components/Sections";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-chalk text-ink">
      <Nav />
      <Hero />
      <QuoteBuilder />
      <Portfolio />
      <Services />
      <How />
      <About />
      <Contact />
      <WhatsAppFloat />
    </main>
  );
}
