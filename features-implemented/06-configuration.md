# Configuration Files

This document provides a comprehensive overview of all configuration files in the Meta Tracking Lab project.

---

## Overview

The project uses several configuration files for package management, build tools, TypeScript, styling, and UI component setup. All configuration files are located in the project root directory.

---

## Configuration Files Summary

| File | Purpose | Status |
|------|---------|--------|
| `package.json` | Package dependencies and scripts | Complete |
| `next.config.ts` | Next.js configuration | Complete |
| `tailwind.config.ts` | Tailwind CSS configuration | Complete |
| `tsconfig.json` | TypeScript configuration | Complete |
| `components.json` | shadcn/ui component configuration | Complete |
| `.eslintrc.json` | ESLint configuration | Complete |
| `postcss.config.mjs` | PostCSS configuration | Complete |
| `.gitignore` | Git ignore rules | Complete |

**Total Configuration Files**: 8

---

## Package Configuration

### package.json

**File Location**: [`package.json`](../package.json:1)

**Status**: Complete

**Description**: Node.js package manifest defining project metadata, dependencies, and scripts.

**Project Information**:
```json
{
  "name": "meta-tracking-lab",
  "version": "0.1.0",
  "private": true
}
```

#### Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev` | Start development server |
| `build` | `next build` | Build for production |
| `start` | `next start` | Start production server |
| `lint` | `next lint` | Run ESLint |

#### Production Dependencies

**Core Framework**:
- `next`: 15.5.9 - React framework
- `react`: 19.0.0 - UI library
- `react-dom`: 19.0.0 - React DOM renderer

**UI Components**:
- `@radix-ui/react-dialog`: 1.1.6 - Dialog component
- `@radix-ui/react-dropdown-menu`: 2.1.6 - Dropdown menu
- `@radix-ui/react-label`: 2.1.2 - Label component
- `@radix-ui/react-scroll-area`: 1.2.3 - Scrollable area
- `@radix-ui/react-select`: 2.1.6 - Select component
- `@radix-ui/react-separator`: 1.1.2 - Separator component
- `@radix-ui/react-slot`: 1.1.2 - Slot component
- `@radix-ui/react-tabs`: 1.1.3 - Tabs component
- `@radix-ui/react-tooltip`: 1.1.8 - Tooltip component

**Styling**:
- `tailwindcss`: 3.4.19 (dev) - Utility-first CSS
- `tailwindcss-animate`: 1.0.7 - Tailwind animations
- `tailwind-merge`: 3.0.1 - Merge Tailwind classes
- `class-variance-authority`: 0.7.1 - Component variants
- `clsx`: 2.1.1 - Conditional classes
- `autoprefixer`: 10.4.23 (dev) - CSS autoprefixer
- `postcss`: 8.5.6 (dev) - CSS transformation

**Icons**:
- `lucide-react`: 0.474.0 - Icon library

**Theme**:
- `next-themes`: 0.4.4 - Theme management

**Notifications**:
- `sonner`: 2.0.1 - Toast notifications

**Material UI** (Unused):
- `@mui/material`: 6.4.1
- `@emotion/react`: 11.14.0
- `@emotion/styled`: 11.14.0

**Note**: Material UI dependencies appear to be unused and could be removed.

#### Development Dependencies

**TypeScript**:
- `typescript`: 5 - TypeScript compiler
- `@types/node`: 22 - Node.js types
- `@types/react`: 19 - React types
- `@types/react-dom`: 19 - React DOM types

**Linting**:
- `eslint`: 9 - Linter
- `eslint-config-next`: 15.5.9 - Next.js ESLint config

---

## Next.js Configuration

### next.config.ts

**File Location**: [`next.config.ts`](../next.config.ts:1)

**Status**: Complete

**Description**: Next.js framework configuration file.

**Current Configuration**:
```typescript
const nextConfig: NextConfig = {
  /* config options here */
};
```

**Status**: Minimal configuration with default settings.

**Planned Configurations**:
- Image optimization settings
- Environment variable handling
- Custom headers
- Redirects
- Rewrites
- Webpack configuration (if needed)

**Common Options**:
```typescript
const nextConfig: NextConfig = {
  images: {
    domains: ['example.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_VALUE,
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
      ],
    },
  ],
};
```

---

## Tailwind CSS Configuration

### tailwind.config.ts

**File Location**: [`tailwind.config.ts`](../tailwind.config.ts:1)

**Status**: Complete

**Description**: Tailwind CSS utility framework configuration.

#### Content Paths

```typescript
content: [
  './pages/**/*.{ts,tsx}',
  './components/**/*.{ts,tsx}',
  './app/**/*.{ts,tsx}',
  './src/**/*.{ts,tsx}',
]
```

**Purpose**: Specifies which files to scan for Tailwind class usage.

#### Dark Mode

```typescript
darkMode: ["class"]
```

**Purpose**: Enables dark mode using class-based strategy.

**Usage**: Toggle by adding/removing `dark` class on HTML element.

#### Theme Configuration

