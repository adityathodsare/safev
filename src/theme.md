# SAFEV UI Theme Upgrade & Standardization Specification

This document serves as the **Single Source of Truth** and the **UI Upgrade Plan** for the SAFEV web application. Its goal is to guide the refactoring of all pages, dashboards, and components from an inconsistent, "vibe-coded" layout into a unified, premium, dark-first dashboard experience with a switchable dark/light toggle.

---

## 1. Executive Summary & Codebase Assessment

An audit of the `src` directory reveals three main categories of styling and routing issues that degrade the user experience:
1. **Styling Inconsistency (Vibe-Coding):**
   - Several components inject local `<style>` or `<style jsx>` tags containing `@import url` to pull in third-party fonts (like *Inter*, *Syne*, and *DM Mono*) dynamically.
   - Page styling varies wildly. Some pages use deep slate backgrounds (`accidenttrack`), others use pitch-black backgrounds (`buy`, `confirmPurchase`), and some use standard grays (`logout`).
   - The **External Camera** page (`external-camera/page.jsx`) is built entirely using inline JS `style={{ ... }}` objects and hardcoded hex strings, making it impossible to apply unified themes.
   - The **GPS Tracker Map** (`track/page.tsx`) defaults to light-themed OpenStreetMap tiles, which clash severely with the surrounding dark dashboards.
2. **Broken Navigation & Routing Links:**
   - In `Navbar.tsx`, mobile links are misaligned: Clicking **"Contact Us"** redirects to `/register`, while clicking **"Register"** redirects to `/logout`.
   - Casing issues exist: The desktop navbar routes to `/Register` (capital R), whereas the directory name is lowercase `/register`. This can cause broken links on Linux-based production servers.
   - In `AuthContext.js`, logging out redirects the user to `/login`, which does not exist in the codebase.
   - In `rakshak/page.jsx`, the **"Internal Camera"** card points to `/internal-camera` which is a broken route.
3. **API Endpoint Hardcoding:**
   - Communication with the local authentication server is hardcoded to `http://localhost:8080/login` and `http://localhost:8080/sendmail`. These should be mapped to environment variables or a configuration module.

---

## 2. Core Theme Architecture

### A. Global CSS Custom Properties (`src/app/globals.css`)
We will configure Tailwind CSS v4 in `src/app/globals.css` to define our semantic colors. The theme defaults to **pitch-black dark mode** with high-contrast text and neon accent glow paths.

```css
@import "tailwindcss";

@theme {
  --color-background-dark: #000000;
  --color-background-light: #f8fafc;
  
  --color-card-dark: #090d16;
  --color-card-light: #ffffff;
  
  --color-border-dark: rgba(255, 255, 255, 0.08);
  --color-border-light: rgba(15, 23, 42, 0.08);

  --color-text-primary-dark: #f8fafc;
  --color-text-primary-light: #0f172a;
  
  --color-text-secondary-dark: #94a3b8;
  --color-text-secondary-light: #475569;

  /* Accent Glows */
  --color-accent-blue: #3b82f6;
  --color-accent-purple: #8b5cf6;
  --color-accent-pink: #ec4899;
  --color-accent-emerald: #10b981;
}

/* Base Body Styles */
body {
  transition: background-color 0.3s ease, color 0.3s ease;
  font-family: var(--font-geist-sans), sans-serif;
}

.dark body {
  background-color: var(--color-background-dark);
  color: var(--color-text-primary-dark);
}

.light body {
  background-color: var(--color-background-light);
  color: var(--color-text-primary-light);
}

/* Glassmorphism Card Utilities */
.glass-card {
  backdrop-filter: blur(16px);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark .glass-card {
  background-color: rgba(9, 13, 22, 0.6);
  border: 1px solid var(--color-border-dark);
}

.light .glass-card {
  background-color: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--color-border-light);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}
```

### B. Shared Theme State (`src/context/ThemeContext.tsx`)
Create a custom React context to manage light/dark modes. The theme defaults to `dark`.

```typescript
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
```

Apply this context wrapping in `src/app/layout.tsx` inside the existing providers list.

