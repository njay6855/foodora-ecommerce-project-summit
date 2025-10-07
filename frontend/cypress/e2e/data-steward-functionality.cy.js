describe('Data Steward Functionality E2E Tests', () => {
  const testUser = {
    email: 'admin@gmail.com',
    password: '12345'
  };

  beforeEach(() => {

    cy.clearLocalStorage();
    cy.clearCookies();
  
    cy.visit('/');
  
    cy.wait(2000);
  });

  describe('Login Flow', () => {
    it('should successfully login as a data steward', () => {
      
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
  });

  describe('Data Steward Dashboard Navigation', () => {
    beforeEach(() => {
      // Login before each test in this describe block
      cy.get('.btn-signin').click();
      cy.get('#email').type(testUser.email);
      cy.get('#password').type(testUser.password);
      cy.get('button[type="submit"]').click();
      cy.wait(3000);
    });

    it('should navigate to data steward dashboard from navbar', () => {
      
      cy.get('#profileDropdown').click();

      cy.get('.dropdown-item').contains('Pending Products').click();

      cy.url().should('include', '/data-steward');
      cy.get('.steward-header').should('contain', 'Products Pending Review');
    });

    it('should display correct data steward dashboard elements', () => {
     
      cy.get('#profileDropdown').click();
      cy.get('.dropdown-item').contains('Pending Products').click();
      cy.wait(2000);
      
      cy.get('.steward-header').should('contain', 'Products Pending Review');
      cy.get('.steward-container').should('be.visible');
      
      // Check if products are loaded or empty state is shown
      cy.get('body').then($body => {
        if ($body.find('.review-card').length > 0) {
          cy.get('.review-card').should('be.visible');
        } else {
          cy.get('.steward-info').should('contain', 'No products pending review');
        }
      });
    });
  });

  describe('Product Review Flow', () => {
    beforeEach(() => {
      // Login and navigate to data steward dashboard
      cy.get('.btn-signin').click();
      cy.get('#email').type(testUser.email);
      cy.get('#password').type(testUser.password);
      cy.get('button[type="submit"]').click();
      cy.wait(3000);
      
      // Navigate to data steward dashboard
      cy.get('#profileDropdown').click();
      cy.get('.dropdown-item').contains('Pending Products').click();
      cy.wait(2000);
    });

    it('should display product review cards if products exist', () => {
      // Check if products exist
      cy.get('body').then($body => {
        if ($body.find('.review-card').length > 0) {
          // Verify product review card structure
          cy.get('.review-card').first().within(() => {
            cy.get('.review-card-title').should('be.visible');
            cy.get('.review-content').should('be.visible');
            cy.get('.review-detail-label').contains('Price:').should('be.visible');
            cy.get('.review-detail-label').contains('Category:').should('be.visible');
            cy.get('.review-detail-label').contains('Supplier:').should('be.visible');
            cy.get('.review-status-badge').should('contain', 'Pending Review');
            cy.get('.steward-note-input').should('be.visible');
            cy.get('.steward-btn-approve').should('contain', 'Approve');
            cy.get('.steward-btn-reject').should('contain', 'Reject');
          });
        } else {
          cy.get('.steward-info').should('be.visible');
        }
      });
    });

    it('should approve a product successfully', () => {
      // Check if there are products to review
      cy.get('body').then($body => {
        if ($body.find('.review-card').length > 0) {
          cy.get('.review-card').first().within(() => {
            cy.get('.review-card-title').invoke('text').then((productName) => {
              cy.get('.steward-note-input').type('Product looks good and meets all requirements.');
              cy.get('.steward-btn-approve').click();
              cy.wait(2000);
            });
          });
          
          cy.get('.steward-toast-success', { timeout: 10000 }).should('be.visible');
          cy.get('.toast-message').should('contain', 'has been approved successfully');
    
          cy.wait(1000);

        } else {
          cy.log('No products available for review');
        }
      });
    });

    it('should reject a product successfully', () => {
      cy.get('body').then($body => {
        if ($body.find('.review-card').length > 0) {
          cy.get('.review-card').first().within(() => {
            cy.get('.review-card-title').invoke('text').then((productName) => {
              cy.get('.steward-note-input').type('Product does not meet quality standards.');
              
              cy.get('.steward-btn-reject').click();
      
              cy.wait(2000);
            });
          });
          
          cy.get('.steward-toast-success', { timeout: 10000 }).should('be.visible');
          cy.get('.toast-message').should('contain', 'has been rejected');
          
          cy.wait(1000);
        } else {
          cy.log('No products available for review');
        }
      });
    });
  });
});