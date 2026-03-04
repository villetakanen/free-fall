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
      "calc(var(--freefall-type-ratio) * var(--freefall-type-ratio) * var(--freefall-type-ratio) * var(--freefall-type-ratio) * var(--freefall-type-base))",
    section:
      "calc(var(--freefall-type-ratio) * var(--freefall-type-ratio) * var(--freefall-type-ratio) * var(--freefall-type-base))",
    subsection:
      "calc(var(--freefall-type-ratio) * var(--freefall-type-ratio) * var(--freefall-type-base))",
    bodyLead: "calc(var(--freefall-type-ratio) * var(--freefall-type-base))",
    body: "var(--freefall-type-base)",
    caption: "calc(2 * var(--freefall-space-1))",
  },
} as const;
