import { ENDPOINTS } from '../constants'

Cypress.Commands.add('registerProduct', (nome, preco, descricao, quantidade) => {
    return cy.request({
        method: 'POST',
        url: ENDPOINTS.PRODUCTS,
        body: { nome, preco, descricao, quantidade }
    })
})

Cypress.Commands.add('deleteProduct', (id) => {
    return cy.request({
        method: 'DELETE',
        url: ENDPOINTS.PRODUCT(id)
    })
})

Cypress.Commands.add('listAllProducts', () => {
    return cy.request({
        method: 'GET',
        url: ENDPOINTS.PRODUCTS
    })
})
