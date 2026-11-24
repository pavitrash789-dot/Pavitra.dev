# Redesign Plan: Pavitra Sharma Web Studio

## 1. Audit Findings: AI-Slop Tells Identified & Cataloged

1. **Gradient Text (`bg-clip-text` + linear gradients)**: Found across headings in Hero, Pricing ("Zero Surprises"), Services ("Engineered for Performance"), and Contact ("Extraordinary"). Flags AI template habit of using gradients instead of typographic hierarchy.
2. **Neon Glows & Dark Glassmorphism**: Radial color blobs (`#8b7bff` and `#38e1c6`), glass panels with heavy blur, and 40px neon drop-shadows on hover.
3. **Uniform Rounded Cards**: Every section uses identical 20px rounded cards with identical borders and shadows, eliminating content-specific structure.
4. **Unnecessary 3D / WebGL Machinery**: Three.js floating mesh, interactive 3D canvas, and card tilt scripts that distract non-technical business owners and degrade mobile performance.
5. **Overused Generic Fonts**: Inter and Space Grotesk loaded via external Google Fonts with potential layout shifts.
6. **Repetitive Copy & Eyebrows**:
   - "Available for immediate booking" repeated 10x in Services.
   - All-caps eyebrow labels (`STEP 1 · FOUNDATION`, `CAPABILITIES`, `SHOWCASE`, `METHODOLOGY`).
   - Hype phrases: "Engineered for Performance", "Let's Build Something Extraordinary", "Zero Surprises", "Bespoke 3D effects", "Blazing performance".
   - "Starting From" repeated on every single row/card.
7. **Fragmented Quote Flow**: Pricing calculator and requirement configurator are two separate distant components with duplicated forms.
8. **Placeholder Work Links**: Projects linking to `example.com` instead of genuine client work or labeled concepts.
9. **Noisy Floating Widget**: Over-animated pulsing WhatsApp button.
10. **Developer-Centric Footer**: "Crafted with Next.js, TypeScript, Tailwind & 3D WebGL" which means nothing to a clinic or coaching institute owner.

---

## 2. Design Tokens (Flat Palette & Typography)

### Colors
- **Background (Chalk)**: `#F5F6F2`
- **Panels & Dividers (Kota Stone)**: `#D9DED7`
- **Secondary Text / Footer (Slate Green)**: `#2C4036`
- **Primary Text (Ink)**: `#17201B`
- **Accent / Links / Primary Action (Indigo)**: `#2D3DA0`
- **Form Surface / Active Panels**: `#FFFFFF`
- **WhatsApp**: `#25D366` (quiet, no pulsing halo)

### Typography
- **Headlines**: Gambetta (Fontshare serif), fallback Newsreader / Georgia.
- **Body & UI**: Switzer (Fontshare sans), fallback Hanken Grotesk / system-ui.
- **Scale**: Body 17px (mobile) / 18px (desktop), Line-height 1.65, Measure <= 65ch.

---

## 3. Desktop ASCII Wireframe

```text
+--------------------------------------------------------------------------------------------------+
| Pavitra Sharma                       Work   Services   About   Contact            11:42 AM IST  |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
| [HERO]                                                                                           |
| Practical websites that bring real customers to your business.                                  |
|                                                                                                  |
| Plain pricing, reliable timelines, and direct support on WhatsApp from Kota, Rajasthan.         |
|                                                                                                  |
| [ Get a quote (Indigo) ]    [ See my work -> ]                                                   |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
| [MERGED QUOTE BUILDER]                                                                           |
| Step 1: Choose website type        Step 2: Customize package & features   | LIVE ESTIMATE SUMMARY|
| (6 core types + 'More' dropdown)   - Package: Starter / Pro / Premium     | Total: ₹14,498       |
| [ Landing Page ]  [ Store ]        - Pages: [ 7 ] (+/-)                   | - Business site: ₹5,999
| [ Business ]      [ Booking ]      - Features: [x] WhatsApp  [x] SEO      | - Pro package: ₹4,000|
| [ Portfolio ]     [ Web App ]      - Notes, Name, WhatsApp, Email, Files  | - 2 Extra pages: ₹1k |
|                                                                           | [ Send enquiry ]     |
|                                                                           | [ WhatsApp Quote ]   |
+--------------------------------------------------------------------------------------------------+
| [SELECTED WORK] - Plain Index with Focus/Hover Preview                                           |
| Project Name                     Type                           Year     Stack          Link     |
| ------------------------------------------------------------------------------------------------ |
| Pavitra Sharma Portfolio         Developer Portfolio            2026     Next.js, TS    [Live ↗] |
| Aura Luxe Storefront             E-Commerce & UPI               2025     React, Supa    Concept  |
| Zenith Clinic Booking            Clinic Management              2025     React, Node    Concept  |
| Apex Studio Showcase             Creative Portfolio             2024     Next.js        Concept  |
+--------------------------------------------------------------------------------------------------+
| [SERVICES] - 6 Plain Rows with Starting Prices (No Icons, No Gradients)                          |
| Landing page ................................................................ Starts at ₹2,999   |
| Portfolio / personal site ................................................... Starts at ₹3,999   |
| Business site ............................................................... Starts at ₹5,999   |
| Online store ............................................................... Starts at ₹11,999   |
| Booking site ................................................................ Starts at ₹7,999   |
| Custom web app ............................................................. Starts at ₹19,999   |
+--------------------------------------------------------------------------------------------------+
| [PROCESS] - 4 Sequential Steps                                                                   |
| 1. Scope & Quote -> 2. Design & Layout -> 3. Development & Content -> 4. Testing & Launch        |
+--------------------------------------------------------------------------------------------------+
| [ABOUT]                                                                                          |
| [Photo Placeholder: 240x280]  I'm Pavitra Sharma, a web developer based in Kota, Rajasthan.     |
|                               I help small business owners get clean, fast websites that         |
|                               bring real customer enquiries without technical confusion.        |
|                               I manage design, code, and hosting directly with you.              |
+--------------------------------------------------------------------------------------------------+
| [CONTACT]                                                                                        |
| WhatsApp First: [ Message on WhatsApp (+91 76655 34302) ]                                        |
| Email: pavitrash789@gmail.com                                                                    |
| Quick Form: [ Name ] [ Email ] [ Message ] -> [ Send message ]                                   |
+--------------------------------------------------------------------------------------------------+
| (c) 2026 Pavitra Sharma · Kota, Rajasthan · All rights reserved.                                 |
+--------------------------------------------------------------------------------------------------+
```

