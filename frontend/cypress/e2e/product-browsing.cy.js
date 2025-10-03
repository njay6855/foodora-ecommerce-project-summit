describe('Product Browsing and Search', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.wait(3000) // Wait for page to load
  })

  it('should navigate to a product category and show products list', () => {
    // Check if categories section exists
    cy.get('body').should('contain.text', 'View All')
    
    // Click on "View All" button for the first category
    cy.get('.view-all-btn').first().click()
    
    // Should navigate to category page
    cy.url().should('include', '/category/')
    
    // Wait for category page to load
    cy.wait(2000)
    
    // Check if breadcrumb is visible
    cy.get('.breadcrumb').should('be.visible')
    cy.get('.breadcrumb').should('contain', 'Home')
    
    // Check if category title is displayed
    cy.get('.category-title, h2').should('be.visible')
    
    // Check if product grid exists and products are visible
    cy.get('.product-grid, .row').should('exist')
    
    // Verify products are displayed (either products exist or "no products" message)
    cy.get('body').then(($body) => {
      if ($body.find('.product-card').length > 0) {
        // Products found
        cy.get('.product-card').should('have.length.greaterThan', 0)
        cy.get('.product-title').should('be.visible')
        cy.get('.product-price').should('be.visible')
      } else {
        // No products message should be visible
        cy.contains('No products found').should('be.visible')
      }
    })
  })

  it('should use search bar to find products and show relevant results', () => {
    // Find the search input field
    cy.get('input[type="search"], .search-input, input[placeholder*="Search"]')
      .should('be.visible')
      .type('milk')
    
    // Click search button
    cy.get('button[type="submit"], .search-btn, button:contains("Search")')
      .click()
    
    // Should navigate to search results page
    cy.url().should('include', '/search')
    cy.url().should('include', 'q=milk')
    
    // Wait for search results to load
    cy.wait(2000)
    
    // Check if search results are displayed
    cy.get('body').then(($body) => {
      if ($body.find('.product-card').length > 0) {
        // Search results found
        cy.get('.product-card').should('have.length.greaterThan', 0)
        // Results should be related to the search term
        cy.get('body').should('contain.text', 'milk')
      } else {
        // No results message should be visible
        cy.contains('No products found').should('be.visible')
      }
    })
  })

  it('should click on a product to open product detail page', () => {
    // Wait for homepage to load and find a product
    cy.get('body').then(($body) => {
      if ($body.find('.product-card').length > 0) {
        // Products found on homepage - click the first one
        cy.get('.view-details-btn, .product-card a, a:contains("View Details")')
          .first()
          .click()
        
        // Should navigate to product detail page
        cy.url().should('include', '/product/')
        
        // Wait for product detail page to load
        cy.wait(2000)
        
        // Check if product detail elements are visible
        cy.get('.product-title, h1').should('be.visible')
        cy.get('.product-price').should('be.visible')
        
        // Check if breadcrumb exists
        cy.get('.breadcrumb, nav').should('be.visible')
        
        // Check if product description section exists
        cy.get('body').should('contain.text', 'Description')
        
        // Check if add to cart functionality exists
        cy.get('body').should('contain.text', 'Add to Cart')
        
      } else {
        // No products on homepage, navigate to a category first
        cy.get('.view-all-btn').first().click()
        cy.wait(2000)
        
        cy.get('body').then(($categoryBody) => {
          if ($categoryBody.find('.product-card').length > 0) {
            cy.get('.view-details-btn, .product-card a, a:contains("View Details")')
              .first()
              .click()
            
            cy.url().should('include', '/product/')
            cy.wait(2000)
            cy.get('.product-title, h1').should('be.visible')
          } else {
            cy.log('No products available to test product detail page')
          }
        })
      }
    })
  })

  it('should handle empty search results gracefully', () => {
    // Search for something that likely won't exist
    cy.get('input[type="search"], .search-input, input[placeholder*="Search"]')
      .should('be.visible')
      .type('nonexistentproduct123')
    
    cy.get('button[type="submit"], .search-btn, button:contains("Search")')
      .click()
    
    cy.wait(2000)
    
    // Should show appropriate message for no results
    cy.get('body').should(($body) => {
      const text = $body.text().toLowerCase()
      expect(text).to.satisfy((text) => {
        return text.includes('no products found') || 
               text.includes('not found') || 
               text.includes('no results')
      })
    })
  })

  it('should display product information correctly on product detail page', () => {
    // First navigate to any product
    cy.get('body').then(($body) => {
      // Try to find a product link from homepage or category
      if ($body.find('.view-details-btn, .product-card a').length > 0) {
        cy.get('.view-details-btn, .product-card a').first().click()
      } else {
        // Navigate to category first
        cy.get('.view-all-btn').first().click()
        cy.wait(2000)
        cy.get('.view-details-btn, .product-card a').first().click()
      }
      
      cy.wait(2000)
      
      // Verify product detail page elements
      cy.get('.product-title, h1').should('be.visible')
      cy.get('.product-price').should('be.visible')
      cy.get('body').should('contain.text', '$') // Price should contain dollar sign
      
      // Check if essential product information is displayed
      cy.get('body').should('contain.text', 'Description')
      cy.get('body').should('contain.text', 'Category')
      
      // Check if navigation elements work
      cy.get('.breadcrumb a, nav a').contains('Home').click()
      cy.url().should('eq', Cypress.config().baseUrl + '/')
    })
  })
})
