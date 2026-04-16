# Chemico Compliance Copilot — Style Guide

Last updated: 2026-04-15

## Brand Colors

Derived from The Chemico Group's official website (thechemicogroup.com).

### Palette

| Name | Hex | Usage |
|---|---|---|
| Brand Blue (Primary) | `#0071BC` | Sidebar, headings, buttons, nav, primary actions |
| Teal (Accent) | `#00B2A9` | Active states, links, badges, highlights |
| White | `#FFFFFF` | Page backgrounds, cards |
| Light Gray | `#F4F4F4` | Subtle section backgrounds, table stripes |
| Near Black | `#111111` | Primary body text |
| Mid Gray | `#808080` | Secondary labels, muted text |
| Critical Red | `#DC2626` | Critical alerts, error states |
| Warning Amber | `#D97706` | Warning alerts |
| Info Blue | `#2563EB` | Info alerts, neutral badges |
| Success Green | `#16A34A` | Compliant status, success states |

### Tailwind CSS Variable Mapping (`globals.css`)

```css
:root {
  --background: 0 0% 100%;
  --foreground: 215 28% 17%;         /* Dark Gray #1F2937 */

  --primary: 211 72% 15%;            /* Navy #0A2342 */
  --primary-foreground: 0 0% 100%;

  --accent: 178 100% 35%;            /* Teal #00B2A9 */
  --accent-foreground: 0 0% 100%;

  --muted: 210 17% 95%;              /* Light Gray #F4F6F8 */
  --muted-foreground: 220 9% 46%;    /* Mid Gray #6B7280 */

  --card: 0 0% 100%;
  --card-foreground: 215 28% 17%;

  --border: 220 13% 91%;
  --input: 220 13% 91%;
  --ring: 178 100% 35%;              /* Teal for focus rings */

  --destructive: 0 72% 51%;          /* Critical Red #DC2626 */
  --destructive-foreground: 0 0% 100%;

  --radius: 0.5rem;
}
```

## Typography

### Fonts

- **Headings:** Inter (Bold / Semi-Bold) — matches Chemico's website heavy sans-serif
- **Body:** Inter (Regular / Medium)
- Source: Google Fonts or `next/font/google`

### Scale

| Element | Class |
|---|---|
| Page title | `text-2xl font-bold text-primary` |
| Section heading | `text-xl font-semibold text-primary` |
| Card heading | `text-base font-semibold text-foreground` |
| Body text | `text-sm text-foreground` |
| Secondary / label | `text-xs text-muted-foreground` |
| Nav items | `text-sm font-medium` |

## Components (shadcn/ui only)

All UI components must be sourced from shadcn/ui. No custom components from scratch without explicit approval.

### Components to install

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add table
npx shadcn@latest add dialog
npx shadcn@latest add sheet
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add select
npx shadcn@latest add tabs
npx shadcn@latest add avatar
npx shadcn@latest add separator
npx shadcn@latest add scroll-area
npx shadcn@latest add tooltip
npx shadcn@latest add dropdown-menu
npx shadcn@latest add progress
npx shadcn@latest add skeleton
npx shadcn@latest add alert
npx shadcn@latest add sidebar
```

### Button Variants in Use

| Variant | Usage |
|---|---|
| `default` (Teal) | Primary CTAs — "Ask Copilot", "Upload Document", "Generate Report" |
| `outline` | Secondary actions — "View Details", "Export" |
| `ghost` | Nav items, icon buttons |
| `destructive` | Delete actions |

### Badge Variants for Compliance Status

| Status | Variant / Class |
|---|---|
| Compliant | `bg-green-100 text-green-700` |
| At Risk | `bg-amber-100 text-amber-700` |
| Non-Compliant | `bg-red-100 text-red-700` |
| Critical Alert | `bg-red-100 text-red-700` |
| Warning Alert | `bg-amber-100 text-amber-700` |
| Info Alert | `bg-blue-100 text-blue-700` |

## Layout

### Sidebar Navigation

- Background: Navy (`#0A2342`)
- Logo: Chemico Group logo (white or full-color version on dark bg)
- Nav item text: white, `text-sm font-medium`
- Active nav item: Teal left border + teal text
- Width: `w-64` (collapsed: `w-16`)
- Uses shadcn/ui `Sidebar` component

### Main Content Area

- Background: Light Gray (`#F4F6F8`)
- Max width: full (edge-to-edge with padding)
- Page padding: `p-6` or `p-8`

### Cards

- Background: White
- Border: `border border-border`
- Radius: `rounded-lg`
- Shadow: `shadow-sm`
- Uses shadcn/ui `Card`, `CardHeader`, `CardContent`, `CardFooter`

## Iconography

- Library: `lucide-react` (ships with shadcn/ui)
- Size: `h-4 w-4` inline, `h-5 w-5` for nav icons, `h-6 w-6` for feature icons
- Color: inherit from text class or `text-muted-foreground` for secondary icons

## Compliance Score Display

- Score 80–100: Green (`text-green-600`)
- Score 60–79: Amber (`text-amber-600`)
- Score 0–59: Red (`text-red-600`)
- Display as: large number + `/100` label + shadcn/ui `Progress` bar

## Spacing

- Section gap: `gap-6`
- Card grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4` (KPI cards)
- Form field gap: `space-y-4`

## AI Copilot Chat

- User message bubble: right-aligned, Navy background, white text, `rounded-2xl rounded-br-sm`
- Assistant message bubble: left-aligned, White background, dark text, `rounded-2xl rounded-bl-sm`, `border border-border`
- Citation markers: teal inline badge `[1]`, clickable
- Citation card: shadcn/ui `Card` below message, collapsed by default, expandable
