# Components

This document provides a comprehensive overview of all 16 components implemented in the Meta Tracking Lab project, including core application components and UI components.

---

## Overview

The project implements 16 components organized into two main categories:
- **Core Components** (6): Application-level components for layout, theming, and functionality
- **UI Components** (10): Reusable UI elements from shadcn/ui library

All components are located in the [`components/`](../components/) directory.

---

## Core Components

### 1. AppShell

**File Location**: [`components/app-shell.tsx`](../components/app-shell.tsx:1)

**Status**: Complete

**Description**: Main application shell component providing the overall layout structure with sidebar navigation and responsive design.

**Key Functionality**:
- Desktop sidebar with navigation menu
- Mobile header with hamburger menu
- Responsive layout switching (desktop/mobile)
- Navigation state management
- Search input placeholder
- Version badge display
- External links (Connection Test, Docs, GitHub)

**Features**:
- Fixed left sidebar on desktop (72 units wide)
- Sticky mobile header
- Scrollable navigation with groups
- Active route highlighting
- Collapsible mobile menu using Sheet component
- Footer with project description

**Dependencies**:
- `usePathname` from Next.js for active route detection
- `Button`, `Input`, `ScrollArea`, `Sheet`, `Separator`, `Badge` UI components
- `navItems` and `navGroups` from [`content/nav.ts`](../content/nav.ts:1)

**Props**:
```typescript
interface AppShellProps {
  children: React.ReactNode
}
```

**Usage**: Wraps the entire application content in [`app/layout.tsx`](../app/layout.tsx:34)

**Implementation Notes**:
- Uses "use client" directive for interactivity
- Implements responsive breakpoints (lg: hidden/flex)
- Manages sheet open state for mobile navigation
- Includes search input (placeholder implementation)

---

### 2. DemoPanel

**File Location**: [`components/demo-panel.tsx`](../components/demo-panel.tsx:1)

**Status**: Complete

**Description**: Interactive Event Playground component for testing Meta Pixel events with different configurations (Broken/Fixed modes).

**Key Functionality**:
- Event mode switching (Broken vs Fixed)
- Event triggering (ViewContent, AddToCart, Purchase)
- Real-time event logging
- Payload display and copying
- Event history with timestamps
- Auto-scrolling log viewer
- Toast notifications

**Features**:
- Tabbed interface (Controls/Logs)
- Mode-specific event payloads
- JSON payload visualization
- Copy to clipboard functionality
- Clear logs button
- Event icons (Eye, ShoppingCart, CreditCard)
- Responsive card layout

**Dependencies**:
- `toast` from sonner for notifications
- `Button`, `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`, `Tabs`, `Badge`, `ScrollArea`, `Separator` UI components
- React hooks (useState, useEffect, useRef)

**State Management**:
```typescript
const [mode, setMode] = React.useState<"Broken" | "Fixed">("Broken")
const [logs, setLogs] = React.useState<LogEntry[]>([])
const [lastPayload, setLastPayload] = React.useState<any>(null)
```

**Event Payloads**:
- **ViewContent**: Product viewing event
- **AddToCart**: Cart addition event
- **Purchase**: Purchase completion event with order ID

**Implementation Notes**:
- Auto-scrolls to bottom of logs when new events are added
- Generates random order IDs for Purchase events
- Shows mode badge (destructive for Broken, default for Fixed)
- Displays event history with expandable payload details

---

### 3. FacebookPixel

**File Location**: [`components/facebook-pixel.tsx`](../components/facebook-pixel.tsx:1)

**Status**: Complete

**Description**: Meta Pixel integration component that loads the Facebook Pixel script and initializes tracking.

**Key Functionality**:
- Loads Facebook Pixel script asynchronously
- Initializes pixel with ID from environment variable
- Tracks PageView events automatically
- Provides noscript fallback for tracking

**Features**:
- Uses Next.js Script component for optimal loading
- Strategy: "afterInteractive" for performance
- Environment variable validation
- Noscript fallback for users with JavaScript disabled
- Conditional rendering (only if pixel ID is configured)

