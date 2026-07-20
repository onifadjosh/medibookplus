---
name: Clinical Precision
colors:
  surface: '#f6faf9'
  surface-dim: '#d6dbda'
  surface-bright: '#f6faf9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f5f4'
  surface-container: '#eaefee'
  surface-container-high: '#e4e9e8'
  surface-container-highest: '#dfe3e3'
  on-surface: '#171d1c'
  on-surface-variant: '#3d4949'
  inverse-surface: '#2c3131'
  inverse-on-surface: '#edf2f1'
  outline: '#6d7979'
  outline-variant: '#bcc9c8'
  surface-tint: '#006a6a'
  primary: '#006767'
  on-primary: '#ffffff'
  primary-container: '#008282'
  on-primary-container: '#f3fffe'
  inverse-primary: '#6ad7d7'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#8f491d'
  on-tertiary: '#ffffff'
  tertiary-container: '#ad6033'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#88f4f3'
  primary-fixed-dim: '#6ad7d7'
  on-primary-fixed: '#002020'
  on-primary-fixed-variant: '#004f4f'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbca'
  tertiary-fixed-dim: '#ffb68f'
  on-tertiary-fixed: '#331100'
  on-tertiary-fixed-variant: '#743408'
  background: '#f6faf9'
  on-background: '#171d1c'
  surface-variant: '#dfe3e3'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
The design system is engineered for a high-end Healthcare SaaS environment where trust, clarity, and efficiency are paramount. The brand personality is professional yet approachable, eliminating the coldness of traditional medical software through a refined, modern aesthetic.

The style leverages **Minimalism** with a **Corporate/Modern** influence. It prioritizes high legibility and intentional whitespace to reduce cognitive load for healthcare professionals. The interface utilizes soft, diffused lighting and a high-clarity layout to evoke an emotional response of calm reliability and technological sophistication. Visual clutter is ruthlessly minimized to ensure that critical patient data remains the focal point.

## Colors
The palette is rooted in a clinical Teal (`#069494`), chosen for its association with health, hygiene, and modern technology. 

- **Primary:** Used for key actions, active states, and brand recognition.
- **Neutral:** A sophisticated range of cool grays (derived from Slate) maintains a professional tone without the harshness of pure black.
- **Background/Surface:** A layered approach using `#F8FAFC` for the canvas and pure white for interactive cards to create a subtle sense of depth.
- **Functional Colors:** Emerald, Amber, and Red are reserved strictly for status communication (Success, Warning, Danger) to ensure high-glanceability in high-stakes environments.

## Typography
This design system utilizes **Inter** exclusively to take advantage of its exceptional legibility and systematic design. 

The type scale is optimized for data-dense environments. Headlines use a slightly tighter letter-spacing for a modern "ink-trap" look, while labels and small body text utilize increased tracking to ensure readability on low-resolution medical monitors. Use `label-sm` for table headers and categories to provide clear structural hierarchy.

## Layout & Spacing
The layout follows a strict **8px base grid** to maintain mathematical harmony. 

- **Grid:** A 12-column fluid grid is used for desktop (breakpoint 1024px+), transitioning to a 4-column layout for mobile.
- **Margins:** Desktop views utilize a generous 32px side margin to breathe, while mobile narrows to 16px.
- **Spacing Rhythm:** Internal card padding should default to 24px (`lg`) to maintain a premium, spacious feel. Section spacing should utilize 48px (`2xl`) to clearly separate distinct medical data modules.

## Elevation & Depth
Elevation is achieved through a combination of **Tonal Layering** and **Ambient Shadows**. 

The design system avoids heavy borders, instead using light-diffused shadows (`color: rgba(0, 0, 0, 0.05), blur: 15px, y: 4px`) to lift surface-white cards off the `#F8FAFC` background. 

- **Level 0 (Flat):** Used for inputs and inactive states.
- **Level 1 (Low):** Used for standard data cards and table rows.
- **Level 2 (Mid):** Used for hover states and dropdown menus.
- **Level 3 (High):** Reserved for Modals and critical global notifications. These include a backdrop blur (12px) to focus the user's attention.

## Shapes
The shape language is defined by a consistent **16px (1rem) radius** for primary containers and cards. This substantial rounding softens the clinical environment and makes the software feel more accessible and user-friendly.

- **Standard Buttons/Inputs:** 8px radius for a balanced, functional look.
- **Cards & Modals:** 16px radius for the primary container.
- **Badges & Chips:** Fully pill-shaped (999px) to distinguish them from interactive buttons.

## Components

### Buttons & Inputs
- **Primary Button:** Solid `#069494` with white text. Substantial horizontal padding (24px).
- **Secondary Button:** Ghost style with a subtle gray border or light teal tint background.
- **Inputs:** White surface with a 1px border in a light gray. Focus state uses a 2px teal ring with a soft glow.

### Data & Tables
- **Tables:** No vertical borders. Horizontal dividers use a soft light-gray. Header rows use `label-sm` with a light background tint.
- **Sorting/Filtering:** Use Lucide icons (`ChevronUp`, `ChevronDown`, `Filter`) at 16px size for a light, stroke-based visual.

### Navigation & Feedback
- **Calendars:** Use the primary teal for the current date and selection range. Days use a clear grid with ample whitespace.
- **Modals:** Centered with a high elevation. Close buttons are strictly positioned in the top right.
- **Badges:** Use low-saturation backgrounds of the functional colors (e.g., light emerald background with dark emerald text) to indicate status without overpowering the content.

### Visual Elements
- **Charts:** Use a clean, sans-serif labeling system. Data lines should be thick (2px-3px) with soft curves rather than sharp angles.
- **Icons:** Lucide icons with a 1.5px or 2px stroke weight to match the Inter font's visual weight.