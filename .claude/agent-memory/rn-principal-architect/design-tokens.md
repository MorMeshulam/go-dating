---
name: design-tokens
description: Complete design token reference for colors, spacing, radii, typeScale, shadows; dark mode only
metadata:
  type: project
---

All tokens in `src/theme/index.ts`. Dark mode only — no light mode support.

**Key colors:**
- background: #08131D (deep navy)
- surface: #13293A (card background)
- surfaceStrong: #17374A (secondary button bg, stat cards)
- accent: #FF8B67 (coral orange — primary CTA, selected chips, progress fill)
- mint: #7BE0C5 (eyebrows, indicators)
- gold: #FFD27D (helper text, notes)
- text: #F6F8FB | textMuted: #A9C2D0 | textSoft: #DCE8EE
- input: #0A1B28 | border: rgba(255,255,255,0.10) | overlay: rgba(6,12,18,0.72)

**typeScale:** overline:11, caption:12, body:15, subtitle:18, title:24, hero:34

**spacing:** xs:6, sm:10, md:16, lg:24, xl:32, xxl:48

**radii:** sm:14, md:22, lg:30, xl:40, pill:999

**shadows:** Platform.select — iOS: shadowColor #000, opacity 0.25, radius 20, offset {0,10}; Android: elevation 8

**AppBackground:** Three orb `View`s (accent 20%, mint 13%, gold 10% opacity) + dark overlay at rgba(8,19,29,0.58). Not animated — pure View.

**How to apply:** Always import from `src/theme`, never hardcode color values. Use spreading `...shadows` from theme on card components.
