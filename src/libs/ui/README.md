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

| Input            | Type      | Default | Description                                                 |
| ---------------- | --------- | ------- | ----------------------------------------------------------- |
| `hoverFill`      | `boolean` | `false` | Switches to the `*-fill` variant of the icon on mouse hover |
| `hoverFillDelay` | `number`  | `0`     | Transition duration (ms) between the normal and fill states |

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

The package exports a set of design tokens and SCSS variables. Import them in your `styles.scss`:

```scss
@use '@shyland-dev/ui/styles' as *;
```

### Global Design Tokens (CSS custom properties)

| Token               | Default value                       |
| ------------------- | ----------------------------------- |
| `--responsive-unit` | fluid unit based on viewport + rem  |
| `--dynamic-height`  | `100dvh` (with fallback to `100vh`) |
| `--dynamic-width`   | `100dvw` (with fallback to `100vw`) |

### SCSS Variables

| Variable               | Value                        |
| ---------------------- | ---------------------------- |
| `$color-void`          | `#ffffff00`                  |
| `$color-primary`       | `#3880ff`                    |
| `$color-secondary`     | `#3dc2ff`                    |
| `$color-tertiary`      | `#5260ff`                    |
| `$color-success`       | `#2dd36f`                    |
| `$color-warning`       | `#ffc409`                    |
| `$color-danger`        | `#eb445a`                    |
| `$color-dark`          | `#222428`                    |
| `$color-medium`        | `#92949c`                    |
| `$color-light`         | `#f4f5f8`                    |
| `$color-black`         | `#000000`                    |
| `$color-white`         | `#ffffff`                    |
| `$responsive-unit`     | `var(--responsive-unit)`     |
| `$dynamic-height`      | `var(--dynamic-height)`      |
| `$dynamic-height-unit` | `var(--dynamic-height-unit)` |
| `$dynamic-width`       | `var(--dynamic-width)`       |
| `$dynamic-width-unit`  | `var(--dynamic-width-unit)`  |

### Snackbar Tokens

The `<shy-snackbar>` component can be customized via CSS custom properties on a parent element or `:root`:

| Token                       | Default                    | Description                      |
| --------------------------- | -------------------------- | -------------------------------- |
| `--shySnackbarBackground`   | `$color-dark` (`#222428`)  | Background color                 |
| `--shySnackbarColor`        | `$color-white` (`#ffffff`) | Text and icon color              |
| `--shySnackbarWidth`        | `110 * responsive-unit`    | Width                            |
| `--shySnackbarBorderRadius` | `2 * responsive-unit`      | Border radius                    |
| `--shySnackbarOffset`       | `15 * responsive-unit`     | Distance from top or bottom edge |
| `--shySnackbarFontFamily`   | `monospace`                | Font family of the message text  |
| `--shySnackbarFontSize`     | `7 * responsive-unit`      | Font size of the message text    |
| `--shySnackbarIconSize`     | `8 * responsive-unit`      | Size of the dismiss icon         |

### Select Tokens

The `<shy-select>` component can be customized via CSS custom properties:

| Token                              | Default                                 | Description                            |
| ---------------------------------- | --------------------------------------- | -------------------------------------- |
| `--shySelectHeight`                | `20 * responsive-unit`                  | Minimum height of the trigger          |
| `--shySelectWidth`                 | `90 * responsive-unit`                  | Minimum width of the component         |
| `--shySelectBorderRadius`          | `2 * responsive-unit`                   | Border radius of trigger and dropdown  |
| `--shySelectBackground`            | `$color-black` (`#000000`)              | Background color of the trigger        |
| `--shySelectColor`                 | `$color-white` (`#ffffff`)              | Text and icon color                    |
| `--shySelectFontFamily`            | `monospace`                             | Font family                            |
| `--shySelectFontSize`              | `6 * responsive-unit`                   | Font size                              |
| `--shySelectIconSize`              | `8 * responsive-unit`                   | Size of all icons inside the component |
| `--shySelectDropdownBackground`    | `$color-dark` (`#222428`)               | Background color of the dropdown panel |
| `--shySelectDropdownBoxShadow`     | `0 0 1.5ru 0.1ru $color-white`          | Box shadow of the dropdown panel       |
| `--shySelectSelectedColor`         | `$color-primary` (`#3880ff`)            | Color of the selected option           |
| `--shySelectOptionHoverBackground` | `$color-dark` lightened 20% (`#51565f`) | Hover background of an option row      |
| `--shySelectOptionHoverColor`      | `$color-black` (`#000000`)              | Text color of an option row on hover   |
| `--shySelectOptionImgBorderRadius` | `50%`                                   | Border radius of the option image      |

---

## Exports

```typescript
// Components
export { IconComponent } from './lib/components/icon/icon.component';
export { SelectComponent } from './lib/components/select/select.component';
export { SnackbarComponent } from './lib/components/snackbar/snackbar.component';

// Services
export { SnackbarService } from './lib/services/snackbar/snackbar.service';

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
