# @shyland-dev/ui

Angular component library by Shyland Dev — inline SVG icons, toast notifications, and a customizable select, ready to use.

## Requirements

- Angular **21+** (`@angular/core`, `@angular/common` and `@angular/forms` as peer dependencies)
- Node.js **18+**

## Installation

```bash
npm install @shyland-dev/ui
```

---

## Components

### `button[shyButton]`, `a[shyButton]`

Action button on the native element. Icons go in `slot="start"` / `slot="end"`.

```html
<button shyButton type="submit" [loading]="saving()" loadingPosition="start" loadingText="Saving…"><shy-icon slot="start">check-lg</shy-icon>Save</button> <a shyButton variant="link" routerLink="/docs">Docs</a>
```

| Input             | Type                                                                     | Default     | Description                                                                                                   |
| ----------------- | ------------------------------------------------------------------------ | ----------- | ------------------------------------------------------------------------------------------------------------- |
| `variant`         | `'solid' \| 'soft' \| 'outline' \| 'ghost' \| 'link'`                    | `'solid'`   | Visual style                                                                                                  |
| `intent`          | `'primary' \| 'neutral' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'primary'` | Color intent                                                                                                  |
| `size`            | `'sm' \| 'md' \| 'lg'`                                                   | `'md'`      | Height from `--shy-size-control-*` (larger on coarse pointers)                                                |
| `loading`         | `boolean`                                                                | `false`     | `aria-busy` + `aria-disabled`, clicks (and form submit) ignored, focus kept (no native `disabled`)            |
| `loadingPosition` | `'start' \| 'end' \| 'replace'`                                          | `'replace'` | `replace`: content transparent under the spinner, same width. `start`/`end`: spinner in place of that icon    |
| `loadingText`     | `string`                                                                 | —           | Replaces the label while loading (`start`/`end` only); the button reserves the width of the longer of the two |
| `block`           | `boolean`                                                                | `false`     | Full width                                                                                                    |
| `disabled`        | `boolean`                                                                | `false`     | `<button>`: native `disabled`. `<a>`: `aria-disabled="true"` and the click/navigation is blocked              |

With `start`/`end` and no icon on that side the spinner is added and the button grows; use `replace` when the width must not change. The spinner is a decorative `<shy-spinner>` (`ring`) at the icon size; with reduced motion it stops turning and only fades.

### `button[shyIconButton]`

Icon-only button. `label` is required and becomes the `aria-label`.

```html
<button shyIconButton type="button" label="Close" (click)="close()"><shy-icon>x-lg</shy-icon></button>
```

| Input     | Type                                        | Default     | Description                                            |
| --------- | ------------------------------------------- | ----------- | ------------------------------------------------------ |
| `label`   | `string` (required)                         | —           | Accessible name                                        |
| `variant` | `'solid' \| 'soft' \| 'outline' \| 'ghost'` | `'ghost'`   | Visual style                                           |
| `intent`  | same as Button                              | `'neutral'` | Color intent                                           |
| `size`    | `'sm' \| 'md' \| 'lg'`                      | `'md'`      | Square side `--shy-size-control-*` (≥ 44 px on phones) |

### `<shy-spinner>`

Activity without known duration. Color comes from `currentColor` (or `--shy-spinner-color`).

```html
<shy-spinner label="Loading orders" /> <shy-spinner variant="dots" size="sm" />
```

| Input     | Type                                                                                      | Default  | Description                                                                                |
| --------- | ----------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------ |
| `variant` | `'ring' \| 'ring-track' \| 'dash' \| 'dots' \| 'bars' \| 'pulse' \| 'orbit' \| 'breathe'` | `'ring'` | Drawing                                                                                    |
| `size`    | `'xs' \| 'sm' \| 'md' \| 'lg'`                                                            | `'md'`   | `--shy-size-icon-{sm,md,lg}` and `ru(16)`                                                  |
| `label`   | `string`                                                                                  | —        | With it: `role="status"` + text for screen readers. Without it: `aria-hidden` (decorative) |

With `prefers-reduced-motion` or `data-motion="reduced"` every variant stops moving and only fades (opacity pulse, 2 s cycle).

### `<shy-skeleton>`

Content placeholder. Decorative (`aria-hidden`): put `aria-busy="true"` on the region being loaded and announce it once (e.g. a `<shy-spinner label>`).

```html
<section [attr.aria-busy]="loading()">
    @if (loading()) {
    <shy-skeleton shape="circle" /> <shy-skeleton lines="3" />
    } @else { … }
</section>
```

| Input       | Type                           | Default     | Description                                          |
| ----------- | ------------------------------ | ----------- | ---------------------------------------------------- |
| `shape`     | `'text' \| 'circle' \| 'rect'` | `'text'`    | Line(s), circle or block                             |
| `lines`     | `number`                       | `1`         | Lines of `text` (the last one is shorter when > 1)   |
| `animation` | `'shimmer' \| 'still'`         | `'shimmer'` | Shimmer becomes an opacity pulse with reduced motion |

### `<shy-progress>`, `<shy-progress-circular>`

Progress bar, linear or circular, with `role="progressbar"`, `aria-valuemin="0"`, `aria-valuemax` and `aria-valuenow`. Without `value` it is indeterminate (no `aria-valuenow`). Give it a name with `label` or `aria-labelledby`.

```html
<shy-progress [value]="uploaded()" label="Upload" /> <shy-progress-circular label="Loading" size="sm" />
```

| Input   | Type                                                                   | Default | Description                                                         |
| ------- | ---------------------------------------------------------------------- | ------- | ------------------------------------------------------------------- |
| `value` | `number \| null`                                                       | `null`  | Current value, clamped to `[0, max]`; `null` = indeterminate        |
| `max`   | `number`                                                               | `100`   | Invalid or ≤ 0 falls back to 100                                    |
| `label` | `string`                                                               | —       | `aria-label`                                                        |
| `size`  | linear `'sm' \| 'md' \| 'lg'`; circular `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'`  | Linear: thickness `--shy-space-{1,2,3}`. Circular: as `shy-spinner` |

The value change animates `transform`/`stroke-dashoffset` (never `width`). Indeterminate with reduced motion: the linear bar fills the track and the circular arc stops; both only fade.

### `input[shyInput]`, `textarea[shyInput]`, `<shy-form-field>`

Text field on the native element, so `ngModel`, `formControl` and `formControlName` work as usual (no custom ControlValueAccessor). Wrap it in `<shy-form-field>` for label, hint, error and counter; the field wires `for`/`id`, `aria-describedby` (hint + error), `aria-invalid` and `aria-errormessage`. The error appears after the control is touched, changed or the form is submitted (`markAllAsTouched`), always with an icon and text, in a polite live region.

```html
<shy-form-field label="Email" hint="We never share it" [error]="emailError()" [counter]="true">
    <shy-icon slot="prefix" name="envelope" />
    <input shyInput type="email" formControlName="email" required maxlength="80" />
</shy-form-field>
<textarea shyInput rows="4"></textarea>
```

