import { ENDPOINTS, SEEDED_IDS } from '../../support/constants'
const Chance = require('chance')

describe('User - Delete User', () => {

    const chance = new Chance()
    let randomName
    let randomEmail
    let userId

    beforeEach(() => {
        randomName = chance.name()
        randomEmail = chance.email()
    })

    it('OK - Should return status code 200 when deleting an user', () => {
        cy.registerUser(randomName, randomEmail)
            .then((response) => {
                expect(response.status).to.equal(201)
                userId = response.body._id
            })
        cy.then(() => {
            cy.request({
                method: 'DELETE',
                url: ENDPOINTS.USER(userId)
            }).then((response) => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal('Registro excluído com sucesso')
            })
        })
    })

    it('OK - Should return status code 200 when deleting a non-existent user', () => {
        cy.request({
            method: 'DELETE',
            url: ENDPOINTS.USER(SEEDED_IDS.NON_EXISTENT_USER)
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('message').includes('Nenhum registro excluído')
        })
    })

    it('Bad Request - Should return erro when deleting user with registered cart', () => {
        cy.request({
            method: 'DELETE',
            url: ENDPOINTS.USER(SEEDED_IDS.USER),
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body.message).to.be.a('string').includes('Não é permitido excluir usuário com carrinho cadastrado')
            expect(response.body.idCarrinho).to.be.a('string').and.have.length.greaterThan(0)
        })
    })
})
