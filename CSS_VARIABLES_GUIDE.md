# CSS Variables Guide - Second Turn Games

## 🎨 CSS Custom Properties Implementation

Your `globals.css` file now includes comprehensive CSS variables for the Second Turn Games color system, enabling consistent styling across components that require inline styles or custom properties.

## 🔧 Available CSS Variables

### **🎯 Brand Color Variables**
```css
/* Primary brand colors */
--color-dark-green: #29432b;        /* Primary brand color */
--color-vibrant-orange: #d95323;    /* Accent color */
--color-warm-yellow: #f2c94c;       /* Highlight color */
--color-teal: #2db7a3;              /* Secondary accent */
--color-coral: #ff6b6b;             /* Alert/error color */
--color-lavender: #a78bfa;          /* Soft accent */
```

### **🖼️ Background Color Variables**
```css
/* Background system */
--color-bg-primary: #e6ead7;        /* Main page background */
--color-bg-surface: #ffffff;        /* Card/component surface */
--color-bg-surface-50: #f7f8f4;     /* Subtle background */
--color-bg-surface-100: #f0f2e9;    /* Light background */
```

### **✍️ Text Color Variables**
```css
/* Typography system */
--color-text-primary: #1b1b1b;      /* Main text color */
--color-text-secondary: #6b7280;    /* Secondary text */
--color-text-muted: #9ca3af;        /* Muted/helper text */
```

### **🔲 Border Color Variables**
```css
/* Border system */
--color-border-primary: #e5e7eb;    /* Standard borders */
--color-border-light: #f3f4f6;      /* Subtle borders */
--color-border-accent: #d95323;     /* Accent borders */
```

### **🎯 Semantic Color Aliases**
```css
/* Semantic meanings for easier usage */
--color-brand-primary: var(--color-dark-green);
--color-brand-accent: var(--color-vibrant-orange);
--color-brand-success: var(--color-teal);
--color-brand-warning: var(--color-warm-yellow);
--color-brand-error: var(--color-coral);
--color-brand-info: var(--color-lavender);
```

### **🏗️ System Aliases**
```css
/* Surface system aliases */
--color-surface-default: var(--color-bg-surface);
--color-surface-subtle: var(--color-bg-surface-50);
--color-surface-muted: var(--color-bg-surface-100);
--color-surface-background: var(--color-bg-primary);

/* Typography system aliases */
--color-typography-primary: var(--color-text-primary);
--color-typography-secondary: var(--color-text-secondary);
--color-typography-muted: var(--color-text-muted);

/* Border system aliases */
--color-border-default: var(--color-border-primary);
--color-border-subtle: var(--color-border-light);
--color-border-highlight: var(--color-border-accent);
```

## 🌙 Dark Mode Support

### **Automatic Dark Mode Variables**
The CSS variables automatically adapt to dark mode preferences:

```css
@media (prefers-color-scheme: dark) {
  :root {
    /* Brand colors remain consistent */
    --color-dark-green: #29432b;
    --color-vibrant-orange: #d95323;
    
    /* Backgrounds adapt to dark theme */
    --color-bg-primary: #0f1419;
    --color-bg-surface: #1a202c;
    --color-bg-surface-50: #2d3748;
    --color-bg-surface-100: #4a5568;
    
    /* Text adapts for dark backgrounds */
    --color-text-primary: #f7fafc;
    --color-text-secondary: #e2e8f0;
    --color-text-muted: #a0aec0;
    
    /* Borders adapt for dark theme */
    --color-border-primary: #4a5568;
    --color-border-light: #2d3748;
  }
}
```

## 🚀 Usage Examples

### **🎨 Inline Styles**
```jsx
// Direct CSS variable usage in inline styles
<div style={{ 
  backgroundColor: 'var(--color-brand-primary)',
  color: 'var(--color-typography-primary)',
  border: '1px solid var(--color-border-accent)'
}}>
  Styled with CSS variables
</div>

// Dynamic styling with CSS variables
<div style={{
  '--custom-accent': 'var(--color-brand-accent)',
  background: `linear-gradient(to right, var(--color-brand-primary), var(--custom-accent))`
} as React.CSSProperties}>
  Gradient with brand colors
</div>
```

### **🔧 Custom CSS Classes**
```css
/* Custom component styles using variables */
.custom-button {
  background-color: var(--color-brand-primary);
  color: var(--color-typography-primary);
  border: 2px solid var(--color-border-accent);
  transition: all 0.2s ease;
}

.custom-button:hover {
  background-color: var(--color-brand-accent);
  border-color: var(--color-brand-primary);
}

.custom-card {
  background-color: var(--color-surface-default);
  border: 1px solid var(--color-border-default);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.custom-alert-success {
  background-color: color-mix(in srgb, var(--color-brand-success) 10%, transparent);
  border-left: 4px solid var(--color-brand-success);
  color: var(--color-typography-primary);
}
```

