import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Wizard from "@/components/Wizard";
import { Nav, Services, Portfolio, How, Contact, WhatsAppFloat } from "@/components/Sections";
import BackgroundMesh3D from "@/components/3d/BackgroundMesh3D";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* 3D Wireframe Floating Background Scene */}
      <BackgroundMesh3D />

      {/* Main Content Layer */}
      <div className="relative z-10">
        <Nav />
        <Hero />
        <Categories />
        <Wizard />
        <Services />
        <Portfolio />
        <How />
        <Contact />
        <WhatsAppFloat />
      </div>
    </main>
  );
}
