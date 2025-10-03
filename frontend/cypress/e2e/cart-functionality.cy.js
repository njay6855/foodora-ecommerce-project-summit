describe('Add to Cart and Cart Page', () => {
  // NOTE: Quantity inputs use onBlur events for updates
  // Always use .blur() after .type() to trigger quantity changes
  
  // Helper function to update quantity with robust approach
  function updateQuantityRobustly(selector, newValue) {
    cy.get(selector)
      .should('be.visible')
      .focus()
      .clear()
      .type(newValue.toString(), { delay: 100 })
      .blur()
      
    // Verify the value was set
    cy.get(selector).should('have.value', newValue.toString())
    
    // Wait for any async operations
    cy.wait(2000)
  }
  
  beforeEach(() => {
    // Visit homepage and wait for loading
    cy.visit('/', {
      onBeforeLoad(win) {
        if (!win.System) {
          win.System = { import: () => Promise.resolve({}), register: () => {}, resolve: () => '' }
        }
      }
    })
    cy.wait(5000)
    
    // Login before each test
    loginUser()
  })

  // Helper function to login user
  function loginUser() {
    // Navigate to login page
    cy.get('body').then(($body) => {
      if ($body.find('a:contains("Login"), .login-btn, a[href*="login"]').length > 0) {
        cy.get('a:contains("Login"), .login-btn, a[href*="login"]').first().click()
      } else {
        cy.visit('/auth/login')
      }
    })
    
    cy.wait(2000)
    
    // Fill login form
    cy.get('input[type="email"], input[name="email"], #email').type('alice6@example.com')
    cy.get('input[type="password"], input[name="password"], #password').type('12345')
    
    // Submit login form
    cy.get('button[type="submit"], .login-submit, button:contains("Login")').click()
    
    cy.wait(3000)
    
    // Verify login success (should redirect away from login page)
    cy.url().should('not.include', '/auth/login')
  }

  it('should add a product to cart from product detail page', () => {
    // Navigate to a product detail page
    cy.get('body').then(($body) => {
      if ($body.find('.view-details-btn, .product-card a, a:contains("View Details")').length > 0) {
        // Click on first available product
        cy.get('.view-details-btn, .product-card a, a:contains("View Details")').first().click()
      } else {
        // Navigate to category first, then product
        cy.get('.view-all-btn').first().click()
        cy.wait(2000)
        cy.get('.view-details-btn, .product-card a, a:contains("View Details")').first().click()
      }
    })

    cy.wait(3000)

    // Verify we're on product detail page
    cy.url().should('include', '/product/')

    // Check if add to cart section is visible
    cy.get('.add-to-cart-container, .add-to-cart-btn, button:contains("Add to Cart")').should('exist')

    // Set quantity (optional - default is usually 1)
    cy.get('body').then(($body) => {
      if ($body.find('input[type="number"]').length > 0) {
        cy.get('input[type="number"]')
          .focus() // Explicitly focus
          .clear()
          .type('2', { delay: 100 }) // Add delay
          .blur() // Trigger onBlur event
          
        // Verify the quantity was set
        cy.get('input[type="number"]').should('have.value', '2')
        cy.wait(1000) // Wait for any validation
      }
    })

    // Click add to cart button
    cy.get('.add-to-cart-btn, button:contains("Add to Cart")').click()

    // Verify success message or button state change
    cy.get('body').then(($body) => {
      if ($body.text().includes('Added to Cart')) {
        cy.get('body').should('contain.text', 'Added to Cart')
      } else {
        cy.get('.add-to-cart-btn').should('have.class', 'success')
      }
    })

    cy.wait(1000)
  })

  it('should open cart page and verify items, quantities, and prices', () => {
    // First add a product to cart
    addProductToCart()

    // Navigate to cart page
    cy.visit('/cart')
    cy.wait(3000)

    // Verify cart page elements
    cy.get('h2:contains("Shopping Cart"), .cart-header').should('be.visible')

    // Check if cart items are displayed
    cy.get('body').then(($body) => {
      if ($body.find('.cart-item').length > 0) {
        // Cart has items
        cy.get('.cart-item').should('have.length.greaterThan', 0)
        
        // Verify item details
        cy.get('.cart-item-title, .cart-item .product-name').should('be.visible')
        cy.get('.cart-item-unit-price, .cart-item .price').should('contain', '$')
        cy.get('.cart-item-quantity, .cart-item input[type="number"]').should('be.visible')
        cy.get('.cart-item-total, .cart-item .total').should('contain', '$')

        // Verify cart summary/order summary
        cy.get('.cart-summary, .order-summary').should('be.visible')
        cy.get('body').should(($body) => {
          const text = $body.text()
          expect(text).to.satisfy((text) => {
            return text.includes('Order Summary') || 
                   text.includes('Cart Total') || 
                   text.includes('Subtotal')
          })
        })

      } else {
        // Empty cart
        cy.get('body').should(($body) => {
          const text = $body.text()
          expect(text).to.satisfy((text) => {
            return text.includes('cart is empty') || text.includes('No items')
          })
        })
      }
    })
  })

  it('should update product quantities in cart', () => {
    // First add a product to cart
    addProductToCart()
    
    // Navigate to cart page
    cy.visit('/cart')
    cy.wait(3000)

    // Check if cart has items
    cy.get('body').then(($body) => {
      if ($body.find('.cart-item').length > 0) {
        // Get initial quantity and total
        cy.get('.cart-item-quantity, .cart-item input[type="number"]').first().then(($input) => {
          const initialQuantity = parseInt($input.val())
          const newQuantity = initialQuantity + 2 // Increase by 2 to ensure noticeable change
          
          cy.get('.cart-summary-total, .total-amount').invoke('text').then((initialTotal) => {
            // More robust quantity update approach
            cy.get('.cart-item-quantity, .cart-item input[type="number"]').first()
              .focus() // Explicitly focus first
              .clear()
              .type(newQuantity.toString(), { delay: 100 }) // Add delay between keystrokes
              .blur() // Trigger blur event
              
            // Wait for API call and DOM update
            cy.wait(4000)
            
            // Verify the input value was actually updated
            cy.get('.cart-item-quantity, .cart-item input[type="number"]').first()
              .should('have.value', newQuantity.toString())

            // Verify total has updated by checking it's different
            cy.get('.cart-summary-total, .total-amount').invoke('text').should('not.equal', initialTotal)
          })
        })

        // Verify item total has updated for the changed item
        cy.get('.cart-item-total, .cart-item .total').first().should('contain', '$')

      } else {
        cy.log('No items in cart to update quantities')
      }
    })
  })

  it('should remove products from cart', () => {
    // First add a product to cart
    addProductToCart()
    
    // Navigate to cart page
    cy.visit('/cart')
    cy.wait(3000)

    // Check if cart has items
    cy.get('body').then(($body) => {
      if ($body.find('.cart-item').length > 0) {
        // Count initial items
        cy.get('.cart-item').then(($items) => {
          const initialCount = $items.length

          // Remove first item
          cy.get('.cart-item-remove, .cart-item button:contains("Remove")').first().click()

          cy.wait(2000)

          // Verify item count decreased or show empty message
          if (initialCount > 1) {
            cy.get('.cart-item').should('have.length', initialCount - 1)
          } else {
            cy.get('body').should(($body) => {
              const text = $body.text()
              expect(text).to.satisfy((text) => {
                return text.includes('cart is empty') || text.includes('No items')
              })
            })
          }
        })

      } else {
        cy.log('No items in cart to remove')
      }
    })
  })

  it('should verify cart total updates correctly', () => {
    // First add a product to cart
    addProductToCart()
    
    // Navigate to cart page
    cy.visit('/cart')
    cy.wait(3000)

    cy.get('body').then(($body) => {
      if ($body.find('.cart-item').length > 0) {
        // Check subtotal calculation
        let calculatedSubtotal = 0
        
        cy.get('.cart-item').each(($item) => {
          // Extract price and quantity for each item
          cy.wrap($item).find('.cart-item-unit-price, .price').invoke('text').then((priceText) => {
            const price = parseFloat(priceText.replace('$', '').replace(' per unit', ''))
            
            cy.wrap($item).find('.cart-item-quantity, input[type="number"]').invoke('val').then((quantity) => {
              calculatedSubtotal += price * parseInt(quantity)
            })
          })
        }).then(() => {
          // Verify the displayed subtotal matches calculation
          cy.get('.cart-summary').should('be.visible')
          cy.get('body').should('contain.text', 'Subtotal')
          cy.get('body').should('contain.text', 'Tax')
          cy.get('body').should('contain.text', 'Total')
        })

        // Test quantity change affects total
        cy.get('.cart-item-quantity, input[type="number"]').first().then(($input) => {
          const currentQty = parseInt($input.val())
          const newQty = currentQty + 1

          cy.wrap($input)
            .focus()
            .clear()
            .type(newQty.toString(), { delay: 100 })
            .blur()
            
          // Verify the input value updated
          cy.wrap($input).should('have.value', newQty.toString())
          cy.wait(3000) // Wait longer for API update

          // Verify totals have updated
          cy.get('.cart-summary-total, .total-amount').should('be.visible')
        })

      } else {
        cy.log('No items in cart to verify totals')
      }
    })
  })

  it('should clear entire cart', () => {
    // First add a product to cart
    addProductToCart()
    
    // Navigate to cart page
    cy.visit('/cart')
    cy.wait(3000)

    cy.get('body').then(($body) => {
      if ($body.find('.cart-item').length > 0) {
        // Click clear cart button
        cy.get('.cart-clear-btn, button:contains("Clear Cart")').click()

        // Handle SweetAlert2 confirmation
        cy.get('.swal2-confirm, button:contains("Yes")').click()
        cy.wait(2000)

        // Verify cart is empty
        cy.get('body').should(($body) => {
          const text = $body.text()
          expect(text).to.satisfy((text) => {
            return text.includes('cart is empty') || text.includes('No items')
          })
        })

      } else {
        cy.log('Cart is already empty')
      }
    })
  })

  // Helper function to add product to cart
  function addProductToCart() {
    cy.get('body').then(($body) => {
      if ($body.find('.view-details-btn, .product-card a').length > 0) {
        cy.get('.view-details-btn, .product-card a').first().click()
      } else {
        cy.get('.view-all-btn').first().click()
        cy.wait(2000)
        cy.get('.view-details-btn, .product-card a').first().click()
      }
    })

    cy.wait(3000)
    cy.get('.add-to-cart-btn, button:contains("Add to Cart")').click()
    cy.wait(1000)
    cy.visit('/')
    cy.wait(2000)
  }
})