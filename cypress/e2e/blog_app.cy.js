describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const user = {
      name: 'Kimmo Kuusi',
      username: 'KimKuu',
      password: 'WhitePaper'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)

    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to blog app')
    cy.contains('username')
    cy.contains('password')
    cy.get('#username-input')
    cy.get('#password-input')
    cy.contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('#username-input').type('KimKuu')
      cy.get('#password-input').type('WhitePaper')
      cy.get('#login-button').click()

      cy.contains('Kimmo Kuusi logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username-input').type('KimKuu')
      cy.get('#password-input').type('Wrong')
      cy.get('#login-button').click()

      cy.get('.notification')
        .should('contain','Väärä käyttäjätunnus ja/tai salasana')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html')
        .should('contain', 'Log in to blog app')
        .and('not.contain', 'Kimmo Kuusi logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('#username-input').type('KimKuu')
      cy.get('#password-input').type('WhitePaper')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('Luo uusi blogitieto').click()
      cy.get('input[placeholder="Otsikko"]').type('Testiblogi')
      cy.get('input[placeholder="Kirjoittaja"]').type('Testikirjoittaja')
      cy.get('input[placeholder="Url"]').type('https://testiblogi.net')
      cy.contains('Lisää').click()
      cy.contains('Testiblogi')
      cy.contains('Laajenna')
    })
  })

  describe('When logged in and blogs exist', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('#username-input').type('KimKuu')
      cy.get('#password-input').type('WhitePaper')
      cy.get('#login-button').click()

      cy.contains('Luo uusi blogitieto').click()
      cy.get('input[placeholder="Otsikko"]').type('Testiblogi')
      cy.get('input[placeholder="Kirjoittaja"]').type('Testikirjoittaja')
      cy.get('input[placeholder="Url"]').type('https://testiblogi.net')
      cy.contains('Lisää').click()
    })

    it('A blog can be liked', function() {
      cy.contains('Laajenna').click()
      cy.contains('Tykkää').click()
      cy.contains('Likes 1')
    })

    it('A blog can be removed', function() {
      cy.contains('Laajenna').click()
      cy.contains('Poista').click()
      cy.should('not.contain', 'Testiblogi')
    })
  })
})