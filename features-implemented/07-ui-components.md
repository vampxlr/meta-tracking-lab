# shadcn/ui Components

This document provides a comprehensive overview of all shadcn/ui components used in the Meta Tracking Lab project.

---

## Overview

The project uses shadcn/ui, a collection of re-usable components built using Radix UI and Tailwind CSS. These components provide accessible, customizable, and beautiful UI primitives. All UI components are located in the [`components/ui/`](../components/ui/) directory.

---

## Component Library

### shadcn/ui

**Website**: https://ui.shadcn.com

**Description**: Beautifully designed components built with Radix UI and Tailwind CSS.

**Key Features**:
- Accessible (WCAG compliant)
- Customizable with Tailwind CSS
- TypeScript support
- Dark mode support
- Copy-paste components
- No runtime overhead

**Base Color**: Zinc

**CSS Variables**: Enabled for theming

**Style**: Default

---

## UI Components Summary

| Component | Status | Usage Count | Purpose |
|-----------|--------|-------------|---------|
| Badge | Complete | High | Status indicators |
| Button | Complete | Very High | Interactive actions |
| Card | Complete | Medium | Content containers |
| Input | Complete | Low | Form inputs |
| ScrollArea | Complete | Medium | Scrollable regions |
| Separator | Complete | High | Visual dividers |
| Sheet | Complete | Medium | Slide-in panels |
| Tabs | Complete | Low | Tabbed content |
| Tooltip | Complete | None (available) | Hover information |

**Total UI Components**: 9

---

## Component Details

### 1. Badge

**File Location**: [`components/ui/badge.tsx`](../components/ui/badge.tsx:1)

**Status**: Complete

**Description**: Small component for displaying status indicators, labels, and tags.

**Variants**:
- `default` - Primary badge style
- `secondary` - Secondary badge style
- `destructive` - Error/danger badge style
- `outline` - Outlined badge style

**Usage in Project**:
- Page status badges (Stable, Draft, Beta, Experimental)
- Version badge in header
- Event mode badges (Broken, Fixed)
- Connection status badges

**Example Usage**:
```typescript
<Badge variant="default">Stable</Badge>
<Badge variant="destructive">Broken</Badge>
<Badge variant="outline">v0.1.0</Badge>
```

**Key Features**:
- Rounded corners
- Consistent sizing
- Theme-aware colors
- Accessible

---

### 2. Button

**File Location**: [`components/ui/button.tsx`](../components/ui/button.tsx:1)

**Status**: Complete

**Description**: Versatile button component with multiple variants and sizes.

**Variants**:
- `default` - Primary action button
- `destructive` - Danger/delete action
- `outline` - Secondary action
- `secondary` - Tertiary action
- `ghost` - Minimal button
- `link` - Link-style button

**Sizes**:
- `default` - Standard size
- `sm` - Small size
- `lg` - Large size
- `icon` - Icon-only button

**Usage in Project**:
- Navigation links
- Event trigger buttons
- Action buttons (Send Test Event, Open Events Manager)
- Mode toggle buttons (Broken/Fixed)
- Copy button
- Clear logs button
- Menu triggers

**Example Usage**:
```typescript
<Button variant="default">Submit</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="ghost" size="icon">
  <Menu className="h-5 w-5" />
</Button>
```

**Key Features**:
- Hover and focus states
- Disabled state
- Icon support
- Loading state (with spinner)
- Accessible keyboard navigation

---

### 3. Card

**File Location**: [`components/ui/card.tsx`](../components/ui/card.tsx:1)

**Status**: Complete

**Description**: Container component for grouping related content with optional header and footer.

**Sub-components**:
- `Card` - Main container
- `CardHeader` - Header section
- `CardTitle` - Title text
- `CardDescription` - Description text
- `CardContent` - Main content area
- `CardFooter` - Footer section

**Usage in Project**:
- DemoPanel component
- Connection test status cards
- Page content sections
- Information cards

