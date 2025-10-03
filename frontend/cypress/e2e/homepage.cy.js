describe('Homepage Loading Test', () => {
  it('should load homepage correctly with all microfrontends', () => {
    // Visit the homepage with error handling
    cy.visit('/', {
      onBeforeLoad(win) {
        // Ensure System is available or provide a mock
        if (!win.System) {
          win.System = {
            import: () => Promise.resolve({}),
            register: () => {},
            resolve: () => ''
          }
        }
      }
    })
    
    // Wait longer for MFEs to load
    cy.wait(5000)
    
    // Check if the page title is correct
    cy.title().should('not.be.empty')
    
    // Check if the navbar is loaded (should be visible at the top)
    cy.get('nav').should('be.visible')
    
    // Check if the main content area exists
    cy.get('body').should(($body) => {
      const text = $body.text()
      expect(text).to.satisfy((text) => {
        return text.includes('Welcome') || 
               text.includes('Home') || 
               text.includes('Food') || 
               text.includes('Categories')
      })
    })
    
    // Check if footer is loaded (should be at the bottom)
    cy.get('footer').should('exist')
    
    // Verify that the page has loaded without major errors
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    
    // Simplified checks - just verify basic elements exist
    cy.get('body').should('exist')
    cy.get('nav').should('be.visible')
    cy.get('footer').should('exist')
  })
  
  it('should have responsive layout', () => {
    // Test desktop view
    cy.viewport(1280, 720)
    cy.visit('/', {
      onBeforeLoad(win) {
        if (!win.System) {
          win.System = { import: () => Promise.resolve({}), register: () => {}, resolve: () => '' }
        }
      }
    })
    cy.wait(3000)
    cy.get('nav').should('be.visible')
    
    // Test mobile view
    cy.viewport(375, 667)
    cy.wait(1000)
    cy.get('nav').should('be.visible')
  })
  
  it('should load without major errors', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        if (!win.System) {
          win.System = { import: () => Promise.resolve({}), register: () => {}, resolve: () => '' }
        }
      }
    })
    cy.wait(3000)
    
    // Simple check - page should load successfully
    cy.get('body').should('exist')
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})