**Dependencies**:
- `Script` from next/script
- `NEXT_PUBLIC_FB_PIXEL_ID` environment variable

**Implementation Notes**:
- Returns null if pixel ID is not configured
- Uses dangerouslySetInnerHTML for script injection
- Includes standard Facebook Pixel initialization code
- Tracks PageView event on initialization

**Environment Variables Required**:
```
NEXT_PUBLIC_FB_PIXEL_ID=your_pixel_id
```

---

### 4. PageContent

**File Location**: [`components/page-content.tsx`](../components/page-content.tsx:1)

**Status**: Complete

**Description**: Dynamic page content renderer for documentation pages with optional demo panel integration.

**Key Functionality**:
- Renders page metadata (title, description, badge)
- Displays section blocks with headings and content
- Supports two-column layout with demo panel
- Responsive design (mobile demo panel at bottom)
- Notes & References section

**Features**:
- Conditional layout based on `showDemo` prop
- Two-column grid layout (1.2fr / 0.8fr ratio)
- Sticky demo panel on desktop
- Mobile-responsive demo panel
- Badge status display
- Styled content cards

**Dependencies**:
- `DemoPanel` component
- React for rendering

**Props**:
```typescript
interface PageContentProps {
  pageData: PageMetadata
}

interface PageMetadata {
  title: string
  description: string
  badge?: "Stable" | "Draft" | "Beta" | "Experimental"
  sectionBlocks: PageSection[]
  showDemo?: boolean
}
```

**Layout Options**:
- **With Demo**: Two-column layout with sticky demo panel
- **Without Demo**: Centered single-column layout (max-w-3xl)

**Implementation Notes**:
- Used by dynamic route [`app/[...slug]/page.tsx`](../app/[...slug]/page.tsx:1)
- Renders section blocks from page registry
- Includes Notes & References section on all pages
- Mobile demo panel appears after main content

---

### 5. PageShell

**File Location**: [`components/page-shell.tsx`](../components/page-shell.tsx:1)

**Status**: Complete

**Description**: Page shell wrapper component for pages with custom content and demo panel integration.

**Key Functionality**:
- Renders page header with title and status badge
- Displays description
- Provides "What you'll learn" section
- Supports custom children content
- Integrates DemoPanel component

**Features**:
- Status badge with color coding
- Separator between header and content
- Two-column layout with demo panel
- Responsive design
- Notes & References section

**Dependencies**:
- `Badge`, `Separator` UI components
- `DemoPanel` component

**Props**:
```typescript
interface PageShellProps {
  title: string
  description?: string
  children?: ReactNode
  status?: "Draft" | "Beta" | "Stable" | "Experimental"
}
```

**Status Colors**:
- Draft: secondary
- Beta: outline
- Stable: default
- Experimental: destructive

**Implementation Notes**:
- Used by overview page [`app/page.tsx`](../app/page.tsx:1)
- Includes predefined "What you'll learn" section
- Always includes demo panel
- Mobile demo panel appears after main content

---

### 6. ThemeProvider

**File Location**: [`components/theme-provider.tsx`](../components/theme-provider.tsx:1)

**Status**: Complete

**Description**: Theme provider wrapper for next-themes library to enable dark/light mode switching.

**Key Functionality**:
- Wraps application with theme context
- Enables theme switching functionality
- Supports system theme detection

**Features**:
- Client-side theme management
- System theme support
- Theme persistence
- Smooth theme transitions

**Dependencies**:
- `ThemeProvider` from next-themes

**Props**:
```typescript
interface ThemeProviderProps extends React.ComponentProps<typeof NextThemesProvider> {
  children: React.ReactNode
}
```

**Implementation Notes**:
- Simple wrapper component
- Passes all props to NextThemesProvider
- Used in [`app/layout.tsx`](../app/layout.tsx:28)
- Configured with dark mode as default

---

### 7. Toaster

**File Location**: [`components/toaster.tsx`](../components/toaster.tsx:1)

**Status**: Complete

**Description**: Toast notification component using sonner library for displaying user feedback messages.