**Example Usage**:
```typescript
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>
```

**Key Features**:
- Consistent padding
- Border and shadow
- Theme-aware colors
- Flexible layout

---

### 4. Input

**File Location**: [`components/ui/input.tsx`](../components/ui/input.tsx:1)

**Status**: Complete

**Description**: Text input component for form fields and user input.

**Usage in Project**:
- Search input in sidebar (placeholder implementation)

**Example Usage**:
```typescript
<Input
  type="text"
  placeholder="Search docs..."
  className="pl-9"
/>
```

**Key Features**:
- Consistent styling
- Focus states
- Disabled state
- Theme-aware colors
- Accessible

---

### 5. ScrollArea

**File Location**: [`components/ui/scroll-area.tsx`](../components/ui/scroll.tsx:1)

**Status**: Complete

**Description**: Custom scrollable area component with styled scrollbars.

**Usage in Project**:
- Sidebar navigation scrolling
- DemoPanel log viewer
- Payload display scrolling
- Event history scrolling

**Example Usage**:
```typescript
<ScrollArea className="h-64">
  <div className="p-4">
    <p>Scrollable content here</p>
  </div>
</ScrollArea>
```

**Key Features**:
- Custom scrollbar styling
- Vertical and horizontal scrolling
- Smooth scrolling
- Theme-aware scrollbars
- Cross-browser compatibility

---

### 6. Separator

**File Location**: [`components/ui/separator.tsx`](../components/ui/separator.tsx:1)

**Status**: Complete

**Description**: Visual separator/divider component for organizing content.

**Orientation**:
- `horizontal` (default) - Horizontal divider
- `vertical` - Vertical divider

**Usage in Project**:
- Page header separators
- Content section dividers
- Event log separators
- Navigation group separators

**Example Usage**:
```typescript
<Separator className="my-4" />
<Separator orientation="vertical" className="h-6 mx-2" />
```

**Key Features**:
- Consistent thickness
- Theme-aware colors
- Flexible orientation
- Accessible

---

### 7. Sheet

**File Location**: [`components/ui/sheet.tsx`](../components/ui/sheet.tsx:1)

**Status**: Complete

**Description**: Slide-in panel component (drawer/modal) for mobile navigation.

**Sub-components**:
- `Sheet` - Main container
- `SheetTrigger` - Trigger element
- `SheetContent` - Panel content
- `SheetHeader` - Header section
- `SheetTitle` - Title text
- `SheetDescription` - Description text
- `SheetFooter` - Footer section
- `SheetClose` - Close button

**Side Options**:
- `top` - Slide from top
- `right` - Slide from right
- `bottom` - Slide from bottom
- `left` - Slide from left (default for mobile nav)

**Usage in Project**:
- Mobile navigation menu in AppShell

**Example Usage**:
```typescript
<Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon">
      <Menu className="h-5 w-5" />
    </Button>
  </SheetTrigger>
  <SheetContent side="left" className="w-72">
    <SheetHeader>
      <SheetTitle>Navigation</SheetTitle>
    </SheetHeader>
    <div className="py-4">
      {/* Navigation content */}
    </div>
  </SheetContent>
</Sheet>
```

**Key Features**:
- Smooth animations
- Backdrop overlay
- Close on escape
- Close on backdrop click
- Accessible keyboard navigation
- Responsive design

---

### 8. Tabs

**File Location**: [`components/ui/tabs.tsx`](../components/ui/tabs.tsx:1)

**Status**: Complete

**Description**: Tabbed interface component for organizing content into switchable panels.

**Sub-components**:
- `Tabs` - Main container
- `TabsList` - Tab buttons container
- `TabsTrigger` - Individual tab button
- `TabsContent` - Tab panel content

**Usage in Project**:
- DemoPanel (Controls/Logs tabs)

