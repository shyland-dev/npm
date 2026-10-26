// Roda todas as verificações do Design System (npm run check:ds).
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const CHECKS = ['check-units', 'check-calibration', 'check-tokens', 'check-contrast', 'check-hardcoded', 'check-fonts', 'check-size', 'check-icon-bundle', 'check-utils-bundle'];

let failed = 0;
for (const name of CHECKS) {
  const { status } = spawnSync(process.execPath, [fileURLToPath(new URL(`./${name}.mjs`, import.meta.url))], { stdio: 'inherit' });
  if (status !== 0) failed++;
}

console.log(failed ? `\n✗ check:ds falhou (${failed} de ${CHECKS.length})` : `\n✓ check:ds ok (${CHECKS.length} verificações)`);
process.exit(failed ? 1 : 0);
