# @shyland-dev/ui

Angular component library by Shyland Dev — inline SVG icons and a notification snackbar, ready to use.

## Requirements

- Angular **17+**
- Node.js **18+**

## Installation

```bash
npm install @shyland-dev/ui
```

---

## Components

### `<shy-icon>`

Renders an inline SVG icon from the built-in catalog. Supports a _filled_ variant with a hover transition.

**Selector:** `shy-icon`

| Input            | Type      | Default | Description                                                      |
| ---------------- | --------- | ------- | ---------------------------------------------------------------- |
| `hoverFill`      | `boolean` | `false` | Switches to the `*-filled` variant of the icon on mouse hover    |
| `hoverFillDelay` | `number`  | `0`     | Transition duration (ms) between the normal and filled states    |

**Basic usage:**

```html
<shy-icon>home</shy-icon>
```

**With hover fill:**

```html
<shy-icon [hoverFill]="true" [hoverFillDelay]="200">heart</shy-icon>
```

#### Available icons

Each icon has a `name` (outline) variant and a `name-filled` (filled) variant, except where noted.

| Name            | Filled variant |
| --------------- | -------------- |
| `alert`         | ✓              |
| `bell`          | ✓              |
| `box`           | ✓              |
| `check`         | —              |
| `chevron-down`  | —              |
| `chevron-right` | —              |
| `download`      | —              |
| `edit`          | —              |
| `eye`           | —              |
| `grid`          | ✓              |
| `heart`         | ✓              |
| `help`          | ✓              |
| `home`          | ✓              |
| `info`          | ✓              |
| `layers`        | —              |
| `lock`          | ✓              |
| `mail`          | ✓              |

> If an icon name is not found, the `help` icon is used as a fallback.

To add new icons, place `.svg` files in `projects/shyland-dev/ui/src/assets/svg/` and run:

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

| Method      | Parameters                                          | Description                    |
| ----------- | --------------------------------------------------- | ------------------------------ |
| `show()`    | `{ position?, delay?, text? }` (all optional)       | Shows the snackbar             |
| `dismiss()` | —                                                   | Immediately hides the snackbar |

**Basic usage with static text (ng-content):**

```html
<shy-snackbar #snackbar position="top">Operation completed!</shy-snackbar>
<button (click)="snackbar.show()">Show</button>
```

**Usage with `SnackbarService` (dynamic text):**

```typescript
import { SnackbarService } from '@shyland-dev/ui';
import { ViewChild } from '@angular/core';

@Component({ /* ... */ })
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

## Styles

The package exports a set of design tokens and SCSS variables. Import them in your `styles.scss`:

```scss
@use '@shyland-dev/ui' as shy;
```

### Design Tokens (CSS custom properties)

| Token             | Default value                          |
| ----------------- | -------------------------------------- |
| `--primary`       | `#3880ff`                              |
| `--secondary`     | `#3dc2ff`                              |
| `--tertiary`      | `#5260ff`                              |
| `--success`       | `#2dd36f`                              |
| `--warning`       | `#ffc409`                              |
| `--danger`        | `#eb445a`                              |
| `--dark`          | `#222428`                              |
| `--medium`        | `#92949c`                              |
| `--light`         | `#f4f5f8`                              |
| `--headerHeight`  | `5 * responsiveUnit`                   |
| `--footerHeight`  | `4 * responsiveUnit`                   |
| `--dynamicHeight` | `100dvh` (with fallback to `100vh`)    |

---

## Exports

```typescript
// Components
export { IconComponent } from './lib/components/icon/icon.component';
export { SnackbarComponent } from './lib/components/snackbar/snackbar.component';

// Services
export { SnackbarService } from './lib/services/snackbar/snackbar.service';

// Interfaces
export { SnackbarShowOptions } from './lib/interfaces/snackbar/snackbar.interface';

// Types
export { SnackbarPosition } from './lib/types/snackbar/snackbar.type';

// Icons
export { ICONS } from './lib/components/icon/icons';
```

---

## Repository

[github.com/shyland-dev/npm](https://github.com/shyland-dev/npm)
