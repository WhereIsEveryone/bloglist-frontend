describe('Blog app', function() {
  const user1 = {
    name: 'Kimmo Kuusi',
    username: 'KimKuu',
    password: 'WhitePaper'
  }
  const user2 = {
    name: 'Kaija Kuusi',
    username: 'KaiKuu',
    password: 'BlackPaper'
  }
  const blog1 = {
    title: 'Testiblogi',
    author: 'Testikirjoittaja',
    url: 'https://testiblogi.net',
    likes: 0
  }
  const blog2 = {
    title: 'Testiblogi2',
    author: 'Testikirjoittaja2',
    url: 'https://testiblogi2.net',
    likes: 20
  }
  const blog3 = {
    title: 'Testiblogi3',
    author: 'Testikirjoittaja3',
    url: 'https://testiblogi3.net',
    likes: 50
  }

  beforeEach(function() {
    cy.resetDBs()
    cy.newUser(user1)
    cy.newUser(user2)
    cy.visit('')
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
      cy.get('#username-input').type(user1.username)
      cy.get('#password-input').type(user1.password)
      cy.get('#login-button').click()

      cy.contains(`${user1.name} logged in`)
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username-input').type(user1.username)
      cy.get('#password-input').type('Wrong')
      cy.get('#login-button').click()

      cy.get('.notification')
        .should('contain','Väärä käyttäjätunnus ja/tai salasana')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html')
        .should('contain', 'Log in to blog app')
        .and('not.contain', `${user1.username} logged in`)
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: user1.username, password: user1.password })
    })

    it('A blog can be created', function() {
      cy.contains('Luo uusi blogitieto').click()
      cy.get('input[placeholder="Otsikko"]').type(blog1.title)
      cy.get('input[placeholder="Kirjoittaja"]').type(blog1.author)
      cy.get('input[placeholder="Url"]').type(blog1.url)
      cy.contains('Lisää').click()
      cy.contains(blog1.title)
      cy.contains('Laajenna')
    })

    describe('When logged in and blogs exist', function() {
      beforeEach(function() {
        cy.create(blog1)
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

      it('Only logged in user sees the remove button', function() {
        cy.contains('Logout').click()
        cy.login({ username: user2.username, password: user2.password })
        cy.contains('Laajenna').click()
        cy.should('not.contain', 'Poista')
      })

      it('Blogs are arranged by most likes first', function() {
        cy.create(blog2)
        cy.create(blog3)
        cy.get('.blog').eq(0).should('contain', blog3.title)
        cy.get('.blog').eq(1).should('contain', blog2.title)
        cy.get('.blog').eq(2).should('contain', blog1.title)
      })
    })

  })
})