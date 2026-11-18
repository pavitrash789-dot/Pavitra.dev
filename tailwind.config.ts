import type { Config } from "tailwindcss";
export default { content:["./src/**/*.{ts,tsx}"], theme:{extend:{fontFamily:{display:["var(--font-display)"],sans:["var(--font-sans)"]},colors:{brand:{DEFAULT:"#8b7bff",2:"#38e1c6"}}}}, plugins:[] } satisfies Config;
