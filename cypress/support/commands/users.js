import { ENDPOINTS } from '../constants'

Cypress.Commands.add('registerUser', (nome, email, password = 'teste', administrador = 'true') => {
    return cy.request({
        method: 'POST',
        url: ENDPOINTS.USERS,
        body: { nome, email, password, administrador }
    })
})

Cypress.Commands.add('deleteUser', (id) => {
    return cy.request({
        method: 'DELETE',
        url: ENDPOINTS.USER(id)
    })
})

Cypress.Commands.add('editUser', (id, nome, email, password, administrador) => {
    return cy.request({
        method: 'PUT',
        url: ENDPOINTS.USER(id),
        failOnStatusCode: false,
        body: { nome, email, password, administrador }
    })
})
