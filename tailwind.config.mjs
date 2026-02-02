/** @type {import('tailwindcss').Config} */
export default {
  // Content paths for Astro project
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],

  // Dark mode uses 'class' strategy - toggle via .dark class on html/body
  darkMode: 'class',

  theme: {
    extend: {
      // Custom colors referencing CSS variables from global.css
      // These allow usage like: bg-bg-primary, text-text-secondary, etc.
      colors: {
        bg: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          tertiary: 'var(--color-bg-tertiary)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          muted: 'var(--color-text-muted)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          light: 'var(--color-accent-light)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          light: 'var(--color-border-light)',
        },
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
      },

      // Font families using system font stack
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          '"SF Mono"',
          'Menlo',
          'Consolas',
          '"Liberation Mono"',
          'monospace',
        ],
      },

      // Border radius scale
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },

      // Box shadows
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },

      // Spacing scale extension
      spacing: {
        page: 'var(--spacing-page)',
      },

      // Max width for content
      maxWidth: {
        content: 'var(--content-max-width)',
      },

      // Transition durations
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
      },

      // Background images for gradients
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-text': 'var(--gradient-text)',
        'gradient-subtle': 'var(--gradient-subtle)',
      },
    },
  },

  plugins: [],
};
