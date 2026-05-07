// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('registerUser', (nome, email, password = 'teste', administrador = 'true') => {
    return cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/usuarios`,
        body: {
            nome,
            email,
            password,
            administrador
        }
    })
})

Cypress.Commands.add('deleteUser', (id) => {
    return cy.request({
        method: 'DELETE',
        url: `${Cypress.config('baseUrl')}/usuarios/${id}`
    })
})

Cypress.Commands.add('editUser', (id, nome, email, password, administrador) => {
    return cy.request({
        method: 'PUT',
        url: `${Cypress.config('baseUrl')}/usuarios/${id}`,
        body: {
            nome,
            email,
            password,
            administrador   
        }
    })
})

// Assertions
Cypress.Commands.add('editUserSuccess', (response) => {
    expect(response.status).to.equal(200)
    expect(response.body).to.have.property('message').includes('Registro alterado com sucesso')
})