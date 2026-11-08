# Design System Master File

> **LOCKED:** Fraunces + Outfit · forest mint. Do not drift to blue/slate or alternate font stacks.

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** FinSight  
**Category:** Personal Finance Tracker  
**Atmosphere:** Cool forest-ledger dark dashboard with mint data accents

---

## Global Rules

### Color Palette (forest mint)

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Background | `#0F1714` | `--bg` |
| Surface | `#18241F` | `--surface` |
| Panel | `#1F2E28` | `--panel` |
| Mint (accent) | `#2EC4A0` | `--mint` |
| Mint dim | `#1A8F74` | `--mint-dim` |
| Ink | `#E8F2ED` | `--ink` |
| Muted | `#8AA99A` | `--muted` |
| Warn | `#E8A317` | `--warn` |
| Loss | `#E85D4C` | `--loss` |
| Grid | `rgba(46,196,160,0.08)` | `--grid` |
| Line | `rgba(46,196,160,0.16)` | `--line` |

**Color Notes:** Deep forest charcoal + mint ledger accents — not blue/slate SaaS.

### Typography

- **Display / Brand:** Fraunces (via `next/font/google`, CSS `--font-fraunces` / `--font-display`)
- **UI / Body:** Outfit (via `next/font/google`, CSS `--font-outfit` / `--font-ui`)
- **Mood:** calm ledger, clarity, nature-tech finance
- **Google Fonts:** [Fraunces + Outfit](https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;600;700&family=Outfit:wght@400;500;600;700&display=swap)

```tsx
import { Fraunces, Outfit } from "next/font/google";
// Fraunces → --font-fraunces, Outfit → --font-outfit
```

### Spacing & Radius

| Token | Value | Usage |
|------|-------|-------|
| `--radius` | `16px` | Panels, controls |
| Shell padding | `1.25rem`–`2rem` | Page shell |
| Section gap | `1.25rem`–`1.75rem` | Dashboard stack |

### Shadow

| Level | Value |
|------|-------|
| `--shadow` | `0 18px 40px rgba(0, 0, 0, 0.28)` |

---

## Component Specs

### Primary button

```css
.fs-btn {
  background: var(--mint);
  color: #04110c;
  border-radius: 999px;
  font-family: var(--font-ui), "Outfit", sans-serif;
  font-weight: 600;
}
```

### Panels

```css
.fs-panel {
  background: color-mix(in srgb, var(--panel) 92%, transparent);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
```

### Brand

```css
.fs-brand {
  font-family: var(--font-display), "Fraunces", Georgia, serif;
}
.fs-brand span {
  color: var(--mint);
}
```

---

## Style Guidelines

**Style:** Forest-ledger dark UI (not glassmorphism-first, not blue SaaS)

**Keywords:** forest, mint, ledger, calm data, diagonal hatch, soft gradient mesh

**Hero / first viewport:** Brand-first FinSight mark + name, one lede, one CTA — no card grids in hero/login.

### Motion

- Soft rise / fade on shell load (`fs-rise`)
- KPI count-up
- Respect `prefers-reduced-motion`

---

## Anti-Patterns (Do NOT Use)

- ❌ Blue/indigo primary or slate `#0F172A` “trust blue” palettes
- ❌ Fira Code / Fira Sans / Inter / Roboto / system UI stacks as brand fonts
- ❌ Purple-on-white or terracotta-on-cream AI defaults
- ❌ Emojis as icons
- ❌ Flat single-color backgrounds without atmosphere (hatch/mesh)

---

## Pre-Delivery Checklist

- [ ] Fraunces display + Outfit UI wired via `next/font`
- [ ] Tokens match `--bg / --surface / --panel / --mint / --ink / --muted`
- [ ] Brand mark present; mint accent on brand span
- [ ] Charts/KPIs use mint / warn / loss tokens
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
