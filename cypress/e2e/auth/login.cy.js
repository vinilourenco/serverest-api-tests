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

    it('Should fail login - wrong user name', () => {
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

    it('Should fail login - email and password fields are blank', () => {
        cy.request({
            method: 'POST',
            url: `${Cypress.config('baseUrl')}/login`,
            body: {
                email: '',
                password: ''
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body).to.include.all.keys('email', 'password')
                .and.to.satisfy(body => {
                    return body.email.includes('branco') && body.password.includes('branco')
                })
        })
    })
})