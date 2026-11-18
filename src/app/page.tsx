import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Wizard from "@/components/Wizard";
import { Nav, Services, Portfolio, How, Contact, WhatsAppFloat } from "@/components/Sections";
export default function Home() {
  return <main><Nav /><Hero /><Categories /><Wizard /><Services /><Portfolio /><How /><Contact /><WhatsAppFloat /></main>;
}
