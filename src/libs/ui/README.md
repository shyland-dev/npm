# @shyland-dev/ui

Angular component library by Shyland Dev — inline SVG icons, a notification snackbar, and a customizable select, ready to use.

## Requirements

- Angular **21+**
- Node.js **18+**

## Installation

```bash
npm install @shyland-dev/ui
```

---

## Components

### `<shy-icon>`

Renders an inline SVG icon from the built-in catalog. Supports a _-fill_ variant with a hover transition.

**Selector:** `shy-icon`

| Input            | Type      | Default | Description                                                                                             |
| ---------------- | --------- | ------- | ------------------------------------------------------------------------------------------------------- |
| `hoverFill`      | `boolean` | `false` | Switches to the `*-fill` variant of the icon on mouse hover                                             |
| `hoverFillDelay` | `number`  | `0`     | Transition duration (ms) between the normal and fill states                                             |
| `name`           | `string`  | —       | Icon name; takes priority over the projected content                                                    |
| `label`          | `string`  | —       | Accessible name: becomes `role="img"` + `aria-label`. Without it the icon is decorative (`aria-hidden`) |

**Basic usage:**

```html
<shy-icon>home</shy-icon>
```

**With hover fill:**

```html
<shy-icon [hoverFill]="true" [hoverFillDelay]="200">heart</shy-icon>
```

To add new icons, place `.svg` files in `src/libs/ui/src/assets/svg/` and run:

```bash
npm run generate:icons
```

---

### `<shy-snackbar>`

A temporary notification displayed at the top or bottom of the screen.

**Selector:** `shy-snackbar`

| Input          | Type                | Default    | Description                                               |
| -------------- | ------------------- | ---------- | --------------------------------------------------------- |
| `position`     | `'top' \| 'bottom'` | `'bottom'` | Vertical position of the notification                     |
| `dismissDelay` | `number`            | `3000`     | Time (ms) before auto-dismiss. Set to `0` for manual only |

**Public methods:**

| Method      | Parameters                                    | Description                    |
| ----------- | --------------------------------------------- | ------------------------------ |
| `show()`    | `{ position?, delay?, text? }` (all optional) | Shows the snackbar             |
| `dismiss()` | —                                             | Immediately hides the snackbar |

**Basic usage with static text (ng-content):**

```html
<shy-snackbar #snackbar position="top">Operation completed!</shy-snackbar> <button (click)="snackbar.show()">Show</button>
```

**Usage with `SnackbarService` (dynamic text):**

```typescript
import { SnackbarService } from '@shyland-dev/ui';
import { ViewChild } from '@angular/core';

@Component({
    /* ... */
})
export class AppComponent {
    @ViewChild('snackbar') snackbar!: SnackbarComponent;

    constructor(private snackbarService: SnackbarService) {}

    notify() {
        this.snackbarService.show({
            element: this.snackbar,
            text: 'Saved successfully!',
            position: 'bottom',
            delay: 4000,
        });
    }
}
```

```html
<shy-snackbar #snackbar></shy-snackbar>
```

---

### `<shy-select>`

A fully customizable dropdown select component with icon support.

**Selector:** `shy-select`

| Input            | Type             | Default          | Description                                           |
| ---------------- | ---------------- | ---------------- | ----------------------------------------------------- |
| `selectOptions`  | `SelectOption[]` | `[]`             | Array of options to display in the dropdown           |
| `selectedOption` | `string \| null` | `null`           | Value of the pre-selected option (synced via `value`) |
| `selectIcon`     | `string`         | `'check'`        | Icon shown next to the selected option                |
| `dropdownIcon`   | `string`         | `'chevron-down'` | Icon shown in the trigger button                      |

| Output              | Payload                | Description                           |
| ------------------- | ---------------------- | ------------------------------------- |
| `onSelectionChange` | `SelectionChangeEvent` | Emitted when the user picks an option |

**Basic usage:**

```html
<shy-select [selectOptions]="array" (onSelectionChange)="updateSelection($event)" [selectIcon]="'check'" [dropdownIcon]="'chevron-down'"></shy-select>
```

