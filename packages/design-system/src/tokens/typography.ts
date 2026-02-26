export const typography = {
  fonts: {
    body: '"Lato", system-ui, -apple-system, sans-serif',
    mono: '"IBM Plex Mono", ui-monospace, "Cascadia Code", monospace',
  },
  weights: {
    body: {
      light: 300,
      regular: 400,
      bold: 700,
    },
    mono: {
      regular: 400,
      medium: 500,
    },
  },
  scale: {
    chapter:
      "calc(var(--freefall-type-ratio) * var(--freefall-type-ratio) * var(--freefall-type-ratio) * var(--freefall-type-ratio) * 2 * var(--freefall-space-1))",
    section:
      "calc(var(--freefall-type-ratio) * var(--freefall-type-ratio) * var(--freefall-type-ratio) * 2 * var(--freefall-space-1))",
    subsection:
      "calc(var(--freefall-type-ratio) * var(--freefall-type-ratio) * 2 * var(--freefall-space-1))",
    bodyLead: "calc(var(--freefall-type-ratio) * 2 * var(--freefall-space-1))",
    caption: "calc(2 * var(--freefall-space-1))",
  },
} as const;