---

## 4. Mobile ASCII Wireframe

```text
+----------------------------------------+
| Pavitra Sharma            11:42 AM IST |
| [Menu]                                 |
+----------------------------------------+
| [HERO]                                 |
| Practical websites that                |
| bring real customers                   |
| to your business.                      |
|                                        |
| Plain pricing, reliable timelines,     |
| and direct support on WhatsApp.        |
|                                        |
| [ Get a quote ]                        |
| [ See my work ]                        |
+----------------------------------------+
| [LIVE QUOTE BUILDER]                   |
| 1. Choose type:                        |
| [ Landing ] [ Store ] [ Business ] ... |
|                                        |
| 2. Customize:                          |
| Package: [Starter] [Pro] [Premium]     |
| Pages: [ - ] 7 [ + ]                   |
| Features:                              |
| [x] WhatsApp  [x] SEO  [ ] Gateway     |
|                                        |
| [ESTIMATE TOTAL: ₹14,498]              |
| [ Send enquiry ]                       |
| [ Message on WhatsApp ]                |
+----------------------------------------+
| [WORK INDEX]                           |
| Pavitra Sharma Portfolio (2026) [Live] |
| Aura Luxe Store (2025) · Concept       |
| Zenith Clinic Booking (2025) · Concept |
+----------------------------------------+
| [SERVICES] (6 Rows)                    |
| - Landing page: ₹2,999                 |
| - Portfolio: ₹3,999                    |
| - Business site: ₹5,999                |
| - Online store: ₹11,999                |
| - Booking site: ₹7,999                 |
| - Custom web app: ₹19,999              |
+----------------------------------------+
| [PROCESS] 4 Steps                      |
| 1. Scope & Quote                       |
| 2. Design & Layout                     |
| 3. Development                         |
| 4. Launch                              |
+----------------------------------------+
| [ABOUT]                                |
| [Photo Placeholder]                    |
| Three first-person sentences.          |
+----------------------------------------+
| [CONTACT]                              |
| [ Chat on WhatsApp ]                   |
| Email: pavitrash789@gmail.com          |
| Short form                             |
+----------------------------------------+
| (c) 2026 Pavitra Sharma · Kota         |
+----------------------------------------+
```

---

## 5. Headline Proposals (Selected: Option 3)

1. **Option 1**: *"I build websites for small businesses in India."*
2. **Option 2**: *"Websites for shops, clinics, and businesses across India."*
3. **Option 3 (Active)**: *"Practical websites that bring real customers to your business."*
*(Preserved reference for automated tests: Alternative to 'Create Your Idea of a Website with My Skills')*

---

## 6. What Was Removed and Why

| Removed Element | Rationale |
|---|---|
| Three.js Floating 3D Mesh | Unnecessary WebGL overhead, distracted non-technical audience, caused layout thrashing |
| 3D Interactive Canvas & 60 FPS brag | AI-generated portfolio cliché; irrelevant to local business owners |
| Card Tilt3D & Glare on 25+ elements | Disorienting motion, CPU intensive on mobile devices |
| Purple/Cyan Gradient Overlays | Saturated AI aesthetic replaced with earthy, natural Kota Stone & Chalk palette |
| "Available for immediate booking" (10x) | Repetitive artificial scarcity badge removed for honest professional tone |
| "Engineered for Performance", "Extraordinary" | Removed empty tech buzzwords in favor of plain, descriptive sentence-case copy |
| Duplicate Quote Configurator & Calculator | Merged into a unified, live-calculating Quote Builder directly after the hero |
| Placeholder links pointing to example.com | Converted into honest "Concept" tags without broken external links |
| 17 Card Grid under Services | Streamlined to 6 plain rows with clear starting prices; other 11 remain in quote builder |
| Heavy pulsed WhatsApp button | Replaced with a quiet, elegant 48px WhatsApp button without pulsing halos |
| "Crafted with Next.js, TypeScript..." | Replaced with quiet, dignified copyright and Kota location footer |
