import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: {
    headless: true,
    viewport: { width: 1280, height: 800 },
    baseURL: 'https://demo.relbase.cl',
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry', 
    video: 'retain-on-failure',
    channel: 'chrome',  // usa Google Chrome instalado localmente :contentReference[oaicite:1]{index=1}
  },
  projects: [
    {
      name: 'Microsoft Edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge', // 🟣 Usa Edge estable
      },
    },
  ],
  testDir: './tests',
  timeout: 30000,
});
