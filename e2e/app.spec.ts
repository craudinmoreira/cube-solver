import { expect, test, type Page } from '@playwright/test'

/** Coleta erros de console e de página (inclui violações de CSP). */
const trackErrors = (page: Page) => {
  const errors: string[] = []
  page.on('console', (m) => {
    // COOP é ignorado em http://localhost e não é erro do app
    if (m.type() === 'error' && !m.text().includes('Cross-Origin-Opener-Policy')) errors.push(m.text())
  })
  page.on('pageerror', (e) => errors.push(e.message))
  return errors
}

test('carrega sob a CSP de produção, sem erros, com o cubo renderizado', async ({ page }) => {
  const errors = trackErrors(page)
  const response = await page.goto('/')
  expect(response?.headers()['content-security-policy']).toContain("default-src 'self'")
  await expect(page.locator('canvas')).toBeVisible()
  await expect(page.getByText('Resolvido')).toBeVisible()
  // Nenhum recurso de terceiros (ex.: Google Fonts)
  const external = await page.evaluate(() =>
    performance.getEntriesByType('resource').map((r) => r.name).filter((u) => !u.startsWith(location.origin)),
  )
  expect(external).toEqual([])
  expect(errors).toEqual([])
})

test('executa uma sequência e o desfaz até resolver', async ({ page, isMobile }) => {
  const errors = trackErrors(page)
  await page.goto('/')
  if (isMobile) await page.getByRole('button', { name: 'Abrir estado e sequência' }).click()

  await page.getByRole('slider', { name: 'Velocidade da animação' }).fill('20')
  await page.getByLabel('Sequência de movimentos').fill('R U Ri Ui')
  await page.getByRole('button', { name: /^Executar/ }).click()
  if (isMobile) await page.keyboard.press('Escape')

  await expect(page.getByText('4 movimentos')).toBeVisible({ timeout: 15_000 })

  await page.getByRole('button', { name: 'Resetar cubo', exact: true }).click()
  await expect(page.getByText('Resolvido')).toBeVisible({ timeout: 15_000 })
  expect(errors).toEqual([])
})

test('o chip de versão abre e fecha "Novidades"', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/')
  await page.getByRole('button', { name: /^Novidades da versão/ }).click()
  const dialog = page.getByRole('dialog', { name: /Novidades/ })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('link', { name: /Todas as versões/ })).toHaveAttribute('href', /\/releases$/)
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  expect(errors).toEqual([])
})
