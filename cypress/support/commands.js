Cypress.Commands.add('resetDBs', () => {
  cy.request(
    'POST', 'http://localhost:3003/api/testing/reset'
  )
})

Cypress.Commands.add('newUser', ({ name, username, password }) => {
  cy.request({
    method: 'POST', url: `${Cypress.env('BACKEND')}/users`, body: { name, username, password }, failOnStatusCode: false
  })
})

Cypress.Commands.add('login', ({ username, password }) => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('BACKEND')}/login`,
      body: { username, password },
      failOnStatusCode: false
    })
      .then(({ body }) => {
          window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(body))
    })
    cy.visit('')
})

Cypress.Commands.add('create', ({ title, author, url, likes }) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('BACKEND')}/blogs`,
    body: { title, author, url, likes },
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBlogAppUser')).token}`
    },
    failOnStatusCode: false
  })
  cy.visit('')
})