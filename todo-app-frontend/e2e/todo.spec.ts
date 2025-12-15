import { test, expect } from '@playwright/test';

test.describe('Todo App E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page when not authenticated', async ({ page }) => {
    await expect(page.locator('text=Connectez-vous à votre compte')).toBeVisible();
  });

  test('should login successfully', async ({ page }) => {
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Se connecter")');
    
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should create a new todo', async ({ page }) => {
    // Login first
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Se connecter")');
    
    // Navigate to todos
    await page.click('text=Mes Tâches');
    await page.click('button:has-text("Nouvelle tâche")');
    
    // Fill form
    await page.fill('input[placeholder*="Titre"]', 'Test Todo');
    await page.fill('textarea', 'This is a test todo');
    await page.click('button:has-text("Créer")');
    
    // Verify todo appears
    await expect(page.locator('text=Test Todo')).toBeVisible();
  });

  test('should filter todos', async ({ page }) => {
    // Login first
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Se connecter")');
    
    // Navigate to todos
    await page.click('text=Mes Tâches');
    
    // Filter by active
    await page.selectOption('select', 'active');
    await expect(page.locator('text=Actives')).toBeVisible();
  });

  test('should search todos', async ({ page }) => {
    // Login first
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Se connecter")');
    
    // Navigate to todos
    await page.click('text=Mes Tâches');
    
    // Search
    await page.fill('input[placeholder="Rechercher..."]', 'Compléter');
    await expect(page.locator('text=Compléter le projet Todo App')).toBeVisible();
  });
});