**Key Functionality**:
- Displays toast notifications
- Supports theme-aware styling
- Provides customizable toast options

**Features**:
- Theme integration (light/dark)
- Styled toast components
- Action button styling
- Cancel button styling
- Description text styling

**Dependencies**:
- `useTheme` from next-themes
- `Toaster as Sonner` from sonner

**Toast Options**:
- Background: theme-aware background
- Text: theme-aware foreground
- Border: theme-aware border
- Shadow: large shadow
- Description: muted foreground
- Action button: primary colors
- Cancel button: muted colors

**Implementation Notes**:
- Used in [`app/layout.tsx`](../app/layout.tsx:35)
- Integrates with theme provider
- Provides consistent toast styling across app
- Used by DemoPanel for event notifications

---

## UI Components (shadcn/ui)

### 8. Badge

**File Location**: [`components/ui/badge.tsx`](../components/ui/badge.tsx:1)

**Status**: Complete

**Description**: Badge component for displaying status indicators, labels, and small tags.

**Key Functionality**:
- Displays small status indicators
- Supports multiple variants
- Customizable styling

**Variants**:
- default
- secondary
- destructive
- outline

**Usage**: Used throughout the app for status badges, version indicators, and event mode badges

---

### 9. Button

**File Location**: [`components/ui/button.tsx`](../components/ui/button.tsx:1)

**Status**: Complete

**Description**: Button component with multiple variants, sizes, and states for interactive elements.

**Key Functionality**:
- Primary action buttons
- Secondary buttons
- Ghost buttons
- Icon buttons
- Link buttons

**Variants**:
- default
- destructive
- outline
- secondary
- ghost
- link

**Sizes**:
- default
- sm
- lg
- icon

**Usage**: Used extensively for navigation, actions, and interactive controls

---

### 10. Card

**File Location**: [`components/ui/card.tsx`](../components/ui/card.tsx:1)

**Status**: Complete

**Description**: Card component for grouping related content with optional header and footer.

**Sub-components**:
- Card
- CardHeader
- CardTitle
- CardDescription
- CardContent
- CardFooter

**Usage**: Used in DemoPanel and page content sections

---

### 11. Input

**File Location**: [`components/ui/input.tsx`](../components/ui/input.tsx:1)

**Status**: Complete

**Description**: Input component for text input fields with consistent styling.

**Features**:
- Text input
- Password input
- Email input
- Number input
- Search input

**Usage**: Used in AppShell for search input (placeholder)

---

### 12. ScrollArea

**File Location**: [`components/ui/scroll-area.tsx`](../components/ui/scroll-area.tsx:1)

**Status**: Complete

**Description**: Scrollable area component with custom scrollbars for content overflow.

**Key Functionality**:
- Custom scrollbar styling
- Vertical and horizontal scrolling
- Viewport control

**Usage**: Used in AppShell sidebar and DemoPanel for log viewer

---

### 13. Separator

**File Location**: [`components/ui/separator.tsx`](../components/ui/separator.tsx:1)

**Status**: Complete

**Description**: Separator component for visual division between content sections.

**Orientation**:
- horizontal (default)
- vertical

**Usage**: Used in headers, between content sections, and in event logs

---

### 14. Sheet

**File Location**: [`components/ui/sheet.tsx`](../components/ui/sheet.tsx:1)

**Status**: Complete

**Description**: Sheet component for slide-in panels (drawer/modal) on mobile devices.

**Sub-components**:
- Sheet
- SheetTrigger
- SheetContent
- SheetHeader
- SheetTitle
- SheetDescription
- SheetFooter
- SheetClose

**Usage**: Used in AppShell for mobile navigation menu

---

### 15. Tabs

**File Location**: [`components/ui/tabs.tsx`](../components/ui/tabs.tsx:1)

**Status**: Complete

**Description**: Tabs component for organizing content into switchable panels.

**Sub-components**:
- Tabs
- TabsList
- TabsTrigger
- TabsContent

**Usage**: Used in DemoPanel for Controls/Logs tabs

---

### 16. Tooltip

**File Location**: [`components/ui/tooltip.tsx`](../components/ui/tooltip.tsx:1)

