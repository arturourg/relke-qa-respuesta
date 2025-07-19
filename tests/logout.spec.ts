import { test, expect, Page } from '@playwright/test';

const login = async (page: Page) => {
    await page.goto('https://demo.relbase.cl/ingresar');
    await expect(page.getByRole('textbox', { name: 'Correo Electrónico' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Correo Electrónico' }).fill('qa_junior@relke.cl');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('Demo123456!');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
};
test('Logout', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: ' QA' }).click();
  await page.getByRole('link', { name: ' Salir' }).click();
  await page.getByText('Iniciar sesión Debes ingresar').click();
  await expect(page.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible();
});