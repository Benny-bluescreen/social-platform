beforeEach(() => {
  cy.visit('public/index.html')
})

describe('Login functionality', () => {
  it('should log in with valid credentials', () => {
    cy.intercept('POST', '/login', (req) => {
      console.log('Intercepted login request:', req)
      req.reply({ fixture: 'login.json' })
    }).as('loginRequest')
    cy.get('[data-cy="loginUsername"]').type('validUser')
    cy.get('[data-cy="loginPassword"]').type('validPassword')
    cy.get('[data-cy="submitLogin"]').click()
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200)
    cy.url().should('include', '/dashboard')
  })
})

describe('Change password functionality', () => {
  it('should change password successfully', () => {
    cy.intercept('POST', '/login', (req) => {
      console.log('Intercepted login request:', req)
      req.reply({ fixture: 'login.json' })
    }).as('loginRequest')
    cy.intercept('POST', '/change-password', (req) => {
      console.log('Intercepted change-password request:', req)
      req.reply({ fixture: 'changePassword.json' })
    }).as('changePasswordRequest')

    // Log in first
    cy.get('[data-cy="loginUsername"]').type('validUser')
    cy.get('[data-cy="loginPassword"]').type('validPassword')
    cy.get('[data-cy="submitLogin"]').click()
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200)
    cy.url().should('include', '/dashboard')

    // Change password
    cy.get('#changePasswordBtn').click()
    cy.get('#oldPassword').type('currentPassword')
    cy.get('#newPassword').type('newPassword')
    cy.get('#passwordChangeForm button[type="submit"]').click()
    cy.wait('@changePasswordRequest').its('response.statusCode').should('eq', 200)
    cy.contains('Lösenord ändrat')
  })
})

describe('Register new user functionality', () => {
  it('should register a new user successfully', () => {
    cy.intercept('POST', '/register', (req) => {
      console.log('Intercepted register request:', req)
      req.reply({ fixture: 'register.json' })
    }).as('registerRequest')
    cy.get('[data-cy="regTab"]').click()
    cy.get('[data-cy="regUsername"]').type('newUser')
    cy.get('[data-cy="regPassword"]').type('newPassword')
    cy.get('[data-cy="submitReg"]').click()
    cy.wait('@registerRequest').its('response.statusCode').should('eq', 201)
    cy.contains('Registration successful')
  })
})