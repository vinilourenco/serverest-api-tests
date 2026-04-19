describe('Auth - Login', () => {
    
    const user = {
        email: 'fulano@qa.com',
        password: 'teste'
    }

    it('should login succesfully', () => {
        cy.request({
            method: 'POST',
            url: `${Cypress.config('baseUrl')}/login`,
            body: {
                email: user.email,
                password: user.password
            }
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.statusText).to.equal('OK');
        })
    })

    it('should fail login', () => {
        cy.request({
            method: 'POST',
            url: `${Cypress.config('baseUrl')}/login`,
            body: {
                email: user.email,
                password: 'teste1'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('message').that.includes('inválidos')
        })
    })
})