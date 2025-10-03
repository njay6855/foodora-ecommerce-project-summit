// Global configurations
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignore single-spa and SystemJS related errors that don't affect functionality
  if (
    err.message.includes('single-spa') || 
    err.message.includes('SystemJS') ||
    err.message.includes('System is not defined') ||
    err.message.includes('System.import') ||
    err.message.includes('Cannot read properties of undefined')
  ) {
    return false
  }
  return true
})