---

## 3. Broken Routes & Vibe-Coded Link Corrections

To ensure the website operates professionally without broken buttons, the following changes must be applied:

| Source File | Element | Current Action | Corrected Action | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| `Navbar.tsx` | Desktop Register Button | Navigates to `/Register` | Navigates to `/register` | Align route casing to match folders exactly. |
| `Navbar.tsx` | Mobile Contact Button | Navigates to `/register` | Navigates to `/contact` | Resolves mislinked button on mobile navigation. |
| `Navbar.tsx` | Mobile Register Button | Navigates to `/logout` | Navigates to `/register` | Corrects register navigation for mobile users. |
| `Navbar.tsx` | Navbar Header Menu | No Theme Toggle | Add `<ThemeToggle />` | Place theme toggle button in desktop and mobile menu headers. |
| `AuthContext.js` | Logout function | Navigates to `/login` | Navigates to `/register` or custom Modal | Prevents redirecting to a non-existent page; can show a sign-out confirmation or return to signup. |
| `rakshak/page.jsx` | Internal Camera Card | Navigates to `/internal-camera` | Shows custom "In Development" Modal or redirects to `/remaining` | Replaces the dummy/broken route with a clean informative notice about Phase 1 dev. |
| `confirmPurchase/page.jsx` | API endpoint | `http://localhost:8080/sendmail` | `process.env.NEXT_PUBLIC_API_URL` / custom fallback | Clean up hardcoded URLs to support staging/production environments. |

---

## 4. Page-by-Page Refactoring & Styling Alignment

To transition the codebase to the unified theme system, follow these instruction cards:

### Dashboard Upgrades

#### 1. Accident Tracking (`src/app/accidenttrack/page.jsx`)
- **Theme integration:** Wrap the page container in `bg-background-light dark:bg-background-dark`.
- **Card styling:** Change all dashboard cards to use `.glass-card` rather than hardcoded `bg-slate-900/50`.
- **Recharts customization:** Update grid lines and tooltips to adapt based on current context:
  - Grid strokes: `rgba(255, 255, 255, 0.05)` in dark, `rgba(15, 23, 42, 0.05)` in light.
  - Text colors: Slate-400 in dark, Slate-600 in light.
- **Style Cleanup:** Delete the local `<style jsx>` block at the bottom. Move standard keyframe animations (like pulse overlays) to global CSS utility animations.

#### 2. Alcohol Tracking (`src/app/alcoholtrack/page.jsx`)
- **Theme integration:** Follow the exact same structural guidelines as `accidenttrack`.
- **Alert boxes:** Set alarm alerts to high contrast neon pink/red border overrides in dark mode, and standard soft red boxes in light mode.
- **Style Cleanup:** Delete the `<style jsx>` block at the bottom.

#### 3. GPS Tracker (`src/app/track/page.tsx`)
- **Map Tiles switching:**
  - If `theme === "dark"`, load CartoDB Dark Matter: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`.
  - If `theme === "light"`, load OpenStreetMap Standard: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`.
- **Card elements:** Convert the side status panels to utilize `.glass-card` classes.
- **Icon Styling:** Replace the white border inside the vehicle marker div icon with a dynamic color theme border matching the theme.

#### 4. External Camera (`src/app/external-camera/page.jsx`)
- **Layout overhaul:** Remove **ALL** inline `style={{ ... }}` objects from container elements.
- **Tailwind rewrite:** Translate custom CSS keys like `display: "inline-flex", gap: 5, padding: "10px 18px"` to standard classes: `inline-flex items-center gap-1.5 px-4 py-2.5`.
- **Theme support:** Replace hardcoded background colors like `#020509` and text colors like `rgba(255,255,255,0.82)` with responsive color selectors (`bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark`).
- **Style Cleanup:** Remove the local font imports `@import url('https://fonts.googleapis.com/...Syne')` and local animation keyframes. Let the application load via the parent layout font files.

---

### Home Page & Content Section Cleanups

