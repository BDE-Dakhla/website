import { chromium } from '@playwright/test'

async function globalSetup() {
  console.log('🔧 Setting up test environment...')

  // Wait for the development server to be ready
  const startTime = Date.now()
  const maxWaitTime = 120000 // 2 minutes
  const checkInterval = 1000 // 1 second

  while (Date.now() - startTime < maxWaitTime) {
    try {
      const browser = await chromium.launch()
      const response = await fetch('http://localhost:3000')
      await browser.close()

      if (response.ok) {
        console.log('✅ Development server is ready')
        return
      }
    } catch {
      console.log('⏳ Waiting for development server...')
    }

    await new Promise((resolve) => setTimeout(resolve, checkInterval))
  }

  throw new Error('Development server failed to start within timeout')
}

export default globalSetup
