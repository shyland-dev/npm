import { Injectable, isDevMode } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DebugService {
  log(component: object, ...values: unknown[]): void {
    if (!isDevMode()) return;

    const componentName = component.constructor.name.replace('_', '');
    const methodName = this.getCallerMethodName();

    console.log(`[debug] @${componentName}#${methodName}`, ...values);
  }

  private getCallerMethodName(): string {
    const stack = new Error().stack?.split('\n') ?? [];
    // stack[0] = 'Error'
    // stack[1] = getCallerMethodName
    // stack[2] = log
    // stack[3] = caller
    const line = stack[3] ?? '';
    if (/at new \w+/.test(line)) return 'constructor';
    const match = line.match(/at \w+\.(\w+)/);
    return match?.[1] ?? 'unknown';
  }
}