### **📱 Dynamic Theming**
```jsx
// Component with dynamic color variables
function ThemeableComponent({ accentColor = 'brand-primary' }) {
  return (
    <div 
      style={{
        '--component-accent': `var(--color-${accentColor})`,
        backgroundColor: 'var(--color-surface-default)',
        borderLeft: '4px solid var(--component-accent)'
      } as React.CSSProperties}
    >
      <h3 style={{ color: 'var(--component-accent)' }}>
        Themed Component
      </h3>
      <p style={{ color: 'var(--color-typography-secondary)' }}>
        Content with themed accent
      </p>
    </div>
  )
}
```

### **🎯 Conditional Styling**
```jsx
// Status-based styling using semantic variables
function StatusMessage({ status, children }) {
  const statusColors = {
    success: 'var(--color-brand-success)',
    warning: 'var(--color-brand-warning)',
    error: 'var(--color-brand-error)',
    info: 'var(--color-brand-info)'
  }

  return (
    <div style={{
      '--status-color': statusColors[status],
      backgroundColor: 'color-mix(in srgb, var(--status-color) 10%, transparent)',
      borderColor: 'var(--status-color)',
      color: 'var(--color-typography-primary)'
    } as React.CSSProperties}>
      {children}
    </div>
  )
}
```

## 🎨 Advanced Usage Patterns

### **🌈 Color Mixing with CSS Variables**
```css
/* Modern CSS color mixing with variables */
.subtle-background {
  background-color: color-mix(in srgb, var(--color-brand-primary) 5%, var(--color-surface-default));
}

.accent-border {
  border: 1px solid color-mix(in srgb, var(--color-brand-accent) 50%, transparent);
}

.gradient-background {
  background: linear-gradient(
    135deg, 
    var(--color-brand-primary) 0%, 
    var(--color-brand-accent) 100%
  );
}
```

### **📊 Data Visualization**
```jsx
// Chart colors using CSS variables
const chartColors = {
  primary: 'var(--color-brand-primary)',
  accent: 'var(--color-brand-accent)',
  success: 'var(--color-brand-success)',
  warning: 'var(--color-brand-warning)',
  error: 'var(--color-brand-error)',
  info: 'var(--color-brand-info)'
}

// Usage in chart components
<div style={{
  '--chart-primary': chartColors.primary,
  '--chart-accent': chartColors.accent
}}>
  <canvas ref={chartRef} />
</div>
```

### **🎭 Animation with CSS Variables**
```css
/* Animated components using color variables */
@keyframes pulse-brand {
  0%, 100% {
    background-color: var(--color-brand-primary);
  }
  50% {
    background-color: var(--color-brand-accent);
  }
}

.loading-pulse {
  animation: pulse-brand 2s ease-in-out infinite;
}

/* Hover transitions with variables */
.interactive-element {
  background-color: var(--color-surface-default);
  border-color: var(--color-border-default);
  color: var(--color-typography-primary);
  transition: all 0.2s ease;
}

.interactive-element:hover {
  background-color: var(--color-surface-subtle);
  border-color: var(--color-border-highlight);
  color: var(--color-brand-primary);
}
```

## 🔧 Integration with JavaScript

### **📱 Reading CSS Variables in JavaScript**
```javascript
// Get CSS variable values in JavaScript
function getColorValue(colorName) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--color-${colorName}`)
    .trim()
}

// Usage examples
const brandPrimary = getColorValue('brand-primary')
const surfaceColor = getColorValue('surface-default')
const accentColor = getColorValue('border-accent')

// Use in canvas, charts, or dynamic styling
ctx.fillStyle = getColorValue('brand-primary')
ctx.strokeStyle = getColorValue('border-accent')
```

### **🎯 Dynamic Color Updates**
```javascript
// Update CSS variables dynamically
function updateThemeColor(colorName, newValue) {
  document.documentElement.style.setProperty(
    `--color-${colorName}`, 
    newValue
  )
}

// Example: Seasonal theme updates
function applyHolidayTheme() {
  updateThemeColor('brand-accent', '#dc2626') // Holiday red
  updateThemeColor('brand-success', '#059669') // Holiday green
}

