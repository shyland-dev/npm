# @shyland-dev/ui

Angular component library by Shyland Dev — inline SVG icons, a notification snackbar, and a customizable select, ready to use.

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

> Breaking in `0.1.0` (components): `--shyIconSize` → `--shy-icon-size`; `--shySelect*` → `--shy-select-*`; `--shySnackbar*` → `--shy-snackbar-*`; the fallback icon for an unknown name is `question-circle`.
>
> Breaking in `0.1.0` (globals): `--responsive-unit`, `--dynamic-*`, `$responsive-unit` and `$dynamic-*` no longer exist (no alias). Use `--shy-responsive-unit` / `ru(N)` and `--shy-dynamic-*`.

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
export { ButtonComponent } from './lib/components/button/button.component';
export { IconButtonComponent } from './lib/components/icon-button/icon-button.component';
export { AlertComponent } from './lib/components/alert/alert.component';
export { BadgeComponent } from './lib/components/badge/badge.component';
export { CheckboxComponent } from './lib/components/checkbox/checkbox.component';
export { CardComponent } from './lib/components/card/card.component';
export { DialogComponent } from './lib/components/dialog/dialog.component';
export { DividerComponent } from './lib/components/divider/divider.component';
export { DrawerComponent } from './lib/components/drawer/drawer.component';
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
export { SnackbarComponent } from './lib/components/snackbar/snackbar.component';
export { SpinnerComponent } from './lib/components/spinner/spinner.component';
export { SwitchComponent } from './lib/components/switch/switch.component';
export { ThemeToggleComponent, ShyThemeToggleLabels } from './lib/components/theme-toggle/theme-toggle.component';

// Services
export { DialogService } from './lib/services/dialog/dialog.service';
export { DrawerService } from './lib/services/drawer/drawer.service';
export { SnackbarService } from './lib/services/snackbar/snackbar.service';
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
export { SelectOption, SelectionChangeEvent } from './lib/interfaces/select/select.interface';
export { SnackbarShowOptions } from './lib/interfaces/snackbar/snackbar.interface';

// Types
export { ShyAlertIntent } from './lib/types/alert/alert.type';
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
export { SnackbarPosition } from './lib/types/snackbar/snackbar.type';

// Icons
export { ICONS } from './lib/components/icon/icons';
```

---

## Repository

[github.com/shyland-dev/npm](https://github.com/shyland-dev/npm)
