import { expect, Page, test } from '@playwright/test';

import { e2eUser } from './mock-data';

const userAlreadyExistsAlert = 'User with that email already exists';
const greetingText = (name: string) => `Hello, ${name}!`;

const loginUrl = /\/login$/;

const loginUser = async (page: Page) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', e2eUser.email);
  await page.fill('input[name="password"]', e2eUser.password);

  await page.click('button[type="submit"]');

  await page.waitForURL('/');
};

test.describe('Auth page', () => {
  test('Redirects to login page', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(loginUrl);
  });

  test('Registration page works', async ({ page }) => {
    await page.goto('/register');
    const title = page.locator('[data-slot="card-title"]');

    await expect(title).toHaveText('Sign Up');

    await page.fill('input[name="name"]', e2eUser.name);
    await page.fill('input[name="email"]', e2eUser.email);
    await page.fill('input[name="password"]', e2eUser.password);
    await page.fill('input[name="passwordRepeat"]', e2eUser.password);

    await page.click('button[type="submit"]');

    const alert = page.getByText(userAlreadyExistsAlert);

    await expect(alert).toHaveText(userAlreadyExistsAlert);
  });

  test('Login test', async ({ page }) => {
    await loginUser(page);
    await expect(page).toHaveURL('/');
  });

  test('Should display greeting text', async ({ page }) => {
    await loginUser(page);

    await expect(page).toHaveURL('/');

    const text = greetingText(e2eUser.name.split(' ')[0]);
    const greetingNode = page.getByText(text);

    await expect(greetingNode).toBeVisible();
  });

  test('Term lookup shows a card with term and definition', async ({
    page,
  }) => {
    const term = 'Test term';

    await loginUser(page);

    await expect(page).toHaveURL('/');

    const buttonNode = page.locator('button[type="submit"]');

    await expect(buttonNode).toBeDisabled();

    await page.fill('textarea', term);

    await buttonNode.click();

    const cardTitle = page.locator('[data-slot="card-title"]');
    await expect(cardTitle).toContainText(term.trim());

    const cardContent = page.locator('[data-slot="card-content"]');
    await expect(cardContent).toHaveText(/.+/, { timeout: 5000 });
  });
});