| Input (`shyInput`) | Type                   | Default | Description                                                                              |
| ------------------ | ---------------------- | ------- | ---------------------------------------------------------------------------------------- |
| `shyInput`         | `'sm' \| 'md' \| 'lg'` | `'md'`  | Size; the field's `size` wins when set                                                   |
| `invalid`          | `boolean`              | —       | Forces the state; otherwise it comes from the `NgControl` (invalid and touched or dirty) |
| `required`         | `boolean`              | `false` | Native `required`; also marks the label with `*`                                         |
| `maxlength`, `id`  | `number`, `string`     | —       | Native; `id` replaces the generated one (the label's `for` follows)                      |

| Input (`shy-form-field`) | Type                   | Default | Description                                                     |
| ------------------------ | ---------------------- | ------- | --------------------------------------------------------------- |
| `label`, `hint`          | `string`               | —       | Label (`<label for>`) and hint (part of `aria-describedby`)     |
| `error`                  | `string`               | —       | Message shown while the field is invalid                        |
| `invalid`                | `boolean`              | —       | Forces the state (e.g. a server error)                          |
| `required`               | `boolean`              | `false` | Adds `*` (`aria-hidden`); the control's `required` also adds it |
| `counter`                | `boolean`              | `false` | `n/maxlength` (just `n` without `maxlength`)                    |
| `size`                   | `'sm' \| 'md' \| 'lg'` | —       | Overrides the control's size                                    |

Slots: `slot="prefix"` / `slot="suffix"` take a square of the field height inside the box and make room in the text (prefix ignores the pointer; suffix accepts a `shyIconButton`). Without `shy-form-field` the input works alone (no label/error/slots).

### `<shy-checkbox>`, `<shy-switch>`

Boolean controls over a native `<input type="checkbox">` (the switch adds `role="switch"`), visually hidden but focusable: Space, focus and screen-reader state come from the browser. The text is the projected content, or `label` (`aria-label`) when there is none. Use `[(checked)]`, `ngModel` or `formControl` (boolean value). The checked glyph (check, dash) and the thumb position show the state, so it never depends on color alone.

```html
<shy-checkbox [(checked)]="accepted">I accept the terms</shy-checkbox>
<shy-checkbox [checked]="all()" [indeterminate]="some()" (checkedChange)="toggleAll($event)">All</shy-checkbox>
<shy-switch formControlName="notifications">Notifications</shy-switch>
```

| Input                               | Type      | Default | Description                                                                              |
| ----------------------------------- | --------- | ------- | ---------------------------------------------------------------------------------------- |
| `checked` (`model`)                 | `boolean` | `false` | Two-way                                                                                  |
| `indeterminate` (`model`, checkbox) | `boolean` | `false` | Mixed state; the native input reports `mixed` and it clears on the first click           |
| `disabled`, `required`              | `boolean` | `false` | Native; `disabled` also follows the form control                                         |
| `invalid`                           | `boolean` | —       | Forces the state; otherwise it comes from the `NgControl` (invalid and touched or dirty) |
| `label`, `name`, `value`, `id`      | `string`  | —       | `aria-label`, and the native attributes                                                  |

### `<shy-radio-group>`, `<shy-radio>`

`role="radiogroup"` with one native `<input type="radio">` per option, all sharing the same `name`, so the browser does the roving tabindex (Tab enters the checked option, or the first) and the arrows, which move and select (disabled options are skipped). The value is whatever `value` the `shy-radio` has (compared with `Object.is`). Name the group with `label`, or put it inside `shy-form-field` with a `label` (`aria-labelledby`).

```html
<shy-radio-group label="Plan" [(value)]="plan">
    <shy-radio value="free">Free</shy-radio>
    <shy-radio value="pro">Pro</shy-radio>
</shy-radio-group>
<shy-form-field label="Size" error="Choose a size">
    <shy-radio-group formControlName="size">
        <shy-radio value="s">Small</shy-radio>
        <shy-radio value="l">Large</shy-radio>
    </shy-radio-group>
</shy-form-field>
```

| Input                                      | Type                         | Default      | Description                                          |
| ------------------------------------------ | ---------------------------- | ------------ | ---------------------------------------------------- |
| `value` (`model`, group) / `value` (radio) | `unknown`                    | —            | Selected value / the option's value                  |
| `orientation` (group)                      | `'vertical' \| 'horizontal'` | `'vertical'` | Layout                                               |
| `disabled`, `required`, `invalid` (group)  | `boolean`                    | —            | `aria-disabled`, `aria-required`, `aria-invalid`     |
| `label`, `name` (group)                    | `string`                     | —            | `aria-label`; native `name` (generated when omitted) |
| `disabled`, `label` (radio)                | `boolean`, `string`          | —            | One disabled option; `aria-label`                    |

The error of a `shy-form-field` shows after the focus leaves the group or the form is submitted.

### `<shy-badge>`

Short label for a state or category. The text says the meaning; color only reinforces it. `count` shows a number (`max+` past `max`), `dot` adds a decorative dot (dot-only badges need `label`, which becomes `role="img"`), `removable` adds a button (`removeLabel` is its accessible name) that emits `removed`.

```html
<shy-badge intent="success" variant="solid">Paid</shy-badge> <shy-badge intent="danger" [count]="150" /> <shy-badge [removable]="true" removeLabel="Remove Angular" (removed)="drop()">Angular</shy-badge>
```

| Input                      | Type                                                                     | Default             | Description                                   |
| -------------------------- | ------------------------------------------------------------------------ | ------------------- | --------------------------------------------- |
| `intent`                   | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'neutral'`         | Color role                                    |
| `variant`                  | `'soft' \| 'solid' \| 'outline'`                                         | `'soft'`            | Fill                                          |
| `size`                     | `'sm' \| 'md'`                                                           | `'md'`              | Size                                          |
| `dot`                      | `boolean`                                                                | `false`             | Decorative dot before the text                |
| `count`, `max`             | `number`                                                                 | —, `99`             | Number shown instead of the text              |
| `label`                    | `string`                                                                 | —                   | `aria-label` + `role="img"` (dot-only badges) |
| `removable`, `removeLabel` | `boolean`, `string`                                                      | `false`, `'Remove'` | Remove button and its name; output `removed`  |

### `<shy-divider>`

`role="separator"` (the vertical one adds `aria-orientation="vertical"`). Optional text between the lines (horizontal only) is visual; do not put essential information in it. For `orientation="vertical"` use it in a flex row (it stretches).

```html
<shy-divider /> <shy-divider>or</shy-divider> <shy-divider orientation="vertical" />
```

### `shy-card`, `a[shyCard]`, `button[shyCard]`

Container with slots `slot="header"`, the body (default) and `slot="footer"`, and `elevation` 0 to 3 (`--shy-shadow-*`). `<shy-card>` is static. For a clickable card use a native element, `<a shyCard href>` or `<button shyCard>`: it gets the focus ring, hover (`@media (hover: hover)`) and pressed state, and Enter/Space come from the browser. An interactive card must not contain other links or buttons.

```html
<shy-card [elevation]="2"> <span slot="header">Title</span> Body <span slot="footer">Footer</span> </shy-card> <a shyCard href="/docs"><span slot="header">Docs</span> Read more</a>
```

| Input       | Type               | Default | Description            |
| ----------- | ------------------ | ------- | ---------------------- |
| `elevation` | `0 \| 1 \| 2 \| 3` | `1`     | `--shy-shadow-{1,2,3}` |

### `<shy-alert>`

Highlighted message in the page (not a toast): an icon that changes per intent, `heading`, the projected message and an action (`slot="action"`). It never informs by color alone. `role="status"` by default; `urgent` makes it `role="alert"` only for `warning`/`danger` (`info`/`success` are always `status`), and applies to content that appears after the page loads. `dismissible` adds a close button (`dismissLabel`), hides the alert and emits `dismissed`; moving focus afterwards is up to the app.

```html
<shy-alert intent="danger" heading="Could not save" [urgent]="true" [dismissible]="true" (dismissed)="clear()">
    Check your connection.
    <button slot="action" shyButton size="sm" variant="outline" intent="danger">Retry</button>
</shy-alert>
```

| Input                         | Type                                           | Default              | Description                                                            |
| ----------------------------- | ---------------------------------------------- | -------------------- | ---------------------------------------------------------------------- |
| `intent`                      | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'`             | Color and default icon                                                 |
| `heading`                     | `string`                                       | —                    | Short title (not `title`: the browser would add a tooltip to the host) |
| `icon`                        | `string`                                       | by `intent`          | Icon name from the catalog                                             |
| `urgent`                      | `boolean`                                      | `false`              | `role="alert"` (only `warning`/`danger`)                               |
| `dismissible`, `dismissLabel` | `boolean`, `string`                            | `false`, `'Dismiss'` | Close button and its name                                              |

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

### `SnackbarService` (toasts)

Temporary notifications: no element in the template, no `viewChild`. The container is created on the first call in the `toast` layer of the `OverlayService`.

```typescript
const snackbar = inject(SnackbarService);

snackbar.show('Saved');
snackbar.show('Could not save', { intent: 'danger' });
const ref = snackbar.show('Item deleted', { action: { label: 'Undo' }, position: 'bottom', align: 'start' });
if ((await ref.closed) === 'action') restore();
```

| Option     | Type                                              | Default                   | Description                                                                             |
| ---------- | ------------------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------- |
| `intent`   | `neutral \| info \| success \| warning \| danger` | `neutral`                 | Icon + color (never only color); `danger` uses `role="alert"`, the rest `role="status"` |
| `action`   | `{ label: string }`                               | none                      | Action button; `ref.closed` resolves `'action'`. Hidden while a modal is open           |
| `duration` | `number` (ms)                                     | 5000 (8000 with `action`) | `0` never closes by itself (only X or `dismiss()`)                                      |
| `position` | `'top' \| 'bottom'`                               | `'bottom'`                |                                                                                         |
| `align`    | `'start' \| 'center' \| 'end'`                    | `'center'`                | `start`/`end` follow the text direction (RTL)                                           |

- Returns `ShySnackbarRef`: `dismiss()` and `closed: Promise<'timeout' \| 'dismiss' \| 'action'>`. `dismissAll()` closes every toast, queued ones included.
- Queue: up to `maxVisible` (3) on screen, the rest wait. Defaults: `provideShySnackbar({ maxVisible, duration, durationWithAction, dismissLabel })` (optional, in `providers`).
- The timer pauses while the pointer or focus is on the toast and while the tab is hidden, and resumes with what was left (WCAG 2.2.1).
- A modal makes everything outside it `inert`, the toast included: with a modal open the action button is hidden (the text is still announced; the X is not clickable until the modal closes, the timer keeps running). Esc and outside clicks are not captured by the toast container.
- **Removed in 1.0:** `<shy-snackbar>` and `SnackbarService.show({ element, position, delay, text })`. Migration: remove `<shy-snackbar>` and the `viewChild`, call `show(text, { position, duration: delay })`.
- Tokens (`--shy-snackbar-*`) go on `:root` or an ancestor of `<body>`: the container lives in the overlay layer. Needs `styles/index.css` (ships `snackbar.css`).

---

### `<shy-select>`

Select-only combobox (APG) on the `OverlayService`: focus stays on the button (`role="combobox"`) and the active option is announced with `aria-activedescendant`; the list (`role="listbox"`) opens in the `dropdown` layer with the button's width, flips when there is no room and works inside a Dialog.

**Selector:** `shy-select` (`exportAs: shySelect`)

```html
<!-- ngModel, formControl/formControlName or [(value)] -->
<shy-form-field label="Country" hint="Pick one">
    <shy-select [options]="countries" [formControl]="country" placeholder="Choose a country" />
</shy-form-field>
<shy-select [options]="tags" [(value)]="selectedTags" multiple label="Topics" />
```

```typescript
countries: ShySelectOption[] = [
  { value: 'br', label: 'Brazil', img: 'assets/flag-br.svg' },
  { value: 'jp', label: 'Japan', disabled: true },
];
```

| Input                                           | Type                  | Default                 | Description                                                                      |
| ----------------------------------------------- | --------------------- | ----------------------- | -------------------------------------------------------------------------------- |
| `options`                                       | `ShySelectOption[]`   | `[]`                    | `{ value, label, disabled?, img? }`; `value` can be any type                     |
| `value` (`model`)                               | `unknown`             | `null`                  | Chosen value (an array with `multiple`); also written by `ngModel`/`formControl` |
| `multiple`                                      | `boolean`             | `false`                 | Toggles options, keeps the list open, value is an array                          |
| `placeholder`                                   | `string`              | none                    | Text without a choice (the projected content works too)                          |
| `compareWith`                                   | `(a, b) => boolean`   | `===`                   | Compare object values                                                            |
| `disabled`, `invalid`, `required`, `name`, `id` | as the other controls | —                       | `invalid` forces the state; otherwise it comes from the control (touched/dirty)  |
| `label`                                         | `string`              | none                    | `aria-label` when there is no `shy-form-field` label                             |
| `selectIcon`, `dropdownIcon`                    | `string`              | `check`, `chevron-down` | Icons                                                                            |

- Keys: ↓/↑/Enter/Space open; ↓/↑/Home/End move the active option (disabled ones are skipped); Enter/Space choose; typing jumps to the option that starts with the letters; Esc closes (focus stays on the button); Tab closes and moves on.
- Inside `shy-form-field` the button gets the label's `for`/`id`, `aria-describedby`, `aria-invalid` and `aria-errormessage`.
- **Removed in 1.0:** `selectOptions` (`SelectOption[]`) → `options`; `selectedOption` (string) → `[(value)]`/`ngModel`/`formControl`; `(onSelectionChange)` → `(valueChange)`; `SelectOption` and `SelectionChangeEvent` → `ShySelectOption`.
- The panel lives in the overlay container: panel tokens (`--shy-select-panel-*`, `--shy-select-option-*`) go on `:root` or an ancestor of `<body>`; button tokens go on the element.

---

### `<shy-combobox>`

Text field with a list of suggestions (APG combobox with list autocomplete) on the `OverlayService`: focus stays on the `<input role="combobox">` and the active option is announced with `aria-activedescendant`; the list (`role="listbox"`) opens in the `dropdown` layer with the field's width. Same options and value as `shy-select`, but **single value and no free text**: leaving the field restores the text of the chosen option, and clearing the text clears the value.

**Selector:** `shy-combobox` (`exportAs: shyCombobox`)

```html
<shy-form-field label="Country" hint="Type to filter">
    <shy-combobox [options]="countries" [formControl]="country" placeholder="Search a country" />
</shy-form-field>
<shy-combobox [options]="countries" [(value)]="selected" label="Country" emptyText="Nothing found" />
```

| Input                                           | Type                         | Default                         | Description                                                     |
| ----------------------------------------------- | ---------------------------- | ------------------------------- | --------------------------------------------------------------- |
| `options`                                       | `ShySelectOption[]`          | `[]`                            | `{ value, label, disabled? }` (`img` is ignored)                |
| `value` (`model`)                               | `unknown`                    | `null`                          | Chosen value; also written by `ngModel`/`formControl`           |
| `placeholder`                                   | `string`                     | none                            | Text without a choice                                           |
| `compareWith`                                   | `(a, b) => boolean`          | `===`                           | Compare object values                                           |
| `filterFn`                                      | `(option, query) => boolean` | `contains`, no accents, no case | Decides which options match the typed text                      |
| `emptyText`                                     | `string`                     | `No results`                    | Shown (in a `role="status"` region) when nothing matches        |
| `dropdownIcon`                                  | `string`                     | `chevron-down`                  | Icon                                                            |
| `disabled`, `invalid`, `required`, `name`, `id` | as the other controls        | —                               | `invalid` forces the state; otherwise it comes from the control |
| `label`                                         | `string`                     | none                            | `aria-label` when there is no `shy-form-field` label            |

- Keys: typing opens and filters; ↓ opens, ↓/↑ move the active option (disabled ones are skipped); Enter chooses; Esc closes and restores the text; Tab closes and moves on; Home/End keep moving the text cursor. The list is not filtered while the text is just the chosen label.
- The panel lives in the overlay container: panel tokens (`--shy-combobox-panel-*`, `--shy-combobox-option-*`, `--shy-combobox-empty-fg`) go on `:root`; field tokens go on the element.

---

### `<shy-slider>`

Single-value slider on the native `<input type="range">`: arrows, Page Up/Down and Home/End, `role="slider"` and `aria-valuenow/min/max` come from the browser. For a range, use two sliders (a two-thumb slider is not part of this version).

**Selector:** `shy-slider` (`exportAs: shySlider`)

```html
<shy-slider [(value)]="volume" label="Volume" showValue /> <shy-form-field label="Maximum price"><shy-slider [formControl]="price" [min]="0" [max]="1000" [step]="50" [displayWith]="money" showValue /></shy-form-field>
```

| Input                                           | Type                        | Default   | Description                                                     |
| ----------------------------------------------- | --------------------------- | --------- | --------------------------------------------------------------- |
| `value` (`model`)                               | `number`                    | `0`       | Current value; also written by `ngModel`/`formControl`          |
| `min`, `max`, `step`                            | `number`                    | 0, 100, 1 | Range and step                                                  |
| `displayWith`                                   | `(value: number) => string` | none      | Formats the value for `aria-valuetext` and for `showValue`      |
| `showValue`                                     | `boolean`                   | `false`   | Shows the value next to the control                             |
| `disabled`, `invalid`, `required`, `name`, `id` | as the other controls       | —         | `invalid` forces the state; otherwise it comes from the control |
| `label`                                         | `string`                    | none      | `aria-label` when there is no `shy-form-field` label            |

---

### `<shy-file-dropzone>`

Area to choose or drop files. A native `<input type="file">` covers the area, so click, Enter and Space open the picker and the input takes the keyboard focus. **It only selects and validates files; it never uploads.** The value is a `File[]`.

**Selector:** `shy-file-dropzone` (`exportAs: shyFileDropzone`)

```html
<shy-form-field label="Attachments" hint="Images or PDF, up to 1 MB each">
    <shy-file-dropzone [formControl]="docs" accept="image/*,.pdf" [maxSize]="1048576" multiple (rejected)="onRejected($event)" />
</shy-form-field>
<shy-file-dropzone [(files)]="avatar" label="Avatar" accept="image/*">Drag your avatar here</shy-file-dropzone>
```

| Input / Output                                  | Type                  | Default                                        | Description                                                                    |
| ----------------------------------------------- | --------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------ |
| `files` (`model`)                               | `File[]`              | `[]`                                           | Chosen files; also written by `ngModel`/`formControl`                          |
| `accept`                                        | `string`              | `''`                                           | Extensions (`.pdf`), types (`image/png`) and wildcards (`image/*`)             |
| `multiple`                                      | `boolean`             | `false`                                        | Adds to the list; without it a new choice replaces the previous one            |
| `maxSize`                                       | `number` (bytes)      | none                                           | Per-file limit                                                                 |
| `prompt`, `removeLabel`                         | `string`              | `Drop files here or click to choose`, `Remove` | Interface texts (set them to translate); projected content replaces the prompt |
| `(rejected)`                                    | `ShyFileRejection[]`  | —                                              | `{ file, reason: 'type' \| 'size' }` for each refused file                     |
| `disabled`, `invalid`, `required`, `name`, `id` | as the other controls | —                                              | `invalid` forces the state; otherwise it comes from the control                |
| `label`                                         | `string`              | none                                           | `aria-label` when there is no `shy-form-field` label                           |

- The same validation runs for the picker and for drag and drop. A `role="status"` region announces "N files added" and each rejection; removed files are announced too.
- Each listed file has a remove button named "Remove <file name>".

---

### `OverlayService` (overlay core)

Opens a component or a `TemplateRef` in a layer above the page. It is the base of Dialog, Drawer, Popover, Menu and the new Select/Snackbar (phase F4); you can also use it directly. Needs `styles/index.css` (or `global`) loaded: it ships `overlay.css`.

```ts
import { OverlayService, ShyOverlayRef, SHY_OVERLAY_DATA } from '@shyland-dev/ui';

const overlay = inject(OverlayService);

const ref = overlay.open<MyPanel, { id: number }, boolean>(MyPanel, {
  layer: 'modal', // 'dropdown' | 'drawer' | 'modal' | 'popover' | 'tooltip' | 'toast' (default 'modal')
  data: { id: 1 }, // inside MyPanel: inject(SHY_OVERLAY_DATA); in a template: let-data and let-ref="overlayRef"
  ariaLabel: 'Edit item',
});
const confirmed = await ref.closed; // Promise<boolean | undefined>

// inside MyPanel
readonly ref = inject(ShyOverlayRef<boolean>);
save() { this.ref.close(true); }
```

| Option                                                                                    | Default                                  | Description                                                                                                                                  |
| ----------------------------------------------------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `layer`                                                                                   | `modal`                                  | Position in the z-index scale; decides what is promoted above what                                                                           |
| `modal`                                                                                   | `true` in `modal`/`drawer`               | `<dialog>.showModal()`: backdrop, rest of the page `inert`, Tab trap, scroll lock                                                            |
| `anchor`, `position`                                                                      | none                                     | Places the panel next to an element: `placement` (12 logical placements, RTL aware), `offset`/`padding` in ru, `flip`, `shift`, `matchWidth` |
| `closeOnEscape`                                                                           | `true`                                   | Esc closes only the topmost layer (and only if the content did not handle it with `preventDefault`)                                          |
| `closeOnOutsideClick`                                                                     | `true` outside modals, `false` in modals | The `anchor` itself never counts as "outside"                                                                                                |
| `initialFocus`                                                                            | `first` in modals, `none` otherwise      | `first` (or `[autofocus]`), `pane`, `none` or an element                                                                                     |
| `restoreFocus`                                                                            | `true`                                   | Returns focus to the previous element on close (only if focus was lost or inside the panel)                                                  |
| `data`, `injector`, `paneClass`, `role`, `ariaLabel`, `ariaLabelledBy`, `ariaDescribedBy` | none                                     | Extra data, parent injector, class and ARIA on the panel                                                                                     |

`ShyOverlayRef<R>`: `close(result?)` (animates out, then removes), `closed: Promise<R | undefined>`, `isOpen` (signal), `updatePosition()`, `pane`, `componentInstance`. `OverlayService.closeAll()` closes everything, top to bottom.

How it behaves:

- Panels live in `.shy-overlay-container` (in `body`), created with the first overlay and removed with the last. Modals use `<dialog>`; everything else uses `[popover="manual"]`. Both are in the top layer, where the **opening order** decides who is on top, so opening a modal promotes any open popover/tooltip/toast of a higher layer above it (reopened without animation). Without the APIs (old browsers) the panel falls back to `position: fixed` with `--shy-z-*`.
- A modal makes everything outside of it `inert`. A panel with an `anchor` inside an open modal (a Select inside a Dialog) becomes a child of that modal so it stays interactive, and closes with it. Overlays opened **before** a modal (a toast, for example) stay visible above it but are inert until it closes.
- The panel is unstyled (transparent, no padding): the component you open draws its own surface, border and focus ring (including `forced-colors`). Entry uses `@starting-style`; exit uses `animateOut` (`data-state="closing"`), instant with reduced motion.
- Position the panel with a class (`paneClass`): defaults have zero specificity. Anchored panels get `left`/`top` in `ru` calculated from the measured responsive unit.
- Scroll lock sets `data-shy-scroll-lock` on `<html>` (`overflow: hidden` + `scrollbar-gutter: stable`, no px).
- Outside the browser (SSR) `open()` returns an already closed ref.

Helpers: `computePosition(anchorRect, floatingSize, viewportRect, options)` (pure TS, px in/out), `[shyFocusScope]` (`FocusScopeDirective`: initial focus, `shyFocusScopeTrap`, restores focus on destroy), `focusableElements`, `focusInitial`, `trapTab`, `restoreFocus`, `shyLayer(name)` and `layerRank(name)` (TS side of `z()`).

---

### `<shy-dialog>`, `<shy-drawer>`, `DialogService`, `DrawerService`

Modal dialogs and side panels built on the `OverlayService` (native `<dialog>`: page behind `inert`, Tab trap, Esc on the top layer only, scroll lock, focus back to the opener). Needs `styles/index.css` (it ships `overlay.css` and `drawer.css`).

```ts
const dialogs = inject(DialogService);

// your own content: render <shy-dialog> inside the component you open
const ref = dialogs.open<RenameDialog, { id: number }, string>(RenameDialog, { data: { id: 7 } });
const name = await ref.closed; // string | undefined (undefined = Esc, X, backdrop)

// ready-made, role="alertdialog", focus on the safe button, no close by backdrop
if (await dialogs.confirm({ title: 'Delete project?', message: 'It cannot be undone.', confirmLabel: 'Delete', intent: 'danger' })) {
    /* ... */
}
await dialogs.alert({ title: 'Saved', message: 'Your changes were saved.' });

// drawer: side 'start' | 'end' (default) | 'top' | 'bottom'
inject(DrawerService).open(FiltersPanel, { side: 'start' });
```

```html
<!-- inside RenameDialog -->
<shy-dialog heading="Rename project" size="sm" (dismissed)="ref.close()">
    <shy-form-field label="Name"><input shyInput /></shy-form-field>
    <div slot="footer">
        <button shyButton variant="ghost" intent="neutral" (click)="ref.close()">Cancel</button>
        <button shyButton (click)="ref.close(name)">Save</button>
    </div>
</shy-dialog>
```

| Input / output                   | Default         | Description                                                                                                   |
| -------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------- |
| `heading`                        | none            | Title; it is the accessible name of the dialog (`aria-labelledby`). Without it, pass `ariaLabel` when opening |
| `size` (`shy-dialog`)            | `md`            | `sm`, `md`, `lg`, `full`; all shrink to the screen width                                                      |
| `dismissible`, `closeLabel`      | `true`, "Close" | Shows the X button and its accessible name; `(dismissed)` fires and the overlay closes                        |
| `slot="footer"`, `slot="header"` | none            | Actions (end-aligned, wrap) and extra header content                                                          |

- `DialogService.open(content, config)` takes the `OverlayService` options minus `layer`, `modal`, `anchor` and `position`. Defaults: `closeOnOutsideClick: false`. `DrawerService.open` adds `side` and defaults `closeOnOutsideClick: true`.
- `confirm()` resolves `true` on confirm and `false` on Cancel or Esc; `alert()` resolves when closed. Labels default to English ("Cancel", "Confirm", "OK") and are options: the lib does not translate.
- The body scrolls on its own when the panel is taller than the screen. In a `TemplateRef`, use the `overlayRef` from the context (`let-ref="overlayRef"`) to close; the title is linked to the `<dialog>` anyway.
- A popover or select panel opened with an `anchor` inside the dialog becomes a child of the `<dialog>` (stays clickable) and closes with it. Overlays opened before the dialog stay visible above it but inert until it closes.
- The Drawer panel (position, size, surface, entry from its side) is styled by `.shy-drawer-pane` + `--start|--end|--top|--bottom` (added by `DrawerService`); `<shy-drawer>` only lays out title, body and footer.

### `shyPopover`, `shyMenu`, `shyTooltip`

Anchored overlays on the `OverlayService` (they flip and shift to stay in the viewport; inside a modal they stay clickable, see the Dialog notes).

```html
<!-- Popover: non-modal panel, aria-haspopup="dialog" -->
<button shyButton [shyPopover]="info" shyPopoverPlacement="bottom-start" #pop="shyPopover">Rename</button>
<ng-template #info
    ><shy-popover><input shyInput /><button shyButton (click)="pop.close()">Save</button></shy-popover></ng-template
>

<!-- Menu button (APG): aria-haspopup="menu", named by the button -->
<button shyButton [shyMenu]="actions">Actions</button>
<ng-template #actions>
    <shy-menu>
        <button shyMenuItem (click)="edit()"><shy-icon slot="start">pencil</shy-icon>Edit</button>
        <shy-divider />
        <button shyMenuItem disabled>Archive</button>
    </shy-menu>
</ng-template>

<!-- Tooltip: complements the name, never replaces it -->
<button shyIconButton label="Delete" shyTooltip="Delete the selected item"><shy-icon>trash</shy-icon></button>
```

| Directive / component | Inputs and API                                                                                                                                                                    |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[shyPopover]`        | `shyPopover` (TemplateRef or component, required), `shyPopoverPlacement` (`bottom-start`), `shyPopoverData`; `exportAs: shyPopover` (`open()`, `close()`, `toggle()`, `expanded`) |
| `[shyMenu]`           | `shyMenu` (TemplateRef or component, required), `shyMenuPlacement` (`bottom-start`), `shyMenuCloseOnSelect` (`true`); same `exportAs: shyMenu` API                                |
| `shy-menu`            | `label` (accessible name when not labelled by the button). Arrows (wrap), Home/End, typeahead                                                                                     |
| `[shyMenuItem]`       | On `button` or `a`; `disabled` keeps the item focusable (`aria-disabled`) and blocks click/Enter/Space; `slot="start"`/`"end"` for icons                                          |
| `[shyTooltip]`        | `shyTooltip` (text; empty disables), `shyTooltipPlacement` (`top`); `exportAs: shyTooltip` (`hide()`)                                                                             |

- Popover opens with focus on the first focusable. Esc, click outside or the trigger again close it and return focus to the trigger; Tab out of the first/last focusable closes it and continues from the trigger.
- Menu: click, Enter, Space or ↓ open on the first item, ↑ on the last. Activating a non-disabled item closes the menu. Esc closes and returns focus; Tab closes and continues from the button. Submenus are not part of this version.
- Tooltip opens after `--shy-delay-tooltip` (500 ms) on mouse hover and at once on `:focus-visible`; never on touch. The text is added to `aria-describedby` only while open. Esc dismisses without moving focus, the pointer can move onto the tip (`--shy-delay-tooltip-hide`, 100 ms), a click on the trigger closes it. Do not put essential information only in a tooltip.
- Needs `styles/index.css` (z-layers `dropdown`, `popover`, `tooltip` come from the overlay core).

---

---

### `<shy-tabs>`, `<shy-tab>`

APG Tabs. `<shy-tab value label>` is the panel (`role="tabpanel"`, content projected) and its `label` becomes the tab button.

```html
<shy-tabs label="Account" [(value)]="tab">
    <shy-tab value="profile" label="Profile">…</shy-tab>
    <shy-tab value="password" label="Password" disabled>…</shy-tab>
    <shy-tab value="plan" label="Plan">…</shy-tab>
</shy-tabs>
```

| Input (`shy-tabs`) | Default        | Notes                                                                     |
| ------------------ | -------------- | ------------------------------------------------------------------------- |
| `[(value)]`        | first enabled  | Value of the selected tab; without a match the first enabled tab is shown |
| `orientation`      | `'horizontal'` | `'vertical'` switches the arrows to ↓/↑                                   |
| `activation`       | `'automatic'`  | `'manual'`: arrows only move focus, Enter/Space selects                   |
| `label`            | —              | `aria-label` of the tablist                                               |

- Roving tabindex (Tab enters the selected tab), arrows wrap around (mirrored in RTL), Home/End go to the ends, disabled tabs are skipped. No `ControlValueAccessor`: it is navigation, not a form control.

### `<shy-accordion>`, `<shy-accordion-item>`

APG Accordion. Each item: a `role="heading"` (`level`, default 3) with a button (`aria-expanded`, `aria-controls`) and a `role="region"` panel that is `inert` while closed.

```html
<shy-accordion>
    <shy-accordion-item label="What is it?" [(open)]="open">…</shy-accordion-item>
    <shy-accordion-item label="Disabled" disabled>…</shy-accordion-item>
</shy-accordion>
```

- `multiple` on the group allows several open items; by default opening one closes the others (only when the user opens; `[open]` set by code does not close the rest).
- ↓/↑/Home/End move between enabled headers (no wrap). The height animates with `grid-template-rows` (no JS measuring) and follows `prefers-reduced-motion`.

### `<shy-breadcrumb>`, `<shy-breadcrumb-item>`

`role="navigation"` (`label`, default "Breadcrumb") with a list of items. Project your own link (`<a href>`, `<a routerLink>`); the current page is `<shy-breadcrumb-item current>Text</shy-breadcrumb-item>` (`aria-current="page"`). The separator is CSS (`--shy-breadcrumb-separator`, default `'/'`) with empty alternative text, so screen readers skip it.

### `<shy-pagination>`

`nav` (`label`, default "Pagination") of native buttons; the current page has `aria-current="page"`.

```html
<shy-pagination label="Results" [pageCount]="20" [(page)]="page" />
```

| Input                                              | Default                                            | Notes                                                                      |
| -------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------- |
| `[(page)]`, `pageCount`                            | `1`, required                                      | 1-based; `pageCount` of `0` renders nothing                                |
| `siblings`, `boundaries`                           | `1`, `1`                                           | Pages around the current one and fixed at each end; the rest become "…"    |
| `disabled`                                         | `false`                                            |                                                                            |
| `label`, `previousLabel`, `nextLabel`, `pageLabel` | `Pagination`, `Previous page`, `Next page`, `Page` | Accessible texts (the lib does not translate); each page is named "Page 3" |

A gap of a single page shows that page instead of "…". Arrows mirror in RTL.

### `<shy-avatar>`

Image with fallback: `src` → initials of `name` (up to 2 letters) → icon. `label` (default `name`) is the accessible name (`role="img"`); without `label` and `name` the avatar is decorative (`aria-hidden`).

```html
<shy-avatar src="/ana.jpg" name="Ana Souza" size="lg" /> <shy-avatar name="Bruno Lima" shape="rounded" />
```

| Input                  | Default  | Notes                             |
| ---------------------- | -------- | --------------------------------- |
| `src`, `name`, `label` | -        | Image, initials source, a11y name |
| `size`                 | `md`     | `sm`, `md`, `lg`, `xl`            |
| `shape`                | `circle` | `circle` or `rounded`             |

### `<shy-empty-state>`

Explains why there is nothing to show. Inputs `heading` and `icon` (decorative); the content is the description and `slot="action"` takes a button/link. No role of its own. Inside a table, put it in a `<td [attr.colspan]="n">`.

```html
<shy-empty-state heading="No projects yet" icon="inbox">Create your first project.<button shyButton slot="action">New project</button></shy-empty-state>
```

### `<shy-list>`, `<shy-list-item>`

`role="list"`/`listitem` (name the list with `aria-label`). An item is static by default; `href` renders a native link and `interactive` a native button (emits `activated`); `selected` sets `aria-current="true"`; `disabled` applies to the button. Slots: `start`, `secondary`, `end`. Do not nest controls inside a clickable row; keep the row static and put the action in `slot="end"`.

```html
<shy-list aria-label="Team">
    <shy-list-item interactive [selected]="id === 'ana'" (activated)="id = 'ana'"><shy-avatar slot="start" name="Ana Souza" size="sm" />Ana<span slot="secondary">ana@x.dev</span></shy-list-item>
</shy-list>
```

### `<shy-table>`, `<shy-column>`, `th[shySort]`

Two modes. **Declarative** (`[rows]`): describe the columns and the lib builds the native `<table>` with sorting, selection, pagination and the empty state.

```html
<shy-table [rows]="invoices()" rowKey="id" label="Invoices" caption="Invoices" striped selectable [(selection)]="selected" [(sort)]="sort" [pageSize]="10" [(page)]="page" emptyHeading="No invoices">
    <shy-column key="id" header="Invoice" rowHeader sortable />
    <shy-column key="customer" header="Customer" sortable />
    <shy-column key="status" header="Status">
        <ng-template shyCell let-row><shy-badge>{{ row.status }}</shy-badge></ng-template>
    </shy-column>
    <shy-column key="total" header="Total" sortable numeric />
</shy-table>
```

| `shy-table` input                                     | Default                  | Notes                                                                                              |
| ----------------------------------------------------- | ------------------------ | -------------------------------------------------------------------------------------------------- |
| `rows`, `rowKey`                                      | -                        | `rowKey` = property name or function identifying a row (used by `selection`); default: the row     |
| `[(selection)]`, `selectable`                         | `[]`, `false`            | Array of row keys; the header checkbox selects the rows of the current page (`indeterminate`)      |
| `[(sort)]`                                            | `null`                   | `{ key, direction: 'asc' \| 'desc' }`; header click cycles asc → desc → none                       |
| `pageSize`, `[(page)]`                                | `0`, `1`                 | `pageSize` `0` = no pagination; page is 1-based                                                    |
| `serverSide`, `totalRows`                             | `false`                  | The lib neither sorts nor slices: react to `sortChange`/`pageChange`, pass only the page in `rows` |
| `label`, `caption`, `striped`, `dense`                | -                        | `label` makes the scroll area a named, focusable region                                            |
| `emptyHeading`, `emptyDescription`, `emptyIcon`       | `No results`, -, `inbox` | Empty state row                                                                                    |
| `selectAllLabel`, `selectRowLabel`, `paginationLabel` | English                  | Accessible texts (translate them)                                                                  |

`shy-column`: `key` (required), `header` (default `key`), `sortable`, `numeric` (end-aligned, tabular figures), `rowHeader` (cell becomes `th scope="row"`), `compare` (custom comparator; default is natural order, empty values last). Without `<ng-template shyCell>` the cell shows `row[key]`; the template receives `$implicit` (row), `value` and `index`. No virtualization: paginate large data.

**Native** (no `[rows]`): you write the `<table>` (`caption`, `thead`/`tbody`, `th scope`) and `shy-table` only styles it and contains horizontal scroll. Use it for `colspan`, grouped rows or very custom cells. Helpers: `th shySort [(direction)]` (native button + `aria-sort`; you sort the data), `data-numeric`, `data-narrow`, `data-selected` on `tr`.

### `<shy-stepper>`, `<shy-step>`

Progress indicator in steps. An ordered list (`<ol>`) with one native button per step and `aria-current="step"` on the current one. It has **no panels**: show your own content from `value`.

```html
<shy-stepper label="Checkout" [(value)]="step">
    <shy-step label="Account" description="Your details" />
    <shy-step label="Address" />
    <shy-step label="Payment" [error]="paymentFailed()" />
    <shy-step label="Review" />
</shy-stepper>
```

| Input (`shy-stepper`)         | Default              | Notes                                                                                  |
| ----------------------------- | -------------------- | -------------------------------------------------------------------------------------- |
| `[(value)]`                   | `0`                  | 0-based index of the current step (clamped to the steps); steps before it are complete |
| `orientation`                 | `'horizontal'`       | `'vertical'` stacks the steps with a vertical connector                                |
| `linear`                      | `false`              | Only the current and earlier steps can be clicked (later ones get `aria-disabled`)     |
| `label`                       | -                    | `aria-label` of the list                                                               |
| `completeLabel`, `errorLabel` | `Completed`, `Error` | Hidden text read after the step name (translate them)                                  |

| Input (`shy-step`) | Notes                                                                             |
| ------------------ | --------------------------------------------------------------------------------- |
| `label` (required) | Button text                                                                       |
| `description`      | Secondary line                                                                    |
| `error`            | Error state: "!" marker, danger color and hidden "Error" text (never color alone) |
| `disabled`         | Native `disabled` on the button                                                   |

- Marker: number, check (complete) or "!" (error), all `aria-hidden`; the state is read from the hidden status text. No `ControlValueAccessor`: it is navigation/progress, not a form control.

### `<shy-app-shell>`

Page shell with `header`, `sidebar`, content and `footer` by projection. No router dependency.

```html
<shy-app-shell sidebarLabel="Site menu">
    <strong slot="header">Acme</strong>
    <ul slot="sidebar">
        <li><a routerLink="/home">Home</a></li>
    </ul>
    <router-outlet />
    <span slot="footer">© Acme</span>
</shy-app-shell>
```

| Input          | Default             | Notes                                                                              |
| -------------- | ------------------- | ---------------------------------------------------------------------------------- |
| `sidebarMode`  | `'auto'`            | `auto`: inline from `md` up, `Drawer` below; `inline` / `drawer` force one of them |
| `sidebarLabel` | `'Navigation'`      | `aria-label` of the sidebar `nav` and heading of the Drawer                        |
| `menuLabel`    | `'Open navigation'` | Accessible name of the menu button (only in Drawer mode)                           |
| `skipLabel`    | `'Skip to content'` | Text of the skip link                                                              |

- Landmarks: `<header>` (banner), `<nav aria-label>`, `<main tabindex="-1">` and `<footer>` (contentinfo). Empty regions are hidden. The skip link is the first focusable element and moves focus to `main` without touching the URL (safe with `<base href>`).
- In Drawer mode a menu button appears in the header (`aria-haspopup="dialog"`); a click on a link inside the Drawer closes it, and going back to inline closes it too. `openSidebar()` is public (via `exportAs: shyAppShell`). With no `slot="sidebar"` content the shell adapts by itself in every mode: no sidebar column is reserved (`data-no-sidebar` on the host) and the menu button is not rendered, so no workaround such as `--shy-app-shell-sidebar-width: 0` or `sidebarMode="inline"` is needed.
- The breakpoint lives only in `_breakpoints.scss` (`md`): the component reads the CSS custom property `--_compact` through `getComputedStyle`, so there is no pixel value in TypeScript.

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

### Typography and layout classes

`index.css` (and `_global.scss`) also load two utility sheets:

- `typography.css`: `.shy-display`, `.shy-h1`…`.shy-h6`, `.shy-body-lg`, `.shy-body`, `.shy-small`, `.shy-caption`, `.shy-overline`, `.shy-code`, and `.shy-sr-only` (visually hidden, still read by screen readers).
- `layout.css`: `.shy-stack` (column), `.shy-cluster` (wrapping row), `.shy-grid` (auto-fill columns), `.shy-container` (centered max width). Tune with custom properties on the element: `--shy-stack-gap`, `--shy-cluster-gap`, `--shy-cluster-align`, `--shy-cluster-justify`, `--shy-grid-min`, `--shy-grid-gap`, `--shy-container-max`, `--shy-container-pad`.

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
| Motion     | `--shy-duration-*` (incl. `-loop`, `-loop-slow`, `-breathe`), `--shy-ease-*`, `--shy-motion-distance`      |
| Layers     | `--shy-z-{base,raised,dropdown,sticky,fixed,drawer,modal,popover,tooltip,toast}`                           |

### SCSS API

`ru($n)`, `z($layer, $offset)`, `shy-layer`, `up($bp)`/`down($bp)`, `focus-ring`, `shy-state`, `state-layer`, `disabled-state`, `transition`, `visually-hidden`, `reduced-motion` (rules for `prefers-reduced-motion` or `data-motion="reduced"`), plus the legacy `fixedHeight`, `fixedWidth`, `fixedSquare`, `square`, `allVendors`, `landscape`, `portrait`, `dark-mode`, `light-mode`. The old `$color-*` palette is gone (`_variables.scss` was removed); use the `--shy-color-*` tokens.

> Breaking in `1.0.0` (components): `--shyIconSize` → `--shy-icon-size`; `--shySelect*` → `--shy-select-*`; `--shySnackbar*` → `--shy-snackbar-*`; the fallback icon for an unknown name is `question-circle`.
>
> Breaking in `1.0.0` (globals): `--responsive-unit`, `--dynamic-*`, `$responsive-unit` and `$dynamic-*` no longer exist (no alias). Use `--shy-responsive-unit` / `ru(N)` and `--shy-dynamic-*`.

### Button Tokens

Set on the element (or a parent). `IconButton` uses the same names with the `--shy-icon-button-` prefix (`-bg`, `-fg`, `-border-color`, `-radius`, `-font-weight`, `-size`).

| Token                       | Default                         | Description            |
| --------------------------- | ------------------------------- | ---------------------- |
| `--shy-button-bg`           | by variant/intent               | Background             |
| `--shy-button-fg`           | by variant/intent               | Text and icon color    |
| `--shy-button-border-color` | by variant/intent               | Border color           |
| `--shy-button-radius`       | `--shy-radius-md`               | Border radius          |
| `--shy-button-height`       | `--shy-size-control-{sm,md,lg}` | Minimum height         |
| `--shy-button-pad-x`        | `--shy-space-{6,7,8}`           | Inline padding         |
| `--shy-button-gap`          | `--shy-space-2`                 | Gap between icon/label |
| `--shy-button-font-size`    | `--shy-text-{sm,md,lg}`         | Font size              |
| `--shy-button-font-weight`  | `--shy-weight-semibold`         | Font weight            |

### Spinner, Skeleton and Progress Tokens

| Token                                              | Default                                          | Description                              |
| -------------------------------------------------- | ------------------------------------------------ | ---------------------------------------- |
| `--shy-spinner-size`                               | by `size`                                        | Side of the spinner                      |
| `--shy-spinner-color`                              | `currentColor`                                   | Color                                    |
| `--shy-skeleton-bg` / `--shy-skeleton-highlight`   | `--shy-color-track` / `--shy-color-neutral-soft` | Base and shimmer colors                  |
| `--shy-skeleton-radius`                            | `--shy-radius-md` (`sm` on text lines)           | Radius                                   |
| `--shy-skeleton-width`, `-height`, `-size`         | `100%`, `ru(40)`, `--shy-size-control-md`        | Width; rect height; circle side          |
| `--shy-skeleton-line-height`, `-gap`               | `--shy-text-md`, `--shy-space-3`                 | Text lines                               |
| `--shy-progress-track` / `--shy-progress-bar`      | `--shy-color-track` / `--shy-color-primary-text` | Linear colors (bar ≥ 3:1 over the track) |
| `--shy-progress-height`, `--shy-progress-radius`   | by `size`, `--shy-radius-full`                   | Linear thickness and radius              |
| `--shy-progress-circular-track` / `-bar` / `-size` | same colors, by `size`                           | Circular                                 |

New foundation tokens: `--shy-color-track` (both themes), `--shy-opacity-track`, `--shy-duration-loop` (1000ms), `--shy-duration-loop-slow` (1600ms), `--shy-duration-breathe` (2000ms). Loop durations do not drop to 0.01ms with reduced motion: the components swap movement for an opacity pulse instead.

### Input and Form Field Tokens

| Token                                                                 | Default                                              | Description                     |
| --------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------- |
| `--shy-input-height`                                                  | `--shy-size-control-{sm,md,lg}`                      | Minimum height                  |
| `--shy-input-pad-x`, `--shy-input-font-size`                          | `--shy-space-{6,7,8}`, `--shy-text-{sm,md,lg}`       | Padding and font size           |
| `--shy-input-bg`, `--shy-input-fg`                                    | `--shy-color-surface-sunken`, `--shy-color-text`     | Background and text             |
| `--shy-input-border-color`, `-hover`, `-invalid`                      | `border-strong`, `text-muted`, `danger-text`         | Border (≥ 3:1 over the surface) |
| `--shy-input-placeholder`, `--shy-input-radius`                       | `--shy-color-text-subtle`, `--shy-radius-md`         | Placeholder and radius          |
| `--shy-form-field-gap`, `-label-color`, `-hint-color`, `-error-color` | `--shy-space-2`, `text`, `text-muted`, `danger-text` | Field layout and message colors |

### Checkbox, Switch and Radio Tokens

| Token                                                                      | Default                                         | Description                        |
| -------------------------------------------------------------------------- | ----------------------------------------------- | ---------------------------------- |
| `--shy-checkbox-size`, `--shy-radio-size`                                  | `--shy-size-icon-md`                            | Side of the mark                   |
| `--shy-checkbox-radius`                                                    | `--shy-radius-sm`                               | Checkbox radius                    |
| `--shy-{checkbox,radio,switch}-checked-bg`                                 | `--shy-color-primary`                           | Fill when checked                  |
| `--shy-{checkbox,radio,switch}-checked-border`                             | `--shy-color-primary-text`                      | Border when checked (≥ 3:1)        |
| `--shy-{checkbox,radio,switch}-bg`, `-border-color`, `-border-color-hover` | `surface-sunken`, `border-strong`, `text-muted` | Unchecked box (border ≥ 3:1)       |
| `--shy-{checkbox,radio,switch}-gap`, `-fg`                                 | `--shy-space-4`, `--shy-color-text`             | Gap to the text; text color        |
| `--shy-switch-width`, `-height`, `-thumb-size`                             | `ru(18)`, `ru(10)`, `ru(6)`                     | Track and thumb                    |
| `--shy-switch-bg`, `-thumb`, `-thumb-checked`                              | `track`, `text-muted`, `on-primary`             | Track and thumb colors             |
| `--shy-radio-group-gap`, `--shy-radio-group-gap-inline`                    | `--shy-space-1`, `--shy-space-8`                | Gap (vertical / horizontal layout) |

The touch target is at least `--shy-size-control-sm` tall (it grows with a coarse pointer), even with a smaller mark.

### Badge, Card, Alert and Divider Tokens

| Token                                                                                | Default                                                                         | Description                   |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- | ----------------------------- |
| `--shy-badge-bg`, `-fg`, `-border-color`                                             | by `intent` and `variant`                                                       | Badge colors                  |
| `--shy-badge-height`, `-pad-x`, `-gap`, `-font-size`, `-radius`, `-dot-size`         | by `size`, `--shy-radius-full`                                                  | Badge box                     |
| `--shy-card-bg`, `-fg`, `-border-color`, `-border-color-hover`, `-shadow`, `-radius` | `surface`, `text`, `border`, `border-strong`, by `elevation`, `--shy-radius-lg` | Card                          |
| `--shy-card-pad-x`, `--shy-card-pad-y`                                               | `--shy-space-8`, `--shy-space-6`                                                | Padding of header/body/footer |
| `--shy-alert-bg`, `-fg`, `-border-color`, `-icon-color`                              | `*-soft`, `on-*-soft`, `*-text`, `*-text`                                       | Alert colors by `intent`      |
| `--shy-alert-pad`, `-gap`, `-radius`                                                 | `space-6 space-7`, `space-5`, `radius-md`                                       | Alert box                     |
| `--shy-divider-color`, `-text-color`, `-gap`                                         | `--shy-color-line`, `text-muted`, `space-6`                                     | Divider                       |

### Dialog and Drawer Tokens

| Token                                                           | Default                                                            | Description                              |
| --------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------- |
| `--shy-dialog-width`                                            | by `size`: `ru(120)`, `ru(180)`, `ru(260)`                         | Width (always capped to the screen)      |
| `--shy-dialog-bg`, `-fg`, `-border-color`, `-shadow`, `-radius` | `surface-raised`, `text`, `border-strong`, `shadow-4`, `radius-xl` | Dialog surface                           |
| `--shy-dialog-padding`                                          | `--shy-space-8`                                                    | Padding of header, body and footer       |
| `--shy-drawer-width`, `--shy-drawer-height`                     | `ru(160)`, `ru(140)`                                               | Width (start/end) or height (top/bottom) |
| `--shy-drawer-bg`, `-fg`, `-border-color`, `-shadow`, `-radius` | `surface-raised`, `text`, `border-strong`, `shadow-5`, `radius-xl` | Drawer surface                           |
| `--shy-drawer-padding`                                          | `--shy-space-8`                                                    | Padding of header, body and footer       |

### Popover, Menu and Tooltip Tokens

| Token                                                                           | Default                                                                                   | Description                                                      |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `--shy-popover-bg`, `-fg`, `-border-color`, `-shadow`, `-radius`                | `surface-raised`, `text`, `border-strong`, `shadow-3`, `radius-lg`                        | Popover surface                                                  |
| `--shy-popover-padding`, `--shy-popover-max-width`                              | `--shy-space-6`, `ru(160)`                                                                | Padding and max width                                            |
| `--shy-menu-*`                                                                  | surface tokens like the popover                                                           | Menu surface (`shy-menu`)                                        |
| `--shy-menu-item-*`                                                             | see `menu-item.component.scss`                                                            | Item colors, padding, radius                                     |
| `--shy-tooltip-bg`, `-fg`, `-border-color`, `-radius`, `-padding`, `-max-width` | `scrim-panel`, `on-scrim`, `scrim-panel-border`, `radius-md`, `space-2 space-3`, `ru(90)` | Tooltip surface                                                  |
| `--shy-delay-tooltip`, `--shy-delay-tooltip-hide`                               | `500ms`, `100ms`                                                                          | Show/hide delays (intent, not motion: reduced motion keeps them) |

### Tabs, Accordion, Breadcrumb and Pagination Tokens

| Token                                                                                                      | Default                                                                                    | Description                             |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------- |
| `--shy-tabs-fg`, `-fg-hover`, `-fg-selected`, `-bg-hover`, `-bg-active`, `-indicator-color`, `-line-color` | `text-muted`, `on-neutral-soft`, `text`, `neutral-soft`, `neutral-soft`, `primary`, `line` | Tab colors                              |
| `--shy-tabs-height`, `-pad-x`, `-gap`, `-list-gap`, `-panel-pad-y`                                         | `size-control-md`, `space-7`, `space-8`, `space-2`, `space-6`                              | Measures (`gap`: vertical list ↔ panel) |
| `--shy-accordion-bg`, `-border-color`, `-radius`, `-content-color`                                         | `surface`, `border`, `radius-lg`, `text-muted`                                             | Group surface and panel text            |
| `--shy-accordion-height`, `-pad-x`, `-gap`, `-content-pad-y`                                               | `size-control-lg`, `space-8`, `space-6`, `space-2 space-8`                                 | Header height, padding and gaps         |
| `--shy-breadcrumb-fg`, `-fg-current`, `-separator`, `-gap`                                                 | `text-muted`, `text`, `'/'`, `space-3`                                                     | Colors, separator text and its spacing  |
| `--shy-pagination-fg`, `-bg-current`, `-fg-current`, `-size`, `-radius`, `-gap`                            | `text`, `primary`, `on-primary`, `size-control-md`, `radius-md`, `space-2`                 | Page buttons                            |

### Avatar, Empty State, List and Table Tokens

| Token                                                                                         | Default                                                                       | Description                   |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------- |
| `--shy-avatar-size`, `-bg`, `-fg`, `-radius`, `-font-size`                                    | by `size`, `primary-soft`, `on-primary-soft`, by `shape`                      | Avatar box and colors         |
| `--shy-empty-state-fg`, `-title-color`, `-icon-color`, `-gap`, `-pad`, `-max-width`           | `text-muted`, `text`, `text-subtle`, `space-4`, `space-12 space-8`, `ru(120)` | Empty state                   |
| `--shy-list-bg`, `-border-color`, `-divider-color`, `-radius`, `-bg-selected`, `-fg-selected` | `surface`, `border`, `line`, `radius-lg`, `primary-soft`, `on-primary-soft`   | List surface and selected row |
| `--shy-list-item-height`, `-pad-x`, `-pad-y`, `-gap`                                          | `size-control-lg`, `space-7`, `space-4`, `space-6`                            | Row measures                  |
| `--shy-table-bg`, `-border-color`, `-divider-color`, `-radius`, `-header-bg`, `-header-fg`    | `surface`, `border`, `line`, `radius-lg`, `surface-sunken`, `text-muted`      | Table surface and header      |
| `--shy-table-stripe-bg`, `-row-bg-hover`, `-row-bg-selected`, `-row-fg-selected`              | `surface-sunken`, `neutral-soft`, `primary-soft`, `on-primary-soft`           | Row states                    |
| `--shy-table-cell-pad-x`, `-cell-pad-y`, `-cell-pad-y-dense`                                  | `space-6`, `space-4`, `space-2`                                               | Cell padding                  |

### Combobox, Slider and File Dropzone Tokens

| Token                                                                                                                                | Default                                                                                                  | Description               |
| ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- | ------------------------- |
| `--shy-combobox-height`, `-width`, `-radius`, `-bg`, `-fg`, `-border`, `-font-family`, `-font-size`, `-icon-size`                    | as `--shy-select-*`                                                                                      | Field (on the element)    |
| `--shy-combobox-placeholder-fg`, `-border-color-invalid`                                                                             | `text-subtle`, `danger-text`                                                                             | Field states              |
| `--shy-combobox-panel-max-height`, `-panel-bg`, `-panel-shadow`, `-selected-fg`, `-option-hover-bg`, `-option-hover-fg`, `-empty-fg` | `ru(100)`, `surface-raised`, `shadow-3`, `primary-text`, `primary-soft`, `on-primary-soft`, `text-muted` | Panel (on `:root`)        |
| `--shy-slider-width`, `-track-height`, `-track-bg`, `-fill`, `-radius`                                                               | `ru(100)`, `ru(2)`, `track`, `primary-text`, `radius-full`                                               | Track and fill            |
| `--shy-slider-thumb-size`, `-thumb-bg`, `-thumb-border`, `-gap`, `-value-fg`, `-value-width`                                         | `ru(7)`, `primary-text`, `surface`, `space-4`, `text-muted`, `ru(10)`                                    | Thumb and value text      |
| `--shy-file-dropzone-bg`, `-fg`, `-border-color`, `-border-color-active`, `-border-color-invalid`                                    | `surface-sunken`, `text`, `border-strong`, `primary-text`, `danger-text`                                 | Area                      |
| `--shy-file-dropzone-radius`, `-pad`, `-gap`, `-icon-size`, `-file-bg`                                                               | `radius-lg`, `space-8`, `space-4`, `size-icon-lg`, `surface-raised`                                      | Area layout and file rows |

### Stepper and App Shell Tokens

| Token                                                                                                                        | Default                                                                                       | Description          |
| ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------- |
| `--shy-stepper-marker-size`, `-gap`, `-connector-min`                                                                        | `size-control-sm`, `space-4`, `space-8`                                                       | Marker and connector |
| `--shy-stepper-marker-bg`, `-marker-fg`, `-marker-border-color`, `-label-fg`, `-description-fg`, `-bg-hover`                 | `neutral-soft`, `on-neutral-soft`, `transparent`, `text-muted`, `text-subtle`, `neutral-soft` | Upcoming step        |
| `--shy-stepper-marker-bg-current`, `-marker-fg-current`, `-label-fg-current`                                                 | `primary`, `on-primary`, `text`                                                               | Current step         |
| `--shy-stepper-marker-bg-complete`, `-marker-fg-complete`, `-label-fg-complete`, `-connector-color`, `-connector-color-done` | `primary-soft`, `on-primary-soft`, `text`, `line`, `primary`                                  | Completed step       |
| `--shy-stepper-marker-bg-error`, `-marker-fg-error`, `-label-fg-error`                                                       | `danger`, `on-danger`, `danger-text`                                                          | Error step           |
| `--shy-app-shell-sidebar-width`, `-header-height`, `-pad`, `-main-pad`, `-min-height`                                        | `ru(160)`, `size-control-lg`, `space-8`, `space-8`, `dynamic-height`                          | Layout               |
| `--shy-app-shell-header-bg`, `-sidebar-bg`, `-footer-bg`, `-border-color`                                                    | `surface`, `surface`, `transparent`, `line`                                                   | Regions              |

### Snackbar Tokens

The toasts can be customized via CSS custom properties on `:root` (the container lives in the overlay layer):

`--shy-snackbar-gap` (`--shy-space-3`) sets the space between toasts.

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

| Token                               | Default                       | Description                        |
| ----------------------------------- | ----------------------------- | ---------------------------------- |
| `--shy-select-height`               | `--shy-size-control-lg`       | Minimum height of the trigger      |
| `--shy-select-width`                | `ru(90)`                      | Minimum width                      |
| `--shy-select-radius`               | `--shy-radius-md`             | Border radius of trigger and panel |
| `--shy-select-bg`                   | `--shy-color-surface-sunken`  | Trigger background                 |
| `--shy-select-placeholder-fg`       | `--shy-color-text-muted`      | Placeholder color                  |
| `--shy-select-border-color-invalid` | `--shy-color-danger-text`     | Border when invalid                |
| `--shy-select-panel-max-height`     | `ru(100)`                     | Max height of the list (scrolls)   |
| `--shy-select-fg`                   | `--shy-color-text`            | Text and icon color                |
| `--shy-select-border`               | `--shy-color-border-strong`   | Trigger border color               |
| `--shy-select-font-family`          | `--shy-font-family-base`      | Font family                        |
| `--shy-select-font-size`            | `--shy-text-md`               | Font size                          |
| `--shy-select-icon-size`            | `--shy-size-icon-md`          | Size of the internal icons         |
| `--shy-select-panel-bg`             | `--shy-color-surface-raised`  | Panel background                   |
| `--shy-select-panel-shadow`         | `--shy-shadow-3`              | Panel shadow                       |
| `--shy-select-selected-fg`          | `--shy-color-primary-text`    | Selected option color              |
| `--shy-select-option-hover-bg`      | `--shy-color-primary-soft`    | Option background on hover/focus   |
| `--shy-select-option-hover-fg`      | `--shy-color-on-primary-soft` | Option text on hover/focus         |
| `--shy-select-option-img-radius`    | `--shy-radius-full`           | Option image radius                |

---

## Exports

```typescript
// Components
export { ButtonComponent } from './lib/components/button/button.component';
export { IconButtonComponent } from './lib/components/icon-button/icon-button.component';
export { AlertComponent } from './lib/components/alert/alert.component';
export { AvatarComponent } from './lib/components/avatar/avatar.component';
export { BadgeComponent } from './lib/components/badge/badge.component';
export { EmptyStateComponent } from './lib/components/empty-state/empty-state.component';
export { ListComponent } from './lib/components/list/list.component';
export { ListItemComponent } from './lib/components/list/list-item.component';
export { TableComponent } from './lib/components/table/table.component';
export { TableColumnComponent, TableCellDirective } from './lib/components/table/table-column.component';
export { TableSortComponent } from './lib/components/table/table-sort.component';
export { CheckboxComponent } from './lib/components/checkbox/checkbox.component';
export { AccordionComponent } from './lib/components/accordion/accordion.component';
export { AccordionItemComponent } from './lib/components/accordion/accordion-item.component';
export { SHY_ACCORDION, ShyAccordionContext, ShyAccordionPanel } from './lib/components/accordion/accordion.token';
export { BreadcrumbComponent } from './lib/components/breadcrumb/breadcrumb.component';
export { BreadcrumbItemComponent } from './lib/components/breadcrumb/breadcrumb-item.component';
export { CardComponent } from './lib/components/card/card.component';
export { DialogComponent } from './lib/components/dialog/dialog.component';
export { DividerComponent } from './lib/components/divider/divider.component';
export { DrawerComponent } from './lib/components/drawer/drawer.component';
export { MenuComponent } from './lib/components/menu/menu.component';
export { MenuItemComponent } from './lib/components/menu/menu-item.component';
export { MenuDirective } from './lib/components/menu/menu.directive';
export { PaginationComponent } from './lib/components/pagination/pagination.component';
export { PopoverComponent } from './lib/components/popover/popover.component';
export { PopoverDirective } from './lib/components/popover/popover.directive';
export { TooltipDirective } from './lib/components/tooltip/tooltip.directive';
export { FormFieldComponent } from './lib/components/form-field/form-field.component';
export { SHY_FORM_FIELD, ShyFieldControl, ShyFormFieldContext } from './lib/components/form-field/form-field.token';
export { IconComponent } from './lib/components/icon/icon.component';
export { InputComponent } from './lib/components/input/input.component';
export { ProgressComponent } from './lib/components/progress/progress.component';
export { ProgressCircularComponent } from './lib/components/progress-circular/progress-circular.component';
export { RadioGroupComponent } from './lib/components/radio/radio-group.component';
export { RadioComponent } from './lib/components/radio/radio.component';
export { SHY_RADIO_GROUP, ShyRadioGroupContext } from './lib/components/radio/radio.token';
export { SelectComponent } from './lib/components/select/select.component';
export { SkeletonComponent } from './lib/components/skeleton/skeleton.component';
export { SpinnerComponent } from './lib/components/spinner/spinner.component';
export { SwitchComponent } from './lib/components/switch/switch.component';
export { TabComponent } from './lib/components/tabs/tab.component';
export { TabsComponent } from './lib/components/tabs/tabs.component';
export { SHY_TABS, ShyTabsContext } from './lib/components/tabs/tabs.token';
export { StepperComponent } from './lib/components/stepper/stepper.component';
export { StepComponent } from './lib/components/stepper/step.component';
export { SHY_STEPPER, ShyStepperContext } from './lib/components/stepper/stepper.token';
export { AppShellComponent } from './lib/components/app-shell/app-shell.component';
export { ComboboxComponent } from './lib/components/combobox/combobox.component';
export { SliderComponent } from './lib/components/slider/slider.component';
export { FileDropzoneComponent } from './lib/components/file-dropzone/file-dropzone.component';
export { ThemeToggleComponent, ShyThemeToggleLabels } from './lib/components/theme-toggle/theme-toggle.component';

// Services
export { DialogService } from './lib/services/dialog/dialog.service';
export { DrawerService } from './lib/services/drawer/drawer.service';
export { SnackbarService } from './lib/services/snackbar/snackbar.service';
export { provideShySnackbar, SHY_SNACKBAR_CONFIG, SHY_SNACKBAR_DEFAULTS } from './lib/services/snackbar/snackbar.config';
export { ThemeService, provideShyTheme, SHY_THEME_CONFIG, ShyThemeMode, ShyResolvedTheme, ShyThemeConfig } from './lib/services/theme/theme.service';

// Overlay
export { OverlayService } from './lib/overlay/overlay.service';
export { ShyOverlayRef, SHY_OVERLAY_DATA } from './lib/overlay/overlay-ref';
export { FocusScopeDirective, focusableElements, focusInitial, trapTab, restoreFocus } from './lib/overlay/focus-scope';
export { computePosition, ShyComputePositionOptions } from './lib/overlay/position';
export { shyLayer, layerRank } from './lib/overlay/layers';

// Utilities
export { ru } from './lib/utils/ru';
export { animateOut, AnimateOutOptions } from './lib/utils/animate-out';

// Interfaces
export { ShyOverlayConfig, ShyOverlayContext, ShyPositionOptions, ShyPositionResult, ShyRect } from './lib/interfaces/overlay/overlay.interface';
export { ShyDialogConfig, ShyDrawerConfig, ShyConfirmDialogOptions, ShyAlertDialogOptions } from './lib/interfaces/dialog/dialog.interface';
export { ShySelectOption } from './lib/interfaces/select/select.interface';
export { ShyFileRejection, ShyFileRejectionReason } from './lib/interfaces/file-dropzone/file-dropzone.interface';
export { ShySnackbarOptions, ShySnackbarConfig, ShySnackbarRef } from './lib/interfaces/snackbar/snackbar.interface';

// Types
export { ShyAlertIntent } from './lib/types/alert/alert.type';
export { ShyAvatarSize, ShyAvatarShape } from './lib/types/avatar/avatar.type';
export { ShySortDirection, ShyTableSort, ShyTableCellContext } from './lib/types/table/table.type';
export { ShyStepperOrientation } from './lib/types/stepper/stepper.type';
export { ShyAppShellSidebarMode } from './lib/types/app-shell/app-shell.type';
export { ShyBadgeVariant, ShyBadgeSize } from './lib/types/badge/badge.type';
export { ShyCardElevation } from './lib/types/card/card.type';
export { ShyDialogSize, ShyDrawerSide } from './lib/types/dialog/dialog.type';
export { ShyDividerOrientation } from './lib/types/divider/divider.type';
export { ShyButtonVariant, ShyButtonSize, ShyButtonLoadingPosition, ShyIconButtonVariant } from './lib/types/button/button.type';
export { ShyInputSize } from './lib/types/input/input.type';
export { SHY_LAYERS, ShyLayer, ShyOverlayLayer, ShyPlacement, ShySide, ShyInitialFocus } from './lib/types/overlay/overlay.type';
export { ShyIntent } from './lib/types/intent/intent.type';
export { ShyProgressSize } from './lib/types/progress/progress.type';
export { ShyRadioOrientation } from './lib/types/radio/radio.type';
export { ShySkeletonShape, ShySkeletonAnimation } from './lib/types/skeleton/skeleton.type';
export { ShySpinnerVariant, ShySpinnerSize } from './lib/types/spinner/spinner.type';
export { SnackbarPosition, ShySnackbarIntent, ShySnackbarAlign, ShySnackbarCloseReason } from './lib/types/snackbar/snackbar.type';

// Icons
export { ICONS } from './lib/components/icon/icons';
```

---

## Repository

[github.com/shyland-dev/npm](https://github.com/shyland-dev/npm)
