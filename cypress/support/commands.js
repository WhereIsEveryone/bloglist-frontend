Cypress.Commands.add('login', ({ username, password }) => {
    cy.request({
      method: 'POST', url: 'http://localhost:3003/api/login', body: { username, password }, failOnStatusCode: false
    })
      .then(({ body }) => {
      localStorage.setItem('loggedBlogappUser', JSON.stringify(body))
      cy.visit('http://localhost:5173')
    })
})