describe('Auth - Login', () => {
    
    const user = {
        email: 'fulano@qa.com',
        password: 'teste'
    }

    it('Should login succesfully', () => {
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

    it('Should fail login - wrong passworld', () => {
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

    it('Shoudl fail login - wrong user name', () => {
        cy.request({
            method: 'POST',
            url: `${Cypress.config('baseUrl')}/login`,
            body: {
                email: 'fulanoqa.com',
                password: user.password
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('email').includes('email deve ser um email válido')
        })
    })
})