// Example: User preference themes
function applyUserTheme(userColors) {
  Object.entries(userColors).forEach(([key, value]) => {
    updateThemeColor(key, value)
  })
}
```

### **📊 Theme Detection and Adaptation**
```javascript
// Detect and respond to theme changes
function setupThemeListener() {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  
  const handleThemeChange = (e) => {
    if (e.matches) {
      // Dark mode activated
      console.log('Dark mode enabled')
      // Trigger any dark mode specific logic
    } else {
      // Light mode activated
      console.log('Light mode enabled')
      // Trigger any light mode specific logic
    }
  }
  
  mediaQuery.addEventListener('change', handleThemeChange)
  handleThemeChange(mediaQuery) // Initial check
}
```

## 🎯 Component Examples

### **🔘 Custom Button Component**
```jsx
function CustomButton({ variant = 'primary', children, ...props }) {
  const variantStyles = {
    primary: {
      backgroundColor: 'var(--color-brand-primary)',
      color: 'var(--color-typography-primary)',
      borderColor: 'var(--color-brand-primary)'
    },
    secondary: {
      backgroundColor: 'var(--color-surface-default)',
      color: 'var(--color-brand-primary)',
      borderColor: 'var(--color-border-accent)'
    },
    accent: {
      backgroundColor: 'var(--color-brand-accent)',
      color: 'var(--color-typography-primary)',
      borderColor: 'var(--color-brand-accent)'
    }
  }

  return (
    <button
      style={{
        ...variantStyles[variant],
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        border: '1px solid',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
      }}
      {...props}
    >
      {children}
    </button>
  )
}
```

### **📋 Custom Card Component**
```jsx
function CustomCard({ children, accent = false }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface-default)',
        border: '1px solid var(--color-border-default)',
        borderRadius: '0.75rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        ...(accent && {
          borderLeftWidth: '4px',
          borderLeftColor: 'var(--color-border-highlight)'
        })
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface-subtle)',
          padding: '1rem',
          borderBottom: '1px solid var(--color-border-subtle)'
        }}
      >
        Card Header
      </div>
      <div style={{ padding: '1rem' }}>
        {children}
      </div>
    </div>
  )
}
```

### **🚨 Alert Component with CSS Variables**
```jsx
function Alert({ type = 'info', children }) {
  const alertStyles = {
    info: {
      '--alert-color': 'var(--color-brand-info)',
      '--alert-bg': 'color-mix(in srgb, var(--color-brand-info) 10%, transparent)'
    },
    success: {
      '--alert-color': 'var(--color-brand-success)',
      '--alert-bg': 'color-mix(in srgb, var(--color-brand-success) 10%, transparent)'
    },
    warning: {
      '--alert-color': 'var(--color-brand-warning)',
      '--alert-bg': 'color-mix(in srgb, var(--color-brand-warning) 10%, transparent)'
    },
    error: {
      '--alert-color': 'var(--color-brand-error)',
      '--alert-bg': 'color-mix(in srgb, var(--color-brand-error) 10%, transparent)'
    }
  }

  return (
    <div
      style={{
        ...alertStyles[type],
        backgroundColor: 'var(--alert-bg)',
        borderLeft: '4px solid var(--alert-color)',
        padding: '1rem',
        borderRadius: '0.5rem',
        color: 'var(--color-typography-primary)'
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
```

## 📱 Responsive and Adaptive Usage

### **📊 Media Query Integration**
```css
/* Responsive color adjustments */
@media (max-width: 768px) {
  :root {
    /* Adjust colors for mobile if needed */
    --color-bg-surface-50: #f9faf7;
    --color-border-primary: #e5e7eb;
  }
}

@media (prefers-reduced-motion: reduce) {
  :root {
    /* Adjust colors for reduced motion preferences */
    --transition-duration: 0s;
  }
}
```

### **🔧 High Contrast Mode Support**
```css
@media (prefers-contrast: high) {
  :root {
    /* Enhanced contrast for accessibility */
    --color-text-primary: #000000;
    --color-border-primary: #000000;
    --color-brand-primary: #1a5f1a;
  }
}
```

## 🎯 Best Practices

### **✅ Do:**
```jsx
// Use semantic variables for better maintainability
<div style={{ color: 'var(--color-brand-primary)' }}>
  Primary content
</div>

// Use system aliases for consistency
<div style={{ 
  backgroundColor: 'var(--color-surface-default)',
  borderColor: 'var(--color-border-default)'
}}>
  Consistent styling
</div>

// Combine with modern CSS features
<div style={{
  backgroundColor: 'color-mix(in srgb, var(--color-brand-accent) 20%, transparent)',
  border: '1px solid var(--color-brand-accent)'
}}>
  Modern color mixing
</div>
```

### **❌ Don't:**
```jsx
// Don't hardcode colors when variables are available
<div style={{ color: '#29432b' }}>  // ❌ Bad
<div style={{ color: 'var(--color-brand-primary)' }}>  // ✅ Good

// Don't mix CSS variables with arbitrary values
<div style={{ 
  backgroundColor: 'var(--color-surface-default)',
  borderColor: '#random-color'  // ❌ Inconsistent
}}>

// Don't forget fallback values for critical styles
<div style={{ color: 'var(--color-text-primary, #1b1b1b)' }}>  // ✅ Good
```

## 🔧 TypeScript Integration

### **📝 CSS Variable Types**
```typescript
// Type definitions for CSS variables
type BrandColor = 
  | 'dark-green' 
  | 'vibrant-orange' 
  | 'warm-yellow' 
  | 'teal' 
  | 'coral' 
  | 'lavender'

type SemanticColor = 
  | 'brand-primary' 
  | 'brand-accent' 
  | 'brand-success' 
  | 'brand-warning' 
  | 'brand-error' 
  | 'brand-info'

type SurfaceColor = 
  | 'surface-default' 
  | 'surface-subtle' 
  | 'surface-muted' 
  | 'surface-background'

// Helper function with types
function getCSSVariable(colorName: BrandColor | SemanticColor | SurfaceColor): string {
  return `var(--color-${colorName})`
}

// Usage with type safety
const primaryColor = getCSSVariable('brand-primary')
const surfaceColor = getCSSVariable('surface-default')
```

### **🎨 Styled Component Integration**
```typescript
// CSS-in-JS with typed variables
interface StyledComponentProps {
  $variant?: 'primary' | 'secondary' | 'accent'
  $size?: 'sm' | 'md' | 'lg'
}

const StyledButton = styled.button<StyledComponentProps>`
  background-color: ${props => 
    props.$variant === 'primary' ? 'var(--color-brand-primary)' :
    props.$variant === 'accent' ? 'var(--color-brand-accent)' :
    'var(--color-surface-default)'
  };
  color: var(--color-typography-primary);
  border: 1px solid var(--color-border-default);
  
  &:hover {
    background-color: var(--color-brand-accent);
    border-color: var(--color-border-highlight);
  }
`
```

## 🎯 Migration Guide

### **🔄 Converting Existing Styles**
```jsx
// Before: Hardcoded colors
<div style={{ backgroundColor: '#29432b', color: '#ffffff' }}>

// After: CSS variables
<div style={{ 
  backgroundColor: 'var(--color-brand-primary)', 
  color: 'var(--color-typography-primary)' 
}}>

// Before: Tailwind classes mixed with inline styles
<div className="bg-green-800" style={{ borderColor: '#d95323' }}>

// After: Consistent CSS variables
<div style={{ 
  backgroundColor: 'var(--color-brand-primary)',
  borderColor: 'var(--color-brand-accent)'
}}>
```

### **🔧 Gradual Migration Strategy**
1. **Phase 1:** Use CSS variables for new components
2. **Phase 2:** Update critical components (buttons, cards, alerts)
3. **Phase 3:** Migrate remaining components incrementally
4. **Phase 4:** Remove hardcoded color values

## 📋 Variable Reference Quick Guide

| **Variable Name** | **Value** | **Usage** | **Example** |
|-------------------|-----------|-----------|-------------|
| `--color-brand-primary` | `#29432b` | Primary actions, headers | `color: var(--color-brand-primary)` |
| `--color-brand-accent` | `#d95323` | CTAs, highlights | `border-color: var(--color-brand-accent)` |
| `--color-surface-default` | `#ffffff` | Card backgrounds | `background: var(--color-surface-default)` |
| `--color-typography-primary` | `#1b1b1b` | Main text | `color: var(--color-typography-primary)` |
| `--color-border-default` | `#e5e7eb` | Standard borders | `border: 1px solid var(--color-border-default)` |

## 🌟 Advanced Features

### **🎨 CSS Variable Cascading**
```css
/* Component-specific variable overrides */
.dark-theme-section {
  --color-surface-default: #1a202c;
  --color-typography-primary: #f7fafc;
  --color-border-default: #4a5568;
}

.holiday-theme-section {
  --color-brand-accent: #dc2626;
  --color-brand-success: #059669;
}
```

### **📊 Performance Optimization**
```css
/* Optimize repaints with CSS variables */
.optimized-component {
  background-color: var(--color-surface-default);
  will-change: background-color;
  transition: background-color 0.2s ease;
}

.optimized-component:hover {
  background-color: var(--color-surface-subtle);
}
```

---

## 🎉 **CSS Variables System Complete!**

Your Second Turn Games project now has:

✅ **Complete CSS Variable System** - All brand colors available as CSS custom properties  
✅ **Dark Mode Support** - Automatic adaptation for dark theme preferences  
✅ **Semantic Aliases** - Easy-to-use semantic color names  
✅ **System Integration** - Works with Tailwind, inline styles, and custom CSS  
✅ **TypeScript Ready** - Type-safe variable usage patterns  
✅ **Future-Proof** - Ready for theme switching and customization  

**Start using CSS variables in your components:**
```jsx
<div style={{
  backgroundColor: 'var(--color-surface-default)',
  color: 'var(--color-typography-primary)',
  border: '1px solid var(--color-border-default)'
}}>
  Styled with CSS variables
</div>
```

**Your design system is now complete with both Tailwind classes and CSS variables! 🎨✨**