```typescript
import { SelectOption, SelectionChangeEvent } from '@shyland-dev/ui';

selectedOption = null;

array: SelectOption[] = [
  { id: 0, value: 'test1', label: 'Test' },
  { id: 1, value: 'test2', label: 'This is awesome' },
  { id: 2, value: 'test3', label: 'Testing the select' },
];

updateSelection(event: SelectionChangeEvent) {
  this.selectedOption = event.selectedOption.value;
}
```

---

## Styles

Tokens (colors, typography, spacing, motion, layers), self-hosted fonts (JetBrains Mono, SIL OFL), animations and a base reset ship as one CSS. Pick **one** way to load it:

```json
// angular.json > projects.<app>.architect.build.options.styles (recommended)
"styles": ["node_modules/@shyland-dev/ui/styles/index.css", "src/styles.scss"]
```

```css
/* or in a .css file */
@import '@shyland-dev/ui/styles/index.css';
```

```scss
// or in a .scss file (same content as index.css; do not combine with the above)
@use '@shyland-dev/ui/styles/global';
```

SCSS helpers (no CSS output) are separate: `@use '@shyland-dev/ui/styles' as *;`.

### Theme

Dark is the default and works without JavaScript. Light is applied with `data-theme="light"` on `<html>`, written by `ThemeService`:

```typescript
const theme = inject(ThemeService);
theme.setMode('light'); // 'dark' | 'light' | 'system'
theme.mode(); // chosen mode (signal)
theme.resolved(); // effective 'dark' | 'light' (signal)
theme.toggle();
```

