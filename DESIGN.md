# Design System

<!-- impeccable:design-schema 1 -->

## Design Thesis

A calm, restrained editorial aesthetic inspired by traditional craft and signal studios (such as signal-a.studio). The interface avoids all AI tropes: no purple/cyan neon gradients, no glow effects, no glassmorphism, no uniform rounded cards, no hero metric badges. It is human-crafted, flat, grounded in warm natural tones from Kota stone and chalk, with decisive typography and deliberate whitespace.

## Mode

Persuade & Experience: A freelance development studio where the work, the clarity of pricing, and personal trust earn the visitor's decision.

## Color Tokens (Flat, No Gradients, No Glows)

| Token | Hex | Role | Contrast Notes |
|---|---|---|---|
| `bg-chalk` | `#F5F6F2` | Page background, canvas base | Primary light background |
| `panel-stone` | `#D9DED7` | Surface panels, borders, subtle dividers | Subtle warm structure |
| `text-ink` | `#17201B` | Primary headings, body copy, active text | 14.8:1 contrast on Chalk (AAA) |
| `text-slate` | `#2C4036` | Secondary text, captions, metadata, footer bg | 8.2:1 contrast on Chalk (AAA) |
| `accent-indigo`| `#2D3DA0` | Links, primary CTA buttons, focus indicator | 7.9:1 contrast on Chalk (AAA) |
| `white` | `#FFFFFF` | Form field background, active quote builder sheet | Clean elevated surface |
| `whatsapp-green`| `#25D366` | Floating WhatsApp contact icon | Standard WhatsApp branding |

## Typography Tokens

### Type Families
- **Headings & Display**: `Gambetta`, serif (Fontshare). Fallback: `Newsreader`, `Georgia`, `serif`.
- **Body & UI**: `Switzer`, sans-serif (Fontshare). Fallback: `Hanken Grotesk`, `system-ui`, `-apple-system`, `sans-serif`.
- **Prohibited**: Inter, Space Grotesk, Playfair, Fraunces, system default sans for display.

### Modular Scale (Minor Third / Major Second Hybrid, 1.25 / 1.125)
- **Display 1 (Hero)**: `clamp(2.5rem, 5vw + 1rem, 4.25rem)` (40px - 68px), `line-height: 1.08`, tracking `-0.025em`, serif.
- **Heading 1 (Section titles)**: `clamp(2rem, 3.5vw + 0.5rem, 3rem)` (32px - 48px), `line-height: 1.15`, tracking `-0.02em`, serif.
- **Heading 2 (Subsections, rows)**: `1.375rem` (22px), `line-height: 1.3`, font-weight `600`, sans-serif or serif.
- **Heading 3 (Card / Item titles)**: `1.125rem` (18px), `line-height: 1.35`, font-weight `600`, sans-serif.
- **Body Regular**: `1.0625rem` (17px) on mobile, `1.125rem` (18px) on desktop, `line-height: 1.65`, sans-serif.
- **Body Small / Meta**: `0.875rem` (14px), `line-height: 1.5`, sans-serif.
- **Caption / Micro**: `0.75rem` (12px), `line-height: 1.4`, tracking `0.02em`, sans-serif.

### Measure & Rhythm
- Maximum line length for prose: `65ch` (~65 characters).
- Headings: `text-wrap: balance`.
- Body copy: `text-wrap: pretty`.
- Tabular numerals: `font-variant-numeric: tabular-nums` for all pricing amounts and live clocks.

## Spacing & Container System

- **Container Max-Width**: `1200px` (`max-w-6xl`) with fluid horizontal padding (`px-5` on mobile, `px-8` to `px-12` on desktop).
- **Vertical Spacing Scale**:
  - Section padding: `py-16` on mobile, `py-24` on desktop.
  - Heading to body: `mb-4` to `mb-6`.
  - Group to group: `gap-8` to `gap-12`.
- **Asymmetric Left Alignment**:
  - All headlines and section intros align strictly to the left margin.
  - No centered marketing paragraphs.

## Radii & Elevation Strategy

- Vary border radius by purpose; avoid identical rounded pills everywhere:
  - **Inputs & Controls**: `rounded-md` (6px) or `rounded-lg` (8px).
  - **Panels & Dividers**: `rounded-none` or `rounded-sm` (clean architectural lines).
  - **Quote Builder Active Container**: `rounded-xl` (12px) with subtle 1px Kota Stone border (`border-[#D9DED7]`).
  - **Primary Buttons**: `rounded-full` (for distinct tactile clickability).
  - **Floating WhatsApp**: `rounded-full` (48px circle, quiet and restrained).
- **Shadows**: Restrained. Flat borders (`1px solid #D9DED7`) instead of artificial blur halos. No 40px neon glow boxes.

## Motion & Interaction

- **Page-Load Reveal**: Single orchestrated entrance for the hero headline on initial mount.
- **Zero Scroll Triggers**: No fade-in-on-scroll on every paragraph or card.
- **Interactive Response Only**:
  - Quote builder total updates with smooth numeric transitions.
  - Hover states on Work index reveal focused project details/preview.
  - Active buttons provide immediate tactile feedback (`active:scale-[0.99]`).
- **Prefers-Reduced-Motion**: All animations disabled when `prefers-reduced-motion` is active.

## Browser Surfaces

- Selection: `::selection { background: #D9DED7; color: #17201B; }`
- Focus: `:focus-visible { outline: 2px solid #2D3DA0; outline-offset: 2px; }`
- Scrollbar: Minimal stone tint, no bright gradients.
