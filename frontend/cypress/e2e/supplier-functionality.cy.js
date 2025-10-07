describe('Supplier Functionality E2E Tests', () => {
  const testUser = {
    email: 'alice6@example.com',
    password: '12345'
  };

  const testProduct = {
    name: 'Test Product ' + Date.now(),
    description: 'This is a test product created by Cypress automation',
    price: '29.99',
    stockQuantity: '50',
    imageUrl: 'https://via.placeholder.com/300x200?text=Test+Product'
  };

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    
    cy.visit('/');
    
    cy.wait(2000);
  });

  describe('Login Flow', () => {
    it('should successfully login as a supplier', () => {
    
      cy.get('.btn-signin').should('be.visible').click();
      
      cy.url().should('include', '/auth/login');
      cy.get('.auth-title').should('contain', 'Login');
      
      cy.get('#email').should('be.visible').type(testUser.email);
      cy.get('#password').should('be.visible').type(testUser.password);
      
      cy.get('button[type="submit"]').should('contain', 'Login').click();

      cy.wait(3000);

      cy.url().should('eq', Cypress.config().baseUrl + '/');
      
      cy.get('#profileDropdown').should('be.visible');
    });

    it('should handle invalid login credentials', () => {
      cy.get('.btn-signin').click();

      cy.get('#email').type('invalid@example.com');
      cy.get('#password').type('wrongpassword');
      cy.get('button[type="submit"]').click();

      cy.get('.auth-error').should('be.visible');
    });
  });

  describe('Supplier Dashboard Navigation', () => {
    beforeEach(() => {

      cy.get('.btn-signin').click();
      cy.get('#email').type(testUser.email);
      cy.get('#password').type(testUser.password);
      cy.get('button[type="submit"]').click();
      cy.wait(3000);
    });

    it('should navigate to supplier dashboard from navbar', () => {
      
      cy.get('#profileDropdown').click();
      
      cy.get('.dropdown-item').contains('My Products').click();
      
      cy.url().should('include', '/supplier');
      cy.get('.dashboard-title').should('contain', 'My Products');

      cy.get('.supplier-btn-primary').should('contain', 'Add New Product');
      cy.get('.status-filter-tabs').should('be.visible');
    });

    it('should display correct supplier dashboard elements', () => {
      cy.get('#profileDropdown').click();
      cy.get('.dropdown-item').contains('My Products').click();
      cy.wait(2000);
      
      // Check all status filter tabs are present
      cy.get('.status-tab').should('have.length', 4);
      cy.get('.status-tab').eq(0).should('contain', 'All Products');
      cy.get('.status-tab').eq(1).should('contain', 'Approved');
      cy.get('.status-tab').eq(2).should('contain', 'Pending');
      cy.get('.status-tab').eq(3).should('contain', 'Rejected');
     
      cy.get('.supplier-btn-primary').should('be.enabled');
    });
  });

  describe('Add New Product Flow', () => {
    beforeEach(() => {
      // Login and navigate to supplier dashboard
      cy.get('.btn-signin').click();
      cy.get('#email').type(testUser.email);
      cy.get('#password').type(testUser.password);
      cy.get('button[type="submit"]').click();
      cy.wait(3000);
      
      cy.get('#profileDropdown').click();
      cy.get('.dropdown-item').contains('My Products').click();
      cy.wait(2000);
    });

    it('should open product form when clicking Add New Product', () => {
      
      cy.get('.supplier-btn-primary').contains('Add New Product').click();
      
      // Verify product form is displayed
      cy.get('.product-form-title').should('contain', 'Add New Product');
      cy.get('input[name="name"]').should('be.visible');
      cy.get('textarea[name="description"]').should('be.visible');
      cy.get('input[name="price"]').should('be.visible');
      cy.get('input[name="quantity"]').should('be.visible');
      cy.get('select[name="categoryId"]').should('be.visible');
    });

    it('should successfully add a new product', () => {
      
      cy.get('.supplier-btn-primary').contains('Add New Product').click();
      cy.wait(1000);
      
      cy.get('input[name="name"]').type(testProduct.name);
      cy.get('textarea[name="description"]').type(testProduct.description);
      cy.get('input[name="price"]').type(testProduct.price);
      cy.get('input[name="quantity"]').type(testProduct.stockQuantity);
      
      cy.get('select[name="categoryId"]').then($select => {
        const options = $select.find('option');
        if (options.length > 1) {
          cy.wrap($select).select(options.eq(1).val());
        }
      });
      
      cy.get('.supplier-btn-secondary').contains('Add Image URL').click();
      cy.get('input[type="url"]').type(testProduct.imageUrl);
      
      cy.get('button[type="submit"]').contains('Save Product').click();
  
      cy.wait(3000);
      
      cy.get('.dashboard-title').should('contain', 'My Products');
      cy.get('.supplier-toast-success', { timeout: 10000 }).should('be.visible');
      cy.get('.toast-message').should('contain', 'has been added successfully');
    });

    it('should validate required fields', () => {
      
      cy.get('.supplier-btn-primary').contains('Add New Product').click();
      
      cy.get('button[type="submit"]').click();
      
      cy.get('.invalid-feedback').should('have.length.greaterThan', 0);
      cy.get('input[name="name"]').siblings('.invalid-feedback').should('contain', 'Required');
      cy.get('textarea[name="description"]').siblings('.invalid-feedback').should('contain', 'Required');
    });

  });

  describe('Product Management', () => {
    beforeEach(() => {
      cy.get('.btn-signin').click();
      cy.get('#email').type(testUser.email);
      cy.get('#password').type(testUser.password);
      cy.get('button[type="submit"]').click();
      cy.wait(3000);
      
      cy.get('#profileDropdown').click();
      cy.get('.dropdown-item').contains('My Products').click();
      cy.wait(2000);
    });

    it('should filter products by status', () => {
      // Click on different status tabs and verify they're working
      cy.get('.status-tab').contains('Approved').click();
      cy.get('.status-tab.active').should('contain', 'Approved');
      
      cy.get('.status-tab').contains('Pending').click();
      cy.get('.status-tab.active').should('contain', 'Pending');
      
      cy.get('.status-tab').contains('Rejected').click();
      cy.get('.status-tab.active').should('contain', 'Rejected');
      
      cy.get('.status-tab').contains('All Products').click();
      cy.get('.status-tab.active').should('contain', 'All Products');
    });

    it('should display product cards if products exist', () => {
      
      cy.wait(2000);
      
      // Check if products exist or show empty state
      cy.get('body').then($body => {
        if ($body.find('.product-card').length > 0) {
          cy.get('.product-card').first().within(() => {
            cy.get('.product-card-title').should('be.visible');
            cy.get('.product-detail').contains('Price:').should('be.visible');
            cy.get('.status-badge').should('be.visible');
            cy.get('.supplier-btn-primary').should('contain', 'Edit');
            cy.get('.supplier-btn-danger').should('contain', 'Delete');
          });
        } else {
          cy.get('.empty-state').should('be.visible');
        }
      });
    });
  });

  describe('Logout Flow', () => {
    beforeEach(() => {
      cy.get('.btn-signin').click();
      cy.get('#email').type(testUser.email);
      cy.get('#password').type(testUser.password);
      cy.get('button[type="submit"]').click();
      cy.wait(3000);
    });

    it('should successfully logout', () => {
      cy.get('#profileDropdown').click();
     
      cy.get('.dropdown-item.text-danger').contains('Logout').click();
      
      cy.url().should('include', '/auth/login');
      
      cy.get('#profileDropdown').should('not.exist');
 
      cy.get('.btn-signin').should('be.visible');
    });
  });

});