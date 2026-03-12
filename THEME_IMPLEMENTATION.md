# Dark/Light Theme Implementation Guide

## Overview

This document explains the comprehensive dark/light theme implementation for the Vue Task & Habit Tracker application.

## Implementation Summary

### 1. **Vuex Store for Theme Management** (`src/store/index.js`)

- Centralized theme state management
- Persists theme preference in localStorage
- Automatically applies theme class to body element

### 2. **CSS Variables System** (`src/assets/theme.css`)

- Comprehensive CSS custom properties for both light and dark themes
- Covers all UI elements: backgrounds, text, borders, buttons, inputs, cards, etc.
- Smooth transitions between themes (0.3s ease)

### 3. **Theme Toggle Button** (`src/components/layouts/AppHeader.vue`)

- Integrated in the header component
- Uses Vuex actions to toggle theme
- Icon changes based on current theme

## How It Works

### Theme Variables Structure

#### Light Theme (Default)

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #111827;
  --border-color: #e5e7eb;
  /* ... more variables */
}
```

#### Dark Theme

```css
body.dark-theme {
  --bg-primary: #0a0a0a;
  --text-primary: #ffffff;
  --border-color: #374151;
  /* ... more variables */
}
```

### Key Features

1. **Background Colors**

   - Light: White (#ffffff)
   - Dark: Deep black (#0a0a0a)

2. **Text Colors**

   - Light: Dark gray (#111827)
   - Dark: White (#ffffff)

3. **Input Fields**

   - Fully styled with dark background in dark mode
   - White text in dark mode
   - Proper placeholder colors

4. **Buttons**

   - Border colors remain consistent
   - Background changes to dark theme colors
   - Hover states adapted for both themes

5. **Cards & Components**
   - All cards use CSS variables
   - Automatic theme adaptation
   - Smooth transitions

## Usage in Components

### Using Theme Variables in Styles

```vue
<style scoped>
.my-component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}
</style>
```

### Accessing Theme State in Components

```vue
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters(["isDarkTheme"]),
  },
  methods: {
    ...mapActions(["toggleTheme"]),
  },
};
</script>
```

## CSS Variable Reference

### Background Colors

- `--bg-primary`: Main background
- `--bg-secondary`: Secondary background
- `--bg-tertiary`: Tertiary background

### Text Colors

- `--text-primary`: Primary text
- `--text-secondary`: Secondary text
- `--text-tertiary`: Tertiary text

### Border Colors

- `--border-color`: Default border
- `--border-hover`: Hover state border

### Input & Form Colors

- `--input-bg`: Input background
- `--input-border`: Input border
- `--input-focus`: Focus state color
- `--input-text`: Input text color
- `--input-placeholder`: Placeholder text

### Button Colors

- `--button-primary-bg`: Primary button background
- `--button-primary-text`: Primary button text
- `--button-primary-hover`: Primary button hover
- `--button-secondary-bg`: Secondary button background
- `--button-secondary-text`: Secondary button text
- `--button-secondary-hover`: Secondary button hover

### Card Colors

- `--card-bg`: Card background
- `--card-shadow`: Card shadow
- `--card-hover-shadow`: Card hover shadow

### Status Colors

- `--status-todo`: Todo status
- `--status-in-progress`: In progress status
- `--status-on-hold`: On hold status
- `--status-completed`: Completed status

### Priority Colors

- `--priority-high`: High priority
- `--priority-medium`: Medium priority
- `--priority-low`: Low priority

### Modal Colors

- `--modal-bg`: Modal background
- `--modal-overlay`: Modal overlay

### Misc Colors

- `--highlight-color`: Highlight/accent color
- `--error-color`: Error state
- `--success-color`: Success state
- `--warning-color`: Warning state

## Files Modified

1. **src/store/index.js** - Theme state management
2. **src/assets/theme.css** - CSS variables and theme styles
3. **src/main.js** - Theme initialization
4. **src/components/layouts/AppHeader.vue** - Theme toggle button
5. **src/views/TasksView.vue** - Updated with CSS variables
6. **src/views/HabitsView.vue** - Updated with CSS variables
7. **src/views/RulesView.vue** - Updated with CSS variables

## Testing the Theme

1. **Toggle Theme**: Click the theme button in the header
2. **Persistence**: Refresh the page - theme should persist
3. **All Pages**: Navigate through all pages (Dashboard, Tasks, Habits, Rules)
4. **Forms**: Open modals and forms - all inputs should be themed
5. **Buttons**: Check all button states (normal, hover, active)
6. **Cards**: Verify all cards have proper backgrounds and borders

## Dark Theme Specifications

As per requirements:

- ✅ Background color: `#0a0a0a`
- ✅ Text color: White (`#ffffff`)
- ✅ Button borders: Same as light theme
- ✅ Button backgrounds: Dark theme colors
- ✅ Input fields: Full dark background with white text
- ✅ All pages: Dashboard, Tasks, Habits, Rules

## Customization

To customize colors, edit the CSS variables in `src/assets/theme.css`:

```css
/* For light theme */
:root {
  --your-variable: #yourcolor;
}

/* For dark theme */
body.dark-theme {
  --your-variable: #yourdarkcolor;
}
```

## Browser Support

- Modern browsers with CSS custom properties support
- Chrome, Firefox, Safari, Edge (latest versions)
- Smooth transitions supported

## Future Enhancements

1. Add more theme options (e.g., blue theme, green theme)
2. System preference detection (prefers-color-scheme)
3. Per-component theme overrides
4. Theme preview before applying
5. Accessibility improvements (high contrast mode)

## Troubleshooting

### Theme not persisting

- Check localStorage in browser DevTools
- Verify `initTheme` is called in main.js

### Colors not changing

- Ensure CSS variables are used instead of hardcoded colors
- Check if `dark-theme` class is applied to body element

### Transitions not smooth

- Verify `transition` property is set on elements
- Check for conflicting CSS rules

## Support

For issues or questions about the theme implementation, refer to:

- `src/assets/theme.css` for variable definitions
- `src/store/index.js` for theme logic
- This documentation for usage guidelines