**Container**:
```typescript
container: {
  center: true,
  padding: "2rem",
  screens: {
    "2xl": "1400px",
  },
}
```

**Purpose**: Configures responsive container with centering and custom 2xl breakpoint.

**Color System**:
Uses CSS custom properties (CSS variables) for theming:
- `border`, `input`, `ring` - UI elements
- `background`, `foreground` - Base colors
- `primary`, `primary-foreground` - Primary actions
- `secondary`, `secondary-foreground` - Secondary actions
- `destructive`, `destructive-foreground` - Destructive actions
- `muted`, `muted-foreground` - Muted content
- `accent`, `accent-foreground` - Accents
- `popover`, `popover-foreground` - Popover elements
- `card`, `card-foreground` - Card elements

**Border Radius**:
```typescript
borderRadius: {
  lg: "var(--radius)",
  md: "calc(var(--radius) - 2px)",
  sm: "calc(var(--radius) - 4px)",
}
```

**Purpose**: Consistent border radius using CSS variable.

**Animations**:
```typescript
keyframes: {
  "accordion-down": {
    from: { height: "0" },
    to: { height: "var(--radix-accordion-content-height)" },
  },
  "accordion-up": {
    from: { height: "var(--radix-accordion-content-height)" },
    to: { height: "0" },
  },
},
animation: {
  "accordion-down": "accordion-down 0.2s ease-out",
  "accordion-up": "accordion-up 0.2s ease-out",
}
```

**Purpose**: Smooth accordion animations.

#### Plugins

```typescript
plugins: [require("tailwindcss-animate")]
```

**Purpose**: Adds animation utilities for smooth transitions.

---

## TypeScript Configuration

### tsconfig.json

**File Location**: [`tsconfig.json`](../tsconfig.json:1)

**Status**: Complete

**Description**: TypeScript compiler configuration.

#### Compiler Options

**Target and Module**:
```json
{
  "target": "ES2017",
  "lib": ["dom", "dom.iterable", "esnext"],
  "module": "esnext",
  "moduleResolution": "bundler"
}
```

**Purpose**: Modern JavaScript target and ES modules.

**Type Checking**:
```json
{
  "strict": true,
  "allowJs": true,
  "skipLibCheck": true
}
```

**Purpose**: Strict type checking with JavaScript support.

**Output**:
```json
{
  "noEmit": true,
  "jsx": "preserve",
  "incremental": true
}
```

**Purpose**: No output files, preserve JSX, incremental compilation.

**Module Resolution**:
```json
{
  "esModuleInterop": true,
  "resolveJsonModule": true,
  "isolatedModules": true
}
```

**Purpose**: Modern module resolution.

**Path Aliases**:
```json
{
  "paths": {
    "@/*": ["./*"]
  }
}
```

**Purpose**: Import alias for cleaner imports.

**Usage**:
```typescript
// Instead of:
import { Button } from "../../../components/ui/button"

// Use:
import { Button } from "@/components/ui/button"
```

**Next.js Plugin**:
```json
{
  "plugins": [
    {
      "name": "next"
    }
  ]
}
```

**Purpose**: Next.js TypeScript plugin for enhanced type checking.

#### Include/Exclude