#### 5. Features (`src/components/Features.jsx`)
- **Style Cleanup:** Delete the massive `<style>` block starting on line 233.
- **Card grid:** Convert cards from custom `.fv-card` rules to standard Tailwind flex grids. Use `.glass-card` classes to handle background borders and rounded edges.
- **Floating Dashes:** Remove these or adjust opacity since they interfere with light mode readable contrast.

#### 6. Tech Stack (`src/components/TechStack.jsx`)
- **Style Cleanup:** Remove the `<style>` block starting on line 803.
- **Grid systems:** Refactor the tech card grids to use standard grid systems with smooth scale transitions: `transition-transform duration-300 hover:scale-105`.

#### 7. Why Safev (`src/components/WhySafev.jsx`)
- **Style Cleanup:** Remove the `<style>` block starting on line 143.
- **Typography:** Ensure all body copy adapts to the primary theme color.

#### 8. How To Use Guide (`src/components/HowToUseGuide.jsx`)
- **Style Cleanup:** Remove the `<style>` block starting on line 679.
- **Instruction steps:** Replace local step bubbles with standard Tailwind items.

#### 9. Creator Section (`src/components/Creatorsection.jsx`)
- **Style Cleanup:** Remove the `<style>` block starting on line 72.
- **Contrast safety:** Ensure creator card text is highly readable when toggling between dark/light backgrounds.

---

### Forms & User Action Pages

#### 10. Buy Page (`src/app/buy/page.jsx`)
- **Theme integration:** Modify container to align with standard `.glass-card` aesthetics.
- **Font alignment:** Correct text colors using Tailwind defaults instead of static `text-gray-700 dark:text-gray-300` strings.

#### 11. Confirm Purchase (`src/app/confirmPurchase/page.jsx`)
- **Form components:** Convert input fields to follow standard card styling.
- **API fallback:** Integrate a fallback handling condition if the node auth server isn't running on `localhost:8080`.

#### 12. Contact Page (`src/app/contact/page.jsx`)
- **Header alignment:** Ensure `BackgroundBeamsWithCollision` renders with high contrast colors suitable for the background selection.

#### 13. Register Page (`src/app/register/page.jsx`)
- **Form alignment:** Ensure input tags use `bg-slate-50 dark:bg-black/40 text-text-primary-light dark:text-text-primary-dark` so inputs remain completely visible in both dark and light configurations.

#### 14. Remaining Features (`src/app/remaining/page.jsx`)
- **Timeline elements:** Standardize status pill colors using dynamic colors.
- **Consistency:** Ensure the roadmap timeline cards scale nicely and respect the dark/light variables.

#### 15. Success Page (`src/app/success/page.jsx`)
- **Layout alignment:** Convert cards to `.glass-card`.
- **Text cleanup:** Standardize button colors to match the primary global buttons.

#### 16. Tracking Login (`src/app/tracking/page.tsx`) & Choose (`src/app/tracking/choose/page.jsx`)
- **Form design:** Update UCOD text field to support theme styling.
- **Routing:** Ensure choose page navigates to `/rakshak`, `/accidenttrack`, and `/alcoholtrack` with correct route naming.

#### 17. Logout page (`src/app/logout/page.jsx`)
- **Loader alignment:** Replace the plain placeholder loader with a styled dark-glow spinner that matches the landing page loader theme.

---

## 5. Verification Checklist

During implementation, confirm the following indicators:
- [ ] No local components contain a `<style>` or `<style jsx>` block with external font imports.
- [ ] The `html` tag correctly toggles class `dark` and `light`.
- [ ] All forms (Register, Contact, Purchase) contain inputs with proper visible text contrast in both modes.
- [ ] Clicking "Contact Us" on the mobile navbar correctly routes to `/contact`.
- [ ] Clicking "Register" on the mobile navbar correctly routes to `/register`.
- [ ] CartoDB dark tiles render correctly on the GPS track page under dark mode.
- [ ] Hardcoded API URLs use configurable environmental fallbacks instead of static `localhost:8080` declarations.
- [ ] The dummy internal camera route gracefully opens an warning modal or points to `/remaining`.