**Example Usage**:
```typescript
<Tabs defaultValue="controls" className="w-full">
  <TabsList className="grid w-full grid-cols-2">
    <TabsTrigger value="controls">Controls</TabsTrigger>
    <TabsTrigger value="logs">Logs</TabsTrigger>
  </TabsList>
  <TabsContent value="controls" className="space-y-4 mt-4">
    {/* Controls content */}
  </TabsContent>
  <TabsContent value="logs" className="mt-4">
    {/* Logs content */}
  </TabsContent>
</Tabs>
```

**Key Features**:
- Keyboard navigation
- Accessible ARIA attributes
- Smooth transitions
- Active state styling
- Default tab selection

---

### 9. Tooltip

**File Location**: [`components/ui/tooltip.tsx`](../components/ui/tooltip.tsx:1)

**Status**: Complete

**Description**: Tooltip component for displaying additional information on hover.

**Sub-components**:
- `TooltipProvider` - Context provider
- `Tooltip` - Main container
- `TooltipTrigger` - Trigger element
- `TooltipContent` - Tooltip content

**Usage in Project**:
- Available for future use (not currently used in the project)

**Example Usage**:
```typescript
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon">
        <Info className="h-4 w-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Additional information here</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

**Key Features**:
- Hover trigger
- Focus trigger
- Delay configuration
- Positioning (top, right, bottom, left)
- Accessible
- Theme-aware

---

## Component Architecture

### Radix UI Primitives

All shadcn/ui components are built on Radix UI primitives:
- **@radix-ui/react-dialog** - Dialog/Sheet
- **@radix-ui/react-dropdown-menu** - Dropdown menus
- **@radix-ui/react-label** - Form labels
- **@radix-ui/react-scroll-area** - Scrollable areas
- **@radix-ui/react-select** - Select inputs
- **@radix-ui/react-separator** - Separators
- **@radix-ui/react-slot** - Slot composition
- **@radix-ui/react-tabs** - Tabs
- **@radix-ui/react-tooltip** - Tooltips

### Tailwind CSS Integration

Components use Tailwind CSS for styling:
- Utility classes for layout
- CSS variables for theming
- Responsive design
- Dark mode support
- Custom animations

### Class Variance Authority (CVA)

Components use CVA for variant management:
- Type-safe variant props
- Compound variants
- Default variants
- Custom styling

---

## Component Theming

### CSS Variables

All components use CSS variables for theming:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 240 5.9% 10%;
  --radius: 0.5rem;
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 240 5.9% 10%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 240 4.9% 83.9%;
}
```

### Dark Mode

Dark mode is enabled via class-based strategy:
- Toggle `dark` class on HTML element
- Components automatically adapt to theme
- CSS variables handle color transitions

---

## Component Usage Patterns

### Common Patterns

**1. Variant Selection**:
```typescript
<Button variant="default">Primary</Button>
<Button variant="outline">Secondary</Button>
```

**2. Size Selection**:
```typescript
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

**3. Icon Integration**:
```typescript
<Button variant="ghost" size="icon">
  <Menu className="h-5 w-5" />
</Button>
```

**4. Composition**:
```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

**5. State Management**:
```typescript
const [open, setOpen] = useState(false)

<Sheet open={open} onOpenChange={setOpen}>
  {/* Sheet content */}
</Sheet>
```

---

## Component Accessibility

### Accessibility Features

All shadcn/ui components include:
- **Keyboard Navigation**: Full keyboard support
- **ARIA Attributes**: Proper ARIA labels and roles
- **Focus Management**: Logical focus order
- **Screen Reader Support**: Compatible with screen readers
- **WCAG Compliance**: Meets WCAG 2.1 AA standards

### Accessibility Best Practices

- Use semantic HTML elements
- Provide alternative text for icons
- Ensure sufficient color contrast
- Support keyboard-only navigation
- Test with screen readers

---

## Component Customization

### Styling Customization

**1. Override Classes**:
```typescript
<Button className="w-full bg-blue-500">Custom Button</Button>
```

