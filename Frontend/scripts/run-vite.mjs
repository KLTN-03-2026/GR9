import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(scriptDir, '..');
const localNode = path.resolve(projectDir, '..', '.tools', 'node-v20.19.0-win-x64', 'node.exe');
const viteCli = path.resolve(projectDir, 'node_modules', 'vite', 'bin', 'vite.js');

const nodeExec = existsSync(localNode) ? localNode : process.execPath;
const child = spawn(nodeExec, [viteCli, ...process.argv.slice(2)], {
  cwd: projectDir,
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

child.on('error', (error) => {
  console.error('Failed to start Vite:', error.message);
  process.exit(1);
});