```json
{
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Purpose**: Specifies which files to compile.

---

## shadcn/ui Configuration

### components.json

**File Location**: [`components.json`](../components.json:1)

**Status**: Complete

**Description**: Configuration for shadcn/ui component library CLI.

#### Schema

```json
{
  "$schema": "https://ui.shadcn.com/schema.json"
}
```

**Purpose**: Schema validation for configuration file.

#### Style Configuration

```json
{
  "style": "default",
  "rsc": true,
  "tsx": true
}
```

**Purpose**:
- `style`: Default component style
- `rsc`: React Server Components enabled
- `tsx`: TypeScript syntax

#### Tailwind Configuration

```json
{
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  }
}
```

**Purpose**:
- `config`: Tailwind config file location
- `css`: Global CSS file location
- `baseColor`: Zinc color scheme
- `cssVariables`: Enable CSS variables for theming
- `prefix`: No prefix for Tailwind classes

#### Aliases

```json
{
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

**Purpose**: Import path aliases for cleaner code organization.

**Usage**:
```typescript
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

---

## ESLint Configuration

### .eslintrc.json

**File Location**: [`.eslintrc.json`](../.eslintrc.json:1)

**Status**: Complete

**Description**: ESLint configuration for code linting and formatting.

**Configuration**:
- Extends Next.js ESLint configuration
- Enforces code quality standards
- Catches common errors and anti-patterns

**Common Rules** (inherited from `eslint-config-next`):
- React best practices
- Next.js specific rules
- TypeScript support
- Accessibility checks

**Usage**:
```bash
npm run lint
```

---

## PostCSS Configuration

### postcss.config.mjs

**File Location**: [`postcss.config.mjs`](../postcss.config.mjs:1)

**Status**: Complete

**Description**: PostCSS configuration for CSS processing.

**Plugins**:
- `autoprefixer`: Adds vendor prefixes automatically
- `tailwindcss`: Processes Tailwind CSS directives

**Purpose**: Transforms modern CSS for browser compatibility.

---

## Git Configuration

### .gitignore

**File Location**: [`.gitignore`](../.gitignore:1)

**Status**: Complete

**Description**: Specifies files and directories to ignore in Git.

**Common Ignored Patterns**:
- `node_modules/` - Dependencies
- `.next/` - Next.js build output
- `.env.local` - Local environment variables
- `.env.*.local` - Other local env files
- `*.log` - Log files
- `.DS_Store` - macOS system files
- `*.swp`, `*.swo` - Vim swap files

**Purpose**: Keeps repository clean and avoids committing sensitive data.

---

## Environment Variables

### .env.local

**File Location**: [`.env.local`](../.env.local:1)

**Status**: Local configuration (not in Git)

**Required Variables**:

#### Meta Pixel Configuration
```bash
NEXT_PUBLIC_FB_PIXEL_ID=your_pixel_id_here
```

**Purpose**: Meta Pixel ID for client-side tracking.

**Usage**:
- Used in [`components/facebook-pixel.tsx`](../components/facebook-pixel.tsx:6)
- Used in [`app/connect/page.tsx`](../app/connect/page.tsx:35)

#### Conversions API Configuration (Future)
```bash
FB_ACCESS_TOKEN=your_access_token_here
FB_PIXEL_ID=your_pixel_id_here
```

**Purpose**: Server-side Conversions API authentication.

**Usage**:
- Will be used in [`lib/server/meta/index.ts`](../lib/server/meta/index.ts:1)
- Will be used in [`app/api/meta/capi/route.ts`](../app/api/meta/capi/route.ts:1)

**Note**: These are planned for Day 2/3 implementation.

**Security**:
- Never commit `.env.local` to version control
- Use `.env.example` for template
- Different environments (development, staging, production)

---

## Configuration Best Practices

### Implemented Practices

1. **Type Safety**: TypeScript enabled with strict mode
2. **Code Quality**: ESLint configured
3. **Modern CSS**: Tailwind CSS with CSS variables
4. **Path Aliases**: Clean import paths with `@/` prefix
5. **Environment Variables**: Separate configuration per environment
6. **Git Safety**: Sensitive files excluded from version control
7. **Component Library**: shadcn/ui for consistent UI components
8. **Theme Support**: Dark mode with CSS variables

### Configuration Organization

```
Project Root/
├── package.json          # Dependencies and scripts
├── next.config.ts        # Next.js config
├── tailwind.config.ts    # Tailwind CSS config
├── tsconfig.json         # TypeScript config
├── components.json       # shadcn/ui config
├── .eslintrc.json       # ESLint config
├── postcss.config.mjs    # PostCSS config
├── .gitignore           # Git ignore rules
└── .env.local           # Environment variables (local)
```

---

## Configuration Dependencies

### Dependency Graph

```
package.json
├── next.config.ts (Next.js)
├── tailwind.config.ts (Tailwind CSS)
│   ├── postcss.config.mjs (PostCSS)
│   └── app/globals.css (CSS variables)
├── tsconfig.json (TypeScript)
│   └── next-env.d.ts (Next.js types)
├── components.json (shadcn/ui)
│   ├── tailwind.config.ts
│   └── app/globals.css
└── .eslintrc.json (ESLint)
```

---

## Configuration Status Summary

| Configuration File | Status | Purpose | Notes |
|------------------|--------|---------|-------|
| `package.json` | Complete | Dependencies and scripts | All dependencies installed |
| `next.config.ts` | Complete | Next.js setup | Minimal configuration |
| `tailwind.config.ts` | Complete | Tailwind CSS setup | Full theming support |
| `tsconfig.json` | Complete | TypeScript setup | Strict mode enabled |
| `components.json` | Complete | shadcn/ui setup | Zinc color scheme |
| `.eslintrc.json` | Complete | ESLint setup | Next.js config |
| `postcss.config.mjs` | Complete | PostCSS setup | Autoprefixer enabled |
| `.gitignore` | Complete | Git ignore | Sensitive files excluded |

---

## Notes

- All configuration files are properly set up
- TypeScript strict mode is enabled for type safety
- Tailwind CSS uses CSS variables for theming
- Path aliases simplify imports
- Environment variables are not committed to Git
- ESLint enforces code quality
- PostCSS processes CSS for browser compatibility
- shadcn/ui provides consistent UI components

---

## Future Enhancements

Potential improvements for configuration:
- Add `.env.example` template
- Configure image optimization in `next.config.ts`
- Add custom webpack configuration if needed
- Configure PWA support
- Add internationalization (i18n) configuration
- Set up analytics configuration
- Configure CDN for static assets
- Add performance monitoring
- Configure caching strategies
- Add security headers
- Set up CI/CD configuration
- Configure testing frameworks (Jest, Playwright)
- Add Storybook for component documentation
- Configure bundle analysis
- Add performance budgets
- Set up error tracking (Sentry)
