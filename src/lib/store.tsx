"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
export type Draft = { category:string; purpose:string; design:string; pages:string[]; features:string[]; name:string; business:string; email:string; whatsapp:string; description:string; reference_url:string; budget:string; timeline:string; step:number };
export const empty: Draft = { category:"", purpose:"", design:"", pages:[], features:[], name:"", business:"", email:"", whatsapp:"", description:"", reference_url:"", budget:"", timeline:"", step:0 };
type Ctx = { d:Draft; set:(p:Partial<Draft>)=>void; reset:()=>void };
const C = createContext<Ctx>({ d:empty, set:()=>{}, reset:()=>{} });
export const useDraft = () => useContext(C);
export function DraftProvider({ children }: { children: ReactNode }) {
  const [d, setD] = useState<Draft>(empty); const [ready, setReady] = useState(false);
  useEffect(() => { try { const s = localStorage.getItem("draft"); if (s) setD({ ...empty, ...JSON.parse(s) }); } catch {} setReady(true); }, []);
  useEffect(() => { if (ready) try { localStorage.setItem("draft", JSON.stringify(d)); } catch {} }, [d, ready]);
  return <C.Provider value={{ d, set:p=>setD(o=>({ ...o, ...p })), reset:()=>setD(empty) }}>{children}</C.Provider>;
}