**2. Extend Variants**:
```typescript
// In component file
const buttonVariants = cva(base, {
  variants: {
    variant: {
      custom: "bg-purple-500 text-white hover:bg-purple-600",
    },
  },
})
```

**3. Custom CSS Variables**:
```css
:root {
  --primary: 240 100% 50%; /* Custom primary color */
}
```

**4. Tailwind Config**:
```typescript
// In tailwind.config.ts
theme: {
  extend: {
    colors: {
      custom: {
        500: '#8b5cf6',
      },
    },
  },
}
```

---

## Component Status

### Implementation Status

| Component | Status | Used in Project | Notes |
|-----------|--------|----------------|-------|
| Badge | Complete | Yes | Status indicators |
| Button | Complete | Yes | Actions and navigation |
| Card | Complete | Yes | Content containers |
| Input | Complete | Yes | Search input |
| ScrollArea | Complete | Yes | Scrollable regions |
| Separator | Complete | Yes | Visual dividers |
| Sheet | Complete | Yes | Mobile navigation |
| Tabs | Complete | Yes | Demo panel tabs |
| Tooltip | Complete | No | Available for future use |

---

## Component Dependencies

### External Dependencies

**Radix UI**:
- @radix-ui/react-dialog
- @radix-ui/react-dropdown-menu
- @radix-ui/react-label
- @radix-ui/react-scroll-area
- @radix-ui/react-select
- @radix-ui/react-separator
- @radix-ui/react-slot
- @radix-ui/react-tabs
- @radix-ui/react-tooltip

**Styling**:
- tailwind-merge
- class-variance-authority
- clsx
- tailwindcss-animate

**Icons**:
- lucide-react

### Internal Dependencies

- [`lib/utils.ts`](../lib/utils.ts:1) - `cn()` utility for class merging
- [`app/globals.css`](../app/globals.css:1) - CSS variables and base styles

---

## Component Best Practices

### Implemented Practices

1. **Type Safety**: All components use TypeScript
2. **Accessibility**: WCAG compliant components
3. **Theming**: Dark mode support with CSS variables
4. **Responsive**: Mobile-first design
5. **Consistency**: Unified design system
6. **Performance**: No runtime overhead
7. **Customization**: Easy to customize with Tailwind

### Usage Best Practices

1. **Semantic HTML**: Use appropriate elements
2. **Keyboard Support**: Ensure keyboard navigation
3. **Focus States**: Provide clear focus indicators
4. **Loading States**: Show loading feedback
5. **Error States**: Display error messages
6. **Empty States**: Handle empty content
7. **Accessibility**: Add ARIA labels when needed

---

## Notes

- All UI components are from shadcn/ui library
- Components are fully accessible
- Components support dark mode
- Components are customizable with Tailwind CSS
- Components use CSS variables for theming
- Components are built on Radix UI primitives
- Components follow consistent design patterns
- Components are type-safe with TypeScript

---

## Future Enhancements

Potential UI components to add:
- **Dialog** - Modal dialogs
- **Select** - Dropdown selects
- **Dropdown Menu** - Context menus
- **Checkbox** - Form checkboxes
- **Radio Group** - Radio buttons
- **Switch** - Toggle switches
- **Slider** - Range sliders
- **Progress** - Progress bars
- **AlertDialog** - Alert dialogs
- **Popover** - Popover content
- **Command** - Command palette
- **Collapsible** - Collapsible sections
- **Accordion** - Accordion panels
- **Hover Card** - Hover cards
- **Avatar** - User avatars
- **Table** - Data tables
- **Pagination** - Pagination controls
- **Skeleton** - Loading skeletons
- **Toast** - Toast notifications (already using sonner)

---

## Resources

- **shadcn/ui Documentation**: https://ui.shadcn.com
- **Radix UI Documentation**: https://www.radix-ui.com
- **Tailwind CSS Documentation**: https://tailwindcss.com
- **Lucide Icons**: https://lucide.dev
