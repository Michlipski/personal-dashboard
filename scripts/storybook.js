const { spawn } = require('child_process');

process.env.EXPO_PUBLIC_STORYBOOK = 'true';

const args = process.argv.slice(2);
const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

console.log('🚀 Starting Personal Dashboard in Storybook mode...');

const child = spawn(npxCmd, ['expo', 'start', ...args], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
