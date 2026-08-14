import { spawn } from 'node:child_process';
import { startLocalApiServer } from './local-api-server.mjs';

const apiServer = await startLocalApiServer();
const vite = spawn('vite', [], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

function shutdown(code = 0) {
  if (!vite.killed) {
    vite.kill('SIGTERM');
  }

  apiServer.close(() => process.exit(code));
}

vite.on('exit', (code) => {
  shutdown(typeof code === 'number' ? code : 0);
});

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
