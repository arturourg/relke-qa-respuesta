import { test, expect, Page } from '@playwright/test';

const login = async (page : Page) => {
    await page.goto('https://demo.relbase.cl/ingresar');
    await expect(page.getByRole('textbox', { name: 'Correo Electrónico' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Correo Electrónico' }).fill('qa_junior@relke.cl');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('Demo123456!');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
};

const navigateToNewSalesNote = async (page : Page) => {
    await expect(page.getByRole('link', { name: ' Ventas' })).toBeVisible();
    await page.getByRole('link', { name: ' Ventas' }).click();
    await expect(page.getByRole('link', { name: ' Notas de venta' })).toBeVisible();
    await page.getByRole('link', { name: ' Notas de venta' }).click();
    await expect(page.getByRole('link', { name: ' Nuevo' })).toBeVisible();
    await page.getByRole('link', { name: ' Nuevo' }).click();
    await expect(page.getByRole('link', { name: 'Nota de venta', exact: true })).toBeVisible();
    await page.getByRole('link', { name: 'Nota de venta', exact: true }).click();
};

const fillRequiredFields = async (page : Page) => {
  // Seleccionar tipo de documento
    await page.locator('#select2-sales_note_type_document_sii-container').click();
    await page.getByRole('treeitem', { name: 'FACTURA ELECTRÓNICA' }).click();

  // Seleccionar bodega
    await page.locator('#select2-sales_note_ware_house_id-container').click();
    await page.getByRole('treeitem', { name: 'Bodega principal' }).click();

  // Seleccionar cliente
    await page.locator('#select2-sales_note_customer_id-container').click();
    await page.locator('input[type="search"]').fill('mi');
    await page.getByRole('treeitem', { name: '[18638903-4] Jose Miguel' }).click();

  // Seleccionar moneda
    await page.getByRole('combobox', { name: 'Pesos' }).locator('span').nth(1).click();
    await page.getByRole('treeitem', { name: 'Pesos' }).click();
};

const addProduct = async (page : Page, productName: string, quantity: string | number) => {
    await page.getByTitle(productName).click();
    await page.locator('input[type="search"]').fill(productName.substring(0, 3));
    await page.locator(`tr:has-text("${productName}") input[name*="quantity"]`).first().fill(quantity.toString());
    await page.locator(`tr:has-text("${productName}") input[name*="quantity"]`).first().press('Enter');
};

const setupDialogHandler = (page : Page) => {
    page.on('dialog', async dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        await dialog.accept();
    });
};

// Tests
test.describe('Notas de Venta', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
    });

    test('Crear nota de venta - Happy path', async ({ page }) => {
        await navigateToNewSalesNote(page);
        await fillRequiredFields(page);
        setupDialogHandler(page);

        // Agregar producto
        await addProduct(page, 'Casco Bell MTB Traverse', 2);

        // Validar total
        await expect(page.locator('#total')).toContainText('99.979', { timeout: 5000 });
        const totalText = await page.locator('#total').innerText();
        const cleanNumber = parseInt(totalText.replace(/\D/g, ''), 10);
        expect(cleanNumber).toBeGreaterThan(0);

        // Verificar cálculo
        const totalEsperado = parseInt(((2 * 42008.0) * 1.19));

        //Validar que el total calculado sea correcto
        expect(cleanNumber).toBe(totalEsperado);

    });

    test('Validación de error de campo requerido', async ({ page }) => {
        await page.goto('/dtes/notas-venta/new');
        setupDialogHandler(page);
        
        // Intentar enviar sin completar campos
        await page.getByRole('button', { name: ' Enviar' }).click();

        // Verificar mensaje de error
        await expect(page.getByText('Hubo problemas con los siguientes campos:')).toBeVisible();
    });

    test('Validación agregar cantidad', async ({ page }) => {
        await page.goto('/dtes/notas-venta/new');
        await fillRequiredFields(page);
        setupDialogHandler(page);

        // Agregar producto sin cantidad
        await addProduct(page, '[CBMT] Casco Bell MTB Traverse', '');
        
        // Intentar enviar
        await page.getByRole('button', { name: ' Enviar' }).click();

        // Verificar mensaje de error
        await expect(page.getByText('Debe ingresar solo números en cantidad.')).toBeVisible();
    });
});