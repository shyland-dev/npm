# @shyland-dev/utils

Angular utilities by Shyland Dev — helper services for development.

## Requirements

- Angular **17+**
- Node.js **18+**

## Installation

```bash
npm install @shyland-dev/utils
```

---

## Services

### `DebugService`

A debug logging service that prints messages **only in development mode** (`isDevMode()`). In production, all logs are silenced automatically.

Each message includes the component name and the method that triggered the log, making it easy to trace the call origin.

**Provided in:** `root` (globally available, no module import needed)

**Message format:**

```
[debug] @ComponentName#methodName value1 value2 ...
```

**Method:**

| Method                      | Parameters                               | Description                          |
| --------------------------- | ---------------------------------------- | ------------------------------------ |
| `log(component, ...values)` | `component: object`, `values: unknown[]` | Logs to the console in dev mode only |

**Usage:**

```typescript
import { DebugService } from '@shyland-dev/utils';

@Component({
    /* ... */
})
export class MyComponent {
    constructor(private debug: DebugService) {}

    load() {
        const data = { id: 1, name: 'Test' };
        this.debug.log(this, data);
        // Output: [debug] @MyComponent#load { id: 1, name: 'Test' }
    }
}
```

**Usage in constructor:**

```typescript
constructor(private debug: DebugService) {
  this.debug.log(this, 'instantiated');
  // Output: [debug] @MyComponent#constructor instantiated
}
```

> **Note:** The service uses `Error.stack` to detect the caller method name. Behavior may vary in environments with active code minification.

---

## Exports

```typescript
export { DebugService } from './lib/services/debug.service';
```

---

## Repository

[github.com/shyland-dev/npm](https://github.com/shyland-dev/npm)
