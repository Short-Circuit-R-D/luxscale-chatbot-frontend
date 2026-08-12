import { loadEnvFile } from 'node:process';
import { writeFile } from 'node:fs/promises';

try {
  loadEnvFile('.env');
} catch (error) {
  if (error?.code !== 'ENOENT') {
    throw error;
  }
}

const runtimeEnvironment = {
  BACKEND_BASE_URL: process.env.BACKEND_BASE_URL ?? '',
};

await writeFile(
  'public/env.js',
  `window.__APP_ENV__ = Object.freeze(${JSON.stringify(runtimeEnvironment)});\n`,
);
