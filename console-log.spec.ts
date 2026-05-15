import { test } from '@playwright/test';

test('capture console logs', async ({ page }) => {
  page.on('console', msg => console.log('PAGE_LOG', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('PAGE_ERROR', error.message));
  await page.goto('https://yusufsamodien12-hub.github.io/world25/', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(5000);
});
