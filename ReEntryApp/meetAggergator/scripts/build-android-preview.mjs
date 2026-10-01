import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const inspect = process.argv.includes('--inspect');
const allowed = new Set(['--inspect', '--non-interactive', '--no-wait']);
if (process.argv.slice(2).some(arg => !allowed.has(arg))) {
  throw new Error('Supported flags: --inspect, --non-interactive, --no-wait');
}
const args = inspect
  ? ['build:inspect', '--platform', 'android', '--stage', 'archive', '--profile', 'preview', '--output', path.join(root, 'logs', 'eas-archive-' + Date.now())]
  : ['build', '--platform', 'android', '--profile', 'preview', ...process.argv.slice(2)];
const isWindows = process.platform === 'win32';
// Fixed CLI arguments only. cmd.exe is required to launch npx.cmd on Windows.
const command = isWindows
  ? `npx.cmd --yes eas-cli@latest ${args.map(arg => arg.includes(' ') ? '"' + arg + '"' : arg).join(' ')}`
  : 'npx';
const child = spawn(command, isWindows ? [] : ['--yes', 'eas-cli@latest', ...args], {
  shell: isWindows,
  cwd: path.join(root, 'apps', 'client'),
  stdio: 'inherit',
  env: { ...process.env, EAS_NO_VCS: '1', EAS_PROJECT_ROOT: root },
});
child.on('error', error => { console.error(error.message); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