`provideShyTheme({ defaultMode, storageKey })` configures the default mode and the `localStorage` key. `<shy-theme-toggle />` is a ready-made segmented control (`labels` input for translations). To avoid a flash of the wrong theme, put the inline script from the [root README](../../../README.md#tema-escuro-por-padrão) in your `index.html` `<head>`.

### Units

Every length is `calc(var(--shy-responsive-unit) * N)`: `ru(N)` in SCSS, `ru(n)` in TypeScript (`import { ru } from '@shyland-dev/ui'`). Do not use `px`, `rem`, `em`, `vw`, `vh` and similar.

### Design tokens (CSS custom properties)

`--shy-*`, kebab-case. Components use the semantic layer.

| Group      | Examples                                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| Units      | `--shy-responsive-unit`, `--shy-dynamic-height`, `--shy-dynamic-width` (+ `-unit`)                         |
| Primitives | `--shy-{primary,neutral,success,warning,danger,info}-{50…950}`                                             |
| Semantic   | `--shy-color-{bg,surface,text,text-muted,border,focus,…}`, `--shy-color-{primary,success,…}[-text\|-soft]` |
| Type       | `--shy-font-family-*`, `--shy-text-{xs…5xl}`, `--shy-weight-*`, `--shy-leading-*`                          |
| Shape      | `--shy-space-*`, `--shy-radius-*`, `--shy-size-control-*`, `--shy-border-width*`, `--shy-shadow-1…5`       |
| Motion     | `--shy-duration-*`, `--shy-ease-*`, `--shy-motion-distance`                                                |
| Layers     | `--shy-z-{base,raised,dropdown,sticky,fixed,drawer,modal,popover,tooltip,toast}`                           |

### SCSS API

`ru($n)`, `z($layer, $offset)`, `shy-layer`, `up($bp)`/`down($bp)`, `focus-ring`, `shy-state`, `state-layer`, `disabled-state`, `transition`, `visually-hidden`, plus the legacy `fixedHeight`, `fixedWidth`, `fixedSquare`, `square`, `allVendors`, `landscape`, `portrait`, `dark-mode`, `light-mode`. The old `$color-*` palette is gone (`_variables.scss` was removed); use the `--shy-color-*` tokens.

> Breaking in `0.1.0` (components): `--shyIconSize` → `--shy-icon-size`; `--shySelect*` → `--shy-select-*`; `--shySnackbar*` → `--shy-snackbar-*`; the fallback icon for an unknown name is `question-circle`.
>
> Breaking in `0.1.0` (globals): `--responsive-unit`, `--dynamic-*`, `$responsive-unit` and `$dynamic-*` no longer exist (no alias). Use `--shy-responsive-unit` / `ru(N)` and `--shy-dynamic-*`.

### Snackbar Tokens

The `<shy-snackbar>` component can be customized via CSS custom properties on a parent element or `:root`:

| Token                        | Default                      | Description                      |
| ---------------------------- | ---------------------------- | -------------------------------- |
| `--shy-snackbar-bg`          | `--shy-color-surface-raised` | Background                       |
| `--shy-snackbar-fg`          | `--shy-color-text`           | Text and icon color              |
| `--shy-snackbar-border`      | `--shy-color-border-strong`  | Border color                     |
| `--shy-snackbar-width`       | `ru(110)`                    | Minimum width                    |
| `--shy-snackbar-radius`      | `--shy-radius-md`            | Border radius                    |
| `--shy-snackbar-offset`      | `ru(15)`                     | Distance from top or bottom edge |
| `--shy-snackbar-font-family` | `--shy-font-family-base`     | Font family                      |
| `--shy-snackbar-font-size`   | `--shy-text-md`              | Font size                        |
| `--shy-snackbar-icon-size`   | `--shy-size-icon-md`         | Size of the dismiss icon         |

### Select Tokens

The `<shy-select>` component can be customized via CSS custom properties:

| Token                            | Default                       | Description                        |
| -------------------------------- | ----------------------------- | ---------------------------------- |
| `--shy-select-height`            | `--shy-size-control-lg`       | Minimum height of the trigger      |
| `--shy-select-width`             | `ru(90)`                      | Minimum width                      |
| `--shy-select-radius`            | `--shy-radius-md`             | Border radius of trigger and panel |
| `--shy-select-bg`                | `--shy-color-surface-sunken`  | Trigger background                 |
| `--shy-select-fg`                | `--shy-color-text`            | Text and icon color                |
| `--shy-select-border`            | `--shy-color-border-strong`   | Trigger border color               |
| `--shy-select-font-family`       | `--shy-font-family-base`      | Font family                        |
| `--shy-select-font-size`         | `--shy-text-md`               | Font size                          |
| `--shy-select-icon-size`         | `--shy-size-icon-md`          | Size of the internal icons         |
| `--shy-select-panel-bg`          | `--shy-color-surface-raised`  | Panel background                   |
| `--shy-select-panel-shadow`      | `--shy-shadow-3`              | Panel shadow                       |
| `--shy-select-selected-fg`       | `--shy-color-primary-text`    | Selected option color              |
| `--shy-select-option-hover-bg`   | `--shy-color-primary-soft`    | Option background on hover/focus   |
| `--shy-select-option-hover-fg`   | `--shy-color-on-primary-soft` | Option text on hover/focus         |
| `--shy-select-option-img-radius` | `--shy-radius-full`           | Option image radius                |

---

## Exports

```typescript
// Components
export { IconComponent } from './lib/components/icon/icon.component';
export { SelectComponent } from './lib/components/select/select.component';
export { SnackbarComponent } from './lib/components/snackbar/snackbar.component';
export { ThemeToggleComponent, ShyThemeToggleLabels } from './lib/components/theme-toggle/theme-toggle.component';

// Services
export { SnackbarService } from './lib/services/snackbar/snackbar.service';
export { ThemeService, provideShyTheme, SHY_THEME_CONFIG, ShyThemeMode, ShyResolvedTheme, ShyThemeConfig } from './lib/services/theme/theme.service';

// Utilities
export { ru } from './lib/utils/ru';

// Interfaces
export { SelectOption, SelectionChangeEvent } from './lib/interfaces/select/select.interface';
export { SnackbarShowOptions } from './lib/interfaces/snackbar/snackbar.interface';

// Types
export { SnackbarPosition } from './lib/types/snackbar/snackbar.type';

// Icons
export { ICONS } from './lib/components/icon/icons';
```

---

## Repository

[github.com/shyland-dev/npm](https://github.com/shyland-dev/npm)
