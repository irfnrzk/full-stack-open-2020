describe('Bloglist app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'matti',
      password: 'sekret'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function () {
    cy.contains('login in to application')
  })

  it('login form can be opened', function () {
    cy.contains('login').click()
  })

  it('user can login', function () {
    cy.contains('login').click()
    cy.get('input[name="username"]').type('matti')
    cy.get('input[name="password"]').type('sekret')
    cy.get('button').click()

    cy.contains('Matti Luukkainen logged in')
  })

  it('login fails with wrong password', function () {
    cy.contains('login').click()
    cy.get('input[name="username"]').type('mluukkai')
    cy.get('input[name="password"]').type('wrong')
    cy.get('button').click()

    cy.get('.error').contains('wrong username or password')
  })
})