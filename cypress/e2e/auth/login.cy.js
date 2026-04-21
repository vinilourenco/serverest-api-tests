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

    it('Unauthorized - invalid passworld', () => {
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

    it('Should fail login - invalid email', () => {
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

    it('Bad Request - email is blank', () => {
        cy.request({
           method: 'POST',
           url: `${Cypress.config('baseUrl')}/login`,
           body: {
            email: '',
            password: 'teste'
           },
           failOnStatusCode: false 
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('email').includes('email não pode ficar em branco')
        })
    })

    it('Bad Request - password is blank', () => {
        cy.request({
            method: 'POST',
            url: `${Cypress.config('baseUrl')}/login`,
            body: {
              email: 'fulano@qa.com',
              password: ''
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('password').includes('password não pode ficar em branco')
        })
    })

    it('Bad Request - email and password fields are blank', () => {
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

    it.only('Bad Request - Malformed Payload', () => {
        cy.request({
            method: 'POST',
            url: `${Cypress.config('baseUrl')}/login`,
            body: {
                username: 'fulano@qa.com',
                password: 'teste'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body).to.include.all.keys('email', 'username')
                .and.to.satisfy(body => {
                    return body.email.includes('email é obrigatório') && body.username.includes('username não é permitido')
            })
        })
    })
})