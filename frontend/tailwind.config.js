/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        surface: "hsl(var(--surface))",
        brand: {
          DEFAULT: "hsl(var(--brand))",
          foreground: "hsl(var(--brand-foreground))",
        },
        favorite: "hsl(var(--favorite))",
        "on-surface": "hsl(var(--on-surface))",
        "on-surface-muted": "hsl(var(--on-surface-muted))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        heading: "hsl(var(--heading))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },

        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },

        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },

        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          title: "hsl(var(--card-title))",
          muted: "hsl(var(--card-muted))",
          danger: "hsl(var(--card-danger))",
          divider: "hsl(var(--card-divider))",
        },
        qr: {
          tile: "hsl(var(--qr-tile))",
          code: "hsl(var(--qr-code))",
        },
        "tab-bubble": "hsl(var(--tab-bubble))",
        "tab-icon": "hsl(var(--tab-icon))",
        "tab-icon-active": "hsl(var(--tab-icon-active))",
        "app-bar": "hsl(var(--app-bar))",
        "chat-list": {
          DEFAULT: "hsl(var(--chat-list))",
          foreground: "hsl(var(--chat-list-foreground))",
          divider: "hsl(var(--chat-list-divider))",
        },
        searchbar: "hsl(var(--searchbar))",
        "searchbar-placeholder": "hsl(var(--searchbar-placeholder))",
        avatar: {
          DEFAULT: "hsl(var(--avatar))",
          foreground: "hsl(var(--avatar-foreground))",
          surface: "hsl(var(--avatar-surface))",
          "surface-foreground": "hsl(var(--avatar-surface-foreground))",
        },
        action: {
          DEFAULT: "hsl(var(--action))",
          foreground: "hsl(var(--action-foreground))",
          accent: "hsl(var(--action-accent))",
          "accent-foreground": "hsl(var(--action-accent-foreground))",
          chip: "hsl(var(--action-chip))",
          "chip-foreground": "hsl(var(--action-chip-foreground))",
          tonal: "hsl(var(--action-tonal))",
          "tonal-foreground": "hsl(var(--action-tonal-foreground))",
        },
      },
      borderWidth: {
        hairline: "1px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