**Status**: Complete

**Description**: Tooltip component for displaying additional information on hover.

**Sub-components**:
- Tooltip
- TooltipTrigger
- TooltipContent
- TooltipProvider

**Usage**: Available for future use in the application

---

## Component Architecture

### Component Hierarchy

```
RootLayout
├── ThemeProvider
│   ├── AppShell
│   │   ├── Sidebar (desktop)
│   │   │   ├── ScrollArea
│   │   │   ├── Input (search)
│   │   │   └── Navigation Links
│   │   ├── Mobile Header
│   │   │   ├── Sheet (mobile menu)
│   │   │   └── Header Content
│   │   └── Main Content
│   │       ├── PageShell / PageContent
│   │       └── DemoPanel
│   └── Toaster
└── FacebookPixel
```

### Component Categories

#### Layout Components
- AppShell - Main application layout
- PageShell - Page wrapper with demo
- PageContent - Dynamic page renderer

#### Interactive Components
- DemoPanel - Event playground
- FacebookPixel - Meta Pixel integration

#### Utility Components
- ThemeProvider - Theme management
- Toaster - Toast notifications

#### UI Components (shadcn/ui)
- Badge - Status indicators
- Button - Interactive buttons
- Card - Content containers
- Input - Form inputs
- ScrollArea - Scrollable regions
- Separator - Visual dividers
- Sheet - Slide-in panels
- Tabs - Tabbed content
- Tooltip - Hover information

---

## Component Status Summary

| Component | Status | Category | Lines of Code |
|-----------|--------|----------|---------------|
| AppShell | Complete | Core | 211 |
| DemoPanel | Complete | Core | 276 |
| FacebookPixel | Complete | Core | 44 |
| PageContent | Complete | Core | 118 |
| PageShell | Complete | Core | 106 |
| ThemeProvider | Complete | Core | 8 |
| Toaster | Complete | Core | 31 |
| Badge | Complete | UI | ~50 |
| Button | Complete | UI | ~100 |
| Card | Complete | UI | ~60 |
| Input | Complete | UI | ~30 |
| ScrollArea | Complete | UI | ~80 |
| Separator | Complete | UI | ~40 |
| Sheet | Complete | UI | ~200 |
| Tabs | Complete | UI | ~150 |
| Tooltip | Complete | UI | ~100 |

**Total Components**: 16

**All components are complete and fully functional.**

---

## Component Dependencies

### External Libraries
- **next-themes**: Theme management
- **sonner**: Toast notifications
- **lucide-react**: Icons
- **class-variance-authority**: Component variants
- **clsx**: Conditional classes
- **tailwind-merge**: Tailwind class merging

### Internal Dependencies
- Components depend on UI components from shadcn/ui
- AppShell uses navigation data from [`content/nav.ts`](../content/nav.ts:1)
- PageContent uses page data from [`content/pages-registry.ts`](../content/pages-registry.ts:1)

---

## Component Patterns

### Client Components
All components use the "use client" directive for interactivity:
- AppShell
- DemoPanel
- FacebookPixel
- PageContent
- PageShell
- ThemeProvider
- Toaster

### Server Components
No server components are currently implemented in the components directory.

### Component Composition
- DemoPanel is composed of multiple UI components
- AppShell composes navigation, header, and content areas
- PageContent/PageShell compose content with DemoPanel

### Props Pattern
- Components use TypeScript interfaces for props
- Optional props with default values
- Children prop for flexible composition

---

## Notes

- All components are written in TypeScript
- Components follow React best practices
- UI components are from shadcn/ui library
- Components are fully responsive
- Components support dark mode through ThemeProvider
- Components use Tailwind CSS for styling
- Components follow consistent naming conventions

---

## Future Enhancements

Potential improvements for components:
- Add loading states to DemoPanel
- Implement error boundaries
- Add animation transitions
- Create additional UI components (Dialog, Select, etc.)
- Add component storybook/documentation
- Implement component testing
- Add accessibility improvements (ARIA labels)
- Create reusable hooks for common patterns
