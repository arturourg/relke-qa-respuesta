# README - Pruebas Automatizadas con Playwright

## 📋 Descripción del Proyecto
Este proyecto contiene pruebas automatizadas para el sistema de notas de venta de Relbase, implementadas con Playwright. Las pruebas cubren flujos positivos y negativos del sistema.

## 🚀 Cómo Ejecutar los Tests

### Prerrequisitos
- Tener instalado [Visual Studio Code](https://code.visualstudio.com/)
- Instalar el plugin de [Playwright para VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)

### Pasos para Ejecución
1. Clonar el repositorio
2. Abrir el proyecto en VSCode
3. Instalar dependencias con:
   ```bash
   npm install
   ```
4. Ejecutar los tests:
   - Abrir el archivo de tests
   - Hacer clic en "Run Tests" en la parte superior del editor
   - O ejecutar desde la terminal:
     ```bash
     npx playwright test
     ```

## ✔️ Validaciones Implementadas

### Pruebas de Autenticación
- ✅ Inicio de sesión con credenciales válidas
- ✅ Logout exitoso
- ❌ Inicio de sesión sin credenciales
- ❌ Inicio de sesión con credenciales erróneas

### Pruebas de Notas de Venta
- ✅ Happy Path: Creación exitosa de nota de venta
  - Selección de tipo de documento
  - Asignación de bodega
  - Selección de cliente
  - Agregar productos
  - Validación de cálculos (cantidad × precio)
  - Envío del documento
- ❌ Validación de campos requeridos
- ❌ Validación de formato en campo cantidad

## 🧩 Desafíos y Decisiones Técnicas

### Desafío 1: IDs Dinámicos
**Problema:** Los campos de cantidad tenían IDs que cambiaban en cada ejecución.

**Solución:** Implementé selectores robustos usando:
```typescript
`tr:has-text("${productName}") input[name*="quantity"]`
```

### Desafío 2: Cálculo de Totales
**Problema:** Validar que el total coincidiera con precio × cantidad × IVA.

**Solución:** Implementé conversión de formatos monetarios y validación estricta:
```typescript
const totalText = await page.locator('#total').innerText();
const cleanNumber = parseInt(totalText.replace(/\D/g, ''), 10);
expect(cleanNumber).toBe(totalEsperado);
```

### Desafío 3: Manejo de Diálogos
**Problema:** Los diálogos de confirmación bloqueaban el flujo.

**Solución:** Configuré un manejador global:
```typescript
page.on('dialog', dialog => dialog.accept());
```

## 🎥 Video Explicativo
[Ver video de explicación de la prueba técnica](https://ejemplo.com/video-explicativo) *(link pendiente)*

## 🛠️ Tecnologías Utilizadas
- Playwright 1.42.0
- TypeScript
- Visual Studio Code

## 📊 Reportes
Para generar reportes HTML ejecutar:
```bash
npx playwright show-report
```

## 🤝 Contribuciones
Las sugerencias y mejoras son bienvenidas. Por favor abra un issue o pull request.