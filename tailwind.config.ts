import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        rju: {
          blue: "hsl(var(--rju-blue))",
          "blue-dark": "hsl(var(--rju-blue-dark))",
          "blue-light": "hsl(var(--rju-blue-light))",
          purple: "hsl(var(--rju-purple))",
          "purple-dark": "hsl(var(--rju-purple-dark))",
          "purple-light": "hsl(var(--rju-purple-light))",
          cyan: "hsl(var(--rju-cyan))",
          "cyan-light": "hsl(var(--rju-cyan-light))",
          green: "hsl(var(--rju-green))",
          "green-light": "hsl(var(--rju-green-light))",
          orange: "hsl(var(--rju-orange))",
          "orange-light": "hsl(var(--rju-orange-light))",
          pink: "hsl(var(--rju-pink))",
          "pink-light": "hsl(var(--rju-pink-light))",
          gray: "hsl(var(--rju-gray))",
          "gray-light": "hsl(var(--rju-gray-light))",
        },
        electric: {
          purple: "hsl(var(--electric-purple))",
          blue: "hsl(var(--electric-blue))",
          cyan: "hsl(var(--cyber-cyan))",
          green: "hsl(var(--neon-green))",
          orange: "hsl(var(--sunset-orange))",
          pink: "hsl(var(--hot-pink))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "rainbow-glow": {
          "0%, 100%": {
            filter: "hue-rotate(0deg) brightness(1)",
          },
          "50%": {
            filter: "hue-rotate(90deg) brightness(1.2)",
          },
        },
        "mesh-float": {
          "0%, 100%": {
            transform: "translate(0, 0) rotate(0deg)",
          },
          "33%": {
            transform: "translate(30px, -30px) rotate(120deg)",
          },
          "66%": {
            transform: "translate(-20px, 20px) rotate(240deg)",
          },
        },
        "float": {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        "pulse-glow": {
          "0%": {
            boxShadow: "0 0 5px hsl(var(--electric-purple) / 0.2)",
          },
          "100%": {
            boxShadow: "0 0 20px hsl(var(--electric-purple) / 0.6), 0 0 30px hsl(var(--cyber-cyan) / 0.4)",
          },
        },
        "gradient-shift": {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
          "100%": {
            backgroundPosition: "0% 50%",
          },
        },
        "slide-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        "scale-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.95)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "rainbow-glow": "rainbow-glow 3s ease-in-out infinite alternate",
        "mesh-float": "mesh-float 20s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite alternate",
        "gradient-shift": "gradient-shift 3s ease infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
