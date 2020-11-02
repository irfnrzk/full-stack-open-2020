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

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('login').click()
      cy.get('input[name="username"]').type('matti')
      cy.get('input[name="password"]').type('sekret')
      cy.get('button').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function () {
      cy.contains('login').click()
      cy.get('input[name="username"]').type('mluukkai')
      cy.get('input[name="password"]').type('wrong')
      cy.get('button').click()

      cy.get('.error').contains('wrong username or password')
    })

    it('notification shown with unsuccessful login is displayed red', function () {
      cy.contains('login').click()
      cy.get('input[name="username"]').type('mluukkai')
      cy.get('input[name="password"]').type('wrong')
      cy.get('button').click()

      cy.get('.error')
        .contains('wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe.only('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'matti', password: 'sekret' })
    })

    it('A blog can be created', function () {
      cy.contains('Matti Luukkainen logged in')
      cy.get('button[name="openCreate"]').click()
      cy.get('input[name="title"]').type('FullStackOpen 2020')
      cy.get('input[name="author"]').type('Matti Luukkaine')
      cy.get('input[name="url"]').type('https://fullstackopen.com/en')
      cy.get('input[name="url"]').parent().parent().find('button').click()
      cy.get('.blog_content')
        .should('have.length', 1)
        .contains('FullStackOpen 2020')
    })

    it.only('Two blogs are created', function () {
      cy.contains('Matti Luukkainen logged in')
      cy.get('button[name="openCreate"]').click()
      cy.get('input[name="title"]').type('FullStackOpen 2019')
      cy.get('input[name="author"]').type('Matti Luukkaine')
      cy.get('input[name="url"]').type('https://fullstackopen.com/en')
      cy.get('input[name="url"]').parent().parent().find('button').click()

      cy.get('button[name="openCreate"]').click()
      cy.get('input[name="title"]').type('FullStackOpen 2020')
      cy.get('input[name="author"]').type('Matti Luukkaine')
      cy.get('input[name="url"]').type('https://fullstackopen.com/en')
      cy.get('input[name="url"]').parent().parent().find('button').click()
      cy.get('.blog_list')
        .children()
        .should('have.length', 2)

      cy.get('.blog_list')
        .find('.blog_content:first-child')
        .contains('FullStackOpen 2019')

      cy.get('.blog_list')
        .find('.blog_content:last-child').as('last-child')
        .contains('FullStackOpen 2020')
        .contains('Matti Luukkaine')
        .find('button[name="toggleView"]').click()

      cy.get('@last-child')
        .contains('https://fullstackopen.com/en')
    })
  })
})

