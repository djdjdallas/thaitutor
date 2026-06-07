// Design tokens. Neutral base + a single amber accent, laid out on an 8px grid.
// Keeping all visual constants in one place means screens stay consistent and
// re-skinning the app later is a one-file change.

export const colors = {
  // Surfaces
  bg: "#fafaf9", // app background (warm neutral)
  surface: "#ffffff", // cards, raised elements
  dark: "#1c1917", // near-black for the "Reveal" button

  // Borders
  border: "#e7e5e4",
  borderSoft: "#f0efed",
  accentBorder: "#fcd9a8",

  // Text
  textPrimary: "#1c1917",
  textSecondary: "#57534e",
  textTertiary: "#a8a29e",

  // Amber accent
  accent: "#f59e0b",
  accentDark: "#d97706",
  accentSoft: "#fef3c7",
};

// 8px spacing grid.
export const space = {
  xs: 4,
  sm: 12,
  md: 20,
  lg: 28,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
};

export const font = {
  tiny: 11,
  small: 13,
  body: 15,
  h2: 18,
  h1: 28,
};

// Subtle elevation. Cross-platform: iOS shadow* + Android elevation.
export const shadow = {
  sm: {
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
};
