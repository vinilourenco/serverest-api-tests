import { ENDPOINTS } from '../../support/constants'

describe('Auth - Login', () => {

    const user = {
        email: 'fulano@qa.com',
        password: 'teste'
    }

    it('Should login succesfully', () => {
        cy.request({
            method: 'POST',
            url: ENDPOINTS.LOGIN,
            body: {
                email: user.email,
                password: user.password
            }
        }).then((response) => {
            cy.loginSuccess(response)
        })
    })

    it('Unauthorized - invalid password', () => {
        cy.request({
            method: 'POST',
            url: ENDPOINTS.LOGIN,
            body: {
                email: user.email,
                password: 'teste1'
            },
            failOnStatusCode: false
        }).then((response) => {
            cy.loginUnauthorized(response)
        })
    })

    it('Bad Request - invalid email', () => {
        cy.request({
            method: 'POST',
            url: ENDPOINTS.LOGIN,
            body: {
                email: 'fulanoqa.com',
                password: user.password
            },
            failOnStatusCode: false
        }).then((response) => {
            cy.badRequestWithProperty(response, 'email', 'email deve ser um email válido')
        })
    })

    it('Bad Request - email is blank', () => {
        cy.request({
            method: 'POST',
            url: ENDPOINTS.LOGIN,
            body: {
                email: '',
                password: 'teste'
            },
            failOnStatusCode: false
        }).then((response) => {
            cy.badRequestWithProperty(response, 'email', 'email não pode ficar em branco')
        })
    })

    it('Bad Request - password is blank', () => {
        cy.request({
            method: 'POST',
            url: ENDPOINTS.LOGIN,
            body: {
                email: 'fulano@qa.com',
                password: ''
            },
            failOnStatusCode: false
        }).then((response) => {
            cy.badRequestWithProperty(response, 'password', 'password não pode ficar em branco')
        })
    })

    it('Bad Request - email and password fields are blank', () => {
        cy.request({
            method: 'POST',
            url: ENDPOINTS.LOGIN,
            body: {
                email: '',
                password: ''
            },
            failOnStatusCode: false
        }).then((response) => {
            cy.badRequestWithProperty(response, 'email', 'branco')
            cy.badRequestWithProperty(response, 'password', 'branco')
        })
    })

    it('Bad Request - Malformed Payload', () => {
        cy.request({
            method: 'POST',
            url: ENDPOINTS.LOGIN,
            body: {
                username: 'fulano@qa.com',
                password: 'teste'
            },
            failOnStatusCode: false
        }).then((response) => {
            cy.badRequestWithProperty(response, 'email', 'email é obrigatório')
            cy.badRequestWithProperty(response, 'username', 'username não é permitido')
        })
    })
})
